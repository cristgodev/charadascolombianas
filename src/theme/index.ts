export const palette = {
    // Brand Colors (Premium Colombian)
    primary: '#6C63FF', // Vibrant Purple (Main Action)
    secondary: '#00D4FF', // Cyan (Secondary Action)
    accent: '#FFD700', // Gold (Highlights / Colombian Yellow)

    // Game State Colors
    success: '#00E676', // Intense Green (Correct)
    successBg: '#003310', // Dark Green Bg
    error: '#FF1744', // Intense Red (Pass)
    errorBg: '#330005', // Dark Red Bg

    // Backgrounds (Dark Mode Focus)
    background: '#121212', // Deep Black
    surface: '#1E1E1E', // Card Background
    surfaceHighlight: '#2C2C2C', // Light Card Background

    // Text
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textMuted: '#6E6E6E',

    // UI Elements
    border: '#333333',
};

export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64, // For large vertical spacing
};

export const typography = {
    display: {
        fontSize: 40,
        fontWeight: '800' as '800',
        lineHeight: 48,
        letterSpacing: -1,
    },
    header: {
        fontSize: 28,
        fontWeight: '700' as '700',
        lineHeight: 34,
        letterSpacing: -0.5,
    },
    subheader: {
        fontSize: 20,
        fontWeight: '600' as '600',
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as '400',
        lineHeight: 24,
    },
    button: {
        fontSize: 18,
        fontWeight: '700' as '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase' as 'uppercase',
    },
    caption: {
        fontSize: 12,
        fontWeight: '500' as '500',
        color: palette.textMuted,
    }
};

export const theme = {
    colors: {
        ...palette,
    },
    spacing,
    typography,
    borderRadius: {
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    shadows: {
        default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
        },
        soft: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
        },
        glow: {
            shadowColor: palette.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 10,
        }
    },
};

export type Theme = typeof theme;
