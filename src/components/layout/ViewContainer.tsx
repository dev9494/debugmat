import type { ReactNode } from 'react';

interface ViewContainerProps {
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const ViewContainer = ({ children, maxWidth = 'full' }: ViewContainerProps) => {
    const maxWidthClasses = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        full: 'max-w-full'
    };

    return (
        <div className="w-full h-full flex justify-center">
            <div className={`w-full ${maxWidthClasses[maxWidth]} px-6 py-6`}>
                {children}
            </div>
        </div>
    );
};
