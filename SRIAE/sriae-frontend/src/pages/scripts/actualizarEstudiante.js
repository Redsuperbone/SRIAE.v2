const estudiante = JSON.parse(localStorage.getItem('sriae_estudiante_actual') || 'null');
const query = estudiante?.matricula ? `?matricula=${encodeURIComponent(estudiante.matricula)}&editar=1` : '';

window.location.replace(`gestion-estudiantes.html${query}`);
