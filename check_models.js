
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = 'AIzaSyC2SyJOubllAJmEFaDvJ-rnDwKJYEUY5os';
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Trying to access gemini-1.5-flash...");
    const result = await model.generateContent("Hello");
    console.log("Success! Response:", result.response.text());
  } catch (error) {
    console.error("Error accessing model:", error.message);
  }
}

listModels();
