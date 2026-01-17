import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["\"Fraunces\"", "ui-serif", "Georgia"],
        body: ["\"Space Grotesk\"", "ui-sans-serif", "system-ui"]
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        ink: {
          50: "#f4f0f1",
          100: "#e6dee0",
          200: "#cbbfc4",
          300: "#b09fa6",
          400: "#95828a",
          500: "#7b666f",
          600: "#655257",
          700: "#514145",
          800: "#3f3235",
          900: "#2f2427"
        },
        parchment: {
          50: "#fdf7e6",
          100: "#fdf0d5",
          200: "#f7e6c4",
          300: "#f0d8a9",
          400: "#e4c48a"
        },
        pine: {
          50: "#eef5f2",
          100: "#dbe7e2",
          200: "#c6d8d3",
          300: "#b2cbc5",
          400: "#9fbdb7",
          500: "#8cafaa",
          600: "#769892",
          700: "#5f7d77",
          800: "#495e59",
          900: "#364543"
        },
        brass: {
          50: "#fde5e2",
          100: "#fbc8c3",
          200: "#f7a39d",
          300: "#f07f77",
          400: "#eb5e55",
          500: "#d94f47",
          600: "#b54039",
          700: "#91332e",
          800: "#6e2723",
          900: "#4b1b19"
        },
        smoke: {
          50: "#f0f1f1",
          100: "#e4e6e5",
          200: "#c6d8d3",
          300: "#b6c5c0",
          400: "#a7b2ad",
          500: "#8a9894",
          600: "#717e7a",
          700: "#58625f",
          800: "#404846",
          900: "#2d3331"
        },
        forge: {
          50: "#fee6ed",
          100: "#fbc7d8",
          200: "#f695b5",
          300: "#ee5f8f",
          400: "#e3326d",
          500: "#d81e5b",
          600: "#b8154a",
          700: "#92103a",
          800: "#6f0c2d",
          900: "#520821"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
