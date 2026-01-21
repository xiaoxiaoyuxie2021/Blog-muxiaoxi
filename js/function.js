(function(){
  const pcWidth = 1920;                    
  const scale = screen.width / pcWidth;    
  const meta = document.querySelector('meta[name=viewport]');
  meta.setAttribute('content',
    `width=${pcWidth},initial-scale=${scale},minimum-scale=${scale},maximum-scale=${scale},user-scalable=no`);
})();
