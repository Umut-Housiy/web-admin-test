// const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
    "./src/**/*.html",
    "./src/**/*.tsx",
    "./src/**/*.css",
    "./src/**/*.ts",
  ],
  darkMode: "class",
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      blue: {
        DEFAULT: "#005BFF",
        50: "#F4F6FB",
        100: "#F0F7FF",
        200: "#CCE4FF",
        300: "#4692E9",
        400: "#107DFD",
        600: "#0266D9",
        700: "#024BA1",
      },
      gray: {
        50: '#F7F7F7',
        100: "#F8F9FC",
        200: "#E9EDF7",
        300: "#E4E7F1",
        400: "#A3AED0",
        700: "#585D76",
        900: "#1B1F30",
      },
      green: {
        100: "#E6FAF5",
        400: "#05CD99",
      },
      red: {
        100: "#FEF4F4",
        200: "#F6B2B2",
        400: "#E31A1A",
      },
      white: {
        DEFAULT: "#FFFFFF"
      },
      yellow: {
        100: "#FFF1EB",
        400: "#FFB946",
        600: "#FE894D"
      },
      black: {
        DEFAULT: '#000000',
        400: "#222222",
        700: "#626262"
      }

    },
    fontFamily: {
      "sans": ["Poppins", "ui-sans-serif", "system-ui"],
      "display": "Poppins",
      "body": "Poppins"
    },
    fontSize: {
      'xxs': '.5rem',//8px
      'xs': '.625rem',//10px
      'sm': '.75rem', //12px
      'tiny': '.875rem', //14px
      'base': '1rem',
      'lg': '1.125rem',//18px
      'xl': '1.25rem',//20px
      '2xl': '1.5rem',//24px
      '3xl': '1.875rem',//30px
      '4xl': '2rem', //32px
      '5xl': '3rem',//48px
      '6xl': '4rem',//54px
      '7xl': '5rem',
      '13': '13px',
      '11': "11px"
    },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      '3xl': '1700px',
      // => @media (min-width: 1536px) { ... }
    },
    maxHeight: {
      '0': '0',
      '1/4': '25%',
      '1/3': '33%',
      '2/5': '40%',
      '1/2': '50%',
      '3/5': '60%',
      '3/4': '75%',
      '4/5': '80%',
      'full': '100%',
      '14': "3.5rem",
      '32': "8rem",
      '36': "9rem",
      '40': "10rem",
      '44': "11rem",
      '48': "12rem",
      '52': "13rem",
      '66': "16rem",
      '60vh': '60vh',
      '88': "22rem",
      '75vh': '75vh',
      '62vh': '62vh',
      '50vh': '50vh',
      'screen': '100vh',
      '12': '3rem',
      '28': '7rem',
      '96': '24rem',
      '572': '572px',

    },
    minHeight: {
      '0': '0',
      '2': '0.50rem',
      '20': '5rem',
      '1/4': '25%',
      '1/3': '33%',
      '2/5': '40%',
      '3/5': '60%',
      '1/2': '50%',
      '3/4': '75%',
      '4/5': '80%',
      'full': '100%',
      '25vh': "25vh",
      '60vh': '60vh',
      '14': "3.5rem",
      '12': '3rem',
      '28': '7rem',
      '572': '572px',

    },
    minWidth: {
      '0': '0',
      '2': '0.50rem',
      '1/4': '25%',
      '1/3': "33%",
      '2/5': '40%',
      '1/2': '50%',
      '3/5': '60%',
      '3/4': '75%',
      '4/5': '80%',
      '1/6': '16.666667%',
      'full': '100%',
      '14': "3.5rem",
      '12': '3rem',
      '20': '5rem',
      '28': '7rem',
      '412': '412px',
      '1030': '1030px',
      '9/10': '90%',
      '520': '520px'
    },
    maxWidth: {
      '0': '0',
      '1/4': '25%',
      '1/3': "33%",
      '2/5': '40%',
      '1/2': '50%',
      '3/5': '60%',
      '3/4': '75%',
      'full': '100%',
      '14': "3.5rem",
      '12': '3rem',
      '28': '7rem',
      '412': '412px',
      '1030': '1030px',
      '9/10': '90%',
      '520': '520px'

    },
    zIndex: {
      '0': 0,
      '10': 10,
      '20': 20,
      '30': 30,
      '40': 40,
      '50': 50,
      '60': 60,
      '70': 70,
      '80': 80,
      '90': 90,
      '100': 100,
    },
    extend: {
      height: {
        88: '400px',
        '50vh': '50vh',
        '60vh': '60vh',
        '70vh': '70vh',
        '80vh': '80vh',
        '90vh': '90vh'
      },
      width: {
        '2col': '16.666667vw',
        '2/3col': '12.499999vw',
        '1col': '8.333333vw',
        '46': '11.5rem',
        '21': '5.25rem'
      },
      lineHeight: {
        '13': '13px',
        '18': '18px',
        '22': '22px',
        '23': '23px',
        '26': '1.625rem',
        '30': '1.85rem',
        '33': '33px',
        '12': '3rem',
      },
      animation: {
        bounce200: 'bounce .5s infinite 200ms',
        bounce400: 'bounce .5s infinite 400ms',
      },
      spacing: {
        88: '88px',
        110: '110px',
      },
      inset: {
        '50': '50px',
      },
      boxShadow: {
        custom: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
        customBlue: '0px 0px 4px rgba(16, 125, 253, 0.5);',
        customShadowLightBlue: '0px 0px 20px #E9EDF7',
        customFormInput: ' 0px 0px 4px rgba(16, 125, 253, 0.5)',
      }
    },

  },
  variants: {
    extend: {
      fontWeight: ['hover', 'focus'],
      borderRadius: ['hover', 'focus'],
      scale: ['hover', 'group-hover'],
      translate: ['motion-reduce'],
      backgroundColor: ['group-focus'],
      display: ['group-focus'],
      visibility: ['group-focus'],
      padding: ['hover', 'focus'],
      backgroundColor: ['checked'],
      borderColor: ['checked', 'last'],
      borderWidth: ['hover', 'focus', 'last'],
      rotate: ['active', 'group-hover'],

    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/custom-forms')
  ]

}
