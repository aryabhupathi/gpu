import prisma from "./prisma";

const BADGE_RULES = [
  { name: "Novice", xpRequired: 50, icon: "🥉" },
  { name: "Regular", xpRequired: 200, icon: "🥈" },
  { name: "Veteran", xpRequired: 500, icon: "🥇" },
  { name: "Legend", xpRequired: 1000, icon: "👑" },
];

export async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, badges: true }
  });

  if (!user) return;

  const currentBadges = user.badges ? user.badges.split(",") : [];
  let newBadges = [...currentBadges];
  let awarded = false;

  for (const rule of BADGE_RULES) {
    const badgeString = `${rule.icon} ${rule.name}`;
    if (user.xp >= rule.xpRequired && !currentBadges.includes(badgeString)) {
      newBadges.push(badgeString);
      awarded = true;
    }
  }

  if (awarded) {
    await prisma.user.update({
      where: { id: userId },
      data: { badges: newBadges.join(",") }
    });
  }
}
