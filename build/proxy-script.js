document.addEventListener("getProductData",(()=>{const t=(window.goodsDetailv2SsrData||{}).productIntroData||null;document.dispatchEvent(new CustomEvent("productData",{detail:t}))}));