import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'metallic': 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 25%, #f8fafc 50%, #f1f5f9 75%, #e2e8f0 100%)',
        'metallic-hover': 'linear-gradient(135deg, #cbd5e1 0%, #e2e8f0 25%, #f8fafc 50%, #e2e8f0 75%, #cbd5e1 100%)',
        'metallic-active': 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 25%, #e2e8f0 50%, #cbd5e1 75%, #94a3b8 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        'metallic': '0 2px 4px 0 rgb(0 0 0 / 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 0 rgba(148, 163, 184, 0.2)',
        'metallic-hover': '0 4px 6px -1px rgb(0 0 0 / 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 0 rgba(148, 163, 184, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
