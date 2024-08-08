import { useEffect, useState } from 'react';

import { RecoilValue, useRecoilValueLoadable } from 'recoil';

export function useLoadable<T>(recoilValue: RecoilValue<T>) {
  const { contents, state } = useRecoilValueLoadable(recoilValue);
  const [value, setValue] = useState<T>();

  useEffect(() => {
    if (state === 'hasValue') {
      setValue(contents);
    }
  }, [contents, state]);

  return value;
}
