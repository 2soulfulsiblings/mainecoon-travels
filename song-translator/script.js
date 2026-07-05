// SongSync — parses lyrics, syncs them to audio playback, and translates
// each line on the fly using the free MyMemory translation API.

const LANGUAGES = [
  ["en", "English"], ["es", "Spanish"], ["fr", "French"], ["de", "German"],
  ["it", "Italian"], ["pt", "Portuguese"], ["nl", "Dutch"], ["sv", "Swedish"],
  ["pl", "Polish"], ["ru", "Russian"], ["uk", "Ukrainian"], ["tr", "Turkish"],
  ["ar", "Arabic"], ["he", "Hebrew"], ["hi", "Hindi"], ["bn", "Bengali"],
  ["zh", "Chinese"], ["ja", "Japanese"], ["ko", "Korean"], ["vi", "Vietnamese"],
  ["th", "Thai"], ["id", "Indonesian"], ["el", "Greek"], ["ro", "Romanian"],
  ["cs", "Czech"], ["fi", "Finnish"], ["da", "Danish"], ["no", "Norwegian"],
];

const audioFileInput = document.getElementById("audioFile");
const player = document.getElementById("player");
const lyricsInput = document.getElementById("lyricsInput");
const sourceLangSelect = document.getElementById("sourceLang");
const targetLangSelect = document.getElementById("targetLang");
const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const lyricsDisplay = document.getElementById("lyricsDisplay");

let lines = [];          // [{ time, text, el, translation, status }]
let activeIndex = -1;
let translationCache = new Map();

populateLanguageSelects();

audioFileInput.addEventListener("change", () => {
  const file = audioFileInput.files[0];
  if (file) player.src = URL.createObjectURL(file);
});

startBtn.addEventListener("click", startSync);
player.addEventListener("timeupdate", onTimeUpdate);
player.addEventListener("seeked", onTimeUpdate);

function populateLanguageSelects() {
  for (const [code, name] of LANGUAGES) {
    sourceLangSelect.add(new Option(name, code));
    targetLangSelect.add(new Option(name, code));
  }
  sourceLangSelect.value = "en";
  targetLangSelect.value = "es";
}

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.classList.toggle("error", isError);
}

function startSync() {
  const raw = lyricsInput.value.trim();
  if (!raw) {
    setStatus("Paste some lyrics first.", true);
    return;
  }
  if (!player.src) {
    setStatus("Add an audio file first.", true);
    return;
  }

  translationCache = new Map();
  lines = parseLyrics(raw);
  if (lines.length === 0) {
    setStatus("Couldn't find any lyric lines in that text.", true);
    return;
  }

  const finalize = () => {
    if (lines.some((l) => l.time === null)) {
      spreadLinesEvenly(lines, player.duration || 180);
    }
    renderLines();
    setStatus(`Loaded ${lines.length} lines. Press play — translations appear as each line comes up.`);
  };

  if (player.readyState >= 1 && isFinite(player.duration)) {
    finalize();
  } else {
    player.addEventListener("loadedmetadata", finalize, { once: true });
  }
}

// Parses LRC-style "[mm:ss.xx] text" lines; falls back to plain text lines
// (time = null, filled in later by spreadLinesEvenly).
function parseLyrics(raw) {
  const rows = raw.split(/\r?\n/).map((r) => r.trim()).filter(Boolean);
  const lrcPattern = /^\[(\d{2}):(\d{2})(?:[.:](\d{1,3}))?\]\s*(.*)$/;

  return rows
    .map((row) => {
      const match = row.match(lrcPattern);
      if (match) {
        const [, mm, ss, frac, text] = match;
        if (!text) return null; // skip empty/instrumental LRC markers
        const time = parseInt(mm, 10) * 60 + parseInt(ss, 10) + (frac ? parseFloat("0." + frac) : 0);
        return { time, text, el: null, translation: "", status: "idle" };
      }
      return { time: null, text: row, el: null, translation: "", status: "idle" };
    })
    .filter(Boolean);
}

function spreadLinesEvenly(list, duration) {
  const span = Math.max(duration - 2, list.length); // leave a small lead-in
  list.forEach((line, i) => {
    line.time = 1 + (span * i) / list.length;
  });
}

function renderLines() {
  lyricsDisplay.innerHTML = "";
  for (const line of lines) {
    const wrapper = document.createElement("div");
    wrapper.className = "lyric-line";

    const original = document.createElement("div");
    original.className = "original";
    original.textContent = line.text;

    const translation = document.createElement("div");
    translation.className = "translation";

    wrapper.appendChild(original);
    wrapper.appendChild(translation);
    lyricsDisplay.appendChild(wrapper);

    line.el = wrapper;
    line.translationEl = translation;
  }
}

function onTimeUpdate() {
  if (lines.length === 0) return;
  const t = player.currentTime;

  let newIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= t) newIndex = i;
    else break;
  }

  if (newIndex !== activeIndex) {
    activeIndex = newIndex;
    updateActiveStyles();
    prefetchTranslations(activeIndex);
  }
}

function updateActiveStyles() {
  lines.forEach((line, i) => {
    line.el.classList.toggle("active", i === activeIndex);
    line.el.classList.toggle("past", i < activeIndex);
  });
  if (activeIndex >= 0 && lines[activeIndex].el) {
    lines[activeIndex].el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Translate the current line plus a couple ahead, so text is ready
// by the time playback reaches it.
function prefetchTranslations(centerIndex) {
  const lookahead = 2;
  for (let i = centerIndex; i <= centerIndex + lookahead; i++) {
    if (i >= 0 && i < lines.length) translateLine(lines[i]);
  }
}

async function translateLine(line) {
  if (line.status === "loading" || line.status === "done") return;

  const source = sourceLangSelect.value;
  const target = targetLangSelect.value;
  const cacheKey = `${source}|${target}:${line.text}`;

  if (source === target) {
    line.status = "done";
    line.translation = line.text;
    if (line.translationEl) line.translationEl.textContent = "";
    return;
  }

  if (translationCache.has(cacheKey)) {
    line.translation = translationCache.get(cacheKey);
    line.status = "done";
    if (line.translationEl) line.translationEl.textContent = line.translation;
    return;
  }

  line.status = "loading";
  if (line.translationEl) {
    line.translationEl.textContent = "translating…";
    line.translationEl.classList.add("loading");
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(line.text)}&langpair=${source}|${target}`;
    const res = await fetch(url);
    const data = await res.json();
    const translated = data?.responseData?.translatedText || "(translation unavailable)";

    line.translation = translated;
    line.status = "done";
    translationCache.set(cacheKey, translated);

    if (line.translationEl) {
      line.translationEl.classList.remove("loading");
      line.translationEl.textContent = translated;
    }
  } catch (err) {
    line.status = "error";
    if (line.translationEl) {
      line.translationEl.classList.remove("loading");
      line.translationEl.textContent = "(couldn't translate this line)";
    }
  }
}
