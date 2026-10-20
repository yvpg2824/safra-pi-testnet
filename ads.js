/* SAFRA.PI — Pi Ad Network */

(() => {
    "use strict";

    async function mostrarAnuncio() {
        const botao = document.getElementById("testAdButton");

        if (botao) botao.disabled = true;

        try {
            if (!window.Pi || !window.Pi.Ads) {
                alert("A Pi Ad Network não está disponível neste navegador.");
                return;
            }

            if (!window.SafraPiAuth?.isAuthenticated()) {
                alert("Entre com sua conta Pi antes de testar o anúncio.");
                return;
            }

            const recursos = await Pi.nativeFeaturesList();

            if (!recursos.includes("ad_network")) {
                alert("Atualize seu Pi Browser para utilizar anúncios.");
                return;
            }

            const resultado = await Pi.Ads.showAd("interstitial");

            if (resultado.result === "AD_CLOSED") {
                console.log("Anúncio encerrado.");
            } else {
                console.log("Resultado do anúncio:", resultado.result);
                alert("O anúncio não foi exibido. Verifique o console.");
            }

        } catch (erro) {
            console.error("Erro na Pi Ad Network:", erro);
            alert("Não foi possível exibir o anúncio.");
        } finally {
            if (botao) botao.disabled = false;
        }
    }

    document.getElementById("testAdButton")
        ?.addEventListener("click", mostrarAnuncio);
})();
