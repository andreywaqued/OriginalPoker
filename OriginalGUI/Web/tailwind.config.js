/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'gray-darkest': 'rgb(25,25,25)',
				'gray-dark': 'rgb(49,49,49)',
				'gray': 'rgb(69,69,69)',
				'gray-light': 'rgb(100,100,100)'
			},
			fontSize: {
				'2xs': "0.5rem"
			}
		}
	},
	plugins: []
};
