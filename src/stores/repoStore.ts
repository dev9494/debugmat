import { create } from 'zustand';
import type { Repo } from '../lib/github';

interface RepoState {
    repositories: Repo[];
    selectedRepo: Repo | null;
    fileTree: string[];
    techStack: string[];
    isAnalyzing: boolean;
    setRepositories: (repos: Repo[]) => void;
    selectRepo: (repo: Repo) => void;
    setFileTree: (tree: string[]) => void;
    setTechStack: (stack: string[]) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
}

export const useRepoStore = create<RepoState>((set) => ({
    repositories: [],
    selectedRepo: null,
    fileTree: [],
    techStack: [],
    isAnalyzing: false,
    setRepositories: (repos) => set({ repositories: repos }),
    selectRepo: (repo) => set({ selectedRepo: repo }),
    setFileTree: (tree) => set({ fileTree: tree }),
    setTechStack: (stack) => set({ techStack: stack }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
}));
