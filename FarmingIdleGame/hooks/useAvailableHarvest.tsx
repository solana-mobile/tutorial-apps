import {useEffect, useState} from 'react';

import {getCpS} from '../program-utils/utils';
import {FarmAccount} from '../program-utils/farmingProgram';

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
  }, []); // Empty array ensures effect is only run on mount and unmount

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
