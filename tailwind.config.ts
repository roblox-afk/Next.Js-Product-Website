import type { Config } from "tailwindcss"
import { nextui } from "@nextui-org/react"
import { withUt } from "uploadthing/tw";

const config = withUt({
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        'xs': '475px',
        '2xl': {'max': '1535px'},
      },
    },
    screens: {
      'phone': '320px',
      'phone-lg': '540px',
      '2xl': '1535px',
      'xl': '1279px',
      'lg': '1023px',
      'md': '767px',
      'sm': '639px'
    },
    transparent: 'transparent',
    current: 'currentColor',
    extend: {
    },
  },

  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar-hide'), nextui({
    prefix: "nextui", // prefix for themes variables
    addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
    defaultTheme: "dark", // default theme from the themes object
    defaultExtendTheme: "dark", // default theme to extend on custom themes
    layout: {}, // common layout tokens (applied to all themes)
    themes: {
      light: {
        layout: {}, // light theme layout tokens
        colors: {
          background: "#FFFFFF",
          foreground: "#11181C",
          divider: "rgba(17, 17, 17, 0.15)",
          focus: "#006FEE",
          primary: {
            DEFAULT: "#006FEE",
            900: "#001731",
            800: "#002e62",
            700: "#004493",
            600: "#005bc4",
            500: "#006FEE",
            400: "#338ef7",
            300: "#66aaf9",
            200: "#99c7fb",
            100: "#cce3fd",
            50:  "#e6f1fe",
          },
          secondary: {
            DEFAULT: "#7828c8",
            900: "#180828",
            800: "#301050",
            700: "#481878",
            600: "#6020a0",
            500: "#7828c8",
            400: "#9353d3",
            300: "#ae7ede",
            200: "#c9a9e9",
            100: "#e4d4f4",
            50:  "#f2eafa",
          },
          success: {
            DEFAULT: "#17c964",
            900: "#052814",
            800: "#095028",
            700: "#0e793c",
            600: "#12a150",
            500: "#17c963",
            400: "#45d483",
            300: "#73dfa2",
            200: "#a2e9c1",
            100: "#d1f4e0",
            50:  "#e7faf0",
          },
          warning: {
            DEFAULT: "#f5a524",
            900: "#312107",
            800: "#62420e",
            700: "#936316",
            600: "#c4841d",
            500: "#f5a624",
            400: "#f7b750",
            300: "#f9c97c",
            200: "#fbdba7",
            100: "#fdedd3",
            50:  "#fefce8",
          },
          danger: {
            DEFAULT: "#f31260",
            900: "#310413",
            800: "#610726",
            700: "#920b3a",
            600: "#c20e4d",
            500: "#f31260",
            400: "#f54180",
            300: "#f871a0",
            200: "#faa0bf",
            100: "#fdd0df",
            50:  "#fee7ef",
          },
          default: {
            DEFAULT: "#d4d4d8",
            900: "#18181b",
            800: "#27272a",
            700: "#3f3f46",
            600: "#52525b",
            500: "#71717a",
            400: "#a1a1aa",
            300: "#d4d4d8",
            200: "#e4e4e7",
            100: "#f4f4f5",
            50:  "#fafafa",
          }
        }, // light theme colors
      },
      dark: {
        layout: {}, // dark theme layout tokens
        colors: {
          background: "#000000",
          foreground: "#ECEDEE",
          divider: "rgba(255, 255, 255, 0.15)",
          focus: "#006FEE",
          primary: {
            DEFAULT: "#006FEE",
            50:  "#001731",
            100: "#002e62",
            200: "#004493",
            300: "#005bc4",
            400: "#006FEE",
            500: "#338ef7",
            600: "#66aaf9",
            700: "#99c7fb",
            800: "#cce3fd",
            900: "#e6f1fe",
          },
          secondary: {
            DEFAULT: "#9353d3",
            50:  "#180828",
            100: "#301050",
            200: "#481878",
            300: "#6020a0",
            400: "#7828c8",
            500: "#9353d3",
            600: "#ae7ede",
            700: "#c9a9e9",
            800: "#e4d4f4",
            900: "#f2eafa",
          },
          success: {
            DEFAULT: "#17c964",
            50:  "#052814",
            100: "#095028",
            200: "#0e793c",
            300: "#12a150",
            400: "#17c963",
            500: "#45d483",
            600: "#73dfa2",
            700: "#a2e9c1",
            800: "#d1f4e0",
            900: "#e7faf0",
          },
          warning: {
            DEFAULT: "#f5a524",
            50:  "#312107",
            100: "#62420e",
            200: "#936316",
            300: "#c4841d",
            400: "#f5a624",
            500: "#f7b750",
            600: "#f9c97c",
            700: "#fbdba7",
            800: "#fdedd3",
            900: "#fefce8",
          },
          danger: {
            DEFAULT: "#f31260",
            50:  "#310413",
            100: "#610726",
            200: "#920b3a",
            300: "#c20e4d",
            400: "#f31260",
            500: "#f54180",
            600: "#f871a0",
            700: "#faa0bf",
            800: "#fdd0df",
            900: "#fee7ef",
          },
          default: {
            DEFAULT: "#3f3f46",
            50:  "#18181b",
            100: "#27272a",
            200: "#3f3f46",
            300: "#52525b",
            400: "#71717a",
            500: "#a1a1aa",
            600: "#d4d4d8",
            700: "#e4e4e7",
            800: "#f4f4f5",
            900: "#fafafa",
          }
        }, // dark theme colors
      },
      // ... custom themes
    },
  })],
}) satisfies Config

export default config