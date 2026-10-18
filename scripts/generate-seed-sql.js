const fs = require("fs");
const path = require("path");

// Transpile curriculumData with ts or extract
const content = fs.readFileSync(path.join(__dirname, "../src/lib/curriculumData.ts"), "utf8");

// Extract the CURRICULUM_QUESTIONS array string
const match = content.match(/export const CURRICULUM_QUESTIONS:\s*ExamQuestion\[\]\s*=\s*(\[[\s\S]*?\]);\s*\n/);
if (!match) {
  console.error("Could not match CURRICULUM_QUESTIONS array");
  process.exit(1);
}

// Convert typescript array string to JS evaluable string
let rawArray = match[1];

// Evaluate the array safely in VM
const vm = require("vm");
const script = new vm.Script("questions = " + rawArray);
const sandbox = { questions: [] };
vm.createContext(sandbox);
script.runInContext(sandbox);

const questions = sandbox.questions;
console.log(`Parsed ${questions.length} questions from curriculumData.ts`);

function escapeSql(str) {
  if (str === null || str === undefined) return "NULL";
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return "NULL";
  return "$json$" + JSON.stringify(obj) + "$json$::jsonb";
}

let sql = `-- ==============================================================================
-- QELEM MATRIC PREP — SEED QUESTIONS
-- Run this in your Supabase SQL Editor to populate the initial question bank.
-- ==============================================================================

`;

for (const q of questions) {
  const stream = (q.subjectId === "math-nat" || q.subjectId === "physics" || q.subjectId === "chemistry" || q.subjectId === "biology") ? "natural" : "social";
  const difficulty = q.difficulty === "foundation" ? "easy" : q.difficulty === "advanced" ? "hard" : "medium";
  
  sql += `INSERT INTO public.questions (
  id, subject, stream, grade_level, unit_number, unit_title,
  exam_year, difficulty, prompt, options, correct_option_id,
  explanation, distractor_analysis, examiner_insight
) VALUES (
  ${escapeSql(q.id)},
  ${escapeSql(q.subject)},
  ${escapeSql(stream)},
  ${q.grade || 12},
  ${q.unitNumber || 1},
  ${escapeSql(q.unitTitle || "General")},
  ${escapeSql(q.examYear || "EUEE 2016 E.C.")},
  ${escapeSql(difficulty)},
  ${escapeSql(q.prompt)},
  ${escapeJson(q.options)},
  ${escapeSql(q.correctOptionId)},
  ${escapeSql(q.explanation)},
  ${escapeJson(q.distractorAnalysis || null)},
  ${escapeSql(q.examinerInsight || null)}
) ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation;

`;
}

const outPath = path.join(__dirname, "../supabase/seed_questions.sql");
fs.writeFileSync(outPath, sql, "utf8");
console.log(`Successfully generated ${outPath} with ${questions.length} questions!`);
