import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Search, Code2, Zap, Shield, Brain,
    ChevronRight, ExternalLink, Terminal,
    Lightbulb, Rocket, Target, X, PlayCircle
} from 'lucide-react';
import { docsData, type Article } from '../../data/docsData';

const difficultyConfig = {
    beginner: { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Beginner' },
    intermediate: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Intermediate' },
    advanced: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Advanced' }
};

export const DocsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // Calculate Real Stats
    const stats = useMemo(() => {
        let articles = 0;
        let codeExamples = 0;
        let videos = 0;
        let endpoints = 0;

        docsData.forEach(section => {
            articles += section.articles.length;
            section.articles.forEach(article => {
                codeExamples += article.codeExamples || 0;
                if (article.hasVideo) videos++;
                endpoints += article.apiEndpoints || 0;
            });
        });

        return { articles, codeExamples, videos, endpoints };
    }, []);

    const filteredSections = docsData.map(section => ({
        ...section,
        articles: section.articles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    })).filter(section => section.articles.length > 0 || searchQuery === '');

    return (
        <div className="min-h-screen bg-[#030712] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Documentation</h1>
                            <p className="text-slate-400">Everything you need to master AI-powered debugging</p>
                        </div>
                    </div>

                    {/* Quick Stats - REAL DATA */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Total Articles', value: stats.articles, icon: BookOpen, color: 'text-purple-400' },
                            { label: 'Code Examples', value: stats.codeExamples, icon: Code2, color: 'text-blue-400' },
                            { label: 'Video Tutorials', value: stats.videos, icon: Target, color: 'text-green-400' },
                            { label: 'API Endpoints', value: stats.endpoints, icon: Terminal, color: 'text-orange-400' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-4 border border-white/10 bg-white/5 rounded-xl"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                                </div>
                                <div className="text-sm text-slate-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        />
                    </div>
                </motion.div>

                {/* Popular Topics */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Popular Topics</h2>
                    <div className="flex flex-wrap gap-2">
                        {['Quick Start', 'Auto-Fix', 'API Reference', 'Security', 'CI/CD', 'Analytics', 'Prevention Mode'].map((topic) => (
                            <button
                                key={topic}
                                onClick={() => setSearchQuery(topic)}
                                className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20 transition-all text-sm font-medium"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Documentation Sections */}
                <div className="space-y-6">
                    {filteredSections.map((section, sectionIndex) => {
                        const SectionIcon = section.icon;

                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: sectionIndex * 0.1 }}
                                className="glass-card p-6 border border-white/10 bg-white/5 rounded-xl"
                            >
                                {/* Section Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                                        <SectionIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{section.title}</h2>
                                        <p className="text-sm text-slate-400">{section.description}</p>
                                    </div>
                                </div>

                                {/* Articles Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.articles.map((article, articleIndex) => (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: articleIndex * 0.05 }}
                                            onClick={() => setSelectedArticle(article)}
                                            className="group p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/20 hover:bg-black/40 transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors pr-8">
                                                    {article.title}
                                                </h3>
                                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 absolute top-4 right-4" />
                                            </div>

                                            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{article.description}</p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyConfig[article.difficulty].bg} ${difficultyConfig[article.difficulty].color}`}>
                                                        {difficultyConfig[article.difficulty].label}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{article.readTime} read</span>
                                                </div>
                                                {article.hasVideo && (
                                                    <PlayCircle className="w-4 h-4 text-slate-500 group-hover:text-green-400 transition-colors" />
                                                )}
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {article.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-500 group-hover:text-slate-400 transition-colors">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {article.tags.length > 3 && (
                                                    <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-500">+{article.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Help Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 glass-card p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-blue-600">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
                            <p className="text-slate-300 mb-4">
                                Can't find what you're looking for? Our AI assistant and community are here to help.
                            </p>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                                    Ask AI Assistant
                                </button>
                                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/10">
                                    Join Community
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Article Modal */}
                <AnimatePresence>
                    {selectedArticle && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setSelectedArticle(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="p-6 border-b border-white/10 flex items-start justify-between bg-slate-900/50">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyConfig[selectedArticle.difficulty].bg} ${difficultyConfig[selectedArticle.difficulty].color}`}>
                                                {difficultyConfig[selectedArticle.difficulty].label}
                                            </span>
                                            <span className="text-slate-400 text-sm flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" /> {selectedArticle.readTime} read
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">{selectedArticle.title}</h2>
                                        <p className="text-slate-400">{selectedArticle.description}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedArticle(null)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="p-8 overflow-y-auto custom-scrollbar">
                                    <div className="prose prose-invert max-w-none">
                                        {/* Placeholder for Markdown Content Rendering */}
                                        <div className="text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                                            {selectedArticle.content || "Content coming soon..."}
                                        </div>

                                        {selectedArticle.codeExamples > 0 && (
                                            <div className="mt-8 p-4 bg-black/40 rounded-lg border border-white/10">
                                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                                                    <Code2 className="w-4 h-4" /> Code Example
                                                </h4>
                                                <pre className="text-sm text-blue-300 font-mono overflow-x-auto">
                                                    <code>// Example code for {selectedArticle.title}
                                                        console.log('DebugMate is active');</code>
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
