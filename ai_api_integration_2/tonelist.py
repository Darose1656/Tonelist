from flask import Flask, jsonify
from flask_httpauth import HTTPBasicAuth
import openai
import os
import requests

app = Flask(__name__)
auth = HTTPBasicAuth()

# Environment variables
openai.api_key = os.getenv('OPENAI_API_KEY')
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
USERNAME = os.getenv('API_USERNAME')
PASSWORD = os.getenv('API_PASSWORD')

# Authentication setup
@auth.verify_password
def verify_password(username, password):
    if username == USERNAME and password == PASSWORD:
        return username

def get_weather(city):
    """Get weather data from OpenWeatherMap API"""
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as err:
        raise Exception(f"Weather API Error: {str(err)}")
    except requests.exceptions.RequestException as err:
        raise Exception(f"Network Error: {str(err)}")

def generate_poem(weather_desc):
    """Generate poem using OpenAI API"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "user",
                "content": f"Write a 4-line poem about {weather_desc} in iambic tetrameter"
            }]
        )
        return response.choices[0].message['content'].strip()
    except openai.error.OpenAIError as err:
        raise Exception(f"OpenAI API Error: {str(err)}")

@app.route('/weather-poem/<city>', methods=['GET'])
@auth.login_required
def weather_poem(city):
    try:
        # Get weather data
        weather_data = get_weather(city)
        weather_desc = weather_data['weather'][0]['description']
        
        # Generate poem
        poem = generate_poem(weather_desc)
        
        return jsonify({
            'city': city,
            'temperature': weather_data['main']['temp'],
            'weather': weather_desc,
            'poem': poem
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': f"Failed to generate weather poem for {city}"
        }), 500

if __name__ == '__main__':
    app.run(debug=False)