const express = require('express');
const router = express.Router();
const GitHubService = require('../services/githubService');

// Middleware to check auth (mocked for now)
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    req.user = { accessToken: token }; // In real app, verify JWT
    next();
};

// POST /api/github/apply-fix
router.post('/apply-fix', requireAuth, async (req, res) => {
    const { owner, repo, errorId, filePath, fixedCode, description } = req.body;

    if (!owner || !repo || !filePath || !fixedCode) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const githubService = new GitHubService(req.user.accessToken);

        const pr = await githubService.createPullRequest({
            owner,
            repo,
            errorId,
            filePath,
            fixedCode,
            description
        });

        res.json({
            success: true,
            prUrl: pr.html_url,
            prNumber: pr.number,
            branch: pr.head.ref
        });

    } catch (error) {
        console.error('Failed to create PR:', error);
        res.status(500).json({ error: 'Failed to create Pull Request', details: error.message });
    }
});

module.exports = router;
