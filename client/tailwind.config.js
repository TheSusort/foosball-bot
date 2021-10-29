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
                'reverse-spin-slow': 'reverse-spin 5s linear infinite',
                'gradient-x': 'gradient-x 300ms ease infinite',
                'gradient-y': 'gradient-y 300ms ease infinite',
                'gradient-xy': 'gradient-xy 500ms ease infinite',
            },
            keyframes: {
                'reverse-spin': {
                    from: {
                        transform: 'rotate(360deg)'
                    },
                },
                'gradient-y': {
                    '0%, 100%': {
                        'background-size': '400% 400%',
                        'background-position': 'center top'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'center center'
                    }
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    }
                },
                'gradient-xy': {
                    '0%, 100%': {
                        'background-size': '400% 400%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    }
                }
            },

            transitionDuration: {
                '5000': '5000ms'
            },
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
