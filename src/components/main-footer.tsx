import { Box, Stack, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import ColorSchemeToggle from './color-scheme-toggle';
import { LanguagePicker } from './language-picker';

export const MainFooter = () => {
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        pb: 5,
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        minWidth: '75%',
        maxWidth: '100%',
        mx: { md: 'auto' },
        justifyContent: 'space-between',
      }}
    >
      <Typography level="body-xs" textAlign="center">
        © {t('footer-company')} {new Date().getFullYear()}
      </Typography>
      <Stack gap={2} direction="row" alignItems="center" justifyContent="flex-end">
        <ColorSchemeToggle />
        <LanguagePicker />
      </Stack>
    </Box>
  );
};
