(() => {
  "use strict";

  const WA_NUMBER = "919753859045";
  const WA_DEFAULT =
    "Hi Udit, I saw your website portfolio and I'd like to discuss a website for my business.";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function waLink(text) {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text || WA_DEFAULT)}`;
  }

  /* ---------- UTM + tracking ---------- */
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  utmKeys.forEach((key) => {
    const val = params.get(key) || "";
    $$("input[name='" + key + "']").forEach((el) => {
      el.value = val;
    });
  });

  function setSelectedDemo(value) {
    $$("input[name='selected_demo']").forEach((el) => {
      el.value = value || "";
    });
  }

  /* ---------- Header / nav ---------- */
  const header = $(".site-header");
  const navToggle = $(".nav-toggle");
  const mobileNav = $("#mobile-nav");

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  function closeMobileNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  function openMobileNav() {
    mobileNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = mobileNav.classList.contains("is-open");
      if (open) closeMobileNav();
      else openMobileNav();
    });
    $$("#mobile-nav a").forEach((a) => a.addEventListener("click", closeMobileNav));
  }

  /* ---------- Smooth scroll for in-page ---------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      closeMobileNav();
      closeModal();
      const offset = header ? header.offsetHeight + 8 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Portfolio filter ---------- */
  const filterBtns = $$(".filter-btn");
  const cards = $$(".folio-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------- Demo modal ---------- */
  const modal = $("#demo-modal");
  const modalImg = $("#modal-img");
  const modalSource = $("#modal-source");
  const modalCat = $("#modal-cat");
  const modalTitle = $("#modal-title");
  const modalClose = $("#modal-close");

  function openModal(card) {
    if (!modal || !card) return;
    const img = card.querySelector("img");
    const source = card.querySelector("source");
    const cat = card.dataset.label || "";
    const title = card.dataset.title || "";
    const demo = card.dataset.demo || "";

    if (modalSource && source) modalSource.srcset = source.srcset;
    if (modalImg && img) {
      modalImg.src = img.currentSrc || img.src;
      modalImg.alt = img.alt || title;
    }
    if (modalCat) modalCat.textContent = cat;
    if (modalTitle) modalTitle.textContent = title;
    modal.dataset.demo = demo;
    const modalQuote = $("#modal-quote");
    if (modalQuote) modalQuote.setAttribute("data-like-this", demo);
    setSelectedDemo(demo);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  $$("[data-open-demo]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const card = el.closest(".folio-card");
      openModal(card);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("modal-backdrop")) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeMobileNav();
    }
  });

  /* ---------- Get a website like this ---------- */
  $$("[data-like-this]").forEach((el) => {
    el.addEventListener("click", () => {
      const card = el.closest(".folio-card") || el.closest(".modal");
      const demo = el.dataset.likeThis || (card && card.dataset.demo) || "";
      setSelectedDemo(demo);
      const type = $("#business-type");
      const map = {
        salon: "Salon / Beauty",
        dental: "Dental / Clinic",
        restaurant: "Restaurant",
        events: "Events / Wedding",
        automotive: "Automotive",
        gym: "Gym / Fitness",
        cafe: "Cafe",
        business: "Local Service",
      };
      if (type && map[demo]) type.value = map[demo];
      const need = $("#need");
      if (need && !need.value) need.value = "NEW WEBSITE";
    });
  });

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach((item) => {
    const btn = $(".faq-q", item);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      $$(".faq-item").forEach((i) => i.classList.remove("is-open"));
      if (!open) item.classList.add("is-open");
    });
  });

  /* ---------- Form ---------- */
  const form = $("#lead-form");
  const formWrap = $("#form-wrap");
  const success = $("#form-success");

  function showError(input, message) {
    const field = input.closest(".field");
    if (!field) return;
    field.classList.add("has-error");
    const err = $(".field-error", field);
    if (err) err.textContent = message;
  }

  function clearError(input) {
    const field = input.closest(".field");
    if (!field) return;
    field.classList.remove("has-error");
  }

  if (form) {
    form.addEventListener("input", (e) => {
      if (e.target && e.target.matches("input, select, textarea")) clearError(e.target);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      const name = form.elements.namedItem("name");
      const business = form.elements.namedItem("business_name");
      const type = form.elements.namedItem("business_type");
      const city = form.elements.namedItem("city");
      const phone = form.elements.namedItem("whatsapp");
      const email = form.elements.namedItem("email");
      const need = form.elements.namedItem("need");

      const required = [
        [name, "Please enter your name."],
        [business, "Please enter your business name."],
        [type, "Please choose a business type."],
        [city, "Please enter your city."],
        [phone, "Please enter a WhatsApp number."],
        [need, "Please tell me what you need."],
      ];

      required.forEach(([input, msg]) => {
        if (!input) return;
        const value = String(input.value || "").trim();
        if (!value) {
          showError(input, msg);
          valid = false;
        }
      });

      if (phone && String(phone.value).trim()) {
        const digits = String(phone.value).replace(/\D/g, "");
        if (digits.length < 10) {
          showError(phone, "Enter a valid WhatsApp number.");
          valid = false;
        }
      }

      if (email && String(email.value).trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          showError(email, "Enter a valid email, or leave it blank.");
          valid = false;
        }
      }

      if (!valid) {
        const first = $(".has-error input, .has-error select, .has-error textarea", form);
        if (first) first.focus();
        return;
      }

      const payload = {
        name: String(name.value || "").trim(),
        business_name: String(business.value || "").trim(),
        business_type: String(type.value || "").trim(),
        city: String(city.value || "").trim(),
        whatsapp: String(phone.value || "").trim(),
        email: email ? String(email.value || "").trim() : "",
        current_website: form.elements.namedItem("current_website")
          ? String(form.elements.namedItem("current_website").value || "").trim()
          : "",
        need: String(need.value || "").trim(),
        message: form.elements.namedItem("message")
          ? String(form.elements.namedItem("message").value || "").trim()
          : "",
        selected_demo: form.elements.namedItem("selected_demo")
          ? String(form.elements.namedItem("selected_demo").value || "")
          : "",
        utm_source: form.elements.namedItem("utm_source")
          ? String(form.elements.namedItem("utm_source").value || "")
          : "",
        utm_medium: form.elements.namedItem("utm_medium")
          ? String(form.elements.namedItem("utm_medium").value || "")
          : "",
        utm_campaign: form.elements.namedItem("utm_campaign")
          ? String(form.elements.namedItem("utm_campaign").value || "")
          : "",
        utm_content: form.elements.namedItem("utm_content")
          ? String(form.elements.namedItem("utm_content").value || "")
          : "",
      };

      const sheetUrl = (window.UDIT_SHEET_URL || "").trim();
      const submitBtn = $("#form-submit");
      const note = $("#form-note");
      if (note) {
        note.hidden = true;
        note.textContent = "";
      }

      function showSuccess() {
        if (formWrap) formWrap.hidden = true;
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      if (!sheetUrl) {
        console.warn("Add your Google Apps Script URL in js/config.js");
        if (note) {
          note.hidden = false;
          note.textContent =
            "The form is ready. Connect your Google Sheet first — open GOOGLE-SHEET-SETUP.md and paste the web app URL in js/config.js.";
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      fetch(sheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      })
        .catch(function () {})
        .then(function () {
          showSuccess();
        });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Year ---------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Back to top ---------- */
  const backTop = $("#back-top");
  function setBackTop() {
    if (!backTop) return;
    backTop.classList.toggle("is-visible", window.scrollY > 480);
  }
  setBackTop();
  window.addEventListener("scroll", setBackTop, { passive: true });
  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
