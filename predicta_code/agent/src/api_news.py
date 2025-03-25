import requests
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

# Your NewsAPI key
api_key = '36bee74a3fce488daac72f84201183cb'  # Replace with your actual API key

# Base URL for the API
url = 'https://newsapi.org/v2/everything'

# Define the parameters for the API request
params = {
    'q': 'Nairobi Stock Exchange OR Kenya OR Nairobi OR Kenyan President OR Trump',  # Keywords
    'sortBy': 'publishedAt',  # Sort by latest news
    'language': 'en',  # Language of the articles
    'pageSize': 10,  # Number of articles per request
    'apiKey': api_key
}

# Make the request
response = requests.get(url, params=params)

def get_news_articles():
    """
    Fetch news articles from the NewsAPI
    """
    try:
        # Check for a successful request
        if response.status_code == 200:
            articles = response.json().get('articles')
            if articles:
                
                for i, article in enumerate(articles, 1):
                    title = article['title']
                    source = article['source']['name']
                    url = article['url']

            else:
                print("No articles found for the given query.")
        else:
            print(f"Failed to fetch news articles. Status Code: {response.status_code}")

        return articles
    except Exception as e:
        print(f"An error occurred: {e}")
        
