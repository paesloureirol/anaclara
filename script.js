const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.card').forEach(card => {
  card.style.animationPlayState = 'paused';
  observer.observe(card);
});

function entrar() {
  document.getElementById('splash').classList.add('hide');
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
  }, 800);
}

function escapar(btn) {
  const x = Math.random() * (window.innerWidth - 150);
  const y = Math.random() * (window.innerHeight - 60);
  btn.style.position = 'fixed';
  btn.style.left = x + 'px';
  btn.style.top = y + 'px';
}

function simClicar() {
  document.querySelector('.btn-sim').style.display = 'none';
  document.querySelector('.btn-nao').style.display = 'none';

  const canvas = document.createElement('canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position   = 'fixed';
  canvas.style.top        = '0';
  canvas.style.left       = '0';
  canvas.style.zIndex     = '9999';
  canvas.style.background = '#000';
  canvas.style.opacity    = '0';
  canvas.style.transition = 'opacity 0.8s ease';
  document.body.appendChild(canvas);
  setTimeout(() => canvas.style.opacity = '1', 10);

  const ctx = canvas.getContext('2d');
  const cx  = canvas.width  / 2;
  const cy  = canvas.height / 2;

  const particulas = [];
  const total = 600;

  for (let i = 0; i < total; i++) {
    const t = (i / total) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    const escala = Math.min(canvas.width, canvas.height) / 50;
    particulas.push({
      fx: cx + x * escala,
      fy: cy + y * escala,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tamanho: Math.random() * 3 + 1,
      cor: 'hsl(' + (Math.random() * 30 + 340) + ', 100%, ' + (Math.random() * 30 + 60) + '%)',
      velocidade: Math.random() * 0.04 + 0.02,
    });
  }

  let textoOpacity = 0;

  function animar() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let convergidas = 0;
    particulas.forEach(function(p) {
      p.x += (p.fx - p.x) * p.velocidade;
      p.y += (p.fy - p.y) * p.velocidade;
      const dist = Math.hypot(p.fx - p.x, p.fy - p.y);
      if (dist < 2) convergidas++;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
      ctx.fillStyle = p.cor;
      ctx.fill();
    });
    if (convergidas > total * 0.9) {
      textoOpacity = Math.min(textoOpacity + 0.02, 1);
      ctx.save();
      ctx.globalAlpha = textoOpacity;
      ctx.font = Math.min(canvas.width / 12, 60) + 'px Cormorant Garamond, serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('Eu te amo', cx, cy + 10);
      ctx.font = Math.min(canvas.width / 25, 24) + 'px Jost, sans-serif';
      ctx.fillStyle = '#c9a96e';
      ctx.fillText('clique para continuar', cx, cy + 55);
      ctx.restore();
    }
    requestAnimationFrame(animar);
  }

  animar();

  canvas.addEventListener('click', function() {
    canvas.style.transition = 'opacity 1s ease';
    canvas.style.opacity = '0';
    setTimeout(function() {
      canvas.remove();
      document.querySelector('.btn-sim').style.display = '';
      document.querySelector('.btn-nao').style.display = '';
    }, 1000);
  });
}
