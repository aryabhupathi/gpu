import { toggleBookmark } from '@/actions/bookmarkActions';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn() },
    bookmark: { findUnique: jest.fn(), delete: jest.fn(), create: jest.fn() },
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const prismaMock = prisma as any;

describe('toggleBookmark', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws Unauthorized if no session exists', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    await expect(toggleBookmark('forum123')).rejects.toThrow('Unauthorized');
  });

  it('throws User not found if user is not in database', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user123' } });
    prismaMock.user.findUnique.mockResolvedValue(null);
    
    await expect(toggleBookmark('forum123')).rejects.toThrow('User not found');
  });

  it('deletes bookmark if it already exists', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user123' } });
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user123' } as any);
    prismaMock.bookmark.findUnique.mockResolvedValue({ id: 'bm123', userId: 'user123', forumId: 'forum123', createdAt: new Date() });
    
    const result = await toggleBookmark('forum123');
    
    expect(prismaMock.bookmark.delete).toHaveBeenCalledWith({ where: { id: 'bm123' } });
    expect(revalidatePath).toHaveBeenCalledWith('/forum/forum123');
    expect(result).toEqual({ bookmarked: false });
  });

  it('creates bookmark if it does not exist', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user123' } });
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user123' } as any);
    prismaMock.bookmark.findUnique.mockResolvedValue(null);
    
    const result = await toggleBookmark('forum123');
    
    expect(prismaMock.bookmark.create).toHaveBeenCalledWith({
      data: { userId: 'user123', forumId: 'forum123' }
    });
    expect(revalidatePath).toHaveBeenCalledWith('/forum/forum123');
    expect(result).toEqual({ bookmarked: true });
  });
});
