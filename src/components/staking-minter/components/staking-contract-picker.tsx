import { FormControl, FormHelperText, FormLabel, Option, Select, Stack } from '@mui/joy';
import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { BodyTitle } from './body-title';
import { RouteParams } from '/src/types';

export const StakingContractPicker = () => {
  const navigate = useNavigate();
  const { address } = useParams<RouteParams>();
  const { t } = useTranslation();

  return (
    <>
      <BodyTitle />
      <Stack gap={4} sx={{ mt: 2 }}>
        <FormControl>
          <FormLabel sx={{ px: 0 }}>{t('staking.pick-contract')}</FormLabel>
          <Select
            sx={{ py: 2 }}
            size="lg"
            placeholder="..."
            defaultValue={address}
            onChange={(event: SyntheticEvent | null, newValue: string | null) =>
              navigate(`${import.meta.env.BASE_URL}staking/${newValue}`)
            }
          >
            <Option value="EQA74IEvdxIyKh5mVIqJ0UibPhH2Qif7j-FqPe6OxpNvKmk1">
              Staking period 180 days, APY 18% (stSP18)
            </Option>
            <Option value="EQA74IEvdxIyKh5mVIqJ0UibPhH2Qif7j-FqPe6OxpNvKmk2">
              Staking period 120 days, APY 15% (stSP15)
            </Option>
            <Option value="EQA74IEvdxIyKh5mVIqJ0UibPhH2Qif7j-FqPe6OxpNvKmke">
              Staking period 90 days, APY 12% (stSP12)
            </Option>
            <Option value="kQB-5h9K7I1VugI9C0uWmIMbVzVwRt7YvqmZ7-uoj8l1rdNI">
              Staking period 60 days, APY 9% (stSP9)
            </Option>
            <Option value="kQB-5h9K7I1VugI9C0uWmIMbVzVwRt7YvqmZ7-uoj8l1rdNI">
              Staking period 30 days, APY 6% (stSP6)
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
