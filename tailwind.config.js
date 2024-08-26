// tailwind.config.js
export default  {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      colors: {
        purple: {
          900: '#4b0082',
        },
        blue: {
          900: '#001f3f',
        },
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)' },
          '50%': { transform: 'none' },
        },
      },
      animation: {
        bounce: 'bounce 1s infinite',
        flip: 'flip 1s forwards',
      },
    },
  },
  plugins: [],
},
}

