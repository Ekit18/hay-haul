import { CUSTOM_FONT } from '#/App';
import { fontFamily as defaultFontFamily } from 'tailwindcss/defaultTheme';

export const getCustomFontFamily = () => `${CUSTOM_FONT}, ${defaultFontFamily.sans.join(',')}`;
