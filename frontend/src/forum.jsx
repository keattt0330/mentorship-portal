import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    MessageSquare, Search, Plus, Heart, 
    MoreVertical, Clock, Hash, TrendingUp, User as UserIcon, X 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast
import { api } from './services/api'; // Ensure this path is correct
import Button from './components/Button'; // Ensure you have this component

export default function Forum() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [showForm, setShowForm] = useState(false);
    
    // Loading states
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [activeTab, setActiveTab] = useState('latest');

    const trendingTags = ['#ComputerScience', '#BiologyResearch', '#Internships', '#CalculusHelp'];

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setIsLoadingPosts(true);
            const data = await api.get('forum');
            setPosts(data);
        } catch (error) {
            console.error('Failed to load posts', error);
            toast.error("Failed to load discussions.");
        } finally {
            setIsLoadingPosts(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return; // Prevent double clicking
        
        // simple validation
        if (!newPost.title.trim() || !newPost.content.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Posting discussion...');

        try {
            // This calls the api.post method we just added to api.js
            await api.post('forum', newPost); 
            
            // Reset form
            setNewPost({ title: '', content: '' });
            setShowForm(false);
            
            // Show success and reload list
            toast.success('Discussion posted successfully!', { id: toastId });
            loadPosts();

        } catch (error) {
            console.error('Failed to create post', error);
            // Show error message from backend if available
            const message = error.message || 'Failed to create post';
            toast.error(message, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Notification Toaster */}
            <Toaster position="top-right" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* PAGE HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Community Forum</h1>
                            <p className="text-slate-500 mt-1">Discuss research, ask questions, and connect with peers.</p>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative group w-full md:w-96">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Search size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search topics..." 
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN: Main Feed */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Create Post Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                {!showForm ? (
                                    <div 
                                        onClick={() => setShowForm(true)}
                                        className="p-6 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                            <UserIcon size={20} />
                                        </div>
                                        <div className="flex-1 bg-slate-100 rounded-full px-6 py-3 text-slate-500 font-medium">
                                            Start a discussion...
                                        </div>
                                        <button className="p-2 text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-slate-800">Create New Discussion</h3>
                                            <button 
                                                type="button" 
                                                onClick={() => setShowForm(false)} 
                                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <input
                                            className="w-full text-xl font-bold placeholder-slate-400 border-none focus:ring-0 px-0 mb-2 outline-none"
                                            placeholder="Give your topic a title..."
                                            value={newPost.title}
                                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                            required
                                            autoFocus
                                            disabled={isSubmitting}
                                        />
                                        <textarea
                                            className="w-full h-32 resize-none border-none focus:ring-0 px-0 text-slate-600 placeholder-slate-400 outline-none"
                                            placeholder="What's on your mind? Share details, code snippets, or questions..."
                                            value={newPost.content}
                                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                            required
                                            disabled={isSubmitting}
                                        />
                                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                            <button 
                                                type="button" 
                                                onClick={() => setShowForm(false)}
                                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </button>
                                            <Button type="submit" className="w-auto px-6 py-2" disabled={isSubmitting}>
                                                {isSubmitting ? 'Posting...' : 'Post Discussion'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex items-center gap-6 border-b border-slate-200 px-2">
                                {['Latest', 'Top', 'Unanswered'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`pb-3 font-medium text-sm transition-all relative ${
                                            activeTab === tab.toLowerCase() 
                                            ? 'text-indigo-600' 
                                            : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        {tab}
                                        {activeTab === tab.toLowerCase() && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Posts List */}
                            <div className="space-y-4">
                                {isLoadingPosts ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                                        <span className="text-slate-400 text-sm">Loading discussions...</span>
                                    </div>
                                ) : posts.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                            <MessageSquare size={32} />
                                        </div>
                                        <h3 className="text-slate-900 font-medium text-lg">No posts yet</h3>
                                        <p className="text-slate-500 text-sm mt-1">Be the first to start a conversation!</p>
                                    </div>
                                ) : (
                                    posts.map((post) => (
                                        <Link 
                                            key={post.id} 
                                            to={`/forum/${post.id}`}
                                            className="block bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar */}
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                        {post.user?.name ? post.user.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 text-sm">
                                                            {post.user?.name || 'Unknown User'}
                                                        </div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {new Date(post.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                                    <MoreVertical size={20} />
                                                </button>
                                            </div>

                                            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
                                                {post.content}
                                            </p>

                                            <div className="flex items-center gap-6 border-t border-slate-100 pt-4">
                                                <div className="flex items-center gap-2 text-slate-500 text-sm group-hover:text-indigo-600 transition-colors">
                                                    <MessageSquare size={18} />
                                                    <span className="font-medium">{post.comments_count || 0}</span> Comments
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">
                                                        Discussion
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar */}
                        <div className="hidden lg:block space-y-6">
                            
                            {/* Stats */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-indigo-600" />
                                    Community Stats
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-slate-900">1.2k</div>
                                        <div className="text-xs text-slate-500 font-medium">Members</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-slate-900">342</div>
                                        <div className="text-xs text-slate-500 font-medium">Online</div>
                                    </div>
                                </div>
                            </div>

                            {/* Guidelines */}
                            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    Posting Guidelines
                                </h3>
                                <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                                    <li>Be respectful and constructive</li>
                                    <li>Search before you post</li>
                                    <li>Use clear and concise titles</li>
                                    <li>No spam or self-promotion</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}