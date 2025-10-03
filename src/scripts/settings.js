// State
let currentMessage = "DEFORM TYPE";
let currentFontSize = 320;
let currentCols = 4;
let onMessageChange = null;
let onFontSizeChange = null;
let onColsChange = null;
let panel = null;
let messageInput = null;
let fontSizeInput = null;
let colsInput = null;
let isOpen = false;

// Initialize and set up listeners
export function initSettings() {
  setupEventListeners();
}

function setupEventListeners() {
  panel = document.getElementById("settings-panel");
  messageInput = document.getElementById("message-input");
  fontSizeInput = document.getElementById("font-size-input");
  colsInput = document.getElementById("cols-input");

  const trigger = document.getElementById("settings-trigger");

  // Panel toggle
  trigger.addEventListener("click", togglePanel);

  // Message input
  if (messageInput) {
    messageInput.addEventListener("input", handleMessageChange);
    messageInput.value = currentMessage;
  }

  // Font size input
  if (fontSizeInput) {
    fontSizeInput.addEventListener("input", handleFontSizeChange);
    fontSizeInput.value = currentFontSize;
    updateFontSizeDisplay();
  }

  // Columns input
  if (colsInput) {
    colsInput.addEventListener("input", handleColsChange);
    colsInput.value = currentCols;
    updateColsDisplay();
  }

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    if (isOpen && !panel.contains(e.target) && !trigger.contains(e.target)) {
      closePanel();
    }
  });
}

function togglePanel() {
  if (isOpen) {
    closePanel();
  } else {
    openPanel();
  }
}

function openPanel() {
  panel.classList.add("open");
  document.body.classList.add("has-open-panel");
  isOpen = true;
}

function closePanel() {
  panel.classList.remove("open");
  document.body.classList.remove("has-open-panel");
  isOpen = false;
}

function handleMessageChange(e) {
  const newMessage = e.target.value;
  setCurrentMessage(newMessage);
}

function handleFontSizeChange(e) {
  const newFontSize = parseInt(e.target.value);
  setCurrentFontSize(newFontSize);
}

function handleColsChange(e) {
  const newCols = parseInt(e.target.value);
  setCurrentCols(newCols);
}

function setCurrentMessage(message) {
  currentMessage = message;

  // Notify the main application
  if (onMessageChange) {
    onMessageChange(currentMessage);
  }
}

function setCurrentFontSize(fontSize) {
  currentFontSize = fontSize;
  updateFontSizeDisplay();

  // Notify the main application
  if (onFontSizeChange) {
    onFontSizeChange(currentFontSize);
  }
}

function setCurrentCols(cols) {
  currentCols = cols;
  updateColsDisplay();

  // Notify the main application
  if (onColsChange) {
    onColsChange(currentCols);
  }
}

function updateFontSizeDisplay() {
  if (fontSizeInput) {
    fontSizeInput.value = currentFontSize;
  }
}

function updateColsDisplay() {
  if (colsInput) {
    colsInput.value = currentCols;
  }
}

// Public method to set message change callback
export function setMessageChangeCallback(callback) {
  onMessageChange = callback;
}

// Public method to set font size change callback
export function setFontSizeChangeCallback(callback) {
  onFontSizeChange = callback;
}

// Public method to set columns change callback
export function setColsChangeCallback(callback) {
  onColsChange = callback;
}

// Public method to get current message
export function getCurrentMessage() {
  return currentMessage;
}

// Public method to get current font size
export function getCurrentFontSize() {
  return currentFontSize;
}

// Public method to get current columns
export function getCurrentCols() {
  return currentCols;
}

// Public method to set message programmatically
export function setMessage(message) {
  currentMessage = message;
  if (messageInput) {
    messageInput.value = currentMessage;
  }
  if (onMessageChange) {
    onMessageChange(currentMessage);
  }
}

// Public method to set font size programmatically
export function setFontSize(fontSize) {
  currentFontSize = fontSize;
  updateFontSizeDisplay();
  if (onFontSizeChange) {
    onFontSizeChange(currentFontSize);
  }
}

// Public method to set columns programmatically
export function setCols(cols) {
  currentCols = cols;
  updateColsDisplay();
  if (onColsChange) {
    onColsChange(currentCols);
  }
}
