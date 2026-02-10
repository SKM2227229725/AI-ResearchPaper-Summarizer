# AI Research Insight Hub

A powerful, full-stack application for managing, summarizing, and querying research papers using advanced AI. This project combines a modern React frontend with a robust Django backend to provide PDF text extraction, AI-powered summarization, technical insight extraction, and semantic search.

## ✨ Features

- **PDF Parsing**: Client-side parsing for speed and privacy.
- **AI Summarization**: Generates structured summaries (Abstract, Findings, Methodology, Limitations).
- **Technical Insights**: Extracts deep technical concepts, objectives, and conclusions.
- **Semantic Search**: Ask natural language questions across your document library.
- **Chat with AI**: Context-aware Q&A with your documents, supporting multiple languages.
- **Voice Interaction**: Native Speech-to-Text and Text-to-Speech capabilities for hands-free research.
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS.

---
*Created by Shailesh Kumar *

## 🛠️ Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Git**

You will also need an **OpenRouter API Key** (Get one from [OpenRouter](https://openrouter.ai/)).

---
## Website Link For the Use :
https://reserachinsigher.netlify.app/

## 🚀 Local Development Guide

Follow these steps to run the application locally on your machine.

### 1. Setup the Backend (Django)

The backend handles AI processing and API requests.

1.  **Navigate to the project root**:
    ```bash
    cd researchpaper_demo
    ```

2.  **Create a virtual environment** (recommended):
    ```bash
    python -m venv venv
    
    # Windows
    .\venv\Scripts\activate
    
    # Mac/Linux
    source venv/bin/activate
    ```

3.  **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables**:
    - Create a `.env` file in the root directory (if it doesn't exist).
    - Add your OpenRouter API key:
      ```env
      OPENROUTER_API_KEY=your_actual_api_key_here
      ```

5.  **Run Database Migrations**:
    ```bash
    python research_backend/manage.py migrate
    ```

6.  **Start the Backend Server**:
    ```bash
    python research_backend/manage.py runserver
    ```
    The backend will start at `http://127.0.0.1:8000/`.

### 2. Setup the Frontend (React + Vite)

The frontend provides the user interface.

1.  **Open a new terminal window** (keep the backend running).

2.  **Navigate to the project root**:
    ```bash
    cd researchpaper_demo
    ```

3.  **Install Node dependencies**:
    ```bash
    npm install
    ```

4.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

5.  **Access the Application**:
    Open your browser and go to the URL shown in the terminal (usually `http://localhost:1000/`).

---

## 📄 License

This project is licensed under the MIT License.
