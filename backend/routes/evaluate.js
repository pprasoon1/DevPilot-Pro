const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyAPYV4Xo4t9CoQG-Amk4f5KgcnuYr7qOGA');

router.post('/', async (req, res) => {
  const { stepDescription, fileTree } = req.body;

  // Convert fileTree to a string
  const code = Object.entries(fileTree)
    .map(([path, content]) => `File: ${path}\n${content}`)
    .join('\n\n');

  const prompt = `
Step Description: ${stepDescription}

User's Code:
${code}

Just tell me if the code is correct or not.
If the code is correct, tell me that the code is correct.
If the code is not correct, tell me the error and how to fix it.
If the code is not correct, tell me the error and how to fix it.
`;

  try {
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();
    
    res.json({ feedback });
  } catch (error) {
    console.error('Error with Google Gemini API:', error);
    res.status(500).json({ message: 'Error evaluating code' });
  }
});


module.exports = router;