// Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    User, Mail, Lock, BookOpen, GraduationCap, 
    Users, ArrowRight, CheckCircle2, Beaker 
} from 'lucide-react';
import Input from './components/Input.jsx';
import Button from './components/Button.jsx';
import { api } from './services/api';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', password_confirmation: '', role: 'student', major: ''
    });
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) {
            setErrors({ ...errors, terms: "You must agree to the terms." });
            return;
        }
        setLoading(true);
        setErrors({});

        try {
            const response = await api.register(formData);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            navigate('/dashboard');
        } catch (error) {
            setErrors(error.errors || { email: error.message || 'Registration failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    // Compact Role Button
    const RoleOption = ({ value, label, icon: Icon }) => {
        const isSelected = formData.role === value;
        return (
            <button
                type="button"
                onClick={() => setFormData({ ...formData, role: value })}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all
                    ${isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
            >
                <Icon size={18} />
                <span>{label}</span>
                {isSelected && <CheckCircle2 size={16} />}
            </button>
        );
    };

    return (
        // KEY CHANGE: h-screen and overflow-hidden ensures no scrolling
        <div className="h-screen flex bg-white overflow-hidden">
            
            {/* Left Side - Exact Match to Login */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12">
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>
                
                <div className="relative z-10 max-w-lg text-white">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-900/50">
                        <Beaker size={32} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Start your <span className="text-indigo-400">Journey</span>.</h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Create an account to connect with mentors and access exclusive STEM resources today.
                    </p>
                </div>
            </div>

            {/* Right Side - Form (Compact Mode) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
					<p className="text-sm text-slate-500 text-end">
                        Already a member? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
                    </p>
                    <div className="mb-6 mt-6 text-center lg:text-left">
                        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                        <p className="text-sm text-slate-500">
                            Describe yourself to get a personalized experience.
                        </p>
                    </div>

                    {/* Reduced space-y from 6 to 4 to fit in screen */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Role Selector - Compact Row */}
                        <div className="flex gap-3">
                            <RoleOption value="student" label="Student" icon={GraduationCap} />
                            <RoleOption value="mentor" label="Mentor" icon={Users} />
                        </div>

                        {/* Row 1: Name & Major */}
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Full Name" name="name" icon={User}
                                placeholder="John Doe" value={formData.name}
                                onChange={handleChange} error={errors.name}
                            />
                            <Input
                                label="Major" name="major" icon={BookOpen}
                                placeholder="CS" value={formData.major}
                                onChange={handleChange} error={errors.major}
                            />
                        </div>

                        {/* Row 2: Email (Full Width) */}
                        <Input
                            label="Email Address" type="email" name="email" icon={Mail}
                            placeholder="you@edu.com" value={formData.email}
                            onChange={handleChange} error={errors.email}
                        />

                        {/* Row 3: Passwords */}
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Password" type="password" name="password" icon={Lock}
                                placeholder="••••••" value={formData.password}
                                onChange={handleChange} error={errors.password}
                            />
                            <Input
                                label="Confirm password" type="password" name="password_confirmation" icon={Lock}
                                placeholder="••••••" value={formData.password_confirmation}
                                onChange={handleChange} error={errors.password_confirmation}
                            />
                        </div>

                        {/* Terms - Compact text */}
                        <div className="flex gap-2 ml-1 items-center">
                            <input
                                id="terms" type="checkbox" checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer leading-tight">
                                I agree to the <span className="text-indigo-600 font-bold">Terms</span> and <span className="text-indigo-600 font-bold">Privacy Policy</span>.
                            </label>
                        </div>
                        {errors.terms && <p className="text-red-500 text-xs ml-1">{errors.terms}</p>}

                        <Button type="submit" disabled={loading} className="w-full py-3">
                            {loading ? 'Creating...' : 'Create Account'}
                            {!loading && <ArrowRight size={18} />}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}