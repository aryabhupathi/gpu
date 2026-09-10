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
  const newBadges = [...currentBadges];
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

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 10)) + 1;
}

export function getXpForNextLevel(level: number): number {
  return Math.pow(level, 2) * 10;
}

export function getLevelName(level: number): string {
  if (level >= 20) return "Legend";
  if (level >= 10) return "Veteran";
  if (level >= 5) return "Regular";
  return "Novice";
}
