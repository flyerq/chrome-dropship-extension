document.addEventListener('getProductData', () => {
  const data = (window.goodsDetailv2SsrData || {}).productIntroData || null;
  document.dispatchEvent(new CustomEvent('productData', {
    detail: data,
  }));
});