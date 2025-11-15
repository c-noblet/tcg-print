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
  
  if (currentSlot && files.length === 1) {
    // Single file to specific slot
    addImageToSlot(currentSlot, files[0]);
    currentSlot = null;
  } else if (files.length > 0) {
    // Multiple files - fill empty slots
    const emptySlots = Array.from(document.querySelectorAll('.card-slot:not(.has-image)'));
    files.forEach((file, index) => {
      if (index < emptySlots.length && file.type.startsWith('image/')) {
        addImageToSlot(emptySlots[index], file);
      }
    });
  }
  
  e.target.value = ''; // Reset file input
});