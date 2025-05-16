module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      boxShadow: {
        'chat-message': '0 2px 8px -1px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};