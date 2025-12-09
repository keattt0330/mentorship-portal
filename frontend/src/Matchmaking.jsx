// Matchmaking.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, X, Heart, MapPin, Briefcase, 
    GraduationCap, Sparkles, MessageCircle 
} from 'lucide-react';

export default function Matchmaking() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState([
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Mentor",
            major: "Computer Science PhD",
            school: "MIT",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
            bio: "Specializing in Natural Language Processing. I can help with Python, PyTorch, and grad school applications. Looking for dedicated mentees.",
            skills: ["Python", "NLP", "Machine Learning"]
        },
        {
            id: 2,
            name: "David Chen",
            role: "Student",
            major: "Electrical Engineering",
            school: "Stanford",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
            bio: "Building autonomous drones. Looking for a mentor who understands embedded systems and real-time operating systems.",
            skills: ["C++", "Robotics", "Circuit Design"]
        },
        {
            id: 3,
            name: "Emily Davis",
            role: "Mentor",
            major: "Bioinformatics Lead",
            school: "Harvard Med",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
            bio: "Helping students bridge the gap between Biology and Data Science. Let's publish your first paper together.",
            skills: ["Genomics", "R", "Statistics"]
        }
    ]);

    const currentCandidate = candidates[currentIndex];

    const handleSwipe = async (direction) => {
        if (!currentCandidate) return;

        // Simulate API delay/interaction
        // const response = await fetch(...) 

        if (direction === 'right') {
            console.log("Liked:", currentCandidate.name);
            // You can add a visual "Match" popup here later
        }

        if (currentIndex < candidates.length) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    // --- SUB-COMPONENTS ---
    
    const SkillTag = ({ label }) => (
        <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
            {label}
        </span>
    );

    const InfoRow = ({ icon: Icon, text }) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Icon size={16} className="text-slate-400" />
            <span>{text}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-8 px-4">
            
            {/* Header / Nav */}
            <div className="w-full max-w-md flex items-center justify-between mb-6">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="p-2 rounded-full hover:bg-white hover:shadow-sm text-slate-500 transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="text-pink-500" size={20} fill="currentColor" />
                    Discover
                </h1>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Main Card Area */}
            <div className="w-full max-w-md h-[650px] relative perspective-1000">
                {currentCandidate ? (
                    <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
                        
                        {/* Image Section */}
                        <div className="h-[55%] relative">
                            <img 
                                src={currentCandidate.image} 
                                alt={currentCandidate.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            
                            {/* Floating Role Badge */}
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg border border-white/20 text-white
                                    ${currentCandidate.role === 'Mentor' ? 'bg-purple-500/80' : 'bg-emerald-500/80'}`
                                }>
                                    {currentCandidate.role}
                                </span>
                            </div>

                            {/* Name Overlay */}
                            <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                                <h2 className="text-3xl font-bold leading-tight">{currentCandidate.name}</h2>
                                <p className="opacity-90 font-medium text-lg">{currentCandidate.major}</p>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 p-6 flex flex-col">
                            
                            {/* Key Info */}
                            <div className="mb-4 space-y-2">
                                <InfoRow icon={GraduationCap} text={currentCandidate.school} />
                                <InfoRow icon={Briefcase} text={currentCandidate.role === 'Mentor' ? 'Available for Mentorship' : 'Looking for Mentorship'} />
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {currentCandidate.skills.map((skill, i) => (
                                    <SkillTag key={i} label={skill} />
                                ))}
                            </div>

                            {/* Bio - Scrollable if long */}
                            <div className="flex-1 overflow-y-auto pr-2 mb-4">
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    "{currentCandidate.bio}"
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons (Floating) */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 z-10">
                            {/* Pass Button */}
                            <button 
                                onClick={() => handleSwipe('left')}
                                className="w-14 h-14 bg-white rounded-full shadow-xl shadow-slate-200 text-slate-400 border border-slate-100 flex items-center justify-center hover:bg-slate-50 hover:text-red-500 hover:scale-110 transition-all duration-200"
                            >
                                <X size={28} strokeWidth={2.5} />
                            </button>

                            {/* Super Like / Message (Optional) */}
                            <button className="w-10 h-10 bg-indigo-50 rounded-full text-indigo-600 flex items-center justify-center hover:bg-indigo-100 hover:scale-110 transition-all duration-200">
                                <MessageCircle size={20} />
                            </button>

                            {/* Like Button */}
                            <button 
                                onClick={() => handleSwipe('right')}
                                className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-full shadow-xl shadow-pink-200 text-white flex items-center justify-center hover:brightness-110 hover:scale-110 hover:rotate-3 transition-all duration-200"
                            >
                                <Heart size={28} fill="currentColor" strokeWidth={0} />
                            </button>
                        </div>

                    </div>
                ) : (
                    // Empty State
                    <div className="w-full h-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Sparkles size={48} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">That's everyone!</h2>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                            You've seen all potential matches for today. Check back later or adjust your filters.
                        </p>
                        <button 
                            onClick={() => {
                                setCandidates([...candidates]); // Reset for demo
                                setCurrentIndex(0);
                            }}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                        >
                            Start Over
                        </button>
                    </div>
                )}
            </div>
            
            <p className="text-xs text-slate-400 mt-8 font-medium">
                Swipe right to connect, left to skip
            </p>
        </div>
    );
}