
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                arcade: {
                    pink: '#ff00ff',
                    cyan: '#00ffff',
                    purple: '#9b87f5',
                    darkPurple: '#1A1F2C',
                    orange: '#F97316',
                    neonPink: '#D946EF',
                    neonBlue: '#0EA5E9'
                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
                'zoom-in': {
                    '0%': { transform: 'scale(1) translateY(0)' },
                    '100%': { transform: 'scale(10) translateY(-5%)' }
                },
                'crt-flicker': {
                    '0%': { opacity: '0.9' },
                    '10%': { opacity: '1' },
                    '15%': { opacity: '0.9' },
                    '20%': { opacity: '1' },
                    '70%': { opacity: '0.9' },
                    '80%': { opacity: '1' },
                    '100%': { opacity: '0.9' }
                },
                'scanline': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(100%)' }
                },
                'blink': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' }
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                'neon-pulse': {
                    '0%, 100%': {
                        textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00ff, 0 0 20px #ff00ff, 0 0 25px #ff00ff'
                    },
                    '50%': {
                        textShadow: '0 0 5px #fff, 0 0 10px #0ea5e9, 0 0 15px #0ea5e9, 0 0 20px #0ea5e9, 0 0 25px #0ea5e9'
                    }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'zoom-in': 'zoom-in 3s ease-in-out forwards',
                'crt-flicker': 'crt-flicker 2s infinite',
                'scanline': 'scanline 8s linear infinite',
                'blink': 'blink 1s step-start infinite',
                'float': 'float 3s ease-in-out infinite',
                'neon-pulse': 'neon-pulse 2s ease-in-out infinite'
			},
            fontFamily: {
                'press-start': ['"Press Start 2P"', 'cursive'],
                'vt323': ['"VT323"', 'monospace']
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
