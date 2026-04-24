let resumeData = {
    experience: [],
    education: [],
    projects: []
};

// Initialize the first empty items
document.addEventListener('DOMContentLoaded', () => {
    addExperience();
    addEducation();
    addProject();
});

// UI toggling
function toggleSection(element) {
    element.parentElement.classList.toggle('active');
}

function changeTemplate(templateValue) {
    const preview = document.getElementById('resume-preview');
    preview.className = `template-${templateValue}`;
    
    // Toggle photo upload section visibility
    const photoUploadSection = document.getElementById('photo-upload-section');
    if (photoUploadSection) {
        photoUploadSection.style.display = templateValue === 'photo' ? 'block' : 'none';
    }

    // Toggle Preview Headers
    const photoHeader = document.getElementById('pv-photo-header');
    const standardHeader = document.getElementById('pv-standard-header');
    if (photoHeader && standardHeader) {
        if (templateValue === 'photo') {
            photoHeader.style.display = 'flex';
            standardHeader.style.display = 'none';
        } else {
            photoHeader.style.display = 'none';
            standardHeader.style.display = 'block';
        }
    }
}

// Update the live preview
function updatePreview() {
    const name = document.getElementById('r-name').value || 'Your Name';
    const title = document.getElementById('r-title').value || 'Job Title';
    const email = document.getElementById('r-email').value || 'email@example.com';
    const phone = document.getElementById('r-phone').value || '+1 234 567 8900';
    const location = document.getElementById('r-location').value || 'City, Country';
    const linkedin = document.getElementById('r-linkedin').value || 'linkedin.com/in/yourprofile';
    const summary = document.getElementById('r-summary').value || 'Your professional summary will appear here.';
    const skills = document.getElementById('r-skills').value || 'Skill 1, Skill 2, Skill 3';

    // Standard Header
    const pvName = document.getElementById('pv-name');
    if (pvName) pvName.innerText = name;
    const pvTitle = document.getElementById('pv-title');
    if (pvTitle) pvTitle.innerText = title;
    const pvEmail = document.getElementById('pv-email');
    if (pvEmail) pvEmail.innerText = email;
    const pvPhone = document.getElementById('pv-phone');
    if (pvPhone) pvPhone.innerText = phone;
    const pvLocation = document.getElementById('pv-location');
    if (pvLocation) pvLocation.innerText = location;
    const pvLinkedin = document.getElementById('pv-linkedin');
    if (pvLinkedin) pvLinkedin.innerText = linkedin;
    
    // Photo Template Header
    const pvNamePhoto = document.getElementById('pv-name-photo');
    if (pvNamePhoto) pvNamePhoto.innerText = name.toUpperCase();
    const pvLocationPhoto = document.getElementById('pv-location-photo');
    if (pvLocationPhoto) pvLocationPhoto.innerText = location;
    const pvPhonePhoto = document.getElementById('pv-phone-photo');
    if (pvPhonePhoto) pvPhonePhoto.innerText = phone;
    const pvEmailPhoto = document.getElementById('pv-email-photo');
    if (pvEmailPhoto) pvEmailPhoto.innerText = email;
    const pvLinkedinPhoto = document.getElementById('pv-linkedin-photo');
    if (pvLinkedinPhoto) pvLinkedinPhoto.innerText = linkedin;

    // Summary & Skills
    const pvSummary = document.getElementById('pv-summary');
    if (pvSummary) pvSummary.innerText = summary;
    const pvSkills = document.getElementById('pv-skills');
    if (pvSkills) {
        const tpl = document.getElementById('template-select').value;
        if (tpl === 'photo') {
             // For photo template, format skills nicely (either grouping or bullets if comma separated)
             const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);
             if (skillsList.length > 0) {
                 pvSkills.innerHTML = `<ul class="skills-bullets">${skillsList.map(s => `<li>${s}</li>`).join('')}</ul>`;
             } else {
                 pvSkills.innerText = skills;
             }
        } else {
             pvSkills.innerText = skills;
        }
    }

    // Lists
    renderList('experience', 'pv-experience-list', (item) => {
        const descHtml = item.description ? `<ul class="list-bullets">${item.description.split('\\n').filter(Boolean).map(line => `<li>${line.replace(/^[•-]/,'').trim()}</li>`).join('')}</ul>` : '';
        return `
        <div class="list-item">
            <div class="list-header">
                <span>${item.role ? `<strong>${item.role}</strong>` : ''} ${item.company ? `<span class="list-company">at ${item.company}</span>` : ''}</span>
                <span class="list-date">${item.duration || ''}</span>
            </div>
            ${descHtml}
        </div>
    `});

    renderList('education', 'pv-education-list', (item) => {
         const descHtml = item.description ? `<ul class="edu-bullets">${item.description.split('\\n').filter(Boolean).map(line => `<li>${line.replace(/^[•-]/,'').trim()}</li>`).join('')}</ul>` : '';
         return `
        <div class="list-item">
            <div class="list-header">
                <span class="edu-degree">${item.degree || ''}</span>
                <span class="list-date">${item.year || item.duration || ''}</span>
            </div>
            ${item.school ? `<div class="edu-school">${item.school}</div>` : ''}
            ${descHtml}
        </div>
    `});

    renderList('projects', 'pv-projects-list', (item) => {
         const descHtml = item.description ? `<ul class="list-bullets">${item.description.split('\\n').filter(Boolean).map(line => `<li>${line.replace(/^[•-]/,'').trim()}</li>`).join('')}</ul>` : '';
         return `
        <div class="list-item">
            <div class="list-header">
                <span><strong>${item.title || item.name || ''}</strong></span>
            </div>
            ${descHtml}
        </div>
    `});
}

function renderList(dataKey, containerId, templateFn) {
    const container = document.getElementById(containerId);
    container.innerHTML = resumeData[dataKey].map(templateFn).join('');
}

// Dynamic Sections Management
function addExperience() {
    addExperienceEntry({ role: '', company: '', duration: '', description: '' });
}
function addExperienceEntry(data) {
    const id = Date.now() + Math.random();
    resumeData.experience.push({ id, ...data });
    renderForms();
}

function addEducation() {
    addEducationEntry({ degree: '', school: '', year: '', duration: '', description: '' });
}
function addEducationEntry(data) {
    const id = Date.now() + Math.random();
    resumeData.education.push({ id, ...data });
    renderForms();
}

function addProject() {
    addProjectEntry({ title: '', name: '', description: '' });
}
function addProjectEntry(data) {
    const id = Date.now() + Math.random();
    // Allow either title or name from parsed data
    const title = data.title || data.name || '';
    resumeData.projects.push({ id, title, description: data.description || '' });
    renderForms();
}

function removeItem(type, id) {
    resumeData[type] = resumeData[type].filter(item => item.id !== id);
    renderForms();
}

function updateItem(type, id, field, value) {
    const item = resumeData[type].find(item => item.id === id);
    if (item) {
        item[field] = value;
        updatePreview();
    }
}

function renderForms() {
    const expContainer = document.getElementById('experience-container');
    expContainer.innerHTML = resumeData.experience.map(item => `
        <div class="dynamic-entry">
            <button type="button" class="remove-btn" onclick="removeItem('experience', ${item.id})">×</button>
            <input type="text" placeholder="Role/Title" class="form-control mb-2" value="${item.role}" oninput="updateItem('experience', ${item.id}, 'role', this.value)">
            <input type="text" placeholder="Company" class="form-control mb-2" value="${item.company}" oninput="updateItem('experience', ${item.id}, 'company', this.value)">
            <input type="text" placeholder="Duration (e.g. 2020 - 2022)" class="form-control mb-2" value="${item.duration}" oninput="updateItem('experience', ${item.id}, 'duration', this.value)">
            <textarea placeholder="Description" rows="2" class="form-control mb-2" oninput="updateItem('experience', ${item.id}, 'description', this.value)">${item.description}</textarea>
        </div>
    `).join('');

    const eduContainer = document.getElementById('education-container');
    eduContainer.innerHTML = resumeData.education.map(item => `
        <div class="dynamic-entry">
            <button type="button" class="remove-btn" onclick="removeItem('education', ${item.id})">×</button>
            <input type="text" placeholder="Degree" class="form-control mb-2" value="${item.degree}" oninput="updateItem('education', ${item.id}, 'degree', this.value)">
            <input type="text" placeholder="School/University" class="form-control mb-2" value="${item.school}" oninput="updateItem('education', ${item.id}, 'school', this.value)">
            <input type="text" placeholder="Graduation Year" class="form-control mb-2" value="${item.year}" oninput="updateItem('education', ${item.id}, 'year', this.value)">
        </div>
    `).join('');

    const projContainer = document.getElementById('projects-container');
    projContainer.innerHTML = resumeData.projects.map(item => `
        <div class="dynamic-entry">
            <button type="button" class="remove-btn" onclick="removeItem('projects', ${item.id})">×</button>
            <input type="text" placeholder="Project Title" class="form-control mb-2" value="${item.title}" oninput="updateItem('projects', ${item.id}, 'title', this.value)">
            <textarea placeholder="Description" rows="2" class="form-control mb-2" oninput="updateItem('projects', ${item.id}, 'description', this.value)">${item.description}</textarea>
        </div>
    `).join('');
    
    updatePreview();
}

// PDF Export
function exportPDF() {
    const element = document.getElementById('resume-preview');
    // Hide borders/shadows temporally for clean render
    const origBoxShadow = element.style.boxShadow;
    element.style.boxShadow = 'none';

    var opt = {
        margin:       0,
        filename:     `${document.getElementById('r-name').value || 'Resume'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.boxShadow = origBoxShadow;
    });
}

// Save Draft to Backend
async function saveResume() {
    const templateId = document.getElementById('template-select').value;
    const payload = {
        templateId,
        resumeData: {
            basic_info: {
                name: document.getElementById('r-name').value,
                title: document.getElementById('r-title').value,
                email: document.getElementById('r-email').value,
                phone: document.getElementById('r-phone').value,
                location: document.getElementById('r-location').value,
                linkedin: document.getElementById('r-linkedin').value,
                summary: document.getElementById('r-summary').value,
                skills: document.getElementById('r-skills').value
            },
            ...resumeData
        }
    };

    try {
        const response = await fetch('/api/resume/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const res = await response.json();
        if (res.success) {
            alert('Draft saved successfully!');
        } else {
            console.error('Failed to save', res);
        }
    } catch (e) {
        console.error('Error saving draft', e);
        alert('Could not save draft. Are you logged in?');
    }
}

// ── Job Description Matching ─────────────────────────────────────────────────

/**
 * Collect all text the user has typed into the builder so the backend
 * can compare it against a job description.
 */
function getResumeFullText() {
    const parts = [];
    parts.push(document.getElementById('r-name').value);
    parts.push(document.getElementById('r-title').value);
    parts.push(document.getElementById('r-summary').value);
    parts.push(document.getElementById('r-skills').value);

    resumeData.experience.forEach(e => {
        parts.push(e.role, e.company, e.duration, e.description);
    });
    resumeData.education.forEach(e => {
        parts.push(e.degree, e.school, e.year);
    });
    resumeData.projects.forEach(p => {
        parts.push(p.title, p.description);
    });

    return parts.filter(Boolean).join(' ');
}

/**
 * Call /api/match and render the results inside #match-results.
 */
async function analyzeMatch() {
    const jobDesc = document.getElementById('r-job-desc').value.trim();
    if (!jobDesc) { alert('Please paste a job description first.'); return; }

    const resumeText = getResumeFullText();
    if (resumeText.length < 20) { alert('Fill in some resume details before matching.'); return; }

    // UI: show spinner
    const btn = document.querySelector('.btn-match');
    const origHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Analyzing…';

    try {
        const resp = await fetch('/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText, jobDescription: jobDesc })
        });
        const data = await resp.json();
        if (data.error) { alert(data.error); return; }

        renderMatchResults(data);
    } catch (err) {
        console.error('Match error', err);
        alert('Could not reach the server. Is it running?');
    } finally {
        btn.disabled = false;
        btn.innerHTML = origHTML;
    }
}

/**
 * Build the match-results panel HTML from the API response.
 */
function renderMatchResults(data) {
    const container = document.getElementById('match-results');
    container.style.display = 'block';

    // Determine colour based on score
    let bg;
    if (data.matchScore >= 70)      bg = '#38a169';  // green
    else if (data.matchScore >= 45) bg = '#d69e2e';  // amber
    else                            bg = '#e53e3e';  // red

    let html = '';

    // Score circle
    html += `
        <div class="match-score-ring">
            <div class="score-circle" style="background:${bg}">${data.matchScore}%</div>
            <div class="score-label"><strong>Job Match Score</strong><br>Based on TF-IDF keyword similarity</div>
        </div>`;

    // Found keywords
    if (data.foundKeywords && data.foundKeywords.length) {
        html += `<div class="kw-group">
            <div class="kw-group-title">✅ Keywords Found (${data.foundKeywords.length})</div>
            <div class="kw-chips">${data.foundKeywords.map(k => `<span class="kw-chip found">${k}</span>`).join('')}</div>
        </div>`;
    }

    // Missing keywords
    if (data.missingKeywords && data.missingKeywords.length) {
        html += `<div class="kw-group">
            <div class="kw-group-title">❌ Missing Keywords (${data.missingKeywords.length})</div>
            <div class="kw-chips">${data.missingKeywords.map(k => `<span class="kw-chip missing">${k}</span>`).join('')}</div>
        </div>`;
    }

    // Missing action verbs
    if (data.missingVerbs && data.missingVerbs.length) {
        html += `<div class="kw-group">
            <div class="kw-group-title">⚡ Missing Action Verbs</div>
            <div class="kw-chips">${data.missingVerbs.map(k => `<span class="kw-chip missing">${k}</span>`).join('')}</div>
        </div>`;
    }

    // Suggestions
    if (data.suggestions && data.suggestions.length) {
        html += `<div class="kw-group">
            <div class="kw-group-title">💡 Suggestions</div>
            ${data.suggestions.map(s => `<div class="match-suggestion"><i class="fas fa-lightbulb"></i><span>${s}</span></div>`).join('')}
        </div>`;
    }

    container.innerHTML = html;
}

// ── Improve My Resume ────────────────────────────────────────────────────────

let _lastImprovements = null;  // store for Apply All

/**
 * Call /api/ai/improve and show the before/after modal.
 */
async function improveResume() {
    const resumeText = getResumeFullText();
    if (resumeText.length < 20) {
        alert('Please fill in some resume details before improving.');
        return;
    }

    // Gather data
    const payload = {
        summary: document.getElementById('r-summary').value,
        title: document.getElementById('r-title').value,
        experience: resumeData.experience.map(e => ({ description: e.description })),
        projects: resumeData.projects.map(p => ({ description: p.description })),
    };

    // Show loading state on button
    const btn = document.querySelector('.btn-improve');
    const origHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Improving…';

    try {
        const resp = await fetch('/api/ai/improve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await resp.json();

        if (!data.success) {
            alert('Improvement failed. Please try again.');
            return;
        }

        _lastImprovements = data.improvements;
        renderImprovements(data);
    } catch (err) {
        console.error('Improve error:', err);
        alert('Could not reach the server.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = origHTML;
    }
}

/**
 * Render the before/after modal content.
 */
function renderImprovements(data) {
    const body = document.getElementById('improve-modal-body');
    const badge = document.getElementById('improve-method-badge');

    // Method badge
    if (data.method === 'ai') {
        badge.className = 'improve-method-badge ai';
        badge.textContent = '✨ AI-Powered';
    } else {
        badge.className = 'improve-method-badge rule';
        badge.textContent = '⚙ Rule-Based';
    }

    let html = '';
    const imp = data.improvements;

    // Summary diff
    if (imp.summary && (imp.summary.before || imp.summary.after)) {
        html += '<div class="diff-section-title">Professional Summary</div>';
        html += buildDiffCard(imp.summary.before, imp.summary.after);
    }

    // Experience diffs
    if (imp.experience && imp.experience.length) {
        html += '<div class="diff-section-title">Experience Bullets</div>';
        imp.experience.forEach((item, i) => {
            if (item.before || item.after) {
                html += buildDiffCard(item.before, item.after);
            }
        });
    }

    // Project diffs
    if (imp.projects && imp.projects.length) {
        html += '<div class="diff-section-title">Project Bullets</div>';
        imp.projects.forEach((item, i) => {
            if (item.before || item.after) {
                html += buildDiffCard(item.before, item.after);
            }
        });
    }

    if (!html) {
        html = '<p style="text-align:center;color:#718096;">No sections to improve. Add some content first!</p>';
    }

    body.innerHTML = html;
    document.getElementById('improve-modal').style.display = 'flex';
}

function buildDiffCard(before, after) {
    return `<div class="diff-card">
        <div class="diff-col before">
            <span class="diff-col-label">Before</span>
            ${before || '<em style="color:#a0aec0">Empty</em>'}
        </div>
        <div class="diff-col after">
            <span class="diff-col-label">After</span>
            ${after || '<em style="color:#a0aec0">Empty</em>'}
        </div>
    </div>`;
}

function closeImproveModal() {
    document.getElementById('improve-modal').style.display = 'none';
}

/**
 * Write the improved text back into the builder form fields.
 */
function applyAllImprovements() {
    if (!_lastImprovements) return;

    const imp = _lastImprovements;

    // Apply summary
    if (imp.summary && imp.summary.after) {
        document.getElementById('r-summary').value = imp.summary.after;
    }

    // Apply experience descriptions
    if (imp.experience) {
        imp.experience.forEach((item, i) => {
            if (resumeData.experience[i] && item.after) {
                resumeData.experience[i].description = item.after;
            }
        });
    }

    // Apply project descriptions
    if (imp.projects) {
        imp.projects.forEach((item, i) => {
            if (resumeData.projects[i] && item.after) {
                resumeData.projects[i].description = item.after;
            }
        });
    }

    // Re-render forms and preview
    renderForms();
    updatePreview();
    closeImproveModal();
}
