const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function runComplexTests() {
  console.log("🚀 Starting Complex Integration Tests...");
  let passed = 0;
  let failed = 0;

  try {
    // 1. Test: Phone-based User Creation (The new feature)
    console.log("\n--- TEST 1: Phone-based Authentication ---");
    const phone = "9876543210";
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    // Cleanup if exists
    await prisma.user.deleteMany({ where: { phone } });

    const phoneUser = await prisma.user.create({
      data: {
        name: "Test Mobile User",
        phone: phone,
        password: hashedPassword,
      }
    });
    console.log("✅ Phone user created successfully:", phoneUser.id);
    passed++;

    // 2. Test: Forum Post Creation with Audio (The new feature)
    console.log("\n--- TEST 2: Forum Post with Media URL (Voice Recorder) ---");
    const post = await prisma.forum.create({
      data: {
        title: "Test Voice Note Post",
        description: "<p>Listen to this</p>",
        mediaUrl: "https://example.com/audio.webm",
        userId: phoneUser.id,
      }
    });
    console.log("✅ Post with audio created successfully:", post.id);
    passed++;

    // 3. Test: Gamification Logic (XP & Levels)
    console.log("\n--- TEST 3: Gamification System (XP & Leveling) ---");
    // Simulate getting 500 XP
    const updatedUser = await prisma.user.update({
      where: { id: phoneUser.id },
      data: { xp: { increment: 500 }, level: 3 } // Mock level up
    });
    if (updatedUser.xp >= 500) {
      console.log("✅ Gamification XP updated successfully.");
      passed++;
    } else {
      throw new Error("XP update failed");
    }

    // 4. Test: Advanced Query Constraints (Likes & Bookmarks)
    console.log("\n--- TEST 4: Like & Bookmark Constraints ---");
    const like = await prisma.forumLike.create({
      data: {
        userId: phoneUser.id,
        forumId: post.id
      }
    });
    console.log("✅ First like successful.");
    
    try {
      // Trying to double like should fail because of @@unique constraint
      await prisma.forumLike.create({
        data: {
          userId: phoneUser.id,
          forumId: post.id
        }
      });
      console.log("❌ ERROR: Double like succeeded (Constraint failed)");
      failed++;
    } catch (e) {
      console.log("✅ Double like correctly prevented by database constraint.");
      passed++;
    }

    // Cleanup Test Data
    console.log("\n🧹 Cleaning up test data...");
    await prisma.user.delete({ where: { id: phoneUser.id } }); // Cascades to posts, likes
    console.log("✅ Cleanup successful.");

  } catch (error) {
    console.error("❌ TEST RUN FAILED:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
    console.log(`\n📊 RESULTS: ${passed} Passed | ${failed} Failed`);
  }
}

runComplexTests();
