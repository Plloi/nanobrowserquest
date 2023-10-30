import { Types } from "./gametypes";

export const StoreItems = [
    {
      id: Types.Store.EXPANSION1,
      icon: "expansion1",
      name: "Freezing Lands Expansion",
      description: "Continue the adventure, waypoints will be unlocked.",
      confirmedMessage: `The Freezing Lands Expansion has been unlocked.<br/>
          You can now access the expansion using the waypoint.<br/>
          As a thank you bonus you've also received 10 High class upgrade scrolls`.trim(),
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.EXPANSION2,
      icon: "expansion2",
      name: "Lost Temple Expansion",
      description: "Continue the adventure, waypoints will be unlocked.",
      confirmedMessage: `The Lost Temple Expansion has been unlocked.<br/>
          You can now access the expansion using the waypoint.<br/>
          As a thank you bonus you've also received 10 Legendary class upgrade scrolls`.trim(),
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.SCROLLUPGRADEHIGH,
      icon: "scrollupgradehigh",
      name: "High class upgrade scrolls",
      description: "Pack of 10 scrolls",
      confirmedMessage: "10 High class upgrade scrolls were added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.SCROLLUPGRADEBLESSED,
      icon: "scrollupgradeblessed",
      name: "Blessed High class upgrade scrolls",
      description: "Pack of 5 blessed scrolls giving a higher chance of successful upgrade (4-6%)",
      confirmedMessage: "5 Blessed High class upgrade scrolls were added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.SCROLLUPGRADEMEDIUM,
      icon: "scrollupgrademedium",
      name: "Medium class upgrade scrolls",
      description: "Pack of 10 scrolls",
      confirmedMessage: "10 Medium class upgrade scrolls were added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.CAPE,
      icon: "cape",
      name: "Cape",
      description:
        "A cape adds a random bonus (attack, defense, exp, all resistance or extra gold) when your character is in a party.",
      confirmedMessage: "A cape was added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.SCROLLUPGRADELEGENDARY,
      icon: "scrollupgradelegendary",
      name: "Legendary class upgrade scrolls",
      description: "Pack of 60 scrolls",
      confirmedMessage: "60 Legendary class upgrade scrolls were added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.SCROLLUPGRADESACRED,
      icon: "scrollupgradesacred",
      name: "Sacred Legendary class upgrade scrolls",
      description: "Pack of 10 sacred scrolls giving a higher chance of successful upgrade (4-6%)",
      confirmedMessage: "10 Sacred Legendary class upgrade scrolls were added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.SCROLLTRANSMUTE,
      icon: "scrolltransmute",
      name: "Transmute upgrade scrolls",
      description: "Pack of 10 Transmute scrolls",
      confirmedMessage: "10 Transmute upgrade scrolls were added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.STONESOCKET,
      icon: "stonesocket",
      name: "Socket Stone",
      description: "Pack of 10 Socket Stones",
      confirmedMessage: "10 Socket Stones were added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.STONEDRAGON,
      icon: "stonedragon",
      name: "Dragon Stone",
      description: "1 Dragon Stone",
      confirmedMessage: "1 Dragon Stone was added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.STONEHERO,
      icon: "stonehero",
      name: "Hero Emblem",
      description: "1 Hero Emblem",
      confirmedMessage: "1 Hero Emblem was added to your inventory.",
      requiresInventorySlot: true,
    },
    {
      id: Types.Store.PET,
      icon: "petegg",
      name: "Pet Egg",
      description: "An egg that contains a random pet",
      confirmedMessage: "A pet egg was added to your inventory.",
      requiresInventorySlot: true,
    },
  ];
