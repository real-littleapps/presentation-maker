const editor = document.getElementById('editor');
const saveBtn = document.getElementById('saveBtn');
const addSlideBtn = document.getElementById('addSlideBtn');

function createSlide(content = '') {
  const slide = document.createElement('div');
  slide.className = 'slide empty';
  slide.contentEditable = true;
  slide.setAttribute('data-placeholder', 'Write your text...');
  slide.innerHTML = content;

  // Pridáme close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.title = 'Delete slide';

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this slide?')) {
      slide.remove();
    }
  });

  slide.appendChild(closeBtn);

  // Placeholder správa
  function updateEmpty() {
    if (slide.textContent.trim() === '' || (slide.textContent.trim() === '×')) {
      slide.classList.add('empty');
    } else {
      slide.classList.remove('empty');
    }
  }
  slide.addEventListener('input', updateEmpty);
  slide.addEventListener('focus', updateEmpty);
  slide.addEventListener('blur', updateEmpty);

  updateEmpty();

  return slide;
}

function addSlide() {
  const slide = createSlide();
  editor.appendChild(slide);
  slide.focus();
}

addSlideBtn.addEventListener('click', addSlide);

saveBtn.addEventListener('click', () => {
  let presentationName = prompt('The name of the presentation', 'new-presentation');
  if (!presentationName) return;

  // Získaj všetky slajdy a ich obsah
  const slides = Array.from(editor.querySelectorAll('.slide')).filter(s => s.textContent.trim() !== '×' && s.textContent.trim() !== '');

  if (slides.length === 0) {
    alert('Add at least one slide before saving!');
    return;
  }

  // Vytvor html pre každý slide
  const slidesHtml = slides.map(slide => `<section>${slide.innerHTML.replace(/<button.*<\/button>/, '')}</section>`).join('\n');

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

// Na začiatok aspoň 1 slajd
addSlide();
