import { Card, CardContent, Skeleton, Typography } from '@mui/joy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_DECIMAL_PLACES } from '/src/constants';
import { usePrimaryWallet } from '/src/hooks';
import { fromUnits } from '/src/state/staking/units';

export const PrimaryJettonInfo = () => {
  const { t } = useTranslation();
  const { jettonData, state, wallet } = usePrimaryWallet();
  const friendlyBalance = useMemo(
    () =>
      Number(
        jettonData && jettonData.balance && jettonData.content
          ? fromUnits(
              jettonData.balance,
              Number(jettonData.content.decimals || DEFAULT_DECIMAL_PLACES),
            )
          : 0,
      ).toLocaleString(),
    [jettonData],
  );

  return (
    <Card
      variant="plain"
      sx={{
        width: '100%',
        boxShadow: 'none',
        border: 0,
        // borderRadius: { xs: 0, md: '10px' },
        // border: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <CardContent sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        {wallet ? (
          <>
            <Typography level="body-md">{t('jetton.balance')}</Typography>
            {state === 'loading' ? (
              <Typography level="h1" sx={{ fontSize: '275%' }} noWrap>
                <Skeleton>0000000000000 00</Skeleton>
              </Typography>
            ) : (
              <Typography level="h1" sx={{ fontSize: '275%' }} noWrap>
                {jettonData && jettonData.balance ? `${friendlyBalance}` : t('jetton.no-wallet')}{' '}
                {jettonData && jettonData.balance ? (
                  <Typography fontSize="md" textColor="text.tertiary">
                    {jettonData.content?.symbol}
                  </Typography>
                ) : null}
              </Typography>
            )}
          </>
        ) : (
          <Typography level="body-sm" sx={{ maxWidth: { xs: 'auto', md: '40vw' } }}>
            {t('jetton.wallet-connect-info')}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
