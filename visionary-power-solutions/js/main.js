/* Visionary Power Solutions: site behavior */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Subtle reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Quote form ---------- */
  var form = document.getElementById("quote-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector("button[type=submit]");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    var wrap = field.closest(".field");
    var msg = wrap && wrap.querySelector(".field-error");
    if (!wrap || !msg) return;
    wrap.classList.toggle("has-error", Boolean(message));
    msg.textContent = message || "";
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(field) {
    var value = field.value.trim();
    if (field.required && !value) {
      setError(field, "This field is required.");
      return false;
    }
    if (field.type === "email" && value && !EMAIL_RE.test(value)) {
      setError(field, "Enter a valid email address.");
      return false;
    }
    if (field.type === "tel" && value && value.replace(/\D/g, "").length < 7) {
      setError(field, "Enter a valid phone number.");
      return false;
    }
    setError(field, "");
    return true;
  }

  form.querySelectorAll("input, select, textarea").forEach(function (field) {
    field.addEventListener("blur", function () { validateField(field); });
  });

  function collect() {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = typeof value === "string" ? value.trim() : value;
    });
    return data;
  }

  function showStatus(type, message) {
    status.className = "form-status is-" + type;
    status.textContent = message;
    status.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    /* Honeypot: bots fill hidden fields, people do not. */
    if (form.elements.website && form.elements.website.value) return;

    var firstInvalid = null;
    form.querySelectorAll("input:not([name=website]), select, textarea").forEach(function (field) {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    submitQuote(collect())
      .then(function () {
        form.reset();
        form.hidden = true;
        showStatus("success", "Thanks for reaching out. Our team will get back to you with a quote shortly.");
      })
      .catch(function (err) {
        console.error(err);
        showStatus("error", "Something went wrong sending your request. Please email us at info@visionarypowersolutions.com.");
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request a Quote";
      });
  });

  /**
   * submitQuote: the only place that knows where quote requests go.
   *
   * Target: Wix Forms on the hosted Wix Headless site, through the
   * Form Submissions API with an OAuth visitor token.
   *
   * TODO(owner): once the new Headless site exists and the Request a Quote
   * form is recreated on it, set WIX_CONFIG.clientId and WIX_CONFIG.formId
   * (in js/config.js). Both are public identifiers, not secrets.
   * The field keys in FIELD_MAP must match the form field keys in Wix.
   */
  var FIELD_MAP = {
    firstName: "first_name",
    lastName: "last_name",
    company: "company",
    email: "email",
    phone: "phone",
    voltageClass: "voltage_class",
    timeline: "timeline",
    details: "project_details"
  };

  function submitQuote(data) {
    var cfg = window.WIX_CONFIG || {};
    if (!cfg.clientId || !cfg.formId) {
      return Promise.reject(new Error("Wix Forms is not configured yet (missing clientId or formId)."));
    }

    var submissions = {};
    Object.keys(FIELD_MAP).forEach(function (key) {
      if (data[key]) submissions[FIELD_MAP[key]] = data[key];
    });

    return fetch("https://www.wixapis.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: cfg.clientId, grantType: "anonymous" })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Token request failed: " + res.status);
        return res.json();
      })
      .then(function (token) {
        return fetch("https://www.wixapis.com/forms/v4/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token.access_token
          },
          body: JSON.stringify({ submission: { formId: cfg.formId, submissions: submissions } })
        });
      })
      .then(function (res) {
        if (!res.ok) throw new Error("Submission failed: " + res.status);
        return res.json();
      });
  }
})();
