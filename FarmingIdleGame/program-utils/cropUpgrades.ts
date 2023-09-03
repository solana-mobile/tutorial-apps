import {ImageSourcePropType} from 'react-native';

import {FarmAccount} from '../program-utils/farmingProgram';

export interface UpgradeType {
  name: string;
  description: string;
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
    name: 'Tomato Garden',
    description:
      'These little 8-bit scallywags will help you click your coin at 1 Coin per Second!',
    image: require('../assets/tomatoes.png'),
    upgradeIndex: 0,
    baseCost: 15,
    coinPerUpgrade: 1,
  },
  {
    name: 'Corn Field',
    description:
      'Watch out! These Fractals will click your coin at 3 Coins per Second!',
    image: require('../assets/corns.png'),

    upgradeIndex: 1,
    baseCost: 100,
    coinPerUpgrade: 3,
  },
  // {
  //   name: 'Pesky Penguins',
  //   description:
  //     "NOOT NOOT - These cute little guys are gonna NOOT your coin so hard it'll get you +8 CpS",
  //   image:
  //     'https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/pesky.png',

  //   upgradeIndex: 2,
  //   baseCost: 1100,
  //   coinPerUpgrade: 8,
  // },
  // {
  //   name: 'Shadowy Super Coder',
  //   description:
  //     "Don't ask how they're netting you +47 CpS... They won't even tell me!",
  //   image:
  //     'https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/ssc.png',

  //   upgradeIndex: 3,
  //   baseCost: 12_000,
  //   coinPerUpgrade: 47,
  // },
  // {
  //   name: 'NEC',
  //   description:
  //     "These robots from Portals are great at automating! You'll get +260 CpS",
  //   image:
  //     'https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/nec.png',

  //   upgradeIndex: 4,
  //   baseCost: 130_000,
  //   coinPerUpgrade: 260,
  // },
  // {
  //   name: 'Claynos',
  //   description:
  //     'RAWR! Look at these cutties! All full of clay and adorable! Each adorable dino gives you +1400 CpS',
  //   image:
  //     'https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/claynos.png',

  //   upgradeIndex: 5,
  //   baseCost: 1_400_000,
  //   coinPerUpgrade: 1400,
  // },
  // {
  //   name: 'Dronies',
  //   description:
  //     "I'm starting to suspect these birds aren't real... And they seem to be... Always Watching... Anyways +7800 CpS",
  //   image:
  //     'https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/dronies.png',

  //   upgradeIndex: 6,
  //   baseCost: 20_000_000,
  //   coinPerUpgrade: 7800,
  // },
  // {
  //   name: 'Coach',
  //   description:
  //     "IT'S ME, COACH! I'll use my almighty power to give you +44000 CpS for each purchase!",
  //   image:
  //     'https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/coach.png',

  //   upgradeIndex: 7,
  //   baseCost: 330_000_000,
  //   coinPerUpgrade: 44_000,
  // },
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
