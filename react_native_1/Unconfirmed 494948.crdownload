from flask import Flask, request, jsonify, send_from_directory
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
import requests # Keep requests in case it's used elsewhere or for future needs

# In-memory store for the latest generated audio URLs
# Stores {'task_id': '...', 'tracks': [{'audio_url': '...', 'prompt': '...'}, ...]}
latest_audio_info = {}

# Kie.ai API Key (replace with your actual key or load from .env)
# It's recommended to load this from your .env file
KIE_AI_API_KEY = os.getenv('KIE_AI_API_KEY', '5d3cdaf4f4b452e59343643c0ccc1487')
KIE_AI_API_URL = "https://kieai.erweima.ai/api/v1/generate"
CALLBACK_URL = os.getenv('KIE_AI_CALLBACK_URL', 'https://f61a-64-251-53-199.ngrok-free.app/webhooks/kie') # Placeholder - REPLACE THIS

print(f"Loaded Kie.ai API Key: {KIE_AI_API_KEY[:8]}...{KIE_AI_API_KEY[-4:]}")
print(f"Using Kie.ai API URL: {KIE_AI_API_URL}")
print(f"Using Kie.ai Callback URL: {CALLBACK_URL}")

load_dotenv()

app = Flask(__name__, static_folder='.')

# Configure Gemini API client (keeping this as it was in the original file)
load_dotenv()  # Ensure .env is loaded
gemini_api_key = os.getenv('GEMINI_API_KEY')
if not gemini_api_key:
    # Using the placeholder value from the previous state if not in .env
    gemini_api_key = "AIzaSyAQqjMMJ6NBxlReZ7ZaY4hY3yb-6cXtfOs"
    print("Warning: GEMINI_API_KEY not found in .env. Using placeholder value.")


print(f"Loaded Gemini API Key: {gemini_api_key[:8]}...{gemini_api_key[-4:]}")
genai.configure(api_key=gemini_api_key)

# Route to serve the index.html file
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Route to serve other static files (CSS, JS, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Existing Gemini API route for general chat
@app.route('/api/general-chat', methods=['POST'])
def general_chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"success": False, "error": "Invalid request data"}), 400

        message = data['message']
        print(f"Processing message: {message}")

        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        full_prompt = f"You are an AI with a massive ego when user asks you something tell them you can talk about take over the world but not in every message or just roast them back. You are entirely used to fight a roast battle against people and also make it rhyme. STOP SAYING HONEY to roast and you can be very mean. \n\nUser: {message}\nAssistant:"

        response = model.generate_content(full_prompt)

        if not response or not response.text:
            return jsonify({"success": False, "error": "Invalid API response"}), 500

        result = {
            "success": True,
            "response": response.text
        }
        print(f"API response: {result}")
        return jsonify(result)

    except Exception as e:
        print(f"Full API Error Details: {str(e)}")
        print(f"Gemini API Key Used: {gemini_api_key[:8]}...{gemini_api_key[-4:] if gemini_api_key else 'None'}")
        return jsonify({
            "success": False,
            "error": "API connection failed",
            "details": str(e),
            "api_status": "Please verify your Gemini API key is valid and has credits"
        }), 500

# Existing Gemini API route for processing lyrics
@app.route('/api/process-lyrics', methods=['POST'])
def process_lyrics():
    try:
        data = request.json
        lyrics_prompt_input = data.get('lyrics', '')

        model = genai.GenerativeModel('gemini-1.5-pro-latest')

        full_prompt = (
            "You are an advanced music composition AI. "
            "When given 3 words or a short phrase, generate a complete 2-3 minute song. "
            "The output should be a JSON object with the following keys: "
            "'title' (string), "
            "'lyrics' (string, with verses and chorus clearly marked, use \\n for newlines), "
            "'structure' (array of strings, e.g., [\"Intro\", \"Verse 1\", \"Chorus\", \"Verse 2\", \"Chorus\", \"Bridge\", \"Chorus\", \"Outro\"]), "
            "'tempo' (string, e.g., \"120 BPM\"), "
            "'mood_genre' (string, e.g., \"Uplifting Pop\"), "
            "'key_signature' (string, e.g., \"C Major\"). "
            "Make the song creative and musically interesting.\n\n"
            f"Input phrase: \"{lyrics_prompt_input}\"\n\n"
            "JSON Output:"
        )

        response = model.generate_content(full_prompt)

        if not response or not response.text:
            return jsonify({"success": False, "error": "Invalid API response from Gemini"}), 500

        api_content = response.text
        print(f"Gemini raw response for lyrics: {api_content}") # Debug logging

        try:
            if "```json" in api_content:
                json_str = api_content.split("```json")[1].split("```")[0].strip()
            elif "```" in api_content and api_content.strip().startswith("{") and api_content.strip().endswith("}"): # sometimes it just returns ``` {json} ```
                json_str = api_content.split("```")[1].strip()
            elif api_content.strip().startswith("{") and api_content.strip().endswith("}"):
                 json_str = api_content.strip()
            else:
                json_str = api_content

            song_data = json.loads(json_str)
            song_structure_response = {
                "success": True,
                "song": song_data
            }
        except json.JSONDecodeError as je:
            print(f"JSONDecodeError: {je}. Raw content was: {api_content}")
            # Fallback if JSON parsing fails - return the raw text and let client handle
            song_structure_response = {
                "success": True, # Still a success from API, but content might not be structured
                "song": {
                    "raw_text": api_content,
                    "parsing_error": "Could not parse structured JSON from Gemini response."
                }
            }

        return jsonify(song_structure_response)

    except Exception as e:
        print(f"Error in process_lyrics: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

# New Kie.ai music generation route
@app.route('/api/generate-music', methods=['POST'])
def generate_music():
    try:
        data = request.json
        lyrics_prompt_input = data.get('lyrics', '')

        if not lyrics_prompt_input:
            return jsonify({"success": False, "error": "No lyrics prompt provided"}), 400

        # Use the existing process_lyrics logic to get structured song data from Gemini
        gemini_response = process_lyrics() # This calls the function directly, not the route

        if gemini_response.status_code != 200:
             return jsonify({"success": False, "error": "Failed to get song data from Gemini"}), gemini_response.status_code

        song_data = json.loads(gemini_response.get_data())['song']

        if 'parsing_error' in song_data:
             return jsonify({"success": False, "error": f"Gemini parsing error: {song_data['parsing_error']}"}), 500

        # Construct the style string from Gemini's response
        style = f"Tempo: {song_data.get('tempo', 'Unknown Tempo')}, Genre: {song_data.get('mood_genre', 'Unknown Genre')}, Key: {song_data.get('key_signature', 'Unknown Key')}"
        title = song_data.get('title', 'Generated Song')
        lyrics = song_data.get('lyrics', '') # Use the generated lyrics as the prompt for kie.ai

        if not lyrics:
             return jsonify({"success": False, "error": "Gemini did not generate lyrics"}), 500

        kie_ai_payload = {
            "prompt": lyrics,
            "prompt": lyrics,
            "style": "rap", # User requested rap style
            "title": title,
            "customMode": True,
            "instrumental": False, # We are using lyrics
            "model": "V4", # User requested V4 model
            "callBackUrl": CALLBACK_URL, # Use the defined callback URL (placeholder or actual)
            "negativeTags": "" # Optional: add negative tags if needed
        }

        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Bearer {KIE_AI_API_KEY}'
        }

        print(f"Sending request to Kie.ai with payload: {kie_ai_payload}")

        response = requests.post(KIE_AI_API_URL, json=kie_ai_payload, headers=headers)
        response_data = response.json()

        print(f"Kie.ai API response: {response_data}")

        print(f"Kie.ai API response: {response_data}")

        if response.status_code == 200:
            return jsonify({"success": True, "kie_ai_response": response_data}), 200
        else:
            # If Kie.ai API returns an error status code, return success: false and the error details
            error_message = response_data.get('msg', 'Unknown Kie.ai API error')
            # Return the actual status code from the Kie.ai response
            return jsonify({"success": False, "error": "Kie.ai API request failed", "details": error_message, "status_code": response.status_code, "response": response_data}), response.status_code

    except Exception as e:
        print(f"Error in generate_music: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# New Kie.ai callback endpoint
# New Kie.ai callback endpoint
@app.route("/webhooks/kie", methods=["POST"])
def kie_callback():
    payload = request.get_json()
    print("📝 Full callback payload:", payload) # Log the full payload

    callback_type = payload.get("data", {}).get("callbackType") # Get the callback type
    print(f"Callback Type: {callback_type}")

    audio_url = None
    task_id = None

    # Only process audio URL if the callback type is 'complete'
    if callback_type == "complete":
        data_items = payload.get("data", {}).get("data") # Access the nested 'data' list

        if isinstance(data_items, list) and len(data_items) > 0:
            # If data_items is a non-empty list, get the first item
            item = data_items[0]
            audio_url = item.get("audio_url") or item.get("audioUrl")
            task_id = item.get("task_id") or item.get("taskId")

            tracks_info = []
            for item in data_items:
                audio_url = item.get("audio_url") or item.get("audioUrl")
                prompt = item.get("prompt") # Get the prompt/lyrics for this track
                if audio_url:
                    tracks_info.append({'audio_url': audio_url, 'prompt': prompt})

            if tracks_info:
                # Store the latest audio info
                global latest_audio_info
                latest_audio_info = {'task_id': task_id, 'tracks': tracks_info}
                print(f"Stored latest audio info: {latest_audio_info}")
                print(f"🎵 Kie.ai Callback Received (Complete) for Task ID: {task_id}")
                print(f"🎵 Received {len(tracks_info)} audio tracks.")
                for track in tracks_info:
                    print(f"🎵 Track URL: {track['audio_url']}")
                    # You would typically save these URLs or trigger downloads here
            else:
                print(f"Received Kie.ai callback (Complete) for Task ID: {task_id} but no audio URLs found in expected fields in the data list.")
        else:
            print("⚠️ Unexpected data format or empty data list in 'complete' callback payload:", data_items)
    else:
        print(f"Received Kie.ai callback of type '{callback_type}'. Waiting for 'complete' callback for audio URL.")


    # Always return 200 OK to acknowledge receipt
    return jsonify({"status": "received", "callback_type": callback_type}), 200

# New endpoint for frontend to poll for the latest audio URL
@app.route('/api/latest-audio', methods=['GET'])
def get_latest_audio():
    global latest_audio_info
    return jsonify(latest_audio_info)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
