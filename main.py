# Required Imports
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from io import BytesIO
import requests
from diffusers import AnimateDiffPipeline, LCMScheduler, MotionAdapter, StableDiffusionPipeline, EulerDiscreteScheduler
from diffusers.utils import export_to_video
from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
from datasets import load_dataset
from langchain_ollama import OllamaLLM

# video get_video()
import torch
from diffusers import AnimateDiffPipeline, LCMScheduler, MotionAdapter
from diffusers.utils import export_to_video
import imageio
import imageio_ffmpeg

import numpy as np
# audio microsoft get_voice
from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
from datasets import load_dataset
import soundfile as sf
import requests
from io import BytesIO 

# image
from diffusers import StableDiffusionPipeline, EulerDiscreteScheduler

# Text
from langchain_ollama import OllamaLLM

# Flask
from flask import Flask, request, jsonify
from flask_cors import CORS

# other
import os

# Set up save folder
SAVE_FOLDER = os.path.join(os.getcwd(), "./saved_outputs")
os.makedirs(SAVE_FOLDER, exist_ok=True)

# Initialize LLM
llm = OllamaLLM(model="llama3.2:3b")

# Flask App Setup
app = Flask(__name__)
CORS(app)


def get_video(prompt, resolution):
    image_width, image_height = resolution

    adapter = MotionAdapter.from_pretrained("wangfuyun/AnimateLCM", torch_dtype=torch.float16)

    pipe = AnimateDiffPipeline.from_pretrained("emilianJR/epiCRealism", motion_adapter=adapter, torch_dtype=torch.float16)
    pipe.scheduler = LCMScheduler.from_config(pipe.scheduler.config, beta_schedule="linear")
    pipe.load_lora_weights("wangfuyun/AnimateLCM", weight_name="AnimateLCM_sd15_t2v_lora.safetensors", adapter_name="lcm-lora")
    pipe.set_adapters(["lcm-lora"], [0.8])
    pipe.enable_vae_slicing()
    pipe.enable_model_cpu_offload()

    output = pipe(
        prompt=prompt,
        negative_prompt="bad quality, worse quality, low resolution",
        num_frames=3,
        image_width=image_width,
        image_height=image_height,
        guidance_scale=2.0,
        num_inference_steps=12,
        generator=torch.Generator("cpu").manual_seed(0),
    )
    frames = output.frames[0]

    video_stream = BytesIO()

    # Use imageio to write frames to video in BytesIO object
    with imageio.get_writer(video_stream, format='mp4', mode='I', fps=24) as writer:
        for frame in frames:
            writer.append_data(frame)

    # Set the stream position to the start
    video_stream.seek(0)

    return video_stream



# Audio Generation Function
def get_voice(text, filename="audio.mp3"):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/N2lVS1w4EtoT3dr4eOWO"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": "",  # Replace with your API key
    }
    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.75,
            "similarity_boost": 0.85
        }
    }

    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        audio_stream = BytesIO(response.content)
        return audio_stream, "audio/mpeg"
    else:
        raise ValueError(f"Failed to generate audio: {response.status_code}")

def get_image(prompt, resolution):
    model_id = "CompVis/stable-diffusion-v1-4"
    scheduler = EulerDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")
    pipe = StableDiffusionPipeline.from_pretrained(model_id, scheduler=scheduler, torch_dtype=torch.float16)
    pipe = pipe.to("cuda")

    image = pipe(prompt).images[0]
    image_stream = BytesIO()
    image.save(image_stream, format="PNG")
    image_stream.seek(0)
    return image_stream, "image/png"

# Script Generation Function
def get_script(prompt):
    response = prompt
    script_stream = BytesIO(response.encode("utf-8"))
    return script_stream, "text/plain"

def prompt_gen(style, types, idea):
    if types.lower() == "audio":
        prompt = f"""
        Generate a conversational direct speech prompt with no more than 30 words for an audio generation model. 
        Idea/Theme: {idea}.
        Example: "Hello Everyone! Welcome to the Penn State Vs. Maryland Big 10 Game. It is an overcast day here in Happy Valley."
        Provide only the generated speech prompt.
        """
    elif types.lower() == "video":
        prompt = f"""
        Generate a detailed and engaging prompt no more than 20 words for a video generation model.
        Style: {style}.
        Idea/Theme: {idea}.
        Include key visual elements, color palettes, and settings. Provide only the generated prompt.
        """
    elif types.lower() == "image":
        prompt = f"""
        Generate a detailed and visually descriptive prompt no more than 20 words for an image generation model.
        Style: {style}.
        Idea/Theme: {idea}.
        Include visual details like colors, textures, and composition. Provide only the generated prompt.
        """
    elif types.lower() == "only script":
        prompt = f"""
        Generate a well-structured, detailed and engaging script based on the given idea. This script can be long
        Style: {style}.
        Idea/Theme: {idea}.
        Provide only the script content.
        """
    else:
        raise ValueError(f"Unsupported content type: {types}")

    return llm(prompt)




def control_center(prompt, platform, types):
    resolution_sizes = {
        "Instagram Reel": (1080, 1920),
        "Instagram Post": (1080, 1080),
        "X Post": (1200, 675),
        "Tik Tok": (1080, 1920)
    }
    platform_resolution = resolution_sizes.get(platform, (1080, 1080))
    types = types.lower()

    try:
        if types == "video":
            video_content = get_video(prompt, platform_resolution)
            return video_content, "video/mp4"
        elif types == "image":
            return get_image(prompt, platform_resolution)
        elif types == "audio":
            return get_voice(prompt, filename="audio.mp3")
        elif types == "only script":
            return get_script(prompt)
        else:
            raise ValueError(f"Unsupported content type: {types}")
    except Exception as e:
        app.logger.error(f"Error in control_center: {str(e)}")
        return None, "error"



# Flask Route: Generate Prompt
@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    data = request.get_json()
    style = data.get('style')
    types = data.get('types')
    idea = data.get('idea')

    prompt = prompt_gen(style, types, idea)
    return jsonify({"prompt": prompt})

# Flask Route: Generate Content
@app.route('/generate-content', methods=['POST'])
def generate_content():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        platform = data.get('platform')
        types = data.get('types')

        # Get content and MIME type
        content, mime_type = control_center(prompt, platform, types)

        # Check for errors from control_center
        if mime_type == "error" or content is None:
            raise ValueError(f"Content generation failed for type: {types}")

        # Ensure mime_type is a string before proceeding
        if not isinstance(mime_type, str):
            raise ValueError(f"Unexpected MIME type: {mime_type}")

        # Return generated content file
        return send_file(
            content,
            mimetype=mime_type,
            as_attachment=True,
            download_name=f"{types}_content.{mime_type.split('/')[-1]}"
        )
    except Exception as e:
        # Log and return error response
        app.logger.error(f"Error in /generate-content: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)