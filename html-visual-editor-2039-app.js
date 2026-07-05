document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "visual-editor-2039-code";
  const preview = document.getElementById("preview");
  const codeEditor = document.getElementById("codeEditor");
  const toast = document.getElementById("toast");
  const mainArea = document.getElementById("mainArea");
  const appRoot = document.getElementById("appRoot");
  const fileInput = document.getElementById("fileInput");

  const selectedInfo = document.getElementById("selectedInfo");
  const textInput = document.getElementById("textInput");
  const linkInput = document.getElementById("linkInput");
  const imageInput = document.getElementById("imageInput");
  const linkField = document.getElementById("linkField");
  const imageField = document.getElementById("imageField");
  const colorInput = document.getElementById("colorInput");
  const bgInput = document.getElementById("bgInput");
  const fontSizeInput = document.getElementById("fontSizeInput");
  const radiusInput = document.getElementById("radiusInput");
  const paddingInput = document.getElementById("paddingInput");
  const weightInput = document.getElementById("weightInput");
  const fontFamilyInput = document.getElementById("fontFamilyInput");
  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");
  const helpModal = document.getElementById("helpModal");
  const helpTitle = document.getElementById("helpTitle");
  const helpText = document.getElementById("helpText");
  const closeHelp = document.getElementById("closeHelp");

  let selectedElement = null;
  let isUpdatingFromPreview = false;
  let zoomLevel = 1;
  let undoStack = [];
  let redoStack = [];
  let historyLocked = false;

  const initialHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Editable Landing Page</title>
  <style>
    body { margin: 0; font-family: "Outfit", system-ui, sans-serif; background: #020617; color: #e2e8f0; }
    .page { padding: 56px 24px; }
    .hero {
      max-width: 1100px; margin: 0 auto; background: rgba(15,23,42,0.8);
      border: 1px solid rgba(148,163,184,0.15); border-radius: 28px; padding: 64px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.45); text-align: center;
    }
    .badge {
      display: inline-block; padding: 8px 14px;
      background: rgba(34,211,238,0.12); color: #22d3ee;
      border-radius: 999px; font-weight: 700; margin-bottom: 20px;
      border: 1px solid rgba(34,211,238,0.25);
    }
    h1 { font-size: 54px; line-height: 1.05; margin: 0 0 18px; letter-spacing: -1.5px;
      background: linear-gradient(90deg, #22d3ee, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { font-size: 18px; line-height: 1.7; color: #94a3b8; max-width: 720px; margin: 0 auto 30px; }
    .button {
      display: inline-block; padding: 15px 24px;
      background: linear-gradient(135deg, #22d3ee, #a78bfa); color: #020617;
      text-decoration: none; border-radius: 14px; font-weight: 700;
    }
    .features { max-width: 1100px; margin: 28px auto 0; display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
    .card {
      background: rgba(15,23,42,0.7); border: 1px solid rgba(148,163,184,0.12);
      border-radius: 20px; padding: 26px; box-shadow: 0 14px 34px rgba(0,0,0,0.3);
    }
    .card h3 { margin: 0 0 10px; font-size: 20px; }
    .card p { margin: 0; font-size: 15px; }
    @media (max-width: 800px) {
      .hero { padding: 38px 24px; } h1 { font-size: 36px; } .features { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="hero">
      <div class="badge">Visual Editor 2039</div>
      <h1>Build beautiful HTML visually</h1>
      <p>Create, edit, customize, and export clean HTML with a neural design workflow.</p>
      <a class="button" href="your-link-here">Start Editing</a>
    </section>
    <section class="features">
      <div class="card"><h3>Visual Editing</h3><p>Select any element and customize instantly.</p></div>
      <div class="card"><h3>Clean Code</h3><p>Edit HTML directly — everything stays synced.</p></div>
      <div class="card"><h3>Responsive</h3><p>Preview on desktop, tablet, and mobile.</p></div>
    </section>
  </main>
</body>
</html>`;

  const blocks = {
    hero: `<section style="background:rgba(15,23,42,0.85);border:1px solid rgba(148,163,184,0.15);border-radius:28px;padding:56px 32px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.4);margin:28px auto;max-width:1100px;"><div style="display:inline-block;background:rgba(34,211,238,0.12);color:#22d3ee;padding:8px 14px;border-radius:999px;font-weight:700;margin-bottom:18px;border:1px solid rgba(34,211,238,0.25);">New Section</div><h2 style="font-size:42px;margin:0 0 14px;color:#e2e8f0;">Create something impressive</h2><p style="color:#94a3b8;font-size:18px;line-height:1.7;max-width:680px;margin:0 auto 26px;">Use this block as a starting point for your landing page.</p><a href="your-link-here" style="display:inline-block;background:linear-gradient(135deg,#22d3ee,#a78bfa);color:#020617;padding:14px 22px;border-radius:14px;text-decoration:none;font-weight:700;">Learn More</a></section>`,
    features: `<section style="max-width:1100px;margin:28px auto;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;"><div style="background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.12);border-radius:20px;padding:26px;"><h3 style="color:#e2e8f0;">Fast Setup</h3><p style="color:#94a3b8;">Add polished blocks in seconds.</p></div><div style="background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.12);border-radius:20px;padding:26px;"><h3 style="color:#e2e8f0;">Easy Styling</h3><p style="color:#94a3b8;">Customize colors, spacing, typography.</p></div><div style="background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.12);border-radius:20px;padding:26px;"><h3 style="color:#e2e8f0;">Export Ready</h3><p style="color:#94a3b8;">Copy or download clean HTML anytime.</p></div></section>`,
    pricing: `<section style="max-width:420px;margin:28px auto;background:rgba(15,23,42,0.85);border:1px solid rgba(148,163,184,0.15);border-radius:24px;padding:32px;"><h2 style="margin:0 0 10px;color:#e2e8f0;">Pro Plan</h2><p style="color:#94a3b8;">Perfect for creators and businesses.</p><div style="font-size:42px;font-weight:800;margin:22px 0;color:#22d3ee;">$29</div><a href="your-link-here" style="display:block;text-align:center;background:linear-gradient(135deg,#22d3ee,#a78bfa);color:#020617;padding:14px;border-radius:14px;text-decoration:none;font-weight:700;">Choose Plan</a></section>`,
    cta: `<section style="max-width:1100px;margin:28px auto;background:linear-gradient(135deg,#0891b2,#7c3aed);color:#fff;border-radius:24px;padding:48px;text-align:center;"><h2 style="font-size:38px;margin:0 0 14px;">Ready to launch?</h2><p style="font-size:18px;opacity:.9;margin:0 auto 24px;max-width:620px;">Turn your idea into a responsive HTML section today.</p><a href="your-link-here" style="display:inline-block;background:#fff;color:#0891b2;padding:14px 22px;border-radius:14px;text-decoration:none;font-weight:800;">Get Started</a></section>`,
    testimonials: `<section style="max-width:1100px;margin:28px auto;"><h2 style="text-align:center;font-size:36px;margin-bottom:24px;color:#e2e8f0;">What clients say</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;"><div style="background:rgba(15,23,42,0.8);border-radius:22px;padding:26px;border:1px solid rgba(148,163,184,0.12);"><p style="color:#94a3b8;">"A clean and easy way to build landing blocks."</p><strong style="color:#e2e8f0;">Alex Morgan</strong></div><div style="background:rgba(15,23,42,0.8);border-radius:22px;padding:26px;border:1px solid rgba(148,163,184,0.12);"><p style="color:#94a3b8;">"The editor saves time and keeps code simple."</p><strong style="color:#e2e8f0;">Sarah Lee</strong></div><div style="background:rgba(15,23,42,0.8);border-radius:22px;padding:26px;border:1px solid rgba(148,163,184,0.12);"><p style="color:#94a3b8;">"Perfect for quick professional prototypes."</p><strong style="color:#e2e8f0;">Daniel Smith</strong></div></div></section>`,
    gallery: `<section style="max-width:1100px;margin:28px auto;"><h2 style="font-size:36px;text-align:center;margin-bottom:24px;color:#e2e8f0;">Project Gallery</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;"><img src="your-image-link-here" alt="Gallery" style="width:100%;height:220px;object-fit:cover;border-radius:20px;"><img src="your-image-link-here" alt="Gallery" style="width:100%;height:220px;object-fit:cover;border-radius:20px;"><img src="your-image-link-here" alt="Gallery" style="width:100%;height:220px;object-fit:cover;border-radius:20px;"></div></section>`,
    stats: `<section style="max-width:1100px;margin:28px auto;background:rgba(15,23,42,0.85);border:1px solid rgba(148,163,184,0.15);border-radius:24px;padding:36px;"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;text-align:center;"><div><strong style="font-size:38px;color:#22d3ee;">98%</strong><p style="color:#94a3b8;">Satisfaction</p></div><div><strong style="font-size:38px;color:#22d3ee;">120+</strong><p style="color:#94a3b8;">Projects</p></div><div><strong style="font-size:38px;color:#22d3ee;">24/7</strong><p style="color:#94a3b8;">Support</p></div><div><strong style="font-size:38px;color:#22d3ee;">5★</strong><p style="color:#94a3b8;">Rating</p></div></div></section>`,
    faq: `<section style="max-width:850px;margin:28px auto;"><h2 style="font-size:36px;text-align:center;margin-bottom:24px;color:#e2e8f0;">FAQ</h2><details style="background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.12);border-radius:18px;padding:18px 22px;margin-bottom:12px;"><summary style="font-weight:700;cursor:pointer;color:#e2e8f0;">Can I edit the HTML code?</summary><p style="color:#94a3b8;">Yes, switch to HTML Code mode and edit the full page.</p></details><details style="background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.12);border-radius:18px;padding:18px 22px;margin-bottom:12px;"><summary style="font-weight:700;cursor:pointer;color:#e2e8f0;">Can I export the design?</summary><p style="color:#94a3b8;">Yes, use Export to save as an HTML file.</p></details></section>`,
    contact: `<section style="max-width:680px;margin:28px auto;background:rgba(15,23,42,0.85);border:1px solid rgba(148,163,184,0.15);border-radius:24px;padding:34px;"><h2 style="font-size:34px;margin:0 0 10px;color:#e2e8f0;">Contact Us</h2><p style="color:#94a3b8;margin-bottom:22px;">Send us a message.</p><input placeholder="Your name" style="width:100%;padding:14px;border:1px solid rgba(148,163,184,0.2);border-radius:14px;margin-bottom:12px;background:rgba(2,6,23,0.5);color:#e2e8f0;"><input placeholder="Email" style="width:100%;padding:14px;border:1px solid rgba(148,163,184,0.2);border-radius:14px;margin-bottom:12px;background:rgba(2,6,23,0.5);color:#e2e8f0;"><textarea placeholder="Message" style="width:100%;padding:14px;border:1px solid rgba(148,163,184,0.2);border-radius:14px;min-height:120px;margin-bottom:12px;background:rgba(2,6,23,0.5);color:#e2e8f0;"></textarea><button style="width:100%;background:linear-gradient(135deg,#22d3ee,#a78bfa);color:#020617;padding:14px;border:none;border-radius:14px;font-weight:700;">Send</button></section>`,
    footer: `<footer style="max-width:1100px;margin:28px auto 0;background:rgba(2,6,23,0.9);color:#fff;border:1px solid rgba(148,163,184,0.15);border-radius:24px;padding:34px;"><div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;"><div><h3 style="margin:0 0 8px;">Your Brand</h3><p style="color:#94a3b8;margin:0;">Modern HTML sections for your website.</p></div><div><a href="your-link-here" style="color:#22d3ee;margin-right:16px;">Home</a><a href="your-link-here" style="color:#22d3ee;margin-right:16px;">Services</a><a href="your-link-here" style="color:#22d3ee;">Contact</a></div></div></footer>`
  };

  const helpContent = {
    general: { title: "How To Use", text: "Click an element in Visual Preview. Edit text, links, images, size, colors, fonts, and spacing from the inspector. Use Code mode for full HTML editing." },
    blocks: { title: "Blocks Panel", text: "Ready-made website blocks for fast insertion into your page." },
    preview: { title: "Visual Preview", text: "Use cyan resize handles to change size. Use the top grip to move the element." },
    htmlcode: { title: "HTML Code Mode", text: "Code mode opens the full HTML editor in the center area." },
    inspector: { title: "Design Inspector", text: "Changes the selected element. Links show URL field. Images show Image URL field." },
    fonts: { title: "Font Options", text: "System fonts that work without loading external files." }
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }

  function updateStats() {
    const lines = codeEditor.value.split("\n").length;
    document.getElementById("lineCount").textContent = lines + " line" + (lines === 1 ? "" : "s");
    document.getElementById("zoomLabel").textContent = Math.round(zoomLevel * 100) + "%";
    document.getElementById("statusTime").textContent = new Date().toLocaleTimeString();
  }

  function setModeUI(mode) {
    document.getElementById("statusMode").textContent = mode === "code" ? "Code mode" : "Visual mode";
    document.querySelectorAll('[data-action="showHtmlMode"]').forEach(function (b) {
      b.classList.toggle("active", mode === "code");
    });
    document.querySelectorAll('[data-action="showVisualMode"]').forEach(function (b) {
      b.classList.toggle("active", mode === "visual");
    });
  }

  function saveHistory() {
    if (historyLocked) return;
    const current = codeEditor.value;
    if (undoStack[undoStack.length - 1] !== current) undoStack.push(current);
    if (undoStack.length > 80) undoStack.shift();
    redoStack = [];
  }

  function undo() {
    if (undoStack.length < 2) { showToast("Nothing to undo"); return; }
    historyLocked = true;
    redoStack.push(undoStack.pop());
    codeEditor.value = undoStack[undoStack.length - 1];
    loadPreview(codeEditor.value);
    historyLocked = false;
    updateStats();
    showToast("Undo");
  }

  function redo() {
    if (!redoStack.length) { showToast("Nothing to redo"); return; }
    historyLocked = true;
    const next = redoStack.pop();
    undoStack.push(next);
    codeEditor.value = next;
    loadPreview(next);
    historyLocked = false;
    updateStats();
    showToast("Redo");
  }

  function loadPreview(html) {
    preview.srcdoc = html;
    updateStats();
  }

  function syncFromCode() {
    if (isUpdatingFromPreview) return;
    saveHistory();
    loadPreview(codeEditor.value);
    localStorage.setItem(STORAGE_KEY, codeEditor.value);
  }

  function syncFromPreview(save) {
    const doc = preview.contentDocument;
    if (!doc) return;
    cleanupEditorTools(doc);
    isUpdatingFromPreview = true;
    codeEditor.value = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
    isUpdatingFromPreview = false;
    if (save !== false) saveHistory();
    localStorage.setItem(STORAGE_KEY, codeEditor.value);
    updateStats();
  }

  function cleanupEditorTools(doc) {
    doc.querySelectorAll(".editor-resize-handle, .editor-move-handle, #editor-internal-style").forEach(function (item) { item.remove(); });
    doc.querySelectorAll("[data-editor-selected]").forEach(function (item) { item.removeAttribute("data-editor-selected"); });
  }

  function enablePreviewEditing() {
    const doc = preview.contentDocument;
    if (!doc || !doc.body) return;
    doc.body.contentEditable = true;
    doc.body.style.outline = "none";
    doc.body.style.zoom = zoomLevel;
    const style = doc.createElement("style");
    style.id = "editor-internal-style";
    style.innerHTML = [
      '[data-editor-selected="true"] { outline: 2px solid #22d3ee !important; outline-offset: 4px !important; box-shadow: 0 0 20px rgba(34,211,238,0.25) !important; }',
      '.editor-resize-handle { position:absolute !important; width:10px !important; height:10px !important; background:#22d3ee !important; border:2px solid #0f172a !important; border-radius:50% !important; z-index:999999 !important; box-shadow:0 0 12px rgba(34,211,238,0.6) !important; }',
      '.editor-move-handle { position:absolute !important; width:26px !important; height:18px !important; background:linear-gradient(135deg,#22d3ee,#a78bfa) !important; color:#020617 !important; border-radius:999px !important; z-index:999999 !important; display:grid !important; place-items:center !important; font-size:12px !important; cursor:move !important; box-shadow:0 0 16px rgba(34,211,238,0.5) !important; }',
      '.editor-resize-handle.nw,.editor-resize-handle.se { cursor:nwse-resize !important; }',
      '.editor-resize-handle.ne,.editor-resize-handle.sw { cursor:nesw-resize !important; }',
      '.editor-resize-handle.e,.editor-resize-handle.w { cursor:ew-resize !important; }',
      '.editor-resize-handle.n,.editor-resize-handle.s { cursor:ns-resize !important; }'
    ].join("");
    doc.head.appendChild(style);
    doc.addEventListener("click", function (event) {
      if (event.target.classList.contains("editor-resize-handle") || event.target.classList.contains("editor-move-handle")) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(event.target);
    });
    doc.addEventListener("input", function () { syncFromPreview(); });
    doc.addEventListener("scroll", function () { drawHandles(); });
    preview.contentWindow.addEventListener("resize", function () { drawHandles(); });
  }

  function selectElement(element) {
    const doc = preview.contentDocument;
    if (!element || element === doc.body || element === doc.documentElement) return;
    cleanupEditorTools(doc);
    selectedElement = element;
    selectedElement.setAttribute("data-editor-selected", "true");
    const computed = preview.contentWindow.getComputedStyle(selectedElement);
    const tag = selectedElement.tagName.toLowerCase();
    selectedInfo.textContent = "Selected: <" + tag + ">";
    textInput.value = selectedElement.children.length || tag === "img" ? "" : selectedElement.textContent.trim();
    colorInput.value = rgbToHex(computed.color);
    bgInput.value = rgbToHex(computed.backgroundColor);
    fontSizeInput.value = parseInt(computed.fontSize) || 16;
    radiusInput.value = parseInt(computed.borderRadius) || 0;
    paddingInput.value = parseInt(computed.paddingTop) || 0;
    weightInput.value = computed.fontWeight || "400";
    widthInput.value = parseInt(computed.width) || "";
    heightInput.value = parseInt(computed.height) || "";
    const family = computed.fontFamily || "'Outfit', system-ui, sans-serif";
    const fontOption = Array.from(fontFamilyInput.options).find(function (o) { return family.includes(o.text); });
    fontFamilyInput.value = fontOption ? fontOption.value : fontFamilyInput.options[0].value;
    const linkElement = selectedElement.closest("a");
    const isImage = tag === "img";
    linkField.classList.toggle("show", Boolean(linkElement));
    imageField.classList.toggle("show", isImage);
    linkInput.value = linkElement ? linkElement.getAttribute("href") || "" : "";
    imageInput.value = isImage ? selectedElement.getAttribute("src") || "" : "";
    drawHandles();
  }

  function drawHandles() {
    const doc = preview.contentDocument;
    if (!doc || !selectedElement) return;
    doc.querySelectorAll(".editor-resize-handle, .editor-move-handle").forEach(function (item) { item.remove(); });
    const rect = selectedElement.getBoundingClientRect();
    const scrollX = doc.defaultView.scrollX;
    const scrollY = doc.defaultView.scrollY;
    const points = {
      nw: [rect.left + scrollX, rect.top + scrollY],
      n: [rect.left + rect.width / 2 + scrollX, rect.top + scrollY],
      ne: [rect.right + scrollX, rect.top + scrollY],
      e: [rect.right + scrollX, rect.top + rect.height / 2 + scrollY],
      se: [rect.right + scrollX, rect.bottom + scrollY],
      s: [rect.left + rect.width / 2 + scrollX, rect.bottom + scrollY],
      sw: [rect.left + scrollX, rect.bottom + scrollY],
      w: [rect.left + scrollX, rect.top + rect.height / 2 + scrollY]
    };
    Object.entries(points).forEach(function (entry) {
      const direction = entry[0], position = entry[1];
      const handle = doc.createElement("div");
      handle.className = "editor-resize-handle " + direction;
      handle.dataset.direction = direction;
      handle.contentEditable = "false";
      handle.style.left = position[0] - 5 + "px";
      handle.style.top = position[1] - 5 + "px";
      doc.body.appendChild(handle);
      handle.addEventListener("mousedown", startResize);
    });
    const moveHandle = doc.createElement("div");
    moveHandle.className = "editor-move-handle";
    moveHandle.textContent = "↕";
    moveHandle.contentEditable = "false";
    moveHandle.style.left = rect.left + rect.width / 2 + scrollX - 13 + "px";
    moveHandle.style.top = rect.top + scrollY - 30 + "px";
    doc.body.appendChild(moveHandle);
    moveHandle.addEventListener("mousedown", startMove);
  }

  function startResize(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!selectedElement) return;
    const doc = preview.contentDocument;
    const direction = event.target.dataset.direction;
    const startX = event.clientX, startY = event.clientY;
    const startWidth = selectedElement.offsetWidth, startHeight = selectedElement.offsetHeight;
    function move(mouseEvent) {
      var newWidth = startWidth, newHeight = startHeight;
      if (direction.includes("e")) newWidth = startWidth + (mouseEvent.clientX - startX);
      if (direction.includes("w")) newWidth = startWidth - (mouseEvent.clientX - startX);
      if (direction.includes("s")) newHeight = startHeight + (mouseEvent.clientY - startY);
      if (direction.includes("n")) newHeight = startHeight - (mouseEvent.clientY - startY);
      selectedElement.style.width = Math.max(30, newWidth) + "px";
      selectedElement.style.height = Math.max(20, newHeight) + "px";
      widthInput.value = parseInt(selectedElement.style.width);
      heightInput.value = parseInt(selectedElement.style.height);
      drawHandles();
    }
    function stop() {
      doc.removeEventListener("mousemove", move);
      doc.removeEventListener("mouseup", stop);
      syncFromPreview();
    }
    doc.addEventListener("mousemove", move);
    doc.addEventListener("mouseup", stop);
  }

  function startMove(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!selectedElement) return;
    const doc = preview.contentDocument;
    const startX = event.clientX, startY = event.clientY;
    const computed = preview.contentWindow.getComputedStyle(selectedElement);
    const startLeft = parseInt(selectedElement.style.left || computed.left) || 0;
    const startTop = parseInt(selectedElement.style.top || computed.top) || 0;
    selectedElement.style.position = selectedElement.style.position || "relative";
    function move(mouseEvent) {
      selectedElement.style.left = startLeft + (mouseEvent.clientX - startX) + "px";
      selectedElement.style.top = startTop + (mouseEvent.clientY - startY) + "px";
      drawHandles();
    }
    function stop() {
      doc.removeEventListener("mousemove", move);
      doc.removeEventListener("mouseup", stop);
      syncFromPreview();
    }
    doc.addEventListener("mousemove", move);
    doc.addEventListener("mouseup", stop);
  }

  function applyStyle(property, value) {
    if (!selectedElement) { showToast("Select an element first"); return; }
    selectedElement.style[property] = value;
    syncFromPreview();
    selectElement(selectedElement);
  }

  function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) return "#ffffff";
    return "#" + result.slice(0, 3).map(function (n) {
      const hex = parseInt(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }

  function insertBlock(blockHTML) {
    const doc = preview.contentDocument;
    const target = doc.querySelector("main") || doc.body;
    target.insertAdjacentHTML("beforeend", blockHTML);
    syncFromPreview();
    showToast("Block added");
  }

  function insertSnippet(snippetHTML) {
    const doc = preview.contentDocument;
    if (selectedElement) selectedElement.insertAdjacentHTML("afterend", snippetHTML);
    else (doc.querySelector("main") || doc.body).insertAdjacentHTML("beforeend", snippetHTML);
    syncFromPreview();
    showToast("Element inserted");
  }

  function setDevice(device) {
    document.querySelectorAll("[data-device]").forEach(function (item) { item.classList.remove("active"); });
    preview.classList.remove("tablet", "mobile");
    const button = document.querySelector('[data-device="' + device + '"]');
    if (button) button.classList.add("active");
    if (device !== "desktop") preview.classList.add(device);
    showVisualMode();
  }

  function showHtmlMode() {
    mainArea.classList.add("html-mode");
    codeEditor.focus();
    setModeUI("code");
    showToast("Code mode");
  }

  function showVisualMode() {
    mainArea.classList.remove("html-mode");
    loadPreview(codeEditor.value);
    setModeUI("visual");
    showToast("Visual mode");
  }

  function deleteSelectedElement() {
    if (!selectedElement) { showToast("Select an element first"); return; }
    selectedElement.remove();
    selectedElement = null;
    selectedInfo.textContent = "No element selected";
    linkField.classList.remove("show");
    imageField.classList.remove("show");
    syncFromPreview();
    showToast("Element deleted");
  }

  function duplicateSelectedElement() {
    if (!selectedElement) { showToast("Select an element first"); return; }
    const clone = selectedElement.cloneNode(true);
    clone.removeAttribute("data-editor-selected");
    selectedElement.insertAdjacentElement("afterend", clone);
    syncFromPreview();
    showToast("Element duplicated");
  }

  function formatCode() {
    codeEditor.value = codeEditor.value.replace(/></g, ">\n<").replace(/\n\s*\n/g, "\n");
    syncFromCode();
    showToast("Code formatted");
  }

  function copyCode() {
    navigator.clipboard.writeText(codeEditor.value).then(function () { showToast("HTML copied"); });
  }

  function downloadFile() {
    const blob = new Blob([codeEditor.value], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "visual-editor-page.html";
    link.click();
    URL.revokeObjectURL(url);
    showToast("File downloaded");
  }

  function openFile() { fileInput.click(); }

  function newFile() {
    if (!confirm("Create a new page? Unsaved changes will be lost.")) return;
    codeEditor.value = initialHTML;
    loadPreview(initialHTML);
    undoStack = [initialHTML];
    redoStack = [];
    localStorage.setItem(STORAGE_KEY, initialHTML);
    showToast("New page created");
  }

  function printPage() {
    const win = window.open("", "_blank");
    win.document.open();
    win.document.write(codeEditor.value);
    win.document.close();
    setTimeout(function () { win.print(); }, 300);
  }

  function openExternalPreview() {
    const win = window.open("", "_blank");
    if (!win) { showToast("Please allow popups"); return; }
    win.document.open();
    win.document.write(codeEditor.value);
    win.document.close();
    showToast("Preview opened");
  }

  function insertImage() {
    insertSnippet('<img src="your-image-link-here" alt="Image" style="width:100%;max-width:520px;height:auto;border-radius:20px;">');
  }

  function insertLink() {
    insertSnippet('<a href="your-link-here" style="color:#22d3ee;font-weight:700;">New Link</a>');
  }

  function zoomIn() {
    zoomLevel = Math.min(1.6, zoomLevel + 0.1);
    const doc = preview.contentDocument;
    if (doc && doc.body) doc.body.style.zoom = zoomLevel;
    drawHandles();
    updateStats();
    showToast("Zoom in");
  }

  function zoomOut() {
    zoomLevel = Math.max(0.6, zoomLevel - 0.1);
    const doc = preview.contentDocument;
    if (doc && doc.body) doc.body.style.zoom = zoomLevel;
    drawHandles();
    updateStats();
    showToast("Zoom out");
  }

  function moveSelected(direction) {
    if (!selectedElement) { showToast("Select an element first"); return; }
    selectedElement.style.position = selectedElement.style.position || "relative";
    const left = parseInt(selectedElement.style.left) || 0;
    const top = parseInt(selectedElement.style.top) || 0;
    const step = 8;
    if (direction === "up") selectedElement.style.top = top - step + "px";
    if (direction === "down") selectedElement.style.top = top + step + "px";
    if (direction === "left") selectedElement.style.left = left - step + "px";
    if (direction === "right") selectedElement.style.left = left + step + "px";
    if (direction === "reset") { selectedElement.style.left = "0px"; selectedElement.style.top = "0px"; }
    syncFromPreview();
    selectElement(selectedElement);
  }

  function openHelp(key) {
    const content = helpContent[key] || helpContent.general;
    helpTitle.textContent = content.title;
    helpText.textContent = content.text;
    helpModal.classList.add("show");
  }

  function runAction(action) {
    if (action === "newFile") newFile();
    if (action === "openFile") openFile();
    if (action === "copyCode") copyCode();
    if (action === "downloadFile") downloadFile();
    if (action === "printPage") printPage();
    if (action === "formatCode") formatCode();
    if (action === "deleteSelected") deleteSelectedElement();
    if (action === "duplicateSelected") duplicateSelectedElement();
    if (action === "showHtmlMode") showHtmlMode();
    if (action === "showVisualMode") showVisualMode();
    if (action === "openExternalPreview") openExternalPreview();
    if (action === "undo") undo();
    if (action === "redo") redo();
    if (action === "insertImage") insertImage();
    if (action === "insertLink") insertLink();
    if (action === "zoomIn") zoomIn();
    if (action === "zoomOut") zoomOut();
  }

  textInput.addEventListener("input", function () {
    if (!selectedElement) return;
    if (!selectedElement.children.length && selectedElement.tagName.toLowerCase() !== "img") {
      selectedElement.textContent = textInput.value;
      syncFromPreview();
      drawHandles();
    }
  });
  linkInput.addEventListener("input", function () {
    if (!selectedElement) return;
    const link = selectedElement.closest("a");
    if (link) { link.setAttribute("href", linkInput.value || "your-link-here"); syncFromPreview(); }
  });
  imageInput.addEventListener("input", function () {
    if (!selectedElement || selectedElement.tagName.toLowerCase() !== "img") return;
    selectedElement.setAttribute("src", imageInput.value || "your-image-link-here");
    syncFromPreview();
    drawHandles();
  });
  colorInput.addEventListener("input", function () { applyStyle("color", colorInput.value); });
  bgInput.addEventListener("input", function () { applyStyle("backgroundColor", bgInput.value); });
  fontSizeInput.addEventListener("input", function () { applyStyle("fontSize", fontSizeInput.value + "px"); });
  radiusInput.addEventListener("input", function () { applyStyle("borderRadius", radiusInput.value + "px"); });
  paddingInput.addEventListener("input", function () { applyStyle("padding", paddingInput.value + "px"); });
  weightInput.addEventListener("change", function () { applyStyle("fontWeight", weightInput.value); });
  fontFamilyInput.addEventListener("change", function () { applyStyle("fontFamily", fontFamilyInput.value); });
  widthInput.addEventListener("input", function () { if (widthInput.value) applyStyle("width", widthInput.value + "px"); });
  heightInput.addEventListener("input", function () { if (heightInput.value) applyStyle("height", heightInput.value + "px"); });
  codeEditor.addEventListener("input", syncFromCode);
  preview.addEventListener("load", enablePreviewEditing);

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      codeEditor.value = ev.target.result;
      loadPreview(codeEditor.value);
      undoStack = [codeEditor.value];
      redoStack = [];
      localStorage.setItem(STORAGE_KEY, codeEditor.value);
      showToast("File loaded");
    };
    reader.readAsText(file);
    fileInput.value = "";
  });

  document.querySelectorAll("[data-block]").forEach(function (button) {
    button.addEventListener("click", function () { insertBlock(blocks[button.dataset.block]); });
  });
  document.querySelectorAll("[data-device]").forEach(function (button) {
    button.addEventListener("click", function () { setDevice(button.dataset.device); });
  });
  document.querySelectorAll("[data-help]").forEach(function (button) {
    button.addEventListener("click", function () { openHelp(button.dataset.help); });
  });
  document.querySelectorAll("[data-move]").forEach(function (button) {
    button.addEventListener("click", function () { moveSelected(button.dataset.move); });
  });
  document.querySelectorAll("[data-action]").forEach(function (button) {
    button.addEventListener("click", function () { runAction(button.dataset.action); });
  });
  closeHelp.addEventListener("click", function () { helpModal.classList.remove("show"); });
  helpModal.addEventListener("click", function (event) {
    if (event.target === helpModal) helpModal.classList.remove("show");
  });

  appRoot.addEventListener("mousemove", function (e) {
    const rect = appRoot.getBoundingClientRect();
    appRoot.style.setProperty("--mesh-x", ((e.clientX - rect.left) / rect.width) * 100 + "%");
    appRoot.style.setProperty("--mesh-y", ((e.clientY - rect.top) / rect.height) * 100 + "%");
  });

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "s") { e.preventDefault(); downloadFile(); }
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.key === "z" && e.shiftKey) || e.key === "y") { e.preventDefault(); redo(); }
    }
  });

  const saved = localStorage.getItem(STORAGE_KEY);
  codeEditor.value = saved || initialHTML;
  undoStack = [codeEditor.value];
  loadPreview(codeEditor.value);
  setModeUI("visual");
});
