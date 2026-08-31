/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: ['./src/**/*.{js,ts,jsx,tsx,astro}'],
  },
  theme: {
    extend: {
      colors: {
        bg: '#070a08',
        card: '#0c140d',
        input: '#0f1f12',
        terminalGreen: '#45f585',
        evangelionNeon: '#45f585',
        terminalMuted: '#34d36d',
        border: '#45f585',
        foreground: '#45f585',
        placeholder: '#1e5631',
      },
      fontFamily: {
        heading: ['Orbitron Variable', 'Inter Variable', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
        body: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
