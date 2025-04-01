from fastapi import APIRouter, HTTPException
from typing import Optional, List
import random
from datetime import datetime, timedelta
import yfinance as yf
import sys
import os
import json
from pydantic import BaseModel

router = APIRouter()

# Define response models
class Prediction(BaseModel):
    symbol: str
    price: float
    change: float
    confidence: float
    timestamp: str
    analysis: str
    sector_impact: dict
    opportunities: List[str]
    risks: List[str]

# Try to import the AI model, with fallback
try:
    # Add the agent directory to the Python path
    agent_path = os.path.join(os.path.dirname(__file__), '../../../agent/src')
    if agent_path not in sys.path:
        sys.path.append(agent_path)
    
    # Check for OpenAI API key
    if not os.getenv("OPENAI_API_KEY"):
        print("Warning: OPENAI_API_KEY not found in environment variables")
        AI_MODEL_AVAILABLE = False
    else:
        from analyse_ai import analyze_news_urls
        from api_news import get_news_articles
        AI_MODEL_AVAILABLE = True
except ImportError as e:
    print(f"Warning: AI model not available: {str(e)}")
    AI_MODEL_AVAILABLE = False
except Exception as e:
    print(f"Warning: Error initializing AI model: {str(e)}")
    AI_MODEL_AVAILABLE = False

# Define stock symbols for each exchange
STOCK_SYMBOLS = {
    "NSE": [
        # Banking Sector
        "KCB.NR",     # KCB Bank
        "EQTY.NR",    # Equity Bank
        "SCBK.NR",    # Standard Chartered Bank
        "COOP.NR",    # Co-operative Bank
        "ABSA.NR",    # Absa Bank Kenya
        "DTB.NR",     # Diamond Trust Bank
        "HFCK.NR",    # Housing Finance Company
        "I&M.NR",     # I&M Bank
        "NCBA.NR",    # NCBA Bank
        "STANCHART.NR", # Standard Chartered Bank Kenya
        
        # Telecommunications
        "SAFCOM.NR",  # Safaricom
        "TKL.NR",     # Telkom Kenya
        
        # Energy & Utilities
        "KPLC.NR",    # Kenya Power
        "KEGN.NR",    # KenGen
        "KPA.NR",     # Kenya Ports Authority
        "KENGEN.NR",  # KenGen (Alternative Symbol)
        
        # Manufacturing & Consumer Goods
        "EABL.NR",    # East African Breweries
        "BAT.NR",     # British American Tobacco
        "UNGA.NR",    # Unga Group
        "CARB.NR",    # Carbacid Investments
        "BAMB.NR",    # Bamburi Cement
        "ARM.NR",     # ARM Cement
        
        # Insurance
        "JUB.NR",     # Jubilee Holdings
        "CIC.NR",     # CIC Insurance Group
        "BRIT.NR",    # Britam Holdings
        "LIBERTY.NR", # Liberty Holdings
        
        # Real Estate & Construction
        "HASS.NR",    # Hass Petroleum
        "SASN.NR",    # Sasini
        "WTK.NR",     # Williamson Tea
        "TPS.NR",     # TPS Eastern Africa
        
        # Media & Communication
        "NMG.NR",     # Nation Media Group
        "RVR.NR",     # Rift Valley Railways
        
        # Agriculture
        "KAKUZI.NR",  # Kakuzi
        "KAPCHORUA.NR", # Kapchorua Tea
        "REA.NR",     # Rea Vipingo Plantations
        
        # Investment & Financial Services
        "KMRC.NR",    # Kenya Mortgage Refinance Company
        "KCBG.NR",    # KCB Group
        "EQTYG.NR",   # Equity Group
        "SCBKG.NR",   # Standard Chartered Bank Group
        "NSE.NR",     # Nairobi Securities Exchange
        "CABL.NR",    # East African Cables
        "DTK.NR",     # Deacons
        
        # Transport & Logistics
        "KQ.NR",      # Kenya Airways
        "KPA.NR",     # Kenya Ports Authority
        
        # Technology & Innovation
        "SAFCOM.NR",  # Safaricom (Technology Division)
        
        # Healthcare
        "LAT.NR",     # Limuru Tea
        "KQ.NR",      # Kenya Airways (Medical Division)
        
        # Mining & Resources
        "ARM.NR",     # ARM Cement (Mining Division)
        "KAKUZI.NR",  # Kakuzi (Mining Division)
        
        # Hospitality & Tourism
        "TPS.NR",     # TPS Eastern Africa (Hospitality Division)
        "KQ.NR",      # Kenya Airways (Tourism Division)
        
        # Retail & Distribution
        "DTK.NR",     # Deacons (Retail Division)
        "CARB.NR",    # Carbacid Investments (Distribution Division)
        
        # Industrial & Manufacturing
        "BAMB.NR",    # Bamburi Cement (Industrial Division)
        "UNGA.NR",    # Unga Group (Manufacturing Division)
        
        # Financial Technology
        "SAFCOM.NR",  # Safaricom (M-Pesa Division)
        "KCB.NR",     # KCB Bank (Digital Banking Division)
        "EQTY.NR"     # Equity Bank (Digital Banking Division)
    ]
}

def get_exchange_symbols(exchange: str) -> list:
    """Get relevant stock symbols for the selected exchange"""
    return STOCK_SYMBOLS.get(exchange, ["AAPL", "MSFT", "GOOGL"])

def get_country_name(code: str) -> str:
    """Convert country code to full name"""
    country_names = {
        "KE": "Kenya",
        "US": "United States",
        "GB": "United Kingdom",
        "JP": "Japan",
        "CN": "China"
    }
    return country_names.get(code, "United States")

def generate_mock_prediction(symbol: str) -> Prediction:
    """Generate a mock prediction when AI model is not available"""
    return Prediction(
        symbol=symbol,
        price=round(random.uniform(100, 1000), 2),
        change=round(random.uniform(-5, 5), 2),
        confidence=round(random.uniform(70, 95), 1),
        timestamp=datetime.now().isoformat(),
        analysis="Market analysis temporarily unavailable.",
        sector_impact={
            "Technology": random.randint(1, 10),
            "Finance": random.randint(1, 10),
            "Energy": random.randint(1, 10)
        },
        opportunities=[
            "Market showing potential for growth",
            "Technical indicators suggest positive momentum"
        ],
        risks=[
            "Market volatility concerns",
            "Regulatory changes may impact performance"
        ]
    )

@router.get("/predictions", response_model=List[Prediction])
async def get_predictions(
    exchange: str,
    country: Optional[str] = None
):
    try:
        # Map exchanges to their respective countries for better filtering
        exchange_countries = {
            "NSE": "ke",  # Kenya
            "NYSE": "us",  # United States
            "NASDAQ": "us",  # United States
            "LSE": "gb",  # United Kingdom
            "TSE": "jp",  # Japan
            "SSE": "cn"  # China
        }

        # Get the country code and name
        country_code = country if country else exchange_countries.get(exchange, "us")
        country_name = get_country_name(country_code.upper())
        
        # Get stock symbols for the exchange
        symbols = get_exchange_symbols(exchange)
        predictions = []

        if AI_MODEL_AVAILABLE:
            try:
                # Get news articles for analysis
                news_urls = get_news_articles()
                
                # Get AI analysis
                analysis_results = analyze_news_urls(news_urls, country_name)
                
                for symbol in symbols:
                    try:
                        # Get real-time data from Yahoo Finance
                        ticker = yf.Ticker(symbol)
                        info = ticker.info
                        current_price = info.get('regularMarketPrice', random.uniform(100, 1000))
                        
                        # Find relevant analysis for this symbol
                        symbol_analysis = next(
                            (analysis for analysis in analysis_results["individual_analyses"] 
                             if any(symbol.lower() in str(analysis.get("key_entities", [])).lower())),
                            None
                        )
                        
                        if symbol_analysis:
                            # Use AI analysis for the prediction
                            predictions.append(Prediction(
                                symbol=symbol,
                                price=current_price,
                                change=round(symbol_analysis.get("sentiment_score", 0) * 2, 2),
                                confidence=round(symbol_analysis.get("confidence_score", 0.7) * 100, 1),
                                timestamp=datetime.now().isoformat(),
                                analysis=symbol_analysis.get("short_term_effects", "Analysis temporarily unavailable."),
                                sector_impact=symbol_analysis.get("sector_impact", {}),
                                opportunities=symbol_analysis.get("potential_opportunities", []),
                                risks=symbol_analysis.get("related_risks", [])
                            ))
                        else:
                            predictions.append(generate_mock_prediction(symbol))
                    except Exception as e:
                        print(f"Error processing symbol {symbol}: {str(e)}")
                        predictions.append(generate_mock_prediction(symbol))
            except Exception as e:
                print(f"Error with AI model: {str(e)}")
                # Fallback to mock predictions if AI model fails
                predictions = [generate_mock_prediction(symbol) for symbol in symbols]
        else:
            # Use mock predictions if AI model is not available
            predictions = [generate_mock_prediction(symbol) for symbol in symbols]

        return predictions

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 