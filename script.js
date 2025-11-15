// Whend document is ready, initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Event listeners
  document.getElementById('cardType').addEventListener('change', initGrid);

  // Prevent default drag behavior on document
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => e.preventDefault());

  initGrid();
});

let currentSlot = null;
// Number of slots to add when running low
const PAGE_SIZE = 9;
// Threshold of empty slots before we auto-add more
const EMPTY_THRESHOLD = 3;

// Initialize grid
function initGrid() {
  const cardType = document.getElementById('cardType').value;
  const grid = document.getElementById('cardGrid');
  
  // Update grid class for card type
  grid.className = `card-grid size-${cardType}`;
  
  // Clear existing slots
  grid.innerHTML = '';
  
  // Create 9 slots (3x3 grid fits perfectly on A4)
  const totalSlots = 9;
  for (let i = 0; i < totalSlots; i++) {
    const slot = createCardSlot(i);
    grid.appendChild(slot);
  }
}

function createCardSlot(index) {
  const slot = document.createElement('div');
  slot.className = 'card-slot';
  slot.dataset.index = index;
  
  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  placeholder.innerHTML = `<div>Drop image here<br>or click to upload</div>`;
  slot.appendChild(placeholder);
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = '×';
  removeBtn.onclick = (e) => {
    e.stopPropagation();
    removeImage(slot);
  };
  slot.appendChild(removeBtn);
  
  // Click to upload
  slot.onclick = () => {
    currentSlot = slot;
    document.getElementById('fileInput').click();
  };
  
  // Drag and drop events
  slot.addEventListener('dragover', handleDragOver);
  slot.addEventListener('dragleave', handleDragLeave);
  slot.addEventListener('drop', handleDrop);
  
  return slot;
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  this.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  this.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  this.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith('image/')) {
    addImageToSlot(this, files[0]);
  }
}

function addImageToSlot(slot, file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.createElement('img');
    img.src = e.target.result;
    
    // Remove placeholder
    const placeholder = slot.querySelector('.placeholder');
    if (placeholder) placeholder.remove();
    
    // Remove existing image if any
    const existingImg = slot.querySelector('img');
    if (existingImg) existingImg.remove();
    
    slot.insertBefore(img, slot.firstChild);
    slot.classList.add('has-image');
    // After adding an image, ensure there are enough empty slots
    ensureSlotsAvailable();
  };
  reader.readAsDataURL(file);
}

function removeImage(slot) {
  const img = slot.querySelector('img');
  if (img) img.remove();
  
  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  placeholder.innerHTML = `<div>Drop image here<br>or click to upload</div>`;
  slot.insertBefore(placeholder, slot.firstChild);
  
  slot.classList.remove('has-image');
  // After removing an image, ensure there are enough empty slots
  ensureSlotsAvailable();
}

function clearAll() {
  if (confirm('Clear all cards?')) {
    initGrid();
  }
}

function printCards() {
  window.print();
}

// File input handler
document.getElementById('fileInput').addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  
  let remainingFiles = files.slice();

  if (currentSlot && remainingFiles.length > 0) {
    // Place first file into the targeted slot
    const first = remainingFiles.shift();
    if (first && first.type.startsWith('image/')) {
      addImageToSlot(currentSlot, first);
    }
    currentSlot = null;
  }

  if (remainingFiles.length > 0) {
    // Ensure there are enough empty slots for all remaining files
    const grid = document.getElementById('cardGrid');
    let emptySlots = Array.from(grid.querySelectorAll('.card-slot:not(.has-image)'));
    if (remainingFiles.length > emptySlots.length) {
      const needed = remainingFiles.length - emptySlots.length;
      // Add exactly the number of slots needed to fit all files
      addSlots(needed);
      // Recompute empty slots after adding
      emptySlots = Array.from(grid.querySelectorAll('.card-slot:not(.has-image)'));
    }

    // Fill empty slots with the remaining files in order
    remainingFiles.forEach((file, index) => {
      if (index < emptySlots.length && file.type.startsWith('image/')) {
        addImageToSlot(emptySlots[index], file);
      }
    });
  }
  
  e.target.value = ''; // Reset file input
});

// Ensure there are enough empty slots; if empty slots <= threshold, add PAGE_SIZE more
function ensureSlotsAvailable() {
  const grid = document.getElementById('cardGrid');
  const emptySlots = grid.querySelectorAll('.card-slot:not(.has-image)');
  if (emptySlots.length <= EMPTY_THRESHOLD) {
    addSlots(PAGE_SIZE);
  }
}

// Add `count` new slots to the grid, keeping dataset.index sequential
function addSlots(count) {
  const grid = document.getElementById('cardGrid');
  // Determine next index based on existing slots
  const existing = grid.querySelectorAll('.card-slot');
  let nextIndex = existing.length;
  for (let i = 0; i < count; i++) {
    const slot = createCardSlot(nextIndex + i);
    grid.appendChild(slot);
  }
}