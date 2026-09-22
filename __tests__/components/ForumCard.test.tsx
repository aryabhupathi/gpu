import { render, screen } from '@testing-library/react';
import ForumCard from '@/components/forum/ForumCard';
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
describe('ForumCard', () => {
  it('renders forum details correctly', () => {
    const mockForum = { id: '1', title: 'Test Title', description: 'Desc', createdAt: new Date().toISOString(), tags: ['Tech'], user: { id: 'u1', name: 'Test User' } };
    render(<ForumCard forum={mockForum as any} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
