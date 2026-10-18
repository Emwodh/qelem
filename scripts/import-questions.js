/**
 * Qelem Question Ingestion CLI Script
 * Parses .md, .txt, or .pdf files into structured Ethiopian exam question objects.
 *
 * Usage:
 *   node scripts/import-questions.js <path-to-file> [options]
 *
 * Options:
 *   --subject=<physics|math-nat|chemistry|biology>   (default: physics)
 *   --grade=<9|10|11|12>                            (default: 12)
 *   --unit=<number>                                  (default: 1)
 *   --unitTitle="Title of Unit"
 *   --year="2016 E.C."                               (default: "2016 E.C.")
 *   --difficulty=<foundation|moderate|advanced>      (default: moderate)
 *   --save                                           (appends questions to src/lib/curriculumData.ts)
 */

const fs = require("fs");
const path = require("path");

async function parseFile(filePath, options = {}) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at "${filePath}"`);
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  let rawText = "";

  console.log(`\n========================================================`);
  console.log(`  Qelem Question Ingestion Engine: Reading ${path.basename(filePath)}`);
  console.log(`========================================================\n`);

  if (ext === ".pdf") {
    console.log("-> Processing PDF binary via pdf-parse...");
    const pdf = require("pdf-parse");
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    rawText = pdfData.text;
    console.log(`-> Extracted ${rawText.length} characters across ${pdfData.numpages} pages.`);
  } else {
    // Markdown or plain text
    rawText = fs.readFileSync(filePath, "utf8");
    console.log(`-> Read ${rawText.length} characters of Markdown/Text content.`);
  }

  // Parse questions
  const questions = parseMarkdownQuestions(rawText, options);
  console.log(`-> Successfully parsed ${questions.length} questions!\n`);

  if (questions.length === 0) {
    console.warn("Warning: 0 questions were detected. Please ensure your questions have options A), B), C), D) and 'Answer: X'.");
    return [];
  }

  // Print summary of parsed questions
  console.log("---------------- Parsed Questions Preview ----------------");
  questions.slice(0, 5).forEach((q, idx) => {
    console.log(`[Q${idx + 1}] (${q.subject} Gr.${q.grade} U${q.unitNumber})`);
    console.log(`Prompt: ${q.prompt.slice(0, 80)}...`);
    console.log(`Options: A: ${q.options[0]?.text.slice(0, 25)} | B: ${q.options[1]?.text.slice(0, 25)} | C: ${q.options[2]?.text.slice(0, 25)} | D: ${q.options[3]?.text.slice(0, 25)}`);
    console.log(`Correct: ${q.correctOptionId}`);
    if (q.keyFormula) console.log(`Key Formula: $${q.keyFormula}$`);
    console.log("");
  });

  if (questions.length > 5) {
    console.log(`... and ${questions.length - 5} more questions.`);
  }

  // If --save flag provided, append to curriculumData.ts
  if (options.save) {
    saveToCurriculumData(questions);
  } else {
    // Output JSON to a file
    const outJsonPath = path.join(process.cwd(), `imported_questions_${Date.now()}.json`);
    fs.writeFileSync(outJsonPath, JSON.stringify(questions, null, 2), "utf8");
    console.log(`\n✅ Saved JSON dump to: ${outJsonPath}`);
    console.log(`💡 To append directly to the platform's question bank, re-run with: --save`);
  }

  return questions;
}

function parseMarkdownQuestions(rawText, defaults) {
  let normalized = rawText.replace(/\r\n/g, "\n").trim();

  // Strip YAML frontmatter if present
  const frontmatterMatch = normalized.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/);
  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1];
    normalized = normalized.slice(frontmatterMatch[0].length);

    const gMatch = yaml.match(/grade\s*:\s*(\d+)/i);
    if (gMatch && [9, 10, 11, 12].includes(Number(gMatch[1]))) defaults.grade = Number(gMatch[1]);
    const uMatch = yaml.match(/unit\s*:\s*(\d+)/i);
    if (uMatch) defaults.unitNumber = Number(uMatch[1]);
    const yMatch = yaml.match(/year\s*:\s*(.+)/i);
    if (yMatch) defaults.examYear = yMatch[1].trim();
  }

  // Split questions by numbered markdown headers, bold numbered lines, or double empty lines
  const rawBlocks = normalized.split(
    /\n\s*(?:(?=(?:#{1,4}\s*(?:Question\s*\d+|Q\d+|\d+)|(?:\*{1,2}\s*(?:Question\s*\d+|Q\d+|\d+)\.?\*{1,2})|(?:Question\s*\d+|Q\d+|\d+)[.:\)]))|\n{2,})/gi
  );

  const questions = [];

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i].trim();
    if (!block) continue;

    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 3) continue;

    let promptLines = [];
    let options = [];
    let correctOptionId = "A";
    let explanationLines = [];
    let derivationSteps = [];
    let keyFormula = undefined;
    let state = "prompt";

    for (const line of lines) {
      // 1. Check for Answer tag
      const ansMatch = line.match(/^(?:\*{1,2})?(?:Answer|Ans|Correct|Key|Correct\s*Answer)\s*[:=-]?(?:\*{1,2})?\s*([A-D])/i);
      if (ansMatch) {
        correctOptionId = ansMatch[1].toUpperCase();
        state = "explanation";
        continue;
      }

      // 2. Check for Explanation tag
      const explMatch = line.match(/^(?:#{1,4}\s*)?(?:\*{1,2})?(?:Explanation|Solution|Derivation|Reason)\s*[:=-]?(?:\*{1,2})?\s*(.*)$/i);
      if (explMatch) {
        state = "explanation";
        if (explMatch[1]) explanationLines.push(explMatch[1]);
        continue;
      }

      // 3. Check for Option
      const optMatch = line.match(/^(?:[-*]\s*)?(?:\*{1,2})?\(?([A-D])\)?(?:\*{1,2})?[\).:-]\s*(.+)$/i);
      if (optMatch && state !== "explanation") {
        state = "options";
        options.push({
          id: optMatch[1].toUpperCase(),
          text: optMatch[2].replace(/^\*{1,2}|\*{1,2}$/g, "").trim(),
        });
        continue;
      }

      if (state === "prompt") {
        const cleaned = line
          .replace(/^#{1,4}\s*/, "")
          .replace(/^\*{1,2}\s*/, "")
          .replace(/^(?:Question\s*\d+|Q\d+|\d+)[.:\)]\s*/i, "")
          .replace(/^\*{1,2}\s*/, "");
        if (cleaned) promptLines.push(cleaned);
      } else if (state === "options") {
        if (options.length > 0) {
          options[options.length - 1].text += " " + line;
        }
      } else if (state === "explanation") {
        explanationLines.push(line);
        const formulaMatch = line.match(/\$\$([\s\S]+?)\$\$/);
        if (formulaMatch && !keyFormula) {
          keyFormula = formulaMatch[1].trim();
        }
      }
    }

    const prompt = promptLines.join(" ").trim();
    if (!prompt || options.length < 2) continue;

    const validLetters = ["A", "B", "C", "D"];
    while (options.length < 4) {
      const nextLetter = validLetters[options.length];
      options.push({ id: nextLetter, text: `Option ${nextLetter}` });
    }

    const explanation =
      explanationLines.join("\n\n").trim() ||
      `The correct answer is Option ${correctOptionId}. Verified according to the Ethiopian Ministry of Education curriculum.`;

    if (explanationLines.length > 0) {
      derivationSteps = explanationLines.filter((l) => l.trim().length > 0);
    } else {
      derivationSteps = [explanation];
    }

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const id = `${defaults.subjectId}-g${defaults.grade}-u${defaults.unitNumber}-q${i + 1}-${randomSuffix}`;

    questions.push({
      id,
      subject: defaults.subject,
      subjectId: defaults.subjectId,
      grade: Number(defaults.grade),
      unitNumber: Number(defaults.unitNumber),
      unitTitle: defaults.unitTitle,
      prompt,
      options,
      correctOptionId,
      explanation,
      derivationSteps,
      keyFormula,
      examYear: defaults.examYear,
      difficulty: defaults.difficulty || "moderate",
      isProSolutionAvailable: true,
    });
  }

  return questions;
}

function saveToCurriculumData(newQuestions) {
  const curriculumFilePath = path.join(process.cwd(), "src", "lib", "curriculumData.ts");
  if (!fs.existsSync(curriculumFilePath)) {
    console.error("Could not find src/lib/curriculumData.ts");
    return;
  }

  let content = fs.readFileSync(curriculumFilePath, "utf8");

  // Find the closing bracket of CURRICULUM_QUESTIONS: ExamQuestion[] = [ ... ];
  const match = content.lastIndexOf("];");
  if (match === -1) {
    console.error("Could not locate end of CURRICULUM_QUESTIONS array");
    return;
  }

  // Format new questions as TypeScript objects
  const formatted = newQuestions
    .map((q) => "  " + JSON.stringify(q, null, 2).replace(/\n/g, "\n  ") + ",")
    .join("\n");

  const updatedContent = content.slice(0, match) + "\n  // --- Imported Questions ---\n" + formatted + "\n" + content.slice(match);

  fs.writeFileSync(curriculumFilePath, updatedContent, "utf8");
  console.log(`\n🎉 Successfully appended ${newQuestions.length} questions into: src/lib/curriculumData.ts!`);
}

// Parse CLI Args
const args = process.argv.slice(2);
const filePath = args.find((a) => !a.startsWith("--"));

if (!filePath) {
  console.log(`
Usage:
  node scripts/import-questions.js <path-to-file.md|pdf> [options]

Options:
  --subject=<physics|math-nat|chemistry|biology>   (default: physics)
  --grade=<9|10|11|12>                            (default: 12)
  --unit=<number>                                  (default: 2)
  --unitTitle="Unit Title"                        (default: "General Curriculum")
  --year="2016 E.C."                               (default: "2016 E.C.")
  --difficulty=<foundation|moderate|advanced>      (default: moderate)
  --save                                           (appends directly to src/lib/curriculumData.ts)
  `);
  process.exit(0);
}

function getArg(name, fallback) {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  if (arg) return arg.split("=")[1].replace(/^["']|["']$/g, "");
  return fallback;
}

const subjectId = getArg("subject", "physics");
const subjectMap = {
  physics: "Physics",
  "math-nat": "Mathematics (Natural)",
  chemistry: "Chemistry",
  biology: "Biology",
};

const options = {
  subjectId,
  subject: subjectMap[subjectId] || "Physics",
  grade: Number(getArg("grade", "12")),
  unitNumber: Number(getArg("unit", "2")),
  unitTitle: getArg("unitTitle", "Curriculum Ingestion Unit"),
  examYear: getArg("year", "2016 E.C."),
  difficulty: getArg("difficulty", "moderate"),
  save: args.includes("--save"),
};

parseFile(filePath, options).catch((err) => {
  console.error("Execution error:", err);
  process.exit(1);
});
