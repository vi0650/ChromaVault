export interface ColorPalette {
  id: string;
  colors: string[];
  likes: number;
  createdAt: string;
  tags?: string[];
  userId?: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface CreatePaletteFormData {
  colors: string[];
  tags: string[];
}

export interface SupabaseUser {
  id: string;
  email: string;
}