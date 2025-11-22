import { RepoList } from '../dashboard/RepoList';
import { ErrorHistory } from '../dashboard/ErrorHistory';

export const SidebarLeft = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-shrink-0 max-h-[40%] flex flex-col border-b border-white/5">
                    <RepoList />
                </div>
                <div className="flex-1 min-h-0 flex flex-col">
                    <ErrorHistory />
                </div>
            </div>
        </div>
    );
};
