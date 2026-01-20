/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ivory: "#F7F5F2",
                charcoal: "#1C1C1C",
                warmgray: "#B8B5B0",
                beige: "#F2EFE9",
                mutedbrown: "#8C7B6D",
                gold: "#D4AF37",
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
