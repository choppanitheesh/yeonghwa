export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0f0f0f",
        card: "#1a1a1a",
        primary: "#e50914", // Netflix red or a Teal for Sequal look
        textSecondary: "#a1a1a1"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}