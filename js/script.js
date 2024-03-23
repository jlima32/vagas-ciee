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

        console.log(listaVagas);

    }else{
        // Caso existam novas vagas
        let header = document.querySelector("header");
        pInfoVagas = document.createElement("p");
        pInfoVagas.setAttribute("class", "info-vagas novas-vagas");
        pInfoVagas.innerHTML = "Foram Encontradas Novas Vagas!";
        header.appendChild(pInfoVagas);

        console.log(listaVagas);
    }

}

async function fetchJson(url){
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json();
}