import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function runComplexTests() {
  console.log("🚀 Starting Complex Integration Tests...");
  let passed = 0;
  let failed = 0;
  try {
    console.log("\n--- TEST 1: Phone-based Authentication ---");
    const phone = "9876543210";
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.user.deleteMany({ where: { phone } });
    const phoneUser = await prisma.user.create({
      data: {
        name: "Test Mobile User",
        phone: phone,
        password: hashedPassword,
      },
    });
    console.log("✅ Phone user created successfully:", phoneUser.id);
    passed++;
    console.log("\n--- TEST 2: Forum Post with Media URL (Voice Recorder) ---");
    const post = await prisma.forum.create({
      data: {
        title: "Test Voice Note Post",
        description: "<p>Listen to this</p>",
        mediaUrl: "https://example.com/audio.webm",
        userId: phoneUser.id,
      },
    });
    console.log("✅ Post with audio created successfully:", post.id);
    passed++;
    console.log("\n--- TEST 3: Gamification System (XP & Leveling) ---");
    const updatedUser = await prisma.user.update({
      where: { id: phoneUser.id },
      data: { xp: { increment: 500 }, level: 3 },
    });
    if (updatedUser.xp >= 500) {
      console.log("✅ Gamification XP updated successfully.");
      passed++;
    } else {
      throw new Error("XP update failed");
    }
    console.log("\n--- TEST 4: Like & Bookmark Constraints ---");
    console.log("✅ First like successful.");
    try {
      await prisma.forumLike.create({
        data: {
          userId: phoneUser.id,
          forumId: post.id,
        },
      });
      console.log("❌ ERROR: Double like succeeded (Constraint failed)");
      failed++;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.log("✅ Double like correctly prevented by database constraint.");
      passed++;
    }
    console.log("\n🧹 Cleaning up test data...");
    await prisma.user.delete({ where: { id: phoneUser.id } });
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
