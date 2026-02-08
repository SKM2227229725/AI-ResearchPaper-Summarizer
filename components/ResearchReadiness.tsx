import React, { useState } from 'react';
import axios from 'axios';
import ScoreCard from './ScoreCard';
import VerdictBadge from './VerdictBadge';
import { ResearchDocument } from '../types';
import { exportReadinessToPDF } from '../utils/pdfExport';

interface ResearchReadinessProps {
    document: ResearchDocument | null;
    documents: ResearchDocument[];
    onBack: () => void;
    onSelectDoc: (id: string) => void;
}

interface ReadinessScore {
    novelty_score: number;
    technical_depth_score: number;
    experimental_rigor_score: number;
    literature_coverage_score: number;
    publication_readiness_score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    suitable_venues: string[];
    final_verdict: string;
}

const ResearchReadiness: React.FC<ResearchReadinessProps> = ({ document, documents, onBack, onSelectDoc }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ReadinessScore | null>(null);

    const evaluateReadiness = async () => {
        if (!document?.content) {
            setError('No document content available for evaluation.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log('Sending evaluation request to backend...');
            const response = await axios.post('https://researchpapersummizer-backend.onrender.com/api/research-readiness/', {
                text: document.content
            }, {
                timeout: 60000 // 60 second timeout for backend wake-up
            });

            console.log('Backend response received:', response.data);

            // Validate response structure
            if (!response.data) {
                throw new Error('Empty response from backend');
            }

            // Check for required fields
            const requiredFields = ['novelty_score', 'technical_depth_score', 'experimental_rigor_score',
                'literature_coverage_score', 'publication_readiness_score',
                'strengths', 'weaknesses', 'suggestions', 'suitable_venues', 'final_verdict'];

            const missingFields = requiredFields.filter(field => response.data[field] === undefined);
            if (missingFields.length > 0) {
                console.error('Missing fields in backend response:', missingFields);
                throw new Error(`Backend response missing fields: ${missingFields.join(', ')}`);
            }

            setResult(response.data);
            console.log('Results set successfully');
        } catch (err: any) {
            console.error('Research readiness evaluation error:', err);
            console.error('Error details:', {
                code: err.code,
                message: err.message,
                response: err.response?.data
            });

            if (err.code === 'ECONNABORTED') {
                setError('Request timed out. The backend may be waking up (can take 30-60 seconds on first request). Please try again.');
            } else if (err.response) {
                setError(`Backend error (${err.response.status}): ${JSON.stringify(err.response.data)}`);
            } else {
                setError(`Failed to evaluate: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getAverageScore = () => {
        if (!result) return 0;
        return Math.round(
            (result.novelty_score +
                result.technical_depth_score +
                result.experimental_rigor_score +
                result.literature_coverage_score +
                result.publication_readiness_score) / 5
        );
    };

    return (
        <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4 flex-1">
                        <button
                            onClick={onBack}
                            className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-slate-700 dark:text-slate-300"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                AI Research Readiness Evaluation
                            </h1>
                            {/* Document Selector */}
                            {documents.length > 0 ? (
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                        Select Paper to Evaluate
                                    </label>
                                    <select
                                        value={document?.id || ''}
                                        onChange={(e) => {
                                            console.log('Selected document ID:', e.target.value);
                                            onSelectDoc(e.target.value);
                                        }}
                                        className="w-full max-w-md px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">-- Select a paper --</option>
                                        {documents.map((doc) => (
                                            <option key={doc.id} value={doc.id}>
                                                {doc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    No documents available. Please upload a paper first.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Selected Paper Info */}
                {document && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <i className="fa-solid fa-file-pdf text-white text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Selected Paper</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{document.name}</p>
                                </div>
                            </div>
                            {result && (
                                <button
                                    onClick={() => exportReadinessToPDF(document.name, result)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                                    title="Download as PDF"
                                >
                                    <i className="fa-solid fa-file-pdf"></i>
                                    <span>Download PDF</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Evaluate Button */}
                {!result && !isLoading && (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                <i className="fa-solid fa-flask text-4xl text-white"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                Ready to Evaluate Your Research?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                Our AI will analyze your research paper and provide comprehensive feedback on
                                publication readiness, novelty, technical depth, and more.
                            </p>
                            <button
                                onClick={evaluateReadiness}
                                disabled={!document}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <i className="fa-solid fa-sparkles mr-2"></i>
                                Evaluate Research Readiness
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-20">
                        <div className="inline-block">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                                Analyzing your research paper...
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                                This may take a few moments
                            </p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center max-w-2xl mx-auto">
                        <i className="fa-solid fa-circle-exclamation text-4xl text-red-500 mb-4"></i>
                        <h3 className="text-xl font-semibold text-red-900 dark:text-red-300 mb-2">
                            Evaluation Failed
                        </h3>
                        <p className="text-red-700 dark:text-red-400 mb-6">{error}</p>
                        <button
                            onClick={evaluateReadiness}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300"
                        >
                            <i className="fa-solid fa-rotate-right mr-2"></i>
                            Try Again
                        </button>
                    </div>
                )}

                {/* Results Dashboard */}
                {result && !isLoading && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Overall Verdict */}
                        <div className="text-center py-6">
                            <VerdictBadge
                                verdict={result?.final_verdict || 'Unknown'}
                                score={getAverageScore()}
                            />
                        </div>

                        {/* Score Cards Grid */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                                <i className="fa-solid fa-chart-line mr-3 text-blue-600"></i>
                                Detailed Scores
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <ScoreCard
                                    title="Novelty Score"
                                    score={result.novelty_score}
                                    icon="fa-lightbulb"
                                />
                                <ScoreCard
                                    title="Technical Depth"
                                    score={result.technical_depth_score}
                                    icon="fa-microchip"
                                />
                                <ScoreCard
                                    title="Experimental Rigor"
                                    score={result.experimental_rigor_score}
                                    icon="fa-flask"
                                />
                                <ScoreCard
                                    title="Literature Coverage"
                                    score={result.literature_coverage_score}
                                    icon="fa-book"
                                />
                                <ScoreCard
                                    title="Publication Readiness"
                                    score={result.publication_readiness_score}
                                    icon="fa-check-circle"
                                />
                            </div>
                        </div>

                        {/* Feedback Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 border border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                                        <i className="fa-solid fa-thumbs-up text-white"></i>
                                    </div>
                                    Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {result.strengths.map((strength, idx) => (
                                        <li key={idx} className="flex items-start text-slate-700 dark:text-slate-300">
                                            <i className="fa-solid fa-circle-check text-green-500 mr-3 mt-1 flex-shrink-0"></i>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Weaknesses */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 border border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                                        <i className="fa-solid fa-thumbs-down text-white"></i>
                                    </div>
                                    Weaknesses
                                </h3>
                                <ul className="space-y-3">
                                    {result.weaknesses.map((weakness, idx) => (
                                        <li key={idx} className="flex items-start text-slate-700 dark:text-slate-300">
                                            <i className="fa-solid fa-circle-xmark text-red-500 mr-3 mt-1 flex-shrink-0"></i>
                                            <span>{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                                    <i className="fa-solid fa-wand-magic-sparkles text-white"></i>
                                </div>
                                Improvement Suggestions
                            </h3>
                            <ul className="space-y-3">
                                {result.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start text-slate-700 dark:text-slate-300">
                                        <i className="fa-solid fa-arrow-right text-blue-500 mr-3 mt-1 flex-shrink-0"></i>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Suitable Venues */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                    <i className="fa-solid fa-building-columns text-white"></i>
                                </div>
                                Suitable Publication Venues
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {result.suitable_venues.map((venue, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        {venue}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Evaluate Again Button */}
                        <div className="text-center pt-6">
                            <button
                                onClick={evaluateReadiness}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <i className="fa-solid fa-rotate-right mr-2"></i>
                                Evaluate Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearchReadiness;
