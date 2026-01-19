import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'todo-peach': '#FBE4D8',
        'todo-rose': '#DFB6B2',
        'todo-dusty': '#854F6C',
        'todo-dark': '#522B5B',
      },
    },
  },
  plugins: [],
}
export default config
