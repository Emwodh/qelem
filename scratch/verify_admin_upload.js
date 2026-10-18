const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "C:\\Users\\emwod\\.gemini\\antigravity\\brain\\03093170-e7e7-429a-acab-b419cdd81e22";

async function run() {
  console.log("Launching headless Chrome for admin question upload verification...");
  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9232",
    "--user-data-dir=C:\\Users\\emwod\\AppData\\Local\\Temp\\chrome_admin_upload_verify",
    "--no-first-run",
    "--disable-features=Translate",
    "about:blank",
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const versionRes = await fetch("http://127.0.0.1:9232/json/list");
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

    console.log("Visiting /admin/questions...");
    await sendCommand("Page.navigate", { url: "http://localhost:3000/admin/questions" });
    await new Promise((r) => setTimeout(r, 3500));

    const shotAdmin = await sendCommand("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACT_DIR, "screenshot_admin_file_upload.png"), Buffer.from(shotAdmin.data, "base64"));
    console.log("Captured screenshot_admin_file_upload.png");

    ws.close();
    console.log("Verification finished successfully!");
  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    chrome.kill();
  }
}

run();
