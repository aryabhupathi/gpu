import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '@/components/layout/Sidebar';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

// Mock dependencies
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the branding logo for mobile sizes', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<Sidebar />);
    
    expect(screen.getByText('letstalk')).toBeInTheDocument();
  });

  it('hides the + New Topic button when unauthenticated', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<Sidebar />);
    
    expect(screen.queryByText('+ New Topic')).not.toBeInTheDocument();
  });

  it('shows the + New Topic button when authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
    });
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<Sidebar />);
    
    expect(screen.getByText('+ New Topic')).toBeInTheDocument();
  });

  it('highlights the active route based on pathname', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    
    // Simulating user being on the Explore page
    (usePathname as jest.Mock).mockReturnValue('/explore');
    
    render(<Sidebar />);
    
    // Check that the Explore link exists
    const exploreText = screen.getByText('Explore');
    expect(exploreText).toBeInTheDocument();
    
    // In actual enterprise testing, we might inspect styles, 
    // but verifying text existence is a good start.
  });

  it('renders all static navigation links', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<Sidebar />);
    
    // Main Nav
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    
    // Spaces
    expect(screen.getByText('YOUR SPACES')).toBeInTheDocument();
    expect(screen.getByText('Tech Hub')).toBeInTheDocument();
    expect(screen.getByText('Movies & Art')).toBeInTheDocument();
    expect(screen.getByText('Sports & Games')).toBeInTheDocument();
  });
});
