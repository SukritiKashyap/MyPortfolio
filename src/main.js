import { createIcons, User, Code, BarChart3, PieChart, Binary, Linkedin, Github, Twitter, Mail, ExternalLink, X, Download } from 'lucide';
import projectsData from './data/projects.json';

// Initialize Lucide Icons
function initIcons() {
  createIcons({
    icons: {
      User,
      Code,
      BarChart3,
      PieChart,
      Binary,
      Linkedin,
      Github,
      Twitter,
      Mail,
      ExternalLink,
      X,
      Download
    }
  });
}

// Render Projects
const projectsContainer = document.getElementById('projects-container');
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');

function renderProjects() {
  projectsContainer.innerHTML = projectsData.map(project => `
    <div class="project-card" data-id="${project.id}">
      <div class="project-img">
        <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div class="project-content">
        <span class="project-tag">${project.tag}</span>
        <h3>${project.title}</h3>
        <p style="margin-bottom: 15px; font-size: 0.95rem; color: var(--text-muted);">${project.problem}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
          ${project.tools.map(tool => `<span style="font-size: 0.75rem; background: var(--grey); padding: 2px 8px; border-radius: 4px;">${tool}</span>`).join('')}
        </div>
        <button class="btn btn-outline view-details" style="width: 100%;">View Case Study</button>
      </div>
    </div>
  `).join('');

  // Add event listeners to cards
  document.querySelectorAll('.view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      const projectId = card.dataset.id;
      openProjectModal(projectId);
    });
  });
}

function openProjectModal(id) {
  const project = projectsData.find(p => p.id === id);
  if (!project) return;

  modalBody.innerHTML = `
    <div style="margin-bottom: 30px;">
        <span class="project-tag">${project.tag}</span>
        <h2 style="font-size: 2rem; margin-top: 10px;">${project.title}</h2>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
            <h4 style="color: var(--primary); margin-bottom: 10px;">Problem Statement</h4>
            <p>${project.problem}</p>
        </div>
        <div>
            <h4 style="color: var(--primary); margin-bottom: 10px;">Tools Used</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${project.tools.map(tool => `<span style="font-size: 0.85rem; background: var(--grey); padding: 4px 12px; border-radius: 6px;">${tool}</span>`).join('')}
            </div>
        </div>
    </div>
    <div style="margin-bottom: 30px;">
        <h4 style="color: var(--primary); margin-bottom: 10px;">Key Insights & Impact</h4>
        ${Array.isArray(project.insights) ? `<ul style="list-style: disc; margin-left: 20px;">${project.insights.map(i => `<li style="margin-bottom: 6px;">${i}</li>`).join('')}</ul>` : `<p>${project.insights}</p>`}
    </div>
    <div style="background: var(--light); height: 300px; border-radius: 12px; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
        <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <div style="display: flex; gap: 20px;">
        ${project.github && project.github !== '#' ? `
        <a href="${project.github}" target="_blank" class="btn btn-outline" style="display: flex; align-items: center; gap: 10px;">
            <i data-lucide="github" style="width: 18px;"></i> View on GitHub
        </a>` : ''}
        ${project.demo ? `
        <a href="${project.demo}" target="_blank" class="btn btn-primary" style="display: flex; align-items: center; gap: 10px;">
            <i data-lucide="external-link" style="width: 18px;"></i> Live Demo
        </a>` : ''}
    </div>
  `;
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent scroll
  initIcons(); // Re-initialize icons for dynamic content
}

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetQuery = this.getAttribute('href');
    if (targetQuery === '#') return;
    
    const target = document.querySelector(targetQuery);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Form Submission Handler
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

/**
 * CONFIGURATION: 
 * To change the destination email, update the 'action' attribute 
 * in index.html (line 140) to your new Formspree endpoint.
 * Create a new form at https://formspree.io to get your endpoint.
 */

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // UI Feedback: Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.style.display = 'none';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        formStatus.style.backgroundColor = '#dcfce7'; // Light green
        formStatus.style.color = '#166534'; // Dark green
        formStatus.style.display = 'block';
        contactForm.reset();
      } else {
        // Formspree error
        const data = await response.json();
        throw new Error(data.error || 'Oops! There was a problem submitting your form');
      }
    } catch (error) {
      // Network or other error
      formStatus.textContent = error.message || 'Something went wrong. Please try again later.';
      formStatus.style.backgroundColor = '#fee2e2'; // Light red
      formStatus.style.color = '#991b1b'; // Dark red
      formStatus.style.display = 'block';
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

// Initialize
initIcons();
renderProjects();
