import { atom, useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { Call } from '@/types';

type Config = {
  selected: Call['id'] | null;
};

const configAtom = atom<Config>({
  selected: null // Initially no call is selected
});

export function useCall() {
  const [call, setCall] = useState<Call | null>(null);
  const [config, setConfig] = useAtom(configAtom);

  useEffect(() => {
    fetch('/api/calls')
      .then((response) => response.json())
      .then((data: Call[]) => {
        if (data.length > 0) {
          setCall(data[0]); // Set the first call as the default selected call
          setConfig({ selected: data[0].id });
        }
      });
  }, [setConfig]);

  return [call, setCall];
}
