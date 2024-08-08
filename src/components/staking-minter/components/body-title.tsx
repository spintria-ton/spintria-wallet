import { OpenInNew } from '@mui/icons-material';
import { Link, Stack, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { MAINNET_SPINTRIA_MASTER_ADDRESS } from '/src/constants';

export const BodyTitle = () => {
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        mb: 2,
        // px: 2,
        // px: { xs: 2, md: 2 },
      }}
    >
      <Stack gap={1}>
        <Typography component="h1" level="h3">
          {t('staking.title')}
        </Typography>
        <Typography level="body-sm">
          {t('staking.subtitle1')}{' '}
          <Link
            underline="none"
            level="title-sm"
            endDecorator={<OpenInNew sx={{ fontSize: 'inherit' }} />}
            href={`https://tonviewer.com/${MAINNET_SPINTRIA_MASTER_ADDRESS}`}
            target="_blank"
          >
            Spintria
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );
};
