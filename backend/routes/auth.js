const express = require('express');
const router = express.Router();

// Mock Auth for Demo
router.post('/login', (req, res) => {
    // In real app: Exchange code for token via GitHub OAuth
    res.json({
        token: 'mock_github_token_12345',
        user: {
            id: 1,
            username: 'demo_user',
            avatar: 'https://github.com/identicons/demo_user.png'
        }
    });
});

module.exports = router;
