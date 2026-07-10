/* ===== CONFIG ===== */
const EXAM = 'chsl';
const SUBJECTS = {
  english: { label: 'English', icon: '📖', color: '#4dabf7', path: `exams/${EXAM}/english/` },
  gk:       { label: 'GK',      icon: '🌍', color: '#2ecc71', path: `exams/${EXAM}/gk/` },
  maths:    { label: 'Maths',   icon: '🔢', color: '#f39c12', path: `exams/${EXAM}/maths/` },
  full:     { label: 'Full Mock',icon: '📋', color: '#e74c3c', path: `exams/${EXAM}/full/` }
};

/* ===== STATE ===== */
let mockFiles = {};
let currentSubject = 'english';
const STORAGE_KEY = 'mocktest_progress';

/* ===== STORAGE ===== */
function getProgress(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  }catch{return {}}
}
function saveProgress(prog){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
}
function markAttempted(filePath){
  const prog = getProgress();
  prog[filePath] = { attempted: true, lastAttempt: Date.now() };
  saveProgress(prog);
  updateStats();
}

/* ===== FILE LISTING (hardcoded from our folder structure) ===== */
const FILE_MAP = {
  english: [
    "CHSL_ENG_MOCK(1).html","CHSL_ENG_MOCK(2).html","CHSL_ENG_MOCK(3).html",
    "CHSL_ENG_MOCK(4).html","CHSL_ENG_MOCK(5).html","CHSL_ENG_MOCK(6).html",
    "CHSL_ENG_MOCK(11).html","CHSL_ENG_MOCK(12).html","CHSL_ENG_MOCK(13).html",
    "CHSL_ENG_MOCK(14).html","CHSL_ENG_MOCK(15).html","CHSL_ENG_MOCK(16).html",
    "CHSL_ENG_MOCK(17).html","CHSL_ENG_MOCK(18).html","CHSL_ENG_MOCK(19).html",
    "CHSL_ENG_MOCK(20).html","CHSL_ENG_MOCK(21).html","CHSL_ENG_MOCK(22).html",
    "CHSL_ENG_MOCK(23).html","CHSL_ENG_MOCK(24).html","CHSL_ENG_MOCK(25).html",
    "CHSL_ENG_MOCK(26).html","CHSL_ENG_MOCK(27).html","CHSL_ENG_MOCK(28).html",
    "CHSL_ENG_MOCK(29).html","CHSL_ENG_MOCK(30).html","CHSL_ENG_MOCK(31).html",
    "CHSL_ENG_MOCK(32).html"
  ],
  gk: [
    "CHSL_GK_MOCK(2) (1).html",
    "CHSL_GK_MOCK(2) (1) (2).html",
    "CHSL_GK_MOCK(3) (1).html",
    "CHSL_GK_MOCK(4) (2).html",
    "CHSL_GK_MOCK(5) (3).html",
    "CHSL_GK_MOCK(6).html",
    "CHSL_GK_MOCK(7) (1).html",
    "CHSL_GK_MOCK(8).html",
    "CHSL_GK_MOCK(9).html",
    "CHSL_GK_MOCK(10).html",
    "CHSL_GK_MOCK(11).html",
    "CHSL_GK_MOCK(12).html",
    "CHSL_GK_MOCK(13).html",
    "CHSL_GK_MOCK(14).html",
    "CHSL_GK_MOCK(15).html",
    "CHSL_GK_MOCK(16).html",
    "CHSL_GK_MOCK(17).html",
    "CHSL_GK_MOCK(19).html",
    "CHSL_GK_MOCK(20).html",
    "CHSL_GK_MOCK(21).html",
    "CHSL_GK_MOCK(22).html",
    "CHSL_GK_MOCK(23).html",
    "CHSL_GK_MOCK(24).html",
    "CHSL_GK_MOCK(25).html",
    "CHSL_GK_MOCK(26).html",
    "CHSL_GK_MOCK(27).html",
    "CHSL_GK_MOCK(28).html",
    "CHSL_GK_MOCK(29).html"
  ],
  maths: [
    "CHSL_MATHS_MOCK(1).html","CHSL_MATHS_MOCK(2).html","CHSL_MATHS_MOCK(3).html",
    "CHSL_MATHS_MOCK(4).html","CHSL_MATHS_MOCK(5).html","CHSL_MATHS_MOCK(6).html",
    "CHSL_MATHS_MOCK(7).html","CHSL_MATHS_MOCK(8).html","CHSL_MATHS_MOCK(9).html",
    "CHSL_MATHS_MOCK(10).html","CHSL_MATHS_MOCK(11).html","CHSL_MATHS_MOCK(12).html",
    "CHSL_MATHS_MOCK(13).html","CHSL_MATHS_MOCK(14).html","CHSL_MATHS_MOCK(15).html",
    "CHSL_MATHS_MOCK(16).html","CHSL_MATHS_MOCK(17).html","CHSL_MATHS_MOCK(18).html",
    "CHSL_MATH_MOCK(19).html","CHSL_MATH_MOCK(20).html","CHSL_MATH_MOCK(21).html",
    "CHSL_MATH_MOCK(22).html","CHSL_MATH_MOCK(23).html","CHSL_MATH_MOCK(24).html",
    "CHSL_MATH_MOCK(25).html","CHSL_MATH_MOCK(26).html","CHSL_MATH_MOCK(27).html"
  ],
  full: [
    "CHSLMOCK(1).html"
  ]
};

/* ===== RENDER ===== */
function renderMocks(subject){
  currentSubject = subject;
  const grid = document.getElementById('mockGrid');
  const files = FILE_MAP[subject] || [];
  const subInfo = SUBJECTS[subject];
  const progress = getProgress();

  if(!files.length){
    grid.innerHTML = `<div class="loading"><div class="spinner"></div>Loading mocks...</div>`;
    return;
  }

  let html = '';
  files.forEach((file, idx)=>{
    const filePath = `exams/${EXAM}/${subject}/${file}`;
    const isAttempted = !!progress[filePath];
    const mockNum = extractMockNumber(file, subject);

    html += `
      <div class="mock-card" data-path="${filePath}" data-subject="${subject}">
        <span class="card-badge ${subject}">${subInfo.label}</span>
        <div class="card-title">${subInfo.icon} ${subInfo.label} Mock ${mockNum}</div>
        <div class="card-sub">${file}</div>
        <div class="card-footer">
          <span class="card-status ${isAttempted ? 'attempted' : 'new'}">
            ${isAttempted ? '✅ Attempted' : '🆕 New'}
          </span>
          <span class="card-arrow">→</span>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;

  // Attach click events
  document.querySelectorAll('.mock-card').forEach(card => {
    card.addEventListener('click', ()=>{
      const path = card.dataset.path;
      openMock(path, subject);
    });
  });
}

function extractMockNumber(filename, subject){
  // Extract display name
  // CHSL_ENG_MOCK(1).html -> "1"
  // CHSL_GK_MOCK(2) (1).html -> "2 (v1)"
  const match = filename.match(/MOCK[^(]*\((\d+)\)/i);
  let num = '?';
  if(match) num = match[1];

  // Check for version suffix like (1), (2) after the number
  const verMatch = filename.match(/\)\s*\((\d+)\)/);
  if(verMatch && verMatch.index > 0){
    num += ` (v${verMatch[1]})`;
  }

  return num;
}

function openMock(path, subject){
  // Mark as attempted
  markAttempted(path);

  // Open in new tab so portal stays visible (encode URI for files with spaces)
  window.open(encodeURI(path), '_blank');
}

/* ===== TABS ===== */
function initTabs(){
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', ()=>{
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const subject = tab.dataset.subject;
      renderMocks(subject);
    });
  });
}

/* ===== STATS ===== */
function updateStats(){
  const progress = getProgress();
  const attempted = Object.keys(progress).length;
  let total = 0;
  Object.values(FILE_MAP).forEach(arr => total += arr.length);

  document.getElementById('totalAttempted').textContent = attempted;
  document.getElementById('totalMocks').textContent = total;
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', ()=>{
  initTabs();
  updateStats();
  renderMocks('english');
});
