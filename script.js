//variables iniciales
const lista = document.getElementById('lista-ideas');
const botonAgregar = document.getElementById('agregar');
const botonExportar = document.getElementById('exportar');
//mostrar ideas
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
//agregar idea
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
//borrar idea
function borrarIdea(index) {
  const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
  ideas.splice(index, 1);
  localStorage.setItem('ideas', JSON.stringify(ideas));
  mostrarIdeas();
}
//nuevo export.json?.
//A. Función para exportar JSON ¿en que línea lo pego maestro?.
function exportJSON() {
    const datos = JSON.parse(localStorage.getItem('ideas')) || [];
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mesita_de_noche.json";
    a.click();

    URL.revokeObjectURL(url);
}
//nuevo import.json
function importJSON(file) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const contenido = JSON.parse(e.target.result);

            // Guardar el JSON importado en localStorage
            localStorage.setItem('ideas', JSON.stringify(contenido));

            // Actualizar lista
            mostrarIdeas();

            alert("Archivo importado correctamente.");

        } catch {
            alert("Error al leer el archivo JSON.");
        }
    };
    reader.readAsText(file);
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
//listener
botonAgregar.addEventListener('click', agregarIdea);
botonExportar.addEventListener('click', exportarPDF);
mostrarIdeas();
document.getElementById("btnExport").addEventListener("click", exportJSON);

document.getElementById("btnImport").addEventListener("click", () =>
    document.getElementById("fileInput").click()
);

document.getElementById("fileInput").addEventListener("change", (e) => {
    if (e.target.files.length) importJSON(e.target.files[0]);
});
//este addEventListener 'lo he comentado maestro porque ya tenemos el anterior export pdf'
//document.getElementById("btnPDF").addEventListener("click", exportPDF); 



