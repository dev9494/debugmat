// Quick test script to find working Gemini models
const API_KEY = 'AIzaSyC-2pM1s3bFQw0awxbGf2L63FP8pgrsJmc';

async function testModel(url, name) {
    try {
        const response = await fetch(`${url}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Hello' }] }]
            })
        });

        if (response.ok) {
            console.log(`✅ ${name} WORKS!`);
            return true;
        } else {
            const error = await response.text();
            console.log(`❌ ${name} failed:`, error.substring(0, 100));
            return false;
        }
    } catch (err) {
        console.log(`❌ ${name} error:`, err.message);
        return false;
    }
}

async function main() {
    console.log('Testing Gemini API models...\n');

    const models = [
        { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', name: 'gemini-1.5-pro (v1beta)' },
        { url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent', name: 'gemini-1.5-pro (v1)' },
        { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', name: 'gemini-1.5-flash (v1beta)' },
        { url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', name: 'gemini-1.5-flash (v1)' },
        { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', name: 'gemini-pro (v1beta)' },
        { url: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', name: 'gemini-pro (v1)' },
    ];

    for (const model of models) {
        await testModel(model.url, model.name);
    }

    console.log('\n📋 Fetching models list...');
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        if (response.ok) {
            const data = await response.json();
            console.log('Available models:', data.models?.map(m => m.name).join(', '));
        }
    } catch (err) {
        console.log('Failed to fetch models list');
    }
}

main();
