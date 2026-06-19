/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        tmc: {
          teal:        '#156F75',
          'teal-dark': '#0E4E53',
          'teal-mid':  '#1A8C94',
          'teal-light':'#E6F4F5',
          amber:       '#E8952A',
          'amber-light':'#FDF3E3',
          navy:        '#0F1F2E',
          cream:       '#FAF7F2',
          coral:       '#D95F3B',
          border:      '#E4DED4',
        },
      },
    },
  },
  plugins: [],
}
