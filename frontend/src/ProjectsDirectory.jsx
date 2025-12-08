import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './services/api';
import { 
    Search, Plus, Filter, Users, Calendar, 
    ArrowRight, Loader2
} from 'lucide-react';

export default function ProjectsDirectory() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [joiningId, setJoiningId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await api.get('/projects');
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (projectId) => {
        setJoiningId(projectId);
        try {
            await api.post(`/projects/${projectId}/join`);
            fetchProjects(); 
            alert("Successfully joined the project!");
        } catch (error) {
            console.error("Failed to join", error);
            alert("Could not join project. You might already be a member.");
        } finally {
            setJoiningId(null);
        }
    };

    const filteredProjects = projects.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        // 1. OUTER WRAPPER: Remove horizontal padding (px-...) here
        <div className="min-h-screen bg-slate-50 py-8">
            
            {/* 2. CONTAINER: Must match Header EXACTLY (max-w-7xl + responsive px) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Explore Projects</h1>
                        <p className="text-slate-500 mt-2">Discover active research and collaboration opportunities.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/projects/create')} 
                        className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        <Plus size={20} className="mr-2" /> Create Project
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search projects by title, keyword, or tag..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <button className="hidden sm:flex items-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">
                        <Filter size={18} className="mr-2 text-slate-400" /> Filters
                    </button>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
                                
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-2">
                                            {project.tags ? project.tags.map((tag, i) => (
                                                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
                                                    {tag}
                                                </span>
                                            )) : (
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
                                                    Project
                                                </span>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            project.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {project.status || 'Active'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{project.title}</h3>
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {project.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5" title="Members">
                                                <Users size={16} /> 
                                                <span className="font-medium">{project.members ? project.members.length : 0}</span>
                                            </div>
                                            {project.deadline && (
                                                <div className="flex items-center gap-1.5" title="Deadline">
                                                    <Calendar size={16} /> 
                                                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                    <button 
                                        className="flex-1 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                    >
                                        View Details
                                    </button>
                                    <button 
                                        onClick={() => handleJoin(project.id)}
                                        disabled={joiningId === project.id}
                                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-400 flex items-center justify-center gap-2"
                                    >
                                        {joiningId === project.id ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" /> Joining...
                                            </>
                                        ) : (
                                            <>Join Team <ArrowRight size={16} /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}