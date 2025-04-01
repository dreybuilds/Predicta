from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict
from datetime import datetime
import random
import os
from dotenv import load_dotenv
from decimal import Decimal
from functools import lru_cache

router = APIRouter()

# Load environment variables
load_dotenv()

# Supported currencies with their display names
SUPPORTED_CURRENCIES = {
    "KES": {
        "name": "Kenyan Shilling",
        "symbol": "KSh",
        "decimals": 2
    },
    "USD": {
        "name": "US Dollar",
        "symbol": "$",
        "decimals": 2
    },
    "EUR": {
        "name": "Euro",
        "symbol": "€",
        "decimals": 2
    },
    "GBP": {
        "name": "British Pound",
        "symbol": "£",
        "decimals": 2
    }
}

# Dummy stock data
DUMMY_STOCKS = [
    {
        "symbol": "SAFCOM.NR",
        "name": "Safaricom",
        "sector": "Telecommunications",
        "currentPrice": 156.25,
        "change": 2.5,
        "volume": 1500000,
        "marketCap": 62500000000
    },
    {
        "symbol": "KCB.NR",
        "name": "KCB Bank",
        "sector": "Banking",
        "currentPrice": 45.80,
        "change": -1.2,
        "volume": 800000,
        "marketCap": 18000000000
    },
    {
        "symbol": "EQTY.NR",
        "name": "Equity Bank",
        "sector": "Banking",
        "currentPrice": 42.30,
        "change": 1.8,
        "volume": 950000,
        "marketCap": 16500000000
    },
    {
        "symbol": "EABL.NR",
        "name": "East African Breweries",
        "sector": "Manufacturing",
        "currentPrice": 185.50,
        "change": 3.2,
        "volume": 600000,
        "marketCap": 14500000000
    },
    {
        "symbol": "KPLC.NR",
        "name": "Kenya Power",
        "sector": "Energy",
        "currentPrice": 2.85,
        "change": -0.5,
        "volume": 2500000,
        "marketCap": 3500000000
    }
]

def format_currency(amount: float, currency: str) -> str:
    """Format amount according to currency rules"""
    if currency not in SUPPORTED_CURRENCIES:
        return f"{amount:.2f}"
    
    currency_info = SUPPORTED_CURRENCIES[currency]
    formatted_amount = f"{amount:.{currency_info['decimals']}f}"
    return f"{currency_info['symbol']}{formatted_amount}"

def convert_currency(amount: float, from_currency: str, to_currency: str) -> float:
    """Convert amount between currencies using dummy rates"""
    if from_currency == to_currency:
        return amount
        
    # Dummy conversion rates
    rates = {
        "USD": 1.0,
        "KES": 0.0064,  # 1 USD = 156.25 KES
        "EUR": 0.93,    # 1 USD = 1.075 EUR
        "GBP": 0.79     # 1 USD = 1.266 GBP
    }
    
    try:
        if from_currency not in rates or to_currency not in rates:
            raise ValueError(f"Unsupported currency: {from_currency} or {to_currency}")
            
        # Convert to USD first, then to target currency
        usd_amount = amount / rates[from_currency]
        return usd_amount * rates[to_currency]
        
    except Exception as e:
        print(f"Currency conversion error: {str(e)}")
        return amount

@router.get("/currencies")
async def get_supported_currencies():
    """Get list of supported currencies with their details"""
    return SUPPORTED_CURRENCIES

@router.get("/stocks")
async def get_stocks(
    sort_by: str = "symbol",
    sort_order: str = "asc",
    search: Optional[str] = None,
    sector: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    """Get stocks with filtering and sorting"""
    try:
        # Start with all stocks
        stocks = DUMMY_STOCKS.copy()
        
        # Apply filters
        if search:
            search = search.lower()
            stocks = [s for s in stocks if 
                     search in s["symbol"].lower() or 
                     search in s["name"].lower()]
        
        if sector:
            stocks = [s for s in stocks if s["sector"].lower() == sector.lower()]
        
        if min_price is not None:
            stocks = [s for s in stocks if s["currentPrice"] >= min_price]
        
        if max_price is not None:
            stocks = [s for s in stocks if s["currentPrice"] <= max_price]
        
        # Apply sorting
        reverse = sort_order.lower() == "desc"
        stocks.sort(key=lambda x: x[sort_by], reverse=reverse)
        
        return stocks
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/top-predictions")
async def get_top_predictions(currency: str = "KES"):
    """Get top predictions with dummy data"""
    try:
        # Validate currency
        if currency not in SUPPORTED_CURRENCIES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported currency. Supported currencies are: {', '.join(SUPPORTED_CURRENCIES.keys())}"
            )
        
        # Generate dummy predictions
        predictions = []
        for stock in DUMMY_STOCKS:
            try:
                # Convert prices to selected currency
                current_price = convert_currency(stock["currentPrice"], "USD", currency)
                market_cap = convert_currency(stock["marketCap"], "USD", currency)
                
                # Generate dummy prediction
                prediction = {
                    "prediction": random.choice(["BULLISH", "BEARISH", "NEUTRAL"]),
                    "confidence": round(random.uniform(0.6, 0.95), 2),
                    "target_price": current_price * random.uniform(0.9, 1.1),
                    "analysis": "Market analysis based on historical data and current trends."
                }
                
                predictions.append({
                    "symbol": stock["symbol"],
                    "name": stock["name"],
                    "currentPrice": current_price,
                    "currentPriceFormatted": format_currency(current_price, currency),
                    "prediction": {
                        **prediction,
                        "target_price_formatted": format_currency(prediction["target_price"], currency)
                    },
                    "sector": stock["sector"],
                    "volume": stock["volume"],
                    "marketCap": market_cap,
                    "marketCapFormatted": format_currency(market_cap, currency)
                })
            except Exception as e:
                print(f"Error processing stock {stock['symbol']}: {str(e)}")
                continue
        
        # Sort by prediction confidence
        predictions.sort(key=lambda x: float(x["prediction"]["confidence"]), reverse=True)
        
        return predictions
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in get_top_predictions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 