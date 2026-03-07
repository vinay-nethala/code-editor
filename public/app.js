// State management
let editorState = {
  content: '',
  undoStack: [],
  redoStack: [],
  highlightCallCount: 0
};

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedHighlight = debounce(() => {
  editorState.highlightCallCount++;
  // Simulate syntax highlighting
}, 150);

// Update content and manage history
function updateContent(newContent) {
  editorState.undoStack.push(editorState.content);
  editorState.content = newContent;
  editorState.redoStack = [];
  debouncedHighlight();
}

// Update line numbers
function updateLineNumbers() {
  const text = editor.textContent;
  const lines = text.split('\n');
  const lineCountNum = lines.length;
  lineNumbers.innerHTML = '';
  for (let i = 1; i <= lineCountNum; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    lineNumbers.appendChild(div);
  }
  lineCount.textContent = `${lineCountNum} lines`;
}

// Update cursor position
function updateCursorPos() {
  const sel = window.getSelection();
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editor);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const text = preCaretRange.toString();
    const lines = text.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    cursorPos.textContent = `Ln ${line}, Col ${col}`;
  }
}

// Expose functions
window.getEditorState = () => ({
  content: editorState.content,
  historySize: editorState.undoStack.length + 1
});

window.getHighlightCallCount = () => editorState.highlightCallCount;

// Elements
const editor = document.querySelector('[data-test-id="editor-input"]');
const eventLog = document.querySelector('[data-test-id="event-log-list"]');
const lineNumbers = document.getElementById('line-numbers');
const cursorPos = document.getElementById('cursor-pos');
const lineCount = document.getElementById('line-count');

// Log event
function logEvent(event) {
  const entry = document.createElement('div');
  entry.setAttribute('data-test-id', 'event-log-entry');
  entry.className = `event-entry ${event.type}`;
  const time = new Date().toLocaleTimeString();
  let text = `[${time}] ${event.type}`;
  if (event.key) text += ` | key:${event.key}`;
  if (event.code) text += ` | code:${event.code}`;
  if (event.ctrlKey) text += ' | ctrl';
  if (event.metaKey) text += ' | meta';
  if (event.shiftKey) text += ' | shift';
  if (event.altKey) text += ' | alt';
  entry.textContent = text;
  eventLog.appendChild(entry);
  eventLog.scrollTop = eventLog.scrollHeight;
}

// Log action
function logAction(action) {
  const entry = document.createElement('div');
  entry.setAttribute('data-test-id', 'event-log-entry');
  entry.className = 'event-entry action-entry';
  const time = new Date().toLocaleTimeString();
  entry.textContent = `[${time}] Action: ${action}`;
  eventLog.appendChild(entry);
  eventLog.scrollTop = eventLog.scrollTop = eventLog.scrollHeight;
}

// Chord state
let chordActive = false;
let chordTimeout;

// Start chord
function startChord() {
  chordActive = true;
  clearTimeout(chordTimeout);
  chordTimeout = setTimeout(() => {
    chordActive = false;
  }, 2000);
}

// Chord success
function chordSuccess() {
  chordActive = false;
  clearTimeout(chordTimeout);
  logAction('Chord Success');
}

// Handle Tab
function handleTab(shift) {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  const text = editor.textContent;
  let start = range.startOffset;
  let end = range.endOffset;
  if (!shift) {
    // Find line start
    let lineStart = start;
    while (lineStart > 0 && text[lineStart - 1] !== '\n') lineStart--;
    // Insert 2 spaces at line start
    const newText = text.slice(0, lineStart) + '  ' + text.slice(lineStart);
    editor.textContent = newText;
    updateContent(newText);
    // Set cursor after the inserted spaces
    const newPos = lineStart + 2;
    range.setStart(editor.firstChild || editor, newPos);
    range.setEnd(editor.firstChild || editor, newPos);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    // Find line start
    let lineStart = start;
    while (lineStart > 0 && text[lineStart - 1] !== '\n') lineStart--;
    if (text.slice(lineStart, lineStart + 2) === '  ') {
      const newText = text.slice(0, lineStart) + text.slice(lineStart + 2);
      editor.textContent = newText;
      updateContent(newText);
      const newPos = Math.max(start - 2, lineStart);
      range.setStart(editor.firstChild || editor, newPos);
      range.setEnd(editor.firstChild || editor, newPos);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}

// Handle Enter
function handleEnter() {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  const text = editor.textContent;
  const start = range.startOffset;
  // Find current line indentation
  let lineStart = start;
  while (lineStart > 0 && text[lineStart - 1] !== '\n') lineStart--;
  let indent = '';
  for (let i = lineStart; i < start; i++) {
    if (text[i] === ' ') indent += ' ';
    else break;
  }
  const newText = text.slice(0, start) + '\n' + indent + text.slice(start);
  editor.textContent = newText;
  updateContent(newText);
  // Set cursor after indent
  const newPos = start + 1 + indent.length;
  range.setStart(editor.firstChild || editor, newPos);
  range.setEnd(editor.firstChild || editor, newPos);
  sel.removeAllRanges();
  sel.addRange(range);
}

// Undo
function undo() {
  if (editorState.undoStack.length > 0) {
    editorState.redoStack.push(editorState.content);
    editorState.content = editorState.undoStack.pop();
    editor.textContent = editorState.content;
    updateLineNumbers();
    updateCursorPos();
  }
}

// Redo
function redo() {
  if (editorState.redoStack.length > 0) {
    editorState.undoStack.push(editorState.content);
    editorState.content = editorState.redoStack.pop();
    editor.textContent = editorState.content;
    updateLineNumbers();
    updateCursorPos();
  }
}

// Toggle comment
function toggleComment() {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  const text = editor.textContent;
  let start = range.startOffset;
  // Find line
  let lineStart = start;
  while (lineStart > 0 && text[lineStart - 1] !== '\n') lineStart--;
  let lineEnd = start;
  while (lineEnd < text.length && text[lineEnd] !== '\n') lineEnd++;
  const line = text.slice(lineStart, lineEnd);
  let newLine;
  if (line.startsWith('// ')) {
    newLine = line.slice(3);
  } else {
    newLine = '// ' + line;
  }
  const newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
  editor.textContent = newText;
  updateContent(newText);
  // Adjust cursor
  const diff = newLine.length - line.length;
  range.setStart(editor.firstChild || editor, start + diff);
  range.setEnd(editor.firstChild || editor, start + diff);
  sel.removeAllRanges();
  sel.addRange(range);
}

// Event listeners
editor.addEventListener('keydown', (e) => {
  logEvent(e);
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const mod = isMac ? e.metaKey : e.ctrlKey;
  if (mod && e.key === 's') {
    e.preventDefault();
    logAction('Save');
    return;
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    handleTab(e.shiftKey);
    updateCursorPos();
    return;
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    handleEnter();
    updateLineNumbers();
    updateCursorPos();
    return;
  }
  if (mod && !e.shiftKey && e.key === 'z') {
    e.preventDefault();
    undo();
    updateLineNumbers();
    updateCursorPos();
    return;
  }
  if (mod && e.shiftKey && e.key === 'Z') {
    e.preventDefault();
    redo();
    updateLineNumbers();
    updateCursorPos();
    return;
  }
  if (mod && e.key === '/') {
    e.preventDefault();
    toggleComment();
    updateCursorPos();
    return;
  }
  if (mod && e.key === 'k') {
    e.preventDefault();
    startChord();
    return;
  }
  if (chordActive && mod && e.key === 'c') {
    e.preventDefault();
    chordSuccess();
    return;
  }
  // Update on any key
  setTimeout(() => {
    updateCursorPos();
  }, 0);
});

editor.addEventListener('keyup', logEvent);
editor.addEventListener('input', (e) => {
  logEvent(e);
  updateContent(editor.textContent);
  updateLineNumbers();
  updateCursorPos();
});
editor.addEventListener('compositionstart', logEvent);
editor.addEventListener('compositionupdate', logEvent);
editor.addEventListener('compositionend', logEvent);

// Initial
updateContent('');
updateLineNumbers();
updateCursorPos();
