/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'var(--bg-main)',
                card: 'var(--bg-card)',
                primary: 'var(--primary)',
                'primary-hover': 'var(--primary-hover)',
                border: 'var(--border)',
            }
        },
    },
    plugins: [],
}
