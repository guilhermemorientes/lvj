// ===== INICIALIZAÇÃO ===== //
document.addEventListener("DOMContentLoaded", () => {
  const lucide = window.lucide
  lucide.createIcons()

  initNavigation()
  initScrollAnimations()
  initGallerySlider()
  initPlantasSection()
  initForms()
  preloadCriticalImages()
  initLazyLoading()
  initFadeInImages() // ✅ fade-in aplicado

  console.log("Las Villas Serra do Japi - Site carregado com sucesso!")
})

// ===== NAVEGAÇÃO ===== //
function initNavigation() {
  const navbar = document.getElementById("navbar")
  const navLogo = document.getElementById("nav-logo")
  const menuToggle = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Corrigido: evento dinâmico de scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled")
      if (!navLogo.src.includes("las_villas_logo_transparente.webp")) {
        navLogo.src = "img/las_villas_logo_transparente.webp"
      }
    } else {
      navbar.classList.remove("scrolled")
      if (!navLogo.src.includes("las_villas_logo_transparente-branco.webp")) {
        navLogo.src = "img/las_villas_logo_transparente-branco.webp"
      }
    }
  })

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("active")
    if (isOpen) {
      mobileMenu.classList.remove("active")
      menuToggle.innerHTML = '<i data-lucide="menu"></i>'
    } else {
      mobileMenu.classList.add("active")
      menuToggle.innerHTML = '<i data-lucide="x"></i>'
    }
    window.lucide.createIcons()
  })

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        navLinks.forEach((l) => l.classList.remove("active"))
        this.classList.add("active")
        mobileMenu.classList.remove("active")
        menuToggle.innerHTML = '<i data-lucide="menu"></i>'
        window.lucide.createIcons()
      }
    })
  })

  const optimizedScrollHandler = debounce(() => {
    let current = ""
    const sections = document.querySelectorAll("section[id]")

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  }, 10)

  window.addEventListener("scroll", optimizedScrollHandler)
}

// ===== ANIMAÇÕES DE SCROLL ===== //
function initScrollAnimations() {
  function checkFadeInElements() {
    const animatedElements = document.querySelectorAll(".fade-in-up:not(.visible)")
    const windowBottom = window.scrollY + window.innerHeight

    animatedElements.forEach((el) => {
      const elTop = el.getBoundingClientRect().top + window.scrollY
      if (windowBottom > elTop + 100) {
        el.classList.add("visible")
      }
    })
  }

  window.addEventListener("scroll", checkFadeInElements)
  window.addEventListener("resize", checkFadeInElements)
  window.addEventListener("load", checkFadeInElements)
  setTimeout(checkFadeInElements, 300)
}

// ===== GALERIA SLIDER ===== //
function initGallerySlider() {
  const slides = document.querySelectorAll(".slide-card");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentSlide = 0;
  let sliderInterval = setInterval(nextSlide, 5000); // ⏱️ intervalo inicial

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "prev", "next");
      if (i === index) {
        slide.classList.add("active");
      } else if (i === (index + 1) % slides.length) {
        slide.classList.add("next");
      } else if (i === (index - 1 + slides.length) % slides.length) {
        slide.classList.add("prev");
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  function resetInterval() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(nextSlide, 5000);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextBtn.blur();
      nextSlide();
      // window.scrollTo({ top: window.scrollY, left: 0, behavior: "instant" }); // ❌ REMOVIDO: causava bug
      resetInterval();
    });

    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      prevBtn.blur();
      prevSlide();
      window.scrollTo({ top: window.scrollY, left: 0, behavior: "instant" });
      resetInterval();
    });
  }

  showSlide(currentSlide);
}

// ===== SEÇÃO PLANTAS (ACORDEÃO INDEPENDENTE + TOUR VIRTUAL ATIVO POR CLIQUE + EXPANSÃO CENTRALIZADA) ===== //
card.addEventListener("click", function () {
  const isActive = detailSection.classList.contains("active");
  const container = card.closest(".plantas-cards");
  const allCards = container.querySelectorAll(".plantas-card");
  const allDetails = container.querySelectorAll(".plantas-details");

  if (!isActive) {
    // Fecha todos os outros
    allDetails.forEach((detail) => {
      detail.classList.remove("active");
      detail.style.display = "none";
    });
    allCards.forEach((c) => {
      c.classList.add("escurecido");
      const toggle = c.querySelector(".card-toggle");
      if (toggle) toggle.textContent = "+";
      c.style.maxWidth = "";
    });

    // Abre o atual
    detailSection.classList.add("active");
    detailSection.style.display = "block";
    card.classList.remove("escurecido");
    toggleBtn.textContent = "-";
    container.classList.add("expandindo");
    card.style.maxWidth = "640px";

    // 🔽 Scroll suave até a imagem de corte
    const corteImg = detailSection.querySelector(".plantas-cut");
    if (corteImg) {
      setTimeout(() => {
        corteImg.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  } else {
    // Fecha o atual
    detailSection.classList.remove("active");
    detailSection.style.display = "none";
    toggleBtn.textContent = "+";
    card.classList.add("escurecido");
    card.style.maxWidth = "";
    container.classList.remove("expandindo");
  }
});

  // Ativação dos tours ao clicar no botão
  const tourContainers = document.querySelectorAll(".tour-container");

  tourContainers.forEach((container) => {
    const tourUrl = container.dataset.tour;
    const button = container.querySelector(".tour-button");

    if (button) {
      button.addEventListener("click", () => {
        container.innerHTML = `
          <iframe
            src="${tourUrl}"
            title="Tour Virtual"
            allowfullscreen
            loading="lazy"
            style="width:100%; height:100%; border:0;">
          </iframe>
        `;
      });
    }
  });

// ===== FORMULÁRIOS ===== //
function initForms() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault()
      handleFormSubmit(this)
    })

    const fields = form.querySelectorAll(".form-field")
    fields.forEach((field) => {
      field.addEventListener("focus", function () {
        this.style.transform = "translateY(-2px) scale(1.02)"
      })
      field.addEventListener("blur", function () {
        this.style.transform = "translateY(0) scale(1)"
      })
    })
  })
}

function handleFormSubmit(form) {
  const submitBtn = form.querySelector(".btn-enviar")
  const feedback = form.querySelector(".form-feedback")

  submitBtn.classList.add("sending")
  submitBtn.textContent = "ENVIANDO..."
  submitBtn.disabled = true

  setTimeout(() => {
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      submitBtn.classList.remove("sending")
      submitBtn.classList.add("success")
      submitBtn.textContent = "ENVIADO COM SUCESSO!"
      feedback.textContent = "Mensagem enviada com sucesso! Entraremos em contato em breve."
      feedback.classList.add("success", "show")
      form.reset()

      setTimeout(() => {
        submitBtn.classList.remove("success")
        submitBtn.textContent = "ENVIAR MENSAGEM"
        submitBtn.disabled = false
        feedback.classList.remove("show")
      }, 3000)
    } else {
      submitBtn.classList.remove("sending")
      submitBtn.classList.add("error")
      submitBtn.textContent = "ERRO NO ENVIO"
      feedback.textContent = "Erro ao enviar mensagem. Tente novamente."
      feedback.classList.add("error", "show")

      setTimeout(() => {
        submitBtn.classList.remove("error")
        submitBtn.textContent = "ENVIAR MENSAGEM"
        submitBtn.disabled = false
        feedback.classList.remove("show")
      }, 3000)
    }
  }, 2000)
}

// ===== UTILITÁRIOS ===== //
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function preloadCriticalImages() {
  const criticalImages = [
    "img/las_villas_logo_transparente.webp",
    "img/las_villas_logo_transparente-branco.webp",
    "img/alameda.webp",
    "img/fachada-178.webp",
    "img/fachada-145.webp",
  ]
  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// ===== FADE-IN DE IMAGENS ===== //
function initFadeInImages() {
  const images = document.querySelectorAll("img.fade-image")

  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded")
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded")
      })
    }
  })
}

// ===== BLOQUEIA FOCO VISUAL INDESEJADO EM CLICKS ===== //
document.addEventListener("mousedown", function (e) {
  if (e.target && typeof e.target.blur === "function") {
    e.target.blur()
  }
}, true)

