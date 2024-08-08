import { Box, GlobalStyles } from '@mui/joy';
import { MainFooter } from '../main-footer';
import { MainHeader } from '../main-header';
import { VestingBody } from './components/vesting-body';

export const VestingMinter = () => (
  <>
    <GlobalStyles
      styles={{
        ':root': {
          '--Form-maxWidth': '800px',
          '--Transition-duration': '0.4s', // set to `none` to disable transition
        },
      }}
    />
    <Box
      sx={{
        backgroundColor: '#88888822',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        width: '100%',
        px: 2,
      }}
    >
      <MainHeader />
      <VestingBody />
      <MainFooter />
    </Box>
  </>
);
