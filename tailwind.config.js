import { content, plugin } from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', content()],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)",
        "custom-gray": "var(--custom-gray)",
        "input-color": "var(--input-color)",
        "dark-blue": "var(--dark-blue)",
        "light-border": "var(--light-border)",
        "light-blue": '#242B3C'
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(90deg, rgba(79,166,255,1) 0%, rgba(0,126,255,1) 100%)',
        'gray-gradient': 'linear-gradient(90deg, rgba(57,65,92,1) 0%, rgba(85,95,131,1) 100%)',        
      },
      backgroundColor:{
          'highlight-color' : '#2792FF'
      },
      screens:{
        '2xl' : {'min': '1600px'},
      }
    },
  },
  plugins: [plugin()],
};
