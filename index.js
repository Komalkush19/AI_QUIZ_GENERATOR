import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import readline from 'readline';    

//1 /initialize  gemini
const ai =new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY,

});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//2 make our first api call
async function main() {

    // Get topic from user
    rl.question("Enter the topic for your quiz: ", async (topic) => {

        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',

            // Dynamic user prompt
            contents: `Give me 3 quiz questions about ${topic}`,

            config: {
                systemInstruction:
                    "You are a helpful quiz generator. Create multiple choice quiz questions and give the correct answer at the last.",

                temperature: 0.6,

                responseMimeType: 'application/json',

                responseSchema: {
                    type: 'object',
                    properties: {
                        questions: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    question: { type: 'string' },

                                    options: {type: 'array',items: { type: 'string' }    },

                                    correctAnswer: { type: 'string' },

                                    difficulty: { type: 'string' },

                                    hint: { type: 'string' }
                                },

                                required: [
                                    'question',
                                    'options',
                                    'correctAnswer',
                                    'difficulty'
                                ]
                            }
                        }
                    }
                }
            }
        });

        // Display the response
        const quiz = JSON.parse(response.text);

        quiz.questions.forEach((q, index) => {

            console.log(`\nQuestion ${index + 1}: ${q.question}`);

            q.options.forEach((option, i) => {
                console.log(
                    `Option ${String.fromCharCode(65 + i)}: ${option}`
                );
            });

            console.log(`Correct Answer: ${q.correctAnswer}`);
            console.log(`Difficulty: ${q.difficulty}`);
            console.log("");
        });

        rl.close();
    });
}

main();

