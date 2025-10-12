import { themeSpacing } from "../constants/spacing";

import { useThemeColor } from "./use-theme-color";


export function useThemeSpacing<StyleKey extends keyof typeof themeSpacing>(
    styleKey: StyleKey
) {

    return themeSpacing[styleKey];
}

