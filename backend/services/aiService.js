const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    async generateFix(code, errorMessage, context) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
    You are an expert software engineer.
    
    BROKEN CODE:
    ${code}

    ERROR MESSAGE:
    ${errorMessage}

    CONTEXT:
    ${context || 'No additional context'}

    TASK:
    1. Fix the code to resolve the error.
    2. Explain the fix.
    3. Return ONLY the fixed code block and the explanation in JSON format.

    OUTPUT FORMAT:
    {
      "fixedCode": "string (the complete fixed code)",
      "explanation": "string (markdown explanation)",
      "confidence": number (0-100)
    }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    }
}

module.exports = new AIService();
