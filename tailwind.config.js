module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust based on your file structure
  ],
  theme: {
    extend: {
      animation: {
        upDown: "upDown 10s ease-in-out infinite",
        DownUp: "DownUp 10s ease-in-out infinite",
      },
      keyframes: {
        upDown: {
          "0%, 100%": {
            transform: "translateY(0)", // No movement at the start and end
          },
          "50%": {
            transform: "translateY(-300px)", // Move up by 30px
          },
        },
        DownUp: {
          "0%, 100%": {
            transform: "translateY(0)", // No movement at the start and end
          },
          "50%": {
            transform: "translateY(300px)", // Move down by 30px
          },
        },
      },
      colors: {
        offwhite:"",
        primary: "red",        
        secondary: "black",      
       
      },
      fontSize: {
        title: "3.5rem", // 3xl → 30px
        secondTitle: "1.60rem", // xl → 20px
      },
      fontFamily: {
        lobster: ["Lobster", "serif"],
        lora: ["Lora", "sans-serif"],
      },
    },
  },
  plugins: [],
};
