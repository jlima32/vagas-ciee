//URLs das APIs para consulta de vagas e registro da última vaga visualizada
const urlVagas = "https://api.ciee.org.br/vagas/vitrine-vaga/publicadas?page=0&size=20&sort=codigoVaga,desc&tipoVaga=ESTAGIO&nivelEnsino=SU&idAreaProfissional=18";
const urlUltimaVaga = "https://65fe3736b2a18489b385d799.mockapi.io/vagas/ultimaVaga";

consultarVagas();

// Função para consultar as vagas
async function consultarVagas(){
    try{
        // Faz a busca das vagas
        const vagas = await fetchJson(urlVagas);
        // Filtra as vagas do estado de São Paulo
        const vagasFiltradas = vagas.content.filter(vaga => vaga.local.uf == "SP");
        // vagasFiltradas.forEach(vaga => {
        //     console.log(`
        //         Código da vaga: ${vaga.codigoVaga}
        //         Nome da Empresa: ${vaga.nomeEmpresa}
        //         Bolsa Auxílio: R$ ${vaga.bolsaAuxilio.toFixed(2)} / ${vaga.tipoAuxilioBolsa}}
        //         Local do Estágio: ${vaga.local.cidade} - ${vaga.local.uf};
        //     `)
        // });

        // Guarda o código da última vaga
        const codigoUltimaVaga = vagasFiltradas[0].codigoVaga;
        // console.log(codigoUltimaVaga)
        
        // Faz a busca da última vaga cadastrada
        const consultaUltimaVagaCadastrada = await fetchJson(urlUltimaVaga);
        // console.log(consultaUltimaVagaCadastrada)

        // Guarda o número da última vaga para cadastro (se necessário)
        const codigoUltimaVagaCadastrada = consultaUltimaVagaCadastrada.length > 0 ? consultaUltimaVagaCadastrada[consultaUltimaVagaCadastrada.length - 1].numeroVaga : 0;
        // console.log(codigoUltimaVagaCadastrada);

        // Verifica se existem novas vagas
        verificarVagas(codigoUltimaVaga, codigoUltimaVagaCadastrada, vagasFiltradas);

    }catch(error){
        console.log("Erro ao consultar vagas: ", error)
    }
}

// Função para veriricar se tem novas vagas
function verificarVagas(codigoUltimaVaga, codigoUltimaVagaCadastrada, listaVagas){
    if(codigoUltimaVaga == codigoUltimaVagaCadastrada){
        // Caso não existam novas vagas
        let header = document.querySelector("header");
        pInfoVagas = document.createElement("p");
        pInfoVagas.setAttribute("class", "info-vagas sem-vagas");
        pInfoVagas.innerHTML = "Sem Novas Vagas!";
        header.appendChild(pInfoVagas);
        mostrarVagas(listaVagas);
        // console.log(listaVagas);
    }else{
        // Caso existam novas vagas
        let header = document.querySelector("header");
        pInfoVagas = document.createElement("p");
        pInfoVagas.setAttribute("class", "info-vagas novas-vagas");
        pInfoVagas.innerHTML = "Foram Encontradas Novas Vagas!";
        header.appendChild(pInfoVagas);
        // Registra a última vaga visualizada
        cadastrarUltimaVaga(codigoUltimaVaga);
        // console.log(listaVagas);
        mostrarVagas(listaVagas);
    }
}

// Função para cadastrar a última vaga visualizada
async function cadastrarUltimaVaga(codigo){
    try{
        //Envia uma requisição para registrar a última vaga visualizada
        await fetch(urlUltimaVaga,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ numeroVaga: codigo })
        });
    }catch (error) {
        console.log("Erro ao cadastrar código da última vaga: ", error)
    }
}

// Função para mostrar as vagas
function mostrarVagas(listaVagas){
    //seleciona a section no index.html
    let section = document.querySelector("section");


    listaVagas.forEach(vagas => {

        // cria uma div
        let vagasWrapper = document.createElement("div");
        // define a classe da div criada
        vagasWrapper.setAttribute("class","vaga-wrapper");
        // cria a div dentro da section
        section.appendChild(vagasWrapper);

        if(vagas.bolsaAuxilio == null){
            vagas.bolsaAuxilio = " ";
        }else{
            vagas.bolsaAuxilio = vagas.bolsaAuxilio.toFixed(2);
        }

        let vaga = document.createElement("div");
        vagasWrapper.appendChild(vaga);

        pVagaEmpresa = document.createElement("p");
        pVagaEmpresa.setAttribute("class","title");
        pVagaEmpresa.innerHTML = "Empresa: ";
        vaga.appendChild(pVagaEmpresa);
        vaga.setAttribute("class","vaga");
        spanNomeEmpresa = document.createElement("span");
        spanNomeEmpresa.setAttribute("class","info");
        spanNomeEmpresa.innerHTML = vagas.nomeEmpresa;
        pVagaEmpresa.appendChild(spanNomeEmpresa);
        
        pLine = document.createElement("p");
        pLine.setAttribute("class","line");
        vaga.appendChild(pLine);

        pCodigoVaga = document.createElement("p");
        pCodigoVaga.setAttribute("class", "title");
        pCodigoVaga.innerHTML = "Código da Vaga: ";
        vaga.appendChild(pCodigoVaga);
        spanCodigoVaga = document.createElement("span");
        spanCodigoVaga.setAttribute("class", "info");
        spanCodigoVaga.innerHTML = vagas.codigoVaga;
        pCodigoVaga.appendChild(spanCodigoVaga);

        pBolsaAuxilio = document.createElement("p");
        pBolsaAuxilio.setAttribute("class", "title");
        pBolsaAuxilio.innerHTML = "Bolsa Auxílio: ";
        vaga.appendChild(pBolsaAuxilio);
        spanBolsaAuxilio = document.createElement("span");
        spanBolsaAuxilio.setAttribute("class", "info");
        spanBolsaAuxilio.innerHTML = `R$ ${vagas.bolsaAuxilio} / ${vagas.tipoAuxilioBolsa}`;
        pBolsaAuxilio.appendChild(spanBolsaAuxilio);

        pLocal = document.createElement("p");
        pLocal.setAttribute("class", "title");
        pLocal.innerHTML = "Local do Estágio: ";
        vaga.appendChild(pLocal);
        spanLocal = document.createElement("span");
        spanLocal.setAttribute("class", "info");
        spanLocal.innerHTML = `${vagas.local.cidade} - ${vagas.local.uf}`;
        pLocal.appendChild(spanLocal);

        divBtn = document.createElement("div");
        divBtn.setAttribute("class", "btn-vaga");
        vaga.appendChild(divBtn);
        buttonLink = document.createElement("p");
        buttonLink.setAttribute("class", "btn-link");
        buttonLink.innerHTML = `<a href='https://portal.ciee.org.br/quero-uma-vaga/?codigoVaga=${vagas.codigoVaga}' target='_blank'>Visualizar Vaga</a>`;
        divBtn.appendChild(buttonLink);
    });

}

async function fetchJson(url){
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json();
}