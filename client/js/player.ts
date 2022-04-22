import { kinds, Types } from "../../shared/js/gametypes";
import Character from "./character";
import Exceptions from "./exceptions";

interface PartyMember {
  id: number;
  name: string;
}

class Player extends Character {
  spriteName: any;
  name: any;
  account: any;
  nameOffsetY: number;
  armorName: string;
  armorLevel: number;
  armorBonus: null;
  weaponName: string;
  weaponLevel: number;
  weaponBonus: null;
  beltName: null;
  beltLevel: number | null;
  beltBonus: null;
  cape?: string;
  capeLevel?: number;
  capeBonus: null | number[];
  capeHue: number;
  capeSaturate: number;
  capeContrast: number;
  capeBrightness: number;
  inventory: any[];
  stash: any[];
  upgrade: any[];
  gems: any;
  artifact: any;
  expansion1: boolean;
  waypoints: any[];
  skeletonKey: boolean;
  nanoPotions: number;
  damage: string;
  absorb: string;
  ring1Name: null;
  ring1Level: number | null;
  ring1Bonus: null;
  ring2Name: null;
  ring2Level: number | null;
  ring2Bonus: null;
  amuletName: null;
  amuletLevel: number | null;
  amuletBonus: null;
  auras: string[];
  set?: string;
  setBonus: any;
  isLootMoving: boolean;
  isSwitchingWeapon: boolean;
  pvpFlag: boolean;
  invite: any;
  currentArmorSprite: any;
  id: any;
  invincible: any;
  sprite: any;
  switch_callback: any;
  invincible_callback: any;
  invincibleTimeout: any;
  level: any;
  x: number;
  y: number;
  moveUp: boolean;
  moveDown: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  disableKeyboardNpcTalk: boolean;

  partyId?: number;
  partyLeader?: PartyMember;
  partyMembers: PartyMember[];

  constructor(id, name, account, kind) {
    super(id, kind);

    this.type = "player";
    this.name = name;
    this.account = account;
    this.level = 1;

    // Renderer
    this.nameOffsetY = -10;

    // sprites
    this.spriteName = "clotharmor";
    this.armorName = "clotharmor";
    this.armorLevel = 1;
    this.armorBonus = null;
    this.weaponName = "dagger";
    this.weaponLevel = 1;
    this.weaponBonus = null;
    this.beltName = null;
    this.beltLevel = 1;
    this.beltBonus = null;
    this.cape = null;
    this.capeLevel = null;
    this.capeBonus = null;
    this.capeHue = 0;
    this.capeSaturate = 0;
    this.capeContrast = 0;
    this.capeBrightness = 1;
    this.inventory = [];
    this.stash = [];
    this.upgrade = [];
    this.gems = [];
    this.artifact = [];
    this.expansion1 = false;
    this.waypoints = [];
    this.skeletonKey = false;
    this.nanoPotions = 0;
    this.damage = "0";
    this.absorb = "0";
    this.ring1Name = null;
    this.ring1Level = null;
    this.ring1Bonus = null;
    this.ring2Name = null;
    this.ring2Level = null;
    this.ring2Bonus = null;
    this.amuletName = null;
    this.amuletLevel = null;
    this.amuletBonus = null;
    this.auras = [];
    this.set = null;
    this.setBonus = null;

    // modes
    this.isLootMoving = false;
    this.isSwitchingWeapon = true;

    // PVP Flag
    this.pvpFlag = true;
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.disableKeyboardNpcTalk = false;

    this.partyId = null;
    this.partyLeader = null;
    this.partyMembers = null;
  }

  setPartyId(partyId) {
    this.partyId = partyId;
  }

  setPartyLeader(partyLeader) {
    this.partyLeader = partyLeader;
  }

  setPartyMembers(partyMembers) {
    this.partyMembers = partyMembers;
  }

  setCapeHue(hue: number) {
    this.capeHue = hue;
  }

  setCapeSaturate(saturate: number) {
    this.capeSaturate = saturate;
  }

  setCapeContrast(contrast: number) {
    this.capeContrast = contrast;
  }

  setCapeBrightness(brightness: number) {
    this.capeBrightness = brightness;
  }

  loot(item) {
    if (item) {
      if (Types.Entities.Gems.includes(item.kind)) {
        var index = Types.Entities.Gems.indexOf(item.kind);
        if (index > -1 && this.gems[index] !== 0) {
          throw new Exceptions.LootException(`You already collected the ${Types.getGemNameFromKind(item.kind)} gem.`);
        } else {
          this.gems[index] = 1;
        }
      } else if (Types.Entities.Artifact.includes(item.kind)) {
        var index = Types.Entities.Artifact.indexOf(item.kind);
        if (index > -1 && this.artifact[index] !== 0) {
          throw new Exceptions.LootException(
            `You already collected the ${Types.getArtifactNameFromKind(item.kind)} part.`,
          );
        } else {
          this.artifact[index] = 1;
        }
      } else if (item.kind === Types.Entities.SKELETONKEY) {
        if (this.skeletonKey) {
          throw new Exceptions.LootException(`You already have the Skeleton Key.`);
        } else {
          this.skeletonKey = true;
        }
      } else if (item.kind === Types.Entities.NANOPOTION) {
        this.nanoPotions += 1;
      } else if (item.partyId && item.partyId !== this.partyId) {
        // @NOTE Allow item to be looted by others if player is alone in the party?
        throw new Exceptions.LootException("Can't loot item, it belongs to a party.");
      } else if (["armor", "weapon", "belt", "cape", "ring", "amulet"].includes(item.type)) {
        // @NOTE Check for stack-able items with quantity
        if (this.inventory.length >= 24) {
          throw new Exceptions.LootException("Your inventory is full.");
        }
      } else if (Types.isSingle(item.kind)) {
        const { itemKind } = item;
        const isFound = this.inventory
          .concat(this.upgrade)
          .concat(this.stash)
          .some(({ item }) => item === itemKind);

        if (isFound) {
          throw new Exceptions.LootException("You already have this item.");
        }
      }

      console.info("Player " + this.id + " has looted " + item.id);
      if (Types.isArmor(item.kind) && this.invincible) {
        this.stopInvincibility();
      } else if (item.kind === Types.Entities.FIREPOTION) {
        item.onLoot(this);
      }
    }
  }

  /**
   * Returns true if the character is currently walking towards an item in order to loot it.
   */
  isMovingToLoot() {
    return this.isLootMoving;
  }

  getSpriteName() {
    return this.spriteName;
  }

  setSpriteName(name) {
    this.spriteName = name;
  }

  getArmorSprite() {
    if (this.invincible) {
      return this.currentArmorSprite;
    } else {
      return this.sprite;
    }
  }

  getArmorName() {
    var sprite = this.getArmorSprite();
    return sprite.id;
  }

  setArmorName(name) {
    this.armorName = name;
  }

  getArmorLevel() {
    return this.armorLevel;
  }

  setArmorLevel(level) {
    this.armorLevel = parseInt(level);
  }

  getArmorBonus() {
    return this.armorBonus;
  }

  setArmorBonus(bonus) {
    this.armorBonus = bonus;
  }

  getWeaponName() {
    return this.weaponName;
  }

  setWeaponName(name) {
    this.weaponName = name;
  }

  getWeaponLevel() {
    return this.weaponLevel;
  }

  setWeaponLevel(level) {
    this.weaponLevel = parseInt(level);
  }

  getWeaponBonus() {
    return this.weaponBonus;
  }

  setWeaponBonus(bonus) {
    this.weaponBonus = bonus;
  }

  setBelt(rawBelt) {
    if (rawBelt) {
      const [belt, level, bonus] = rawBelt.split(":");

      this.beltName = belt;
      this.beltLevel = parseInt(level);
      this.beltBonus = bonus;
    } else {
      this.beltName = null;
      this.beltLevel = null;
      this.beltBonus = null;
    }
  }

  setCape(rawCape) {
    if (rawCape) {
      const [cape, level, bonus] = rawCape.split(":");

      this.cape = cape;
      this.capeLevel = parseInt(level);
      this.capeBonus = bonus;
    } else {
      this.cape = null;
      this.capeLevel = null;
      this.capeBonus = null;
    }
  }

  setSettings(settings) {
    if (settings.capeHue) {
      this.capeHue = settings.capeHue;
    }
    if (settings.capeSaturate) {
      this.capeSaturate = settings.capeSaturate;
    }
    if (settings.capeContrast) {
      this.capeContrast = settings.capeContrast;
    }
    if (settings.capeBrightness) {
      this.capeBrightness = settings.capeBrightness;
    }
  }

  setRing1(ring) {
    if (ring) {
      const [name, level, bonus] = ring.split(":");

      this.ring1Name = name;
      this.ring1Level = parseInt(level);
      this.ring1Bonus = bonus;
    } else {
      this.ring1Name = null;
      this.ring1Level = null;
      this.ring1Bonus = null;
    }
  }

  setRing2(ring) {
    if (ring) {
      const [name, level, bonus] = ring.split(":");

      this.ring2Name = name;
      this.ring2Level = parseInt(level);
      this.ring2Bonus = bonus;
    } else {
      this.ring2Name = null;
      this.ring2Level = null;
      this.ring2Bonus = null;
    }
  }

  setAmulet(amulet) {
    if (amulet) {
      const [name, level, bonus] = amulet.split(":");

      this.amuletName = name;
      this.amuletLevel = parseInt(level);
      this.amuletBonus = bonus;
    } else {
      this.amuletName = null;
      this.amuletLevel = null;
      this.amuletBonus = null;
    }
  }

  setLevel(level) {
    this.level = level;
  }

  setAuras(auras) {
    this.auras = auras;
  }

  hasWeapon() {
    return this.weaponName !== null;
  }

  switchWeapon(weapon, level: number, bonus?: number[]) {
    var isDifferent = false;

    if (weapon !== this.getWeaponName()) {
      isDifferent = true;
      this.setWeaponName(weapon);
    }
    if (level !== this.getWeaponLevel()) {
      isDifferent = true;
      this.setWeaponLevel(level);
    }
    if (bonus !== this.getWeaponBonus()) {
      isDifferent = true;
      this.setWeaponBonus(bonus);
    }

    if (isDifferent && this.switch_callback) {
      this.switch_callback();
    }
  }

  switchArmor(armorSprite, level: number, bonus?: number[]) {
    var isDifferent = false;

    if (armorSprite && armorSprite.id !== this.getSpriteName()) {
      isDifferent = true;
      this.setSprite(armorSprite);
      this.setSpriteName(armorSprite.id);
      this.setArmorName(armorSprite.id);
    }

    if (armorSprite.kind !== Types.Entities.FIREFOX && level && level !== this.getArmorLevel()) {
      isDifferent = true;
      this.setArmorLevel(level);
    }

    if (bonus !== this.getArmorBonus()) {
      isDifferent = true;
      this.setArmorBonus(bonus);
    }

    if (isDifferent && this.switch_callback) {
      this.switch_callback();
    }
  }

  switchCape(cape, level: number, bonus?: number[]) {
    var isDifferent = false;

    if (cape !== this.cape) {
      isDifferent = true;
      this.cape = cape;
    }
    if (level !== this.capeLevel) {
      isDifferent = true;
      this.capeLevel = level;
    }
    if (bonus !== this.capeBonus) {
      isDifferent = true;
      this.capeBonus = bonus;
    }

    if (isDifferent && this.switch_callback) {
      this.switch_callback();
    }
  }

  removeCape() {
    this.cape = null;
    this.capeLevel = null;
    this.capeBonus = null;

    if (this.switch_callback) {
      this.switch_callback();
    }
  }

  prepareRawItems(items) {
    return items
      .map((rawItem, slot) => {
        if (!rawItem) return false;
        const [item, levelOrQuantity, bonus] = rawItem.split(":");

        const isWeapon = kinds[item][1] === "weapon";
        const isArmor = kinds[item][1] === "armor";
        const isBelt = kinds[item][1] === "belt";
        const isCape = kinds[item][1] === "cape";
        const isRing = kinds[item][1] === "ring";
        const isAmulet = kinds[item][1] === "amulet";
        const isChest = kinds[item][1] === "chest";

        let requirement = null;
        let level = null;
        let quantity = null;
        if (isWeapon || isArmor || isBelt || isCape || isRing || isAmulet) {
          level = levelOrQuantity;
          requirement = Types.getItemRequirement(item, levelOrQuantity);
        } else if (Types.isScroll(item) || isChest) {
          quantity = levelOrQuantity;
        }

        return {
          item,
          bonus,
          slot,
          requirement,
          ...{ level },
          ...{ quantity },
        };
      })
      .filter(Boolean);
  }

  setInventory(inventory) {
    this.inventory = this.prepareRawItems(inventory);
  }

  setUpgrade(upgrade) {
    this.upgrade = this.prepareRawItems(upgrade);
  }

  setStash(stash) {
    this.stash = this.prepareRawItems(stash);
  }

  onSwitchItem(callback) {
    this.switch_callback = callback;
  }

  onInvincible(callback) {
    this.invincible_callback = callback;
  }

  startInvincibility() {
    var self = this;

    if (!this.invincible) {
      this.currentArmorSprite = this.getSprite();
      this.invincible = true;
      this.invincible_callback();
    } else {
      // If the player already has invincibility, just reset its duration.
      if (this.invincibleTimeout) {
        clearTimeout(this.invincibleTimeout);
      }
    }

    this.invincibleTimeout = setTimeout(function () {
      self.stopInvincibility();
      self.idle(Types.Orientations.DOWN);
    }, 10000);
  }

  stopInvincibility() {
    this.invincible_callback();
    this.invincible = false;

    if (this.currentArmorSprite) {
      this.setSprite(this.currentArmorSprite);
      this.setSpriteName(this.currentArmorSprite.id);
      this.currentArmorSprite = null;
    }
    if (this.invincibleTimeout) {
      clearTimeout(this.invincibleTimeout);
    }
  }

  flagPVP(pvpFlag) {
    this.pvpFlag = pvpFlag;
  }
}

export default Player;
