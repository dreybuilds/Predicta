import requests
from bs4 import BeautifulSoup
from openai import OpenAI

import json
from urllib.parse import urlparse
from api_news import get_news_articles

from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_article_text(url):
    """Extract main article text from a URL"""
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Common article text containers
        selectors = ['article', '.article-body', '#main-content', 'div.article']
        for selector in selectors:
            article = soup.select_one(selector)
            if article:
                return ' '.join([p.get_text() for p in article.find_all('p')])

        # Fallback to generic text extraction
        return ' '.join([p.get_text() for p in soup.find_all('p')])
    except Exception as e:
        print(f"Error extracting text from {url}: {str(e)}")
        return None

def analyze_news_urls(urls, country):
    """
    Analyze multiple news URLs for investment opportunities in a specific country
    Returns JSON with analysis of each article and aggregated insights
    """
    results = []

    for url in urls:
        article_text = extract_article_text(url)
        if not article_text:
            continue

        domain = urlparse(url).netloc
        response = client.chat.completions.create(model="gpt-4-1106-preview",  # Use latest model with JSON mode
        messages=[
            {
                "role": "system", 
                "content": f"""You are an AI financial analyst specializing in {country}. 
                    Analyze news articles for investment implications without any preamble.
                    Provide only the JSON output with your analysis."""
            },
            {
                "role": "user",
                "content": f"""Analyze this news article from {domain} for investment implications in {country}:
                    
                    {article_text[:15000]}  # Truncate to avoid token limits
                    
                    Output JSON format with these keys:
                    - source (website domain)
                    - key_entities (companies, people, organizations mentioned)
                    - sector_impact (dictionary of affected sectors with impact scores 1-10)
                    - sentiment_score (-5 to 5)
                    - short_term_effects (1-2 sentence summary)
                    - long_term_effects (1-2 sentence summary)
                    - potential_opportunities (array of specific opportunities)
                    - related_risks (array of potential risks)
                    - confidence_score (0-1)
                    """
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.2)  # More deterministic output

        try:
            analysis = json.loads(response.choices[0].message.content)
            analysis['url'] = url  # Add source URL
            results.append(analysis)
        except json.JSONDecodeError:
            continue

    return generate_aggregated_analysis(results, country)

def generate_aggregated_analysis(individual_analyses, country):
    """Combine multiple analyses into comprehensive recommendations"""
    combined_text = "\n\n".join([json.dumps(a) for a in individual_analyses])

    response = client.chat.completions.create(model="gpt-4-1106-preview",
    messages=[
        {
            "role": "system",
            "content": f"""You are a senior investment strategist analyzing multiple news sources about {country}.
                Synthesize these individual analyses into comprehensive recommendations."""
        },
        {
            "role": "user",
            "content": f"""Combine these {len(individual_analyses)} analyses of {country} news:
                
                {combined_text[:20000]}  # Truncate if needed
                
                Output JSON with:
                - top_3_sectors (most impacted sectors with composite scores)
                - emerging_opportunities (array with confidence scores)
                - critical_risks (array with severity scores)
                - recommended_asset_allocation (dictionary by asset class)
                - market_sentiment (overall -1 to 1 score)
                - key_companies_to_watch (array with reasons)
                - time_horizon_guidance (short/medium/long term outlook)
                """
        }
    ],
    response_format={"type": "json_object"},
    temperature=0.3)

    return {
        "individual_analyses": individual_analyses,
        "aggregated_recommendations": json.loads(response.choices[0].message.content)
    }

# Example usage
if __name__ == "__main__":

    country = "Kenya"
    news_urls = get_news_articles()
    analysis_results = analyze_news_urls(news_urls, country)
    print(json.dumps(analysis_results, indent=2))