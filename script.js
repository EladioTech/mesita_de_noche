const lista = document.getElementById('lista-ideas');
const botonAgregar = document.getElementById('agregar');
const botonExportar = document.getElementById('exportar');

function mostrarIdeas() {
  lista.innerHTML = '';
  const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
  ideas.forEach((idea, index) => {
    const li = document.createElement('li');
    li.classList.add('idea');
    li.innerHTML = `
      <h3>${idea.titulo}</h3>
      <p>${idea.descripcion}</p>
      <button onclick="borrarIdea(${index})">🗑️ Eliminar</button>
    `;
    lista.appendChild(li);
  });
}

function agregarIdea() {
  const titulo = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  if (!titulo) return alert('Por favor, añade un título o inspiración.');
  
  const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
  ideas.push({ titulo, descripcion });
  localStorage.setItem('ideas', JSON.stringify(ideas));
  document.getElementById('titulo').value = '';
  document.getElementById('descripcion').value = '';
  mostrarIdeas();
}

function borrarIdea(index) {
  const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
  ideas.splice(index, 1);
  localStorage.setItem('ideas', JSON.stringify(ideas));
  mostrarIdeas();
}

// 📄 Exportar ideas a PDF
async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const ideas = JSON.parse(localStorage.getItem('ideas')) || [];

  if (ideas.length === 0) {
    alert('No hay ideas que exportar.');
    return;
  }

  let y = 20;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('🎨 Registro de Ideas para Cuadros', 10, y);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);

  ideas.forEach((idea, i) => {
    if (y > 270) { // Salto de página
      doc.addPage();
      y = 20;
    }
    doc.text(`${i + 1}. ${idea.titulo}`, 10, y);
    y += 6;
    if (idea.descripcion) {
      const split = doc.splitTextToSize(idea.descripcion, 180);
      doc.text(split, 10, y);
      y += split.length * 6 + 4;
    }
  });

  doc.save('Ideas_SantaCruz.pdf');
}

botonAgregar.addEventListener('click', agregarIdea);
botonExportar.addEventListener('click', exportarPDF);
mostrarIdeas();
