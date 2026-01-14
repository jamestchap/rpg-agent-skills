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
          50: "#f9f6f0",
          100: "#efe7dc",
          200: "#ded4c5",
          300: "#c4b6a4",
          400: "#a18f7d",
          500: "#7e6f60",
          600: "#5f5247",
          700: "#473e35",
          800: "#332c26",
          900: "#1f1b16"
        },
        parchment: {
          50: "#fbf6ef",
          100: "#f4eadc",
          200: "#eadbc9",
          300: "#dbc6aa",
          400: "#c6ab86"
        },
        pine: {
          50: "#edf4ef",
          100: "#d5e5da",
          200: "#b1cfbf",
          300: "#86b19a",
          400: "#5f8e74",
          500: "#4b705c",
          600: "#3d5a4b",
          700: "#31483d",
          800: "#25362e",
          900: "#1a2622"
        },
        brass: {
          50: "#fff6db",
          100: "#ffe9b3",
          200: "#ffd47a",
          300: "#f0b74a",
          400: "#d39b2f",
          500: "#b57d22",
          600: "#8f5f1a",
          700: "#6f4915",
          800: "#543711",
          900: "#3a240b"
        },
        smoke: {
          50: "#f5f3f0",
          100: "#e6dfd7",
          200: "#cfc4b7",
          300: "#b2a395",
          400: "#947f73",
          500: "#77665d",
          600: "#5f514a",
          700: "#4a3f3a",
          800: "#352e2a",
          900: "#1f1a17"
        },
        forge: {
          50: "#fff3e7",
          100: "#ffe0bf",
          200: "#ffc48a",
          300: "#ffa35c",
          400: "#f47f38",
          500: "#e06a2c",
          600: "#bf5222",
          700: "#9a401b",
          800: "#7b3316",
          900: "#652b13"
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
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" }
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" }
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" }
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "rotate(215deg) translateX(-500px)", opacity: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        marquee: "marquee 25s linear infinite",
        "marquee-vertical": "marquee-vertical 25s linear infinite",
        meteor: "meteor 5s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
