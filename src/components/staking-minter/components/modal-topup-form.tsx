import { Check } from '@mui/icons-material';
import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalDialog,
  Stack,
} from '@mui/joy';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useTopUpContract } from '/src/hooks';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export const ModalTopUpForm = ({ open, setOpen }: Props) => {
  const { t } = useTranslation();
  const { amount, closeForm, setAmount, sendingTx, sendTopUpAction } = useTopUpContract();

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={(theme) => ({
          [theme.breakpoints.only('xs')]: {
            top: 'unset',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            transform: 'none',
            maxWidth: 'unset',
          },
        })}
      >
        <DialogTitle>{t('staking.form.topup')}</DialogTitle>
        <DialogContent>{t('staking.form.topup-description')}</DialogContent>
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <Stack spacing={2}>
            <FormControl size="lg">
              <FormLabel sx={{ width: '100%' }}>{t('staking.form.amount')}</FormLabel>
              <Input
                disabled={closeForm || sendingTx}
                autoFocus
                required
                endDecorator={'TON'}
                value={amount}
                onChange={(e) => setAmount(e.currentTarget.value)}
              />
            </FormControl>
            {closeForm ? (
              <IconButton color="success" onClick={() => setOpen(false)}>
                <Check />
              </IconButton>
            ) : (
              <Button
                size="lg"
                type="submit"
                loading={sendingTx}
                disabled={closeForm || !amount || !Number(amount)}
                onClick={() => sendTopUpAction()}
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
