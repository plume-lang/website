/** @type {import('tailwindcss').Config} */
import config from "tailwindcss/defaultTheme";
const { fontFamily } = config;

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        sans: ["Noto Sans", ...fontFamily.sans],
        mono: ["Fira Code", ...fontFamily.mono],
      },
      colors: {
        'hot-pink': { DEFAULT: '#FF66C4', 50: '#FFF5FB', 100: '#FFE0F3', 200: '#FFB8E3', 300: '#FF8FD4', 400: '#FF66C4', 500: '#FF2EAE', 600: '#F50096', 700: '#BD0074', 800: '#850051', 900: '#4D002F', 950: '#30001E' },
        
        'mustard': {  DEFAULT: '#FFDE59',  50: '#FFFAE8',  100: '#FFF6D3',  200: '#FFEEAB',  300: '#FFE682',  400: '#FFDE59',  500: '#FFD321',  600: '#E8BA00',  700: '#B08D00',  800: '#786000',  900: '#403300',  950: '#231C00'},
      }
    },
	},
	plugins: [],
}
