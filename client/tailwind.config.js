/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors:{
        navbarBG:'rgb(48, 44, 44)',
        navbarText:'rgba(183,191,175,255)',
      }
    },
  },
  plugins: [],
}

