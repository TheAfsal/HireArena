import axios from "axios";

class GeminiHelper {
  static async generateAptitudeQuestions() {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${"AIzaSyCMRTsmwTxGgizrCRGKuwNclvftHuVsr2g"}`,
        {
          contents: [
            {
              parts: [
                {
                  text: '{id: 1, question: "What is the value of log₁₀(100)?", options: ["1", "2", "10", "100"], correctAnswer: "1"}, {id: 2, question: "What is 5 + 3?", options: ["6", "7", "8", "9"], correctAnswer: "2"}, {id: 3, question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correctAnswer: "2"}, {id: 4, question: "Which element has the chemical symbol \'O\'?", options: ["Oxygen", "Hydrogen", "Carbon", "Nitrogen"], correctAnswer: "0"}, {id: 5, question: "What is the square root of 16?", options: ["2", "3", "4", "5"], correctAnswer: "2"}, {id: 6, question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: "1"}, {id: 7, question: "What is the chemical formula for water?", options: ["H2O", "CO2", "O2", "H2SO4"], correctAnswer: "0"}, {id: 8, question: "Who wrote \'Romeo and Juliet\'?", options: ["Shakespeare", "Dickens", "Hemingway", "Austen"], correctAnswer: "0"}, {id: 9, question: "What is the value of 2^3?", options: ["4", "6", "8", "10"], correctAnswer: "2"}, {id: 10, question: "Which gas do plants absorb for photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correctAnswer: "1"} (the answer should be in string that is the index of correct answer in the options) this is format give 25 questions related to react(js library) and answers like this. dont give anything more i want only this. when i convert your answer to json dont fire any errors',
                },
              ],
            },
          ],
        }
      );

      let generatedText = response.data.candidates[0].content.parts[0].text;

      generatedText = generatedText.replace("```json\n", "");
      generatedText = generatedText.replace("\n```", "");

      const questions = JSON.parse(generatedText);

      return questions;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate aptitude questions.");
    }
  }

  static async generateMachineTask() {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCMRTsmwTxGgizrCRGKuwNclvftHuVsr2g`,
        {
          contents: [
            {
              parts: [
                {
                  text: `{
                    "title": "Build a Responsive Dashboard with React",
                    "description": "Create a feature-rich admin dashboard using React, integrating data visualization and authentication.",
                    "hoursToComplete": 6,
                    "requirements": [
                      "Use React for frontend implementation",
                      "Implement responsive design that works on mobile and desktop",
                      "Include at least 3 different types of data visualization components",
                      "Implement user authentication (can be simulated with mock data)",
                      "Include dark/light mode toggle",
                      "Use a component library of your choice (Material UI, Chakra UI, etc.)",
                      "Implement proper error handling and loading states"
                    ],
                    "evaluationCriteria": [
                      "Code quality and organization",
                      "UI/UX design and responsiveness",
                      "Implementation of all required features",
                      "Performance and optimization",
                      "Error handling and edge cases",
                      "Documentation and code comments"
                    ]
                  } this is are the required data to conduct a machine task. so give a machine task related to nodeJS in the same format(when i convert your response to JSON dont make any errors it should have to follow the structure ), Don't add any unwanted or unrelateble texts`,
                },
              ],
            },
          ],
        }
      );

      let generatedText = response.data.candidates[0].content.parts[0].text;
      generatedText = generatedText
        .replace("```json\n", "")
        .replace("\n```", "");

      const machineTask = JSON.parse(generatedText);

      return machineTask;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate machine task.");
    }
  }

  static async evaluateCode(files: any[]) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCMRTsmwTxGgizrCRGKuwNclvftHuVsr2g`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Evaluate the following project code and return a score (0-100) based on:
                  - Code Quality
                  - Best Practices
                  - Performance
                  - Security
                  - Readability

                  The response should be in JSON:
                  {
                    "score": 85,
                    "details": "Great use of modular architecture, but lacks unit tests."
                  }

                  Files:
                  ${JSON.stringify(files)}
                  `,
                },
              ],
            },
          ],
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(
        generatedText.replace("```json\n", "").replace("\n```", "")
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to evaluate code.");
    }
  }
}

export default GeminiHelper;
