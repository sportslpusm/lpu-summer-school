/* =====================================================================
   Custom select enhancer — replaces the unstyleable native <option> popup
   with a styled, accessible listbox while keeping the real <select> in the
   DOM (value, required, change events all keep working). Dependency-free.
   Auto-enhances existing + dynamically-added selects via MutationObserver.
   Opt out with `data-no-enhance` on a <select>.
   ===================================================================== */
(function () {
  "use strict";
  var openCs = null;

  function chevron() {
    return '<svg class="cs-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  }

  function selectedText(select) {
    var opt = select.options[select.selectedIndex];
    return opt ? opt.textContent : "";
  }

  function buildMenu(cs, select) {
    var menu = cs.querySelector(".cs-menu");
    var html = "";
    for (var i = 0; i < select.options.length; i++) {
      var o = select.options[i];
      var sel = i === select.selectedIndex;
      html += '<div class="cs-option" role="option" data-index="' + i + '" aria-selected="' + (sel ? "true" : "false") + '"' +
        (o.disabled ? ' aria-disabled="true"' : "") + '>' + escapeHtml(o.textContent) + "</div>";
    }
    menu.innerHTML = html;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function syncTrigger(cs, select) {
    var valueEl = cs.querySelector(".cs-value");
    var opt = select.options[select.selectedIndex];
    var isPlaceholder = opt && (opt.value === "" || opt.disabled);
    valueEl.textContent = selectedText(select) || (select.options[0] ? select.options[0].textContent : "");
    cs.classList.toggle("cs-placeholder", !!isPlaceholder);
    cs.classList.toggle("cs-disabled", !!select.disabled);
    cs.querySelector(".cs-trigger").disabled = !!select.disabled;
  }

  function closeMenu(cs) {
    if (!cs) return;
    cs.classList.remove("cs-open", "cs-up");
    cs.querySelector(".cs-trigger").setAttribute("aria-expanded", "false");
    cs.querySelector(".cs-menu").hidden = true;
    if (openCs === cs) openCs = null;
  }

  function openMenu(cs, select) {
    if (select.disabled) return;
    if (openCs && openCs !== cs) closeMenu(openCs);
    buildMenu(cs, select);
    cs.classList.add("cs-open");
    cs.querySelector(".cs-trigger").setAttribute("aria-expanded", "true");
    var menu = cs.querySelector(".cs-menu");
    menu.hidden = false;
    // flip up if not enough room below
    var rect = cs.getBoundingClientRect();
    var below = window.innerHeight - rect.bottom;
    cs.classList.toggle("cs-up", below < 240 && rect.top > below);
    openCs = cs;
    // highlight + scroll to selected
    var active = menu.querySelector('[aria-selected="true"]') || menu.querySelector(".cs-option:not([aria-disabled])");
    setActive(menu, active);
    if (active) active.scrollIntoView({ block: "nearest" });
  }

  function setActive(menu, el) {
    menu.querySelectorAll(".cs-option.cs-active").forEach(function (o) { o.classList.remove("cs-active"); });
    if (el) el.classList.add("cs-active");
  }

  function choose(cs, select, index) {
    if (index < 0 || index >= select.options.length) return;
    if (select.options[index].disabled) return;
    if (select.selectedIndex !== index) {
      select.selectedIndex = index;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    syncTrigger(cs, select);
    closeMenu(cs);
    cs.querySelector(".cs-trigger").focus();
  }

  function moveActive(menu, dir) {
    var opts = Array.prototype.filter.call(menu.querySelectorAll(".cs-option"), function (o) { return !o.hasAttribute("aria-disabled"); });
    if (!opts.length) return;
    var cur = menu.querySelector(".cs-option.cs-active");
    var i = opts.indexOf(cur);
    i = (i + dir + opts.length) % opts.length;
    setActive(menu, opts[i]);
    opts[i].scrollIntoView({ block: "nearest" });
  }

  function enhanceSelect(select) {
    if (!select || select.__cs || select.hasAttribute("data-no-enhance") || select.multiple) return;
    select.__csFlag = true;
    var cs = document.createElement("div");
    cs.className = "cs";
    cs.innerHTML =
      '<button type="button" class="cs-trigger" aria-haspopup="listbox" aria-expanded="false">' +
      '<span class="cs-value"></span>' + chevron() + "</button>" +
      '<div class="cs-menu" role="listbox" tabindex="-1" hidden></div>';
    select.parentNode.insertBefore(cs, select.nextSibling);
    select.classList.add("cs-native");
    select.setAttribute("tabindex", "-1");
    select.setAttribute("aria-hidden", "true");
    select.__cs = cs;
    cs.__select = select;

    var trigger = cs.querySelector(".cs-trigger");
    var menu = cs.querySelector(".cs-menu");
    var typeBuf = "", typeTimer = null;

    syncTrigger(cs, select);

    trigger.addEventListener("click", function () {
      if (cs.classList.contains("cs-open")) closeMenu(cs); else openMenu(cs, select);
    });
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault(); openMenu(cs, select);
      }
    });
    menu.addEventListener("click", function (e) {
      var opt = e.target.closest(".cs-option");
      if (opt && !opt.hasAttribute("aria-disabled")) choose(cs, select, Number(opt.dataset.index));
    });
    menu.addEventListener("mousemove", function (e) {
      var opt = e.target.closest(".cs-option");
      if (opt && !opt.hasAttribute("aria-disabled")) setActive(menu, opt);
    });
    cs.addEventListener("keydown", function (e) {
      if (!cs.classList.contains("cs-open")) return;
      if (e.key === "ArrowDown") { e.preventDefault(); moveActive(menu, 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); moveActive(menu, -1); }
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        var a = menu.querySelector(".cs-option.cs-active");
        if (a) choose(cs, select, Number(a.dataset.index));
      } else if (e.key === "Escape") { e.preventDefault(); closeMenu(cs); trigger.focus(); }
      else if (e.key === "Tab") { closeMenu(cs); }
      else if (e.key.length === 1) {
        typeBuf += e.key.toLowerCase();
        clearTimeout(typeTimer); typeTimer = setTimeout(function () { typeBuf = ""; }, 600);
        var match = Array.prototype.find.call(menu.querySelectorAll(".cs-option"), function (o) {
          return !o.hasAttribute("aria-disabled") && o.textContent.toLowerCase().indexOf(typeBuf) === 0;
        });
        if (match) { setActive(menu, match); match.scrollIntoView({ block: "nearest" }); }
      }
    });
  }

  function enhanceWithin(root) {
    if (!root) return;
    if (root.tagName === "SELECT") { enhanceSelect(root); return; }
    if (root.querySelectorAll) root.querySelectorAll("select").forEach(enhanceSelect);
  }

  document.addEventListener("click", function (e) {
    if (openCs && !openCs.contains(e.target)) closeMenu(openCs);
  });
  window.addEventListener("resize", function () { closeMenu(openCs); });

  function boot() {
    enhanceWithin(document.body);
    var obs = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "attributes" && m.target.tagName === "SELECT" && m.target.__cs) {
          syncTrigger(m.target.__cs, m.target);
          continue;
        }
        if (m.target && m.target.tagName === "SELECT" && m.target.__cs) {
          buildMenu(m.target.__cs, m.target);
          syncTrigger(m.target.__cs, m.target);
        }
        if (m.addedNodes) m.addedNodes.forEach(function (n) { if (n.nodeType === 1) enhanceWithin(n); });
      }
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
