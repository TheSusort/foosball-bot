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
        rotate: {
            '720': '720deg'
        },
        extend: {
            animation: {
                'spin-slow': 'spin 5s linear infinite',
                'reverse-spin-slow': 'reverse-spin 5s linear infinite'
            },
            keyframes: {
                'reverse-spin': {
                    from: {
                        transform: 'rotate(360deg)'
                    },
                }
            },
            transitionDuration: {
                '5000': '5000ms'
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
