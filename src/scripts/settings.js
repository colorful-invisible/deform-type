// State
let currentMessage = "DEFORM TYPE";
let currentFontSize = 320;
let currentCols = 4;
let currentFontFamily = null;
let onMessageChange = null;
let onFontSizeChange = null;
let onColsChange = null;
let onFontChange = null;
let panel = null;
let messageInput = null;
let fontSizeInput = null;
let colsInput = null;
let fontUploadInput = null;
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
  fontUploadInput = document.getElementById("font-upload-input");

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

  // Font upload input
  if (fontUploadInput) {
    fontUploadInput.addEventListener("change", handleFontUpload);
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

function handleFontUpload(e) {
  const file = e.target.files[0];
  if (file) {
    loadFontFromFile(file);
  }
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

function setCurrentFontFamily(fontFamily) {
  currentFontFamily = fontFamily;

  // Notify the main application
  if (onFontChange) {
    onFontChange(currentFontFamily);
  }
}

async function loadFontFromFile(file) {
  if (
    !file.type.includes("font") &&
    !file.name.endsWith(".ttf") &&
    !file.name.endsWith(".otf")
  ) {
    alert("Please select a valid TTF or OTF font file.");
    return;
  }

  const arrayBuffer = await file.arrayBuffer();
  const fontFace = new FontFace(`UploadedFont-${Date.now()}`, arrayBuffer);

  try {
    await fontFace.load();
    document.fonts.add(fontFace);
    setCurrentFontFamily(fontFace.family);
    console.log("Uploaded font family:", fontFace.family);
  } catch (error) {
    alert("Failed to load font: " + error.message);
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

// Public method to set font family programmatically
export function setFontFamily(fontFamily) {
  currentFontFamily = fontFamily;
  if (onFontChange) {
    onFontChange(currentFontFamily);
  }
}

// Public method to set font change callback
export function setFontChangeCallback(callback) {
  onFontChange = callback;
}

// Public method to get current font family
export function getCurrentFontFamily() {
  return currentFontFamily;
}
