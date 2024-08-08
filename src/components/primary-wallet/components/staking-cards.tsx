import { Avatar, Box, Card, CardContent, Link, Stack, Typography } from '@mui/joy';

const list = [
  { period: 180, fixedApy: '18', ticker: 'stSP18' },
  { period: 120, fixedApy: '15', ticker: 'stSP15' },
  { period: 90, fixedApy: '12', ticker: 'stSP12' },
  { period: 60, fixedApy: '9', ticker: 'stSP9' },
  { period: 30, fixedApy: '6', ticker: 'stSP6' },
];

export const StakingCards = () => (
  <>
    {list.map((m) => (
      <Card
        key={`staking-card-${m.ticker}`}
        variant="outlined"
        orientation="horizontal"
        sx={{
          py: 1,
          border: 'none',
          '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
        }}
      >
        <CardContent
          orientation="horizontal"
          sx={{ alignItems: 'center', gap: 1, justifyContent: 'space-between' }}
        >
          <Stack direction="row" gap={2}>
            <Avatar
              size="lg"
              alt="Staking Jetton"
              src={`${import.meta.env.BASE_URL}spintria-orig.png`}
            >
              {m.fixedApy}
            </Avatar>
            <Box>
              <Typography level="title-lg">Jetton {m.ticker}</Typography>
              <Typography level="body-md">
                <Link overlay underline="none" href={`staking`} sx={{ color: 'text.tertiary' }}>
                  Get up to {m.fixedApy}% APY on SP
                </Link>
              </Typography>
            </Box>
          </Stack>
          <Stack direction="column" textAlign="end">
            <Typography level="h4" sx={{}}>
              {m.fixedApy}% APY
            </Typography>
            <Typography sx={{ color: 'text.tertiary' }}>{m.period} days</Typography>
          </Stack>
        </CardContent>
      </Card>
    ))}
  </>
);
