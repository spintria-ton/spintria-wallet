import { Avatar, Box, Grid, Stack, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { FixedApyCard } from './fixed-apy-card';

export const StakingBody = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="main"
      sx={{
        my: 'auto',
        py: 2,
        pb: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: '75%',
        maxWidth: '100%',
        mx: { md: 'auto' },
        borderRadius: 'sm',
        '& form': {
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        },
        [`& .MuiFormLabel-asterisk`]: {
          visibility: 'hidden',
        },
      }}
    >
      {/* <StakingContractPicker /> */}
      <Grid container spacing={2} columns={2} sx={{ flexGrow: 1 }}>
        <Stack
          py={5}
          px={2}
          width="100%"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography level="h2">{t('staking.title2')}</Typography>
            <Typography level="body-lg">{t('staking.subtitle3')}</Typography>
          </Box>
          <Avatar size="lg" src="/spintria-ton.webp" />
        </Stack>
        <FixedApyCard />
      </Grid>
    </Box>
  );
};
