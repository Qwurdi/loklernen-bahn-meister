
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
				// LokLernen brand colors
				loklernen: {
					black: "#000000",
					ultramarine: "#3F00FF",
					sapphire: "#0F52BA",
					betriebsdienst: "#00B8A9",
					// New trend colors that complement our brand
					lavender: "#9683EC",      // Digital Lavender
					mint: "#C7F0BD",          // Neo-Mint
					tranquil: "#5080FF",      // Tranquil Blue
					coral: "#FF6D70"          // Digital Coral
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'focus-in': {
					'0%': { boxShadow: '0 0 0 0 rgba(15, 82, 186, 0)' },
					'100%': { boxShadow: '0 0 0 4px rgba(15, 82, 186, 0.1)' }
				},
				'swipe-right': {
					'0%': { transform: 'translateX(0) rotate(0)' },
					'100%': { transform: 'translateX(120%) rotate(10deg)', opacity: '0' }
				},
				'swipe-left': {
					'0%': { transform: 'translateX(0) rotate(0)' },
					'100%': { transform: 'translateX(-120%) rotate(-10deg)', opacity: '0' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				// New animations
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(63, 0, 255, 0.5)' },
					'50%': { boxShadow: '0 0 15px rgba(63, 0, 255, 0.8)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'focus-in': 'focus-in 0.5s ease-out forwards',
				'swipe-right': 'swipe-right 0.5s ease-out forwards',
				'swipe-left': 'swipe-left 0.5s ease-out forwards',
				'fade-in-up': 'fade-in-up 0.3s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				// New animations
				'float': 'float 3s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 3s ease infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-ultramarine': 'linear-gradient(135deg, #3F00FF 0%, #5080FF 100%)',
				'gradient-lavender': 'linear-gradient(135deg, #9683EC 0%, #C5B8FF 100%)',
				'gradient-coral-mint': 'linear-gradient(135deg, #FF6D70 0%, #C7F0BD 100%)',
				'gradient-card': 'linear-gradient(145deg, rgba(80, 128, 255, 0.1) 0%, rgba(63, 0, 255, 0.2) 100%)',
				'glassmorphism': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
