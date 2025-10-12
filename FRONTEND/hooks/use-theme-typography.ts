/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { TypeStyles } from '../constants/typography';
import { useThemeColor } from "./use-theme-color";


export function useThemeTypography(
    fontKey: keyof typeof TypeStyles
) {

    return TypeStyles[fontKey];
}


