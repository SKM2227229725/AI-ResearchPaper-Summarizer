
import os
import json
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import dotenv
from .readiness_service import evaluate_research_readiness

dotenv.load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

if not OPENROUTER_API_KEY:
    print("Warning: OPENROUTER_API_KEY not found in environment variables.")

def call_openrouter_api(prompt, json_response=False):
    if not OPENROUTER_API_KEY:
         raise Exception("OpenRouter API key not configured")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Research Insight Hub",
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

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

    if response.status_code != 200:
        # Check for 401 specifically to enable fallback/demo mode if needed
        if response.status_code == 401:
             print("OpenRouter API 401 Error: Invalid Key. returning None to trigger fallback.")
             return None
        raise Exception(f"OpenRouter API failed: {response.text}")

    data = response.json()
    content = data['choices'][0]['message']['content']

    if json_response:
        # Clean up potential markdown code blocks
        content = content.replace('```json', '').replace('```', '').strip()
        return json.loads(content)
    
    return content

class SummaryView(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            prompt = f"""Analyze the following research paper text and provide a structured summary.
            Return JSON format only. The JSON must have the following keys:
            - abstract: (string) The abstract of the paper.
            - findings: (array of strings) Key findings.
            - methodology: (string) The methodology used.
            - limitations: (string) Any limitations mentioned.

            Do not hallucinate. Use academic tone.
            
            Text: {text[:30000]}"""
            
            result = call_openrouter_api(prompt, json_response=True)
            
            if result is None:
                # Fallback Mock Data
                result = {
                    "abstract": "⚠️ DEMO MODE: The API key provided is invalid (401 Unauthorized). This is a simulated summary to demonstrate the UI layout. The actual paper content was not processed by AI.",
                    "findings": [
                        "Finding 1: The application handles API errors gracefully.",
                        "Finding 2: UI components render correctly even with mock data.",
                        "Finding 3: User needs to update the OpenRouter API key in .env file."
                    ],
                    "methodology": "Simulated response generation for testing purposes.",
                    "limitations": "No actual AI analysis performed."
                }
                
            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InsightView(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            prompt = f"""Extract deep technical insights from this research paper. 
            Focus on specific objectives, key concepts, results, and ultimate conclusions.
            Return JSON format only. The JSON must have the following keys:
            - keyConcepts: (array of strings) Not just keywords, but actual concepts.
            - objectives: (array of strings) The goals of the paper.
            - results: (array of strings) The direct results.
            - conclusions: (array of strings) The conclusions drawn.
            
            Text: {text[:30000]}"""
            
            result = call_openrouter_api(prompt, json_response=True)
            
            if result is None:
                # Fallback Mock Data
                result = {
                    "keyConcepts": ["Error Handling", "UI Testing", "API Configuration"],
                    "objectives": ["Demonstrate system resilience", "Guide user to fix configuration"],
                    "results": ["System is operational in demo mode", "Layout verification successful"],
                    "conclusions": ["The application is functioning, but requires a valid API key for real AI insights."]
                }

            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SearchView(APIView):
    def post(self, request):
        query = request.data.get('query', '')
        if not query:
             return Response({'error': 'No query provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
             prompt = f"""Based on the user query "{query}", generate a simulated search response 
             that looks like it came from a semantic search of research papers.
             Provide a direct answer based on general knowledge about the potential topic.
             """
             
             result = call_openrouter_api(prompt, json_response=False)
             
             if result is None:
                 result = f"⚠️ DEMO SEARCH: We couldn't reach the AI to answer '{query}' because the API key is invalid. Please check your .env file."
                 
             return Response({'answer': result})
        except Exception as e:
             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatView(APIView):
    def post(self, request):
        messages = request.data.get('messages', [])
        if not messages:
            return Response({'error': 'No messages provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            last_message = messages[-1].get('content', '')
            
            result = call_openrouter_api(last_message, json_response=False)
            
            if result is None:
                result = "I'm sorry, but I cannot process your request right now because the OpenRouter API Key is invalid. I am running in Demo Mode. Please update the key in your .env file."

            return Response({'response': result})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResearchReadinessView(APIView):
    """
    API endpoint for evaluating research paper readiness.
    
    POST /api/research-readiness/
    
    Accepts research paper text and returns comprehensive evaluation scores
    including novelty, technical depth, experimental rigor, literature coverage,
    and publication readiness along with detailed feedback.
    """
    def post(self, request):
        text = request.data.get('text', '')
        
        # Validate input
        if not text:
            return Response(
                {'error': 'No text provided. Please include research paper text in the request.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(text.strip()) < 100:
            return Response(
                {'error': 'Text too short. Please provide a complete research paper for evaluation.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Call readiness evaluation service
            result = evaluate_research_readiness(text)
            
            # Handle fallback for invalid API key
            if result is None:
                # Return demo/fallback response
                result = {
                    "novelty_score": 75,
                    "technical_depth_score": 70,
                    "experimental_rigor_score": 65,
                    "literature_coverage_score": 68,
                    "publication_readiness_score": 72,
                    "strengths": [
                        "⚠️ DEMO MODE: API key is invalid (401 Unauthorized)",
                        "This is a simulated evaluation to demonstrate the response structure",
                        "Please update OPENROUTER_API_KEY in your .env file"
                    ],
                    "weaknesses": [
                        "No actual AI analysis performed",
                        "Scores are placeholder values"
                    ],
                    "suggestions": [
                        "Configure valid OpenRouter API key",
                        "Retry the request after updating credentials"
                    ],
                    "suitable_venues": [
                        "Demo Venue 1",
                        "Demo Venue 2"
                    ],
                    "final_verdict": "Not Ready"
                }
            
            return Response(result, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Evaluation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
