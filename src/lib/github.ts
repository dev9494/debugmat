import { Octokit } from "octokit";

export const createOctokit = (token: string) => {
    return new Octokit({ auth: token });
};

export interface Repo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    updated_at: string | null;
    owner: {
        login: string;
        avatar_url: string;
    };
}

export const fetchUserRepos = async (token: string): Promise<Repo[]> => {
    const octokit = createOctokit(token);
    const response = await octokit.request('GET /user/repos', {
        sort: 'updated',
        per_page: 100,
        visibility: 'all'
    });
    return response.data;
};

export const fetchRepoFileTree = async (token: string, owner: string, repo: string) => {
    const octokit = createOctokit(token);
    // Get the default branch first
    const repoData = await octokit.request('GET /repos/{owner}/{repo}', {
        owner,
        repo
    });
    const defaultBranch = repoData.data.default_branch;

    const response = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1', {
        owner,
        repo,
        tree_sha: defaultBranch
    });

    return response.data.tree.map((item: any) => item.path);
};

export const fetchFileContent = async (token: string, owner: string, repo: string, path: string) => {
    const octokit = createOctokit(token);
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path
    });

    const data = response.data as any;

    if (Array.isArray(data) || !data.content) {
        throw new Error('Not a file');
    }

    return atob(data.content);
};
