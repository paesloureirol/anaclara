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

function abrirLightbox(id) {
  const lightbox = document.querySelector(id);
  if (!lightbox) return;

  document.querySelectorAll('.lightbox').forEach(item => item.classList.remove('active'));
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
  document.querySelectorAll('.lightbox').forEach(item => item.classList.remove('active'));
  document.body.style.overflow = '';
}

const totalFotos = document.querySelectorAll('.lightbox').length;
const fotosVistas = new Set();
let sequenciaFinalAtiva = false;

function mostrarSequenciaFinal() {
  if (sequenciaFinalAtiva) return;

  sequenciaFinalAtiva = true;

  const overlay = document.createElement('div');
  overlay.className = 'final-sequencia';
  overlay.innerHTML = `
    <div class="final-pontos">
      <span>?</span>
      <span>?</span>
      <span>?</span>
      <span>?</span>
      <span>?</span>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 600);
  }, 4000);

  setTimeout(() => {
    const caixa = document.createElement('div');
    caixa.className = 'final-mensagem';
    caixa.innerHTML = `
      <div class="mensagem final-mensagem-caixa">
        <h3 class="final-titulo">Reparou algo?</h3>
        <div class="final-linha"></div>
        <p>Reparou que em todos os textos escritos não tinham ponto final?? Isso foi propositalmente porque essa historia ainda não acabou e esta muuuiito longe do fim.</p>
        <span class="mensagem-assinatura">-De: Seu namorado musculoso💪</span>
      </div>
    `;
    document.body.appendChild(caixa);
    requestAnimationFrame(() => caixa.classList.add('show'));
  }, 4600);
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', (event) => {
    event.preventDefault();
    const alvo = card.getAttribute('href');
    if (alvo && alvo.startsWith('#')) {
      abrirLightbox(alvo);
      fotosVistas.add(alvo);
      if (fotosVistas.size === totalFotos) {
        mostrarSequenciaFinal();
      }
    }
  });
});

document.querySelectorAll('.lightbox-fechar').forEach(botao => {
  botao.addEventListener('click', (event) => {
    event.preventDefault();
    fecharLightbox();
  });
});

document.querySelectorAll('.lightbox').forEach(lightbox => {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      fecharLightbox();
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    fecharLightbox();
  }
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
