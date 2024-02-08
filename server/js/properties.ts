import { Types } from "../../shared/js/gametypes";

var Properties: any = {
  rat: {
    drops: {
      flask: 40,
      firefoxpotion: 5,
      scrollupgradelow: 20,
      ringbronze: 5,
      gold: 25,
    },
    hp: 20,
    armor: 0.5,
    weapon: 0.5,
  },
  crab: {
    drops: {
      flask: 20,
      axe: 10,
      shieldwood: 5,
      leatherarmor: 10,
      firefoxpotion: 5,
      scrollupgradelow: 20,
      ringbronze: 5,
      beltleather: 10,
      gold: 15,
    },
    hp: 60,
    armor: 2,
    weapon: 1,
  },
  bat: {
    drops: {
      flask: 25,
      axe: 15,
      firefoxpotion: 5,
      scrollupgradelow: 20,
      ringbronze: 5,
      beltleather: 5,
      shieldwood: 10,
      gold: 15,
    },
    hp: 80,
    armor: 2,
    weapon: 1,
  },
  goblin: {
    drops: {
      flask: 20,
      axe: 10,
      firefoxpotion: 5,
      scrollupgradelow: 10,
      scrollupgrademedium: 15,
      ringbronze: 5,
      beltleather: 5,
      shieldiron: 5,
      gold: 15,
    },
    hp: 100,
    armor: 2,
    weapon: 1,
  },
  wizard: {
    drops: {
      flask: 100,
    },
    hp: 100,
    armor: 2,
    weapon: 6,
  },
  skeleton: {
    drops: {
      flask: 10,
      mailarmor: 10,
      helmmail: 10,
      axe: 15,
      firefoxpotion: 5,
      scrollupgrademedium: 20,
      ringbronze: 5,
      shieldiron: 5,
      gold: 15,
    },
    hp: 125,
    armor: 2,
    weapon: 2,
  },
  ogre: {
    drops: {
      flask: 25,
      helmplate: 10,
      platearmor: 10,
      firefoxpotion: 5,
      scrollupgrademedium: 20,
      ringbronze: 5,
      ringsilver: 2,
      shieldplate: 5,
      gold: 15,
    },
    hp: 270,
    armor: 3,
    weapon: 3,
  },
  snake: {
    drops: {
      flask: 30,
      mailarmor: 10,
      helmmail: 10,
      firefoxpotion: 5,
      scrollupgrademedium: 20,
      ringsilver: 2,
      shieldiron: 5,
      gold: 13,
    },
    hp: 175,
    armor: 3,
    weapon: 3,
  },
  skeleton2: {
    drops: {
      flask: 25,
      platearmor: 10,
      bluesword: 10,
      firefoxpotion: 5,
      scrollupgrademedium: 20,
      ringsilver: 2,
      shieldplate: 5,
      gold: 12,
    },
    hp: 240,
    armor: 3,
    weapon: 3,
  },
  eye: {
    drops: {
      flask: 25,
      helmred: 12,
      redarmor: 12,
      firefoxpotion: 5,
      scrollupgrademedium: 20,
      ringsilver: 4,
      beltplated: 3,
      amuletsilver: 2,
      shieldred: 5,
      gold: 12,
    },
    hp: 260,
    armor: 4,
    weapon: 3,
  },
  spectre: {
    drops: {
      flask: 25,
      redsword: 15,
      firefoxpotion: 5,
      scrollupgrademedium: 20,
      ringsilver: 4,
      beltplated: 3,
      amuletsilver: 2,
      shieldred: 5,
      gold: 12,
    },
    hp: 270,
    armor: 2,
    weapon: 4,
  },
  deathknight: {
    drops: {
      burger: 40,
      ringsilver: 5,
      beltplated: 5,
      amuletsilver: 2,
      scrollupgrademedium: 20,
      shieldred: 5,
      gold: 12,
    },
    hp: 325,
    armor: 4,
    weapon: 5,
  },
  boss: {
    drops: {
      goldensword: 35,
      helmgolden: 35,
      skeletonkingcage: 30,
    },
    hp: 1400,
    armor: 6,
    // hp: 15000,
    // armor: 6000,
    weapon: 7,
  },
  rat2: {
    drops: {
      rejuvenationpotion: 60,
      bluearmor: 5,
      scrollupgradehigh: 4,
      shieldblue: 3,
      helmblue: 5,
      gold: 10,
    },
    hp: 280,
    armor: 7,
    weapon: 5,
  },
  bat2: {
    drops: {
      rejuvenationpotion: 50,
      blueaxe: 5,
      helmblue: 5,
      beltfrozen: 3,
      scrollupgradehigh: 4,
      shieldblue: 3,
      gold: 10,
    },
    hp: 300,
    armor: 6,
    weapon: 6,
  },
  goblin2: {
    drops: {
      rejuvenationpotion: 50,
      blueaxe: 5,
      helmblue: 5,
      beltfrozen: 5,
      scrollupgradehigh: 4,
      amuletgold: 1,
      shieldblue: 3,
      gold: 10,
    },
    hp: 280,
    armor: 5,
    weapon: 6,
  },
  werewolf: {
    drops: {
      rejuvenationpotion: 60,
      scrollupgradehigh: 6,
      bluearmor: 3,
      bluemorningstar: 3,
      beltfrozen: 3,
      helmblue: 5,
      ringgold: 2,
      amuletgold: 1,
      shieldblue: 3,
      gold: 10,
    },
    hp: 375,
    armor: 6,
    weapon: 7,
  },
  yeti: {
    drops: {
      rejuvenationpotion: 65,
      bluearmor: 3,
      helmblue: 5,
      bluemorningstar: 3,
      scrollupgradehigh: 6,
      ringgold: 3,
      shieldhorned: 2,
      gold: 10,
    },
    hp: 420,
    armor: 8,
    weapon: 8,
  },
  skeleton3: {
    drops: {
      rejuvenationpotion: 65,
      scrollupgradehigh: 5,
      hornedarmor: 3,
      belthorned: 1,
      helmhorned: 3,
      ringgold: 2,
      amuletgold: 1,
      shieldhorned: 2,
      gold: 10,
    },
    hp: 440,
    armor: 8,
    weapon: 9,
  },
  skeletoncommander: {
    drops: {
      scrollupgradehigh: 6,
      belthorned: 3,
      helmhorned: 3,
      hornedarmor: 5,
      ringgold: 4,
      amuletgold: 3,
      shieldhorned: 3,
    },
    hp: 3000,
    armor: 11,
    weapon: 12,
  },
  snake2: {
    drops: {
      rejuvenationpotion: 60,
      beltfrozen: 3,
      belthorned: 3,
      scrollupgradehigh: 4,
      ringgold: 3,
      amuletgold: 2,
      shieldhorned: 2,
      shieldfrozen: 2,
      helmfrozen: 2,
      gold: 10,
    },
    hp: 460,
    armor: 8,
    weapon: 10,
  },
  wraith: {
    drops: {
      rejuvenationpotion: 60,
      beltfrozen: 3,
      belthorned: 1,
      shieldhorned: 1,
      shieldfrozen: 2,
      helmfrozen: 2,
      scrollupgradehigh: 5,
      ringgold: 3,
      amuletgold: 2,
      gold: 10,
    },
    hp: 600,
    armor: 9,
    weapon: 11,
  },
  zombie: {
    drops: {
      rejuvenationpotion: 60,
      scrollupgradehigh: 4,
      ringgold: 2,
      amuletgold: 2,
      shieldfrozen: 1,
      helmfrozen: 1,
      gold: 10,
    },
    hp: 350,
    armor: 6,
    weapon: 11,
  },
  necromancer: {
    drops: {
      necromancerheart: 40,
      scrollupgradehigh: 5,
      ringgold: 4,
      amuletgold: 4,
      shieldfrozen: 4,
      helmfrozen: 4,
      ringnecromancer: 1,
    },
    hp: 3500,
    armor: 12,
    weapon: 13,
  },
  cow: {
    drops: {
      rejuvenationpotion: 40,
      helmhorned: 1,
      hornedarmor: 1,
      helmfrozen: 1,
      frozenarmor: 1,
      frozensword: 1,
      beltfrozen: 1,
      belthorned: 1,
      shieldhorned: 1,
      shieldfrozen: 1,
      ringgold: 1,
      amuletgold: 1,
      scrollupgradehigh: 2,
      gold: 10,
    },
    hp: 600,
    armor: 15,
    weapon: 19,
  },
  cowking: {
    drops: {
      helmdiamond: 8,
      diamondsword: 8,
      diamondarmor: 8,
      beltdiamond: 8,
      shielddiamond: 8,
      amuletcow: 5,
      scrolltransmute: 5,
      cowkinghorn: 20,
      scrollupgradehigh: 20,
      scrollupgradelegendary: 10,
    },
    hp: 7000,
    armor: 21,
    weapon: 24,
  },
  minotaur: {
    drops: {
      ringminotaur: 5,
      scrolltransmute: 5,
      minotauraxe: 10,
      beltminotaur: 10,
      scrollupgradelegendary: 70,
    },
    hp: 15000,
    armor: 27,
    weapon: 32,
  },
  rat3: {
    drops: {
      powdergreen: 5,
      rejuvenationpotion: 25,
      poisonpotion: 25,
      scrollupgradelegendary: 2,
      amuletplatinum: 2,
      ringplatinum: 2,
      helmemerald: 2,
      emeraldsword: 2,
      emeraldarmor: 2,
      beltemerald: 2,
      shieldemerald: 2,
      gold: 10,
    },
    hp: 700,
    armor: 15,
    weapon: 14,
  },
  oculothorax: {
    drops: {
      rejuvenationpotion: 30,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      helmexecutioner: 1,
      executionersword: 1,
      executionerarmor: 1,
      beltexecutioner: 1,
      shieldexecutioner: 1,
      helmemerald: 1,
      emeraldsword: 1,
      emeraldarmor: 1,
      beltemerald: 1,
      shieldemerald: 1,
      gold: 12,
    },
    hp: 1200,
    armor: 22,
    weapon: 23,
  },
  kobold: {
    drops: {
      rejuvenationpotion: 30,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      executionersword: 2,
      executionerarmor: 2,
      beltexecutioner: 2,
      helmexecutioner: 2,
      shieldexecutioner: 2,
      gold: 12,
    },
    hp: 1350,
    armor: 24,
    weapon: 26,
  },
  golem: {
    drops: {
      rejuvenationpotion: 30,
      scrollupgradelegendary: 4,
      ringplatinum: 3,
      amuletplatinum: 3,
      executionersword: 1,
      executionerarmor: 1,
      beltexecutioner: 1,
      helmexecutioner: 1,
      shieldexecutioner: 1,
      helmemerald: 1,
      emeraldsword: 1,
      emeraldarmor: 1,
      beltemerald: 1,
      shieldemerald: 1,
      gold: 15,
    },
    hp: 1700,
    armor: 24,
    weapon: 23,
  },
  snake3: {
    drops: {
      rejuvenationpotion: 20,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      executionersword: 2,
      executionerarmor: 2,
      beltexecutioner: 2,
      helmexecutioner: 2,
      shieldexecutioner: 2,
      gold: 10,
    },
    hp: 1100,
    armor: 20,
    weapon: 25,
  },
  snake4: {
    drops: {
      rejuvenationpotion: 20,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      executionersword: 1,
      executionerarmor: 1,
      beltexecutioner: 1,
      helmexecutioner: 1,
      shieldexecutioner: 1,
      helmdragon: 1,
      dragonsword: 1,
      dragonarmor: 1,
      shielddragon: 1,
      gold: 10,
    },
    hp: 1100,
    armor: 20,
    weapon: 25,
  },
  skeleton4: {
    drops: {
      rejuvenationpotion: 25,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      templarsword: 2,
      templararmor: 2,
      belttemplar: 2,
      shieldtemplar: 2,
      helmtemplar: 2,
      gold: 10,
    },
    hp: 1250,
    armor: 22,
    weapon: 24,
  },
  ghost: {
    drops: {
      rejuvenationpotion: 15,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      dragonsword: 2,
      helmdragon: 2,
      dragonarmor: 2,
      shielddragon: 2,
      gold: 12,
    },
    hp: 1450,
    armor: 23,
    weapon: 26,
  },
  skeletonberserker: {
    drops: {
      rejuvenationpotion: 25,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      templarsword: 2,
      helmtemplar: 2,
      templararmor: 2,
      belttemplar: 2,
      shieldtemplar: 2,
      gold: 12,
    },
    hp: 1400,
    armor: 22,
    weapon: 26,
  },
  skeletontemplar: {
    drops: {
      powderblack: 100,
    },
    hp: 5000,
    armor: 28,
    weapon: 26,
  },
  skeletontemplar2: {
    drops: {
      powderblue: 100,
    },
    hp: 5000,
    armor: 28,
    weapon: 26,
  },
  spider: {
    drops: {
      rejuvenationpotion: 20,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      poisonpotion: 10,
      helmdragon: 2,
      dragonsword: 2,
      dragonarmor: 2,
      shielddragon: 2,
      gold: 12,
    },
    hp: 1550,
    armor: 23,
    weapon: 24,
  },
  spider2: {
    drops: {
      rejuvenationpotion: 20,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      poisonpotion: 10,
      dragonsword: 2,
      helmdragon: 2,
      dragonarmor: 2,
      shielddragon: 2,
      gold: 12,
    },
    hp: 1600,
    armor: 24,
    weapon: 24,
  },
  spiderqueen: {
    drops: {
      scrollupgradelegendary: 8,
      ringplatinum: 5,
      amuletplatinum: 5,
      poisonpotion: 33,
      dragonsword: 5,
      helmdragon: 5,
      dragonarmor: 5,
      shielddragon: 5,
    },
    hp: 10_000,
    armor: 31,
    weapon: 26,
  },
  skeletonarcher: {
    drops: {
      rejuvenationpotion: 20,
      scrollupgradelegendary: 3,
      ringplatinum: 3,
      amuletplatinum: 3,
      gold: 12,
    },
    hp: 1300,
    armor: 19,
    weapon: 28,
  },
  butcher: {
    drops: {
      soulstone: 100,
      // ringbloodband: 1,
    },
    hp: 15_000,
    armor: 36,
    weapon: 34,
  },
  wraith2: {
    drops: {
      rejuvenationpotion: 20,
      scrollupgradelegendary: 3,
      ringplatinum: 3,
      amuletplatinum: 3,
      moonsword: 3,
      moonhachet: 3,
      moonmaul: 3,
      helmmoon: 3,
      moonarmor: 3,
      beltmoon: 3,
      shieldmoon: 3,
      gold: 12,
    },
    hp: 1800,
    armor: 27,
    weapon: 26,
  },
  mage: {
    drops: {
      rejuvenationpotion: 15,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      moonsword: 3,
      moonhachet: 3,
      moonmaul: 3,
      helmmoon: 3,
      moonarmor: 3,
      beltmoon: 3,
      shieldmoon: 3,
      gold: 12,
    },
    hp: 1400,
    armor: 22,
    weapon: 26,
  },
  templeMob: {
    drops: {
      rejuvenationpotion: 15,
      scrollupgradelegendary: 3,
      mysticalsword: 2,
      mysticaldagger: 2,
      helmmystical: 2,
      mysticalarmor: 2,
      beltmystical: 2,
      shieldmystical: 2,
      gold: 12,
    },
  },
  shaman: {
    drops: {
      scrollupgradelegendary: 50,
      ringplatinum: 3,
      amuletplatinum: 3,
      moonsword: 5,
      moonhachet: 5,
      moonmaul: 5,
      helmmooon: 5,
      moonarmor: 5,
      beltmoon: 5,
      shieldmoon: 5,
      ringwizard: 1,
      ringmystical: 1,
    },
    hp: 15_000,
    armor: 31,
    weapon: 30,
  },
  worm: {
    drops: {
      powdergold: 100,
    },
    hp: 17_500,
    armor: 33,
    weapon: 32,
  },
  skeletonscythe1: {
    drops: {
      rejuvenationpotion: 15,
      scrollupgradelegendary: 3,
      mysticalsword: 2,
      mysticaldagger: 2,
      helmmystical: 2,
      mysticalarmor: 2,
      beltmystical: 2,
      shieldmystical: 2,
    },
    hp: 3500,
    armor: 26,
    weapon: 28,
  },
  skeletonaxe1: {
    drops: {
      rejuvenationpotion: 15,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      gold: 10,
    },
    hp: 3500,
    armor: 26,
    weapon: 28,
  },
  skeletonaxe2: {
    drops: {
      rejuvenationpotion: 15,
      scrollupgradelegendary: 3,
      ringplatinum: 2,
      amuletplatinum: 2,
      gold: 10,
    },
    hp: 3500,
    armor: 26,
    weapon: 28,
  },
  deathbringer: {
    drops: {
      scrollupgradelegendary: 38,
    },
    hp: 100,
    armor: 36,
    weapon: 1,
  },
  deathangel: {
    drops: {
      mushrooms: 20,
      scrollupgradelegendary: 38,
      scrollupgradesacred: 2,
      mysticalsword: 5,
      mysticaldagger: 5,
      helmmystical: 5,
      mysticalarmor: 5,
      beltmystical: 5,
      shieldmystical: 5,
      ringmystical: 2,
      ringbadomen: 1,
    },
    hp: 32_500,
    armor: 36,
    weapon: 31,
  },
};

Properties.getHelmLevel = function (kind) {
  try {
    return Types.getHelmRank(kind) + 1;
  } catch (err) {
    console.error("No level found for armor: " + Types.getKindAsString(kind));
    console.error("Error stack: " + err.stack);
  }
};

Properties.getArmorLevel = function (kind) {
  try {
    if (Types.isMob(kind)) {
      return Properties[Types.getKindAsString(kind)].armor;
    } else {
      return Types.getArmorRank(kind) + 1;
    }
  } catch (err) {
    console.error("No level found for armor: " + Types.getKindAsString(kind));
    console.error("Error stack: " + err.stack);
  }
};

Properties.getWeaponLevel = function (kind) {
  try {
    if (Types.isMob(kind)) {
      return Properties[Types.getKindAsString(kind)].weapon;
    } else {
      return Types.getWeaponRank(kind) + 1;
    }
  } catch (err) {
    console.error("No level found for weapon: " + Types.getKindAsString(kind));
    console.error("Error stack: " + err.stack);
  }
};

Properties.getHitPoints = function (kind) {
  return Properties[Types.getKindAsString(kind)].hp;
};
Properties.getExp = function (kind) {
  return Properties[Types.getKindAsString(kind)].exp;
};

export default Properties;
