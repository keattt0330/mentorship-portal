// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Beaker } from 'lucide-react';
import Input from './components/Input.jsx';
import Button from './components/Button.jsx';
import { api } from './services/api';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const response = await api.login(formData);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            navigate('/forum');
        } catch (error) {
            setErrors(error.errors || { email: error.message || 'Login failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        // KEY CHANGE: h-screen and overflow-hidden ensures no scrolling
        <div className="h-screen flex bg-white overflow-hidden">
            {/* Left Side - Visual Branding (Identical to Register) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12">
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>
                
                <div className="relative z-10 max-w-lg text-white">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-900/50">
                        <Beaker size={32} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Discover the Future of <span className="text-indigo-400">Science</span>.</h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Join the STEM Portal to collaborate with mentors, track your research, and access world-class resources.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            icon={Mail}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            error={errors.email}
                            placeholder="you@university.edu"
                        />

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                icon={Lock}
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                error={errors.password}
                                placeholder="••••••••"
                            />
                            <div className="flex justify-end -mt-2">
                                <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Sign In'}
                            {!loading && <ArrowRight size={20} />}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-slate-600">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/register')} className="text-indigo-600 font-bold hover:underline">
                            Create free account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}