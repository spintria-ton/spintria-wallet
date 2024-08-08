import { Close, OpenInNew } from '@mui/icons-material';
import { Button, FormControl, FormHelperText, FormLabel, IconButton, Link, Stack } from '@mui/joy';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useRecoilValueLoadable } from 'recoil';
import { StyledInput } from '../../styled-input';
import { BodyTitle } from './body-title';
import { MAINNET_SPINTRIA_MASTER_ADDRESS } from '/src/constants';
import { vestingDataSelector } from '/src/state';
import { RouteParams } from '/src/types';
import { isValidAddress } from '/src/utils';

export const SearchForm = () => {
  const navigate = useNavigate();
  const { address } = useParams<RouteParams>();
  const { t } = useTranslation();
  const [inputAddress, setInputAddress] = useState(address);
  const isAddress = useMemo(() => isValidAddress(inputAddress), [inputAddress]);
  const { state, contents } = useRecoilValueLoadable(vestingDataSelector(address));

  useEffect(() => setInputAddress(address), [address]);

  return (
    <>
      <BodyTitle />
      <Stack gap={4} sx={{ mt: 2 }}>
        <form onSubmit={(e: FormEvent) => e.preventDefault()}>
          <FormControl
            required
            error={(!!inputAddress && !isAddress) || (isAddress && state === 'hasError')}
          >
            <FormLabel sx={{ px: 0 }}>{t('vesting.enter-address')}</FormLabel>
            <StyledInput
              size="lg"
              type="text"
              disabled={state === 'hasValue' && contents !== undefined}
              placeholder={t('vesting.address')}
              value={inputAddress || ''}
              onChange={(e) => setInputAddress(e.target.value)}
              endDecorator={
                address &&
                state !== 'hasValue' && (
                  <IconButton
                    size="sm"
                    variant="plain"
                    onClick={() => navigate(import.meta.env.BASE_URL)}
                  >
                    <Close />
                  </IconButton>
                )
              }
              // sx={{ mx: { xs: -2, md: 0 } }}
            />
            {isAddress && state === 'hasError' ? (
              <FormHelperText sx={{ px: 0, color: (t) => t.vars.palette.danger.plainColor }}>
                {t('vesting.incorrect-contract')}
              </FormHelperText>
            ) : address ? (
              <FormHelperText sx={{ px: 0, color: (t) => t.vars.palette.danger.plainColor }}>
                {t('vesting.do-not-transfer')}{' '}
                <Link
                  fontSize="inherit"
                  underline="none"
                  href={`https://tonviewer.com/${MAINNET_SPINTRIA_MASTER_ADDRESS}`}
                  target="_blank"
                  sx={{ display: 'contents' }}
                  endDecorator={<OpenInNew sx={{ fontSize: 'inherit' }} />}
                >
                  Spintria (SP)
                </Link>
              </FormHelperText>
            ) : (
              <FormHelperText sx={{ px: 0 }}>
                {!!inputAddress && !isAddress ? t('vesting.incorrect-address') : <>&nbsp;</>}
              </FormHelperText>
            )}
          </FormControl>
          {(!address || state !== 'hasValue') && (
            <FormControl sx={{ px: 0 }}>
              <Button
                type="submit"
                size="lg"
                variant="solid"
                color="primary"
                fullWidth
                loading={state === 'loading'}
                disabled={!isAddress}
                onClick={() =>
                  inputAddress && navigate(`${import.meta.env.BASE_URL}vesting/${inputAddress}`)
                }
              >
                {t('vesting.search')}
              </Button>
            </FormControl>
          )}
        </form>
      </Stack>
    </>
  );
};
