
(function () {
  // 🔁 Substitua esse seletor pelo ID ou classe do elemento onde a vitrine será inserida
  const targetElement = document.querySelector('#__next > main > div');

  if (!targetElement) {
    console.error('Elemento de destino não encontrado!');
    return;
  }

  // 💅 Estilos
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #fdfdfd; color: #333; }
    #vitrine { max-width: 1215px; margin: 40px auto; padding: 0 20px; }
    #vitrineTitle { font-size: 1.8rem; font-weight: 600; margin-bottom: 24px; text-align: center; color: #222; }
    .vitrine-container { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
    .banner { flex: 1; min-width: 200px; display: flex; justify-content: center; align-items: center; }
    .banner img { width: 100%; max-width: 200px; border-radius: 12px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); }
    .carousel { flex: 2; position: relative; overflow: hidden; padding: 10px 0; }
    .carousel-track { display: flex; gap: 20px; transition: transform 0.3s ease; }
    .product-card { min-width: 180px; max-width: 180px; background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06); text-align: center; font-size: 14px; }
    .product-card img { width: 100%; height: 140px; object-fit: contain; margin-bottom: 12px; }
    .product-card strong { font-weight: 600; display: block; margin: 6px 0; }
    .carousel-controls { position: absolute; top: 50%; left: 0; right: 0; display: flex; justify-content: space-between; transform: translateY(-50%); padding: 0 10px; pointer-events: none; }
    .carousel-controls button { background: rgba(0, 0, 0, 0.3); border: none; color: white; font-size: 20px; cursor: pointer; padding: 8px; border-radius: 50%; pointer-events: all; transition: background 0.2s ease; }
    .carousel-controls button:hover { background: rgba(0, 0, 0, 0.6); }
    @media (max-width: 768px) {
      .vitrine-container { flex-direction: column; align-items: center; }
      .carousel { width: 100%; }
      .product-card { min-width: 160px; }
      .carousel-controls { display: none; }
    }
  `;
  document.head.appendChild(style);

  // 🧱 HTML
  const vitrine = document.createElement('div');
  vitrine.innerHTML = `
    <div id="vitrine">
      <h2 id="vitrineTitle">Carregando...</h2>
      <div class="vitrine-container">
        <div class="banner" id="banner"></div>
        <div class="carousel">
          <div class="carousel-track" id="carousel-track"></div>
          <div class="carousel-controls">
            <button id="prev">&#8592;</button>
            <button id="next">&#8594;</button>
          </div>
        </div>
      </div>
    </div>
  `;
  targetElement.appendChild(vitrine);

  // 🔄 Funções
  async function loadVitrine() {
    try {
      const bannerRes = await fetch("https://recs.richrelevance.com/rrserver/api/personalize?apiKey=c85912f892c73e30&apiClientKey=d87e7a0748a78f10&sessionId=algtestsession565762692369&userId=algtestuser511882474924&placements=home_page.dxp_img_recs_engage&excludeHtml=true");
      const bannerData = await bannerRes.json();
      const bannerImg = bannerData.placements[0].creatives[0].URL_IMAGEM;
      const bannerLink = bannerData.placements[0].creatives[0].URL_CLICK;
      const strategy = bannerData.placements[0].creatives[0].STRATEGY;

      document.getElementById("banner").innerHTML = `<a href="${bannerLink}"><img src="${bannerImg}" alt="Banner" /></a>`;

      const productsRes = await fetch(`https://recs.richrelevance.com/rrserver/api/rrPlatform/recsForPlacementsContext?apiClientKey=d87e7a0748a78f10&apiKey=c85912f892c73e30&placements=home_page.dxp_img_recs_recommend&sessionId=recstestdrivesession-91696720f517&useHttps=true&ts=${Date.now()}&includeStrategyData=true&excludeItemAttributes=true&categoryData=true&excludeHtml=true&strategy=${strategy}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placementContextInfo: [{
            placementName: "home_page.dxp_img_recs_recommend",
            placementConfig: {
              strategyConfig: {
                strategies: [strategy],
                reorder: false
              },
              productIds: [null]
            }
          }],
          enableStrategyDuplication: false
        })
      });

      const productsData = await productsRes.json();
      const items = productsData.placements[0].recommendedProducts;
      const carouselTrack = document.getElementById("carousel-track");

      items.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${item.imageURL}" alt="${item.name}" />
          <strong>${item.brand || "RARE BEAUTY"}</strong>
          <div>${item.name}</div>
          <div><strong>${
            item.salePriceCents != null
              ? "R$ " + (item.salePriceCents / 100).toFixed(2).replace('.', ',')
              : "Preço indisponível"
          }</strong></div>`;
        carouselTrack.appendChild(card);
      });

      document.getElementById("vitrineTitle").textContent = productsData.placements[0].strategyMessage || "Recomendamos para você";
      setupCarousel();
    } catch (err) {
      console.error("Erro ao carregar vitrine:", err);
    }
  }

  function setupCarousel() {
    const track = document.getElementById("carousel-track");
    let currentIndex = 0;

    document.getElementById("next").onclick = () => {
      const totalItems = track.children.length;
      const maxIndex = totalItems - 3;
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    };

    document.getElementById("prev").onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    };

    function updateCarousel() {
      const cardWidth = track.children[0].offsetWidth + 20;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  }

  // ▶️ Inicializar
  loadVitrine();
})();
