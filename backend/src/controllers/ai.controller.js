import {GoogleGenAI} from "@google/genai";


const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

export const generateReelMeta = async (req, res) => {

    const {foodType, extraHint} = req.body

    if (!foodType) {
        return res.status(400).json({message: "Item name is required"})
    }

const prompt = `Generate a catchy and short title and a short appetizing description for a food reel.
Food name: ${foodType}
Additional details: ${
        extraHint || "No additional details"
    }
Rules:
Title must be under 10 words
Description must be max 20 words
Do not exceed the word limit
Make it engaging, tasty, and social-media friendly
Do not use emojis
Output format strictly as:
Title: <title text>
Description: <description text>`

    const model = 'gemini-3-flash-preview'
    const contents = [{
            role: "user",
            parts: [
                {
                    text: `${prompt}`
                }
            ]
        }]

    const response = await ai.models.generateContent({model, contents})
    const generatedText = response.candidates[0].content.parts[0].text

    res.status(200).json({content: generatedText})
}
