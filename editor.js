const editor = document.getElementById('editor');
window.onload = () => {
  const saveBtn = document.getElementById('saveBtn');
  const addSlideBtn = document.getElementById('addSlideBtn');

  saveBtn.addEventListener('click', saveFunction);
  addSlideBtn.addEventListener('click', addSlide);
};


function createSlide(initialContent = '') {
  const slide = document.createElement('div');
  slide.className = 'slide';

  // close button (krížik)
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '❌';
  closeBtn.title = 'Vymazať slajd';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Naozaj chceš vymazať tento slajd?')) {
      slide.remove();
    }
  });

  // obsah slajdu - editable div s placeholderom
  const content = document.createElement('div');
  content.className = 'slide-content empty';
  content.contentEditable = true;
  content.setAttribute('data-placeholder', 'Napíš svoj text...');
  content.innerHTML = initialContent;

  // placeholder logika - pridá alebo odstráni triedu 'empty'
  function updateEmpty() {
  content.classList.toggle('empty', content.textContent.trim() === '');
}

  content.addEventListener('input', updateEmpty);
  content.addEventListener('focus', updateEmpty);
  content.addEventListener('blur', updateEmpty);

  // pridaj button a content do slide
  slide.appendChild(closeBtn);
  slide.appendChild(content);

  updateEmpty();

  return slide;
}

function addSlide() {
  const slide = createSlide();
  editor.appendChild(slide);
  slide.querySelector('.slide-content').focus();
}

addSlideBtn.addEventListener('click', addSlide);

saveBtn.addEventListener('click', () => {
  let presentationName = prompt('Názov prezentácie', 'Nová prezentácia');
  if (!presentationName) return;

  const slides = Array.from(editor.querySelectorAll('.slide'));
  if (slides.length === 0) {
    alert('Pridaj aspoň jeden slajd pred uložením!');
    return;
  }

  // pre každý slajd vyber obsah (bez tlačidla close)
  const slidesHtml = slides.map(slide => {
    const content = slide.querySelector('.slide-content').innerHTML;
    return `<section>${content}</section>`;
  }).join('\n');

  const html = `
  <!DOCTYPE html>
  <html lang="sk">
  <head>
    <meta charset="UTF-8" />
    <title>${presentationName}</title>
    <link rel="stylesheet" href="https://unpkg.com/reveal.js/dist/reveal.css" />
    <link rel="stylesheet" href="https://unpkg.com/reveal.js/dist/theme/white.css" />
    <style>
      body { background: #222; color: white; }
      section { font-size: 2em; padding: 20px; }
    </style>
  </head>
  <body>
    <div class="reveal">
      <div class="slides">
        ${slidesHtml}
      </div>
    </div>
    <script src="https://unpkg.com/reveal.js/dist/reveal.js"></script>
    <script>
      Reveal.initialize();
    </script>
    <footer>
      <p>Made by HTML Presentation Maker (in beta version)</p>
    </footer>
  </body>
  </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = presentationName + '.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// pridaj na začiatok aspoň 1 slajd
addSlide();
