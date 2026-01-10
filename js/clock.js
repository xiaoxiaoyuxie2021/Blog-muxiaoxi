!function(){
  function tick(){
    const now=new Date();
    clock.textContent=
      now.getFullYear()+'年'+
      String(now.getMonth()+1).padStart(2,0)+'月'+
      String(now.getDate()).padStart(2,0)+'日 '+
      String(now.getHours()).padStart(2,0)+':'+
      String(now.getMinutes()).padStart(2,0)+':'+
      String(now.getSeconds()).padStart(2,0);
  }
  tick(); 
  setInterval(tick,1000);
}();
