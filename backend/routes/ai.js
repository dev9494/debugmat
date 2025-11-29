const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/generate-fix', async (req, res) => {
    const { code, errorMessage, context } = req.body;

    if (!code || !errorMessage) {
        return res.status(400).json({ error: 'Code and Error Message are required' });
    }

    try {
        const result = await aiService.generateFix(code, errorMessage, context);
        res.json(result);
    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate fix' });
    }
});

module.exports = router;
