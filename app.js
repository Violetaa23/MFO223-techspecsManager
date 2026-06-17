const API_URL = "http://localhost:3000/servidores";

const form = document.getElementById("serverForm");
const cardsContainer = document.querySelector(".cards-container");

/*Leer Servidores (GET)*/

document.addEventListener("DOMContentLoaded", () => {
    cargarServidores();
});

async function cargarServidores() {
    try {

        const respuesta = await fetch(API_URL);
        const servidores = await respuesta.json();

        cardsContainer.innerHTML = "";

        servidores.forEach(servidor => {
            crearTarjeta(servidor);
        });

    } catch(error) {
        console.error("Error al cargar datos:", error);
    }
}

/*Creación tarjeta*/ 

function crearTarjeta(servidor) {

    const card = document.createElement("div");

    card.classList.add("server-card");

    card.innerHTML = `
        <h3>${servidor.nombre}</h3>

        <p><strong>CPU:</strong> ${servidor.cpu} Núcleos</p>

        <p><strong>RAM:</strong> ${servidor.ram} GB</p>

        <p><strong>Almacenamiento:</strong> ${servidor.almacenamiento}</p>

        <p><strong>Presupuesto:</strong> ${servidor.presupuesto} €</p>

        <button class="delete-btn" data-id="${servidor.id}">
            Eliminar
        </button>
    `;

    cardsContainer.appendChild(card);
}

/*Crear Servidor (POST)*/

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();

    const cpu = Number(document.getElementById("cpu").value);

    const ram = Number(document.getElementById("ram").value);

    const almacenamiento =
        document.getElementById("almacenamiento").value;

    const presupuesto =
        Number(document.getElementById("presupuesto").value);

    /* Validaciones */

    if(cpu < 2){
        alert("La CPU debe tener mínimo 2 núcleos");
        return;
    }

    if(ram < 4){
        alert("La RAM debe tener mínimo 4 GB");
        return;
    }

    if(presupuesto > 700){
        alert("El presupuesto no puede superar los 700 €");
        return;
    }

    const nuevoServidor = {
        nombre,
        cpu,
        ram,
        almacenamiento,
        presupuesto
    };

    try {

        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(nuevoServidor)
        });

        const servidorCreado = await respuesta.json();

        crearTarjeta(servidorCreado);

        form.reset();

    } catch(error) {
        console.error("Error al guardar:", error);
    }

});

/*Eliminar Servidor*/

cardsContainer.addEventListener("click", async (e) => {

    if(!e.target.classList.contains("delete-btn")) return;

    const id = e.target.dataset.id;

    try {

        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        cargarServidores();

    } catch(error) {
        console.error("Error al eliminar:", error);
    }
   });