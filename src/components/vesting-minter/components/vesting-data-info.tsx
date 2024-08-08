import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/joy';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // import locale
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { START_TIME_FORMAT } from '/src/constants';
import { useVestingWallet } from '/src/hooks/useVestingWallet';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const VestingDataInfo = () => {
  const { t, i18n } = useTranslation();
  const { friendlyVesting, wallet, vestingJetton } = useVestingWallet();

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  if (!friendlyVesting) return;

  return (
    <Box>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          boxShadow: 'none',
          border: 0,
          // width: '100%',
          // borderRadius: 0,
          // border: 'none',
          // backgroundColor: 'transparent',
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography level="h2">
            {dayjs(friendlyVesting.data.startTime * 1000).format(START_TIME_FORMAT)}
          </Typography>
          <Typography level="body-md">{t('vesting.startTime')}</Typography>
          <LinearProgress
            determinate
            value={friendlyVesting ? friendlyVesting.currentPercent : 0}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            px={1}
            pt={1}
          >
            <Typography level="body-md">
              <Typography color="neutral">{t('vesting.nextPeriod')}:</Typography>{' '}
              {friendlyVesting ? (
                friendlyVesting.isFinished ? (
                  t('vesting.contractFinished')
                ) : (
                  dayjs(friendlyVesting.nextPeriod * 1000).format(START_TIME_FORMAT)
                )
              ) : (
                <Skeleton animation="wave" sx={{ opacity: 0.2 }} variant="rectangular">
                  {START_TIME_FORMAT}
                </Skeleton>
              )}
            </Typography>
            <Typography level="title-sm">
              {friendlyVesting && !friendlyVesting.isFinished
                ? `${friendlyVesting.currentPeriod} / ${friendlyVesting.periods}`
                : ''}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Grid
        container
        spacing={{ xs: 1, md: 2 }}
        columns={3}
        sx={{ mt: { xs: 0.5, md: 1 }, flexGrow: 1 }}
      >
        <Grid xs={1}>
          <Card variant="outlined" sx={{ boxShadow: 'none', border: 0 }}>
            <CardContent orientation="vertical" sx={{ textAlign: 'center' }}>
              <Typography level="body-lg" sx={{ mt: 1 }}>
                {t('vesting.totalDuration')}
              </Typography>
              <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
                {dayjs.duration(friendlyVesting.data.totalDuration, 'second').humanize(true)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={1}>
          <Card variant="outlined" sx={{ boxShadow: 'none', border: 0 }}>
            <CardContent orientation="vertical" sx={{ textAlign: 'center' }}>
              <Typography level="body-lg" sx={{ mt: 1 }}>
                {t('vesting.unlockPeriod')}
              </Typography>
              <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
                {dayjs.duration(friendlyVesting.data.unlockPeriod, 'second').humanize()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={1}>
          <Card variant="outlined" sx={{ boxShadow: 'none', border: 0 }}>
            <CardContent orientation="vertical" sx={{ textAlign: 'center' }}>
              <Typography level="body-lg" sx={{ mt: 1 }}>
                {t('vesting.cliffDuration')}
              </Typography>
              <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
                {friendlyVesting.data.cliffDuration > 0
                  ? dayjs.duration(friendlyVesting.data.cliffDuration, 'second').humanize()
                  : t('vesting.cliffDisabled')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
