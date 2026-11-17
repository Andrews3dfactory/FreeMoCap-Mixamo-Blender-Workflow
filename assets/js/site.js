(function () {
  "use strict";

  const pages = [
    { id: "home", title: "Home", href: "index.html", description: "Overview, workflow map, and setup checklist.", number: "⌂", group: "GETTING STARTED" },
    { id: "ffmpeg-setup", title: "FFmpeg setup", href: "docs/ffmpeg-setup.html", description: "Install FFmpeg on Windows and add it to PATH.", number: "01", group: "PREPARE YOUR FOOTAGE" },
    { id: "video-conversion", title: "Video conversion", href: "docs/video-conversion.html", description: "Convert a 3GP file to an MP4 copy when required.", number: "02", group: "PREPARE YOUR FOOTAGE" },
    { id: "calibration", title: "Calibration", href: "docs/calibration.html", description: "Prepare ChArUco calibration footage and ground plane.", number: "03", group: "CAPTURE & PROCESS" },
    { id: "recording-motion", title: "Recording motion", href: "docs/recording-motion.html", description: "Capture clean iPhone motion video.", number: "04", group: "CAPTURE & PROCESS" },
    { id: "freemocap-processing", title: "FreeMoCap processing", href: "docs/freemocap-processing.html", description: "Import footage, run tracking, and review outputs.", number: "05", group: "CAPTURE & PROCESS" },
    { id: "blender-export", title: "Blender export", href: "docs/blender-export.html", description: "Create and inspect supported Blender motion data.", number: "06", group: "BLENDER & RETARGETING" },
    { id: "mixamo-retargeting", title: "Mixamo retargeting", href: "docs/mixamo-retargeting.html", description: "Map motion onto a Mixamo-rigged character.", number: "07", group: "BLENDER & RETARGETING" },
    { id: "changelog", title: "Changelog", href: "docs/changelog.html", description: "See recent improvements to this community guide.", number: "↗", group: "HELP" },
    { id: "troubleshooting", title: "Troubleshooting", href: "docs/troubleshooting.html", description: "Resolve common setup, capture, and export issues.", number: "?", group: "HELP" }
  ];

  const pathname = window.location.pathname.replace(/\\/g, "/");
  const inDocs = /\/docs\/[^/]+\.html$/.test(pathname);
  const prefix = inDocs ? "../" : "";
  const currentId = document.body.dataset.page || (inDocs ? pathname.split("/").pop().replace(/\.html$/, "") : "home");
  const absoluteHref = (href) => prefix + href;

  const themeKey = "freemocap-workflow-theme-v1";
  let theme = "dark";
  try {
    theme = window.localStorage.getItem(themeKey) === "light" ? "light" : "dark";
  } catch (error) {
    // The theme toggle remains available for this visit when storage is disabled.
  }
  document.documentElement.dataset.theme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === "light" ? "#f5f8fc" : "#080d14";
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    const themeToggle = document.createElement("button");
    themeToggle.className = "icon-button theme-toggle";
    themeToggle.type = "button";
    themeToggle.setAttribute("aria-pressed", String(theme === "light"));
    const updateThemeToggle = () => {
      const isLight = theme === "light";
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
      themeToggle.title = isLight ? "Switch to dark theme" : "Switch to light theme";
      themeToggle.innerHTML = isLight
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.3 8.3 0 0 1 8.6 3.8 8.4 8.4 0 1 0 20.2 15.4Z"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>';
    };
    updateThemeToggle();
    themeToggle.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      if (themeColor) themeColor.content = theme === "light" ? "#f5f8fc" : "#080d14";
      themeToggle.setAttribute("aria-pressed", String(theme === "light"));
      updateThemeToggle();
      try {
        window.localStorage.setItem(themeKey, theme);
      } catch (error) {
        // Keep the selected theme for this visit when storage is disabled.
      }
    });
    const githubLink = topbar.querySelector(".topbar-github");
    topbar.insertBefore(themeToggle, githubLink);
  }

  document.querySelectorAll("[data-sidebar-nav]").forEach((nav) => {
    let lastGroup = "";
    pages.forEach((page) => {
      if (page.group !== lastGroup) {
        const group = document.createElement("div");
        group.className = "sidebar-kicker nav-group-label";
        group.textContent = page.group;
        nav.appendChild(group);
        lastGroup = page.group;
      }
      const link = document.createElement("a");
      link.className = "nav-link";
      link.href = absoluteHref(page.href);
      link.dataset.navId = page.id;
      if (page.id === "home") link.dataset.navHome = "";
      if (page.id === currentId) link.setAttribute("aria-current", "page");
      const number = document.createElement("span");
      number.className = "nav-number";
      number.setAttribute("aria-hidden", "true");
      number.textContent = page.number;
      link.append(number, document.createTextNode(page.title));
      nav.appendChild(link);
    });
  });

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const sidebar = document.querySelector("#site-sidebar");
  const mobileNavigation = window.matchMedia("(max-width: 850px)");
  const syncMobileNavigation = () => {
    if (!sidebar) return;
    const closedOnMobile = mobileNavigation.matches && !document.body.classList.contains("nav-open");
    sidebar.inert = closedOnMobile;
    sidebar.setAttribute("aria-hidden", String(closedOnMobile));
  };
  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    syncMobileNavigation();
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
  };
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      syncMobileNavigation();
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      if (isOpen) document.querySelector(".sidebar .nav-link")?.focus();
    });
  }
  syncMobileNavigation();
  mobileNavigation.addEventListener("change", () => {
    if (!mobileNavigation.matches) closeMenu();
    else syncMobileNavigation();
  });
  document.querySelectorAll("[data-menu-close], .sidebar-nav a").forEach((element) => element.addEventListener("click", closeMenu));

  const searchInput = document.querySelector("#site-search");
  const searchResults = document.querySelector("#search-results");
  const narrowScreen = window.matchMedia("(max-width: 380px)");
  const updateSearchPlaceholder = () => {
    if (searchInput) searchInput.placeholder = narrowScreen.matches ? "Search…" : "Search the guide…";
  };
  updateSearchPlaceholder();
  narrowScreen.addEventListener("change", updateSearchPlaceholder);
  let selectedResult = -1;
  const closeSearch = () => {
    if (!searchResults || !searchInput) return;
    searchResults.classList.remove("is-open");
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    searchResults.querySelectorAll(".search-result").forEach((item) => item.setAttribute("aria-selected", "false"));
    selectedResult = -1;
  };
  const showResults = () => {
    if (!searchInput || !searchResults) return;
    const query = searchInput.value.trim().toLocaleLowerCase();
    searchResults.replaceChildren();
    const matches = pages.filter((page) => !query || (page.title + " " + page.description + " " + page.group).toLocaleLowerCase().includes(query));
    if (matches.length === 0) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "No matching guide pages.";
      searchResults.appendChild(empty);
    } else {
      matches.forEach((page, index) => {
        const link = document.createElement("a");
        link.className = "search-result";
        link.href = absoluteHref(page.href);
        link.id = "search-result-" + index;
        link.setAttribute("role", "option");
        link.setAttribute("aria-selected", "false");
        link.innerHTML = "<strong></strong><small></small>";
        link.querySelector("strong").textContent = page.title;
        link.querySelector("small").textContent = page.description;
        searchResults.appendChild(link);
      });
    }
    searchResults.classList.add("is-open");
    searchInput.setAttribute("aria-expanded", "true");
    selectedResult = -1;
  };
  if (searchInput && searchResults) {
    searchInput.addEventListener("input", showResults);
    searchInput.addEventListener("focus", showResults);
    searchInput.addEventListener("keydown", (event) => {
      const results = [...searchResults.querySelectorAll(".search-result")];
      if (event.key === "ArrowDown" && results.length) {
        event.preventDefault();
        selectedResult = (selectedResult + 1) % results.length;
      } else if (event.key === "ArrowUp" && results.length) {
        event.preventDefault();
        selectedResult = (selectedResult - 1 + results.length) % results.length;
      } else if (event.key === "Escape") {
        closeSearch();
        searchInput.blur();
        return;
      } else if (event.key === "Enter" && selectedResult >= 0 && results[selectedResult]) {
        window.location.href = results[selectedResult].href;
        return;
      } else {
        return;
      }
      results.forEach((item, index) => {
        item.setAttribute("aria-selected", String(index === selectedResult));
        if (index === selectedResult) item.scrollIntoView({ block: "nearest" });
      });
      if (results[selectedResult]) searchInput.setAttribute("aria-activedescendant", results[selectedResult].id);
      else searchInput.removeAttribute("aria-activedescendant");
    });
    document.addEventListener("pointerdown", (event) => {
      if (!event.target.closest(".topbar-search")) closeSearch();
    });
  }

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const editing = target instanceof Element && (target.matches("input, textarea, select") || target.isContentEditable);
    if ((event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) && !editing) {
      event.preventDefault();
      searchInput?.focus();
      searchInput?.select();
    }
    if (event.key === "Escape") {
      const menuWasOpen = document.body.classList.contains("nav-open");
      closeMenu();
      closeSearch();
      if (menuWasOpen) menuToggle?.focus();
    }
    if (!editing && !event.altKey && !event.ctrlKey && !event.metaKey && target?.tagName !== "BUTTON") {
      if (event.key === "ArrowLeft") {
        const prev = document.querySelector("[data-pager-prev]");
        if (prev && prev.href) window.location.href = prev.href;
      } else if (event.key === "ArrowRight") {
        const next = document.querySelector("[data-pager-next]");
        if (next && next.href) window.location.href = next.href;
      }
    }
  });

  const checkboxes = [...document.querySelectorAll("[data-check]")];
  if (checkboxes.length) {
    const key = "freemocap-workflow-checklist-v1";
    let saved = {};
    try { saved = JSON.parse(window.localStorage.getItem(key) || "{}"); } catch (error) { saved = {}; }
    const updateChecklist = () => {
      const completed = checkboxes.filter((input) => input.checked).length;
      const count = document.querySelector("[data-check-count]");
      const progress = document.querySelector("[data-check-progress]");
      if (count) count.textContent = completed + " of " + checkboxes.length + " complete";
      if (progress) progress.style.width = (completed / checkboxes.length * 100) + "%";
    };
    checkboxes.forEach((input) => {
      input.checked = saved[input.dataset.check] === true;
      input.addEventListener("change", () => {
        const state = {};
        checkboxes.forEach((item) => { state[item.dataset.check] = item.checked; });
        try { window.localStorage.setItem(key, JSON.stringify(state)); } catch (error) { /* checklist remains usable for this visit */ }
        updateChecklist();
      });
    });
    document.querySelector("[data-reset-checklist]")?.addEventListener("click", () => {
      checkboxes.forEach((input) => { input.checked = false; });
      try { window.localStorage.removeItem(key); } catch (error) { /* reset the current view regardless */ }
      updateChecklist();
      checkboxes[0]?.focus();
    });
    updateChecklist();
  }

  document.querySelectorAll("pre").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code) return;
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = "Copied";
        window.setTimeout(() => { button.textContent = "Copy"; }, 1500);
      } catch (error) {
        button.textContent = "Select code";
        const range = document.createRange();
        range.selectNodeContents(code);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
        window.setTimeout(() => { button.textContent = "Copy"; }, 1800);
      }
    });
    pre.appendChild(button);
  });

  const docContent = document.querySelector("[data-doc-content]");
  if (docContent) {
    const toc = document.querySelector("[data-toc]");
    const headings = [...docContent.querySelectorAll("h2, h3")];
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = heading.textContent.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
      if (toc) {
        const link = document.createElement("a");
        link.href = "#" + heading.id;
        link.textContent = heading.textContent;
        link.dataset.tocLink = heading.id;
        if (heading.tagName === "H3") link.classList.add("toc-nested");
        toc.appendChild(link);
      }
    });
    if (toc && headings.length) {
      const mobileToc = document.createElement("details");
      mobileToc.className = "mobile-toc";
      const summary = document.createElement("summary");
      summary.textContent = "On this page";
      const mobileNav = document.createElement("nav");
      mobileNav.className = "toc-nav";
      mobileNav.setAttribute("aria-label", "Table of contents");
      toc.querySelectorAll("a").forEach((original) => {
        const link = original.cloneNode(true);
        link.addEventListener("click", () => { mobileToc.open = false; });
        mobileNav.appendChild(link);
      });
      mobileToc.append(summary, mobileNav);
      docContent.parentElement.insertBefore(mobileToc, docContent);
    }
    if (toc && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            toc.querySelectorAll("a").forEach((link) => link.classList.toggle("is-active", link.dataset.tocLink === entry.target.id));
          }
        });
      }, { rootMargin: "-15% 0px -72% 0px" });
      headings.forEach((heading) => observer.observe(heading));
    }
    const index = pages.findIndex((page) => page.id === currentId);
    const prev = pages[index - 1] || pages[0];
    const next = pages[index + 1];
    const pager = document.querySelector("[data-doc-pager]");
    if (pager && index >= 0) {
      pager.innerHTML = '<a class="pager-link" data-pager-prev href="' + absoluteHref(prev.href) + '"><span class="pager-kicker">← Previous</span><span class="pager-title"></span></a>' + (next ? '<a class="pager-link" data-pager-next href="' + absoluteHref(next.href) + '"><span class="pager-kicker">Next →</span><span class="pager-title"></span></a>' : '<a class="pager-link" href="' + absoluteHref("index.html") + '"><span class="pager-kicker">Back to overview</span><span class="pager-title">Home</span></a>');
      pager.querySelector("[data-pager-prev] .pager-title").textContent = prev.title;
      if (next) pager.querySelector("[data-pager-next] .pager-title").textContent = next.title;
    }
  }

  const revealItems = [...document.querySelectorAll(
    ".section-block, .feature-card, .quickstart-step, .checklist-card, .trouble-card, .closing-banner, .doc-content h2, .doc-content h3"
  )];
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item, index) => {
      item.classList.add("js-reveal");
      if (item.classList.contains("feature-card") || item.classList.contains("quickstart-step") || item.classList.contains("trouble-card")) {
        item.dataset.revealDelay = String(index % 4);
      }
    });
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const progressBar = document.querySelector("#reading-progress-bar");
  const backToTop = document.querySelector("[data-back-to-top]");
  const updateScrollState = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + "%";
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 420);
  };
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState);
  updateScrollState();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
