
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/Button'; // Assuming you have a Button component
import { useModal } from '../../context/ModalContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'trader' | 'firm_owner' | 'admin'>('trader'); // Added role state
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null); // Renamed error to errorMsg

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null); // Changed setError to setErrorMsg

        if (!role) {
            showModal({ type: 'warning', title: 'Role Required', message: 'Please select a role to continue.' });
            setLoading(false);
            return;
        }

        try {
            // 1. Sign up the user
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName, // meta data for trigger
                        role: role, // Added role to metadata
                    }
                }
            });

            if (signUpError) throw signUpError;

            if (data.session) {
                navigate('/dashboard');
            } else {
                // Fallback for email confirmation flow
                showModal({
                    type: 'success',
                    title: 'Account Created',
                    message: 'Please check your email for confirmation.',
                    onConfirm: () => navigate('/login')
                });
            }

        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center">
                    <img
                        className="h-24 w-auto drop-shadow-glow"
                        src="http://zainenterprisespakistan.com/wp-content/uploads/2025/12/Untitled-design-28-scaled.png"
                        alt="Prop Match Spot"
                    />
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold text-white tracking-tight">
                    Join Prop Match Spot
                </h2>
                <p className="mt-2 text-center text-sm text-brand-muted">
                    Start your journey to becoming a funded trader
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-brand-surface/80 backdrop-blur-md py-8 px-4 shadow-2xl border border-brand-border rounded-xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-brand-border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50 sm:text-sm bg-brand-charcoal text-white transition-all duration-200"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-brand-border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50 sm:text-sm bg-brand-charcoal text-white transition-all duration-200"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-brand-border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50 sm:text-sm bg-brand-charcoal text-white transition-all duration-200"
                                    placeholder="Choose a strong password"
                                />
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="text-red-400 text-sm bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex items-center">
                                <span className="material-symbols-outlined mr-2 text-lg">error</span>
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-button-glow text-sm font-bold text-brand-black bg-gradient-to-r from-brand-gold to-[#ffd700] hover:from-[#e5a00d] hover:to-[#eec800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    {/* 
                    ========================================
                    PREMIUM FEATURE: Google OAuth Sign-Up
                    Uncomment when client pays for this feature
                    ========================================
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-brand-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-brand-surface text-brand-muted">
                                    Or sign up with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={async () => {
                                    setLoading(true);
                                    const { error } = await supabase.auth.signInWithOAuth({
                                        provider: 'google',
                                        options: {
                                            redirectTo: window.location.origin + '/dashboard'
                                        }
                                    });
                                    if (error) setErrorMsg(error.message);
                                    setLoading(false);
                                }}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-brand-border rounded-lg shadow-sm text-sm font-medium text-white bg-brand-charcoal hover:bg-brand-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-all duration-200"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign up with Google
                            </button>
                        </div>
                    </div>
                    */}

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-brand-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-brand-surface text-brand-muted">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="w-full flex justify-center py-3 px-4 border border-brand-border rounded-lg shadow-sm text-sm font-medium text-brand-gold bg-brand-charcoal hover:bg-brand-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-all duration-200"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center relative z-10">
                <p className="text-sm text-brand-muted">
                    <Link to="/" className="hover:text-brand-gold transition-colors">Back to Home</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
