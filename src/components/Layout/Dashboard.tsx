
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface DashboardProps {
  children: ReactNode;
  title?: string;
}

export default function Dashboard({ children, title }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
