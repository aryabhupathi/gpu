const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Generating massive dataset...');
  
  // We'll keep existing data and just add more!
  const hash = await bcrypt.hash('password123', 10);

  console.log('Creating 20 new users...');
  const newUsers = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        name: `Community Member ${i}`,
        password: hash,
      }
    });
    newUsers.push(user);
  }

  // Get all users in DB so we can randomly assign them
  const allUsers = await prisma.user.findMany();

  console.log('Creating tags...');
  const tagNames = ['react', 'nextjs', 'javascript', 'typescript', 'backend', 'frontend', 'database', 'devops', 'cloud', 'mobile', 'ios', 'android', 'flutter', 'react-native', 'career', 'interview', 'salary', 'remote-work', 'productivity', 'health', 'finance', 'investing', 'crypto', 'bitcoin', 'ethereum', 'web3', 'machine-learning', 'data-science', 'python', 'java', 'csharp', 'dotnet', 'rust', 'golang', 'ruby', 'php', 'laravel', 'vue', 'angular', 'svelte'];
  const createdTags = [];
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    createdTags.push(tag);
  }

  console.log('Creating 60 forums...');
  const forumTemplates = [
    { title: 'How to learn {topic} fast?', desc: 'I want to master {topic} in the next 3 months. What are the best resources, courses, or projects I should build to get a job using {topic}?' },
    { title: 'Is {topic} still relevant in 2026?', desc: 'I keep hearing mixed opinions about {topic}. Some say it is dying, others say it is growing. What is the actual industry trend for {topic} right now?' },
    { title: 'My honest review of {topic} after using it for 2 years', desc: 'I have been using {topic} in production for a while now. Here are my thoughts on what is great and what completely sucks about it.' },
    { title: 'Best practices for scalable {topic} architecture', desc: 'When building large scale applications, how do you structure your {topic} codebase? I want to avoid massive technical debt.' },
    { title: 'Help! I am stuck with a weird {topic} bug', desc: 'Has anyone encountered this strange issue with {topic}? It only happens on production and works perfectly on localhost. I am going crazy.' }
  ];

  const createdForums = [];
  for (let i = 0; i < 60; i++) {
    const user = allUsers[Math.floor(Math.random() * allUsers.length)];
    const template = forumTemplates[Math.floor(Math.random() * forumTemplates.length)];
    
    // Pick 1-3 random tags
    const numTags = Math.floor(Math.random() * 3) + 1;
    const forumTags = [...createdTags].sort(() => 0.5 - Math.random()).slice(0, numTags);
    const primaryTopic = forumTags[0].name;

    const title = template.title.replace(/\{topic\}/g, primaryTopic);
    const desc = template.desc.replace(/\{topic\}/g, primaryTopic);

    // Spread createdAt over the past 30 days
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30));

    const forum = await prisma.forum.create({
      data: {
        title,
        description: desc,
        userId: user.id,
        createdAt: pastDate,
        tags: {
          create: forumTags.map(tag => ({
            tag: { connect: { id: tag.id } }
          }))
        }
      }
    });
    createdForums.push(forum);
  }

  console.log('Creating comments and likes...');
  const commentTemplates = [
    "I completely agree with this.",
    "This is a great perspective, I haven't thought about it this way.",
    "I've had the opposite experience to be honest.",
    "Can you provide more details on how you solved that?",
    "Thanks for sharing! This helped me a lot.",
    "I think the documentation for this is terrible, but the community is great.",
    "I prefer using an alternative, but this is solid.",
    "Following this thread for answers.",
    "You should check out the official docs, they updated them recently.",
    "I built a side project with this and it was an amazing experience."
  ];

  // Batch inserts to speed things up
  for (const forum of createdForums) {
    // 5-15 comments per forum
    const numComments = Math.floor(Math.random() * 11) + 5;
    for (let i = 0; i < numComments; i++) {
      const user = allUsers[Math.floor(Math.random() * allUsers.length)];
      const content = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      
      // Comment date should be after forum creation
      const commentDate = new Date(forum.createdAt);
      commentDate.setHours(commentDate.getHours() + Math.floor(Math.random() * 48));

      const comment = await prisma.comment.create({
        data: {
          content,
          forumId: forum.id,
          userId: user.id,
          createdAt: commentDate
        }
      });

      // 0-10 likes per comment
      const numCommentLikes = Math.floor(Math.random() * 10);
      const likers = [...allUsers].sort(() => 0.5 - Math.random()).slice(0, numCommentLikes);
      for (const liker of likers) {
        await prisma.commentLike.create({
          data: {
            commentId: comment.id,
            userId: liker.id
          }
        }).catch(() => {}); // ignore duplicates
      }
    }

    // 5-25 likes per forum
    const numForumLikes = Math.floor(Math.random() * 21) + 5;
    const forumLikers = [...allUsers].sort(() => 0.5 - Math.random()).slice(0, numForumLikes);
    for (const liker of forumLikers) {
      await prisma.forumLike.create({
        data: {
          forumId: forum.id,
          userId: liker.id
        }
      }).catch(() => {}); // ignore duplicates
    }
  }

  console.log('Massive seed completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
