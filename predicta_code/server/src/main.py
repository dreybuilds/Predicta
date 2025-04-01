from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routes import stock_data, news, predictions
from dotenv import load_dotenv
import os
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
import json
import openai
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with v1 prefix
app.include_router(stock_data.router, prefix="/api/v1", tags=["stock_data"])
app.include_router(news.router, prefix="/api/v1", tags=["news"])
app.include_router(predictions.router, prefix="/api/v1", tags=["predictions"])

@app.get("/")
async def root():
    return {"message": "Welcome to Predicta API"} 