# Importing necessary libraries
import requests
from IPython.display import Audio, display


# Define your ElevenLabs API Key
API_KEY = "sk_4f61bb5b84536366c82662a5aa51b4b1ebd499ed186dda6e"  # Replace this with your actual API key

# Function to generate speech using ElevenLabs API
def generate_audio(text, voice_id="N2lVS1w4EtoT3dr4eOWO", model_id="eleven_monolingual_v1"):
    """
    Generates speech from text using ElevenLabs API.
    
    Parameters:
    text (str): The text to be converted into speech.
    voice_id (str): The ID of the voice to be used.
    model_id (str): The model to be used for generating speech.
    
    Returns:
    Audio: An IPython.display.Audio object that plays the generated speech.
    """
    # Define the API endpoint
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    # Define headers and data for the request
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY,
    }
    
    data = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.75,
            "similarity_boost": 0.85
        }
    }
    
    # Make a POST request to generate audio
    response = requests.post(url, json=data, headers=headers)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Save the audio content to a file
        with open("output_audio.mp3", "wb") as audio_file:
            audio_file.write(response.content)
        print("Audio generated successfully!")
        
        # Return the audio for playback
        return Audio("output_audio.mp3", autoplay=True)
    else:
        print(f"Failed to generate audio. Status Code: {response.status_code}")
        print(response.json())
        return None

# Get user input
text_input = input("Enter the text you want to convert to speech: ")

# Generate and play the audio
audio_output = generate_audio(text_input)
if audio_output:
    display(audio_output)
