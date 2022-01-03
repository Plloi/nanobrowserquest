var Types = require("../../shared/js/gametypes");

var Properties = {
  rat: {
    drops: {
      flask: 45,
      firepotion: 5,
      scrollupgradelow: 20,
      ringbronze: 5,
    },
    hp: 20,
    armor: 0.5,
    weapon: 0.5,
  },

  crab: {
    drops: {
      flask: 30,
      axe: 15,
      leatherarmor: 10,
      firepotion: 5,
      scrollupgradelow: 15,
      ringbronze: 5,
      beltleather: 10,
    },
    hp: 60,
    armor: 2,
    weapon: 1,
  },

  bat: {
    drops: {
      flask: 40,
      axe: 15,
      firepotion: 5,
      scrollupgradelow: 15,
      ringbronze: 5,
      beltleather: 10,
    },
    hp: 80,
    armor: 2,
    weapon: 1,
  },

  goblin: {
    drops: {
      flask: 30,
      leatherarmor: 15,
      axe: 10,
      firepotion: 5,
      scrollupgradelow: 15,
      scrollupgrademedium: 10,
      ringbronze: 5,
      beltleather: 10,
    },
    hp: 90,
    armor: 2,
    weapon: 1,
  },

  wizard: {
    drops: {
      flask: 50,
      platearmor: 20,
      firepotion: 5,
    },
    hp: 100,
    armor: 2,
    weapon: 6,
  },

  skeleton: {
    drops: {
      flask: 35,
      mailarmor: 10,
      axe: 15,
      firepotion: 5,
      scrollupgradelow: 10,
      scrollupgrademedium: 5,
      ringbronze: 5,
      beltleather: 10,
    },
    hp: 115,
    armor: 2,
    weapon: 2,
  },

  ogre: {
    drops: {
      burger: 10,
      flask: 30,
      platearmor: 15,
      firepotion: 5,
      scrollupgrademedium: 13,
      ringbronze: 5,
      ringsilver: 2,
      beltleather: 15,
    },
    hp: 250,
    armor: 3,
    weapon: 3,
  },

  snake: {
    drops: {
      flask: 35,
      mailarmor: 10,
      morningstar: 10,
      firepotion: 5,
      scrollupgradelow: 5,
      scrollupgrademedium: 13,
      ringbronze: 5,
      ringsilver: 2,
      beltleather: 10,
    },
    hp: 165,
    armor: 3,
    weapon: 3,
  },

  skeleton2: {
    drops: {
      flask: 40,
      platearmor: 10,
      bluesword: 10,
      firepotion: 5,
      scrollupgradelow: 5,
      scrollupgrademedium: 13,
      ringbronze: 5,
      ringsilver: 2,
    },
    hp: 220,
    armor: 3,
    weapon: 3,
  },

  eye: {
    drops: {
      flask: 45,
      redarmor: 15,
      firepotion: 5,
      scrollupgrademedium: 13,
      ringsilver: 4,
      beltplated: 3,
      amuletsilver: 2,
    },
    hp: 240,
    armor: 4,
    weapon: 3,
  },

  spectre: {
    drops: {
      flask: 45,
      redsword: 15,
      firepotion: 5,
      scrollupgrademedium: 13,
      ringsilver: 4,
      beltplated: 3,
      amuletsilver: 2,
    },
    hp: 250,
    armor: 2,
    weapon: 4,
  },

  deathknight: {
    drops: {
      burger: 80,
      ringsilver: 5,
      beltplated: 5,
      amuletsilver: 2,
    },
    hp: 275,
    armor: 4,
    weapon: 5,
  },

  boss: {
    drops: {
      goldensword: 100,
    },
    hp: 1200,
    armor: 6,
    weapon: 7,
  },

  rat2: {
    drops: {
      rejuvenationpotion: 80,
      bluearmor: 5,
      ringsilver: 3,
      scrollupgradehigh: 2,
      amuletgold: 1,
    },
    hp: 240,
    armor: 7,
    weapon: 5,
  },

  bat2: {
    drops: {
      rejuvenationpotion: 70,
      blueaxe: 5,
      beltfrozen: 3,
      bluearmor: 3,
      scrollupgradehigh: 3,
      amuletgold: 1,
    },
    hp: 280,
    armor: 6,
    weapon: 6,
  },

  goblin2: {
    drops: {
      rejuvenationpotion: 80,
      blueaxe: 5,
      beltfrozen: 3,
      scrollupgradehigh: 3,
      amuletgold: 1,
    },
    hp: 235,
    armor: 5,
    weapon: 6,
  },

  werewolf: {
    drops: {
      rejuvenationpotion: 65,
      scrollupgradehigh: 3,
      bluearmor: 6,
      bluemorningstar: 5,
      beltfrozen: 3,
      ringgold: 2,
      amuletgold: 2,
    },
    hp: 375,
    armor: 6,
    weapon: 7,
  },

  yeti: {
    drops: {
      rejuvenationpotion: 75,
      bluearmor: 5,
      bluemorningstar: 5,
      scrollupgradehigh: 3,
      ringgold: 2,
      amuletgold: 2,
    },
    hp: 450,
    armor: 7,
    weapon: 8,
  },

  skeleton3: {
    drops: {
      rejuvenationpotion: 88,
      scrollupgradehigh: 3,
      hornedarmor: 5,
      ringgold: 2,
      amuletgold: 2,
    },
    hp: 420,
    armor: 8,
    weapon: 9,
  },

  skeletonleader: {
    drops: {
      scrollupgradehigh: 4,
      hornedarmor: 5,
      ringgold: 4,
      amuletgold: 4,
    },
    hp: 2500,
    armor: 12,
    weapon: 12,
  },

  snake2: {
    drops: {
      rejuvenationpotion: 80,
      beltfrozen: 3,
      scrollupgradehigh: 3,
      ringgold: 3,
      amuletgold: 2,
    },
    hp: 420,
    armor: 7,
    weapon: 10,
  },

  wraith: {
    drops: {
      rejuvenationpotion: 60,
      beltfrozen: 3,
      scrollupgradehigh: 4,
      ringgold: 3,
      amuletgold: 2,
    },
    hp: 575,
    armor: 7,
    weapon: 9,
  },

  zombie: {
    drops: {
      rejuvenationpotion: 65,
      scrollupgradehigh: 2,
      ringgold: 2,
      amuletgold: 2,
    },
    hp: 265,
    armor: 6,
    weapon: 10,
  },

  necromancer: {
    drops: {
      scrollupgradehigh: 5,
      ringgold: 5,
      amuletgold: 5,
    },
    hp: 3250,
    armor: 14,
    weapon: 10,
  },
};

Properties.getArmorLevel = function (kind) {
  try {
    if (Types.isMob(kind)) {
      return Properties[Types.getKindAsString(kind)].armor;
    } else {
      return Types.getArmorRank(kind) + 1;
    }
  } catch (err) {
    log.error("No level found for armor: " + Types.getKindAsString(kind));
    log.error("Error stack: " + err.stack);
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
    log.error("No level found for weapon: " + Types.getKindAsString(kind));
    log.error("Error stack: " + err.stack);
  }
};

Properties.getHitPoints = function (kind) {
  return Properties[Types.getKindAsString(kind)].hp;
};
Properties.getExp = function (kind) {
  return Properties[Types.getKindAsString(kind)].exp;
};

module.exports = Properties;
