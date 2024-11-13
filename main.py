#video get_video()
import torch
from diffusers import AnimateDiffPipeline, LCMScheduler, MotionAdapter
from diffusers.utils import export_to_video


#audio microsoft get_voice
from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
from datasets import load_dataset
import torch
import soundfile as sf
from datasets import load_dataset

#image 
from diffusers import StableDiffusionPipeline, EulerDiscreteScheduler

#Text
from langchain_ollama import OllamaLLM

#Flask
from flask import Flask, request, jsonify
from flask_cors import CORS


#https://huggingface.co/wangfuyun/AnimateLCM
def get_video(prompt, resolution):
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
        num_frames=24,
        guidance_scale=2.0,
        num_inference_steps=6,
        generator=torch.Generator("cpu").manual_seed(0),
    )
    frames = output.frames[0]
    frames = frames.resize(resolution)
    export_to_video(frames, "output.mp4")

#https://huggingface.co/microsoft/speecht5_tts
def get_voice(prompt):
    # Load processor, model, and vocoder
    processor = SpeechT5Processor.from_pretrained("microsoft/speecht5_tts")
    model = SpeechT5ForTextToSpeech.from_pretrained("microsoft/speecht5_tts")
    vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan")

    # Process the input prompt
    inputs = processor(text=prompt, return_tensors="pt")

    # Load xvector containing speaker's voice characteristics from a dataset
    embeddings_dataset = load_dataset("Matthijs/cmu-arctic-xvectors", split="validation")
    speaker_embedding = torch.tensor(embeddings_dataset[0]["xvector"]).unsqueeze(0)  # Use a valid index to get an appropriate speaker embedding

    # Generate speech using the model, inputs, and speaker embedding
    speech = model.generate_speech(inputs["input_ids"], speaker_embedding, vocoder=vocoder)

    # Save the generated speech to a .wav file
    sf.write("speech.wav", speech.numpy(), samplerate=16000)

def get_image(prompt, resolution):
    model_id = "CompVis/stable-diffusion-v1-4"

    # Use the Euler scheduler here instead
    scheduler = EulerDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")
    pipe = StableDiffusionPipeline.from_pretrained(model_id, scheduler=scheduler, torch_dtype=torch.float16)
    pipe = pipe.to("cuda")

    prompt = prompt
    image = pipe(prompt).images[0]  
    image = image.resize(resolution)
    image.save("output_image.png")


llm = OllamaLLM(model="llama3.2:3b")

def idea_improver(idea, style, add_info):
    prompt = f"""
    
    Grammar check and improve the idea:{idea}. make sure it includes stlye {style} of the content it is going to generate.  While creating an idea return 1 improved statement and nothing else besides it. 
    
    Here is additional information and instructions given from the user: {add_info}
    
    """

    response = llm(prompt)
    return response

def prompt_gen(style, types, idea, add_info):

    if types == "video" or types == "image":
        return idea_improver(idea, style, add_info)

    else:

        prompt = f"""


        You are a agent that is generating prompts for generative AI models to create marketing material for social media. The idea for this prompt is {idea}

        Create a prompt for type: {types}. While creating a prompt return the prompt only and nothing else besides it and only for {types}. 

        your response should start as follow: 'Create a {types}........'

        Here is additional information and instructions given from the user: {add_info}

        Depending on the type here are some additional instructions. Follow the additional instruction only for type {types}:

        1. For script make the script sound professional and sound like high quality marketing material.This include reference to the video/image and audio. Be professional. This has to be longer. End of Script Video intructions 
        2. For audio make the sure the speech is in narration format. Make it under 100 tokens. End of Type speech intructions

        

        """
        response = llm(prompt)
        return response
    

def get_script(prompt):

    return llm(prompt)



def control_center(prompt, platform, types):
    resolution_sizes = {
        "Instagram Reel": (1080, 1920),    # 9:16 aspect ratio
        "Instagram Post": (1080, 1080),    # 1:1 aspect ratio
        "X Post": (1200, 675),             # 16:9 aspect ratio
        "Tik Tok": (1080, 1920)        # 9:16 aspect ratio
    }
    
    if platform in resolution_sizes:
        platform_resolution = resolution_sizes[platform]
    else:
        platform_resolution = None
    
    if types == "video":
        return get_video(prompt, platform_resolution)
    
    if types == "image":
        return get_image(prompt, platform_resolution)

    if types == "audio":
        return get_voice(prompt)
    
    if types == "script":
        return get_script(prompt)



# Flask connection

app = Flask(__name__)
CORS(app)

# Flask route for generating the prompt
@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    data = request.get_json()
    style = data.get('style')
    types = data.get('types')
    idea = data.get('idea')
    add_info = data.get('add_info')
    
    # Call prompt_gen function with provided data
    prompt = prompt_gen(style, types, idea, add_info)
    return jsonify({"prompt": prompt})


# Flask route for generating content
@app.route('/generate-content', methods=['POST'])
def generate_content():
    data = request.get_json()
    prompt = data.get('prompt')
    platform = data.get('platform')
    types = data.get('types')
    
    # Call control_center function with provided data
    result = control_center(prompt, platform, types)
    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
