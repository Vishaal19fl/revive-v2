
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyC2SyJOubllAJmEFaDvJ-rnDwKJYEUY5os';
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    // We can't easily list models with the SDK in this version without using the REST API directly or if the SDK exposes it.
    // But let's try to fetch the list of models using fetch directly.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Available models:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
