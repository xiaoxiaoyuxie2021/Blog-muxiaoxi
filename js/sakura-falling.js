(function () {
  const canvas = document.getElementById('sakura');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const petals = [];
  const petalCount = 15;
  const colors = ['#ffeef8', '#ffd1dc', '#ffb7c5', '#ff85a2'];

  class Petal {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 8 + 4;
      this.speed = Math.random() * 0.8 + 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.tilt = Math.random() * 10 - 10;
    }
    update() {
      this.y += this.speed;
      this.tilt += 0.04;
      this.x += Math.sin(this.tilt) * 0.3;
      if (this.y > canvas.height) {
        this.y = -20;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.tilt);
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.r / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) petals.push(new Petal());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();