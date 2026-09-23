# Business Requirements Document (BRD)
**Project Name:** ConnectForum
**Version:** 1.0
**Date:** September 2026

---

## 1. Executive Summary
ConnectForum is a highly scalable, full-stack community platform designed to bridge the gap between traditional message boards and modern social networks. By leveraging a gamified engagement model, private networking capabilities, and seamless rich-media integration, ConnectForum empowers brands, creators, and niche communities to host their own centralized hubs without relying on algorithm-driven social media giants.

## 2. Problem Statement
Current community platforms suffer from two extremes:
1. **Legacy Forums (e.g., phpBB, vBulletin):** Outdated UI/UX, lack of mobile responsiveness, and poor social networking features.
2. **Centralized Social Media (e.g., Reddit, Facebook Groups, Discord):** Creators do not own their audience data, monetization is strictly controlled by the platform, and algorithmic changes can instantly kill community reach.

**The Solution:** ConnectForum provides a modern, fast, and owned platform where engagement is driven by built-in gamification (XP/Levels) and genuine human connection (Followers/DMs).

## 3. Target Audience Personas
- **The Independent Creator (e.g., YouTuber, Podcaster):** Wants a dedicated space for super-fans to interact, share fan art (via UploadThing), and level up their status in the community.
- **The B2B SaaS Company:** Needs a white-labeled customer support and feature-request forum where users can upvote/like features and get direct support.
- **The Niche Hobbyist Group:** Requires a highly organized, tag-based forum system for deep technical discussions with Notion-style rich-text formatting (TipTap).

## 4. Monetization Strategy & Business Model
*Note: These are strategic avenues enabled by the platform's architecture.*
- **SaaS Subscription (B2B):** Charging companies a monthly fee to host a branded, private version of ConnectForum.
- **Creator Revenue Share (B2C):** Allowing creators to put specific forum categories behind a "Premium Follower" paywall, where the platform takes a 5% transaction fee.
- **Ad-Driven (Freemium):** Injecting native, non-intrusive advertisements into the forum feed for free-tier users.

## 5. Detailed Project Scope & Phasing

### Phase 1: Core Minimum Viable Product (MVP) - *Currently Implemented*
- Secure User Authentication via NextAuth.
- Database Schema and ORM integration (Prisma + MySQL).
- Core Forum CRUD (Create, Read, Update, Delete) operations.
- Threaded commenting system.
- Basic User Profiles.

### Phase 2: Engagement & Social Features - *Currently Implemented*
- Gamification Engine: XP allocation, Level progression, Badge assignments.
- Social Graph: Follower/Following system.
- Real-time interaction: 1-on-1 Direct Messaging (Conversations).
- Notifications system (In-app alerts for likes/comments/follows).
- Rich-text media uploads via TipTap and UploadThing.

### Phase 3: Enterprise & Monetization - *Future Scope*
- Stripe integration for paid memberships.
- Advanced Analytics Dashboard for Admins (DAU, engagement rates).
- Native Mobile App wrappers (React Native).
- Webhook integrations (e.g., Discord/Slack cross-posting).

## 6. Non-Functional Requirements
- **Performance:** Pages must achieve a Google Lighthouse score of 90+ for SEO and Performance. Server-Side Rendering (SSR) via Next.js will ensure fast initial load times.
- **Scalability:** The architecture must support 10,000+ concurrent users through stateless sessions and connection pooling in Prisma.
- **Security:** Passwords must be hashed via bcrypt. Protection against SQL Injection (handled by Prisma) and XSS (handled by React/TipTap sanitization) is mandatory.

## 7. Risk Management
- **Risk:** Database bottleneck with heavy concurrent messaging.
  - **Mitigation:** Implement Redis caching for high-read forum data in the future.
- **Risk:** Malicious file uploads.
  - **Mitigation:** Strict MIME-type validation via UploadThing, restricting to standard image formats (JPEG, PNG, WebP) under 5MB.
