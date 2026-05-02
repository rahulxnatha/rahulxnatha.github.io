/* portfolio.js — updated:
   - compact highlights use '.' separator (e.g. p-1.2.s-3)
   - openDetails(id, activate = true) to avoid intermediate activation during restore
   - initFromURL opens highlights without activating; then activates only the final id
   - other existing behavior preserved
*/

/* ---------- utility helpers ---------- */
function escapeHTML(str) {
  return String(str ?? "").replace(/[&<>"']/g, s => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s]);
}
function softWrapTokens(str) {
  let s = String(str ?? "");
  s = s.replace(/https:\/\/www\.linkedin\.com\/in(?!\[\[WBR\]\])/g, "https://www.linkedin.com/in[[WBR]]");
  s = s.replace(/https:\/\/linkedin\.com\/in(?!\[\[WBR\]\])/g, "https://linkedin.com/in[[WBR]]");
  s = s.replace(/https:\/\/www\.(?!\[\[WBR\]\])/g, "https://www.[[WBR]]");
  s = s.replace(/https:\/\/(?!\[\[WBR\]\])/g, "https://[[WBR]]");
  s = s.replace(/@gmail\.com(?!\[\[WBR\]\])/g, "[[WBR]]@gmail.com");
  s = s.replace(/@rahulnatha\.com(?!\[\[WBR\]\])/g, "[[WBR]]@rahulnatha.com");
  return s;
}
function htmlWithSoftWraps(str) {
  const withTokens = softWrapTokens(str);
  return escapeHTML(withTokens).replace(/\[\[WBR\]\]/g, "<wbr>");
}
function toBulletListHTML(desc) {
  const norm = String(desc ?? "").replace(/\r\n/g, "\n").trim();
  if (!norm) return "";
  const segments = norm.split(/\n\s*\n/g);
  const items = [];
  for (let seg of segments) {
    let t = seg.trim();
    if (!t) continue;
    t = t.replace(/^[\u2022•\-\*]+\s*/, "");
    items.push(`<li>${htmlWithSoftWraps(t)}</li>`);
  }
  if (!items.length) return "";
  return `<ul class="bullet-list">${items.join("")}</ul>`;
}

/* ---------- data loading (unchanged) ---------- */
async function loadWorkbook() {
  // replicate your existing sheet loading logic (you can replace URL constants as needed)
  // NOTE: adapt SHEET_XLSX_URL / LOCAL_FALLBACK to your environment if different
  const SHEET_XLSX_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQweOKrkGkkqFH_Qy1rstZU-ZvqmoYGcHv7eRkl-8kPeqHAs3jhFjU5X4MUE_MbLwYRjkxLp8yuyd0m/pub?output=xlsx";
  const LOCAL_FALLBACK = "portfolio-fallback.xlsx";
  try {
    const resp = await fetch(SHEET_XLSX_URL, { cache: "no-store" });
    if (!resp.ok) throw new Error("Remote XLSX not OK");
    const buf = await resp.arrayBuffer();
    return XLSX.read(buf, { type: "array" });
  } catch (e) {
    console.warn("Remote sheet load failed, falling back:", e);
  }
  const resp2 = await fetch(LOCAL_FALLBACK);
  if (!resp2.ok) throw new Error("Local fallback xlsx not found");
  const buf2 = await resp2.arrayBuffer();
  return XLSX.read(buf2, { type: "array" });
}
function sheetRows(wb, name) {
  const ws = wb.Sheets[name];
  if (!ws) return [];
  return XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });
}

/* ---------- data structures & ID scheme ---------- */
const detailRegistry = { work: [], skill: [], certification: [], projects: [], contact: [] };
const detailMap = new Map();
let currentDetailId = null;

/* Strict compact prefixes (1-letter) -> full section name mapping */
const SECTION_PREFIX = { projects: "p", skill: "s", work: "w", hero: "h", certification: "c", contact: "a" };
const PREFIX_SECTION = Object.fromEntries(Object.entries(SECTION_PREFIX).map(([k,v]) => [v,k]));

/* registerDetail: create full ids "projects-1" (1-based) */
function registerDetail(section, title, briefHtml, fallbackHtml) {
  if (!detailRegistry[section]) detailRegistry[section] = [];
  const idx = detailRegistry[section].length + 1; // 1-based
  const id = `${section}-${idx}`; // e.g. "projects-1"
  const item = { id, section, title: title || "Untitled", briefHtml: briefHtml || "", fallbackHtml: fallbackHtml || "" };
  detailRegistry[section].push(item);
  detailMap.set(id, item);
  return id;
}

/* ---------- compact highlights parser / encoder using '.' as separator ----------
   Format used:
     highlights=p-1.2.s-3   -> open projects 1 and 2, skill 3
     id must be compact form as full id "projects-1" (we use full ids internally)
   NOTE: This is strict — only compact form accepted.
*/
function parseHighlightsCompact(compactStr) {
  if (!compactStr) return [];
  // split on '.'; dot acts as the single-character spacer between tokens
  // But tokens may include prefix groups like "p-1" and continuations like "2" after prefix tokens.
  const rawParts = compactStr.split(".").map(s => s.trim()).filter(Boolean);
  const out = [];
  let currentPrefix = null;
  for (const part of rawParts) {
    const explicit = part.match(/^([a-zA-Z])-(\d+)$/);
    if (explicit) {
      currentPrefix = explicit[1].toLowerCase();
      const sec = PREFIX_SECTION[currentPrefix];
      if (sec) out.push(`${sec}-${String(Number(explicit[2]))}`);
      continue;
    }
    // continuation number after previous prefix: e.g. 'p-1.2.3' -> tokens: 'p-1','2','3'
    const cont = part.match(/^(\d+)$/);
    if (cont && currentPrefix) {
      const sec = PREFIX_SECTION[currentPrefix];
      if (sec) out.push(`${sec}-${String(Number(cont[1]))}`);
      continue;
    }
    // fallback: ignore unknown tokens (strict mode)
  }
  return Array.from(new Set(out));
}

function encodeHighlightsCompact(fullIds) {
  if (!Array.isArray(fullIds) || !fullIds.length) return "";
  const groups = {}; // prefix -> array of numbers
  for (const id of fullIds) {
    if (!id) continue;
    const m = id.match(/^([a-zA-Z0-9_]+)-(\d+)$/);
    if (!m) continue;
    const section = m[1];
    const num = String(Number(m[2]));
    const prefix = SECTION_PREFIX[section];
    if (!prefix) continue;
    groups[prefix] = groups[prefix] || [];
    groups[prefix].push(num);
  }
  // produce ordering by prefix key insertion order (if you want custom ordering, sort keys)
  const parts = [];
  for (const pref of Object.keys(groups)) {
    parts.push(`${pref}-${groups[pref].join(".")}`); // use '.' inside numbers list
  }
  return parts.join("."); // groups separated by '.'
}

/* ---------- details pane UI ---------- */
function initDetailsPane() {
  const pane = document.getElementById("details-pane");
  const titleEl = document.getElementById("details-title");
  const contentEl = document.getElementById("details-content");
  const btnMin = document.getElementById("details-min");
  const btnMax = document.getElementById("details-max");
  const btnClose = document.getElementById("details-close");
  const searchInput = document.getElementById("details-search");
  const dropdown = document.getElementById("details-dropdown");
  const tabsBar = document.getElementById("details-tabs");
  let openTabs = [];

  function getAllItems() {
    const all = []; Object.values(detailRegistry).forEach(list => list.forEach(i => all.push(i))); return all;
  }
  function renderDropdown(filterText) {
    const allItems = getAllItems();
    const q = (filterText || "").toLowerCase();
    let matches = allItems;
    if (q) matches = allItems.filter(it => it.title.toLowerCase().includes(q));
    if (!matches.length) dropdown.innerHTML = `<div class="details-option-empty">The searched content is currently unavailable.</div>`;
    else {
      dropdown.innerHTML = matches.map(it => `<div class="details-option" data-detail-id="${escapeHTML(it.id)}">${escapeHTML(it.title)}</div>`).join("");
    }
    dropdown.classList.add("open");
  }
  function createTabElement(item) {
    const tabEl = document.createElement("div");
    tabEl.className = "details-tab";
    tabEl.dataset.id = item.id;
    tabEl.innerHTML = `${escapeHTML(item.title)}<span class="details-tab-close">×</span>`;
    return tabEl;
  }

  // openDetails accepts flag `activate` (default true). When restoring highlights we set activate=false.
  function openDetails(rawId, activate = true) {
    const id = String(rawId);
    const item = detailMap.get(id);
    if (!item) return;
    pane.classList.add("open");
    pane.classList.remove("minimized");

    let tab = openTabs.find(t => t.id === id);
    if (!tab) {
      const html = item.briefHtml && item.briefHtml.trim() ? item.briefHtml : item.fallbackHtml || "<p>No additional details.</p>";
      tab = { id, title: item.title, html };
      openTabs.push(tab);
      const tabEl = createTabElement(item);
      tabsBar.appendChild(tabEl);
    }

    if (activate) activateTab(id);

    // only highlight/scroll when activation requested (to avoid overwriting final activation during bulk restore)
    if (activate) {
      setTimeout(() => {
        document.querySelectorAll(".tile-active").forEach(el => el.classList.remove("tile-active"));
        const tileEl = document.querySelector(`[data-detail-id="${id}"]`);
        if (tileEl) { tileEl.classList.add("tile-active"); tileEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }); }
      }, 40);
    }
  }

  function activateTab(rawId) {
    const id = String(rawId);
    openTabs.forEach(t => {
      const el = tabsBar.querySelector(`[data-id="${t.id}"]`);
      if (!el) return;
      el.classList.toggle("active", t.id === id);
    });
    const tab = openTabs.find(t => t.id === id);
    if (!tab) return;
    contentEl.innerHTML = tab.html;
    currentDetailId = id;

    setTimeout(() => {
      document.querySelectorAll(".tile-active").forEach(el => el.classList.remove("tile-active"));
      const tileEl = document.querySelector(`[data-detail-id="${id}"]`);
      if (tileEl) { tileEl.classList.add("tile-active"); tileEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }); }
      const tabsContainer = document.querySelector(".details-tabs-container");
      const tabEl = tabsBar.querySelector(`[data-id="${id}"]`);
      if (tabEl && tabsContainer) {
        const containerRect = tabsContainer.getBoundingClientRect();
        const tabRect = tabEl.getBoundingClientRect();
        const currentScroll = tabsContainer.scrollLeft;
        const offset = (tabRect.left - containerRect.left) + (tabRect.width / 2) - (containerRect.width / 2);
        tabsContainer.scrollTo({ left: currentScroll + offset, behavior: "smooth" });
      }
    }, 30);
  }

  // expose helpers
  window.openDetails = openDetails;
  window.activateTab = activateTab;
  window.getOpenTabIds = () => openTabs.map(t => t.id);

  // tabs click/close
  tabsBar.addEventListener("click", e => {
    const closeBtn = e.target.closest(".details-tab-close");
    if (closeBtn) {
      const parent = closeBtn.closest(".details-tab");
      const id = String(parent.dataset.id);
      parent.remove();
      openTabs = openTabs.filter(t => t.id !== id);
      if (currentDetailId === id) {
        if (openTabs.length) activateTab(openTabs[openTabs.length - 1].id);
        else {
          currentDetailId = null;
          contentEl.innerHTML = `<p style="font-size:.85rem;opacity:.8;">Select a tile to view its details.</p>`;
          document.querySelectorAll(".tile-active").forEach(el => el.classList.remove("tile-active"));
        }
      }
      return;
    }
    const tab = e.target.closest(".details-tab");
    if (tab) activateTab(tab.dataset.id);
  });

  // click on page tile should open details (activate)
  document.addEventListener("click", e => {
    const target = e.target.closest("[data-detail-id]");
    if (target) openDetails(String(target.dataset.detailId), true);
  });

  dropdown.addEventListener("click", e => {
    const opt = e.target.closest(".details-option");
    if (!opt) return;
    openDetails(String(opt.dataset.detailId), true);
    dropdown.classList.remove("open");
  });

  // search
  searchInput.addEventListener("focus", function () {
    this.select();
    searchInput.parentElement.classList.add("active");
    renderDropdown(searchInput.value.trim());
  });
  searchInput.addEventListener("blur", () => {
    setTimeout(() => { dropdown.classList.remove("open"); searchInput.parentElement.classList.remove("active"); }, 150);
  });
  searchInput.addEventListener("mouseup", e => e.preventDefault());
  searchInput.addEventListener("input", () => renderDropdown(searchInput.value.trim()));
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const allItems = getAllItems();
      const q = searchInput.value.trim().toLowerCase();
      const match = allItems.find(it => it.title.toLowerCase().includes(q));
      if (match) openDetails(match.id, true);
      else { dropdown.classList.remove("open"); contentEl.innerHTML = `<p style="font-size:.85rem;opacity:.75;">The searched content is currently unavailable.</p>`; }
    }
  });

  // pane controls
  btnClose.addEventListener("click", () => pane.classList.remove("open", "minimized", "maximized"));
  btnMin.addEventListener("click", () => { if (!pane.classList.contains("open")) pane.classList.add("open"); pane.classList.toggle("minimized"); pane.classList.remove("maximized"); });
  btnMax.addEventListener("click", () => { if (!pane.classList.contains("open")) pane.classList.add("open"); pane.classList.toggle("maximized"); pane.classList.remove("minimized"); });
}

/* ---------- pane state helper ---------- */
function getPaneStateFromDOM() {
  const pane = document.getElementById("details-pane");
  if (!pane) return "clo";
  if (!pane.classList.contains("open")) return "clo";
  if (pane.classList.contains("minimized")) return "min";
  if (pane.classList.contains("maximized")) return "max";
  return "doc";
}

/* ---------- URL sync using compact '.' format and event-driven readiness ---------- */
function updateURL() {
  try {
    const params = new URLSearchParams();
    const activeEl = document.querySelector("#details-tabs .details-tab.active");
    const activeId = (window.currentDetailId && String(window.currentDetailId)) || (activeEl?.dataset?.id ? String(activeEl.dataset.id) : null);
    if (activeId) params.set("id", activeId);

    const highlightIds = (typeof window.getOpenTabIds === "function") ? window.getOpenTabIds().map(String) : Array.from(document.querySelectorAll("#details-tabs .details-tab")).map(t => String(t.dataset.id)).filter(Boolean);
    const compact = encodeHighlightsCompact(highlightIds);
    if (compact) params.set("highlights", compact);

    params.set("dps", getPaneStateFromDOM());
    const searchInput = document.getElementById("details-search");
    if (searchInput?.value && searchInput.value.trim()) params.set("search", searchInput.value.trim());
    const theme = document.body.classList.contains("theme-light") ? "light" : "dark";
    params.set("theme", theme);

    history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  } catch (err) {
    console.warn("updateURL error", err);
  }
}

function waitForDetailsReady(timeout = 30000) {
  return new Promise(resolve => {
    const helpersReady = (typeof window.openDetails === "function" && typeof window.activateTab === "function");
    const dataReady = (typeof detailMap !== "undefined" && detailMap && typeof detailMap.size === "number" && detailMap.size > 0);
    if (helpersReady || dataReady || window.__detailsReady) return resolve(true);
    let finished = false;
    const onReady = () => { if (finished) return; finished = true; cleanup(); resolve(true); };
    const onTimeout = () => { if (finished) return; finished = true; cleanup(); resolve(false); };
    const cleanup = () => { document.removeEventListener("details-ready", onReady); clearTimeout(timer); };
    document.addEventListener("details-ready", onReady, { once: true });
    const timer = setTimeout(onTimeout, timeout);
  });
}

async function initFromURL() {
  try {
    await waitForDetailsReady(30000);
    const params = new URLSearchParams(window.location.search);
    const rawHighlights = params.get("highlights") || "";
    const highlights = parseHighlightsCompact(rawHighlights); // e.g. ["projects-1","projects-2","skill-3"]
    const rawId = params.get("id") || null;
    // Strict: id must be full internal id form e.g. "projects-1"
    const id = rawId && /^[a-zA-Z]+-\d+$/.test(rawId) ? rawId : null;
    const dps = params.get("dps");
    const search = params.get("search") || "";
    const theme = params.get("theme");

    // theme
    if (theme === "light" || theme === "dark") {
      if (typeof applyThemeState === "function") try { applyThemeState(theme, { withTransition: false }); } catch (e) {}
      else if (theme === "light") document.body.classList.add("theme-light"); else document.body.classList.remove("theme-light");
    }

    const searchInput = document.getElementById("details-search");
    if (searchInput) searchInput.value = search;

    // open highlights WITHOUT activating them (avoid intermediate tile highlight)
    if (highlights.length) {
      const opener = (typeof window.openDetails === "function") ? window.openDetails : (hid => {
        const el = document.querySelector(`[data-detail-id="${hid}"]`); if (el && typeof el.click === "function") el.click();
      });
      highlights.forEach(h => { try { opener(String(h), false); } catch (e) {} });
    }

    // only now activate the requested id (if present)
    if (id) {
      if (typeof window.activateTab === "function") { try { window.activateTab(String(id)); } catch (e) {} }
      else { const tabEl = document.querySelector(`#details-tabs [data-id="${id}"]`); if (tabEl && typeof tabEl.click === "function") tabEl.click(); }
    }

    // pane state
    const pane = document.getElementById("details-pane");
    if (pane) {
      pane.classList.remove("open","minimized","maximized");
      if (!(dps === "clo" || !dps)) { pane.classList.add("open"); if (dps === "min") pane.classList.add("minimized"); else if (dps === "max") pane.classList.add("maximized"); }
    }

    // canonicalize URL to the compact format
    setTimeout(updateURL, 60);
  } catch (err) { console.warn("initFromURL error", err); }
}

/* wire URL updates */
let __urlUpdateTimer = null;
function scheduleURLUpdate(delay = 200) { clearTimeout(__urlUpdateTimer); __urlUpdateTimer = setTimeout(updateURL, delay); }
document.addEventListener("click", scheduleURLUpdate);
document.addEventListener("input", scheduleURLUpdate);
document.addEventListener("change", scheduleURLUpdate);

/* ---------- basic DOM builders for tiles (kept similar to your previous version) ---------- */
function populateHero(rows) {
  if (!rows.length) return; const row = rows[0]; const nameEl = document.querySelector(".hero-name"); if (nameEl) nameEl.textContent = row.Name || "Rahul Natha";
  const subEl = document.querySelector(".hero-sub"); if (subEl && row.Title) subEl.textContent = row.Title;
  const chip = document.querySelector(".hero-chip-bottom span"); if (chip && row.Tags) chip.textContent = row.Tags;
}
function populateWork(rows) {
  const container = document.getElementById("timeline-items"); if (!container) return; container.innerHTML = "";
  rows.forEach(row => { if (!row.Title) return;
    const join = row.Join||""; const exit = row.Exit||""; const org = row.Org||""; const desc = row.Description||""; const brief = row.Brief||"";
    const timeRange = (join && exit) ? `${join} – ${exit}` : (join || exit);
    const metaParts = []; if (timeRange) metaParts.push(`<div>${htmlWithSoftWraps(timeRange)}</div>`); if (org) metaParts.push(`<div>${htmlWithSoftWraps(org)}</div>`);
    if (row.Type) metaParts.push(`<div>${htmlWithSoftWraps(row.Type)}</div>`);
    const bodyHtml = toBulletListHTML(desc) || `<p>${htmlWithSoftWraps(desc)}</p>`;
    const itemEl = document.createElement("div"); itemEl.className = "timeline-item";
    itemEl.innerHTML = `<div class="timeline-meta">${metaParts.join("")}</div><div class="timeline-main"><div class="timeline-role"><b>${escapeHTML(row.Title)}</b></div><div class="timeline-body">${bodyHtml}</div></div>`;
    const detailId = registerDetail("work", row.Title, brief, bodyHtml);
    itemEl.dataset.detailId = detailId;
    container.appendChild(itemEl);
  });
}
function createSkillTile(row) {
  const article = document.createElement("article");
  const title = row.Skill || row.Category || "Skill"; const brief = row.Brief || ""; const bodyHtml = htmlWithSoftWraps(row.Description || "");
  const detailId = registerDetail("skill", title, brief, bodyHtml);
  article.dataset.detailId = detailId;
  article.innerHTML = `<div class="article-bolt bl"></div><div class="article-bolt br"></div><h3>${escapeHTML(title)}</h3><div class="meta-line">${htmlWithSoftWraps(row.Category||"")}</div><div class="body">${bodyHtml}</div>`;
  return article;
}
function populateSkills(rows) { const grid = document.getElementById("skills-grid"); if (!grid) return; grid.innerHTML = ""; rows.forEach(row => { if (!row.Skill && !row.Category) return; grid.appendChild(createSkillTile(row)); }); }
function createCertTile(row) {
  const article = document.createElement("article"); const title = row.Title || "Certification"; const meta = [row.Issuer || "", row["Issue date"] || "", row.Validity || ""].filter(Boolean).join(" · "); const bodyHtml = htmlWithSoftWraps(row.Description || "");
  const detailId = registerDetail("certification", title, row.Brief||"", bodyHtml); article.dataset.detailId = detailId;
  article.innerHTML = `<div class="article-bolt bl"></div><div class="article-bolt br"></div><h3>${escapeHTML(title)}</h3><div class="meta-line">${htmlWithSoftWraps(meta)}</div><div class="body">${bodyHtml}</div>`;
  return article;
}
function populateCerts(rows) { const grid = document.getElementById("cert-grid"); if (!grid) return; grid.innerHTML = ""; rows.forEach(row => { if (!row.Title) return; grid.appendChild(createCertTile(row)); }); }
function createProjectTile(row) {
  const article = document.createElement("article"); const title = row.Title || "Project"; const brief = row.Brief||""; const bodyHtml = htmlWithSoftWraps(row.Description||""); const detailId = registerDetail("projects", title, brief, bodyHtml);
  article.dataset.detailId = detailId;
  article.innerHTML = `<div class="article-bolt bl"></div><div class="article-bolt br"></div><h3>${escapeHTML(title)}</h3><div class="meta-line">${htmlWithSoftWraps([row.Tools||"", row.Tech||""].filter(Boolean).join(" · "))}</div><div class="body">${bodyHtml}</div>`;
  return article;
}
function populateProjects(rows) { const grid = document.getElementById("projects-grid"); if (!grid) return; grid.innerHTML = ""; rows.forEach(row => { if (!row.Title) return; grid.appendChild(createProjectTile(row)); }); }
function createContactTile(row) { const article = document.createElement("article"); const title = row.Mode || row.Label || "Contact"; const bodyHtml = htmlWithSoftWraps((row.Address||"") + (row.Extra ? ` — ${row.Extra}` : "")); const detailId = registerDetail("contact", title, row.Brief||"", bodyHtml); article.dataset.detailId = detailId; article.innerHTML = `<div class="article-bolt bl"></div><div class="article-bolt br"></div><h3>${escapeHTML(title)}</h3><div class="meta-line">${htmlWithSoftWraps(row.Address||"")}</div><div class="body">${bodyHtml}</div>`; return article; }
function populateContact(rows) { const grid = document.getElementById("contact-grid"); if (!grid) return; grid.innerHTML = ""; rows.forEach(row => { if (!row.Mode && !row.Address) return; grid.appendChild(createContactTile(row)); }); }

/* ---------- small UI helpers preserved (reveal, starfield, theme) ---------- */
function initReveal() { const reveals = document.querySelectorAll(".reveal"); const io = new IntersectionObserver(entries => { for (const entry of entries) { if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); } } }, { threshold: 0.16 }); reveals.forEach(el => io.observe(el)); }
function initStarfieldCanvas() { const canvas = document.getElementById("space-canvas"); if (!canvas) return; const ctx = canvas.getContext("2d"); let w = window.innerWidth, h = window.innerHeight; canvas.width = w; canvas.height = h; window.addEventListener("resize", () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; initObjects(); }); const FAR_STAR_COUNT = 140, STREAK_COUNT = 40; let farStars = [], streaks = []; function rand(min,max){return Math.random()*(max-min)+min;} function initObjects(){ farStars=[]; streaks=[]; for(let i=0;i<FAR_STAR_COUNT;i++) farStars.push({x:Math.random()*w,y:Math.random()*h,r:rand(0.4,1.4),twinklePhase:Math.random()*Math.PI*2}); for(let i=0;i<STREAK_COUNT;i++) streaks.push(makeStreak()); } function makeStreak(){return {x:Math.random()*w,y:Math.random()*h,vx:-rand(0.2,1.2),vy:rand(-0.15,0.15),len:rand(20,60),alpha:rand(0.3,0.8)};} initObjects(); function step(){ ctx.clearRect(0,0,w,h); ctx.save(); for(const s of farStars){ const tw = 0.4 + 0.6*Math.sin(s.twinklePhase+=0.005); ctx.globalAlpha = 0.5+0.5*tw; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle="rgba(255,255,255,0.9)"; ctx.fill(); } ctx.restore(); ctx.save(); ctx.lineCap="round"; for(const d of streaks){ d.x+=d.vx; d.y+=d.vy; if(d.x<-80 || d.y<-40 || d.y>h+40){ Object.assign(d, makeStreak()); d.x = w + 40; } ctx.globalAlpha = d.alpha; const nx = d.x - d.vx*d.len, ny = d.y - d.vy*d.len; const grad = ctx.createLinearGradient(nx, ny, d.x, d.y); grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(255,255,255,0.9)"); ctx.strokeStyle = grad; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(d.x, d.y); ctx.stroke(); } ctx.restore(); requestAnimationFrame(step); } requestAnimationFrame(step); }
function applyThemeState(mode, { withTransition } = { withTransition: true }) { const root = document.documentElement, body = document.body; if (withTransition) { body.classList.add("theme-transitioning"); setTimeout(() => body.classList.remove("theme-transitioning"), 1500); } if (mode === "light") { root.style.setProperty("--galaxy-x", "110%"); body.classList.add("theme-light"); setTimeout(()=>{root.style.setProperty("--light-intensity","1"); root.style.setProperty("--star-scale","1.4");},12); } else { root.style.setProperty("--galaxy-x","0%"); body.classList.remove("theme-light"); setTimeout(()=>{root.style.setProperty("--light-intensity","0"); root.style.setProperty("--star-scale","0.5");},12); } }
function initThemeToggle() { const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches; const initialMode = prefersLight ? "light" : "dark"; applyThemeState(initialMode, { withTransition: false }); const btn = document.getElementById("theme-toggle"); if (!btn) return; btn.addEventListener("click", () => { const isLight = document.body.classList.contains("theme-light"); applyThemeState(isLight ? "dark" : "light", { withTransition: true }); }); }

/* ---------- main init flow ---------- */
(async function init() {
  initReveal(); initStarfieldCanvas(); initThemeToggle();
  try {
    const wb = await loadWorkbook();
    const heroRows = sheetRows(wb, "hero");
    const workRows = sheetRows(wb, "work");
    const skillRows = sheetRows(wb, "skill");
    const certRows = sheetRows(wb, "certification");
    const projectRows = sheetRows(wb, "projects");
    const contactRows = sheetRows(wb, "contact");
    populateHero(heroRows);
    populateWork(workRows);
    populateSkills(skillRows);
    populateCerts(certRows);
    populateProjects(projectRows);
    populateContact(contactRows);
  } catch (e) {
    console.error("Failed to load sheet data:", e);
  }

  // init details pane and signal ready
  initDetailsPane();
  window.__detailsReady = true;
  document.dispatchEvent(new Event("details-ready"));

  // start URL restore
  setTimeout(initFromURL, 0);
})();
