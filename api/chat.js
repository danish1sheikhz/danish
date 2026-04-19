export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).send('Server Error: GEMINI_API_KEY is missing.');
    }

    try {
        // Forward the secure request to Google's Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: context }] }]
            })
        });

        const data = await response.json();
        
        // If the Gemini API returns an error, forward that error status to the frontend
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // Send the response back to your frontend
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}