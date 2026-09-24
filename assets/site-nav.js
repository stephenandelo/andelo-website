/**
 * Shared site navigation — injected on every public page.
 * Markup aligned to the Andelo nav handoff (Home / Why / Work / Resources / Pricing / Blog).
 * Requires Tailwind (CDN or build) and the Andelo theme tokens already on the page.
 */
(function () {
  var LOGO =
    '<svg viewBox="0 0 141 18" class="h-[20px] w-auto block" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M40.86 18L32.2988 6.86331V18H28.5371V1.03597H32.4286L40.7303 11.6547V1.03597H44.492V18H40.86Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M66.4139 8.93525C66.4139 5.95683 64.5979 3.4964 60.9659 3.4964H57.8527V14.3741H60.9659C64.4682 14.3741 66.4139 11.9137 66.4139 8.93525ZM54.2207 17.6115V0.258991H60.9659C66.4139 0.258991 70.1756 3.75539 70.1756 8.93525C70.1756 14.2446 66.4139 17.6115 60.9659 17.6115H54.2207Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M78.9961 17.6115H93.135V14.2446H78.9961V17.6115ZM78.9961 3.4964H93.135V0.129498H78.9961V3.4964ZM78.9961 10.3597H92.8756V7.1223H78.9961V10.3597Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M104.81 17.6115V0.258991H108.571V14.3741H115.835V17.6115H104.81Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M137.238 8.93525C137.238 5.69784 135.163 3.23741 132.05 3.23741C128.807 3.23741 126.731 5.69784 126.731 8.93525C126.731 12.1727 128.807 14.6331 132.05 14.6331C135.163 14.6331 137.238 12.1727 137.238 8.93525ZM122.84 8.93525C122.84 3.7554 126.602 0 131.92 0C137.108 0 141 3.7554 141 8.93525C141 14.1151 137.238 17.8705 131.92 17.8705C126.731 17.8705 122.84 14.1151 122.84 8.93525Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M10.1178 7.89928L13.3606 13.5971H6.74517L10.1178 7.89928ZM10.3772 0.258991L0 17.6115H20.1058L10.3772 0.258991Z" fill="#F4F6FF"/>' +
    '</svg>';

  /* Desktop primary strip */
  var PRIMARY = [
    { href: '/', label: 'Home', match: ['/'] },
    { href: '/why/', label: 'Why Andelo', match: ['/why'] },
    { href: '/work/', label: 'Our Work', match: ['/work', '/case-studies'] },
    { href: '/resources/', label: 'Resources', match: ['/resources', '/capacity-calculator', '/design-brief-builder', '/design-capacity-formula'] },
    /* Pricing section lives on the homepage until /pricing exists */
    { href: '/#pricing', label: 'Pricing', match: ['/pricing'] },
    { href: '/blog/', label: 'Blog', match: ['/blog'] }
  ];

  /* Extra links shown only in the mobile drawer */
  var MOBILE_EXTRA = [
    { href: '/careers/', label: 'Careers', match: ['/careers'], tone: 'strong' },
    { href: '/privacy-policy/', label: 'Privacy Policy', match: ['/privacy-policy'], tone: 'caption' },
    { href: '/terms-of-use/', label: 'Terms of Use', match: ['/terms-of-use'], tone: 'caption' }
  ];

  function normPath(p) {
    if (!p) return '/';
    p = p.split('?')[0].split('#')[0];
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    if (p.endsWith('/index.html')) p = p.slice(0, -11) || '/';
    if (p === '/index.html') p = '/';
    return p || '/';
  }

  var path = normPath(location.pathname);

  function isActive(match) {
    if (!match || !match.length) return false;
    for (var i = 0; i < match.length; i++) {
      var m = normPath(match[i]);
      if (m === '/') {
        if (path === '/') return true;
        continue;
      }
      if (path === m || path.indexOf(m + '/') === 0) return true;
    }
    return false;
  }

  function linkClass(active, opts) {
    opts = opts || {};
    var size = opts.mobile
      ? (opts.tone === 'caption'
        ? 'block px-3 py-2 text-body-caption text-[15px] transition-colors duration-fast '
        : 'block px-3 py-2 text-[17px] font-medium transition-colors duration-fast ')
      : 'text-[17px] font-medium transition-colors duration-fast ';
    if (active) {
      return size + (opts.tone === 'caption' ? 'text-brand' : 'text-brand font-bold');
    }
    return size + (opts.tone === 'caption'
      ? 'text-body-caption hover:text-white'
      : 'text-body-strong hover:text-white');
  }

  function primaryLinks(mobile) {
    return PRIMARY.map(function (item) {
      var active = isActive(item.match);
      return '<a href="' + item.href + '" data-nav-link class="' + linkClass(active, { mobile: mobile }) + '"' +
        (active ? ' aria-current="page"' : '') + '>' + item.label + '</a>';
    }).join('');
  }

  function mobileExtraLinks() {
    return MOBILE_EXTRA.map(function (item) {
      var active = isActive(item.match);
      return '<a href="' + item.href + '" data-nav-link class="' +
        linkClass(active, { mobile: true, tone: item.tone }) + '"' +
        (active ? ' aria-current="page"' : '') + '>' + item.label + '</a>';
    }).join('');
  }

  /* Match frost to current scroll so remount / scroll-restore never flash transparent */
  var __initY = window.scrollY || document.documentElement.scrollTop || 0;
  var __initFrost = __initY > 24;

  var html =
    '<nav data-nav data-site-nav data-nav-frost="' + (__initFrost ? 'true' : 'false') + '" data-nav-hidden="false" class="print:hidden fixed top-0 left-0 right-0 z-[100] ' +
    'border-b border-transparent">' +
    '<div class="max-w-container mx-auto px-gutter py-[15px] flex items-center justify-between gap-4">' +
      '<a href="/" class="flex items-center flex-none" aria-label="Andelo home">' + LOGO + '</a>' +
      '<div class="hidden md:flex gap-gutter items-center">' + primaryLinks(false) + '</div>' +
      '<div class="flex items-center gap-4">' +
        '<a href="/book-a-call/" class="hidden md:inline-flex btn-mint px-[20px] py-[11px] text-[16px] shadow-[0_8px_22px_rgba(61,230,140,.28)]' +
          (isActive(['/book-a-call']) ? ' ring-2 ring-brand/40' : '') + '">Book a call</a>' +
        '<button type="button" data-menu-btn class="md:hidden w-[44px] h-[44px] rounded-full border border-white/[.14] flex flex-col items-center justify-center gap-[5px] transition-colors duration-fast" aria-label="Open menu" aria-expanded="false" aria-controls="site-mobile-nav">' +
          '<span data-bar class="w-[18px] h-[2px] bg-body rounded-full origin-center"></span>' +
          '<span data-bar class="w-[18px] h-[2px] bg-body rounded-full origin-center"></span>' +
          '<span data-bar class="w-[18px] h-[2px] bg-body rounded-full origin-center"></span>' +
        '</button>' +
      '</div>' +
    '</div>' +
    '<div id="site-mobile-nav" data-mobile-menu data-open="false" class="md:hidden fixed top-[68px] left-0 right-0 bg-canvas border-b border-hairline">' +
      '<div class="mobile-menu-inner">' +
        '<div class="px-gutter py-4 flex flex-col gap-3">' +
        primaryLinks(true) +
        '<div class="border-t border-hairline pt-3 mt-2">' + mobileExtraLinks() + '</div>' +
        '<a href="/book-a-call/" class="mt-2 btn-mint w-full px-[20px] py-[11px] text-[16px] shadow-[0_8px_22px_rgba(61,230,140,.28)]">Book a call</a>' +
      '</div></div>' +
    '</div>' +
    '</nav>';

  /* Ensure motion tokens + mobile menu grid work on CDN pages too */
  if (!document.getElementById('andelo-nav-motion')) {
    var s = document.createElement('style');
    s.id = 'andelo-nav-motion';
    s.textContent =
      'html{color-scheme:dark;background-color:#0A0C22}html,body{background-color:#0A0C22;color-scheme:dark}' +
      ':root{--ease-out:cubic-bezier(0.22,1,0.36,1);--ease-in-out:cubic-bezier(0.65,0,0.35,1);--dur-fast:150ms;--dur-base:250ms;--dur-slow:500ms}' +
      /* Omit background from transition — transparent↔rgba interpolates as a white flash */
      '[data-nav]{background:transparent;border-bottom-color:transparent;transition:border-color var(--dur-base) var(--ease-out),backdrop-filter var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-out)}' +
      '[data-nav][data-nav-frost="true"]{background:rgba(9,11,30,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom-color:rgba(255,255,255,.08)}' +
      '[data-nav][data-nav-hidden="true"]{transform:translateY(-100%)}' +
      '[data-nav]:focus-within,[data-nav][data-nav-hidden="true"]:focus-within{transform:translateY(0)}' +
      '[data-mobile-menu]{display:grid;grid-template-rows:0fr;overflow:hidden;transition:grid-template-rows var(--dur-base) var(--ease-out)}' +
      '[data-mobile-menu]>.mobile-menu-inner{overflow:hidden;min-height:0}' +
      '[data-mobile-menu][data-open="true"]{grid-template-rows:1fr}' +
      '@media (min-width:901px){[data-mobile-menu]{display:none!important}}' +
      '[data-bar]{transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-out)}' +
      '@media (hover:hover){[data-menu-btn]:hover{border-color:rgba(255,255,255,.28)}}' +
      '@media (prefers-reduced-motion:reduce){[data-nav],[data-mobile-menu],[data-bar]{transition-duration:.01ms!important}}';
    document.head.appendChild(s);
  }

  function mount() {
    /* Avoid remount flicker if nav already live (HMR / duplicate script) */
    if (document.querySelector('[data-site-nav][data-nav-bound]')) return;
    var mountEl = document.querySelector('[data-site-nav-mount]');
    if (mountEl) {
      mountEl.outerHTML = html;
      bind();
      return;
    }
    var candidates = document.querySelectorAll('nav');
    var existing = null;
    for (var i = 0; i < candidates.length; i++) {
      var n = candidates[i];
      if (n.hasAttribute('data-toc') || n.hasAttribute('data-side') || n.getAttribute('aria-label') === 'Jump to step') continue;
      if (n.hasAttribute('data-nav') || (n.className && String(n.className).indexOf('fixed') !== -1) || n.classList.contains('fixed')) {
        existing = n;
        break;
      }
    }
    if (existing) {
      existing.outerHTML = html;
    } else {
      var wrap = document.createElement('div');
      wrap.innerHTML = html;
      document.body.insertBefore(wrap.firstChild, document.body.firstChild);
    }
    bind();
  }

  function bind() {
    var nav = document.querySelector('[data-site-nav]');
    if (!nav) return;
    nav.setAttribute('data-nav-bound', '1');
    /* Drop legacy inline frost styles so data-nav-frost CSS wins */
    nav.style.background = '';
    nav.style.backdropFilter = '';
    nav.style.webkitBackdropFilter = '';
    nav.style.borderBottomColor = '';
    nav.style.transform = '';

    var menuBtn = nav.querySelector('[data-menu-btn]');
    var menu = nav.querySelector('[data-mobile-menu]');
    var bars = menuBtn ? menuBtn.querySelectorAll('[data-bar]') : [];

    function setMobile(open) {
      if (!menuBtn || !menu) return;
      menu.setAttribute('data-open', open ? 'true' : 'false');
      menuBtn.classList.toggle('active', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.documentElement.classList.toggle('overflow-hidden', open);
      if (bars.length >= 3) {
        bars[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
        bars[1].style.opacity = open ? '0' : '1';
        bars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
      }
    }

    if (menuBtn && menu) {
      menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        setMobile(menu.getAttribute('data-open') !== 'true');
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setMobile(false); });
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMobile(false);
    });

    /* Frost past 24px; hide on scroll down, return on scroll up.
       Keep visible while keyboard focus is inside the nav.
       Hidden state is sticky — small per-frame deltas must not flash it back. */
    var lastY = window.scrollY || 0;
    var hidden = false;
    var ticking = false;
    function updateNav() {
      ticking = false;
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var delta = y - lastY;
      var frosted = y > 24;
      var menuOpen = menu && menu.getAttribute('data-open') === 'true';
      var focusInside = nav.contains(document.activeElement);
      nav.setAttribute('data-nav-frost', frosted ? 'true' : 'false');

      if (y <= 120 || menuOpen || focusInside) {
        hidden = false;
      } else if (delta > 6) {
        hidden = true;
      } else if (delta < -6) {
        hidden = false;
      }
      nav.setAttribute('data-nav-hidden', hidden ? 'true' : 'false');
      lastY = y;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateNav); }
    }, { passive: true });
    nav.addEventListener('focusin', updateNav);
    nav.addEventListener('focusout', function () {
      requestAnimationFrame(updateNav);
    });
    updateNav();
  }

  if (document.querySelector('[data-site-nav-mount]')) {
    mount();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
