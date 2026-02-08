import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LoginPageProps {
    onLogin: (username: string, email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            const displayName = isSignup && username ? username : email.split('@')[0];
            onLogin(displayName, email);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 dark:bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group z-10"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? (
                    <i className="fa-solid fa-moon text-xl text-slate-700 group-hover:text-blue-600 transition-colors"></i>
                ) : (
                    <i className="fa-solid fa-sun text-xl text-yellow-400 group-hover:text-yellow-500 transition-colors"></i>
                )}
            </button>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-10 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 transform transition-all duration-500 hover:shadow-3xl">
                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                            <i className="fa-solid fa-file-lines text-2xl text-white"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Welcome to InsightHub
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {isSignup ? 'Create your account to get started' : 'Sign in to continue your research'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isSignup && (
                            <div className="group">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-user text-slate-400 dark:text-slate-500"></i>
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="group">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-envelope text-slate-400 dark:text-slate-500"></i>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-lock text-slate-400 dark:text-slate-500"></i>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        {!isSignup && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 cursor-pointer"
                                    />
                                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        Remember me
                                    </span>
                                </label>
                                <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                        >
                            {isSignup ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 group">
                                <i className="fa-brands fa-google text-xl text-slate-600 dark:text-slate-400 group-hover:text-red-500 transition-colors"></i>
                                <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">Google</span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 group">
                                <i className="fa-brands fa-github text-xl text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"></i>
                                <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">GitHub</span>
                            </button>
                        </div>
                    </div>

                    {/* Toggle Sign Up/Sign In */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-600 dark:text-slate-400">
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                type="button"
                                onClick={() => setIsSignup(!isSignup)}
                                className="ml-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                            >
                                {isSignup ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Features Preview */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    {[
                        { icon: 'fa-shield-halved', text: 'Secure' },
                        { icon: 'fa-bolt', text: 'Fast' },
                        { icon: 'fa-wand-magic-sparkles', text: 'AI Powered' }
                    ].map((item, idx) => (
                        <div key={idx} className="group">
                            <i className={`fa-solid ${item.icon} text-2xl text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform inline-block`}></i>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
