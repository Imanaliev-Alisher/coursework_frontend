import forms from '@tailwindcss/forms';
declare const _default: {
    darkMode: "class";
    content: string[];
    theme: {
        extend: {
            fontFamily: {
                display: [string, string, string, string];
            };
            colors: {
                primary: string;
                'primary-dark': string;
                'background-light': string;
                'background-dark': string;
                'surface-light': string;
                'surface-dark': string;
                'border-light': string;
                'border-dark': string;
            };
        };
    };
    plugins: (typeof forms)[];
};
export default _default;
