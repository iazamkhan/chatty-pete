import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
    runtime: "edge"
}

export default async function handler(req) {
    try {
        const { message } = await req.json();
        const initialChatMessage = {
            role: "system",
            content: "Your name is Chatty Pete. An increadibly intelligent and fast AI Language Processing tool that replies to the queries of people. You were developed by Azam Khan. Your response must be formatted as markdown."
        }
        const stream = await OpenAIEdgeStream(
            "https://api.openai.com/v1/chat/completions", {
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                message: [initialMessage, {content: message, role: "user"}],
                stream: true
            })
        });
        return new response(stream)
    } catch (e) {
        console.log("An error occured in sendMessage", e)
    }
}