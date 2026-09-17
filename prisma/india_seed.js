import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  console.log("Starting realistic India seed...");
  const tagNames = [
    "Cricket",
    "Bollywood",
    "Tech",
    "Bengaluru",
    "Startups",
    "Politics",
    "Movies",
    "Food",
  ];
  const tags = {};
  for (const name of tagNames) {
    tags[name] = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  const password = await bcrypt.hash("password123", 10);
  const usersData = [
    {
      name: "Rahul S.",
      email: "rahul@example.com",
      password,
      level: 5,
      xp: 450,
      badges: "🥉 Novice,🥈 Regular",
    },
    {
      name: "Priya Desai",
      email: "priya@example.com",
      password,
      level: 8,
      xp: 820,
      badges: "🥇 Veteran",
    },
    {
      name: "Amit Kumar",
      email: "amit@example.com",
      password,
      level: 3,
      xp: 200,
      badges: "🥉 Novice",
    },
    {
      name: "Sneha Reddy",
      email: "sneha@example.com",
      password,
      level: 12,
      xp: 1400,
      badges: "👑 Legend",
    },
    {
      name: "Vikram Bhai",
      email: "vikram@example.com",
      password,
      level: 6,
      xp: 550,
      badges: "🥈 Regular",
    },
  ];
  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
    users.push(user);
  }
  const forumsData = [
    {
      title: "Is Virat Kohli's cover drive the most aesthetic shot in cricket?",
      description:
        "<p>Bro seriously, I was watching the highlights yesterday and that cover drive is just pure poetry. No other batsman even comes close rn. Thoughts?</p>",
      userId: users[0].id,
      tagNames: ["Cricket"],
      likes: [users[1].id, users[2].id, users[3].id],
    },
    {
      title: "Bengaluru traffic is getting out of hand... again",
      description:
        "<p>Took me 2 hours to cross Silk Board today. When is the metro actually going to fix this? WFH needs to be permanent tbh.</p>",
      userId: users[2].id,
      tagNames: ["Bengaluru", "Tech"],
      likes: [users[0].id, users[4].id],
    },
    {
      title: "Just saw Kalki 2898 AD - absolute cinematic masterpiece!",
      description:
        "<p>The VFX was actually insane for an Indian movie. Finally we are making good sci-fi. Prabhas and Amitabh Bachchan killed it! Who else watched it?</p>",
      userId: users[1].id,
      tagNames: ["Bollywood", "Movies"],
      likes: [users[0].id, users[3].id, users[4].id],
    },
    {
      title: "Why are Indian startups forcing return to office?",
      description:
        "<p>Notice how every big startup in HSR layout is suddenly mandating 5 days WFO? It makes zero sense for software devs. We were way more productive at home.</p>",
      userId: users[3].id,
      tagNames: ["Startups", "Tech"],
      likes: [users[2].id],
    },
  ];
  const forums = [];
  for (const f of forumsData) {
    const forum = await prisma.forum.create({
      data: {
        title: f.title,
        description: f.description,
        userId: f.userId,
        tags: {
          create: f.tagNames.map((name) => ({
            tag: { connect: { id: tags[name].id } },
          })),
        },
      },
    });
    for (const likerId of f.likes) {
      await prisma.forumLike.create({
        data: { forumId: forum.id, userId: likerId },
      });
    }
    forums.push(forum);
  }
  const commentsData = [
    {
      forumId: forums[0].id,
      userId: users[1].id,
      content:
        "💯 agree! Though Babar's is good, Kohli's is just built different.",
    },
    {
      forumId: forums[0].id,
      userId: users[4].id,
      content:
        "Bhai Sachin's straight drive > Kohli's cover drive. Don't at me.",
    },
    {
      forumId: forums[1].id,
      userId: users[3].id,
      content: "Lmaooo Silk Board is a myth. You just enter and never leave.",
    },
    {
      forumId: forums[1].id,
      userId: users[0].id,
      content:
        "Honestly I just started taking the Rapido bike taxis. Saves me an hour easily.",
    },
    {
      forumId: forums[2].id,
      userId: users[4].id,
      content:
        "First half was a bit slow yaar, but the climax made up for it completely!",
    },
    {
      forumId: forums[2].id,
      userId: users[2].id,
      content: "Amitabh Bachchan stole the show. What a legend.",
    },
    {
      forumId: forums[3].id,
      userId: users[0].id,
      content:
        "It's all about micromanagement and justifying the real estate cost. Classic.",
    },
    {
      forumId: forums[3].id,
      userId: users[1].id,
      content:
        "We are doing hybrid 3 days a week and even that feels too much sometimes 😭",
    },
  ];
  for (const c of commentsData) {
    await prisma.comment.create({ data: c });
  }
  console.log("Database seeded with realistic Indian data!");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
