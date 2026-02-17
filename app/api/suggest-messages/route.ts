import { NextResponse } from "next/server";
import { ai } from "@/app/lib/gemini";

export const runtime = "edge";

export async function POST(_req: Request) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. " +
            "Each question should be separated by '||'. These questions are for an anonymous social messaging platform, " +
            "like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, " +
            "focusing on universal themes that encourage friendly interaction. " +
            "For example: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'";

        // Call Gemini 2.5 Flash model
        const response = await ai.models.generateContent({
            model: "models/gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        // Robust extraction
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        const questions = text.split("||").map(q => q.trim())

        // If still empty, fallback to raw JSON for debugging
        if (!text) {
            console.log("Raw response from Gemini:", JSON.stringify(response, null, 2));
        }

        return NextResponse.json({ questions });
    } catch (error: any) {
        console.error("Gemini error:", error);
        return NextResponse.json(
            { error: "AI generation failed" },
            { status: 500 }
        );
    }
}
