import { toggleForumLike } from '@/actions/forumActions';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn(), update: jest.fn() },
    forum: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    forumLike: { findUnique: jest.fn(), delete: jest.fn(), create: jest.fn(), count: jest.fn() },
    notification: { create: jest.fn() },
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const prismaMock = prisma as any;

describe('toggleForumLike', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prevents a user from liking their own forum', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user123' } });
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user123', name: 'Test User' } as any);
    
    // The forum belongs to user123
    prismaMock.forum.findUnique.mockResolvedValue({ id: 'forum123', userId: 'user123', title: 'My Post' } as any);

    await expect(toggleForumLike('forum123')).rejects.toThrow('You cannot like your own forum');
  });

  it('adds a like and creates a notification when liking a new forum', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user123' } });
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user123', name: 'Test User' } as any);
    
    // The forum belongs to ANOTHER user
    prismaMock.forum.findUnique.mockResolvedValue({ id: 'forum123', userId: 'otherUser', title: 'Great Post' } as any);
    
    // Simulating no existing like
    prismaMock.forumLike.findUnique.mockResolvedValue(null);
    prismaMock.forumLike.count.mockResolvedValue(1);

    const result = await toggleForumLike('forum123');

    // It should create the like
    expect(prismaMock.forumLike.create).toHaveBeenCalledWith({
      data: { userId: 'user123', forumId: 'forum123' }
    });

    // It should create a notification
    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'otherUser',
        type: 'LIKE',
        message: expect.stringContaining('liked your post'),
      })
    });

    // It should return liked: true
    expect(result).toEqual({ liked: true, likeCount: 1 });
  });

  it('removes a like when toggling an already liked forum', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user123' } });
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user123', name: 'Test User' } as any);
    prismaMock.forum.findUnique.mockResolvedValue({ id: 'forum123', userId: 'otherUser', title: 'Great Post' } as any);
    
    // Simulating existing like
    prismaMock.forumLike.findUnique.mockResolvedValue({ userId: 'user123', forumId: 'forum123', createdAt: new Date() });
    prismaMock.forumLike.count.mockResolvedValue(0);

    const result = await toggleForumLike('forum123');

    // It should delete the like
    expect(prismaMock.forumLike.delete).toHaveBeenCalledWith({
      where: { userId_forumId: { userId: 'user123', forumId: 'forum123' } }
    });

    // It should return liked: false
    expect(result).toEqual({ liked: false, likeCount: 0 });
  });
});
