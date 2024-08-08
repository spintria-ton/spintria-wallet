import { Modal, ModalDialog } from '@mui/joy';
import { StyledCircularProgress } from '.';

export const Loader = ({ open = false }: { open?: boolean }) => (
  <Modal open={open}>
    <ModalDialog
      variant="plain"
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'unset',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <StyledCircularProgress variant="plain" sx={{ color: 'transparent' }} />
    </ModalDialog>
  </Modal>
);
