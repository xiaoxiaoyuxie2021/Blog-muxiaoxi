function openLightbox(src) {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;                      
  box.style.display = 'flex';         
}
function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}
