import CompareBar from '@/components/ipo/CompareBar';

export default function IpoLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <CompareBar />
        </>
    );
}
