
const btnBuscar = document.getElementById("btnBuscar");
let inputMonedas = document.getElementById("monedas");
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


const getDatos = async() => {
    try{
        const res = await fetch(urlApi);
        const data = await res.json();
        console.log(data);
        return data;
    }
    catch(error){
        alert('No es posible obtener datos de la API');
        getDatosFile();
    }
}

async function obtenerMonedas(){
    try {
        const data = await getDatos();
        let template = '';
        console.log(data.version);
        template += `<option selected>Seleccione moneda</option>`;
        Object.keys(data).forEach( key => {
            if(data[key].codigo){
                template += `<option value="${data[key].codigo}">${data[key].nombre}</option>`;
        }
        });
        console.log(template);
        inputMonedas.innerHTML=template;
    } catch (error) {
        console.log("Error"+error.message);
    }

}

btnBuscar.addEventListener("click", function(){
    getDatos();
})



obtenerMonedas();