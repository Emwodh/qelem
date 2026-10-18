const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "../supabase/seed_questions.sql"), "utf8");

// Look for '...'::jsonb
const matches = content.matchAll(/'([\s\S]*?)'::jsonb/g);
let count = 0;
let errors = 0;

for (const match of matches) {
  count++;
  const raw = match[1];
  // Replace SQL escaped quotes '' with '
  const unescapedSql = raw.replace(/''/g, "'");
  try {
    JSON.parse(unescapedSql);
  } catch (err) {
    errors++;
    console.error(`Error in literal #${count}:`, err.message);
    console.error(`Preview:`, unescapedSql.slice(0, 120));
  }
}

console.log(`Finished: ${count} JSON literals checked, ${errors} errors.`);
