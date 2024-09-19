import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export default async function answerPrompt(req: string) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: Math.random() * 1.5 + 0.5,
        }
    });
    const result = await model.generateContent(req);
    const response = await result.response;
    return response.text();
}
