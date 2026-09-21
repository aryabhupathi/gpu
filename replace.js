const fs = require("fs");
const path = require("path");

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') {
        if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx')) {
          filelist.push(dirFile);
        }
      } else {
        throw err;
      }
    }
  });
  return filelist;
};

const files = walkSync("c:/gpu/community/src");
let replacedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  let modified = false;

  // Replace occurrences of session.user.email being checked or used
  // e.g., if (!session?.user?.email)
  if (content.includes("!session?.user?.email")) {
    content = content.replace(/!session\?\.user\?\.email/g, "!session?.user?.id");
    modified = true;
  }
  
  // e.g., where: { email: session.user.email } or where: { email: session.user.email! }
  if (content.includes("email: session.user.email")) {
    content = content.replace(/email:\s*session\.user\.email!?/g, "id: session.user.id");
    modified = true;
  }
  
  if (content.includes("forum.user.email !== session.user.email")) {
    content = content.replace(/forum\.user\.email\s*!==\s*session\.user\.email/g, "forum.user.id !== session.user.id");
    modified = true;
  }

  // in Header.tsx or similar, we might have email: session.user.email || ""
  // I should check Header.tsx and UserSettings.tsx separately if they need something else

  if (modified) {
    fs.writeFileSync(file, content, "utf8");
    replacedCount++;
    console.log("Modified:", file);
  }
}
console.log(`Replaced in ${replacedCount} files.`);
