from fastapi import APIRouter, HTTPException
from typing import Optional
import requests
from datetime import datetime, timedelta
import json
import os

router = APIRouter()

# You'll need to get an API key from NewsAPI.org
NEWS_API_KEY = "YOUR_NEWS_API_KEY"  # Replace with your actual API key

# Load capital cities data
def load_capital_cities():
    try:
        with open(os.path.join(os.path.dirname(__file__), '../../data/capital_cities.json'), 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

CAPITAL_CITIES = load_capital_cities()

@router.get("/news")
async def get_news(
    exchange: str,
    country: Optional[str] = None
):
    try:
        # Map exchanges to their respective countries for better news filtering
        exchange_countries = {
            "NSE": "ke",  # Kenya
            "NYSE": "us",  # United States
            "NASDAQ": "us",  # United States
            "LSE": "gb",  # United Kingdom
            "TSE": "jp",  # Japan
            "SSE": "cn"  # China
        }

        # Get the country code for the selected exchange
        country_code = country if country != "All" else exchange_countries.get(exchange, "us")
        
        # Get capital city if available
        capital_city = CAPITAL_CITIES.get(country_code, "")
        
        # Calculate date range (last 7 days)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)

        # Construct search query based on selections
        search_terms = [exchange]
        
        if country != "All":
            search_terms.append(country)
            if capital_city:
                search_terms.append(capital_city)
        
        # Add stock market related terms
        search_terms.extend(["stock market", "trading", "investments"])
        
        # Construct the NewsAPI URL
        url = f"https://newsapi.org/v2/everything"
        params = {
            "q": " OR ".join(search_terms),
            "language": "en",
            "from": start_date.strftime("%Y-%m-%d"),
            "to": end_date.strftime("%Y-%m-%d"),
            "sortBy": "publishedAt",
            "pageSize": 10,  # Limit to 10 most relevant articles
            "apiKey": NEWS_API_KEY
        }

        # Make the request to NewsAPI
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch news")

        data = response.json()
        
        # Format the news articles
        formatted_news = []
        for article in data.get("articles", []):
            formatted_news.append({
                "title": article.get("title", ""),
                "description": article.get("description", ""),
                "url": article.get("url", ""),
                "publishedAt": article.get("publishedAt", ""),
                "source": {
                    "name": article.get("source", {}).get("name", "")
                }
            })

        return formatted_news

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 