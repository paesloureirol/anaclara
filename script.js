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

let lightboxAtual = null;

function abrirLightbox(id) {
  const lightbox = document.querySelector(id);
  if (!lightbox) return;

  document.querySelectorAll('.lightbox').forEach(item => item.classList.remove('active'));
  lightbox.classList.add('active');
  lightboxAtual = id;
  document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
  const fotoFechada = lightboxAtual;

  document.querySelectorAll('.lightbox').forEach(item => item.classList.remove('active'));
  lightboxAtual = null;
  document.body.style.overflow = '';

  if (fotoFechada) {
    fotosVistas.add(fotoFechada);
    const todasFotosFechadas = fotosVistas.size === totalFotos;
    const nenhumaLightboxAberta = document.querySelectorAll('.lightbox.active').length === 0;

    if (todasFotosFechadas && nenhumaLightboxAberta && !sequenciaFinalAtiva) {
      mostrarSequenciaFinal();
    }
  }
}

const totalFotos = document.querySelectorAll('.lightbox').length;
const fotosVistas = new Set();
let sequenciaFinalAtiva = false;

function fecharMensagemFinal(caixa) {
  if (!caixa || caixa.classList.contains('closing')) return;

  caixa.classList.add('closing');
  caixa.classList.remove('show');
  caixa.classList.add('fade-out');

  setTimeout(() => caixa.remove(), 500);
}

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
        <button class="mensagem-fechar" aria-label="Fechar mensagem">×</button>
        <h3 class="final-titulo">Reparou algo?</h3>
        <div class="final-linha"></div>
        <p>Reparou que em todos os textos escritos não tinham ponto final?? Isso foi propositalmente porque está história ainda não acabou e está muuuiito<br>longe do fim.</p>
        <span class="mensagem-assinatura">-De: Seu namorado musculoso💪</span>
      </div>
    `;
    document.body.appendChild(caixa);
    const botaoFechar = caixa.querySelector('.mensagem-fechar');
    if (botaoFechar) {
      botaoFechar.addEventListener('click', (event) => {
        event.stopPropagation();
        fecharMensagemFinal(caixa);
      });
    }
    caixa.addEventListener('click', () => fecharMensagemFinal(caixa));
    requestAnimationFrame(() => caixa.classList.add('show'));
  }, 4600);
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', (event) => {
    event.preventDefault();
    const alvo = card.getAttribute('href');
    if (alvo && alvo.startsWith('#')) {
      abrirLightbox(alvo);
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
  const botaoSim = document.querySelector('.btn-sim');
  const botaoNao = document.querySelector('.btn-nao');

  if (botaoSim) botaoSim.style.display = 'none';
  if (botaoNao) botaoNao.style.display = 'none';

  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '9999';
  canvas.style.background = 'radial-gradient(circle at center, #201018 0%, #050305 70%)';
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 0.8s ease';
  document.body.appendChild(canvas);
  setTimeout(() => (canvas.style.opacity = '1'), 20);

  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const particulas = [];
  const total = 700;

  for (let i = 0; i < total; i++) {
    const t = (i / total) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const escala = Math.min(canvas.width, canvas.height) / 48;

    particulas.push({
      fx: cx + x * escala,
      fy: cy + y * escala,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tamanho: Math.random() * 2.2 + 1.2,
      cor: `hsla(${Math.random() * 30 + 330}, 100%, ${60 + Math.random() * 15}%, 0.95)`,
      velocidade: Math.random() * 0.04 + 0.02,
    });
  }

  let textoOpacity = 0;

  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const brilho = ctx.createRadialGradient(cx, cy - 50, 50, cx, cy, Math.max(cx, cy));
    brilho.addColorStop(0, 'rgba(255, 138, 185, 0.18)');
    brilho.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = brilho;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let convergidas = 0;

    particulas.forEach((p) => {
      p.x += (p.fx - p.x) * p.velocidade;
      p.y += (p.fy - p.y) * p.velocidade;
      const dist = Math.hypot(p.fx - p.x, p.fy - p.y);
      if (dist < 2) convergidas++;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
      ctx.fillStyle = p.cor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 120, 165, 0.9)';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (convergidas > total * 0.88) {
      textoOpacity = Math.min(textoOpacity + 0.025, 1);
      ctx.save();
      ctx.globalAlpha = textoOpacity;
      ctx.font = Math.min(canvas.width / 11, 76) + 'px Cormorant Garamond, serif';
      ctx.fillStyle = '#fff7fb';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 18;
      ctx.shadowColor = 'rgba(255, 120, 165, 0.7)';
      ctx.fillText('Eu te amo', cx, cy - 8);
      ctx.font = Math.min(canvas.width / 24, 24) + 'px Jost, sans-serif';
      ctx.fillStyle = '#f6c7d7';
      ctx.shadowBlur = 10;
      ctx.fillText('infinitamente meu amor', cx, cy + 36);
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
      if (botaoSim) botaoSim.style.display = '';
      if (botaoNao) botaoNao.style.display = '';
    }, 1000);
  });
}
