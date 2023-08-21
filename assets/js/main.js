const getDatos = async() => {
    const res = await fetch('mindicador.json');
    const data = await res.text();
    console.log(data);
}

getDatos();