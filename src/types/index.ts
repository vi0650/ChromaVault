/** Core data types for ChromaVault */

export type ColorPalette = {
    id: string;
    colors: string[];
    tags: string[];
    likes: number;
    user_id: string | null;
    created_at?: string;
};

export type ThemeContextType = {
    isDark: boolean;
    toggleTheme: () => void;
};
