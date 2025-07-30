function configureR3() {
    let rr_env = "recs"; // Definido para Ambiente de integração: integration = homologação - recs = produção

    // A condicional abaixo permite alterar o ambiente das recomendações passando um parâmetro na URL. Exemplo: https://demo.richrelevance.com/?r3_env=integration
    if (window.location.href.indexOf("r3_env=integration") > -1) {
        rr_env = "integration";
    } else if (window.location.href.indexOf("r3_env=recs") > -1) {
        rr_env = "recs";
    }

    // Configurações básicas 
    window.R3_COMMON = new r3_common();
    window.R3_COMMON.setApiKey('c85912f892c73e30'); // Chave de identificação da loja (Solicitar ao Consultor)
    window.R3_COMMON.apiClientKey = 'd87e7a0748a78f10';
    window.R3_COMMON.setBaseUrl('https://' + rr_env + '.richrelevance.com/rrserver/'); // Define endpoint
    window.R3_COMMON.setClickthruServer(window.location.protocol + '//' + window.location.host); // Define a base de click dos produtos
    window.R3_COMMON.setSessionId('rr-345g67-63gyt7-376585-hdjf-374ee8'); // Sessão única em toda a navegação, deve ser alterada APÓS o envio do pedido finalizado
}