import { Check } from '@mui/icons-material';
import { Chip, Radio, RadioGroup } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const fixedApyList: Record<string, string> = {
  // mainnet
  '6%': 'UQBjrOWpO8vr-i6-Ymtmv6c8S-ccs8QFMqxd3TvgqQuwL8yZ',
  '9%': 'EQClpg3bjdhrc1PqNQpu0UMWEVKcs-Q4PLU4DGCS-ob13vwn',
  '12%': 'EQCWMtUKO4cSvNPATnkYTf-7gzMKlnhv0T-AC1KAVcGWcH-j',
  '15%': 'EQD3kI4p5jPfgHFqGt_3RcgSItqNEgTXjADvYxKkxCjx-DUF',
  '18%': 'UQBM-Q-VWQWbd12fajH2K8x0dUiSuwgMUK-0xXn4B_azUlb9',
};

const fixedApyKeys = Object.keys(fixedApyList);

export const FixedApyPicker = () => {
  const [apy, setApy] = useState(fixedApyKeys[0]);
  const navigate = useNavigate();
  useEffect(() => navigate(`${import.meta.env.BASE_URL}staking/${fixedApyList[apy]}`), [apy]);

  return (
    <RadioGroup name="fixed-apy" orientation="horizontal" sx={{ flexWrap: 'wrap', gap: 2 }}>
      {fixedApyKeys.map((name) => {
        const checked = apy === name;
        return (
          <Chip
            key={name}
            variant="soft"
            sx={{ px: { sm: 2 }, py: { sm: 0.75 } }}
            color={checked ? 'primary' : 'neutral'}
            startDecorator={checked && <Check sx={{ zIndex: 1, pointerEvents: 'none' }} />}
          >
            <Radio
              variant="outlined"
              color={checked ? 'primary' : 'neutral'}
              disableIcon
              overlay
              label={name}
              value={name}
              checked={checked}
              onChange={(event) => {
                if (event.target.checked) {
                  setApy(name);
                }
              }}
            />
          </Chip>
        );
      })}
    </RadioGroup>
  );
};
