/* ═══════════════════════════════════════════════════
   ResumeAI - Checker Page JavaScript
   Handles: File upload, drag & drop, progress, analysis
═══════════════════════════════════════════════════ */

const uploadBox    = document.getElementById('uploadBox');
const fileInput    = document.getElementById('fileInput');
const uploadIdle   = document.getElementById('uploadIdle');
const uploadSelected = document.getElementById('uploadSelected');
const uploadProgress = document.getElementById('uploadProgress');
const uploadError  = document.getElementById('uploadError');
const dragOverlay  = document.getElementById('dragOverlay');
const selectedFileName = document.getElementById('selectedFileName');
const selectedFileSize = document.getElementById('selectedFileSize');
const analyzeBtn   = document.getElementById('analyzeBtn');
const removeFile   = document.getElementById('removeFile');
const retryBtn     = document.getElementById('retryBtn');
const progressSteps = document.getElementById('progressSteps');

let currentFile = null;

// ─── State Management ────────────────────────────────
function showState(state) {
    uploadIdle.style.display    = state === 'idle'     ? 'flex' : 'none';
    uploadSelected.style.display = state === 'selected' ? 'flex' : 'none';
    uploadProgress.style.display = state === 'progress' ? 'flex' : 'none';
    uploadError.style.display   = state === 'error'    ? 'flex' : 'none';
}

// ─── File Selection ──────────────────────────────────
fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

uploadBox.addEventListener('click', (e) => {
    // Only trigger file picker when in idle state
    if (uploadIdle.style.display !== 'none' && !e.target.closest('label')) {
        fileInput.click();
    }
});

function handleFile(file) {
    if (!file) return;

    const validTypes = ['application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExts  = ['.pdf', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    // Validate type
    if (!validExts.includes(ext)) {
        showError('Only PDF and DOCX files are supported.');
        return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
        showError('File is too large. Maximum size is 2MB.');
        return;
    }

    currentFile = file;
    if (typeof _lastFile !== 'undefined') _lastFile = file; // sync for build-resume
    selectedFileName.textContent = file.name;
    selectedFileSize.textContent = formatBytes(file.size);
    showState('selected');
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ─── Remove File ─────────────────────────────────────
removeFile.addEventListener('click', () => {
    currentFile = null;
    fileInput.value = '';
    showState('idle');
});

retryBtn.addEventListener('click', () => {
    showState('idle');
    currentFile = null;
    fileInput.value = '';
});

// ─── Analyze Button ──────────────────────────────────
analyzeBtn.addEventListener('click', () => {
    if (!currentFile) return;
    uploadResume(currentFile);
});

function uploadResume(file) {
    showState('progress');
    animateProgressSteps();

    const formData = new FormData();
    formData.append('resume', file);
    // include optional job description
    const jobDescEl = document.getElementById('jobDesc');
    if (jobDescEl && jobDescEl.value.trim()) {
        formData.append('job_desc', jobDescEl.value.trim());
    }

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
    })
    .then(data => {
        if (data.success) {
            // Navigate to result page
            window.location.href = `/result/${data.id}`;
        } else {
            showError(data.error || 'Analysis failed. Please try again.');
        }
    })
    .catch(err => {
        console.error('Upload error:', err);
        showError('Connection error. Please check your connection and try again.');
    });
}

function showError(msg) {
    document.getElementById('errorMessage').textContent = msg;
    showState('error');
}

// ─── Progress Steps Animation ────────────────────────
function animateProgressSteps() {
    const steps = progressSteps.querySelectorAll('.progress-step');
    let currentStep = 0;

    const advance = () => {
        if (currentStep > 0) {
            steps[currentStep - 1].classList.remove('active');
            steps[currentStep - 1].classList.add('done');
            steps[currentStep - 1].querySelector('i').className = 'fas fa-check';
        }
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            currentStep++;
            // Each step takes ~600ms
            setTimeout(advance, 700);
        }
    };

    advance();
}

// ─── Drag & Drop ─────────────────────────────────────
let dragCounter = 0;

document.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    dragOverlay.classList.add('active');
});

document.addEventListener('dragleave', () => {
    dragCounter--;
    if (dragCounter === 0) dragOverlay.classList.remove('active');
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    dragOverlay.classList.remove('active');

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

// Also handle drop on the upload box specifically
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('drag-over');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('drag-over');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('drag-over');
});

console.log('✅ Checker initialized');