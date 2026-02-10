"""
Research Readiness Service

Handles AI-powered research paper evaluation using OpenRouter API.
Provides comprehensive academic assessment across multiple criteria.
"""

import os
import json
import requests
from typing import Dict, Any, Optional
import dotenv

# Load environment variables
dotenv.load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')


def evaluate_research_readiness(text: str, timeout: int = 30) -> Optional[Dict[str, Any]]:
    """
    Evaluate research paper readiness using OpenRouter LLM API.
    
    Args:
        text: Full research paper text to evaluate
        timeout: Request timeout in seconds (default: 30)
        
    Returns:
        Dictionary containing evaluation scores and feedback, or None if API fails
        
    Raises:
        Exception: If API call fails (non-401 errors and non-missing API key)
    """
    if not OPENROUTER_API_KEY:
        print("Warning: OPENROUTER_API_KEY not configured. Returning None for fallback mode.")
        return None
    
    # Construct the evaluation prompt
    prompt = f"""You are an expert research paper reviewer evaluating publication readiness for top-tier academic conferences and journals.

Analyze the following research paper and provide a comprehensive evaluation.

CRITICAL: You MUST return valid JSON with ALL of these fields:

1. novelty_score (integer 0-100): How novel and original is the research?
2. technical_depth_score (integer 0-100): Technical rigor and depth of methodology
3. experimental_rigor_score (integer 0-100): Quality of experiments, data, and validation
4. literature_coverage_score (integer 0-100): Comprehensiveness of related work and citations
5. publication_readiness_score (integer 0-100): Overall readiness for publication
6. strengths (array of strings): 3-5 key strengths of the paper
7. weaknesses (array of strings): 3-5 key weaknesses or areas for improvement
8. suggestions (array of strings): 3-5 specific actionable suggestions for improvement
9. suitable_venues (array of strings): 3-5 appropriate conferences or journals (e.g., "NeurIPS", "ICML", "ICLR", "ACL", "CVPR", "Nature", "Science", etc.)
10. final_verdict (string): One of: "Ready for Publication", "Minor Revisions Needed", "Major Revisions Needed", or "Not Ready"

RESPONSE FORMAT - Return ONLY valid JSON, no markdown, no code blocks:

{{
  "novelty_score": 85,
  "technical_depth_score": 78,
  "experimental_rigor_score": 82,
  "literature_coverage_score": 88,
  "publication_readiness_score": 80,
  "strengths": [
    "Novel approach to problem X",
    "Comprehensive experimental evaluation",
    "Strong theoretical foundation"
  ],
  "weaknesses": [
    "Limited dataset size",
    "Baseline comparisons could be expanded",
    "Some edge cases not addressed"
  ],
  "suggestions": [
    "Expand experiments to additional datasets",
    "Include more recent baseline methods",
    "Add ablation studies for component Y"
  ],
  "suitable_venues": [
    "NeurIPS",
    "ICML",
    "ICLR",
    "JMLR"
  ],
  "final_verdict": "Minor Revisions Needed"
}}

RESEARCH PAPER TEXT:

{text[:30000]}

Remember: Return ONLY the JSON object above with actual analysis. Do NOT include markdown formatting or code blocks."""
    
    # Configure API request
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Research Insight Hub - Readiness Evaluation",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "google/gemini-2.0-flash-001",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    try:
        # Make API request with timeout
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=timeout
        )
        
        # Handle 401 Unauthorized (invalid API key)
        if response.status_code == 401:
            print("OpenRouter API 401 Error: Invalid Key. Returning None for fallback.")
            return None
        
        # Handle other error status codes
        if response.status_code != 200:
            raise Exception(f"OpenRouter API failed with status {response.status_code}: {response.text}")
        
        # Parse response
        data = response.json()
        content = data['choices'][0]['message']['content']
        
        # Clean markdown code blocks if present
        content = content.replace('```json', '').replace('```', '').strip()
        
        # Parse and return JSON
        return json.loads(content)
        
    except requests.exceptions.Timeout:
        raise Exception(f"Request timeout after {timeout} seconds. The research paper may be too long or the API is slow.")
    
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error while calling OpenRouter API: {str(e)}")
    
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse API response as JSON: {str(e)}")
