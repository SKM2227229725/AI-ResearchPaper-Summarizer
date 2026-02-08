import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <i className="fa-solid fa-file-lines text-lg mx-1"></i>
                        </div>
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 dark:text-white">InsightHub</span>
                    </div>

                    <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</a>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110 group"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <i className="fa-solid fa-moon text-slate-700 group-hover:text-blue-600 transition-colors"></i>
                            ) : (
                                <i className="fa-solid fa-sun text-yellow-400 group-hover:text-yellow-500 transition-colors"></i>
                            )}
                        </button>

                        <button
                            onClick={onStart}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 container mx-auto text-center">
                <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>AI-Powered Research Assistant</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                    Summarize Research Papers<br />
                    <span className="text-blue-600 dark:text-blue-400">in Seconds</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
                    Upload your academic papers and get instant AI-generated summaries, key insights, and semantic search across all your documents.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16 px-4">
                    <button
                        onClick={onStart}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Get Started Free <i className="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                    <button
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        See Demo
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 px-4">
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-cloud-arrow-up text-blue-500 dark:text-blue-400"></i>
                        <span>Drag & Drop Upload</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-magnifying-glass text-blue-500 dark:text-blue-400"></i>
                        <span>Semantic Search</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-wand-magic-sparkles text-blue-500 dark:text-blue-400"></i>
                        <span>AI Summaries</span>
                    </div>
                </div>
            </header>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-12 sm:py-20 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">How It Works</h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 px-4">Get started in minutes with our simple four-step process.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[28%] left-[10%] right-[10%] h-[2px] bg-slate-200 dark:bg-slate-700 -z-0"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative z-10">
                            {[
                                { step: '01', icon: 'fa-cloud-arrow-up', title: 'Upload Your Paper', desc: "Drag and drop your PDF research paper or click to browse. We'll handle the rest." },
                                { step: '02', icon: 'fa-microchip', title: 'AI Processing', desc: 'Our AI analyzes your paper, extracting key information and generating summaries.' },
                                { step: '03', icon: 'fa-file-circle-check', title: 'Get Insights', desc: 'View comprehensive summaries, key findings, methodology, and conclusions.' },
                                { step: '04', icon: 'fa-comments', title: 'Ask Questions', desc: 'Chat with our AI to dive deeper into any aspect of your research papers.' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center group">
                                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 sm:mb-6 relative hover:-translate-y-2 transition-all duration-300">
                                        <div className="absolute -top-3 -right-3 w-7 sm:w-8 h-7 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-50 dark:border-slate-900">
                                            {item.step}
                                        </div>
                                        <i className={`fa-solid ${item.icon} text-xl sm:text-2xl text-blue-600 dark:text-blue-400`}></i>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">{item.title}</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-12 sm:py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">Everything You Need for Research</h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto px-4">Powerful features designed to help you understand and organize academic papers efficiently.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { icon: 'fa-cloud-arrow-up', title: 'Easy Upload', desc: 'Simply drag and drop your research papers. We support PDF files up to 10MB with instant processing.' },
                            { icon: 'fa-file-lines', title: 'Smart Summarizer', desc: 'Get concise, accurate summaries of your research papers powered by advanced AI technology.' },
                            { icon: 'fa-lightbulb', title: 'Key Insights', desc: 'Automatically extract methodology, findings, and conclusions from your uploaded papers.' },
                            { icon: 'fa-magnifying-glass', title: 'Semantic Search', desc: 'Find exactly what you answer with meaning, not just keywords across all documents.' },
                            { icon: 'fa-comments', title: 'Chat with AI', desc: 'Ask questions in English, Hindi, or Marathi and get voice responses from your personal research assistant.' },
                            { icon: 'fa-table-columns', title: 'Dashboard', desc: 'Organize and manage all your research documents in one clean, intuitive interface.' },
                        ].map((feat, idx) => (
                            <div key={idx} className="p-6 sm:p-8 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 group bg-white dark:bg-slate-800">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-lg sm:text-xl group-hover:scale-110 transition-transform">
                                    <i className={`fa-solid ${feat.icon}`}></i>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">{feat.title}</h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {feat.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24 bg-slate-900 dark:bg-slate-950 text-white text-center transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Ready to Transform Your Research?</h2>
                    <p className="text-slate-400 dark:text-slate-500 mb-8 sm:mb-10 max-w-2xl mx-auto text-base sm:text-lg px-4">
                        Join thousands of researchers who save hours every week with InsightHub. Start for free, no credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
                        >
                            Start Free Trial <i className="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                        <button
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-slate-700 dark:border-slate-600 text-white font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-800 pt-12 sm:pt-16 pb-6 sm:pb-8 border-t border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                                    <i className="fa-solid fa-file-lines text-sm mx-1"></i>
                                </div>
                                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 dark:text-white">InsightHub</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                                AI-powered research paper analysis for academics and professionals.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">API</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Changelog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Documentation</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Community</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <div className="mb-3 md:mb-0">&copy; 2024 InsightHub Inc. All rights reserved.</div>
                        <div className="flex space-x-4 sm:space-x-6">
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><i className="fa-brands fa-twitter"></i></a>
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><i className="fa-brands fa-github"></i></a>
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><i className="fa-brands fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
