import forms from '@tailwindcss/forms';
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                'primary-dark': 'rgb(var(--color-primary-dark) / <alpha-value>)',
                'background-light': 'rgb(var(--color-background-light) / <alpha-value>)',
                'background-dark': 'rgb(var(--color-background-dark) / <alpha-value>)',
                'surface-light': 'rgb(var(--color-surface-light) / <alpha-value>)',
                'surface-dark': 'rgb(var(--color-surface-dark) / <alpha-value>)',
                'border-light': 'rgb(var(--color-border-light) / <alpha-value>)',
                'border-dark': 'rgb(var(--color-border-dark) / <alpha-value>)',
            },
        },
    },
    plugins: [forms],
};
