(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var megaParents = document.querySelectorAll(".has-mega");

  var ANCHORS = ["intro", "ai", "explore", "mag", "support"];
  var LIGHT_HERO_ANCHORS = { ai: true, explore: true, mag: true };

  function syncHeaderLightHero(anchor) {
    if (!header) return;
    header.classList.toggle("is-atop-light", !!LIGHT_HERO_ANCHORS[anchor]);
  }

  function setHeaderScrolled() {
    if (!header) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("is-scrolled", y > 24);
  }

  function syncHeaderForFullpageSectionIndex(index) {
    if (!header) return;
    header.classList.toggle("is-scrolled", index > 0);
  }

  function syncGnbActiveFromAnchor(anchor) {
    if (!anchor) return;
    var href = "#" + anchor;
    document.querySelectorAll('.gnb-link[href^="#"]').forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === href);
    });
  }

  var fullpageRoot = document.getElementById("fullpage");
  var fpApi = null;

  if (fullpageRoot && typeof fullpage !== "undefined") {
    fpApi = new fullpage("#fullpage", {
      licenseKey: "gplv3-license",
      anchors: ANCHORS,
      navigation: true,
      navigationPosition: "right",
      navigationTooltips: ["소개", "AI 추천", "탐색", "매거진", "고객지원"],
      showActiveTooltip: true,
      scrollingSpeed: 700,
      afterLoad: function (_origin, destination) {
        var idx = destination && typeof destination.index === "number" ? destination.index : 0;
        var anchor =
          (destination && destination.anchor) ||
          ANCHORS[idx] ||
          "";
        syncHeaderForFullpageSectionIndex(idx);
        syncHeaderLightHero(anchor);
        syncGnbActiveFromAnchor(anchor);
      },
      afterRender: function () {
        requestAnimationFrame(function () {
          if (!fpApi || typeof fpApi.getActiveSection !== "function") return;
          var active = fpApi.getActiveSection();
          var idx = active && typeof active.index === "number" ? active.index : 0;
          var anchor =
            (active && active.anchor) ||
            ANCHORS[idx] ||
            "";
          syncHeaderForFullpageSectionIndex(idx);
          syncHeaderLightHero(anchor);
          syncGnbActiveFromAnchor(anchor);
        });
      },
    });
  } else {
    setHeaderScrolled();
    window.addEventListener("scroll", setHeaderScrolled, { passive: true });
  }

  function closeMobileMenu() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
  }

  function openMobileMenu() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "메뉴 닫기");
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var open = menuToggle.getAttribute("aria-expanded") === "true";
      if (open) closeMobileMenu();
      else openMobileMenu();
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileMenu();
    });
  }

  function updateMegaOpenState() {
    if (!header) return;
    var mq = window.matchMedia("(min-width: 1024px)");
    if (!mq.matches) {
      header.classList.remove("is-mega-open");
      return;
    }
    var anyOpen = Array.prototype.some.call(megaParents, function (el) {
      return el.matches(":hover") || el.contains(document.activeElement);
    });
    header.classList.toggle("is-mega-open", anyOpen);
  }

  megaParents.forEach(function (parent) {
    parent.addEventListener("mouseenter", updateMegaOpenState);
    parent.addEventListener("mouseleave", function () {
      requestAnimationFrame(updateMegaOpenState);
    });
    parent.addEventListener("focusin", updateMegaOpenState);
    parent.addEventListener("focusout", function () {
      requestAnimationFrame(updateMegaOpenState);
    });
  });

  window.addEventListener("resize", updateMegaOpenState);

  var familySelect = document.getElementById("familySite");
  if (familySelect) {
    familySelect.addEventListener("change", function () {
      var v = familySelect.value;
      if (v) window.location.href = v;
    });
  }
})();
