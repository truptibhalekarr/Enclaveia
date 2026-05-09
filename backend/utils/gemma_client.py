import requests
import json

# This is the default port Ollama runs on locally
OLLAMA_URL = "http://localhost:11434/api/generate"

def get_insight(metadata_json):
    prompt = f"""
    You are an expert BI Data Analyst. Analyze this dataset metadata:
    {metadata_json}
    
    Return a valid JSON object containing exactly two things: 
    1) "kpis": An array of strings representing the 3 most important business KPIs to track based on these columns. 
    2) "insight": A 2-sentence business insight explaining a potential pattern or observation from the summary stats. 
    
    Do not return any conversational text, markdown formatting, or code blocks. Only return the raw JSON object.
    """
    
    payload = {
        "model": "gemma:2b", 
        "prompt": prompt,
        "format": "json", # Forces Ollama to return valid JSON
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        
        # Parse the JSON string returned by Gemma into a Python dictionary
        gemma_output = json.loads(response.json()["response"])
        return gemma_output
    except Exception as e:
        raise Exception(f"AI Generation Error: {str(e)}")