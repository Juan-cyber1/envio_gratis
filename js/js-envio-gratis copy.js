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
            let depto = resultado.dep;
            let deptoLimpio = limpiarTexto(depto);
            let location = `${ciudLimpio}, ${deptoLimpio}`;
            textoIngresado = searchText;
            let compCiudad = location;
            return compCiudad;

        });
    

    if (searchText.length === 0) {
        compararResultado = [];
        contInput.innerHTML = `<i class="alk-icon-search-mobile icon-search"></i>`;
    } else if (searchText.length > 2) {
        printRes(compararResultado);
    }

}


if (window.innerWidth <= 992) {
    openModal.addEventListener('click', () => {
        modal.classList.remove("moveDown");
        modal.classList.toggle("moveUp");
    closeModal.addEventListener('click', () => {
        modal.classList.remove("moveUp");
        modal.classList.toggle("moveDown");
    });
        setTimeout(() => {
            buscador.focus();
        }, 1000);

    });


} else {
    openModal.addEventListener('click', () => {
        setTimeout(() => {
            buscador.focus();
        }, 1000);
    })
}



const printRes = compararResultado => {

    listaCoincidencias.innerHTML = "";
    content.innerHTML = "";
    resultSearch.innerHTML = "";

    let lists = "";
    if (compararResultado.length > 0) {
        contInput.innerHTML = `<i class="alk-icon-close icon-search" title="Limpiar campo"></i>`;
        buscador.style.border = "1px solid #004797";
        contInput.addEventListener('click', () => {
            buscador.value = "";
            contInput.innerHTML = `<i class="alk-icon-search-mobile icon-search"></i>`;
            listaCoincidencias.innerHTML = "";
            buscador.style.border = "1px solid #004797";
            buscador.setAttribute("placeholder", "Ingresa de tu municipio");
            buscador.focus();
        }, 4000);
        const opciones = compararResultado.map(card => {

            let nameDepto = card.dep;
            let nombreDepto = limpiarTexto(nameDepto);
            let nombreMunicipio = card.value;
            let nombreMunLimpio = limpiarTexto(nombreMunicipio);
            let text = buscador.value;
            let textLimpio = limpiarTexto(text);
            let location = `${nombreMunLimpio}, ${nombreDepto}`;
            prueba = location.includes(textLimpio);
            if ( location.includes(textLimpio)) {
                listaCoincidencias.style.display = "block";
                listaCoincidencias.innerHTML +=
                    `<span id="${card.value}" class="selectOp"><div class="dropdown-item">
            <div class="panel panel-default">
            <div class="panel-heading">
            <p><i class="alk-icon-pin-generico"></i> ${card.nombre_ciudad}, ${card.dep}</p>
            </div>
            </div>
            </div></span>`;
                lists = listaCoincidencias.querySelectorAll("span");

                for (let i = 0; i < lists.length; i++) {
                    lists[i].addEventListener('click', selectCard);

                    function selectCard() {
                        contInput.innerHTML = `<i class="alk-icon-search-mobile icon-search"></i>`;
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
   if (lists.length === 0) {

        setTimeout(() => {
            listaCoincidencias.style.display = "block";
            buscador.style.border = "1px solid #DD171B";
            listaCoincidencias.innerHTML = `<div class="cont-no-results text-center">
            <img class="img img-responsive" src="/medias/no-resultados-envio.png?context=bWFzdGVyfG1ldG9kb3MtZW52aW98MTA4MjB8aW1hZ2UvcG5nfGhjNS9oYWQvMTM1Njg3MDk1MjU1MzQvbm9fcmVzdWx0YWRvc19lbnZpby5wbmd8NDFjYmNlYWQ1YzFmYTRkNmEyZjdkOGY3Yzg5Mzk2Mjc2OWQ2NGI1ZTM0ZjhkMzU0ZmU1ZWEwZDA1ODBhZmNmYQ"/>
            <div class="txt-no-results text-center">
            <h4>¡Aún no llegamos a tu destino!</h4>
            <h4>Seguimos trabajando para ello.</h4>
            </div>
            </div>`;

            contInput.innerHTML = `<i class="alk-icon-close icon-search" title="Limpiar campo"></i>`;
            contInput.addEventListener('click', () => {
                buscador.value = "";
                contInput.innerHTML = `<i class="alk-icon-search-mobile icon-search"></i>`;
                listaCoincidencias.innerHTML = "";
                buscador.style.border = "1px solid #004797";
                buscador.setAttribute("placeholder", "Ingresa el nombre de tu municipio");
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