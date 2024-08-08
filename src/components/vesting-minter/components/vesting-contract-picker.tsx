import { FormControl, FormHelperText, FormLabel, Option, Select, Stack } from '@mui/joy';
import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { BodyTitle } from './body-title';
import { RouteParams } from '/src/types';

export const VestingContractPicker = () => {
  const navigate = useNavigate();
  const { address } = useParams<RouteParams>();
  const { t } = useTranslation();

  return (
    <>
      <BodyTitle />
      <Stack gap={4} sx={{ mt: 2 }}>
        <FormControl>
          <FormLabel sx={{ px: 0 }}>{t('vesting.pick-contract')}</FormLabel>
          <Select
            sx={{ py: 2 }}
            size="lg"
            placeholder="..."
            defaultValue={address}
            onChange={(event: SyntheticEvent | null, newValue: string | null) =>
              navigate(`${import.meta.env.BASE_URL}vesting/${newValue}`)
            }
          >
            <Option value="EQA1-TVYYDwakj6sA2x1xoyB_eOaYKa0WXy0gZ25E5mfmkpJ">
              Vesting pre-sale phase
            </Option>
            <Option value="kQB-5h9K7I1VugI9C0uWmIMbVzVwRt7YvqmZ7-uoj8l1rdNI">
              Vesting developers-sale
            </Option>
          </Select>
          {!address ? (
            <FormHelperText sx={{ px: 0, color: (t) => t.vars.palette.danger.plainColor }}>
              {t('staking.incorrect-contract')}
            </FormHelperText>
          ) : (
            <FormHelperText sx={{ px: 0, color: (t) => t.vars.palette.danger.plainColor }}>
              {t('staking.do-not-transfer')}
            </FormHelperText>
          )}
        </FormControl>
      </Stack>
    </>
  );
};
