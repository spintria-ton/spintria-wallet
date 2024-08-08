import { InfoOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/joy';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FixedApyPicker } from './fixed-apy-picker';
import { ModalEarnForm } from './modal-earn-form';
import { ModalStakeForm } from './modal-stake-form';
import { ModalTopUpForm } from './modal-topup-form';
import { DEFAULT_DECIMAL_PLACES, NOW } from '/src/constants';
import { usePrimaryWallet, useStakingWallet } from '/src/hooks';
import { fromUnits } from '/src/state/staking/units';

export const FixedApyCard = () => {
  const { t } = useTranslation();
  const { data, wallet, state, isAdmin } = useStakingWallet();
  const { jettonData } = usePrimaryWallet();
  const [openStakeForm, setOpenStakeForm] = useState(false);
  const [openEarnForm, setOpenEarnForm] = useState(false);
  const [openTopUp, setOpenTopUp] = useState(false);
  const tickerComponent = (
    <Typography textColor="neutral.400" fontSize="67.5%">
      {data?.jetton?.content?.symbol}
    </Typography>
  );

  const totalValueLockedProgress = useMemo(() => {
    if (!data || !data?.staking) return 0;
    const totalSupply = Number(data?.jetton?.totalSupply || 0n);
    const maxTotal = Number(data?.staking?.max_total || 0n);

    return Math.ceil(totalSupply / (maxTotal / 100));
  }, [data]);

  const estEarning = useMemo(() => {
    if (!data?.wallet.balance || !data?.staking?.fixed_apy || !data.wallet.stakeAt) return 0;
    const decimals = data.jetton?.content
      ? Number(data.jetton.content.decimals)
      : DEFAULT_DECIMAL_PLACES;
    const day = 86400n;
    const diff = BigInt(NOW() - data.wallet.stakeAt);
    const lockupTs = day * BigInt(data?.staking.lockup);
    const timePassed = lockupTs > diff ? 0n : diff;

    return fromUnits(
      ((data.wallet.balance * data.staking.fixed_apy) / 100n / (365n * day)) * timePassed,
      decimals,
    );
  }, [data]);

  return (
    <>
      <Card variant="plain" sx={{ width: '100%' }}>
        <CardContent sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography level="title-lg" mb={2}>
            {t('staking.card.title')}{' '}
            <Tooltip title={t('staking.form.apy-info')} variant="solid">
              <Typography
                endDecorator={<InfoOutlined color="secondary" sx={{ width: 18, height: 18 }} />}
              >
                {t('staking.form.apy')}
              </Typography>
            </Tooltip>
          </Typography>
          <FixedApyPicker />
        </CardContent>
        <Divider sx={{ my: 2 }} />
        <CardContent sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography level="title-lg" mb={2}>
            {t('staking.card.params')}
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Typography textColor="text.tertiary">{t('staking.form.staking-lockup')}</Typography>
            <Typography textColor="text.tertiary">
              {data?.staking?.lockup.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Typography textColor="text.tertiary">{t('staking.form.min-stake')}</Typography>
            <Typography textColor="text.tertiary">{data?.friendly.minStake}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Typography textColor="text.tertiary">{t('staking.form.max-stake')}</Typography>
            <Typography textColor="text.tertiary">{data?.friendly.maxStake}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Typography textColor="text.tertiary">{t('staking.form.max-total')}</Typography>
            <Typography textColor="text.tertiary">{data?.friendly.maxTotal}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Tooltip
              title={
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: 256,
                    justifyContent: 'center',
                    // p: 1,
                  }}
                >
                  {t('staking.card.tvl-info')}
                </Box>
              }
              variant="solid"
            >
              <Typography
                endDecorator={<InfoOutlined color="secondary" sx={{ width: 18, height: 18 }} />}
                textColor="text.tertiary"
              >
                {t('staking.card.tvl')}
              </Typography>
            </Tooltip>
            <Typography textColor="text.tertiary">{data?.friendly.totalSupply}</Typography>
          </Stack>
          <LinearProgress determinate value={totalValueLockedProgress} sx={{ my: 2 }} />
        </CardContent>
        <Divider sx={{ my: 2 }} />
        <CardContent sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography level="inherit">{t('staking.card.you-deposited')}</Typography>
          <Typography fontSize="xl4" fontWeight="xl" mt={1}>
            {state === 'loading' ? '...' : data?.friendly.balance} {tickerComponent}
          </Typography>
          <Button
            variant="soft"
            size="lg"
            fullWidth
            sx={{ borderRadius: 6, my: 2, py: 2, mb: 1 }}
            onClick={() => setOpenStakeForm(true)}
          >
            {t('staking.card.button-stake')}
          </Button>
        </CardContent>
        <Divider sx={{ my: 2 }} />
        <CardContent sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography level="body-lg">{t('staking.card.available-for-claim')}</Typography>
          <Typography fontSize="xl4" fontWeight="xl" mt={1}>
            {state === 'loading' ? '...' : data?.friendly.balance} {tickerComponent}
          </Typography>
          {data?.staking ? (
            <Typography level="inherit">
              {t('staking.card.you-have-earned')}: ~ {estEarning.toLocaleString()}{' '}
              {data?.jetton?.content?.symbol}
            </Typography>
          ) : null}
          <Button
            disabled={!wallet || !data?.wallet.balance}
            variant="soft"
            size="lg"
            fullWidth
            sx={{ borderRadius: 6, py: 2, mt: 1 }}
            onClick={() => setOpenEarnForm(true)}
          >
            {t('staking.card.button-claim')}
          </Button>
        </CardContent>
      </Card>
      {isAdmin && (
        <Card variant="plain" sx={{ width: '100%', my: 3 }}>
          <Typography level="title-lg">Extra</Typography>
          <Typography>Ton balance: {data?.balance?.toLocaleString()}</Typography>
          <Typography endDecorator={data?.jetton?.content?.symbol}>
            Reward pool: {data?.friendly.rewardPool}
          </Typography>
          <CardActions buttonFlex="1">
            <Button variant="soft" color="primary" onClick={() => setOpenTopUp(true)}>
              TopUp
            </Button>
          </CardActions>
        </Card>
      )}
      <ModalStakeForm
        open={openStakeForm}
        setOpen={setOpenStakeForm}
        staking={data}
        primaryJetton={jettonData}
      />
      <ModalEarnForm open={openEarnForm} setOpen={setOpenEarnForm} data={data} />
      <ModalTopUpForm open={openTopUp} setOpen={setOpenTopUp} />
    </>
  );
};
