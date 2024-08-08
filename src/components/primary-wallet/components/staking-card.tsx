import { Avatar, Box, Button, Card, CardContent, Link, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { EarnIcon } from './earn-icon';
import { tonconnectWalletAddressAtom } from '/src/state';

export const StakingCard = ({}) => {
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
      <Avatar size="lg" sx={{ bgcolor: 'transparent' }}>
        <EarnIcon />
      </Avatar>
      <CardContent
        orientation="horizontal"
        sx={{ alignItems: 'center', gap: 1, justifyContent: 'space-between' }}
      >
        <Box>
          <Typography level="title-lg">{t('wallet.get-apy')}</Typography>
          <Typography level="title-md">
            <Link
              disabled={!wallet}
              onClick={() => navigate('staking')}
              overlay
              underline="none"
              sx={{ color: 'text.tertiary' }}
            >
              {t('wallet.with-spintria')}
            </Link>
          </Typography>
        </Box>
        <Button
          disabled={!wallet}
          onClick={() => navigate('staking')}
          color="primary"
          sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '1em', borderRadius: '1.3em' }}
        >
          {t('wallet.open')}
        </Button>
      </CardContent>
    </Card>
  );
};
