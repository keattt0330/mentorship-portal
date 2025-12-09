import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ label, icon: Icon, type = "text", error, ...props }) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                {label}
            </label>
            <div className="relative group">
                {/* Left Icon */}
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Icon size={20} />
                    </div>
                )}

                <input
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-3 outline-none transition-all duration-200
                        ${Icon ? 'pl-10' : ''} 
                        ${isPassword ? 'pr-12' : ''}
                        ${error 
                            ? 'border-red-400 focus:border-red-500 bg-red-50/50' 
                            : 'border-slate-200 focus:border-indigo-600 focus:bg-white hover:border-slate-300'
                        }
                    `}
                    {...props}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            
            {error && (
                <p className="mt-1 text-sm text-red-500 ml-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"/> {error}
                </p>
            )}
        </div>
    );
}