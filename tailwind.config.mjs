/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{ts,tsx,js,jsx,mdx}",
        "./components/**/*.{ts,tsx,js,jsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],

            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                    sky: "#C3EBFA",
                    skyLight: "#EDF9FD",
                    purple: "#CFCEFF",
                    purpleLight: "#F1F0FF",
                    yellow: "#FAE27C",
                    yellowLight: "#FEFCE8",

            },
        },
    },
    plugins: [],
};
