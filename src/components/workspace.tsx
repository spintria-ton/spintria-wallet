import { CssBaseline, CssVarsProvider, extendTheme } from '@mui/joy';
import { Outlet } from 'react-router';

const palette = {
  primary: {
    solidBg: '#015aff',
    solidHoverBg: '#217aff',
    solidActiveBg: '#116aff',
    // solidBorder: '#0d6efd',
    // solidHoverBorder: '#0a58ca',
    // solidActiveBorder: '#0a53be',
    // solidDisabledBg: '#0d6efd',
    // solidDisabledBorder: '#0d6efd',
  },
};

const theme = extendTheme({
  zIndex: { modal: 950 },
  colorSchemes: {
    light: { palette },
    dark: { palette },
  },
});

export const Workspace = () => {
  return (
    <CssVarsProvider
      theme={theme}
      defaultMode="light"
      modeStorageKey={'spintria-wallet-theme-mode'}
      disableTransitionOnChange
    >
      <CssBaseline />
      <Outlet />
    </CssVarsProvider>
  );
};
