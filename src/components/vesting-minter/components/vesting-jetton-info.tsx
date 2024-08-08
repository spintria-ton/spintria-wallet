import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/joy';
import { fromNano } from '@ton/core';
import { useTranslation } from 'react-i18next';
import { useVestingWallet } from '/src/hooks';

export const VestingJettonInfo = () => {
  const { t } = useTranslation();
  const { friendlyVesting, wallet, vestingJetton } = useVestingWallet();
  if (!friendlyVesting) return;

  const { jetton } = friendlyVesting;

  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        boxShadow: 'none',
        border: 0,
        // borderRadius: { xs: 0, md: '10px' },
        // border: 'none',
        // backgroundColor: { xs: '#8882' },
      }}
    >
      <CardContent>
        <Grid container spacing={2} columns={2} sx={{ flexGrow: 1 }}>
          <Grid xs={2} sm={1}>
            <Typography level="body-xs">{t('jetton.name')}</Typography>
            <Typography level="h2">{jetton.content?.name}</Typography>
          </Grid>
          <Grid xs={2} sm={1}>
            <Typography level="body-xs">
              {t('jetton.totalSupply')} ({jetton.content?.decimals} {t('jetton.decimals')})
            </Typography>
            <Typography level="h2">
              {jetton.totalSupply.toString()}{' '}
              <Typography fontSize="md" textColor="text.tertiary">
                {jetton.content?.symbol}
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider orientation="horizontal" inset="none" />
      <CardActions>
        <FormControl sx={{ width: '100%' }}>
          {wallet ? (
            <>
              <Typography level="body-xs">{t('jetton.vesting-balance')}</Typography>
              <Typography level="h2">
                {vestingJetton && vestingJetton.balance
                  ? fromNano(vestingJetton.balance).toString()
                  : t('jetton.no-wallet')}{' '}
                {vestingJetton && vestingJetton.balance ? (
                  <Typography fontSize="md" textColor="text.tertiary">
                    {friendlyVesting.jetton.content?.symbol}
                  </Typography>
                ) : null}
              </Typography>
            </>
          ) : (
            <Typography level="body-sm" sx={{ maxWidth: { xs: 'auto', md: '40vw' } }}>
              {t('jetton.wallet-connect-info')}
            </Typography>
          )}
          <FormHelperText
            sx={{
              p: 0,
              // color: (t) =>
              //   isVestingOwner ? t.vars.palette.neutral : t.vars.palette.danger.plainColor,
            }}
          >
            {/* {vesting
              ? isVestingOwner
                ? null
                : `Вы не можете вывести жетоны на свой кошелек, так как не являетесь владельцем
                вестинг-контракта`
              : null} */}
          </FormHelperText>
          <Button
            // loading={sendingTxs}
            disabled={
              !wallet || !vestingJetton || !vestingJetton.balance
              //   !isVestingOwner ||
              //   !vesting ||
              //   !friendlyVesting ||
              //   friendlyVesting.isFinished ||
              //   friendlyVesting?.toWithdraw === 0n ||
              //   friendlyVesting?.totalLocked === 0n
            }
            variant="solid"
            size="lg"
            sx={{ borderRadius: 6, py: 2 }}
            // onClick={withdrawJettons}
          >
            Вывод на кошелек
          </Button>
        </FormControl>
      </CardActions>
    </Card>
  );
};
