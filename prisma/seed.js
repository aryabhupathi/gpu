import { PrismaClient } from "@prisma/client";
import { hash as _hash } from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  console.log("Clearing old data (except original user)...");
  await prisma.commentLike.deleteMany();
  await prisma.forumLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.forumTag.deleteMany();
  await prisma.forum.deleteMany();
  await prisma.tag.deleteMany();
  const hash = await _hash("password123", 10);
  console.log("Creating users...");
  const users = [
    { email: "alex@example.com", name: "Alex Johnson", password: hash },
    { email: "samantha@example.com", name: "Samantha Lee", password: hash },
    { email: "david@example.com", name: "David Smith", password: hash },
    { email: "emily@example.com", name: "Emily Chen", password: hash },
    { email: "michael@example.com", name: "Michael Brown", password: hash },
    { email: "sarah@example.com", name: "Sarah Davis", password: hash },
  ];
  const createdUsers = [];
  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    createdUsers.push(created);
  }
  let arya = await prisma.user.findUnique({
    where: { email: "arya@arya.com" },
  });
  if (!arya) {
    const aryaHash = await _hash("Arya1234", 10);
    arya = await prisma.user.create({
      data: {
        email: "arya@arya.com",
        name: "Arya Bhupathi",
        password: aryaHash,
      },
    });
  }
  createdUsers.push(arya);
  console.log("Creating tags...");
  const tagNames = [
    "technology",
    "programming",
    "gaming",
    "design",
    "career",
    "webdev",
    "ai",
    "startups",
  ];
  const createdTags = [];
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdTags.push(tag);
  }
  console.log("Creating forums...");
  const forumData = [
    {
      title: "The Future of AI in Web Development",
      desc: "How do you think AI tools like Copilot will change the way we write code? Will junior developer roles disappear?",
      tags: ["ai", "webdev", "technology"],
    },
    {
      title: "Best laptop for programming in 2026?",
      desc: "I am looking to upgrade my setup. Should I go with the new M5 MacBooks or are Windows laptops catching up for dev work?",
      tags: ["technology", "programming"],
    },
    {
      title: "What game are you currently playing?",
      desc: "I just finished Baldurs Gate 3 again. Looking for something new to dive into this weekend.",
      tags: ["gaming"],
    },
    {
      title: "How to transition from Graphic Design to UX/UI?",
      desc: "I have 5 years of experience in graphic design but want to move into tech. Any tips on building a portfolio?",
      tags: ["design", "career"],
    },
    {
      title: "Next.js App Router vs Pages Router",
      desc: "It has been a few years since App Router was introduced. Is everyone fully migrated now? What are the biggest pain points?",
      tags: ["webdev", "programming"],
    },
    {
      title: "Solo founder struggles",
      desc: "Building a startup alone is hard. How do you guys manage motivation and avoid burnout?",
      tags: ["startups", "career"],
    },
    {
      title: "Cyberpunk 2077 Orion sequel expectations",
      desc: "What features are you most excited about for the upcoming Cyberpunk sequel?",
      tags: ["gaming"],
    },
    {
      title: "Is Rust worth learning for web backend?",
      desc: "I mainly use Node.js and Go. Is rewriting my backend in Rust going to give me noticeable benefits?",
      tags: ["programming", "webdev"],
    },
    {
      title: "Design system best practices",
      desc: "How do you structure your tokens and components to scale across multiple teams?",
      tags: ["design", "technology"],
    },
    {
      title: "WFH vs Return to Office",
      desc: "My company is forcing a 3-day RTO policy. Is anyone else dealing with this?",
      tags: ["career"],
    },
  ];
  const createdForums = [];
  for (const fd of forumData) {
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const forum = await prisma.forum.create({
      data: {
        title: fd.title,
        description: fd.desc,
        userId: user.id,
        tags: {
          create: fd.tags.map((tagName) => {
            const tag = createdTags.find((t) => t.name === tagName);
            return {
              tag: { connect: { id: tag.id } },
            };
          }),
        },
      },
    });
    createdForums.push(forum);
  }
  console.log("Creating comments and likes...");
  for (const forum of createdForums) {
    const numComments = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < numComments; i++) {
      const user =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const comment = await prisma.comment.create({
        data: {
          content: `This is a great point! I totally agree with the perspective on ${forum.title}. Thanks for sharing.`,
          forumId: forum.id,
          userId: user.id,
        },
      });
      const numCommentLikes = Math.floor(Math.random() * 4); // 0-3 likes
      const likers = [...createdUsers]
        .sort(() => 0.5 - Math.random())
        .slice(0, numCommentLikes);
      for (const liker of likers) {
        await prisma.commentLike.create({
          data: {
            commentId: comment.id,
            userId: liker.id,
          },
        });
      }
    }
    const numForumLikes = Math.floor(Math.random() * createdUsers.length);
    const forumLikers = [...createdUsers]
      .sort(() => 0.5 - Math.random())
      .slice(0, numForumLikes);
    for (const liker of forumLikers) {
      await prisma.forumLike.create({
        data: {
          forumId: forum.id,
          userId: liker.id,
        },
      });
    }
  }
  console.log("Seed completed successfully!");
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
