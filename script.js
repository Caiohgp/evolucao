/* Evolução Elevadores — interações da landing page */
(function () {
  'use strict';

  /* Ano atual no rodapé */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Menu mobile */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Sombra no header ao rolar */
  var header = document.getElementById('header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Animação de revelação */
  var revealTargets = document.querySelectorAll(
    '.value-card, .service, .step, .quote, .stat, .safety__text, .safety__media, .hero__card, .faq-item'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Contadores animados */
  var counters = document.querySelectorAll('.stat__num[data-count]');
  var animateCount = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var start = null, dur = 1400;
    var tick = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Lightbox do portfólio */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var openLightbox = function (src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };
    document.querySelectorAll('.gallery__item').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        openLightbox(item.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* Toast */
  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-show'); });
    setTimeout(function () {
      t.classList.remove('is-show');
      setTimeout(function () { t.remove(); }, 400);
    }, 4200);
  }

  /* Formulários -> encaminha para o WhatsApp (sem backend) */
  var WA_NUMBER = '5511982812971';
  document.querySelectorAll('form[data-lead]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var nome = (data.get('nome') || '').toString().trim();
      var telefone = (data.get('telefone') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var tipo = (data.get('tipo') || '').toString().trim();
      var necessidade = (data.get('necessidade') || '').toString().trim();
      var mensagem = (data.get('mensagem') || '').toString().trim();

      var linhas = ['Olá! Vim pelo site e gostaria de um orçamento.'];
      if (nome) linhas.push('Nome: ' + nome);
      if (telefone) linhas.push('Contato: ' + telefone);
      if (email) linhas.push('E-mail: ' + email);
      if (tipo) linhas.push('Perfil: ' + tipo);
      if (necessidade) linhas.push('Necessidade: ' + necessidade);
      if (mensagem) linhas.push('Mensagem: ' + mensagem);

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(linhas.join('\n'));
      /* Abre ainda dentro do submit: fora do gesto do usuário o Safari/iOS bloqueia o popup */
      var win = window.open(url, '_blank');
      if (win) {
        win.opener = null;
      } else {
        window.location.href = url;
      }
      showToast('Redirecionando para o WhatsApp...');
      form.reset();
    });
  });
})();
