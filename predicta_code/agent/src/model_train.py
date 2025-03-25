<<<<<<< HEAD
import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_news(news_text, country):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"You are a financial analyst specializing in {country}. Analyze news for investment implications."},
            {"role": "user", "content": f"Analyze this news for investment opportunities in {country}:\n\n{news_text}"}
        ],
        temperature=0.7,
        max_tokens=500
    )
    return response.choices[0].message.content
=======
from mistralai import Mistral
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

# Initialize the client
api_key = os.getenv("MISTRAL_MODEL") # Get this from Mistral's platform
client = Mistral(api_key=api_key)
print(client)
# Example chat request
response = client.chat.stream(
    model="mistral-tiny",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response)
# model = "mistral-large-latest"
# print(client)
# messages = [
#     {
#         "role": "user",
#         "content": "What is the best French cheese?",
#     },
# ]
# # Or using the new message classes
# # messages = [
# #     UserMessage(content="What is the best French cheese?"),
# # ]

# stream_response = client.chat.stream(
#     model=model,
#     messages=messages,
# )

# for chunk in stream_response:
#     print(chunk.data.choices[0].delta.content)
>>>>>>> 8d0b955ff (ai recommendation working)
