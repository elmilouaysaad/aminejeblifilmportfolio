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

    // Build modal content from scratch instead of cloning
    modalContent.innerHTML = '';

    // Title
    if (titleText) {
      const title = document.createElement('h2');
      title.className = 'modal-title';
      title.textContent = titleText;
      modalContent.appendChild(title);
    }

    // Log line
    const logLineEl = source.querySelector('.log-line');
    if (logLineEl) {
      const p = document.createElement('p');
      p.className = 'log-line';
      p.textContent = logLineEl.textContent;
      modalContent.appendChild(p);
    }

    // Video embed — built fresh with preload hints
    const videoSlot = source.querySelector('.video-embed-slot');
    if (videoSlot) {
      const newSlot = document.createElement('div');
      newSlot.className = 'video-embed-slot';

      const iframe = videoSlot.querySelector('iframe');
      if (iframe) {
        const newIframe = document.createElement('iframe');

        // Preload hints for faster embed loading
        newIframe.setAttribute('loading', 'eager');
        newIframe.setAttribute('fetchpriority', 'high');
        newIframe.setAttribute('decoding', 'async');

        // Core attributes
        newIframe.src = iframe.getAttribute('src');
        newIframe.width = iframe.getAttribute('width') || '640';
        newIframe.height = iframe.getAttribute('height') || '360';
        newIframe.setAttribute('frameborder', '0');
        newIframe.setAttribute('scrolling', 'no');
        newIframe.setAttribute('allowfullscreen', '');
        newIframe.setAttribute('title', iframe.getAttribute('title') || '');

        newSlot.appendChild(newIframe);
      }
      modalContent.appendChild(newSlot);
    }

    // Images
    const imageSpot = source.querySelector('.image-spot--two');
    if (imageSpot) {
      const newSpot = document.createElement('div');
      newSpot.className = 'image-spot image-spot--two';
      imageSpot.querySelectorAll('figure').forEach(fig => {
        const newFig = document.createElement('figure');
        const img = fig.querySelector('img');
        if (img) {
          const newImg = document.createElement('img');
          newImg.src = img.getAttribute('src');
          newImg.alt = img.getAttribute('alt') || '';
          newImg.setAttribute('loading', 'eager');
          newImg.setAttribute('decoding', 'async');
          newFig.appendChild(newImg);
        }
        newSpot.appendChild(newFig);
      });
      modalContent.appendChild(newSpot);
    }

    // Personal statement
    const statement = source.querySelector('.personal-statement');
    if (statement) {
      const newStatement = document.createElement('div');
      newStatement.className = 'personal-statement';
      newStatement.innerHTML = statement.innerHTML;
      modalContent.appendChild(newStatement);
    }

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