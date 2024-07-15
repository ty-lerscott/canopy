import plugin from "tailwindcss/plugin";

const HeaderStyles = (
    theme,
    extension = {}
) => ({
    letterSpacing: "0.05em",
    fontWeight: theme("fontWeight.medium"),
    ...extension
});

const DEFAULT_SCREEN_SIZE = "1024px";

const SCREENS = {
  xs: "480px",
  sm: "768px",
  md: DEFAULT_SCREEN_SIZE,
  DEFAULT: DEFAULT_SCREEN_SIZE,
};

const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
      theme: {
  screens: SCREENS,
      fontSize: {
    "2xs": "0.625rem",
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
  },
  extend: {
    container: {
      center: true,
          padding: "2rem",
          screens: {
        xs: "100vw",
            sm: "640px",
            md: "768px",
            lg: "1024px",
      },
    },
  },
},
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        "*": {
          lineHeight: "1",
        },
        body: {
          display: "grid",
          gridTemplateRows: "auto auto 1fr auto",
          minHeight: theme("minHeight.screen"),
        },
        h1: HeaderStyles(theme, {
            fontSize: theme("fontSize.3xl"),
        }),
        h2: HeaderStyles(theme, {
            fontSize: theme("fontSize.2xl"),
        }),
        h3: HeaderStyles(theme, {
          fontSize: theme("fontSize.xl"),
        }),
        h4: HeaderStyles(theme, {
          fontSize: theme("fontSize.lg"),
        }),
        h5: HeaderStyles(theme),
        h6: HeaderStyles(theme, {
          fontSize: theme("fontSize.sm"),
        }),
        p: {
          lineHeight: theme("lineHeight.normal"),
        },
        small: {
          fontSize: theme("fontSize.sm"),
        },
      });
    }),
  ],
}

/** @type {import('tailwindcss').Config} */
export default config