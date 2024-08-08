import { Box, Grid } from '@mui/joy';
import { VestingContractPicker } from './vesting-contract-picker';
import { VestingDataInfo } from './vesting-data-info';
import { VestingJettonInfo } from './vesting-jetton-info';

export const VestingBody = () => (
  <Box
    component="main"
    sx={{
      my: 'auto',
      py: 2,
      pb: 5,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: '75%',
      maxWidth: '100%',
      mx: { md: 'auto' },
      borderRadius: 'sm',
      '& form': {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      },
      [`& .MuiFormLabel-asterisk`]: {
        visibility: 'hidden',
      },
    }}
  >
    <VestingContractPicker />
    <Grid container spacing={2} columns={2} sx={{ flexGrow: 1 }}>
      <Grid xs={2} sm={1}>
        <VestingJettonInfo />
      </Grid>
      <Grid xs={2} sm={1}>
        <VestingDataInfo />
      </Grid>
    </Grid>
  </Box>
);
