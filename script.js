document.getElementById('addSlideBtn').addEventListener('click', addSlide);
document.getElementById('saveBtn').addEventListener('click', saveSlides);

function addSlide() {
  const editor = document.getElementById('editor');
  const slide = document.createElement('div');
  slide.className = 'slide empty';
  slide.contentEditable = true;
  slide.setAttribute('data-placeholder', 'Napíš svoj text...');

  // Tlačidlo vymazania
  const delBtn = document.createElement('button');
  delBtn.className = 'deleteBtn';
  delBtn.textContent = '×';
  delBtn.title = 'Vymazať slajd';
  delBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // neaktivuj focus na slide
    slide.remove();
  });
  slide.appendChild(delBtn);

  // Upravovanie placeholderu
  slide.addEventListener('input', () => {
    if (slide.textContent.trim() === '') {
      slide.classList.add('empty');
    } else {
      slide.classList.remove('empty');
    }
  });

  slide.addEventListener('focus', () => {
    if (slide.textContent.trim() === '') {
      slide.classList.add('empty');
    }
  });

  slide.addEventListener('blur', () => {
    if (slide.textContent.trim() === '') {
      slide.classList.add('empty');
    }
  });

  editor.appendChild(slide);
  slide.focus();
}

function saveSlides() {
  const slides = document.querySelectorAll('.slide');
  let html = '';
  slides.forEach(slide => {
    // odstránime delete button z ukladanej verzie
    const slideClone = slide.cloneNode(true);
    const delBtn = slideClone.querySelector('.deleteBtn');
    if (delBtn) delBtn.remove();

    html += `<section>${slideClone.innerHTML}</section>\n`;
  });

  const prezNameInput = document.getElementById('presentationName');
  let prezName = prezNameInput.value.trim();
  if (!prezName) prezName = 'moja_prezentacia';

  const fullHtml = `
  <!DOCTYPE html>
  <html lang="sk">
  <head>
    <meta charset="UTF-8" />
    <title>${prezName}</title>
    <link rel="stylesheet" href="https://unpkg.com/reveal.js/dist/reveal.css" />
    <link rel="stylesheet" href="https://unpkg.com/reveal.js/dist/theme/white.css" />
    <style>
      body { background: #222; color: white; }
      section { font-size: 2em; }
    </style>
  </head>
  <body>
    <div class="reveal">
      <div class="slides">
        ${html}
      </div>
    </div>
    <script src="https://unpkg.com/reveal.js/dist/reveal.js"></script>
    <script>
      Reveal.initialize();
    </script>
  </body>
  </html>
  `;

  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = prezName + '.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
