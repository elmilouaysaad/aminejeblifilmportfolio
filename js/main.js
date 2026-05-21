document.addEventListener('DOMContentLoaded', () => {
  initWorkModal();
  wireContactForm();
});

function initWorkModal() {
  const modal = document.getElementById('work-modal');
  const modalContent = document.getElementById('modal-content');
  const previews = document.querySelectorAll('.work-block-preview');
  const closeBtn = document.querySelector('[data-close-modal]');

  if (!modal || !modalContent) return;

  previews.forEach(preview => {
    preview.addEventListener('click', () => openModal(preview));
    preview.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(preview);
      }
    });
  });

  function openModal(preview) {
    const targetId = preview.getAttribute('data-expand-target');
    const source = document.getElementById(targetId);
    if (!source) return;

    const titleText = preview.querySelector('h2')?.textContent || '';

    modalContent.innerHTML = '';

    // Inject title at the top
    if (titleText) {
      const title = document.createElement('h2');
      title.className = 'modal-title';
      title.textContent = titleText;
      modalContent.appendChild(title);
    }

    // Clone all children from the hidden template
    Array.from(source.children).forEach(child => {
      modalContent.appendChild(child.cloneNode(true));
    });

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    preview.setAttribute('aria-expanded', 'true');
    closeBtn?.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    modalContent.innerHTML = '';
    previews.forEach(p => p.setAttribute('aria-expanded', 'false'));
  }

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}

function wireContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    const subject = encodeURIComponent('New portfolio inquiry');
    const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
    window.location.href = `mailto:Mo.jebli@aui.ma?subject=${subject}&body=${body}`;
  });
}