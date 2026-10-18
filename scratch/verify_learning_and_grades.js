const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "C:\\Users\\emwod\\.gemini\\antigravity\\brain\\03093170-e7e7-429a-acab-b419cdd81e22";

async function run() {
  console.log("Launching headless Chrome for learning & grade verification...");
  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9231",
    "--user-data-dir=C:\\Users\\emwod\\AppData\\Local\\Temp\\chrome_learn_verify",
    "--no-first-run",
    "--disable-features=Translate",
    "about:blank",
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const versionRes = await fetch("http://127.0.0.1:9231/json/list");
    const targets = await versionRes.json();
    const pageTarget = targets.find((t) => t.type === "page") || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((resolve) => (ws.onopen = resolve));

    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const cmdId = id++;
        callbacks.set(cmdId, { resolve, reject });
        ws.send(JSON.stringify({ id: cmdId, method, params }));
      });
    }

    await sendCommand("Page.enable");
    await sendCommand("Runtime.enable");

    await sendCommand("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // 1. Visit /dashboard
    console.log("1. Visiting /dashboard...");
    await sendCommand("Page.navigate", { url: "http://localhost:3000/dashboard" });
    await new Promise((r) => setTimeout(r, 3000));
    const shotDash = await sendCommand("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACT_DIR, "screenshot_dashboard_grade_switch.png"), Buffer.from(shotDash.data, "base64"));
    console.log("Captured screenshot_dashboard_grade_switch.png");

    // Click Grade 9 button on dashboard
    console.log("Clicking Grade 9 button on dashboard...");
    const clickResult = await sendCommand("Runtime.evaluate", {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().startsWith('Gr. 9'));
        if (btn) {
          btn.click();
          return "Clicked Gr. 9 button: " + btn.textContent.trim();
        }
        return "Button not found";
      })()`
    });
    console.log("Evaluation result:", clickResult.result?.value);
    await new Promise((r) => setTimeout(r, 1200));
    const shotDashGr9 = await sendCommand("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACT_DIR, "screenshot_dashboard_gr9_selected.png"), Buffer.from(shotDashGr9.data, "base64"));
    console.log("Captured screenshot_dashboard_gr9_selected.png");

    // 2. Visit /learn?grade=9
    console.log("2. Visiting /learn?grade=9...");
    await sendCommand("Page.navigate", { url: "http://localhost:3000/learn?grade=9" });
    await new Promise((r) => setTimeout(r, 2500));
    const shotLearnGr9 = await sendCommand("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACT_DIR, "screenshot_learn_grade9.png"), Buffer.from(shotLearnGr9.data, "base64"));
    console.log("Captured screenshot_learn_grade9.png");

    // Open first lesson modal in Grade 9
    console.log("Opening Grade 9 lesson reader...");
    const modalClickResult = await sendCommand("Runtime.evaluate", {
      expression: `(() => {
        const card = document.querySelector('[data-lesson-card="true"]');
        if (card) {
          card.click();
          return "Clicked lesson card: " + card.querySelector('h3')?.textContent;
        }
        return "Card not found";
      })()`
    });
    console.log("Modal click result:", modalClickResult.result?.value);
    await new Promise((r) => setTimeout(r, 1500));
    const shotLessonReader = await sendCommand("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACT_DIR, "screenshot_lesson_reader_gr9.png"), Buffer.from(shotLessonReader.data, "base64"));
    console.log("Captured screenshot_lesson_reader_gr9.png");

    // 3. Visit /learn?grade=12
    console.log("3. Visiting /learn?grade=12...");
    await sendCommand("Page.navigate", { url: "http://localhost:3000/learn?grade=12" });
    await new Promise((r) => setTimeout(r, 2500));
    const shotLearnGr12 = await sendCommand("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACT_DIR, "screenshot_learn_grade12_matric.png"), Buffer.from(shotLearnGr12.data, "base64"));
    console.log("Captured screenshot_learn_grade12_matric.png");

    ws.close();
    console.log("All verifications captured successfully!");
  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    chrome.kill();
  }
}

run();
