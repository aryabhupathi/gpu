import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import NotificationBell from '@/components/layout/NotificationBell';
import { getNotifications, markNotificationsAsRead } from '@/actions/notificationActions';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/actions/notificationActions', () => ({
  getNotifications: jest.fn(),
  markNotificationsAsRead: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('NotificationBell Component', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it('renders correctly with no notifications', async () => {
    (getNotifications as jest.Mock).mockResolvedValue([]);
    
    render(<NotificationBell />);
    
    // Check that badge content is not visible (or 0)
    // The bell icon should be there
    expect(screen.getByTestId('NotificationsIcon')).toBeInTheDocument();
    
    // Click the bell
    fireEvent.click(screen.getByRole('button'));
    
    // Wait for dropdown
    await waitFor(() => {
      expect(screen.getByText('No notifications yet.')).toBeInTheDocument();
    });
  });

  it('displays the correct unread badge count', async () => {
    const mockData = [
      { id: '1', message: 'First unread', read: false, createdAt: new Date() },
      { id: '2', message: 'Second unread', read: false, createdAt: new Date() },
      { id: '3', message: 'Third read', read: true, createdAt: new Date() },
    ];
    (getNotifications as jest.Mock).mockResolvedValue(mockData);
    
    render(<NotificationBell />);
    
    // Wait for the badge to update
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // 2 unread notifications
    });
  });

  it('marks notifications as read when clicked', async () => {
    const mockData = [
      { id: '1', message: 'First unread', read: false, createdAt: new Date() },
    ];
    (getNotifications as jest.Mock).mockResolvedValue(mockData);
    (markNotificationsAsRead as jest.Mock).mockResolvedValue(undefined);
    
    render(<NotificationBell />);
    
    // Wait for notifications to load
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    // Click to open menu
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(markNotificationsAsRead).toHaveBeenCalledTimes(1);
    });
  });

  it('navigates when a notification is clicked', async () => {
    const mockData = [
      { id: '1', message: 'Check this out', link: '/forum/123', read: true, createdAt: new Date() },
    ];
    (getNotifications as jest.Mock).mockResolvedValue(mockData);
    
    render(<NotificationBell />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button'));
    
    // Wait for the menu item to appear
    await waitFor(() => {
      expect(screen.getByText('Check this out')).toBeInTheDocument();
    });
    
    // Click the notification
    fireEvent.click(screen.getByText('Check this out'));
    
    // Verify router push was called
    expect(mockRouterPush).toHaveBeenCalledWith('/forum/123');
  });
});
