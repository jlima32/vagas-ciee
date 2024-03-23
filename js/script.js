//URLs das APIs para consulta de vagas e registro da última vaga visualizada
const urlVagas = "https://api.ciee.org.br/vagas/vitrine-vaga/publicadas?page=0&size=20&sort=codigoVaga,desc&tipoVaga=ESTAGIO&nivelEnsino=SU&idAreaProfissional=18";
const utlUltimaVaga = "https://65fe3736b2a18489b385d799.mockapi.io/vagas/ultimaVaga";

consultarVagas();

// Função para consultar as vagas
async function consultarVagas(){
    try{
        // Faz a busca das vagas
        const vagas = await fetchJson(urlVagas);
        // Filtra as vagas do estado de São Paulo
        const vagasFiltradas = vagas.content.filter(vaga => vaga.local.uf == "SP");
        vagasFiltradas.forEach(vaga => {
            console.log(`
                Código da vaga: ${vaga.codigoVaga}
                Nome da Empresa: ${vaga.nomeEmpresa}
                Bolsa Auxílio: R$ ${vaga.bolsaAuxilio.toFixed(2)} / ${vaga.tipoAuxilioBolsa}}
                Local do Estágio: ${vaga.local.cidade} - ${vaga.local.uf};
            `)
        });
    }catch(error){
        console.log("Erro ao consultar vagas: ", error)
    }
}

async function fetchJson(url){
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json();
}