let timeLeft = 7200; // Tiempo de examen en segundos
let penalty = 10; // Puntos a restar por cambiar de pestaña
let points = 100; // Puntos totales del examen
let warningCount = 0; // Contador de advertencias
const correctPin = '6623'; // PIN correcto

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
        window.location.href = "https://teams.microsoft.com/l/entity/66aeee93-507d-479a-a3ef-8f494af43945/classroom?context=%7B%22subEntityId%22%3A%22%7B%5C%22version%5C%22%3A%5C%221.0%5C%22%2C%5C%22config%5C%22%3A%7B%5C%22classes%5C%22%3A%5B%7B%5C%22id%5C%22%3A%5C%22300f4adc-0573-4884-a31b-c21463df5f74%5C%22%2C%5C%22assignmentIds%5C%22%3A%5B%5C%22001b3e66-5cea-42c5-86b5-9dad9737abb7%5C%22%5D%7D%5D%7D%2C%5C%22action%5C%22%3A%5C%22navigate%5C%22%2C%5C%22view%5C%22%3A%5C%22assignment-viewer%5C%22%2C%5C%22appId%5C%22%3A%5C%225e3ce6c0-2b1f-4285-8d4b-75ee78787346%5C%22%2C%5C%22deeplinkType%5C%22%3A4%7D%22%2C%22channelId%22%3Anull%7D";
    }, 5000);
}
