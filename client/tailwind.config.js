// Load environment variables
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Get team colors from environment variables
const team1Color = process.env.VITE_TEAM_1_COLOR || 'blue';
const team2Color = process.env.VITE_TEAM_2_COLOR || 'red';

module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    safelist: [
        'after:w-1/12',
        'after:w-3/12',
        'after:w-4/12',
        'after:w-5/12',
        'after:w-6/12',
        'after:w-7/12',
        'after:w-8/12',
        'after:w-10/12',
        'after:w-11/12',
        'after:w-full',
        'after:left-0',
        'after:right-0',
        // Dynamic team colors
        `after:bg-${team1Color}-500`,
        `after:bg-${team2Color}-500`,
    ],
    darkMode: 'media', // or 'class'
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
                'shine': 'shine 5s ease-in-out infinite',
                'shine-fast': 'shine-fast 5s ease-in-out infinite',
                'zoom': 'zoom 3s ease-in-out infinite'
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
                },
                'shine': {
                    '0%': {
                        'transform': 'skewX(20deg) translateX(-100%)'
                    },
                    '10%': {
                        'transform': 'skewX(20deg) translateX(100vw)'
                    },
                    '100%': {
                        'transform': 'skewX(20deg) translateX(100vw)'
                    }
                },
                'shine-fast': {
                    '0%': {
                        'transform': 'skewX(20deg) translateX(-100%)'
                    },
                    '10%': {
                        'transform': 'skewX(20deg) translateX(150%)'
                    },
                    '100%': {
                        'transform': 'skewX(20deg) translateX(150%)'
                    }
                },
                'zoom': {
                    '0%, 100%': {
                        'transform': 'scale(1)'
                    },
                    '50%': {
                        'transform': 'scale(1.5)'
                    }
                }
            },

            transitionDuration: {
                '5000': '5000ms'
            },
            colors: {
                gold: '#d4af37'
            },
            backgroundImage: {
                king: 'url(media/king.png)',
                clown: 'url(media/clown.png)'
            }
        }
    },
    plugins: [],
}
