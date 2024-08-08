import { Box, Link, Typography } from '@mui/joy';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';
import { SpintriaLogo } from './spintria-logo';

export const MainHeader = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="header"
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
      <Link
        sx={{
          gap: 1,
          display: 'flex',
          alignItems: 'center',
          '&:hover': { textDecoration: 'none' },
        }}
        href={import.meta.env.BASE_URL}
      >
        <SpintriaLogo sx={{ width: 32, height: 32 }} />
        <Typography level="title-lg" sx={{ fontWeight: '400' }}>
          {t('company')}
        </Typography>
      </Link>
      <TonConnectButton className="ton-connect-button" />
    </Box>
  );
};
