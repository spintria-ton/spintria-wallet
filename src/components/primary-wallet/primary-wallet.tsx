import { Box, GlobalStyles, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { MainFooter } from '../main-footer';
import { MainHeader } from '../main-header';
import { PrimaryJettonInfo } from './components/primary-jetton-info';
import { StakingCard } from './components/staking-card';
import { VestingCard } from './components/vesting-card';

export const PrimaryWallet = () => {
  const { t } = useTranslation();

  return (
    <>
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s', // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={{
          backgroundColor: '#88888822',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          width: '100%',
          px: 2,
          justifyContent: 'space-between',
        }}
      >
        <MainHeader />
        <Box
          sx={{
            py: 2,
            pb: 5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            minWidth: '75%',
            maxWidth: '100%',
            mx: { md: 'auto' },
          }}
        >
          <PrimaryJettonInfo />
          <Typography level="body-lg" px={2} pt={2}>
            {t('wallet.staking')}
          </Typography>
          <StakingCard />
          <Typography level="body-lg" px={2} pt={2}>
            {t('wallet.vesting')}
          </Typography>
          <VestingCard />
        </Box>
        <MainFooter />
      </Box>
    </>
  );
};
