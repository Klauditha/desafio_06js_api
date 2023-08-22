const urlApi = 'https://mindicador.cl/api/';

const getDatosFile = async() => {
    const res = await fetch('mindicador.json');
    const data = await res.text();
    console.log(data);
}

const getDatos = async() => {
    const res = await fetch(urlApi);
    const data = await res.json();
    console.log(data);
}

const btnBuscar = document.getElementById("btnBuscar");
btnBuscar.addEventListener("click", function(){
    getDatos();
})
getDatosFile();