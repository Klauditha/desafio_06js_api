
const btnBuscar = document.getElementById("btnBuscar");
let inputMonedas = document.getElementById("monedas");
let inputPesos = document.getElementById("pesos").value;
let resultado = document.getElementById("resultado");
let myChart = "";
let grafico= "";
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

const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha);
    let dia = nuevaFecha.getDate();
    let mes = nuevaFecha.getMonth()+1;
    let anio = nuevaFecha.getFullYear();
    return `${dia<10? "0"+dia: dia}/${ mes<10? "0"+mes: mes}/${anio}`;
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

async function getAndCreateDataToChart(monedaSeleccionada,pesos) {
    let res = await getDatos(monedaSeleccionada);
    let nombreGrafico = res.nombre;
    res = res.serie.slice(0,10);
    const labels = res.map((item) => {
        return formatearFecha(item.fecha);
    });

    const data = res.map((item) => {
        return Number(item.valor);
    });

    const datasets = [
    {
        label: nombreGrafico,
        borderColor: "rgb(255, 99, 132)",
        data
    }];

    resultado.innerHTML = "Resultado: " + (pesos * res[0].valor).toLocaleString();
    return { labels, datasets };
}

async function renderGrafica(monedaSeleccionada,pesos) {
    const data = await getAndCreateDataToChart(monedaSeleccionada,pesos);
    const config = {
        type: "line",
        data
    };
    if (grafico) grafico.destroy();
    myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    grafico = new Chart(myChart, config);
}

$("#pesos").keyup(function () {
 
    var valor = $(this).prop("value");

    //evaluamos si es negativo, y ponemos 1 por defecto
    if (valor < 0)
        $(this).prop("value", "1");
})

btnBuscar.addEventListener("click", async function(){
    let monedaSeleccionada = inputMonedas.value;
    inputPesos = document.getElementById("pesos").value;
    if(inputPesos==""){
        alert("Ingrese cantidad en pesos");
        return
    }
    if(monedaSeleccionada!="0"){
        await renderGrafica(monedaSeleccionada,inputPesos);
    }
    else{
        alert("Seleccione moneda");
    }
})

window.addEventListener("load", function(){
    obtenerMonedas();
})
