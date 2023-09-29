import {useEffect, useState} from 'react';

import {FarmAccount} from '../utils/programUtils';
import {getCpS} from '../utils/utils';

type Props = Readonly<{
  farmAccount: FarmAccount;
}>;

export default function useAvailableHarvest({farmAccount}: Props) {
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 100);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const elapsedSeconds = farmAccount
    ? currentTime - farmAccount.lastHarvested.toNumber()
    : 0;

  const availableHarvest = farmAccount
    ? Math.floor(elapsedSeconds * getCpS(farmAccount))
    : 0;

  return {
    elapsedSeconds,
    availableHarvest,
  };
}
