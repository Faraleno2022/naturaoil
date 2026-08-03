const body = document.body;
const header = document.getElementById('site-header');
const mobileMenu = document.getElementById('mobile-menu');
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const searchPanel = document.getElementById('search-panel');
const searchOpen = document.getElementById('search-open');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('site-search');
const searchFeedback = document.getElementById('search-feedback');

document.getElementById('year').textContent = new Date().getFullYear();

const setPageLocked = () => {
  const locked = mobileMenu.classList.contains('is-open') || searchPanel.classList.contains('is-open');
  body.classList.toggle('no-scroll', locked);
};

const openMenu = () => {
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Fermer le menu');
  setPageLocked();
  menuClose.focus();
};

const closeMenu = () => {
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
  setPageLocked();
};

menuToggle.addEventListener('click', () => mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu());
menuClose.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const openSearch = () => {
  searchPanel.classList.add('is-open');
  searchPanel.setAttribute('aria-hidden', 'false');
  searchOpen.setAttribute('aria-expanded', 'true');
  setPageLocked();
  window.setTimeout(() => searchInput.focus(), 120);
};

const closeSearch = () => {
  searchPanel.classList.remove('is-open');
  searchPanel.setAttribute('aria-hidden', 'true');
  searchOpen.setAttribute('aria-expanded', 'false');
  setPageLocked();
  searchOpen.focus();
};

searchOpen.addEventListener('click', openSearch);
searchClose.addEventListener('click', closeSearch);

const searchRoutes = [
  { terms: ['entreprise', 'natura', 'qui sommes', 'société'], id: 'entreprise', label: "l'entreprise" },
  { terms: ['activité', 'activités', 'vente', 'pétrole', 'approvisionnement', 'distribution', 'livraison'], id: 'activites', label: 'nos activités' },
  { terms: ['sécurité', 'qualité', 'engagement', 'fiabilité'], id: 'engagements', label: 'nos engagements' },
  { terms: ['kipé', 'kipe', 'conakry', 'siège', 'adresse', 'guinée'], id: 'implantation', label: 'notre présence' },
  { terms: ['contact', 'devis', 'téléphone', 'email', 'partenaire'], id: 'contact', label: 'le formulaire de contact' }
];

const runSearch = () => {
  const query = searchInput.value.trim().toLocaleLowerCase('fr');
  if (!query) {
    searchFeedback.textContent = 'Saisissez un mot-clé pour rechercher dans la page.';
    return;
  }
  const result = searchRoutes.find((route) => route.terms.some((term) => query.includes(term) || term.includes(query)));
  if (!result) {
    searchFeedback.textContent = 'Aucun résultat direct. Essayez « livraison », « sécurité », « Kipé » ou « contact ».';
    return;
  }
  searchFeedback.textContent = `Résultat trouvé : ${result.label}.`;
  window.setTimeout(() => {
    closeSearch();
    document.getElementById(result.id).scrollIntoView({ behavior: 'smooth' });
  }, 500);
};

document.getElementById('search-submit').addEventListener('click', runSearch);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') runSearch();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (searchPanel.classList.contains('is-open')) closeSearch();
  if (mobileMenu.classList.contains('is-open')) closeMenu();
});

window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 40), { passive: true });

const slides = [...document.querySelectorAll('.hero-slide')];
const progressFill = document.getElementById('progress-fill');
const currentLabel = document.getElementById('hero-current');
let currentSlide = 0;
let carouselTimer;

const restartProgress = () => {
  progressFill.classList.remove('is-running');
  void progressFill.offsetWidth;
  progressFill.classList.add('is-running');
};

const showSlide = (index) => {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === currentSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  currentLabel.textContent = String(currentSlide + 1).padStart(2, '0');
  restartProgress();
};

const startCarousel = () => {
  window.clearInterval(carouselTimer);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    carouselTimer = window.setInterval(() => showSlide(currentSlide + 1), 7000);
  }
};

document.getElementById('hero-next').addEventListener('click', () => { showSlide(currentSlide + 1); startCarousel(); });
document.getElementById('hero-prev').addEventListener('click', () => { showSlide(currentSlide - 1); startCarousel(); });
showSlide(0);
startCarousel();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelector('[data-scroll-contact]').addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const requiredFields = [...contactForm.querySelectorAll('[required]')];
  requiredFields.forEach((field) => field.setAttribute('aria-invalid', String(!field.checkValidity())));
  const invalidField = requiredFields.find((field) => !field.checkValidity());

  if (invalidField) {
    formStatus.textContent = 'Merci de compléter correctement tous les champs obligatoires.';
    invalidField.focus();
    return;
  }

  formStatus.textContent = 'Merci ! Votre demande est prête. Connectez ce formulaire à votre service e-mail pour recevoir les messages.';
  contactForm.reset();
  requiredFields.forEach((field) => field.removeAttribute('aria-invalid'));
});

contactForm.addEventListener('input', (event) => {
  if (event.target.matches('[required]')) event.target.removeAttribute('aria-invalid');
});

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});
