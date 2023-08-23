
const btnBuscar = document.getElementById("btnBuscar");
let inputMonedas = document.getElementById("monedas");
let inputPesos = document.getElementById("monedas");
const urlApi = 'https://mindicador.cl/api/';

const getDatosFile = async() => {
    try {
        const res = await fetch('mindicador.json');
        const data = await res.text();
        console.log(data);
    } catch (error) {
        alert('No es posible obtener datos desde el archivo');
    }
}


const getDatos = async(metodo = "") => {
    try{
        const res = await fetch(urlApi+metodo);
        const data = await res.json();
        return data;
    }
    catch(error){
        alert('No es posible obtener datos de la API' + error);
        getDatosFile();
    }
}

async function obtenerMonedas(){
    try {
        const data = await getDatos();
        let template = '';
        template += `<option value="0" selected>Seleccione moneda</option>`;
        Object.keys(data).forEach( key => {
            if(data[key].codigo){
                template += `<option value="${data[key].codigo}">${data[key].nombre}</option>`;
        }
        });
        inputMonedas.innerHTML=template;
    } catch (error) {
        console.log("Error"+error.message);
    }
}

async function getAndCreateDataToChart(monedaSeleccionada) {
    const res = await getDatos(monedaSeleccionada);
    const labels = res.serie.slice(0,10).map((item) => {
        console.log((item.fecha).toString("yyyy"))
        return (item.fecha.split("T")[0]);
    });

    const data = res.serie.slice(0,10).map((item) => {
        return Number(item.valor);
    });
    
    const datasets = [
    {
        label: res.nombre,
        borderColor: "rgb(255, 99, 132)",
        data
    }];
        return { labels, datasets };
}

async function renderGrafica(monedaSeleccionada) {
    const data = await getAndCreateDataToChart(monedaSeleccionada);
    const config = {
        type: "line",
        data
    };

    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    new Chart(myChart, config);
}

btnBuscar.addEventListener("click", async function(){
    let monedaSeleccionada = inputMonedas.value;
    if(monedaSeleccionada!="0"){
        await renderGrafica(monedaSeleccionada);
    }
    else{
        alert("Seleccione moneda");
    }
})



obtenerMonedas();