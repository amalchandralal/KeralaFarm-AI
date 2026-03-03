/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./client/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		colors: {
  			forest: {
  				'50': '#f0faf0',
  				'100': '#dcf5dc',
  				'200': '#bbebbb',
  				'300': '#86d986',
  				'400': '#4ec24e',
  				'500': '#2da82d',
  				'600': '#1f8a1f',
  				'700': '#1a6e1a',
  				'800': '#175717',
  				'900': '#134813'
  			},
  			earth: {
  				'50': '#fdf8f0',
  				'100': '#faeedd',
  				'200': '#f4d9b0',
  				'300': '#ecbe7a',
  				'400': '#e29f42',
  				'500': '#d4851f',
  				'600': '#b96a15',
  				'700': '#9a5114',
  				'800': '#7d4117',
  				'900': '#673717'
  			},
  			leaf: '#2da82d',
  			soil: '#8B5E3C',
  			sky: '#87CEEB',
  			paddy: '#C8B560',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			display: [
  				'Georgia',
  				'serif'
  			],
  			body: [
  				'system-ui',
  				'sans-serif'
  			],
  			mal: [
  				'Noto Sans Malayalam',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
