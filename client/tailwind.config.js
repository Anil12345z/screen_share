module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html", // Include the main HTML file if applicable
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8", // Example custom color
        secondary: "#9333ea",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Add a custom font
      },
      spacing: {
        '128': '32rem', // Add custom spacing
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // Tailwind forms plugin
    require("@tailwindcss/typography"), // Tailwind typography plugin
    require("@tailwindcss/aspect-ratio"), // Tailwind aspect ratio plugin
  ],
};
