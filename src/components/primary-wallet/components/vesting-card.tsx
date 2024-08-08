import { Avatar, Box, Button, Card, CardContent, Link, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { InvestmentIcon } from './investment-icon';
import { tonconnectWalletAddressAtom } from '/src/state';

export const VestingCard = () => {
  const { t } = useTranslation();
  const wallet = useRecoilValue(tonconnectWalletAddressAtom);
  const navigate = useNavigate();

  return (
    <Card
      color={wallet ? 'primary' : 'neutral'}
      variant="outlined"
      orientation="horizontal"
      sx={{
        border: 'none',
        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
      }}
    >
      <Avatar
        size="lg"
        sx={{ bgcolor: 'transparent' }}
        // src="/staking/spintria-18.png"
        // sx={{ bgcolor: blue[50] }}
        // color="primary"
        // variant="solid"
      >
        {/* <LockClock /> */}
        <InvestmentIcon />
        {/* SJ */}
      </Avatar>
      <CardContent
        orientation="horizontal"
        sx={{ alignItems: 'center', gap: 1, justifyContent: 'space-between' }}
      >
        <Box>
          <Typography level="title-lg" noWrap>
            {t('wallet.vesting')} <Typography color="neutral">{t('wallet.jetton')}</Typography>
          </Typography>
          <Typography level="title-md">
            <Link
              disabled={!wallet}
              onClick={() => navigate('vesting')}
              overlay
              underline="none"
              sx={{ color: 'text.tertiary' }}
            >
              {t('wallet.check-vesting')}
            </Link>
          </Typography>
        </Box>
        <Button
          disabled={!wallet}
          onClick={() => navigate('vesting')}
          color="primary"
          sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '1em', borderRadius: '1.3em' }}
        >
          {t('wallet.open')}
        </Button>
      </CardContent>
    </Card>
  );
};
