import React, { useState, useEffect, useRef } from 'react';
import { ResearchDocument } from '../types';


interface ChatPageProps {
    documents: ResearchDocument[];
    selectedDocId: string | null;
    onSelectDoc: (id: string) => void;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
}

const LANGUAGES = [
    { code: 'en-US', label: 'English' },
    { code: 'hi-IN', label: 'Hindi' },
    { code: 'mr-IN', label: 'Marathi' },
    { code: 'hinglish', label: 'Hinglish' }
];

const ChatPage: React.FC<ChatPageProps> = ({ documents, selectedDocId, onSelectDoc }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const selectedDoc = documents.find(d => d.id === selectedDocId);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 'init',
                role: 'assistant',
                text: "Namaste! I am your AI Research Assistant. Select a document and ask me anything in English, Hindi, or Marathi.",
                timestamp: new Date()
            }]);
        }
    }, []);

    const handleSpeak = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser. Try Chrome.");
            return;
        }

        if (isListening) {
            // Stop logic if needed, but usually we just let it finish one sentence
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();

        // Set language for recognition
        recognition.lang = selectedLang === 'hinglish' ? 'hi-IN' : selectedLang;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };

        recognition.start();
    };

    const speakText = (text: string) => {
        if (!('speechSynthesis' in window)) return;

        // Simple language detection or use selected 
        // Usually if response is Hindi, we want a Hindi voice
        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find a matching voice
        const voices = window.speechSynthesis.getVoices();
        let langCode = selectedLang === 'hinglish' ? 'hi-IN' : selectedLang;



        const voice = voices.find(v => v.lang.includes(langCode.split('-')[0]));
        if (voice) utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        if (!selectedDoc) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                text: "Please select a document from the sidebar to start chatting.",
                timestamp: new Date()
            }]);
            return;
        }

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const prompt = `
                You are an intelligent research assistant.
                User Language Preference: ${selectedLang}
                
                Context Document:
                Title: ${selectedDoc.name}
                Content Snippet (first 20000 chars): 
                ${selectedDoc.content.substring(0, 20000)}...
                
                User Question: ${userMsg.text}
                
                Instructions:
                1. Answer based ONLY on the provided context if possible.
                2. If the user asks in Hindi/Marathi, reply in that language.
                3. If 'Hinglish' is selected, reply in a mix of Hindi and English.
                4. Be concise and accurate.
            `;

            const response = await fetch("https://researchpapersummizer-backend.onrender.com/api/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "messages": [
                        { "role": "user", "content": prompt }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                throw new Error(errorData.error || `Server Error: ${response.status}`);
            }

            const data = await response.json();
            const text = data.response || "No response generated.";

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: text,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
            speakText(text);

        } catch (error: any) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: `Sorry, I encountered an error: ${error.message || "Unknown error"}. Please check your connection and API key.`,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full bg-slate-50">
            {/* Document Sidebar for Chat */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="p-4 border-b border-slate-100 font-bold text-slate-700">
                    Documents
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {documents.map(doc => (
                        <button
                            key={doc.id}
                            onClick={() => onSelectDoc(doc.id)}
                            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${selectedDocId === doc.id
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'hover:bg-slate-100 text-slate-600'
                                }`}
                        >
                            <div className="font-medium truncate">{doc.name}</div>
                            <div className="text-xs text-slate-400 mt-1">
                                {(doc.content.length / 1000).toFixed(1)}k chars
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
                    <div>
                        <h2 className="font-bold text-slate-800">
                            {selectedDoc ? `Chatting about: ${selectedDoc.name}` : "Select a document to start"}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <select
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value)}
                            className="text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
                                <div className={`text-[10px] mt-2 opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-slate-200 p-4">
                    <div className="flex items-center space-x-2 max-w-4xl mx-auto">
                        <button
                            onClick={handleSpeak}
                            className={`p-3 rounded-full transition-colors ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? "Listening..." : "Ask a question about the paper..."}
                            className="flex-1 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            disabled={isLoading}
                        />

                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
