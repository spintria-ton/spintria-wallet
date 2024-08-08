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
import { DEFAULT_DECIMAL_PLACES } from '/src/constants';
import { useProvideStake } from '/src/hooks';
import { JettonDataAtom } from '/src/state';
import { FriendlyStaking } from '/src/state/staking';
import { fromUnits, toUnits } from '/src/state/staking/units';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  staking?: FriendlyStaking;
  primaryJetton?: JettonDataAtom;
};

export const ModalStakeForm = ({ open, setOpen, staking, primaryJetton }: Props) => {
  const { t } = useTranslation();
  const { amount, closeForm, setAmount, sendingTx, sendProvideStakeAction } = useProvideStake();
  const decimals = useMemo(
    () =>
      primaryJetton?.content ? Number(primaryJetton.content.decimals) : DEFAULT_DECIMAL_PLACES,
    [primaryJetton],
  );
  const primaryBalance = useMemo(
    () => Number(fromUnits(primaryJetton?.balance || 0n, decimals)),
    [primaryJetton],
  );

  const estEarning = useMemo(() => {
    if (!staking || !staking?.staking?.fixed_apy) return;
    const bigV = toUnits(amount, decimals);
    return fromUnits(
      ((bigV * staking?.staking?.fixed_apy) / 100n / 365n) * BigInt(staking?.staking?.lockup || 30),
      decimals,
    );
  }, [amount, staking]);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={(theme) => ({
          [theme.breakpoints.only('xs')]: {
            top: 0,
            bottom: 'unset',
            left: 0,
            right: 0,
            borderRadius: 0,
            transform: 'none',
            maxWidth: 'unset',
          },
        })}
      >
        <DialogTitle>{t('staking.form.title')}</DialogTitle>
        <DialogContent>{t('staking.form.description')}</DialogContent>
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
                      {t('staking.form.balance')}:{' '}
                      {(primaryBalance - Number(amount)).toLocaleString()}
                    </Typography>
                    <Button
                      variant="soft"
                      sx={{ py: 0.1, px: 1, minHeight: 25 }}
                      onClick={() => setAmount(primaryBalance.toString())}
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
                  !primaryBalance ||
                  primaryBalance === 0 ||
                  !staking ||
                  !staking.staking ||
                  (primaryJetton?.balance || 0n) < staking.staking.min_stake
                }
                autoFocus
                required
                endDecorator={primaryJetton?.content?.symbol}
                value={amount}
                onChange={(e) => {
                  const value = Number(e.currentTarget.value).toFixed();
                  const bigV = toUnits(value, decimals);
                  const realBalance = primaryJetton?.balance || 0n;
                  setAmount(bigV > realBalance ? primaryBalance.toString() : value);
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
                  <Typography>{staking?.staking?.fixed_apy.toLocaleString()}%</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                  <Typography>{t('staking.form.est-earning')}</Typography>
                  <Typography>{Number(estEarning || 0).toLocaleString()}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                  <Typography>{t('staking.form.min-stake')}</Typography>
                  <Typography>{staking?.friendly.minStake}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                  <Typography>{t('staking.form.max-stake')}</Typography>
                  <Typography>{staking?.friendly.maxStake}</Typography>
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
                  !staking ||
                  !staking.staking ||
                  !primaryBalance ||
                  primaryBalance === 0 ||
                  !amount ||
                  !Number(amount) ||
                  toUnits(amount, decimals) < staking.staking.min_stake ||
                  toUnits(amount, decimals) > staking.staking?.max_stake
                }
                onClick={() => sendProvideStakeAction()}
              >
                {t('staking.form.button-stake')}
              </Button>
            )}
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};
