let timeLeft = 7200; // Tiempo de examen en segundos
let penalty = 10; // Puntos a restar por cambiar de pestaña
let points = 100; // Puntos totales del examen
let warningCount = 0; // Contador de advertencias
const correctPin = '9922'; // PIN correcto

const timeElement = document.getElementById('time');
const warningElement = document.getElementById('warning');

// Función para validar el Nombre y PIN
function checkCredentials() {
    const nameInput = document.getElementById('nameInput').value.trim();
    const pinInput = document.getElementById('pinInput').value.trim();

    if (nameInput !== '' && pinInput === correctPin) {
        document.getElementById('pinContainer').style.display = 'none';
        document.getElementById('examContent').style.display = 'block';
        startTimer();
    } else {
        document.getElementById('pinError').style.display = 'block';
    }
}

// Función para iniciar el temporizador
function startTimer() {
    const timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timeElement.textContent = timeLeft;
        } else {
            clearInterval(timer);
            alert("El tiempo ha terminado");
            submitExam(); // Envía automáticamente las respuestas cuando el tiempo se acaba
        }
    }, 1000);
}

// Función para restar puntos
function handleVisibilityChange() {
    if (document.hidden || document.visibilityState === 'hidden') {
        warningCount++;
        points -= penalty;
        warningElement.textContent = `Advertencia ${warningCount}: No cambies de pestaña. Has perdido ${penalty} puntos.`;
    }
}

// Agregar el listener para detectar cambios de pestaña
document.addEventListener('visibilitychange', handleVisibilityChange);

// También puedes usar 'blur' para detectar cuando la ventana pierde el foco
window.addEventListener('blur', handleVisibilityChange);

// Función para enviar el examen, guardar en PDF y redirigir
function submitExam() {
    clearInterval(timeLeft); // Detiene el temporizador

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener el nombre, código del textarea
    const name = document.getElementById('nameInput').value.trim();
    const code = document.getElementById('code').value.trim();
    const formattedCode = code.replace(/\t/g, '    '); // Reemplaza tabulaciones con espacios

    // Contenido del PDF
    const content = [
        `Nombre del Estudiante: ${name}`,
        `Número de veces que se abandonó el sitio: ${warningCount}`,
        `Código ingresado:`,
        formattedCode,
    ].join('\n');

    // Añadir contenido al PDF
    doc.text('Resultados del Examen', 10, 10);
    doc.autoTable({
        startY: 20,
        body: [{ code: content }],
        columns: [{ header: '', dataKey: 'code' }],
        styles: { fontSize: 10, cellPadding: 2, overflow: 'linebreak' },
        theme: 'plain',
        showHead: 'false',
        margin: { top: 20, bottom: 20, left: 10, right: 10 }
    });

    // Guardar el PDF
    doc.save('examen_resultado.pdf');

    // Esperar 5 segundos y redirigir
    setTimeout(() => {
        window.location.href = "";  // agrega teams link
    }, 5000);
}
