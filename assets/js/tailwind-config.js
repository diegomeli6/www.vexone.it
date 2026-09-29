tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '700',
        black: '700',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.02em',
        wider: '0.04em',
        widest: '0.05em',
      },
      lineHeight: {
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
      },
      colors: {
        vexLime:   '#B8FF00',
        vexBlue:   '#0078FF',
        vexDark:   '#0A0A0B',
        vexBg:     '#F4F5F7',
        vexBorder: '#E2E4E9',
        vexText:   '#1A1A1B',
        vexMuted:  '#6B7280',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
      }
    }
  }
};
