from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import openai
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

class ChatMessage(BaseModel):
    message: str
    context: Optional[dict] = None

@router.post("/chat")
async def chat(message: ChatMessage):
    try:
        # Prepare the system message with context about Predicta
        system_message = """You are an AI assistant for Predicta, a platform that provides stock market predictions and analysis.
        You can help users with:
        1. Stock market analysis and predictions
        2. News and market sentiment analysis
        3. General questions about the platform
        4. Technical analysis and trading strategies
        
        Always provide accurate, helpful, and concise responses. If you're not sure about something, say so."""
        
        # Create the chat completion
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": message.message}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return {
            "response": response.choices[0].message.content
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 