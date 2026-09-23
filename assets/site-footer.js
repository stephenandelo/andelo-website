/**
 * Shared site footer — injected on every public page.
 * Requires Tailwind (CDN or build) and the Andelo theme tokens already on the page.
 */
(function () {
  var LOGO =
    '<svg viewBox="0 0 141 18" class="h-[19px] w-auto block" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M40.86 18L32.2988 6.86331V18H28.5371V1.03597H32.4286L40.7303 11.6547V1.03597H44.492V18H40.86Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M66.4139 8.93525C66.4139 5.95683 64.5979 3.4964 60.9659 3.4964H57.8527V14.3741H60.9659C64.4682 14.3741 66.4139 11.9137 66.4139 8.93525ZM54.2207 17.6115V0.258991H60.9659C66.4139 0.258991 70.1756 3.75539 70.1756 8.93525C70.1756 14.2446 66.4139 17.6115 60.9659 17.6115H54.2207Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M78.9961 17.6115H93.135V14.2446H78.9961V17.6115ZM78.9961 3.4964H93.135V0.129498H78.9961V3.4964ZM78.9961 10.3597H92.8756V7.1223H78.9961V10.3597Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M104.81 17.6115V0.258991H108.571V14.3741H115.835V17.6115H104.81Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M137.238 8.93525C137.238 5.69784 135.163 3.23741 132.05 3.23741C128.807 3.23741 126.731 5.69784 126.731 8.93525C126.731 12.1727 128.807 14.6331 132.05 14.6331C135.163 14.6331 137.238 12.1727 137.238 8.93525ZM122.84 8.93525C122.84 3.7554 126.602 0 131.92 0C137.108 0 141 3.7554 141 8.93525C141 14.1151 137.238 17.8705 131.92 17.8705C126.731 17.8705 122.84 14.1151 122.84 8.93525Z" fill="#F4F6FF"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M10.1178 7.89928L13.3606 13.5971H6.74517L10.1178 7.89928ZM10.3772 0.258991L0 17.6115H20.1058L10.3772 0.258991Z" fill="#F4F6FF"/>' +
    '</svg>';

  var link =
    'text-[#B4B8D8] text-small hover:text-brand transition-colors duration-fast';

  function col(title, items) {
    var links = items.map(function (item) {
      return '<a href="' + item.href + '" class="' + link + '">' + item.label + '</a>';
    }).join('');
    return '<div>' +
      '<div class="text-[13.5px] font-semibold tracking-label-wide uppercase text-body-faint mb-[18px]">' + title + '</div>' +
      '<div class="flex flex-col gap-2">' + links + '</div></div>';
  }

  var html =
    '<footer data-site-footer class="print:hidden border-t border-hairline pt-[64px] pb-[40px]">' +
      '<div class="max-w-container mx-auto px-gutter grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-[40px]">' +
        '<div>' +
          '<div class="mb-[20px]">' +
            '<a href="/" class="inline-block" aria-label="Andelo home">' + LOGO + '</a>' +
          '</div>' +
          '<p class="text-body-caption text-small leading-[1.65] max-w-[340px]">Andelo is an Australia-based design subscription service helping in-house marketing teams produce high-quality design at scale, with a committed delivery date on every brief.</p>' +
        '</div>' +
        col('Company', [
          { href: '/why/', label: 'Why Andelo' },
          { href: '/work/', label: 'Our Work' },
          { href: '/work/', label: 'Services' },
          { href: '/pricing/', label: 'Pricing' },
          { href: '/careers/', label: 'Careers' },
          { href: '/book-a-call/', label: 'Book A Call' }
        ]) +
        col('Case Study', [
          { href: '/case-studies/maskco/', label: 'MaskCo' },
          { href: '/case-studies/speedfit/', label: 'Speedfit' },
          { href: '/case-studies/oren-greenberg/', label: 'Oren Greenberg' }
        ]) +
        col('Resources &amp; Support', [
          { href: '/resources/', label: 'Resources' },
          { href: '/blog/', label: 'Blog' },
          { href: '/capacity-calculator/', label: 'Capacity Calculator' },
          { href: '/design-brief-builder/', label: 'Design Brief Builder' },
          { href: '/design-capacity-formula/', label: 'Design Capacity Formula' }
        ]) +
      '</div>' +
      '<div class="max-w-container mx-auto mt-[44px] px-gutter pt-4 border-t border-white/[.06] flex flex-wrap justify-between gap-[14px]">' +
        '<div class="flex flex-wrap items-center gap-[18px]">' +
          '<span class="text-body-faint text-[15px]">© 2026 Andelo Pty Ltd. All rights reserved.</span>' +
          '<a href="/privacy-policy/" class="text-body-faint text-[15px] hover:text-brand transition-colors duration-fast">Privacy Policy</a>' +
          '<a href="/terms-of-use/" class="text-body-faint text-[15px] hover:text-brand transition-colors duration-fast">Terms of Use</a>' +
        '</div>' +
        '<span class="text-body-faint text-[15px]">Andelo acknowledges the Traditional Owners of Country throughout Australia.</span>' +
      '</div>' +
    '</footer>';

  function mount() {
    var mountEl = document.querySelector('[data-site-footer-mount]');
    if (mountEl) {
      mountEl.outerHTML = html;
      return;
    }
    var existing = document.querySelector('footer');
    if (existing) {
      existing.outerHTML = html;
      return;
    }
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstChild);
  }

  if (document.querySelector('[data-site-footer-mount]')) {
    mount();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
