import { RepoList } from '../dashboard/RepoList';
import { ErrorHistory } from '../dashboard/ErrorHistory';
import { LevelProgress } from '../features/LevelProgress';

export const SidebarLeft = () => {
    return (
        <div className="flex flex-col h-full p-4 gap-4">
            <div className="flex-shrink-0">
                <LevelProgress />
            </div>
            <div className="flex-1 min-h-0 flex flex-col gap-4">
                <div className="flex-shrink-0 max-h-[40%] flex flex-col glass-card rounded-xl overflow-hidden">
                    <RepoList />
                </div>
                <div className="flex-1 min-h-0 flex flex-col glass-card rounded-xl overflow-hidden">
                    <ErrorHistory />
                </div>
            </div>
        </div>
    );
};
