import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
    runtime: "edge"
}

export const handler = async (req) => {
    try {
        const { message } = await req.json();
        const stream = await OpenAIEdgeStream(
            "https://api.openai.com/v1/chat/completions", {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            method: 'POST',
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                message: [{content: message, role: "user"}],
                stream: true
            })
        });
        return new response(stream)
    } catch (e) {
        console.log("An error occured in sendMessage", e)
    }
}