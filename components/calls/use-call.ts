import { atom, useAtom } from 'jotai';

import { Call, calls } from '@/components/calls/data';

type Config = {
  selected: Call['id'] | null;
};

const configAtom = atom<Config>({
  selected: calls[0].id
});

export function useCall() {
  return useAtom(configAtom);
}
