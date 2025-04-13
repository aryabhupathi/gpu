#  ConnectForum – A Modern Community Forum Platform

**ConnectForum** is a full-stack forum website where users can create and participate in forum discussions. Whether it's for asking questions, sharing ideas, or collaborating on projects, this platform allows users to connect through engaging conversations.

Built with modern tools like **Next.js**, **TypeScript**, and **Material UI**, and backed by **Prisma** and **MySQL**, ConnectForum is optimized for performance, scalability, and developer experience.

---

##  Features

-  **User Authentication** – Register and log in securely with **NextAuth**
-  **Create Forums** – Authenticated users can create their own forums
-  **Comment System** – View comments on forums and participate in discussions
-  **Material UI** – Clean, responsive, and accessible design
-  **Prisma ORM** – Simplified database access with auto-generated types
-  **MySQL Database** – Store user, forum, and comment data reliably

---

##  Tech Stack

| Technology     | Description                                 |
|----------------|---------------------------------------------|
| **Next.js**     | React framework with server-side rendering |
| **TypeScript**  | Strongly typed JavaScript                  |
| **NextAuth.js** | Authentication solution for Next.js        |
| **Material UI** | Component library for fast UI development  |
| **Prisma**      | Next-gen ORM for database access           |
| **MySQL**       | Relational database management system      |

---

##  Project Structure

- /app /api - API routes (forums, auth, comments) 
- /auth - NextAuth configuration 
- /forums - Forum creation and listing pages 
- /components - Reusable UI components 
- /prisma schema.prisma - Prisma DB schema 
- .env - Environment configuration

---

##  Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the Repository

  git clone https://github.com/your-username/connectforum.git
  
  cd connectforum

### 2. Install Dependencies
- npm install
- npm install @mui/material @emotion/react @emotion/styled
- npm install @mui/icons-material
- npm install next-auth
- npm install @reduxjs/toolkit react-redux
- npm install date-fns

### 3. Configure Environment Variables
Create a .env file in the root of your project with the following:

- DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/dbname"
- NEXTAUTH_SECRET=your_random_secret

Replace USER, PASSWORD, and dbname with your MySQL credentials.
### 4. Set Up Prisma
Generate Prisma client and run the initial migration:

- npx prisma generate
- npx prisma migrate dev --name init
  
 This will create the required tables in your MySQL database.

### 5. Start the Development Server

- npm run dev

Now visit http://localhost:3000 to see the app in action.
