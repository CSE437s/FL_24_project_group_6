/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.{tsx,ts,html}",  // Scanning all relevant files in src
    "./.plasmo/**/*.{tsx,html}",  // Scan any Plasmo-related files
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        customGreenDark: '#6A8532',
        customGreenLight:'#87A330',
        customOrangeDark: '#EB5E26',
        customOrangeLight:'#F98128'
      },
    },
  },
  prefix: "",
  plugins: []
}