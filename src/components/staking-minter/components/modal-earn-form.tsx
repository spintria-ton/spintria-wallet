import { Check, InfoOutlined } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Tooltip,
  Typography,
} from '@mui/joy';
import { FormEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_DECIMAL_PLACES, NOW } from '/src/constants';
import { useWithdrawStake } from '/src/hooks';
import { FriendlyStaking } from '/src/state/staking';
import { fromUnits, toUnits } from '/src/state/staking/units';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  data?: FriendlyStaking;
};

export const ModalEarnForm = ({ open, setOpen, data }: Props) => {
  const { t } = useTranslation();
  const {
    amount,
    closeForm,
    setAmount,
    sendingTx,
    sendWithdraw: sendProvideStakeAction,
  } = useWithdrawStake(data);
  const decimals = useMemo(
    () =>
      data?.jetton?.content?.decimals
        ? Number(data.jetton.content.decimals)
        : DEFAULT_DECIMAL_PLACES,
    [data],
  );
  const stakeBalance = useMemo(
    () => Number(fromUnits(data?.wallet.balance || 0n, decimals)),
    [data],
  );

  const estEarning = useMemo(() => {
    if (!data?.wallet.balance || !data?.staking?.fixed_apy || !data.wallet.stakeAt) return 0;
    const day = 86400n;
    const diff = BigInt(NOW() - data.wallet.stakeAt);
    const lockupTs = day * BigInt(data?.staking.lockup);
    const timePassed = lockupTs > diff ? 0n : diff;
    const amountUnits = toUnits(amount, decimals);

    return fromUnits(
      ((amountUnits * data.staking.fixed_apy) / 100n / (365n * day)) * timePassed,
      decimals,
    );
  }, [data, amount]);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={(theme) => ({
          [theme.breakpoints.only('xs')]: {
            top: 'unset',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            transform: 'none',
            maxWidth: 'unset',
          },
        })}
      >
        <DialogTitle>{t('staking.form.title-earn')}</DialogTitle>
        <DialogContent>{t('staking.form.earn-description')}</DialogContent>
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <Stack spacing={2}>
            <FormControl size="lg">
              <FormLabel sx={{ width: '100%' }}>
                <Stack
                  width="100%"
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                >
                  <Typography>{t('staking.form.amount')}</Typography>
                  <Stack direction="row" gap={1}>
                    <Typography textColor="neutral.400">
                      {t('staking.form.stake')}: {(stakeBalance - Number(amount)).toLocaleString()}
                    </Typography>
                    <Button
                      variant="soft"
                      sx={{ py: 0.1, px: 1, minHeight: 25 }}
                      onClick={() => setAmount(stakeBalance.toString())}
                    >
                      {t('staking.form.button-max')}
                    </Button>
                  </Stack>
                </Stack>
              </FormLabel>
              <Input
                disabled={
                  closeForm ||
                  sendingTx ||
                  !stakeBalance ||
                  stakeBalance === 0 ||
                  !data ||
                  !data.staking
                }
                autoFocus
                required
                endDecorator={data?.jetton.content?.symbol}
                value={amount}
                onChange={(e) => {
                  const value = Number(e.currentTarget.value).toFixed();
                  const bigV = toUnits(value, decimals);
                  const realBalance = data?.wallet.balance || 0n;
                  setAmount(bigV > realBalance ? stakeBalance.toString() : value);
                }}
              />
            </FormControl>
            <Card variant="soft" sx={{ width: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                  <Tooltip title={t('staking.form.apy-info')} variant="solid">
                    <Typography
                      endDecorator={
                        <InfoOutlined color="secondary" sx={{ width: 18, height: 18 }} />
                      }
                    >
                      {t('staking.form.apy')}
                    </Typography>
                  </Tooltip>
                  <Typography>{data?.staking?.fixed_apy.toLocaleString()}%</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                  <Typography>{t('staking.form.est-earning')}</Typography>
                  <Typography>{(estEarning || 0).toLocaleString()}</Typography>
                </Stack>
              </CardContent>
            </Card>
            <FormHelperText sx={{ p: 0 }}>{t('staking.form.helper')}</FormHelperText>
            {closeForm ? (
              <IconButton color="success" onClick={() => setOpen(false)}>
                <Check />
              </IconButton>
            ) : (
              <Button
                size="lg"
                type="submit"
                loading={sendingTx}
                disabled={
                  closeForm ||
                  !data ||
                  !data.staking ||
                  !stakeBalance ||
                  stakeBalance === 0 ||
                  !amount ||
                  !Number(amount)
                }
                onClick={() => sendProvideStakeAction()}
              >
                {t('staking.form.button-withdraw')}
              </Button>
            )}
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};
