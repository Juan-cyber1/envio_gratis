const buscador = document.querySelector('#search');
const listaCoincidencias = document.getElementById('listaCoincidencias');
const content = document.getElementById('content');
const resultSearch = document.querySelector("#result-search");
const openModal = document.querySelector("#btn-modal");
const closeModal = document.querySelector("#close-modal");
const modal = document.querySelector("#modalEnvio");
const contInput = document.querySelector("#cont-input");
let globalData = {};

function limpiarTexto(texto) {
    let retorno = texto.replace()
        .replace(/[áàäâå]/, "a")
        .replace(/[éèëê]/, "e")
        .replace(/[íìïî]/, "i")
        .replace(/[óòöô]/, "o")
        .replace(/[úúüû]/, "u")
        .replace(/[ñ]/, "n")
        .replace(/[\s()/*´'{}]+/gi, "-")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    return retorno;
}
var globalResult = "";
var textoIngresado = "";

const buscarCiudad = async searchText => {
    const resp = await fetch('https://feeds.datafeedwatch.com/75005/0bbd9ded49285714a8e439b27f35f1d72f12ae75.json');
    const resultadosJson = await resp.json();
    const resultados = resultadosJson.products;
    compararResultado = resultados.filter(
        resultado => {
            const newResult = new RegExp(`^${limpiarTexto(searchText)}`, 'gi');
            let ciud = resultado.value;
            let ciudLimpio = limpiarTexto(ciud);
            textoIngresado = searchText;
            let compCiudad = ciudLimpio.match(newResult);
            return compCiudad;

        });
    globalData["resultados"] = compararResultado;
    globalResult = globalData["resultados"];
    if (compararResultado == "") {
        buscarDepto(buscador.value);

    }



    if (searchText.length === 0) {
        compararResultado = [];
    } else if (searchText.length > 2) {
        printRes(compararResultado);
    }

}

const buscarDepto = async searchText => {
    const resp = await fetch('https://feeds.datafeedwatch.com/75005/0bbd9ded49285714a8e439b27f35f1d72f12ae75.json');
    const resultadosJson = await resp.json();
    const resultados = resultadosJson.products;
    compararResultado = resultados.filter(
        resultado => {
            const newResult = new RegExp(`^${limpiarTexto(searchText)}`, 'gi');
            textoIngresado = searchText;
            let depto = resultado.dep;
            let deptoLimpio = limpiarTexto(depto);
            let compDepto = deptoLimpio.match(newResult);

            return compDepto;

        });
    globalData["resultados"] = compararResultado;
    globalResult = globalData["resultados"];

    if (searchText.length === 0) {
        compararResultado = [];
    } else if (searchText.length > 2) {
        printResDepto(compararResultado);
    }
}
if (window.innerWidth <= 992) {
    openModal.addEventListener('click', () => {
        modal.classList.remove("moveDown");
        modal.classList.toggle("moveUp");

        setTimeout(() => {
            buscador.focus();
        }, 1000);

    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove("moveUp");
        modal.classList.toggle("moveDown");
    });
} else {
    openModal.addEventListener('click', () => {
        setTimeout(() => {
            buscador.focus();
        }, 1000);
    })
}

console.log(globalResult);

const printRes = globalResult => {

    listaCoincidencias.innerHTML = "";
    content.innerHTML = "";
    resultSearch.innerHTML = "";
    contInput.innerHTML = "";
    if (globalResult.length > 0) {

        buscador.style.border = "1px solid #004797";
        const opciones = globalResult.map(card => {

            let nameDepto = card.dep;
            let nombreDepto = limpiarTexto(nameDepto);
            let nombreMunicipio = card.value;
            let nombreMunLimpio = limpiarTexto(nombreMunicipio);
            let text = buscador.value;
            let textLimpio = limpiarTexto(text);

            console.log(nombreDepto);
            if (nombreMunLimpio.indexOf(textLimpio) !== -1) {

                listaCoincidencias.style.display = "block";
                listaCoincidencias.innerHTML +=
                    `<span id="${card.value}" class="selectOp"><div class="dropdown-item">
            <div class="panel panel-default">
            <div class="panel-heading">
            <p><i class="alk-icon-pin-generico"></i> ${card.nombre_ciudad}, ${card.dep}</p>
            </div>
            </div>
            </div></span>`;
                let lists = listaCoincidencias.querySelectorAll("span");

                for (let i = 0; i < lists.length; i++) {
                    lists[i].addEventListener('click', selectCard);

                    function selectCard() {
                        let opSelect = lists[i].id;
                        listaCoincidencias.style.display = "none";
                        const cardView = compararResultado.map(i => {
                            let ciudad = i.value;

                            if (opSelect == ciudad) {
                                let desc = i.desc;
                                let depto = i.dep;
                                let diasEntrega = "";
                                let tiempo_entrega = i.tiempo_entrega;
                                tiempo_entrega == 1 ? diasEntrega = `<p class="txt-blue">${tiempo_entrega} día hábil a partir de la compra.</p>` : diasEntrega = `<p class="txt-blue">${tiempo_entrega} días hábiles a partir de la compra.</p>`;
                                let horarioEntrega = i.horario_entrega;
                                buscador.setAttribute("placeholder", opSelect + ", " + depto);
                                buscador.value = "";

                                retorno = {
                                    ciudad,
                                    depto,
                                    diasEntrega,
                                    desc,
                                    horarioEntrega

                                }

                                pintarCards(retorno);
                            }
                        });


                    }
                }
            }
        }).join('');

    }
}


const printResDepto = globalResult => {

    listaCoincidencias.innerHTML = "";
    content.innerHTML = "";
    resultSearch.innerHTML = "";
    contInput.innerHTML = "";
    if (globalResult.length > 0) {

        buscador.style.border = "1px solid #004797";
        const opciones = globalResult.map(card => {

            let nameDepto = card.dep;
            let nombreDepto = limpiarTexto(nameDepto);
            let nombreMunicipio = card.value;
            let nombreMunLimpio = limpiarTexto(nombreMunicipio);
            let text = buscador.value;
            let textLimpio = limpiarTexto(text);

            console.log(nombreDepto);
            if (nombreDepto.indexOf(textLimpio) !== -1) {

                listaCoincidencias.style.display = "block";
                listaCoincidencias.innerHTML +=
                    `<span id="${card.value}" class="selectOp"><div class="dropdown-item">
            <div class="panel panel-default">
            <div class="panel-heading">
            <p><i class="alk-icon-pin-generico"></i> ${card.nombre_ciudad}, ${card.dep}</p>
            </div>
            </div>
            </div></span>`;
                let lists = listaCoincidencias.querySelectorAll("span");

                for (let i = 0; i < lists.length; i++) {
                    lists[i].addEventListener('click', selectCard);

                    function selectCard() {
                        let opSelect = lists[i].id;
                        listaCoincidencias.style.display = "none";
                        const cardView = compararResultado.map(i => {
                            let ciudad = i.value;

                            if (opSelect == ciudad) {
                                let desc = i.desc;
                                let depto = i.dep;
                                let diasEntrega = "";
                                let tiempo_entrega = i.tiempo_entrega;
                                tiempo_entrega == 1 ? diasEntrega = `<p class="txt-blue">${tiempo_entrega} día hábil a partir de la compra.</p>` : diasEntrega = `<p class="txt-blue">${tiempo_entrega} días hábiles a partir de la compra.</p>`;
                                let horarioEntrega = i.horario_entrega;
                                buscador.setAttribute("placeholder", opSelect + ", " + depto);
                                buscador.value = "";

                                retorno = {
                                    ciudad,
                                    depto,
                                    diasEntrega,
                                    desc,
                                    horarioEntrega

                                }

                                pintarCards(retorno);
                            }
                        });


                    }
                }
            }
        }).join('');
    } else {
        setTimeout(() => {
            listaCoincidencias.style.display = "block";
            buscador.style.border = "1px solid #DD171B";
            listaCoincidencias.innerHTML = `<p class="txt-red">No hemos encontrado resultados para: "${textoIngresado}"</p>`;

            contInput.innerHTML = `<i class="alk-icon-close icon-borrar" title="Limpiar campo"></i>`;
            contInput.addEventListener('click', () => {
                buscador.value = "";
                contInput.innerHTML = "";
                listaCoincidencias.innerHTML = "";
                buscador.style.border = "1px solid #004797";
                buscador.setAttribute("placeholder", "Ingresa de tu municipio o departamento");
                buscador.focus();
            }, 4000);

        })
    }
}


buscador.addEventListener('input', () => buscarCiudad(buscador.value));

function pintarCards(c) {

    content.innerHTML = `
     
    <div class="cont-card">
        <div class="card">
            <div class="card-header">
                <h2 class="card-subtitle">${c.ciudad} <span class="badge badge-primary">Envío gratis</span></h2>
                <span class="txt-depto">${c.depto}</span>
            </div>
            <div class="card-body">
            <p class="subtitle-card m-0">
            Tiempo estimado:
            </p>
            ${c.diasEntrega}
  
                <p class="subtitle-card m-0">
                Jornada de entrega:
                </p>
                <p class="txt-blue">${c.horarioEntrega}</p>

            </div>
            </div>
        </div>
    </div>
    <div class="CTA_modal text-center">
    <div class="col-md-12 text-center">
        <a href="/" title="Comprar en línea">Comprar en línea</a>
    </div>
</div>
    `;
}