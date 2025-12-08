import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Calendar, Search, Filter, MoreHorizontal } from 'lucide-react';

export default function ProjectBoards() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    // Mock Fetch
    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                }
            });
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
            // Fallback for demo if API fails
            setProjects([]); 
        } finally {
            setLoading(false);
        }
    };

    // Helper to get random gradient for card cover
    const getGradient = (id) => {
        const gradients = [
            'from-blue-500 to-cyan-400',
            'from-purple-500 to-indigo-500',
            'from-emerald-400 to-teal-500',
            'from-orange-400 to-pink-500',
        ];
        return gradients[id % gradients.length];
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-1" /> Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900">Project Boards</h1>
                        <p className="text-slate-500 mt-1">Discover, join, and manage your STEM collaborations.</p>
                    </div>
                    <button className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                        <Plus size={20} className="mr-2" /> Create Project
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search projects..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">
                        <Filter size={18} className="mr-2 text-slate-400" /> Filter
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                )}

                {/* Projects Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <div key={project.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                
                                {/* Card Cover */}
                                <div className={`h-24 bg-gradient-to-r ${getGradient(index)} relative p-4`}>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-1.5 rounded-lg text-white hover:bg-white/30 cursor-pointer">
                                        <MoreHorizontal size={16} />
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <div className="flex gap-2 mb-3">
                                            {project.tags.slice(0, 2).map((tag, idx) => (
                                                <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md uppercase tracking-wide">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                        
                                        {/* Member Avatars (Mock visual) */}
                                        <div className="flex items-center -space-x-2">
                                            {[...Array(Math.min(3, project.members?.length || 0))].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                                    U{i+1}
                                                </div>
                                            ))}
                                            {(project.members?.length || 0) > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                    +{project.members.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center text-slate-400 text-xs font-medium">
                                            <Calendar size={14} className="mr-1.5" />
                                            {project.deadline || 'No Deadline'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}