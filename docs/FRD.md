# Functional Requirements Document (FRD)
**Project Name:** ConnectForum
**Version:** 1.0
**Date:** September 2026

---

## 1. Introduction & Purpose
This document provides a highly detailed breakdown of the functional requirements for ConnectForum. It dictates exactly how the system must respond to user inputs, detailing the behaviors of every module down to the acceptance criteria.

## 2. User Roles & Permissions Matrix
| Feature | Guest | Registered User | Admin |
|---------|-------|-----------------|-------|
| View Public Forums | Yes | Yes | Yes |
| View User Profiles | Yes | Yes | Yes |
| Login / Register | Yes | No (Already logged in) | No |
| Create/Edit Forums | No | Yes (Own only) | Yes (Any) |
| Post/Like Comments | No | Yes | Yes |
| Send Direct Messages| No | Yes | Yes |
| Follow Users | No | Yes | Yes |
| Issue Warnings/Bans | No | No | Yes |
| Archive Forums | No | Yes (Own only) | Yes (Any) |

---

## 3. Detailed Module Specifications

### 3.1 Authentication & Authorization Module (FR-AUTH)
- **Description:** Handles secure access to the platform.
- **Requirements:**
  - **FR-AUTH-1:** The system must utilize NextAuth.js to support Credentials login (Email/Password).
  - **FR-AUTH-2:** Passwords must be hashed using `bcryptjs` before storage in the database.
  - **FR-AUTH-3:** The system must support persistent sessions using stateless JWTs or database-backed sessions.
  - **FR-AUTH-4:** If a user's `banned` status in the DB is `true`, the system must terminate their session and reject login attempts with a custom error message.
- **Acceptance Criteria:** A user can register, log out, log back in, and is denied access if an Admin toggles their ban status.

### 3.2 Forum Engine (FR-FRM)
- **Description:** The core content creation and discovery engine.
- **Requirements:**
  - **FR-FRM-1:** Forum creation must utilize TipTap for rich-text input (bold, italics, links, blockquotes).
  - **FR-FRM-2:** Users must be able to attach an image to a forum post using UploadThing. The resulting URL is stored in `mediaUrl`.
  - **FR-FRM-3:** Users must be able to assign `Tags` (e.g., "Technology", "Help") to categorize their post.
  - **FR-FRM-4:** The system must paginate forum feeds, loading a maximum of 20 posts per page to preserve performance.
- **Acceptance Criteria:** A user creates a post with an image and a tag. It appears instantly on the main feed and under the selected tag's filter.

### 3.3 Threaded Commenting System (FR-CMT)
- **Description:** Allows deep discussions on forum posts.
- **Requirements:**
  - **FR-CMT-1:** Users can comment on a root Forum post.
  - **FR-CMT-2:** Users can reply to a specific comment. The system assigns the parent comment's ID to the new comment's `parentId`.
  - **FR-CMT-3:** Deleting a parent comment must Cascade and delete all nested replies (handled via Prisma `@relation(onDelete: Cascade)`).
- **Acceptance Criteria:** Nested comments are visually indented in the UI. Deleting a parent removes the whole thread.

### 3.4 Gamification Engine (FR-GAM)
- **Description:** Incentivizes user behavior through rewards.
- **Requirements:**
  - **FR-GAM-1:** Every new forum post awards the user +10 XP. Every comment awards +2 XP.
  - **FR-GAM-2:** The system must calculate level-ups dynamically based on XP thresholds (e.g., Level 2 = 100 XP, Level 3 = 250 XP).
  - **FR-GAM-3:** When an XP threshold is crossed, the user's `level` integer in the database increments by 1.
- **Acceptance Criteria:** User posts 10 times, reaches 100 XP, and their profile visually updates to Level 2.

### 3.5 Direct Messaging & Social Graph (FR-SOC)
- **Description:** Private networking and content curation.
- **Requirements:**
  - **FR-SOC-1:** A user can follow another user, creating a composite key record in the `Follow` table.
  - **FR-SOC-2:** A user can initiate a `Conversation`. The system checks if a conversation already exists between `user1Id` and `user2Id` to prevent duplicates.
  - **FR-SOC-3:** Messages are appended to the `Message` table and linked to the `Conversation`.
- **Acceptance Criteria:** User A messages User B. User B receives a notification and can view the chronological chat history.

### 3.6 Administration Module (FR-ADMIN)
- **Description:** Moderation tools for community health.
- **Requirements:**
  - **FR-ADMIN-1:** Admin UI to increment a user's `warnings` count.
  - **FR-ADMIN-2:** If `warnings` >= 3, the system may automatically suspend the user (or flag for manual review).
  - **FR-ADMIN-3:** Admins can toggle the `archived` boolean on Forums to prevent new comments while keeping the post readable.
