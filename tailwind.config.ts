import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#F5F5F7',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
          sidebar: 'rgba(255,255,255,0.72)',
          hover: '#F0F0F2',
          active: '#E8E8ED',
          input: '#F0F0F2',
        },
        border: {
          primary: 'rgba(0,0,0,0.06)',
          secondary: 'rgba(0,0,0,0.04)',
          focus: 'rgba(0, 122, 255, 0.4)',
        },
        text: {
          primary: '#1D1D1F',
          secondary: '#6E6E73',
          tertiary: '#AEAEB2',
          placeholder: '#C7C7CC',
        },
        accent: {
          blue: '#007AFF',
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
          purple: '#AF52DE',
          teal: '#5AC8FA',
          indigo: '#5856D6',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'button': '10px',
        'input': '10px',
        'modal': '16px',
        'badge': '6px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 0.5px 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)',
        'md': '0 4px 12px rgba(0,0,0,0.06)',
        'lg': '0 12px 40px rgba(0,0,0,0.08)',
        'elevated': '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
export default config
