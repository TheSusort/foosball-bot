module.exports = {
    purge: {
        content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
        safelist: [
            'fade-enter',
            'fade-enter-active',
            'fade-enter-done',
            'fade-exit',
            'fade-exit-active',
            'face-exit-done'
        ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 5s linear infinite',
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
