// ===== INICIALIZAÇÃO ===== //
document.addEventListener("DOMContentLoaded", () => {
  const lucide = window.lucide
  if (lucide) {
    lucide.createIcons()
  }

  initNavigation()
  initScrollAnimations()
  initGallerySlider()
  initPlantasSection()
  initForms()
  preloadCriticalImages()
  initLazyLoading()
  initFadeInImages()

  console.log("Las Villas Serra do Japi - Site carregado com sucesso!")
})

// ===== NAVEGAÇÃO OTIMIZADA ===== //
function initNavigation() {
  const navbar = document.getElementById("navbar")
  const navLogo = document.getElementById("nav-logo")
  const menuToggle = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  if (!navbar || !navLogo || !menuToggle || !mobileMenu) return

  // Scroll otimizado com throttle
  let ticking = false
  function updateNavbar() {
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
    ticking = false
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar)
      ticking = true
    }
  }

  window.addEventListener("scroll", requestTick, { passive: true })

  // Menu toggle otimizado para mobile
  menuToggle.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()

    const isOpen = mobileMenu.classList.contains("active")
    if (isOpen) {
      mobileMenu.classList.remove("active")
      menuToggle.innerHTML = '<i data-lucide="menu"></i>'
    } else {
      mobileMenu.classList.add("active")
      menuToggle.innerHTML = '<i data-lucide="x"></i>'
    }

    if (window.lucide) {
      window.lucide.createIcons()
    }
  })

  // Links de navegação otimizados
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offset = window.innerWidth <= 768 ? 60 : 80
        const elementPosition = targetSection.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: window.innerWidth <= 768 ? "auto" : "smooth",
        })

        // Atualizar links ativos
        navLinks.forEach((l) => l.classList.remove("active"))
        this.classList.add("active")

        // Fechar menu mobile
        mobileMenu.classList.remove("active")
        menuToggle.innerHTML = '<i data-lucide="menu"></i>'
        if (window.lucide) {
          window.lucide.createIcons()
        }
      }
    })
  })

  // Fechar menu ao clicar fora (mobile)
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 768 &&
      !menuToggle.contains(e.target) &&
      !mobileMenu.contains(e.target) &&
      mobileMenu.classList.contains("active")
    ) {
      mobileMenu.classList.remove("active")
      menuToggle.innerHTML = '<i data-lucide="menu"></i>'
      if (window.lucide) {
        window.lucide.createIcons()
      }
    }
  })

  // Scroll spy otimizado
  const optimizedScrollHandler = throttle(() => {
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
  }, 100)

  window.addEventListener("scroll", optimizedScrollHandler, { passive: true })
}

// ===== ANIMAÇÕES DE SCROLL OTIMIZADAS ===== //
function loadLocalizacaoVideo() {
  const container = document.getElementById("localizacao-video");
  container.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/YMngD9okYXI?start=60&end=139&autoplay=1&mute=0&loop=1&playlist=YMngD9okYXI&rel=0&controls=1&modestbranding=1"
      title="Las Villas Serra do Japi"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
      style="width:100%; height:100%; border:0;"
    ></iframe>
  `;
}

function initScrollAnimations() {
  // Só aplicar animações no desktop
  if (window.innerWidth <= 768) {
    document.querySelectorAll(".fade-in-up").forEach((el) => {
      el.classList.add("visible")
    })
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  document.querySelectorAll(".fade-in-up").forEach((el) => {
    observer.observe(el)
  })
}

// ===== GALERIA SLIDER OTIMIZADA ===== //
function initGallerySlider() {
  const slides = document.querySelectorAll(".slide-card")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")

  if (!slides.length || !prevBtn || !nextBtn) return

  let currentSlide = 0
  let isTransitioning = false

  function showSlide(index) {
    if (isTransitioning) return
    isTransitioning = true

    slides.forEach((slide, i) => {
      slide.classList.remove("active", "prev", "next")
      if (i === index) {
        slide.classList.add("active")
      } else if (i === (index + 1) % slides.length) {
        slide.classList.add("next")
      } else if (i === (index - 1 + slides.length) % slides.length) {
        slide.classList.add("prev")
      }
    })

    setTimeout(() => {
      isTransitioning = false
    }, 500)
  }

  function nextSlide() {
    if (isTransitioning) return
    currentSlide = (currentSlide + 1) % slides.length
    showSlide(currentSlide)
  }

  function prevSlide() {
    if (isTransitioning) return
    currentSlide = (currentSlide - 1 + slides.length) % slides.length
    showSlide(currentSlide)
  }

  // Event listeners otimizados
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    nextSlide()
  })

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    prevSlide()
  })

  // Touch events para mobile
  if (window.innerWidth <= 768) {
    let startX = 0
    let endX = 0

    const slideContainer = document.getElementById("slide-container")
    if (slideContainer) {
      slideContainer.addEventListener(
        "touchstart",
        (e) => {
          startX = e.touches[0].clientX
        },
        { passive: true },
      )

      slideContainer.addEventListener(
        "touchend",
        (e) => {
          endX = e.changedTouches[0].clientX
          const diff = startX - endX

          if (Math.abs(diff) > 50) {
            if (diff > 0) {
              nextSlide()
            } else {
              prevSlide()
            }
          }
        },
        { passive: true },
      )
    }
  }

  // Auto-play pausado no mobile
  if (window.innerWidth > 768) {
    let autoPlayInterval = setInterval(nextSlide, 5000)

    const sliderContainer = document.querySelector(".slider-container")
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () => {
        clearInterval(autoPlayInterval)
      })

      sliderContainer.addEventListener("mouseleave", () => {
        autoPlayInterval = setInterval(nextSlide, 5000)
      })
    }
  }

  showSlide(currentSlide)
}

// ===== SEÇÃO PLANTAS OTIMIZADA ===== //
function initPlantasSection() {
  const cards = document.querySelectorAll(".plantas-card")
  const sliderButtons = document.querySelectorAll(".slider-buttons button")

  // Adicionar toggles aos cards
  cards.forEach((card) => {
    const toggleBtn = document.createElement("div")
    toggleBtn.classList.add("card-toggle")
    toggleBtn.textContent = "+"
    card.appendChild(toggleBtn)

    const projectId = card.dataset.project
    const detailSection = document.getElementById(`details-${projectId}`)

    if (!detailSection) return

    card.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      const isActive = detailSection.classList.contains("active")
      const container = card.closest(".plantas-cards")
      const allCards = container.querySelectorAll(".plantas-card")
      const allDetails = container.querySelectorAll(".plantas-details")

      if (!isActive) {
        // Fechar outros detalhes
        allDetails.forEach((detail) => {
          detail.classList.remove("active")
          detail.style.display = "none"
        })
        allCards.forEach((c) => {
          c.classList.add("escurecido")
          const toggle = c.querySelector(".card-toggle")
          if (toggle) toggle.textContent = "+"
          c.style.maxWidth = ""
        })

        // Abrir este detalhe
        detailSection.classList.add("active")
        detailSection.style.display = "block"
        card.classList.remove("escurecido")
        toggleBtn.textContent = "−"
        container.classList.add("expandindo")
        card.style.maxWidth = "640px"

        // Scroll suave para o corte
        setTimeout(() => {
          const corteImg = detailSection.querySelector(".plantas-cut")
          if (corteImg) {
            const offset = window.innerWidth <= 768 ? 60 : 100
            const elementPosition = corteImg.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - offset

            window.scrollTo({
              top: offsetPosition,
              behavior: window.innerWidth <= 768 ? "auto" : "smooth",
            })
          }
        }, 300)
      } else {
        // Fechar este detalhe
        detailSection.classList.remove("active")
        detailSection.style.display = "none"
        toggleBtn.textContent = "+"
        card.classList.add("escurecido")
        card.style.maxWidth = ""
        container.classList.remove("expandindo")
      }
    })
  })

  // Botões do slider de plantas
  sliderButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const projectId = this.dataset.project
      const imageSrc = this.dataset.image

      const projectButtons = document.querySelectorAll(`[data-project="${projectId}"]`)
      projectButtons.forEach((btn) => {
        if (btn.tagName === "BUTTON") {
          btn.classList.remove("ativo")
        }
      })
      this.classList.add("ativo")

      const plantaImg = document.getElementById(`planta-img-${projectId}`)
      if (plantaImg) {
        plantaImg.style.opacity = "0"
        setTimeout(() => {
          plantaImg.src = imageSrc
          plantaImg.style.opacity = "1"
        }, 300)
      }
    })
  })

  // Tour virtual
  const tourContainers = document.querySelectorAll(".tour-container")
  tourContainers.forEach((container) => {
    const tourUrl = container.dataset.tour
    const button = container.querySelector(".tour-button")

    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        container.innerHTML = `
          <iframe
            src="${tourUrl}"
            title="Tour Virtual"
            allowfullscreen
            loading="lazy"
            style="width:100%; height:100%; border:0;">
          </iframe>
        `
      })
    }
  })
}

// ===== FORMULÁRIOS OTIMIZADOS ===== //
function initForms() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault()
      handleFormSubmit(this)
    })

    // Efeitos nos campos (só desktop)
    if (window.innerWidth > 768) {
      const fields = form.querySelectorAll(".form-field")
      fields.forEach((field) => {
        field.addEventListener("focus", function () {
          this.style.transform = "translateY(-2px) scale(1.02)"
        })
        field.addEventListener("blur", function () {
          this.style.transform = "translateY(0) scale(1)"
        })
      })
    }
  })
}

function handleFormSubmit(form) {
  const submitBtn = form.querySelector(".btn-enviar")
  const feedback = form.querySelector(".form-feedback")

  if (!submitBtn || !feedback) return

  submitBtn.classList.add("sending")
  submitBtn.textContent = "ENVIANDO..."
  submitBtn.disabled = true

  // Simular envio
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
        feedback.classList.remove("show", "success")
        feedback.textContent = ""
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
        feedback.classList.remove("show", "error")
        feedback.textContent = ""
      }, 3000)
    }
  }, 2000)
}

// ===== UTILITÁRIOS OTIMIZADOS ===== //
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

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
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove("lazy")
          }
          imageObserver.unobserve(img)
        }
      })
    })

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

function initFadeInImages() {
  const images = document.querySelectorAll("img.fade-image")

  images.forEach((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      img.classList.add("loaded")
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded")
      })
      img.addEventListener("error", () => {
        img.classList.add("loaded") // Evita imagens quebradas
      })
    }
  })
}

// ===== PREVENÇÃO DE BUGS MOBILE ===== //
document.addEventListener("touchstart", () => {}, { passive: true })
document.addEventListener("touchmove", () => {}, { passive: true })

// Prevenir zoom duplo toque no iOS
let lastTouchEnd = 0
document.addEventListener(
  "touchend",
  (event) => {
    const now = new Date().getTime()
    if (now - lastTouchEnd <= 300) {
      event.preventDefault()
    }
    lastTouchEnd = now
  },
  false,
)

// Otimização de resize
window.addEventListener(
  "resize",
  debounce(() => {
    // Fechar menu mobile se mudou para desktop
    if (window.innerWidth > 768) {
      const mobileMenu = document.getElementById("mobile-menu")
      const menuToggle = document.getElementById("menu-toggle")

      if (mobileMenu && menuToggle) {
        mobileMenu.classList.remove("active")
        menuToggle.innerHTML = '<i data-lucide="menu"></i>'
        if (window.lucide) {
          window.lucide.createIcons()
        }
      }
    }
  }, 250),
)

// ===== ZOOM IMPLANTAÇÃO (MOBILE APENAS) =====
function initZoomMobile() {
  const img = document.getElementById("implantacao-img");
  const zoomBtn = document.getElementById("zoom-toggle");
  const closeBtn = document.getElementById("zoom-close");

  if (!img || !zoomBtn || !closeBtn) return;

  function toggleZoom() {
    const isZoomed = img.classList.toggle("zoomed");

    zoomBtn.style.display = isZoomed ? "none" : "block";
    closeBtn.style.display = isZoomed ? "block" : "none";

    // Reseta transform manualmente caso necessário
    if (!isZoomed) {
      img.style.removeProperty("transform");
      img.style.removeProperty("cursor");
    }
  }

  // Aplica apenas no mobile
  if (window.innerWidth <= 768) {
    zoomBtn.addEventListener("click", toggleZoom);
    closeBtn.addEventListener("click", toggleZoom);
  } else {
    // Garante que os botões estejam sempre escondidos no desktop
    zoomBtn.style.display = "none";
    closeBtn.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initZoomMobile();
});


// Movimento com mouse/arraste
function initZoomDrag() {
  const img = document.getElementById("implantacao-img");
  let isDragging = false;
  let startX, startY, initialX, initialY;

  img.addEventListener("mousedown", (e) => {
    if (!img.classList.contains("zoomed")) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = img.offsetLeft;
    initialY = img.offsetTop;
    img.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    img.style.transform = `scale(2) translate(${dx}px, ${dy}px)`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    img.style.cursor = "grab";
  });
}

function initImplantacaoZoom() {
  document.getElementById("zoom-toggle").addEventListener("click", toggleZoom);
  document.getElementById("zoom-close").addEventListener("click", toggleZoom);
  initZoomDrag();
}

document.addEventListener("DOMContentLoaded", () => {
  initImplantacaoZoom();
});

