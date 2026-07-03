/* fuerza CSS fresco sin importar caché del navegador */
(function(){
  var s=document.createElement('link');
  s.rel='stylesheet';
  s.href='site-v2.css?t='+Date.now();
  document.head.appendChild(s);
})();

/* aplica todos los cambios al DOM aunque el HTML esté en caché */
function _applyDOMChanges(){
  /* 1. actualiza imágenes del carrusel */
  var imgs = {
    'hero-2.jpg':'hero-2b.jpg','hero-3.jpg':'hero-3b.jpg',
    'hero-4.jpg':'hero-4b.jpg','hero-5.jpg':'hero-5b.jpg',
    'hero-6.jpg':'hero-6b.jpg','hero-7.jpg':'hero-7b.jpg',
    'hero-9.jpg':'hero-9b.jpg','hero-12.jpg':'hero-12b.jpg',
    'hero-8.jpg':'hero-8d.jpg','hero-8b.jpg':'hero-8d.jpg','hero-8c.jpg':'hero-8d.jpg'
  };
  document.querySelectorAll('.carousel-img').forEach(function(img){
    Object.keys(imgs).forEach(function(old){
      if(img.src.indexOf(old)!==-1) img.src=img.src.replace(old,imgs[old]);
    });
  });

  /* 2. quita slides de hero-7, hero-8, hero-10, hero-11 */
  var quitar = ['hero-7','hero-8','hero-10','hero-11'];
  document.querySelectorAll('.carousel-slide').forEach(function(slide){
    var img = slide.querySelector('.carousel-img');
    if(img && quitar.some(function(h){ return img.src.indexOf(h)!==-1; })){
      slide.remove();
    }
  });

  /* 3. reconstruye puntos según slides restantes */
  var slides = document.querySelectorAll('.carousel-slide');
  var dotsBox = document.querySelector('.carousel-dots');
  if(dotsBox){
    dotsBox.innerHTML='';
    slides.forEach(function(_,i){
      var d=document.createElement('span');
      d.className='dot'+(i===0?' active':'');
      d.setAttribute('data-index',i);
      dotsBox.appendChild(d);
    });
  }

  /* 4. quita botón Ver Vehículos */
  document.querySelectorAll('a.btn-secondary').forEach(function(a){
    if(a.textContent.trim()==='Ver Vehículos') a.remove();
  });

  /* 5. quita sección Características del Servicio */
  var svc = document.querySelector('.service-features-section');
  if(svc) svc.remove();

  /* 6. actualiza imagen Land Cruiser (prado.webp → prado1.webp) */
  document.querySelectorAll('img[src*="prado.webp"]').forEach(function(img){
    img.src = img.src.replace('prado.webp','prado1.webp');
  });

  /* 7b. actualiza imagen 4Runner (toyota-four-runner.webp → runner1.webp) */
  document.querySelectorAll('img[src*="four-runner"]').forEach(function(img){
    img.src = img.src.replace('toyota-four-runner.webp','runner1.webp');
    img.style.objectFit = 'contain';
  });

  /* 7c. actualiza imagen Fortuner (toyota-fortuner.webp → fortuner1.webp) */
  document.querySelectorAll('img[src*="toyota-fortuner"]').forEach(function(img){
    img.src = img.src.replace('toyota-fortuner.webp','fortuner1.webp');
    img.style.objectFit = 'contain';
  });

  /* 7. centra botón SOLICITAR AHORA y quita margen negativo vía estilo inline */
  document.querySelectorAll('.vehicle-actions').forEach(function(el){
    el.style.alignItems = 'center';
    el.style.marginTop  = '0';
  });

  /* 8. lightbox – clic en foto del vehículo muestra imagen grande */
  var lb = document.createElement('div');
  lb.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;align-items:center;justify-content:center;cursor:zoom-out;';
  var lbClose = document.createElement('button');
  lbClose.innerHTML = '&times;';
  lbClose.style.cssText = 'position:absolute;top:16px;right:24px;background:none;border:none;color:#fff;font-size:3rem;cursor:pointer;line-height:1;padding:0;';
  var lbImg = document.createElement('img');
  lbImg.style.cssText = 'max-width:90vw;max-height:88vh;object-fit:contain;border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.5);cursor:default;';
  lb.appendChild(lbClose);
  lb.appendChild(lbImg);
  document.body.appendChild(lb);

  function lbOpen(src,alt){ lbImg.src=src; lbImg.alt=alt||''; lb.style.display='flex'; document.body.style.overflow='hidden'; }
  function lbClose2(){ lb.style.display='none'; document.body.style.overflow=''; lbImg.src=''; }

  document.querySelectorAll('.vehicle-img img').forEach(function(img){
    img.style.cursor='zoom-in';
    img.addEventListener('click', function(){ lbOpen(this.src, this.alt); });
  });
  lbClose.addEventListener('click', lbClose2);
  lb.addEventListener('click', function(e){ if(e.target===lb) lbClose2(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') lbClose2(); });
}
/* corre inmediatamente si el DOM ya cargó, si no espera el evento */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',_applyDOMChanges);
} else {
  _applyDOMChanges();
}

/* ============================================================
   NAVEGACIÓN MOBILE
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.querySelector('i').classList.toggle('fa-bars');
    navToggle.querySelector('i').classList.toggle('fa-times');
  });

  // Cierra el menú al hacer clic en un enlace
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.querySelector('i').classList.add('fa-bars');
      navToggle.querySelector('i').classList.remove('fa-times');
    });
  });
}

/* ============================================================
   CAROUSEL
   ============================================================ */
(function () {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots   = document.querySelectorAll('.dot');
  const prev   = document.getElementById('carouselPrev');
  const next   = document.getElementById('carouselNext');
  let current  = 0;
  let timer    = null;

  if (!slides.length) return;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  prev?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  next?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  startAuto();
})();

/* ============================================================
   VALIDACIÓN DE FORMULARIOS
   ============================================================ */
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot check
    const trap = this.querySelector('[name="_trap"]');
    if (trap && trap.value) return;

    const requiredFields = this.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e53935';
        valid = false;
      }
    });

    if (!valid) {
      showMessage(this, 'Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    // Simulación de envío exitoso
    showMessage(this, '¡Gracias! Tu solicitud fue enviada. Te contactaremos pronto.', 'success');
    this.reset();
  });
});

document.querySelectorAll('.cv-form').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const fileInput = this.querySelector('[name="cv"]');
    if (!fileInput?.files?.length) {
      showMessage(this, 'Por favor, adjunta tu hoja de vida.', 'error');
      return;
    }
    const file = fileInput.files[0];
    const maxSize = 8 * 1024 * 1024; // 8 MB
    if (file.size > maxSize) {
      showMessage(this, 'El archivo supera el tamaño máximo de 8 MB.', 'error');
      return;
    }
    showMessage(this, '¡Hoja de vida enviada con éxito! Te contactaremos si hay una oportunidad.', 'success');
    this.reset();
  });
});

function showMessage(form, text, type) {
  let msg = form.querySelector('.form-message');
  if (!msg) {
    msg = document.createElement('p');
    msg.className = 'form-message';
    msg.style.cssText = 'margin-top:14px;padding:12px 16px;border-radius:6px;font-size:.9rem;font-weight:600;text-align:center;';
    form.appendChild(msg);
  }
  msg.textContent = text;
  msg.style.background = type === 'success' ? '#e8f5e9' : '#ffebee';
  msg.style.color       = type === 'success' ? '#2e7d32' : '#c62828';
  msg.style.border      = `1px solid ${type === 'success' ? '#a5d6a7' : '#ef9a9a'}`;
  setTimeout(() => msg.remove(), 5000);
}

/* ============================================================
   ANIMACIÓN DE APARICIÓN AL HACER SCROLL
   ============================================================ */
(function () {
  const targets = document.querySelectorAll(
    '.vehicle-card, .feature-card, .cert-card, .blog-card, .download-card'
  );

  if (!targets.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();

/* ============================================================
   ACORDEÓN DE MARCAS — vehiculos.html
   ============================================================ */
document.querySelectorAll('.brand-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const brand = btn.dataset.brand;

    // Desactiva todas las pestañas y paneles
    document.querySelectorAll('.brand-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.brand-panel').forEach(p => p.classList.remove('active'));

    // Activa la pestaña y panel seleccionados
    btn.classList.add('active');
    const panel = document.getElementById('panel-' + brand);
    if (panel) panel.classList.add('active');
  });
});

/* ============================================================
   MODAL COTIZACIÓN — vehiculos.html
   ============================================================ */
function abrirCotizacion(btn) {
  const card = btn.closest('.vehicle-card');
  const nombre = card.querySelector('h3').textContent;
  const modal = document.getElementById('modalCotizacion');
  const titulo = document.getElementById('modalVehiculoNombre');
  if (!modal) return;
  titulo.textContent = nombre;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

const modalOverlay = document.getElementById('modalCotizacion');
const modalClose   = document.getElementById('modalClose');

if (modalClose) {
  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
}
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   MOSTRAR / OCULTAR DETALLES — vehiculos.html
   ============================================================ */
document.querySelectorAll('.toggle-details-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const specs = btn.nextElementSibling;
    const open = specs.classList.toggle('open');
    btn.textContent = open ? 'Ocultar detalles' : 'Mostrar detalles';
  });
});

/* ============================================================
   BOTÓN FLOTANTE WHATSAPP — menú de agentes
   ============================================================ */
(function () {
  const btn  = document.getElementById('whatsappBtn');
  const menu = document.getElementById('whatsappMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', () => menu.classList.remove('open'));
})();

/* ============================================================
   NAV ACTIVO — resalta en rojo el enlace de la sección visible
   ============================================================ */
(function () {
  const navLinks = document.querySelectorAll('.main-nav a');

  // Solo corre en index.html — las demás páginas tienen nav-active en el HTML
  const path = window.location.pathname;
  if (path.includes('vehiculos') || path.includes('servicios') || path.includes('nosotros') || path.includes('clientes') || path.includes('pqrs')) return;

  // Mapeo ancla → enlace del nav
  const sectionMap = {
    'inicio':    'INICIO',
    'servicios': 'SERVICIOS',
    'vehiculos': 'VEHÍCULOS',
    'clientes':  'CLIENTES',
    'nosotros':  'NOSOTROS',
  };

  function setActive(id) {
    navLinks.forEach(link => link.classList.remove('nav-active'));
    const label = sectionMap[id];
    if (!label) return;
    navLinks.forEach(link => {
      if (link.textContent.trim() === label) link.classList.add('nav-active');
    });
  }

  // Marca INICIO al cargar
  setActive('inicio');

  const sections = Object.keys(sectionMap)
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(sec => io.observe(sec));
})();
