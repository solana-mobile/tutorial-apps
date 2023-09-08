import {ImageSourcePropType} from 'react-native';

import {FarmAccount} from '../program-utils/farmingProgram';

export interface UpgradeType {
  name: string;
  image: ImageSourcePropType;

  upgradeIndex: number;
  baseCost: number;
  coinPerUpgrade: number;
}

// export const UPGRADES: UpgradeType[] = [
//   {
//     imageUri:
//       'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/af/Apple_JE3_BE3.png/revision/latest?cb=20200519232834',
//     description: 'Apple',
//     baseCost: 15,
//     coinPerUpgrade: 1,
//   },
//   {
//     imageUri:
//       'https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/75/Wheat_JE2_BE2.png/revision/latest?cb=20190521034232',
//     description: 'Wheat',
//     baseCost: 10,
//     amount: 1,
//   },
//   {
//     imageUri:
//       'https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/3a/Sugar_Cane_%28item%29_JE3_BE3.png/revision/latest?cb=20210317220330',
//     description: 'Sugar Cane',
//     baseCost: 10,
//     amount: 1,
//   },
// ];

export const UPGRADES: UpgradeType[] = [
  {
    name: 'Cabbage Patch',
    image: require('../assets/cabbages2.png'),
    upgradeIndex: 0,
    baseCost: 15,
    coinPerUpgrade: 1,
  },
  {
    name: 'Tomato Garden',
    image: require('../assets/tomatoes.png'),
    upgradeIndex: 1,
    baseCost: 100,
    coinPerUpgrade: 3,
  },
  {
    name: 'Strawberry Patch',
    image: require('../assets/strawberries.png'),
    upgradeIndex: 2,
    baseCost: 1100,
    coinPerUpgrade: 8,
  },
  {
    name: 'Corn Field',
    image: require('../assets/corns.png'),
    upgradeIndex: 3,
    baseCost: 12_000,
    coinPerUpgrade: 47,
  },
  {
    name: 'Apple Orchard',
    image: require('../assets/apples.png'),
    upgradeIndex: 4,
    baseCost: 130_000,
    coinPerUpgrade: 260,
  },
  {
    name: 'Exotic Fruit Farm',
    image: require('../assets/exoticfruits.png'),
    upgradeIndex: 5,
    baseCost: 1_400_000,
    coinPerUpgrade: 1400,
  },
  {
    name: 'Mushroom Cavern Groves',
    image: require('../assets/mushroomgrove.png'),
    upgradeIndex: 6,
    baseCost: 20_000_000,
    coinPerUpgrade: 7800,
  },
  {
    name: 'Golden Grains Greenhouse',
    image: require('../assets/greenhouse3.png'),
    upgradeIndex: 7,
    baseCost: 330_000_000,
    coinPerUpgrade: 44_000,
  },
];

export function getNextCost(baseCost: number, owned: number) {
  return Math.round(baseCost * 1.15 ** owned);
}

export function getCpS(farmAccount: FarmAccount) {
  let cps = 0;

  farmAccount.farmUpgrades.forEach((owned, i) => {
    if (i < UPGRADES.length) {
      cps += owned * UPGRADES[i].coinPerUpgrade;
    }
  });

  return cps;
}

export function formatNumber(number: number) {
  console.log(number);
  if (number >= 1000000000000000) {
    return (number / 1000000000000000).toFixed(1).replace(/\.0$/, '') + 'q';
  }
  if (number >= 1000000000000) {
    return (number / 1000000000000).toFixed(1).replace(/\.0$/, '') + 't';
  }
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return number.toFixed(0).toString();
}
