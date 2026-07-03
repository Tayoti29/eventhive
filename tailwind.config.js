/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ── FONT ──────────────────────────────────────────
      fontFamily: {
        sans: ['Asap', 'sans-serif'],
      },

      // ── COLOURS ───────────────────────────────────────
      colors: {
        blue: {
          900: '#000C14',
          800: '#00253D',
          700: '#003D66',
          600: '#00568F',
          500: '#007ACC',
          400: '#0097FF',
          300: '#93D4FF',
          200: '#CBEAFF',
          100: '#E3F4FF',
          50:  '#EFF9FF',
          10:  '#F6FBFF',
        },
        grey: {
          900: '#141415',
          800: '#141415',
          700: '#414143',
          600: '#59595C',
          500: '#7E7E82',
          400: '#A5A5AA',
          300: '#C7C7CA',
          200: '#DEDEE0',
          100: '#E8E8EA',
          50:  '#F3F3F4',
          10:  '#F9F9F9',
        },
        yellow: {
          900: '#291E00',
          800: '#523C00',
          700: '#7A5900',
          600: '#B88700',
          500: '#FFB900',
          400: '#FFC936',
          300: '#FED86E',
          200: '#FFE6A2',
          100: '#FFF0C7',
          50:  '#FFF6DE',
          10:  '#FFFCF4',
        },
        success: '#4CAF50',
        error:   '#AE2012',
      },

      // ── TYPOGRAPHY ────────────────────────────────────
      fontSize: {
        'h1':        ['64px', { lineHeight: '72px', letterSpacing: '-2px', fontWeight: '700' }],
        'h2':        ['40px', { lineHeight: '48px', letterSpacing: '-1px', fontWeight: '700' }],
        'h3':        ['32px', { lineHeight: '39px', letterSpacing: '-1px', fontWeight: '700' }],
        'h4':        ['24px', { lineHeight: '32px', letterSpacing: '-1px', fontWeight: '700' }],
        'h5':        ['20px', { lineHeight: '28px', fontWeight: '700' }],
        'h6':        ['24px', { lineHeight: '32px', fontWeight: '400' }],
        'h7':        ['20px', { lineHeight: '28px', fontWeight: '400' }],
        'title1':    ['16px', { lineHeight: '22px', fontWeight: '700' }],
        'title2':    ['14px', { lineHeight: '20px', fontWeight: '700' }],
        'title3':    ['12px', { lineHeight: '16px', fontWeight: '700' }],
        'subtitle1': ['16px', { lineHeight: '22px', fontWeight: '500' }],
        'subtitle2': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'subtitle3': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'p1':        ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'p2':        ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'p3':        ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label1':    ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label2':    ['10px', { lineHeight: '12px', fontWeight: '500' }],
        'caption1':  ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'caption2':  ['10px', { lineHeight: '12px', fontWeight: '400' }],
        'nav1':      ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'nav2':      ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'btn1':      ['16px', { lineHeight: '22px', fontWeight: '500' }],
        'btn2':      ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'btn3':      ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },

      // ── BORDER RADIUS ─────────────────────────────────
      borderRadius: {
        'sm':   '4px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '24px',
        'full': '9999px',
      },

      // ── SHADOWS ───────────────────────────────────────
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}