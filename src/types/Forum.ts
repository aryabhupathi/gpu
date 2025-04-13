// User interface
export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  forums: Forum[];
  comments: Comment[];
  accounts: Account[];
  sessions: Session[];
  likes: Like[];
}

// Account interface
export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  user: User;
}

// Session interface
export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
}

// VerificationToken interface
export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// Comment interface
export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  forumId: string;
  forum: Forum;
}

// Forum interface
export interface Forum {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  comments: Comment[];
  tags: ForumTag[];
  likes: Like[];
}

// Tag interface
export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  forums: ForumTag[];
}

// ForumTag interface
export interface ForumTag {
  forumId: string;
  tagId: string;
  forum: Forum;
  tag: Tag;
}

// Like interface
export interface Like {
  id: string;
  createdAt: Date;
  userId: string;
  user: User;
  forumId: string;
  forum: Forum;
}
