// --- 1. Real-Time Update Logic ---

// This function is called on every 'oninput' event in the HTML form
function updatePreview() {
    // Personal Info
    document.getElementById('preview-name').innerText = document.getElementById('name').value || 'Your Full Name';
    document.getElementById('preview-email').innerText = document.getElementById('email').value || 'email@example.com';
    document.getElementById('preview-phone').innerText = document.getElementById('phone').value || '(123) 456-7890';
    
    const linkedinURL = document.getElementById('linkedin').value;
    const linkedinElement = document.getElementById('preview-linkedin');
    linkedinElement.href = linkedinURL ? linkedinURL : '#';
    linkedinElement.innerText = linkedinURL ? 'LinkedIn' : 'LinkedIn Link';
    
    // Profile Summary
    document.getElementById('preview-summary').innerText = document.getElementById('summary').value || 'A brief professional summary will appear here in real-time as you type.';

    // Skills
    document.getElementById('preview-skills').innerText = document.getElementById('skills').value || 'List your key skills here...';
    
    // Update dynamic sections (Education & Experience)
    updateDynamicSection('education');
    updateDynamicSection('experience');
}


// --- 2. Dynamic Row Addition Logic (Education & Experience) ---

let educationCount = 0;
let experienceCount = 0;

// Adds a new set of input fields (row) for Education or Experience
function addDynamicRow(type) {
    const container = document.getElementById(`${type}-container`);
    let count = (type === 'education') ? ++educationCount : ++experienceCount;
    
    const div = document.createElement('div');
    div.classList.add('dynamic-row');
    div.setAttribute('data-id', count);
    
    let htmlContent = '';
    
    if (type === 'education') {
        htmlContent = `
            <h4>Education Entry #${count}</h4>
            <input type="text" id="${type}-title-${count}" placeholder="Degree/Certificate Title" oninput="updatePreview()">
            <input type="text" id="${type}-institution-${count}" placeholder="Institution Name">
            <input type="text" id="${type}-dates-${count}" placeholder="Start Date - End Date (e.g., 2018 - 2022)">
            <textarea id="${type}-description-${count}" rows="2" placeholder="Relevant coursework, honors, etc."></textarea>
        `;
    } else { // experience
        htmlContent = `
            <h4>Experience Entry #${count}</h4>
            <input type="text" id="${type}-title-${count}" placeholder="Job Title" oninput="updatePreview()">
            <input type="text" id="${type}-company-${count}" placeholder="Company Name">
            <input type="text" id="${type}-dates-${count}" placeholder="Start Date - End Date (e.g., Aug 2022 - Present)">
            <textarea id="${type}-description-${count}" rows="3" placeholder="Key responsibilities and achievements (use bullet points or hyphens)"></textarea>
        `;
    }

    div.innerHTML = htmlContent;
    container.appendChild(div);

    // Attach event listeners to all new inputs for real-time update
    const newInputs = div.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

// Generates the HTML for the dynamic section in the preview
function updateDynamicSection(type) {
    const previewContainer = document.getElementById(`preview-${type}`);
    const inputContainer = document.getElementById(`${type}-container`);
    previewContainer.innerHTML = ''; // Clear existing content

    const entries = inputContainer.querySelectorAll('.dynamic-row');
    
    entries.forEach((entry, index) => {
        const id = entry.getAttribute('data-id');
        
        const title = document.getElementById(`${type}-title-${id}`).value;
        const org = document.getElementById(`${type}-${type === 'education' ? 'institution' : 'company'}-${id}`).value;
        const dates = document.getElementById(`${type}-dates-${id}`).value;
        const description = document.getElementById(`${type}-description-${id}`).value;

        if (title || org) { // Only add if it has a title or institution/company
            const entryDiv = document.createElement('div');
            entryDiv.classList.add(`${type}-entry`);
            
            // This is the structure for the "bonsai model"
            entryDiv.innerHTML = `
                <div class="title-dates">
                    <strong>${title || (type === 'education' ? 'Degree Title' : 'Job Title')}</strong>
                    <span class="dates">${dates}</span>
                </div>
                <div class="location">${org}</div>
                <p class="description">${description.replace(/\n/g, '<br>')}</p>
            `;
            
            previewContainer.appendChild(entryDiv);
        }
    });
}


// --- 3. Initial Setup & Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with one default row for a better user experience
    addDynamicRow('education');
    addDynamicRow('experience');

    // Attach an event listener to the form's reset button to clear the preview
    document.querySelector('.clear-button').addEventListener('click', () => {
        // Reset the form
        document.getElementById('resume-form').reset();
        
        // Clear all dynamic rows
        document.getElementById('education-container').innerHTML = '';
        document.getElementById('experience-container').innerHTML = '';
        educationCount = 0;
        experienceCount = 0;

        // Re-initialize a single row for each and update the preview
        addDynamicRow('education');
        addDynamicRow('experience');
        
        // Use a small timeout to ensure the DOM has updated before running the preview update
        setTimeout(updatePreview, 10); 
    });

    // Run initial update to display placeholders
    updatePreview();
});