import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';    

//1 /initialize  gemini
const ai =new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY,

});
//2 make our first api call
async function main() {
    const response= await ai.models.generateContent({
        model:'gemini-3.1-flash-lite',
        contents:"give me 3 quiz question about machine learning",
        config:{
            systemInstruction:"you are a helpful quiz generator . create  multiple choice quiz question  and give the correct answer at the last",
            temperature:0.6,
            responseMimeType:'application/json',
            responseSchema:{
                type:'object',
                properties:{
                    questions:{
                        type:'array',
                        items:{
                            type:'object',
                            properties:{
                                question:{type:'string'},
                                options:{type:'array',items:{type:'string'}},
                                correctAnswer:{type:'string'},
                                difficulty:{type:'string'},
                                hint:{type:'hint'}

                            },
                            required:['question','options','correctAnswer', 'difficulty']
                        }
                    }
                }
            }

        }

    });
    //display the response
    const quiz= JSON.parse(response.text);
    quiz.questions.forEach((q,index )=> {
        console.log(`Question ${index+1}:${q.question}`);
        q.options.forEach((option,i)=>{
            console.log(`option ${String.fromCharCode(65+i)}:${option}`);
        } );
        console.log(`correctAnswer:${q.correctAnswer}`);
        console.log(`Difficulty:${q.difficulty}`);
        console.log("");

    });  
}

main();

