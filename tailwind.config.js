/**
 * Andelo Design System — Tailwind theme
 * Tailwind CSS v3. Values extracted from the design system tokens; nothing invented.
 *
 * Rules the theme encodes (see the design system readme):
 *   - Mint (brand) is the ONE accent. Flat fills only, never a gradient or a panel background.
 *   - On white, mint fails text contrast: use `text-brand-onWhite`. Button fills stay mint.
 *   - Coloured boxes use ONE jewel gradient per view (bg-grad-purple etc), with white text.
 *   - Gradients are decorative only, never a flat UI fill.
 *   - accent-soft is for small tags/chips and thin icon-tile washes only, never a panel fill.
 *
 * Usage: `bg-canvas text-body font-body` on the page shell.
 */
module.exports = {
  content: ['./**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    // Matches Home breakpoints (sm = tablet, md = desktop-ish, lg = container+)
    screens: {
      sm: '721px',
      md: '901px',
      lg: '1201px',
      xl: '1440px',
    },
    extend: {
      colors: {
        // Canvas & surfaces (dark)
        canvas: {
          DEFAULT: '#0A0C22',
          raised: '#12152F',
        },
        navy: {
          1: '#161B45', // navy panel gradient, top
          2: '#0C0E28', // navy panel gradient, bottom
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.045)', // frosted card fill
          hover: 'rgba(255,255,255,0.08)',    // glass / ghost hover fill
        },
        hairline: {
          DEFAULT: 'rgba(255,255,255,0.08)',  // section dividers
          card: 'rgba(255,255,255,0.09)',     // card border
          hover: 'rgba(255,255,255,0.28)',    // card border hover
        },

        // Accent: mint, the one brand colour
        brand: {
          DEFAULT: '#3DE68C',
          hover: '#5CEBA1',
          ink: '#04160C',                       // text/icons ON a mint fill
          soft: 'rgba(61,230,140,0.16)',        // small tags, icon-tile wash
          softStrong: 'rgba(61,230,140,0.26)',  // accent chip hover
          border: 'rgba(61,230,140,0.3)',
          onWhite: '#0E7A43',                   // mint's legible text form on white
        },

        // Text ramp on dark
        heading: {
          DEFAULT: '#F5F7FF',
          hi: '#F6F8FF', // hero headings
        },
        body: {
          DEFAULT: '#EEF0FF',   // default UI text
          strong: '#C4C8E6',    // emphasised secondary
          muted: '#A6AAD0',     // long-form body
          tertiary: '#9EA2C8',
          caption: '#8388AE',   // labels, captions
          faint: '#6B7099',     // footnotes, mono hex, disabled
        },

        // Light surface (long-form: cheat sheets, articles)
        paper: '#FFFFFF',
        ink: {
          DEFAULT: '#12141C',
          body: '#3D4048',
        },

        // Secondary jewel tones — coloured boxes/panels, one per view, never two
        jewel: {
          blue: '#61A5F2',    blueDeep: '#2E5FB0',
          indigo: '#6170F2',  indigoDeep: '#2E38B0',
          purple: '#A661F2',  purpleDeep: '#6E2EB0',
          magenta: '#E161F2', magentaDeep: '#A32EB0',
          pink: '#F2619E',    pinkDeep: '#B02E5E',
          red: '#F26161',     redDeep: '#B02E2E',
        },
        // Text on a jewel panel is always white (body at 90%)
        onSecondary: {
          DEFAULT: '#FFFFFF',
          body: 'rgba(255,255,255,0.9)',
        },

        // Status — data & severity only, never brand or decoration
        status: {
          red: '#FF9494',        redBg: 'rgba(255,99,99,0.15)',
          amber: '#F2BE5C',      amberBg: 'rgba(240,178,72,0.15)',
          neutral: '#9AA0C0',    neutralBg: 'rgba(255,255,255,0.06)',
          redInk: '#BE3826',     redPaper: '#FCE7E4',
          amberInk: '#966410',   amberPaper: '#FBF0D8',
          neutralInk: '#586070', neutralPaper: '#EAEEF0',
        },
      },

      fontFamily: {
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Hanken Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },

      // [size, { lineHeight, letterSpacing }]
      // Keys used by Home: h1/h2/h3, base/lead/small, eyebrow/caption
      fontSize: {
        h1: ['clamp(40px, 4.6vw, 60px)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        h2: ['clamp(34px, 4.5vw, 54px)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        h3: ['21.5px', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
        base: ['18px', { lineHeight: '1.6' }],
        lead: ['19px', { lineHeight: '1.6' }],
        small: ['16.5px', { lineHeight: '1.6' }],
        // Aliases kept for other pages / mapping docs
        'body-lg': ['19px', { lineHeight: '1.6' }],
        body: ['18px', { lineHeight: '1.6' }],
        'body-sm': ['16.5px', { lineHeight: '1.6' }],
        eyebrow: ['14px', { lineHeight: '1.2', letterSpacing: '0.2em' }],
        caption: ['14px', { lineHeight: '1.5' }],
      },

      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        heavy: '800',
      },

      letterSpacing: {
        display: '-0.03em',
        tight: '-0.02em',
        snug: '-0.01em',
        label: '0.14em',
        'label-wide': '0.16em',
        eyebrow: '0.2em',
      },

      lineHeight: {
        heading: '1.04',
        tight: '1.1',
        snug: '1.5',
        body: '1.6',
      },

      // Base rhythm: 6 / 12 / 18 / 24 / 34 / 52 / 80
      spacing: {
        1: '6px',
        2: '12px',
        3: '18px',
        4: '24px',
        5: '34px',
        6: '52px',
        7: '80px',
        card: '20px', // gap between glass/step cards
        gutter: '32px',
        section: '80px',
      },

      maxWidth: {
        container: '1200px', // standard content width
        narrow: '920px',     // long-form / centred
      },

      borderRadius: {
        xs: '8px',
        sm: '12px',
        md: '18px',
        card: '20px',
        lg: '26px',
        pill: '999px',
      },

      boxShadow: {
        btn: '0 14px 34px rgba(61,230,140,0.28)',      // mint button glow
        'btn-hover': '0 18px 38px rgba(61,230,140,0.34)',
        card: '0 20px 44px rgba(0,0,0,0.32)',
        panel: '0 20px 44px rgba(46,95,176,0.28)',     // jewel panel
      },

      backdropBlur: {
        card: '16px',
        glow: '28px',
      },

      // Decorative panel fills only — never a flat UI fill
      backgroundImage: {
        'grad-mint': 'linear-gradient(150deg, #3DE68C, #12A566)',
        'grad-blue': 'linear-gradient(150deg, #61A5F2, #2E5FB0)',
        'grad-indigo': 'linear-gradient(150deg, #6170F2, #2E38B0)',
        'grad-purple': 'linear-gradient(150deg, #A661F2, #6E2EB0)',
        'grad-magenta': 'linear-gradient(150deg, #E161F2, #A32EB0)',
        'grad-pink': 'linear-gradient(150deg, #F2619E, #B02E5E)',
        'grad-red': 'linear-gradient(150deg, #F26161, #B02E2E)',
        'grad-navy': 'linear-gradient(160deg, #161B45, #0C0E28)',
      },

      transitionTimingFunction: {
        house: 'cubic-bezier(0.22, 1, 0.36, 1)', // live house ease — matches docs/animation-standards.md & input.css --ease-out
      },
      transitionDuration: {
        fast: '200ms',
        DEFAULT: '350ms',
      },

      keyframes: {
        dsGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
        dsLift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        glow: 'dsGlow 6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        lift: 'dsLift 5s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
    },
  },
  plugins: [],
};
