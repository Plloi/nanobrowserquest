/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-shadow */
import * as Sentry from "@sentry/browser";
import * as _ from "lodash";

import { kinds, Types } from "../../shared/js/gametypes";
import {
  DELETE_SLOT,
  INVENTORY_SLOT_COUNT,
  Slot,
  STASH_SLOT_COUNT,
  STASH_SLOT_PAGES,
  STASH_SLOT_PER_PAGE,
  STASH_SLOT_RANGE,
  TRADE_SLOT_COUNT,
  TRADE_SLOT_RANGE,
  UPGRADE_SLOT_COUNT,
  UPGRADE_SLOT_RANGE,
} from "../../shared/js/slots";
import { toArray, toString } from "../../shared/js/utils";
import { getAchievements } from "./achievements";
import Animation from "./animation";
import App from "./app";
import AudioManager from "./audio";
import BubbleManager from "./bubble";
import Character from "./character";
import Chest from "./chest";
import Entity from "./entity";
import EntityFactory from "./entityfactory";
import Exceptions from "./exceptions";
import GameClient from "./gameclient";
import InfoManager from "./infomanager";
import Item from "./item";
import Map from "./map";
import Mob from "./mob";
import Mobs from "./mobs";
import Npc from "./npc";
import Pathfinder from "./pathfinder";
import Player from "./player";
import Renderer from "./renderer";
import Spell from "./spell";
import Sprite from "./sprite";
import AnimatedTile from "./tile";
import Transition from "./transition";
import Updater from "./updater";
import { randomRange } from "./utils";
import Warrior from "./warrior";

interface WorldPlayer {
  name: string;
  level: number;
  network: Network;
  hash: boolean;
  partyId?: number;
}

class Game {
  app: App;
  ready: boolean;
  started: boolean;
  isLoaded: boolean;
  hasNeverStarted: boolean;
  isUpgradeItemSent: boolean;
  isAnvilSuccess: boolean;
  isAnvilFail: boolean;
  isAnvilRecipe: boolean;
  isAnvilTransmute: boolean;
  isAnvilChestblue: boolean;
  isAnvilChestgreen: boolean;
  isAnvilChestpurple: boolean;
  isAnvilChestred: boolean;
  anvilAnimationTimeout: any;
  cowPortalStart: boolean;
  cowLevelPortalCoords: { x: number; y: number } | null;
  minotaurPortalStart: boolean;
  minotaurLevelPortalCoords: { x: number; y: number };
  renderer: Renderer;
  updater: Updater;
  pathfinder: Pathfinder;
  chatinput: null;
  bubbleManager: BubbleManager;
  audioManager: AudioManager;
  player: Warrior;
  entities: {};
  deathpositions: {};
  entityGrid: any;
  pathingGrid: any;
  renderingGrid: any;
  itemGrid: any;
  currentCursor: null;
  mouse: { x: number; y: number };
  zoningQueue: any[];
  previousClickPosition: { x: number; y: number };
  cursorVisible: boolean;
  selectedX: number;
  selectedY: number;
  selectedCellVisible: boolean;
  targetColor: string;
  targetCellVisible: boolean;
  hoveringTarget: boolean;
  hoveringPlayer: boolean;
  hoveringMob: boolean;
  hoveringItem: boolean;
  hoveringCollidingTile: boolean;
  infoManager: InfoManager;
  currentZoning: Transition | null;
  cursors: {};
  sprites: {};
  currentTime: any;
  animatedTiles: any[] | null;
  highAnimatedTiles: any[] | null;
  debugPathing: boolean;
  pvpFlag: boolean;
  spriteNames: string[];
  storage: any;
  store: any;
  map: Map;
  shadows: any;
  targetAnimation: Animation;
  sparksAnimation: Animation;
  levelupAnimation: Animation;
  drainLifeAnimation: Animation;
  thunderstormAnimation: Animation;
  highHealthAnimation: Animation;
  freezeAnimation: Animation;
  anvilAnimation: Animation;
  defenseSkillAnimation: Animation;
  skillResistanceAnimation: Animation;
  attackSkillAnimation: Animation;
  skillCastAnimation: Animation;
  skillMagicAnimation: Animation;
  skillFlameAnimation: Animation;
  skillLightningAnimation: Animation;
  skillColdAnimation: Animation;
  skillPoisonAnimation: Animation;
  cursePreventRegenerateHealthAnimation: Animation;
  weaponEffectAnimation: Animation;
  client: any;
  achievements: any;
  spritesets: any;
  currentCursorOrientation: any;
  hoveringNpc: any;
  hoveringChest: any;
  camera: any;
  host: any;
  port: any;
  username: any;
  account: string;
  password: string;
  isStopped: any;
  obsoleteEntities: any[];
  playerId: any;
  drawTarget: any;
  clearTarget: any;
  equipment_callback: any;
  playerhurt_callback: any;
  nbplayers_callback: any;
  disconnect_callback: any;
  gamestart_callback: any;
  playerdeath_callback: any;
  gamecompleted_callback: any;
  bosscheckfailed_callback: any;
  chat_callback: any;
  invinciblestart_callback: any;
  invinciblestop_callback: any;
  hoveringPlateauTile: any;
  hoveringOtherPlayer: any;
  lastHovered: any;
  timeout: any;
  zoningOrientation: any;
  updatetarget_callback: any;
  playerexp_callback: any;
  playerhp_callback: any;
  notification_callback: any;
  unlock_callback: any;
  slotToDelete?: number;
  worldPlayers: WorldPlayer[];
  network: Network;
  explorer: Explorer;
  hoverSlotToDelete: number | null;
  isTeleporting: boolean;
  partyInvites: Partial<WorldPlayer>[];
  partyInvitees: string[];
  showAnvilOdds: boolean;
  currentStashPage: number;
  activatedMagicStones: number[];
  activatedBlueFlames: number[];
  isAltarChaliceActivated: boolean;
  isAltarInfinityStoneActivated: boolean;

  constructor(app) {
    this.app = app;
    this.ready = false;
    this.started = false;
    this.isLoaded = false;
    this.hasNeverStarted = true;
    this.isUpgradeItemSent = false;
    this.isAnvilSuccess = false;
    this.isAnvilFail = false;
    this.isAnvilRecipe = false;
    this.isAnvilTransmute = false;
    this.isAnvilChestblue = false;
    this.isAnvilChestgreen = false;
    this.isAnvilChestpurple = false;
    this.isAnvilChestred = false;
    this.anvilAnimationTimeout = null;
    this.cowPortalStart = false;
    this.cowLevelPortalCoords = null;
    this.minotaurPortalStart = false;
    this.minotaurLevelPortalCoords = { x: 34, y: 498 };
    this.network = null;
    this.explorer = null;
    this.hoverSlotToDelete = null;
    this.isTeleporting = false;
    this.showAnvilOdds = false;

    this.renderer = null;
    this.updater = null;
    this.pathfinder = null;
    this.chatinput = null;
    this.bubbleManager = null;
    this.audioManager = null;
    this.targetAnimation = null;
    this.sparksAnimation = null;
    this.levelupAnimation = null;
    this.drainLifeAnimation = null;
    this.thunderstormAnimation = null;
    this.highHealthAnimation = null;
    this.freezeAnimation = null;
    this.anvilAnimation = null;
    this.defenseSkillAnimation = null;
    this.skillResistanceAnimation = null;
    this.skillCastAnimation = null;
    this.skillMagicAnimation = null;
    this.skillFlameAnimation = null;
    this.skillLightningAnimation = null;
    this.skillColdAnimation = null;
    this.skillPoisonAnimation = null;
    this.cursePreventRegenerateHealthAnimation = null;
    this.weaponEffectAnimation = null;
    this.partyInvites = [];
    this.partyInvitees = [];

    // Player
    this.player = new Warrior("player", "");
    this.worldPlayers = [];
    // this.player.moveUp = false;
    // this.player.moveDown = false;
    // this.player.moveLeft = false;
    // this.player.moveRight = false;
    // this.player.disableKeyboardNpcTalk = false;

    // Game state
    this.entities = {};
    this.deathpositions = {};
    this.entityGrid = null;
    this.pathingGrid = null;
    this.renderingGrid = null;
    this.itemGrid = null;
    this.currentCursor = null;
    this.mouse = { x: 0, y: 0 };
    this.zoningQueue = [];
    this.previousClickPosition = null;
    this.currentStashPage = 0;

    this.cursorVisible = true;
    this.selectedX = 0;
    this.selectedY = 0;
    this.selectedCellVisible = false;
    this.targetColor = "rgba(255, 255, 255, 0.5)";
    this.targetCellVisible = true;
    this.hoveringTarget = false;
    this.hoveringPlayer = false;
    this.hoveringMob = false;
    this.hoveringItem = false;
    this.hoveringCollidingTile = false;

    this.activatedMagicStones = [];
    this.activatedBlueFlames = [];
    this.isAltarChaliceActivated = false;
    this.isAltarInfinityStoneActivated = false;

    // combat
    // @ts-ignore
    this.infoManager = new InfoManager(this);

    // zoning
    this.currentZoning = null;
    this.cursors = {};
    this.sprites = {};

    // tile animation
    this.animatedTiles = null;
    this.highAnimatedTiles = null;

    // debug
    this.debugPathing = false;

    // pvp
    this.pvpFlag = false;

    // sprites
    this.spriteNames = [
      "hand",
      "attack",
      "loot",
      "target",
      "levelup",
      "aura-drainlife",
      "aura-thunderstorm",
      "aura-highhealth",
      "aura-freeze",
      "skill-heal",
      "skill-defense",
      "skill-resistances",
      "skill-cast",
      "skill-cast-magic",
      "skill-cast-flame",
      "skill-cast-poison",
      "skill-magic",
      "skill-flame",
      "skill-lightning",
      "skill-cold",
      "skill-poison",
      "curse-prevent-regenerate-health",
      "talk",
      "sparks",
      "weapon-effect-magic",
      "weapon-effect-flame",
      "weapon-effect-cold",
      "weapon-effect-poison",
      "shadow16",
      "rat",
      "rat2",
      "skeleton",
      "skeleton2",
      "skeleton3",
      "skeleton4",
      "spectre",
      "boss",
      "skeletoncommander",
      "deathknight",
      "ogre",
      "yeti",
      "werewolf",
      "wraith",
      "crab",
      "snake",
      "snake2",
      "snake3",
      "snake4",
      "eye",
      "bat",
      "bat2",
      "goblin",
      "goblin2",
      "zombie",
      "necromancer",
      "cow",
      "cowking",
      "minotaur",
      // "troll",
      // "golem",
      // "harpie",
      // "werewolf2",
      "worm",
      "wraith2",
      "ghost",
      "mage",
      "mage-spell",
      "mage-spell-magic",
      "mage-spell-flame",
      "mage-spell-lightning",
      "mage-spell-cold",
      "mage-spell-poison",
      "deathangel",
      "deathangel-spell",
      "deathangel-spell-magic",
      "deathangel-spell-flame",
      "deathangel-spell-lightning",
      "deathangel-spell-cold",
      "deathangel-spell-poison",
      "wizard",
      "guard",
      "king",
      "villagegirl",
      "villager",
      "carlosmatos",
      "satoshi",
      "coder",
      "agent",
      "rick",
      "scientist",
      "nyan",
      "priest",
      "sorcerer",
      "octocat",
      "anvil",
      "anvil-success",
      "anvil-fail",
      "anvil-recipe",
      "anvil-transmute",
      "anvil-chestblue",
      "waypointx",
      "waypointn",
      "waypointo",
      "stash",
      "portalcow",
      "portalminotaur",
      "portaltemple",
      "portaldeathangel",
      "magicstone",
      "altarchalice",
      "altarinfinitystone",
      "secretstairs",
      "blueflame",
      "beachnpc",
      "forestnpc",
      "desertnpc",
      "lavanpc",
      "clotharmor",
      "leatherarmor",
      "mailarmor",
      "platearmor",
      "redarmor",
      "goldenarmor",
      "bluearmor",
      "hornedarmor",
      "frozenarmor",
      "diamondarmor",
      "emeraldarmor",
      "demonarmor",
      "mysticalarmor",
      "bloodarmor",
      "templararmor",
      "firefox",
      "death",
      "dagger",
      "axe",
      "blueaxe",
      "bluemorningstar",
      "chest",
      "wirtleg",
      "sword",
      "redsword",
      "bluesword",
      "goldensword",
      "frozensword",
      "diamondsword",
      "minotauraxe",
      "emeraldsword",
      "moonsword",
      "templarsword",
      "spikeglaive",
      "eclypsedagger",
      "executionersword",
      "mysticalsword",
      "dragonsword",
      "hellhammer",
      "cape",
      "shieldwood",
      "shieldiron",
      "shieldplate",
      "shieldred",
      "shieldgolden",
      "shieldblue",
      "shieldhorned",
      "shieldfrozen",
      "shielddiamond",
      "shieldtemplar",
      "shieldemerald",
      "shieldexecutioner",
      "shieldmystical",
      "shielddragon",
      "shielddemon",
      "shieldmoon",
      "item-sword",
      "item-axe",
      "item-blueaxe",
      "item-bluemorningstar",
      "item-redsword",
      "item-bluesword",
      "item-goldensword",
      "item-frozensword",
      "item-diamondsword",
      "item-minotauraxe",
      "item-emeraldsword",
      "item-moonsword",
      "item-templarsword",
      "item-spikeglaive",
      "item-eclypsedagger",
      "item-executionersword",
      "item-mysticalsword",
      "item-dragonsword",
      "item-hellhammer",
      "item-leatherarmor",
      "item-mailarmor",
      "item-platearmor",
      "item-redarmor",
      "item-goldenarmor",
      "item-bluearmor",
      "item-hornedarmor",
      "item-frozenarmor",
      "item-diamondarmor",
      "item-emeraldarmor",
      "item-demonarmor",
      "item-mysticalarmor",
      "item-bloodarmor",
      "item-templararmor",
      "item-beltleather",
      "item-beltplated",
      "item-beltfrozen",
      "item-belthorned",
      "item-beltdiamond",
      "item-beltminotaur",
      "item-beltemerald",
      "item-beltexecutioner",
      "item-beltmystical",
      "item-belttemplar",
      "item-beltdemon",
      "item-beltmoon",
      "item-cape",
      "item-shieldwood",
      "item-shieldiron",
      "item-shieldplate",
      "item-shieldred",
      "item-shieldgolden",
      "item-shieldblue",
      "item-shieldhorned",
      "item-shieldfrozen",
      "item-shielddiamond",
      "item-shieldtemplar",
      "item-shieldemerald",
      "item-shieldexecutioner",
      "item-shieldmystical",
      "item-shielddragon",
      "item-shielddemon",
      "item-shieldmoon",
      "item-flask",
      "item-rejuvenationpotion",
      "item-poisonpotion",
      "item-nanopotion",
      "item-bananopotion",
      "item-rune-sat",
      "item-rune-al",
      "item-rune-bul",
      "item-rune-nan",
      "item-rune-mir",
      "item-rune-gel",
      "item-rune-do",
      "item-rune-ban",
      "item-rune-sol",
      "item-rune-um",
      "item-rune-hex",
      "item-rune-zal",
      "item-rune-vie",
      "item-rune-eth",
      "item-rune-btc",
      "item-rune-vax",
      "item-rune-por",
      "item-rune-las",
      "item-rune-cham",
      "item-rune-dur",
      "item-rune-xno",
      "item-rune-fal",
      "item-rune-kul",
      "item-rune-mer",
      "item-rune-qua",
      "item-rune-gul",
      "item-rune-ber",
      "item-rune-tor",
      "item-rune-jah",
      "item-rune-shi",
      "item-rune-vod",
      "item-gemruby",
      "item-gememerald",
      "item-gemamethyst",
      "item-gemtopaz",
      "item-gemsapphire",
      "item-gold",
      "item-ringbronze",
      "item-ringsilver",
      "item-ringgold",
      "item-ringplatinum",
      "item-ringnecromancer",
      "item-ringraistone",
      "item-ringfountain",
      "item-ringminotaur",
      "item-ringmystical",
      "item-ringbalrog",
      "item-ringconqueror",
      "item-ringheaven",
      "item-ringwizard",
      "item-amuletsilver",
      "item-amuletgold",
      "item-amuletplatinum",
      "item-amuletcow",
      "item-amuletfrozen",
      "item-amuletdemon",
      "item-amuletmoon",
      "item-amuletstar",
      "item-chestblue",
      "item-chestgreen",
      "item-chestpurple",
      "item-chestred",
      "item-scrollupgradelow",
      "item-scrollupgrademedium",
      "item-scrollupgradehigh",
      "item-scrollupgradelegendary",
      "item-scrollupgradeblessed",
      "item-scrollupgradesacred",
      "item-scrolltransmute",
      "item-stonesocket",
      "item-stonedragon",
      "item-stonehero",
      "item-jewelskull",
      "item-skeletonkey",
      "item-raiblockstl",
      "item-raiblockstr",
      "item-raiblocksbl",
      "item-raiblocksbr",
      "item-wirtleg",
      "item-skeletonkingcage",
      "item-necromancerheart",
      "item-cowkinghorn",
      "item-chalice",
      "item-infinitystone",
      "item-cake",
      "item-burger",
      "morningstar",
      "item-morningstar",
      "item-firefoxpotion",
    ];
  }

  setup($bubbleContainer, canvas, background, foreground, input) {
    this.setBubbleManager(new BubbleManager($bubbleContainer));
    this.setRenderer(new Renderer(this, canvas, background, foreground));
    this.setChatInput(input);
  }

  setStorage(storage) {
    this.storage = storage;
  }

  setStore(store) {
    this.store = store;
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  setUpdater(updater) {
    this.updater = updater;
  }

  setPathfinder(pathfinder) {
    this.pathfinder = pathfinder;
  }

  setChatInput(element) {
    this.chatinput = element;
  }

  setBubbleManager(bubbleManager) {
    this.bubbleManager = bubbleManager;
  }

  setShowAnvilOdds(enabled) {
    this.showAnvilOdds = enabled;
  }

  loadMap() {
    this.map = new Map(!this.renderer.upscaledRendering, this);
  }

  initPlayer() {
    if (this.storage.hasAlreadyPlayed() && this.storage.data.player) {
      if (this.storage.data.player.armor && this.storage.data.player.weapon) {
        this.player.setSpriteName(this.storage.data.player.armor);
        this.player.setWeaponName(this.storage.data.player.weapon);
      }
    }
    this.player.setSprite(this.sprites[this.player.getSpriteName()]);
    this.player.idle();

    console.debug("Finished initPlayer");
  }

  initShadows() {
    this.shadows = {};
    this.shadows["small"] = this.sprites["shadow16"];
  }

  initCursors() {
    this.cursors["hand"] = this.sprites["hand"];
    this.cursors["attack"] = this.sprites["attack"];
    this.cursors["loot"] = this.sprites["loot"];
    this.cursors["target"] = this.sprites["target"];
    this.cursors["arrow"] = this.sprites["arrow"];
    this.cursors["talk"] = this.sprites["talk"];
    this.cursors["join"] = this.sprites["talk"];
  }

  initAnimations() {
    this.targetAnimation = new Animation("idle_down", 4, 0, 16, 16);
    this.targetAnimation.setSpeed(50);

    this.sparksAnimation = new Animation("idle_down", 6, 0, 16, 16);
    this.sparksAnimation.setSpeed(120);

    this.levelupAnimation = new Animation("idle_down", 4, 0, 16, 16);
    this.levelupAnimation.setSpeed(50);

    this.drainLifeAnimation = new Animation("idle_down", 5, 0, 16, 8);
    this.drainLifeAnimation.setSpeed(200);

    this.thunderstormAnimation = new Animation("idle_down", 6, 0, 16, 8);
    this.thunderstormAnimation.setSpeed(200);

    this.highHealthAnimation = new Animation("idle_down", 6, 0, 16, 8);
    this.highHealthAnimation.setSpeed(140);

    this.freezeAnimation = new Animation("idle_down", 8, 0, 16, 8);
    this.freezeAnimation.setSpeed(140);

    this.anvilAnimation = new Animation("idle_down", 4, 0, 15, 8);
    this.anvilAnimation.setSpeed(80);

    this.defenseSkillAnimation = new Animation("idle_down", 8, 0, 32, 32);
    this.defenseSkillAnimation.setSpeed(125);

    this.skillResistanceAnimation = new Animation("idle_down", 24, 0, 30, 36);
    this.skillResistanceAnimation.setSpeed(25);

    this.skillCastAnimation = new Animation("idle_down", 17 + 1, 0, 48, 48);
    this.skillCastAnimation.setSpeed(50);

    this.skillMagicAnimation = new Animation("idle_down", 12 + 1, 0, 64, 64);
    this.skillMagicAnimation.setSpeed(100);

    this.skillFlameAnimation = new Animation("idle_down", 12 + 1, 0, 34, 58);
    this.skillFlameAnimation.setSpeed(125);

    this.skillLightningAnimation = new Animation("idle_down", 8 + 1, 0, 28, 50);
    this.skillLightningAnimation.setSpeed(125);

    this.skillColdAnimation = new Animation("idle_down", 14 + 1, 0, 72, 72);
    this.skillColdAnimation.setSpeed(75);

    this.skillPoisonAnimation = new Animation("idle_down", 8 + 1, 0, 24, 60);
    this.skillPoisonAnimation.setSpeed(125);

    this.weaponEffectAnimation = new Animation("idle_down", 6, 0, 20, 20);
    this.weaponEffectAnimation.setSpeed(140);

    this.cursePreventRegenerateHealthAnimation = new Animation("idle_down", 17 + 1, 0, 20, 20);
    this.cursePreventRegenerateHealthAnimation.setSpeed(25);
  }

  initHurtSprites() {
    var self = this;

    Types.forEachArmorKind(function (kind, kindName) {
      self.sprites[kindName].createHurtSprite();
    });
  }

  initSilhouettes() {
    var self = this;

    Types.forEachMobOrNpcKind(function (kind, kindName) {
      self.sprites[kindName].createSilhouette();
    });
    self.sprites["chest"].createSilhouette();
    self.sprites["item-cake"].createSilhouette();
  }

  initSettings(settings) {
    const { musicVolume = 0.6, soundVolume = 0.6 } = this.storage.data.settings;

    if (!this.storage.isMusicEnabled()) {
      this.audioManager.disableMusic();
    } else {
      $("#mute-music-checkbox").prop("checked", true);
      this.audioManager.updateMusicVolume(musicVolume);
    }

    if (!this.storage.isSoundEnabled()) {
      this.audioManager.disableSound();
    } else {
      $("#mute-sound-checkbox").prop("checked", true);
      this.audioManager.updateSoundVolume(soundVolume);
    }

    var handleMusic = $("#music-handle");
    $("#music-slider").slider({
      min: 0,
      max: 100,
      value: Math.round(musicVolume * 100),
      create: () => {
        handleMusic.text(`${Math.round(musicVolume * 100)}%`);
      },
      slide: (_event, ui) => {
        handleMusic.text(`${ui.value}%`);
        this.storage.setMusicVolume(ui.value / 100);
        this.audioManager.updateMusicVolume(ui.value / 100);
      },
    });

    var handleSound = $("#sound-handle");
    $("#sound-slider").slider({
      min: 0,
      max: 100,
      value: Math.round(soundVolume * 100),
      create: () => {
        handleSound.text(`${Math.round(soundVolume * 100)}%`);
      },
      slide: (_event, ui) => {
        handleSound.text(`${ui.value}%`);
        this.storage.setSoundVolume(ui.value / 100);
        this.audioManager.updateSoundVolume(ui.value / 100);
      },
    });

    if (this.storage.showEntityNameEnabled()) {
      this.renderer.setDrawEntityName(true);
      $("#entity-name-checkbox").prop("checked", true);
    } else {
      this.renderer.setDrawEntityName(false);
    }

    if (this.storage.showDamageInfoEnabled()) {
      this.infoManager.setShowDamageInfo(true);
      $("#damage-info-checkbox").prop("checked", true);
    } else {
      this.infoManager.setShowDamageInfo(false);
    }

    if (this.storage.showAnvilOddsEnabled()) {
      this.setShowAnvilOdds(true);
      $("#anvil-odds-checkbox").prop("checked", true);
    } else {
      this.setShowAnvilOdds(false);
    }

    this.player.capeHue = settings.capeHue;
    var handleHue = $("#cape-hue-handle");
    $("#cape-hue-slider").slider({
      min: -180,
      max: 180,
      value: settings.capeHue,
      create: () => {
        handleHue.text(settings.capeHue);
      },
      slide: (_event, ui) => {
        handleHue.text(ui.value);
        this.player.setCapeHue(ui.value);
        this.updateCapePreview();
      },
      change: (_event, ui) => {
        this.client.sendSettings({ capeHue: ui.value });
      },
    });

    this.player.capeSaturate = settings.capeSaturate;
    var handleSaturate = $("#cape-saturate-handle");
    $("#cape-saturate-slider").slider({
      min: 0,
      max: 400,
      value: settings.capeSaturate,
      create: () => {
        handleSaturate.text(`${settings.capeSaturate}%`);
      },
      slide: (_event, ui) => {
        handleSaturate.text(`${ui.value}%`);
        this.player.setCapeSaturate(ui.value);
        this.updateCapePreview();
      },
      change: (_event, ui) => {
        this.client.sendSettings({ capeSaturate: ui.value });
      },
    });

    this.player.capeContrast = settings.capeContrast;
    var handleContrast = $("#cape-contrast-handle");
    $("#cape-contrast-slider").slider({
      min: 0,
      max: 300,
      value: settings.capeContrast,
      create: () => {
        handleContrast.text(`${settings.capeContrast}%`);
      },
      slide: (_event, ui) => {
        handleContrast.text(`${ui.value}%`);
        this.player.setCapeContrast(ui.value);
        this.updateCapePreview();
      },
      change: (_event, ui) => {
        this.client.sendSettings({ capeContrast: ui.value });
      },
    });

    this.player.capeBrightness = settings.capeBrightness;
    var handleBrightness = $("#cape-brightness-handle");
    $("#cape-brightness-slider").slider({
      min: 0,
      max: 10,
      value: settings.capeBrightness,
      create: () => {
        handleBrightness.text(`${settings.capeBrightness}`);
      },
      slide: (_event, ui) => {
        handleBrightness.text(`${ui.value}`);
        this.player.setCapeBrightness(ui.value);
        this.updateCapePreview();
      },
      change: (_event, ui) => {
        this.client.sendSettings({ capeBrightness: ui.value });
      },
    });

    this.updateCapePreview();
  }

  updateCapePreview() {
    const hue = this.player.capeHue;
    const saturate = this.player.capeSaturate;
    const contrast = this.player.capeContrast;
    const brightness = this.player.capeBrightness;

    $("#settings-cape-preview").css(
      "filter",
      `hue-rotate(${hue}deg) saturate(${saturate}%) contrast(${contrast}%) brightness(${brightness})`,
    );
  }

  toggleCapeSliders(isEnabled) {
    $("#cape-hue-slider").slider(isEnabled ? "enable" : "disable");
    $("#cape-saturate-slider").slider(isEnabled ? "enable" : "disable");
    $("#cape-contrast-slider").slider(isEnabled ? "enable" : "disable");
    $("#cape-brightness-slider").slider(isEnabled ? "enable" : "disable");
  }

  initTooltips() {
    var self = this;

    $(document).tooltip({
      items: "[data-item]",
      track: true,
      // hide: 100000,
      position: { my: "left bottom-10", at: "left bottom", collision: "flipfit" },
      close: function () {
        self.hoverSlotToDelete = null;
      },
      content() {
        // Player is dead
        if (!self.player) return;

        const element = $(this);
        const item = element.attr("data-item");
        const level = parseInt(element.attr("data-level") || "1", 10);
        const rawBonus = toArray(element.attr("data-bonus"));
        const rawSkill = element.attr("data-skill") ? parseInt(element.attr("data-skill"), 10) : null;
        const rawSocket = toArray(element.attr("data-socket"));
        const slot = parseInt(element.parent().attr("data-slot") || "0", 10);
        const isEquippedItemSlot = Object.values(Slot).includes(slot);

        self.hoverSlotToDelete = slot;

        let setName = null;
        let setParts = [];
        let currentSet = null;
        let setBonus = [];

        if (isEquippedItemSlot) {
          currentSet = Types.kindAsStringToSet[item];
          const playerItems = self.player.getEquipment();
          if (currentSet) {
            setName = `* ${_.capitalize(currentSet)} Set *`;
            setParts = Types.setItemsNameMap[currentSet].map((description, index) => ({
              description,
              isActive: playerItems.includes(Types.setItems[currentSet][index]),
            }));

            if (self.player.setBonus[currentSet]) {
              setBonus = Types.getSetBonus(currentSet, self.player.setBonus[currentSet]);
            }
          }
        }

        const {
          name,
          isUnique,
          isRune,
          isRuneword,
          isJewel,
          isStone,
          itemClass,
          defense,
          damage,
          healthBonus,
          magicDamage,
          flameDamage,
          lightningDamage,
          pierceDamage,
          bonus = [],
          skill,
          requirement,
          description,
          partyBonus = [],
          runeBonus = [],
          runeRank,
          socket,
        } = Types.getItemDetails({ item, level, rawBonus, rawSkill, rawSocket, playerBonus: self.player.bonus });

        return `<div>
            <div class="item-title${isUnique ? " unique" : ""}${isRune || isRuneword ? " rune" : ""}">
              ${name}${level && !isRune && !isJewel && !isStone && !Types.isSingle(item) ? ` (+${level})` : ""}
              ${runeRank ? ` (#${runeRank})` : ""}
              ${socket ? ` <span class="item-socket">(${socket})</span>` : ""}
            </div>
            ${
              itemClass
                ? `<div class="item-class">(${isUnique ? "Unique " : ""}${
                    isRuneword ? "Runeword " : ""
                  }${itemClass} class item)</div>`
                : ""
            }
            ${
              socket
                ? `<div class="socket-container">
                ${_.range(0, socket)
                  .map(index => {
                    let image = "none";
                    if (typeof rawSocket[index] === "number") {
                      const rune = Types.getRuneNameFromItem(rawSocket[index]);
                      image = rune ? `url(img/2/item-rune-${rune}.png)` : "none";
                    } else if (Types.isJewel(rawSocket[index])) {
                      const [, , jewelBonus] = (rawSocket[index] as unknown as string).split("|") || [];
                      const imageIndex = Types.getJewelSkinIndex(toArray(jewelBonus));
                      image = `url(img/2/item-jewelskull${imageIndex}.png)`;
                    }
                    return `<div class="item-rune" style="background-image: ${image}; position: relative;"></div>`;
                  })
                  .join("")}</div>`
                : ""
            }
            ${defense ? `<div class="item-description">Defense: ${defense}</div>` : ""}
            ${damage ? `<div class="item-description">Attack: ${damage}</div>` : ""}
            ${magicDamage ? `<div class="item-bonus">Magic damage: ${magicDamage}</div>` : ""}
            ${flameDamage ? `<div class="item-bonus">Flame damage: ${flameDamage}</div>` : ""}
            ${lightningDamage ? `<div class="item-bonus">Lightning damage: ${lightningDamage}</div>` : ""}
            ${pierceDamage ? `<div class="item-bonus">Pierce damage: ${pierceDamage}</div>` : ""}
            ${healthBonus ? `<div class="item-bonus">Health bonus: ${healthBonus}</div>` : ""}
            ${
              Array.isArray(bonus)
                ? bonus.map(({ description }) => `<div class="item-bonus">${description}</div>`).join("")
                : ""
            }
            ${description ? `<div class="item-description">${description}</div>` : ""}
            ${skill ? `<div class="item-skill">${skill.description}</div>` : ""}
            ${
              currentSet && setBonus.length
                ? `<div class="item-set-description">${_.capitalize(currentSet)} set bonuses</div>`
                : ""
            }
            ${setBonus.map(({ description }) => `<div class="item-set-bonus">${description}</div>`).join("")}
            ${setName ? `<div class="item-set-name">${setName}</div>` : ""}
            ${setParts
              ?.map(
                ({ description, isActive }) =>
                  `<div class="item-set-part ${isActive ? "active" : ""}">${description}</div>`,
              )
              .join("")}
            ${partyBonus.length ? `<div class="item-set-description">Party Bonuses</div>` : ""}
            ${partyBonus.map(({ description }) => `<div class="item-set-bonus">${description}</div>`).join("")}
            ${runeBonus.map(({ description }) => `<div class="item-set-bonus">${description}</div>`).join("")}
            ${requirement ? `<div class="item-description">Required level: ${requirement}</div>` : ""}
          </div>`;
      },
    });
  }

  initSendUpgradeItem() {
    var self = this;
    $("#upgrade-btn").on("click", function () {
      const item1 = self.player.upgrade[0]?.item;
      if (
        self.player.upgrade.length >= 2 ||
        (self.player.upgrade.length === 1 && (Types.isChest(item1) || item1 === "cowkinghorn" || Types.isWeapon(item1)))
      ) {
        if (!self.isUpgradeItemSent) {
          self.client.sendUpgradeItem();
        }
        self.isUpgradeItemSent = true;
      }
    });
  }

  initUpgradeItemPreview() {
    var self = this;

    const previewSlot = $(`#upgrade .item-slot:eq(10)`);

    $("#upgrade-preview-btn").on("click", function () {
      let itemName;
      let itemLevel;
      let itemBonus;
      let itemSkill;
      let itemSocket;
      let isItemUnique;
      let isUpgrade = false;

      self.player.upgrade.forEach(({ item, level, slot, bonus, skill, socket, isUnique }) => {
        if (slot === 0) {
          itemName = item;
          itemLevel = level;
          itemBonus = bonus;
          itemSkill = skill;
          itemSocket = socket;
          isItemUnique = isUnique;
        } else if (item.startsWith("scrollupgrade")) {
          isUpgrade = true;
        }
      });

      if (isUpgrade && itemName && itemLevel) {
        if (previewSlot.is(":empty")) {
          previewSlot.append(
            self.createItemDiv({
              isUnique: isItemUnique,
              item: itemName,
              level: parseInt(itemLevel) + 1,
              bonus: itemBonus,
              skill: itemSkill,
              socket: itemSocket,
            }),
          );
        }
      }
    });
  }

  initDroppable() {
    var self = this;

    $(".item-droppable").droppable({
      greedy: true,
      over() {},
      out() {},
      drop(_event, ui) {
        const fromSlot = $(ui.draggable[0]).parent().data("slot");
        const toSlot = $(this).data("slot");

        self.dropItem(fromSlot, toSlot);

        $(document).tooltip("enable");
      },
    });
  }

  dropItem(fromSlot, toSlot, transferedQuantity = null) {
    if (fromSlot === toSlot || typeof fromSlot !== "number" || typeof toSlot !== "number") {
      return;
    }

    const fromSlotEl = $(`[data-slot="${fromSlot}"]`);
    const fromItemEl = fromSlotEl.find(">div");
    const toSlotEl = $(`[data-slot="${toSlot}"]`);
    const toItemEl = toSlotEl.find(">div");
    const toItem = toItemEl.attr("data-item");
    const toLevel = toItemEl.attr("data-level");
    const item = fromItemEl.attr("data-item");
    const level = parseInt(fromItemEl.attr("data-level"));
    const quantity = parseInt(fromItemEl.attr("data-quantity")) || null;
    const rawBonus = fromItemEl.attr("data-bonus");
    const socket = toArray(fromItemEl.attr("data-socket"));
    const rawSkill = fromItemEl.attr("data-skill");
    let bonus: number[];
    let skill: number;

    // Condition for allowing partial quantity
    if (Types.isQuantity(item) && quantity > 1 && transferedQuantity === null && !toItem) {
      // Mandatory inventory from or to interaction
      if (
        (fromSlot < INVENTORY_SLOT_COUNT || toSlot < INVENTORY_SLOT_COUNT) &&
        ((fromSlot >= STASH_SLOT_RANGE && fromSlot < STASH_SLOT_RANGE + STASH_SLOT_COUNT) ||
          (toSlot >= STASH_SLOT_RANGE && toSlot < STASH_SLOT_RANGE + STASH_SLOT_COUNT) ||
          (fromSlot >= TRADE_SLOT_RANGE && fromSlot < TRADE_SLOT_RANGE + TRADE_SLOT_COUNT) ||
          (toSlot >= TRADE_SLOT_RANGE && toSlot < TRADE_SLOT_RANGE + TRADE_SLOT_COUNT))
      ) {
        this.dropItemQuantity(fromSlot, toSlot, quantity);
        return;
      }
    }
    if (rawBonus) {
      bonus = toArray(rawBonus);
    }
    if (rawSkill) {
      skill = parseInt(rawSkill, 10);
    }

    if (toItem) {
      if (
        Object.values(Slot).includes(fromSlot) &&
        (!toLevel || !Types.isCorrectTypeForSlot(fromSlot, toItem) || toLevel > this.player.level)
      ) {
        return;
      }
    }

    if (Object.values(Slot).includes(toSlot) && Types.getItemRequirement(item, level) > this.player.level) {
      return;
    }

    if (toSlot === -1) {
      if (!level || level !== 1 || Types.isUnique(item, rawBonus)) {
        $("#dialog-delete-item").dialog("open");
        this.slotToDelete = fromSlot;
        return;
      }
      fromItemEl.remove();
    } else {
      toSlotEl.append(fromItemEl.detach());
      if (toItemEl.length) {
        fromSlotEl.append(toItemEl.detach());
      }
    }

    this.client.sendMoveItem(fromSlot, toSlot, transferedQuantity);

    if (typeof level === "number") {
      if (toSlot === Slot.WEAPON) {
        this.player.switchWeapon(item, level, bonus, socket, skill);
      } else if (toSlot === Slot.ARMOR) {
        this.player.switchArmor(this.sprites[item], level, bonus, socket);
      } else if (toSlot === Slot.CAPE) {
        this.player.switchCape(item, level, bonus);
      } else if (toSlot === Slot.SHIELD) {
        this.player.switchShield(item, level, bonus, socket, skill);
        this.setDefenseSkill(skill);
      }
    }

    const type = kinds[item][1];
    if (type === "armor" && $(".item-equip-armor").is(":empty")) {
      this.player.switchArmor(this.sprites["clotharmor"], 1);
    } else if (type === "weapon" && $(".item-equip-weapon").is(":empty")) {
      this.player.switchWeapon("dagger", 1);
    } else if (type === "cape" && $(".item-equip-cape").is(":empty")) {
      this.player.removeCape();
    } else if (type === "shield" && $(".item-equip-shield").is(":empty")) {
      this.player.removeShield();
    }
  }

  dropItemQuantity(fromSlot, toSlot, maxQuantity) {
    const self = this;

    $("#container").addClass("prevent-click");

    const submit = () => {
      const quantity = parseInt($("#transfer-quantity").val() as string);
      if (quantity <= maxQuantity) {
        self.dropItem(fromSlot, toSlot, quantity);
      }
      $("#container").removeClass("prevent-click");
      $("#dialog-quantity").dialog("close");
    };

    $("#dialog-quantity").dialog({
      dialogClass: "no-close",
      autoOpen: true,
      draggable: false,
      title: "Choose quantity to transfer",
      classes: {
        "ui-button": "btn",
      },
      buttons: [
        {
          text: "Cancel",
          class: "btn btn-gray",
          click: function () {
            $(this).dialog("close");
            $("#container").removeClass("prevent-click");
          },
        },
        {
          text: "Ok",
          class: "btn",
          click: submit,
        },
      ],
    });
    $("#dialog-quantity").html(
      `<div style="margin: 24px 0; text-align: center;">
        <input id="transfer-quantity" type="number" min="1" max="${maxQuantity}" style="width: 50%;font-family: 'GraphicPixel';" />
      </div>`,
    );

    $("#transfer-quantity")
      .on("input", event => {
        const inputValue = parseInt($(event.target).val() as string);
        if (inputValue && inputValue > maxQuantity) {
          $(event.target).val(maxQuantity);
        }
      })
      .on("keyup", function (e) {
        if (e.which === Types.Keys.ENTER) {
          submit();
        }
      })
      .val(maxQuantity)
      .trigger("focus")
      .trigger("select");

    // @ts-ignore
    $(".ui-button").removeClass("ui-button");
  }

  deleteItemFromSlot() {
    if (typeof this.slotToDelete !== "number") return;
    this.client.sendMoveItem(this.slotToDelete, -1);
    $(`[data-slot="${this.slotToDelete}"] >div`).remove();
    this.hoverSlotToDelete = null;
  }

  destroyDroppable() {
    // @NOTE Why was this there??
    // $(".item-not-draggable").remove();
    $(".item-droppable").droppable("destroy");
  }

  initDraggable() {
    var self = this;

    $(".item-draggable:not(.item-faded)").draggable({
      zIndex: 100,
      revertDuration: 0,
      revert: true,
      containment: "#canvasborder",
      drag() {},
      start() {
        $(document).tooltip("disable");
        $(this).parent().addClass("ui-droppable-origin");

        const item = $(this).attr("data-item");
        const type = kinds[item][1];

        if (
          ["weapon", "armor", "belt", "cape", "shield", "chest", "ring", "amulet"].includes(type) &&
          $(`.item-${type}`).is(":empty")
        ) {
          $(`.item-${type}`).addClass("item-droppable");
        } else if (Types.isScroll(item)) {
          $(".item-scroll").addClass("item-droppable");
        } else if (Types.isSingle(item) || Types.isRune(item) || Types.isStone(item) || Types.isJewel(item)) {
          $(".item-recipe").addClass("item-droppable");
        }

        // Simpler to remove it after the fact
        $(".item-not-droppable").removeClass("item-droppable");

        self.initDroppable();
      },
      stop() {
        self.destroyDroppable();

        $(".ui-droppable-origin").removeClass("ui-droppable-origin");
        $(
          ".item-weapon, .item-armor, .item-ring, .item-amulet, .item-belt, .item-shield, .item-cape, .item-chest, .item-scroll",
        ).removeClass("item-droppable");
      },
    });
  }

  destroyDraggable() {
    $(".item-draggable.ui-draggable").draggable("destroy");
  }

  getIconPath(spriteName: string, level?: number, bonus?: number[]) {
    const scale = this.renderer.getScaleFactor();

    let suffix = "";
    if (spriteName === "cape" && level >= 7) {
      suffix = "7";
    } else if (spriteName === "jewelskull" && level !== 1) {
      suffix = Types.getJewelSkinIndex(bonus);
    }

    return `img/${scale}/item-${spriteName}${suffix}.png`;
  }

  initInventory() {
    $("#item-inventory").empty();
    for (var i = 0; i < INVENTORY_SLOT_COUNT; i++) {
      $("#item-inventory").append(`<div class="item-slot item-inventory item-droppable" data-slot="${i}"></div>`);
    }

    $("#item-weapon")
      .empty()
      .append(`<div class="item-slot item-equip-weapon item-weapon" data-slot="${Slot.WEAPON}"></div>`);
    $("#item-armor")
      .empty()
      .append(`<div class="item-slot item-equip-armor item-armor" data-slot="${Slot.ARMOR}"></div>`);
    $("#item-belt").empty().append(`<div class="item-slot item-equip-belt item-belt" data-slot="${Slot.BELT}"></div>`);
    $("#item-cape").empty().append(`<div class="item-slot item-equip-cape item-cape" data-slot="${Slot.CAPE}"></div>`);
    $("#item-shield")
      .empty()
      .append(`<div class="item-slot item-equip-shield item-shield" data-slot="${Slot.SHIELD}"></div>`);
    $("#item-ring1")
      .empty()
      .append(`<div class="item-slot item-equip-ring item-ring item-ring1" data-slot="${Slot.RING1}"></div>`);
    $("#item-ring2")
      .empty()
      .append(`<div class="item-slot item-equip-ring item-ring item-ring2" data-slot="${Slot.RING2}"></div>`);
    $("#item-amulet")
      .empty()
      .append(`<div class="item-slot item-equip-amulet item-amulet item-amulet" data-slot="${Slot.AMULET}"></div>`);
    $("#item-delete")
      .empty()
      .append(`<div class="item-slot item-droppable item-delete" data-slot="${DELETE_SLOT}"></div>`);

    if (this.player.weaponName !== "dagger") {
      $(".item-equip-weapon").append(
        $("<div />", {
          class: `item-draggable ${this.player.weaponBonus?.length ? "item-unique" : ""}`,
          css: {
            "background-image": `url("${this.getIconPath(this.player.weaponName)}")`,
          },
          "data-item": this.player.weaponName,
          "data-level": this.player.weaponLevel,
          "data-bonus": toString(this.player.weaponBonus),
          "data-socket": toString(this.player.weaponSocket),
          "data-skill": this.player.attackSkill,
        }),
      );
    }
    if (this.player.armorName !== "clotharmor") {
      $(".item-equip-armor").append(
        $("<div />", {
          class: `item-draggable ${this.player.armorBonus?.length ? "item-unique" : ""}`,
          css: {
            "background-image": `url("${this.getIconPath(this.player.armorName)}")`,
          },
          "data-item": this.player.armorName,
          "data-level": this.player.armorLevel,
          "data-bonus": toString(this.player.armorBonus),
          "data-socket": toString(this.player.armorSocket),
        }),
      );
    }

    if (this.player.beltName) {
      $(".item-equip-belt").append(
        $("<div />", {
          class: `item-draggable ${this.player.beltBonus ? "item-unique" : ""}`,
          css: {
            "background-image": `url("${this.getIconPath(this.player.beltName)}")`,
          },
          "data-item": this.player.beltName,
          "data-level": this.player.beltLevel,
          "data-bonus": toString(this.player.beltBonus),
        }),
      );
    }

    if (this.player.cape) {
      $(".item-equip-cape").append(
        $("<div />", {
          class: `item-draggable ${this.player.capeBonus.length >= 5 ? "item-unique" : ""}`,
          css: {
            "background-image": `url("${this.getIconPath(this.player.cape, this.player.capeLevel)}")`,
          },
          "data-item": this.player.cape,
          "data-level": this.player.capeLevel,
          "data-bonus": toString(this.player.capeBonus),
        }),
      );
    }

    if (this.player.shieldName) {
      $(".item-equip-shield").append(
        $("<div />", {
          class: `item-draggable ${this.player.shieldBonus?.length >= 5 ? "item-unique" : ""}`,
          css: {
            "background-image": `url("${this.getIconPath(this.player.shieldName)}")`,
          },
          "data-item": this.player.shieldName,
          "data-level": this.player.shieldLevel,
          "data-bonus": toString(this.player.shieldBonus),
          "data-socket": toString(this.player.shieldSocket),
          "data-skill": this.player.defenseSkill,
        }),
      );
    }

    if (this.player.ring1Name) {
      $(".item-ring1").append(
        $("<div />", {
          class: `item-draggable ${
            Types.isUniqueRing(this.player.ring1Name, this.player.ring1Bonus) ? "item-unique" : ""
          }`,
          css: {
            "background-image": `url("${this.getIconPath(this.player.ring1Name)}")`,
          },
          "data-item": this.player.ring1Name,
          "data-level": this.player.ring1Level,
          "data-bonus": toString(this.player.ring1Bonus),
        }),
      );
    }

    if (this.player.ring2Name) {
      $(".item-ring2").append(
        $("<div />", {
          class: `item-draggable ${
            Types.isUniqueRing(this.player.ring2Name, this.player.ring2Bonus) ? "item-unique" : ""
          }`,
          css: {
            "background-image": `url("${this.getIconPath(this.player.ring2Name)}")`,
          },
          "data-item": this.player.ring2Name,
          "data-level": this.player.ring2Level,
          "data-bonus": toString(this.player.ring2Bonus),
        }),
      );
    }

    if (this.player.amuletName) {
      $(".item-amulet").append(
        $("<div />", {
          class: `item-draggable ${Types.isUniqueAmulet(this.player.amuletName) ? "item-unique" : ""}`,
          css: {
            "background-image": `url("${this.getIconPath(this.player.amuletName)}")`,
          },
          "data-item": this.player.amuletName,
          "data-level": this.player.amuletLevel,
          "data-bonus": toString(this.player.amuletBonus),
        }),
      );
    }

    this.updateInventory();
    this.updateRequirement();
  }

  updateInventory() {
    if ($("#inventory").hasClass("visible")) {
      $("#inventory .item-draggable.ui-draggable").draggable("destroy");
    }

    // @TODO instead of empty-ing, compare and replace
    $(".item-inventory").empty();

    this.player.inventory.forEach(({ slot, ...item }) => {
      $(`#item-inventory .item-slot:eq(${slot})`).append(this.createItemDiv(item));
    });

    if ($("#inventory").hasClass("visible")) {
      this.initDraggable();
    }

    this.updateRequirement();
  }

  updateStash() {
    if ($("#stash").hasClass("visible")) {
      $("#stash .item-draggable.ui-draggable").draggable("destroy");
    }

    // @TODO instead of empty-ing, compare and replace
    $(".item-stash").empty();

    this.player.stash.forEach(({ slot, ...item }) => {
      $(`#item-stash .item-slot:eq(${slot})`).append(this.createItemDiv(item));
    });

    if ($("#stash").hasClass("visible")) {
      this.initDraggable();
    }

    this.updateRequirement();
  }

  updateRequirement() {
    var self = this;

    $("[data-requirement]").each(function () {
      const requirement = $(this).data("requirement");

      let backgroundColor = "inherit";
      if (requirement > self.player.level) {
        backgroundColor = "rgba(158, 0, 0, 0.5)";
      }
      $(this).css("background-color", backgroundColor);
    });
  }

  initUpgrade() {
    $("#upgrade-scroll").empty();
    for (var i = 1; i < 10; i++) {
      $("#upgrade-scroll").append(
        `<div class="item-slot item-scroll item-recipe" data-slot="${UPGRADE_SLOT_RANGE + i}"></div>`,
      );
    }
    $("#upgrade-item")
      .empty()
      .append(
        `<div class="item-slot item-upgrade item-weapon item-armor item-ring item-amulet item-belt item-cape item-shield item-chest" data-slot="${UPGRADE_SLOT_RANGE}"></div>`,
      );
    $("#upgrade-result")
      .empty()
      .append(`<div class="item-slot item-upgraded" data-slot="${UPGRADE_SLOT_RANGE + UPGRADE_SLOT_COUNT - 1}"></div>`);
  }

  initTrade() {
    $("#trade-player1-item").empty();
    $("#trade-player2-item").empty();

    for (var i = 0; i < 9; i++) {
      $("#trade-player1-item").append(
        `<div class="item-slot item-trade item-weapon item-armor item-ring item-amulet item-belt item-cape item-shield item-chest item-scroll" data-slot="${
          TRADE_SLOT_RANGE + i
        }"></div>`,
      );
      $("#trade-player2-item").append(`<div class="item-slot item-trade"></div>`);
    }
  }

  updateTradePlayer1(isDraggable = true) {
    if ($("#trade").hasClass("visible")) {
      $("#trade-player1-item .item-draggable.ui-draggable").draggable("destroy");
    }

    $("#trade-player1-item .item-trade").empty();

    this.player.tradePlayer1.forEach(({ slot, ...item }) => {
      $(`#trade-player1-item .item-slot:eq(${slot})`).append(this.createItemDiv(item, isDraggable));
    });

    // @TODO Validate this class, unable to trade
    $("#trade-player1-item .item-trade").toggleClass("item-not-droppable", !isDraggable);

    if ($("#trade").hasClass("visible")) {
      this.initDraggable();
    }

    this.updateRequirement();
  }

  updateTradePlayer2() {
    $("#trade-player2-item .item-trade").empty();

    this.player.tradePlayer2.forEach(({ slot, ...item }) => {
      $(`#trade-player2-item .item-slot:eq(${slot})`).append(this.createItemDiv(item, false));
    });

    this.updateRequirement();
  }

  createItemDiv(
    {
      quantity,
      isUnique,
      item,
      level,
      bonus,
      skill,
      socket,
      requirement,
    }: {
      quantity?: number;
      isUnique: boolean;
      item: string;
      level: number;
      bonus: string;
      skill: any;
      socket: string;
      requirement?: number;
    },
    isDraggable = true,
  ) {
    if (socket) {
      const socketRequirement = Types.getHighestSocketRequirement(JSON.parse(socket));
      if (socketRequirement > requirement) {
        requirement = socketRequirement;
      }
    }

    return $("<div />", {
      class: `${isDraggable ? "item-draggable" : "item-not-draggable"} ${quantity ? "item-quantity" : ""} ${
        isUnique ? "item-unique" : ""
      }`,
      css: {
        "background-image": `url("${this.getIconPath(item, level, toArray(bonus))}")`,
        position: "relative",
      },
      "data-item": item,
      "data-level": level,
      ...(quantity ? { "data-quantity": quantity } : null),
      ...(bonus ? { "data-bonus": toString(bonus) } : null),
      ...(socket ? { "data-socket": toString(socket) } : null),
      ...(skill ? { "data-skill": skill } : null),
      ...(requirement ? { "data-requirement": requirement } : null),
    });
  }

  updateUpgrade({ luckySlot, isSuccess }) {
    if ($("#inventory").hasClass("visible")) {
      $("#upgrade .item-draggable.ui-draggable").draggable("destroy");
    }

    $(".item-upgrade").empty();
    $(".item-upgraded").empty();

    $("#upgrade .item-slot").removeClass("item-upgrade-success-slot item-upgrade-fail-slot");
    if (luckySlot) {
      $(`#upgrade .item-slot:eq(${luckySlot})`).addClass("item-upgrade-success-slot");
      $(".item-scroll").find("> div").addClass("item-faded");
    } else {
      $(".item-scroll").empty();
    }

    if (isSuccess) {
      $("#upgrade-result .item-slot").addClass("item-upgrade-success-slot");
    } else if (isSuccess === false) {
      $("#upgrade-result .item-slot").addClass("item-upgrade-fail-slot");
    }

    let successRate;
    let itemLevel;
    let itemName;
    let itemBonus;
    let actionText = "upgrade";

    this.player.upgrade.forEach(({ item, level, quantity, slot, bonus, skill, socket, isUnique }) => {
      if (slot === 0 && level) {
        itemLevel = level;
        itemName = item;
        itemBonus = bonus;
        const successRates = Types.getUpgradeSuccessRates();
        successRate = successRates[parseInt(level) - 1];
      } else if (slot) {
        if (itemName && item.startsWith("scrolltransmute")) {
          const { transmuteSuccessRate, uniqueSuccessRate } = Types.getTransmuteSuccessRate(itemName, itemBonus) || {};
          successRate = transmuteSuccessRate || uniqueSuccessRate;
          actionText = "transmute";
        } else if (!item.startsWith("scrollupgrade")) {
          successRate = null;
        } else if (itemLevel && (item.startsWith("scrollupgradeblessed") || item.startsWith("scrollupgradesacred"))) {
          const blessedRates = Types.getBlessedSuccessRateBonus();
          const blessedRate = blessedRates[parseInt(itemLevel) - 1];
          successRate += blessedRate;
        }
      }

      $(`#upgrade .item-slot:eq(${slot})`)
        .removeClass("item-droppable")
        .append(this.createItemDiv({ quantity, isUnique, item, level, bonus, skill, socket }));
    });

    $("#upgrade-info").html(successRate ? `${successRate}% chance of successful ${actionText}` : "&nbsp;");

    if ($("#upgrade").hasClass("visible")) {
      this.initDraggable();
    }
  }

  initStash() {
    $("#item-stash").empty();

    let counter = STASH_SLOT_RANGE;

    for (var i = 0; i < STASH_SLOT_PAGES; i++) {
      $("#item-stash").append(
        `<div class="item-stash-page page-${i} ${i === this.currentStashPage ? "visible" : ""}"></div>`,
      );

      for (var ii = 0; ii < STASH_SLOT_PER_PAGE; ii++) {
        $(`#item-stash .item-stash-page.page-${i}`).append(
          `<div class="item-slot item-stash item-droppable" data-slot="${counter}"></div>`,
        );
        counter++;
      }
    }

    const togglePage = () => {
      $(".item-stash-page").removeClass("visible");
      $(`.item-stash-page.page-${this.currentStashPage}`).addClass("visible");
      $("#current-stash-page").text(this.currentStashPage + 1);

      previousButton.toggleClass("disabled btn-gray", this.currentStashPage === 0);
      nextButton.toggleClass("disabled btn-gray", this.currentStashPage >= STASH_SLOT_PAGES - 1);
    };

    const previousButton = $("#item-stash-previous-page");
    const nextButton = $("#item-stash-next-page");

    previousButton.off("click").on("click", () => {
      if (this.currentStashPage > 0) {
        this.currentStashPage--;
        togglePage();
      }
    });

    nextButton.off("click").on("click", () => {
      if (this.currentStashPage < STASH_SLOT_PAGES - 1) {
        this.currentStashPage++;
        togglePage();
      }
    });

    togglePage();

    // @TODO Bind prev/next buttons

    this.updateStash();
  }

  useSkill(slot) {
    if (document.activeElement.tagName === "INPUT") return;

    let mobId = 0;

    // No skill / timeout is not finished
    if (slot === 1) {
      const { x, y } = this.getMouseGridPosition();
      const entity = this.getEntityAt(x, y);
      mobId = entity?.id;

      // Can't cast on self
      if (!mobId || mobId === this.player.id || Types.isNpc(entity.kind)) return;
      // Can't cast on other players with many level difference
      if (mobId && entity instanceof Player && (entity.level < 9 || Math.abs(entity.level - this.player.level) <= 10)) {
        this.chat_callback({
          message: "You can't attack a player below level 9 or with more than 10 level difference to yours",
          type: "error",
        });
        return;
      }

      if (this.player.attackSkillTimeout || typeof this.player.attackSkill !== "number" || !mobId) {
        return;
      }

      this.player.setSkillTargetId(mobId);
    } else if (slot === 2 && (this.player.defenseSkillTimeout || typeof this.player.defenseSkill !== "number")) return;

    const isAttackSkill = slot === 1;
    const skillName = isAttackSkill
      ? Types.attackSkillTypeAnimationMap[this.player.attackSkill]
      : Types.defenseSkillTypeAnimationMap[this.player.defenseSkill];
    const originalTimeout = isAttackSkill
      ? Math.floor(Types.attackSkillDelay[this.player.attackSkill])
      : Math.floor(Types.defenseSkillDelay[this.player.defenseSkill]);
    const timeout = Math.round(
      originalTimeout - originalTimeout * (Types.calculateSkillTimeout(this.player.bonus.skillTimeout) / 100),
    );

    const skillSlot = $(`[data-skill-slot="${slot}"]`);
    skillSlot
      .addClass("disabled")
      .find(".skill-timeout")
      .addClass(`active ${skillName}`)
      .attr("style", `transition: width ${timeout / 1000}s linear;`);

    if (isAttackSkill) {
      // this.player.setAttackSkillAnimation(skillName, Types.attackSkillDurationMap[this.player.attackSkill]());
      this.player.attackSkillTimeout = setTimeout(() => {
        skillSlot.removeClass("disabled").find(".skill-timeout").attr("class", "skill-timeout").attr("style", "");
        if (this.player) {
          this.player.attackSkillTimeout = null;
        }
      }, timeout);
    } else {
      if (this.player.defenseSkill === 2) {
        this.skillResistanceAnimation.reset();
      } else {
        this.defenseSkillAnimation.reset();
      }
      this.player.setDefenseSkillAnimation(
        skillName,
        Types.defenseSkillDurationMap[this.player.defenseSkill](this.player.shieldLevel),
      );
      this.player.defenseSkillTimeout = setTimeout(() => {
        skillSlot.removeClass("disabled").find(".skill-timeout").attr("class", "skill-timeout").attr("style", "");
        this.player.defenseSkillTimeout = null;
      }, timeout);
    }

    this.audioManager.playSound(`skill-${skillName}`);
    this.client.sendSkill(slot, mobId);
  }

  setDefenseSkill(skill) {
    const skillName = Types.defenseSkillTypeAnimationMap[skill] || null;
    $("#skill-defense").attr("class", skillName ? `skill-${skillName}` : null);
  }

  setAttackSkill(skill) {
    const skillName = Types.attackSkillTypeAnimationMap[skill] || null;
    $("#skill-attack").attr("class", skillName ? `skill-${skillName}` : null);
  }

  initAchievements() {
    var self = this;

    this.achievements = getAchievements(self.network);

    _.each(this.achievements, function (obj) {
      if (!obj.isCompleted) {
        obj.isCompleted = function () {
          return true;
        };
      }
      if (!obj.hidden) {
        obj.hidden = false;
      }
    });

    this.app.initAchievementList(this.achievements);

    const unlockedAchievementIds = this.storage.data.achievement
      .map((unlocked, index) => (unlocked ? index + 1 : false))
      .filter(Boolean);

    const totalPayout = unlockedAchievementIds.reduce((acc, id) => {
      const achievement: any = Object.values(self.achievements)[id - 1];
      acc += achievement?.[this.network] || 0;
      return acc;
    }, 0);

    this.app.initUnlockedAchievements(unlockedAchievementIds, totalPayout);
  }

  getAchievementById(id) {
    var found = null;
    _.each(this.achievements, function (achievement) {
      if (achievement.id === parseInt(id)) {
        found = achievement;
      }
    });
    return found;
  }

  initWaypoints(waypoints) {
    $("#waypoint-list").empty();
    var self = this;

    if (Array.isArray(waypoints)) {
      waypoints.forEach((status, i) => {
        // Statuses
        // 0, disabled
        // 1, available
        // 2, locked (no expansion)
        let statusClass = "";
        if (status === 0) {
          statusClass = "disabled";
        } else if (status === 2) {
          statusClass = "locked disabled expansion1";
        }

        $("<div/>", {
          id: `waypoint-${Types.waypoints[i].id}`,
          "data-waypoint-id": Types.waypoints[i].id,
          class: `waypoint-spaced-row waypoint-row ${statusClass}`,
          html: `
            <div class="waypoint-icon"></div>
            <div class="waypoint-text">${Types.waypoints[i].name}</div>
            `,
          click(e) {
            e.preventDefault();
            e.stopPropagation();

            // Only teleport to enabled locations
            if ($(this).hasClass("locked") || $(this).hasClass("disabled") || $(this).hasClass("active")) return;

            const id = parseInt($(this).data("waypoint-id"));
            const clickedWaypoint = Types.waypoints.find(({ id: waypointId }) => waypointId === id);

            // Waypoint has to be enabled
            if (clickedWaypoint && self.player.waypoints[id - 1] === 1) {
              const { gridX, gridY } = clickedWaypoint;
              self.app.closeWaypoint();
              self.player.stop_pathing_callback({ x: gridX + 1, y: gridY, isWaypoint: true });
              $("#foreground").off(".waypoint");
            }
          },
        }).appendTo("#waypoint-list");
      });
    }
  }

  activateWaypoint(id) {
    $(`#waypoint-${id}`).removeClass("disabled locked").addClass("active");
  }

  loadSprite(name) {
    if (this.renderer.upscaledRendering) {
      this.spritesets[0][name] = new Sprite(name, 1);
    } else {
      this.spritesets[1][name] = new Sprite(name, 2);
      if (!this.renderer.mobile && !this.renderer.tablet) {
        this.spritesets[2][name] = new Sprite(name, 3);
      }
    }
  }

  setSpriteScale(scale) {
    var self = this;

    if (this.renderer.upscaledRendering) {
      this.sprites = this.spritesets[0];
    } else {
      this.sprites = this.spritesets[scale - 1];

      _.each(this.entities, function (entity: Entity) {
        entity.sprite = null;
        entity.setSprite(self.sprites[entity.getSpriteName()]);
      });
      this.initHurtSprites();
      this.initShadows();
      this.initCursors();
    }
  }

  loadSprites() {
    console.info("Loading sprites...");
    this.spritesets = [];
    this.spritesets[0] = {};
    this.spritesets[1] = {};
    this.spritesets[2] = {};
    _.map(this.spriteNames, this.loadSprite.bind(this));
  }

  spritesLoaded() {
    if (
      _.some(this.sprites, function (sprite: any) {
        return !sprite.isLoaded;
      })
    ) {
      return false;
    }
    return true;
  }

  setCursor(name, orientation = Types.Orientations.DOWN) {
    if (name in this.cursors) {
      this.currentCursor = this.cursors[name];
      this.currentCursorOrientation = orientation;
    } else {
      console.error("Unknown cursor name :" + name);
    }
  }

  updateCursorLogic() {
    if (this.hoveringCollidingTile && this.started) {
      this.targetColor = "rgba(255, 50, 50, 0.5)";
    } else {
      this.targetColor = "rgba(255, 255, 255, 0.5)";
    }

    if (this.hoveringPlayer && this.started) {
      if (this.pvpFlag) this.setCursor("attack");
      else this.setCursor("hand");
      this.hoveringTarget = false;
      this.hoveringMob = false;
      this.targetCellVisible = false;
    } else if (this.hoveringMob && this.started) {
      this.setCursor("attack");
      this.hoveringTarget = false;
      this.hoveringPlayer = false;
      this.targetCellVisible = false;
    } else if (this.hoveringNpc && this.started) {
      this.setCursor("talk");
      this.hoveringTarget = false;
      this.targetCellVisible = false;
    } else if ((this.hoveringItem || this.hoveringChest) && this.started) {
      this.setCursor("loot");
      this.hoveringTarget = false;
      this.targetCellVisible = true;
    } else {
      this.setCursor("hand");
      this.hoveringTarget = false;
      this.hoveringPlayer = false;
      this.targetCellVisible = true;
    }
  }

  focusPlayer() {
    this.renderer.camera.lookAt(this.player);
  }

  addEntity(entity) {
    var self = this;

    if (this.entities[entity.id] === undefined) {
      this.entities[entity.id] = entity;
      this.registerEntityPosition(entity);

      if (
        !(entity instanceof Item && entity.wasDropped) &&
        !(this.renderer.mobile || this.renderer.tablet) &&
        entity.kind !== Types.Entities.ZOMBIE
      ) {
        if (entity.isFading) {
          entity.fadeIn(this.currentTime);
        }
      }

      if (this.renderer.mobile || this.renderer.tablet) {
        entity.onDirty(function (e) {
          if (self.camera.isVisible(e)) {
            e.dirtyRect = self.renderer.getEntityBoundingRect(e);
            self.checkOtherDirtyRects(e.dirtyRect, e, e.gridX, e.gridY);
          }
        });
      }
    } else {
      console.error("This entity already exists : " + entity.id + " (" + entity.kind + ")");
    }
  }

  removeEntity(entity) {
    if (entity.id in this.entities) {
      this.unregisterEntityPosition(entity);
      delete this.entities[entity.id];
    } else {
      console.error("Cannot remove entity. Unknown ID : " + entity.id);
    }
  }

  addItem(item, x, y) {
    item.setSprite(this.sprites[item.getSpriteName()]);
    item.setGridPosition(x, y);
    item.setAnimation("idle", 150);
    this.addEntity(item);
  }

  removeItem(item) {
    if (item) {
      this.removeFromItemGrid(item, item.gridX, item.gridY);
      this.removeFromRenderingGrid(item, item.gridX, item.gridY);
      delete this.entities[item.id];
    } else {
      console.error("Cannot remove item. Unknown ID : " + item.id);
    }
  }

  initPathingGrid() {
    this.pathingGrid = [];
    for (var i = 0; i < this.map.height; i += 1) {
      this.pathingGrid[i] = [];
      for (var j = 0; j < this.map.width; j += 1) {
        this.pathingGrid[i][j] = this.map.grid[i][j];
      }
    }
    console.info("Initialized the pathing grid with static colliding cells.");
  }

  initEntityGrid() {
    this.entityGrid = [];
    for (var i = 0; i < this.map.height; i += 1) {
      this.entityGrid[i] = [];
      for (var j = 0; j < this.map.width; j += 1) {
        this.entityGrid[i][j] = {};
      }
    }
    console.info("Initialized the entity grid.");
  }

  initRenderingGrid() {
    this.renderingGrid = [];
    for (var i = 0; i < this.map.height; i += 1) {
      this.renderingGrid[i] = [];
      for (var j = 0; j < this.map.width; j += 1) {
        this.renderingGrid[i][j] = {};
      }
    }
    console.info("Initialized the rendering grid.");
  }

  initItemGrid() {
    this.itemGrid = [];
    for (var i = 0; i < this.map.height; i += 1) {
      this.itemGrid[i] = [];
      for (var j = 0; j < this.map.width; j += 1) {
        this.itemGrid[i][j] = {};
      }
    }
    console.info("Initialized the item grid.");
  }

  /**
   *
   */
  initAnimatedTiles() {
    var self = this,
      m = this.map;

    this.animatedTiles = [];
    this.highAnimatedTiles = [];
    this.forEachVisibleTile(function (id, index) {
      if (m.isAnimatedTile(id)) {
        var tile = new AnimatedTile(
            id,
            m.getTileAnimationLength(id),
            m.getTileAnimationDelay(id),
            m.getTileAnimationSkip(id),
            index,
          ),
          pos = self.map.tileIndexToGridPosition(tile.index);

        tile.x = pos.x;
        tile.y = pos.y;

        if (m.isHighTile(id)) {
          self.highAnimatedTiles.push(tile);
        } else {
          self.animatedTiles.push(tile);
        }
      }
    }, 1);
    //console.info("Initialized animated tiles.");
  }

  addToRenderingGrid(entity, x, y) {
    if (!this.map.isOutOfBounds(x, y)) {
      this.renderingGrid[y][x][entity.id] = entity;
    }
  }

  removeFromRenderingGrid(entity, x, y) {
    if (entity && this.renderingGrid[y][x] && entity.id in this.renderingGrid[y][x]) {
      delete this.renderingGrid[y][x][entity.id];
    }
  }

  removeFromEntityGrid(entity, x, y) {
    if (this.entityGrid[y][x][entity.id]) {
      delete this.entityGrid[y][x][entity.id];
    }
  }

  removeFromItemGrid(item, x, y) {
    if (item && this.itemGrid[y][x][item.id]) {
      delete this.itemGrid[y][x][item.id];
    }
  }

  removeFromPathingGrid(x, y) {
    this.pathingGrid[y][x] = 0;
  }

  /**
   * Registers the entity at two adjacent positions on the grid at the same time.
   * This situation is temporary and should only occur when the entity is moving.
   * This is useful for the hit testing algorithm used when hovering entities with the mouse cursor.
   *
   * @param {Entity} entity The moving entity
   */
  registerEntityDualPosition(entity) {
    if (entity) {
      this.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

      this.addToRenderingGrid(entity, entity.gridX, entity.gridY);

      if (entity.nextGridX >= 0 && entity.nextGridY >= 0) {
        this.entityGrid[entity.nextGridY][entity.nextGridX][entity.id] = entity;
        if (!(entity instanceof Player)) {
          this.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
        }
      }
    }
  }

  /**
   * Clears the position(s) of this entity in the entity grid.
   *
   * @param {Entity} entity The moving entity
   */
  unregisterEntityPosition(entity) {
    if (entity) {
      this.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
      this.removeFromPathingGrid(entity.gridX, entity.gridY);
      this.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);

      if (entity.nextGridX >= 0 && entity.nextGridY >= 0) {
        this.removeFromEntityGrid(entity, entity.nextGridX, entity.nextGridY);
        this.removeFromPathingGrid(entity.nextGridX, entity.nextGridY);
      }
    }
  }

  registerEntityPosition(entity) {
    var x = entity.gridX;
    var y = entity.gridY;

    if (entity) {
      if (entity instanceof Character || entity instanceof Chest) {
        this.entityGrid[y][x][entity.id] = entity;

        if (!(entity instanceof Player) && !(entity instanceof Spell)) {
          this.pathingGrid[y][x] = 1;
        }

        // @NOTE: MagicStones/PortalDeathAngel takes 2 tiles
        if (
          entity.kind === Types.Entities.MAGICSTONE ||
          entity.kind === Types.Entities.PORTALDEATHANGEL ||
          entity.kind === Types.Entities.ALTARCHALICE ||
          entity.kind === Types.Entities.ALTARINFINITYSTONE
        ) {
          this.entityGrid[y][x + 1][entity.id] = entity;
          this.pathingGrid[y][x + 1] = 1;
        }
        if (entity.kind === Types.Entities.ALTARCHALICE || entity.kind === Types.Entities.ALTARINFINITYSTONE) {
          this.entityGrid[y][x + 2][entity.id] = entity;
          this.pathingGrid[y][x + 2] = 1;
        }
      }
      if (entity instanceof Item) {
        this.itemGrid[y][x][entity.id] = entity;
      }

      this.addToRenderingGrid(entity, x, y);
    }
  }

  setPlayerAccount(username, account, network, password) {
    this.username = username;
    this.account = account;
    this.network = network;
    this.explorer = network === "nano" ? "nanolooker" : "bananolooker";
    this.password = password;
  }

  setServerOptions(host, port) {
    this.host = host;
    this.port = port;
  }

  loadAudio() {
    this.audioManager = new AudioManager(this);
  }

  initMusicAreas() {
    var self = this;

    _.each(this.map.musicAreas, function (area) {
      self.audioManager.addArea(area.x, area.y, area.w, area.h, area.id);
    });
  }

  run() {
    var self = this;

    return new Promise(resolve => {
      if (self.isLoaded) {
        resolve(true);
        return;
      }

      this.loadSprites();
      // @ts-ignore
      this.setUpdater(new Updater(this));
      this.camera = this.renderer.camera;

      this.setSpriteScale(this.renderer.scale);

      var wait = setInterval(function () {
        if (self.map.isLoaded && self.spritesLoaded()) {
          self.ready = true;
          console.debug("All sprites loaded.");

          self.loadAudio();

          self.initMusicAreas();
          self.initCursors();
          self.initAnimations();
          self.initShadows();
          self.initHurtSprites();

          if (!self.renderer.mobile && !self.renderer.tablet && self.renderer.upscaledRendering) {
            self.initSilhouettes();
          }

          self.initEntityGrid();
          self.initItemGrid();
          self.initPathingGrid();
          self.initRenderingGrid();

          self.setPathfinder(new Pathfinder(self.map.width, self.map.height));
          self.setCursor("hand");

          clearInterval(wait);
          self.isLoaded = true;
          resolve(true);
        }
      }, 100);
    });
  }

  tick() {
    this.currentTime = new Date().getTime();

    if (this.started) {
      this.updateCursorLogic();
      this.updater.update();
      this.renderer.renderFrame();
    }

    if (!this.isStopped) {
      window.requestAnimFrame(this.tick.bind(this));
    }
  }

  start() {
    this.tick();
    this.hasNeverStarted = false;
    console.info("Game loop started.");
  }

  stop() {
    console.info("Game stopped.");
    this.isStopped = true;
  }

  entityIdExists(id) {
    return id in this.entities;
  }

  getEntityById(id) {
    if (id in this.entities) {
      return this.entities[id];
    } else {
      // console.error("Unknown entity id : " + id, true);
    }
  }

  async connect(action, started_callback) {
    var self = this;

    await self.run();

    this.client = new GameClient(this.host, this.port);
    this.client.fail_callback = function (reason) {
      started_callback({
        success: false,
        reason: reason,
      });
      self.started = false;
    };

    this.client.connect(false);

    this.client.onDispatched(function (host, port) {
      console.debug("Dispatched to game server " + host + ":" + port);

      self.client.host = host;
      self.client.port = port;
      self.client.connect(); // connect to actual game server
    });

    this.client.onConnected(function () {
      console.info("Starting client/server handshake");

      self.player.name = self.username;
      self.player.account = self.account;
      self.player.network = self.network;
      self.started = true;

      if (action === "create") {
        self.client.sendCreate({ name: self.username, account: self.account });
      } else {
        self.client.sendLogin({
          name: self.username,
          account: self.account,
          password: self.password,
        });
      }
    });

    this.client.onEntityList(function (list) {
      var entityIds = _.map(self.entities, "id"),
        knownIds = _.intersection(entityIds, list),
        newIds = _.difference(list, knownIds);

      self.obsoleteEntities = _.reject(self.entities, function (entity: Entity) {
        return _.includes(knownIds, entity.id) || entity.id === self.player.id;
      });

      // Destroy entities outside of the player's zone group
      self.removeObsoleteEntities();

      // Ask the server for spawn information about unknown entities
      if (_.size(newIds) > 0) {
        self.client.sendWho(newIds);
      }
    });

    this.client.onWelcome(function ({
      id,
      name,
      x,
      y,
      hp,
      armor,
      weapon,
      belt,
      cape,
      shield,
      ring1,
      ring2,
      amulet,
      experience,
      achievement,
      inventory,
      stash,
      hash,
      nanoPotions,
      gems,
      artifact,
      expansion1,
      expansion2,
      waypoints,
      depositAccount,
      auras,
      cowLevelPortalCoords,
      party,
      settings,
      network,
    }) {
      // @ts-ignore
      self.app.start();

      Sentry.configureScope(scope => {
        // scope.setTag("name", name);
        scope.setUser({ username: name });
      });

      console.info("Received player ID from server : " + id);
      self.player.id = id;
      self.playerId = id;
      // Always accept name received from the server which will
      // sanitize and shorten names exceeding the allowed length.
      self.player.name = name;
      self.player.network = network;

      var [armor, armorLevel, armorBonus, armorSocket] = armor.split(":");
      var [weapon, weaponLevel, weaponBonus, weaponSocket, attackSkill] = weapon.split(":");
      var [shield, shieldLevel, shieldBonus, shieldSocket, defenseSkill] = (shield || "").split(":");

      self.storage.setPlayerName(name);
      self.storage.setPlayerArmor(armor);
      self.storage.setPlayerWeapon(weapon);
      self.storage.setAchievement(achievement);

      self.player.setGridPosition(x, y);
      self.player.setMaxHitPoints(hp);
      self.player.setArmorName(armor);
      self.player.setArmorLevel(armorLevel);
      self.player.setArmorBonus(armorBonus);
      self.player.setArmorSocket(armorSocket);
      self.player.setSpriteName(armor);
      self.player.setWeaponName(weapon);
      self.player.setWeaponLevel(weaponLevel);
      self.player.setWeaponBonus(weaponBonus);
      self.player.setWeaponSocket(weaponSocket);
      self.player.setBelt(belt);
      self.player.setCape(cape);
      self.player.setShieldName(shield);
      self.player.setShieldLevel(shieldLevel);
      self.player.setShieldBonus(shieldBonus);
      self.player.setShieldSocket(shieldSocket);
      self.player.setDefenseSkill(defenseSkill);
      self.setDefenseSkill(defenseSkill);
      self.player.setAttackSkill(attackSkill);
      self.setAttackSkill(attackSkill);

      self.player.setRing1(ring1);
      self.player.setRing2(ring2);
      self.player.setAmulet(amulet);
      self.player.setAuras(auras);
      self.initPlayer();
      self.player.experience = experience;
      self.player.level = Types.getLevel(experience);
      self.player.setInventory(inventory);
      self.player.setStash(stash);

      self.initSettings(settings);
      self.toggleCapeSliders(!!cape);
      self.updateBars();
      self.updateExpBar();
      self.resetCamera();
      self.updatePlateauMode();
      self.audioManager.updateMusic();
      self.initAchievements();
      self.initInventory();
      self.initUpgrade();
      self.initTrade();
      self.initStash();
      self.initTooltips();
      self.initSendUpgradeItem();
      self.initUpgradeItemPreview();
      self.initWaypoints(waypoints);

      self.store.depositAccount = depositAccount;

      self.player.nanoPotions = nanoPotions;
      self.player.gems = gems;
      self.player.artifact = artifact;
      self.player.expansion1 = expansion1;
      self.player.expansion2 = expansion2;
      self.player.waypoints = waypoints;
      self.player.skeletonKey = !!achievement[26];
      self.cowLevelPortalCoords = cowLevelPortalCoords;

      if (party) {
        const { partyId, partyLeader, members } = party;

        self.player.setPartyId(partyId);
        self.player.setPartyLeader(partyLeader);
        self.player.setPartyMembers(members);
      }
      self.addEntity(self.player);
      self.player.dirtyRect = self.renderer.getEntityBoundingRect(self.player);

      setTimeout(function () {
        self.tryUnlockingAchievement("STILL_ALIVE");
      }, 1500);

      self.app.updateNanoPotions(nanoPotions);
      self.app.updateGems(gems);
      self.app.updateArtifact(artifact);
      self.app.initPlayerInfo();
      self.app.initNanoPotions();
      self.app.initTradePlayer1StatusButton();

      self.storage.initPlayer(self.player.name, self.player.account);
      self.storage.savePlayer(self.renderer.getPlayerImage(), self.player.getSpriteName(), self.player.getWeaponName());

      if (!self.storage.hasAlreadyPlayed() || self.player.level === 1) {
        self.showNotification(`Welcome to ${network === "nano" ? "Nano" : "Banano"} BrowserQuest!`);
        self.app.toggleInstructions();
      } else {
        self.showNotification("Welcome Back. You are level " + self.player.level + ".");
        // self.storage.setPlayerName(name);
      }

      if (hash) {
        self.gamecompleted_callback({ hash, fightAgain: false });
      }

      // @NOTE possibly optimize this? sending request to move items to inventory
      self.client.sendMoveItemsToInventory("upgrade");
      self.client.sendMoveItemsToInventory("trade");

      self.player.onStartPathing(function (path) {
        var i = path.length - 1,
          x = path[i][0],
          y = path[i][1];

        if (self.player.isMovingToLoot()) {
          self.player.isLootMoving = false;
        } else if (!self.player.isAttacking()) {
          self.client.sendMove(x, y);
        }

        // Target cursor position
        self.selectedX = x;
        self.selectedY = y;

        self.selectedCellVisible = true;

        if (self.renderer.mobile || self.renderer.tablet) {
          self.drawTarget = true;
          self.clearTarget = true;
          self.renderer.targetRect = self.renderer.getTargetBoundingRect();
          self.checkOtherDirtyRects(self.renderer.targetRect, null, self.selectedX, self.selectedY);
        }
      });

      self.player.onCheckAggro(function () {
        self.forEachMob(function (mob) {
          if (mob.isAggressive && !mob.isAttacking() && self.player.isNear(mob, mob.aggroRange) && !mob.isRaising()) {
            self.player.aggro(mob);
          }
        });
      });

      self.player.onAggro(function (mob) {
        if (!self.player.isDead && !mob.isWaitingToAttack(self.player) && !self.player.isAttackedBy(mob)) {
          self.player.log_info("Aggroed by " + mob.id + " at (" + self.player.gridX + ", " + self.player.gridY + ")");
          self.client.sendAggro(mob);
          mob.waitToAttack(self.player);
        }
      });

      self.player.onBeforeStep(function () {
        var blockingEntity = self.getEntityAt(self.player.nextGridX, self.player.nextGridY);
        if (blockingEntity && blockingEntity.id !== self.playerId) {
          console.debug("Blocked by " + blockingEntity.id);
        }
        self.unregisterEntityPosition(self.player);
      });

      self.player.onStep(function () {
        if (self.player.hasNextStep()) {
          self.registerEntityDualPosition(self.player);
        }

        if (self.isZoningTile(self.player.gridX, self.player.gridY)) {
          self.isCharacterZoning = true;
          self.enqueueZoningFrom(self.player.gridX, self.player.gridY);
        }

        self.player.forEachAttacker(self.makeAttackerFollow);

        var item = self.getItemAt(self.player.gridX, self.player.gridY);
        if (item instanceof Item) {
          self.tryLootingItem(item);
        }

        if (
          (self.player.gridX <= 85 && self.player.gridY <= 179 && self.player.gridY > 178) ||
          (self.player.gridX <= 85 && self.player.gridY <= 266 && self.player.gridY > 265)
        ) {
          self.tryUnlockingAchievement("INTO_THE_WILD");
        }

        if (self.player.gridX <= 85 && self.player.gridY <= 293 && self.player.gridY > 292) {
          self.tryUnlockingAchievement("AT_WORLDS_END");
        }

        if (self.player.gridX <= 85 && self.player.gridY <= 100 && self.player.gridY > 99) {
          self.tryUnlockingAchievement("NO_MANS_LAND");
        }

        if (self.player.gridX <= 85 && self.player.gridY <= 51 && self.player.gridY > 50) {
          self.tryUnlockingAchievement("HOT_SPOT");
        }

        if (self.player.gridX <= 27 && self.player.gridY <= 123 && self.player.gridY > 112) {
          self.tryUnlockingAchievement("TOMB_RAIDER");
        }

        if (self.player.gridY > 444) {
          self.tryUnlockingAchievement("FREEZING_LANDS");
        }

        if (self.player.gridY >= 350 && self.player.gridY <= 365 && self.player.gridX <= 80) {
          self.tryUnlockingAchievement("WALK_ON_WATER");
        }

        if (
          self.player.gridY >= 328 &&
          self.player.gridY <= 332 &&
          self.player.gridX >= 13 &&
          self.player.gridX <= 23
        ) {
          self.tryUnlockingAchievement("WEN");
        }

        self.updatePlayerCheckpoint();

        if (!self.player.isDead) {
          self.audioManager.updateMusic();
        }
      });

      self.player.onStopPathing(function ({ x, y, confirmed, isWaypoint }) {
        // Start by unregistering the entity at its previous coords
        self.unregisterEntityPosition(self.player);

        if (isWaypoint) {
          // Make sure the character is paused / halted when entering a waypoint, else the player goes invisible
          self.player.stop();
          self.player.nextStep();
        }

        if (self.player.hasTarget()) {
          self.player.lookAtTarget();
        }

        self.selectedCellVisible = false;

        if (self.isItemAt(x, y)) {
          var item = self.getItemAt(x, y);
          self.tryLootingItem(item);
        }

        const isDoor = !isWaypoint && self.map.isDoor(x, y);
        if ((!self.player.hasTarget() && isDoor) || isWaypoint) {
          // Close all when teleporting
          self.app.hideWindows();

          var dest = isWaypoint ? { x, y, orientation: Types.Orientations.DOWN } : self.map.getDoorDestination(x, y);
          if (!confirmed && x === 71 && y === 21 && dest.x === 155 && dest.y === 96) {
            self.client.sendBossCheck(false);
            return;
          }

          var desty = dest.y;

          // @TODO Fix this...
          // if (self.renderer.mobile) {
          //push them off the door spot so they can use the
          //arrow keys and mouse to walk back in or out
          if (dest.orientation === Types.Orientations.UP) {
            desty--;
          } else if (dest.orientation === Types.Orientations.DOWN) {
            desty++;
          }
          // }

          self.player.setGridPosition(dest.x, desty);
          self.player.nextGridX = dest.x;
          self.player.nextGridY = desty;
          self.player.turnTo(dest.orientation);
          self.player.idle();
          self.client.sendTeleport(dest.x, desty);

          if (self.renderer.mobile && dest.cameraX && dest.cameraY) {
            self.camera.setGridPosition(dest.cameraX, dest.cameraY);
            self.resetZone();
          } else {
            if (dest.portal) {
              self.assignBubbleTo(self.player);
            } else {
              self.camera.focusEntity(self.player);
              self.resetZone();
            }
          }

          if (_.size(self.player.attackers) > 0) {
            setTimeout(function () {
              self.tryUnlockingAchievement("COWARD");
            }, 500);
          }
          self.player.forEachAttacker(function (attacker) {
            attacker.disengage();
            attacker.idle();
          });

          self.updatePlateauMode();
          self.checkUndergroundAchievement();

          if (self.renderer.mobile || self.renderer.tablet) {
            // When rendering with dirty rects, clear the whole screen when entering a door.
            self.renderer.clearScreen(self.renderer.context);
          }

          if (dest.portal || isWaypoint) {
            self.audioManager.playSound("teleport");
          }

          if (!self.player.isDead) {
            self.audioManager.updateMusic();
          }
        }

        if (self.player.target instanceof Npc && !isWaypoint) {
          self.makeNpcTalk(self.player.target);
        } else if (self.player.target instanceof Chest) {
          if (self.player.target.gridX === 154 && self.player.target.gridY === 365 && !self.player.skeletonKey) {
            // skip playing the chest open sound if the SKELETON_KEY quest is not completed
            self.showNotification("You need to find the Skeleton Key");
            self.audioManager.playSound("noloot");
          } else {
            self.client.sendOpen(self.player.target);
            self.audioManager.playSound("chest");
          }
        }

        self.player.forEachAttacker(function (attacker) {
          if (!attacker.isAdjacentNonDiagonal(self.player)) {
            attacker.follow(self.player);
          }
        });

        self.registerEntityPosition(self.player);
      });

      self.player.onRequestPath(function (x, y) {
        var ignored = [self.player]; // Always ignore self

        if (self.player.hasTarget()) {
          ignored.push(self.player.target);
        }
        return self.findPath(self.player, x, y, ignored);
      });

      self.player.onDeath(function () {
        console.info(self.playerId + " is dead");

        self.player.stopBlinking();
        self.player.setSprite(self.sprites["death"]);
        self.player.animate("death", 120, 1, () => {
          console.info(self.playerId + " was removed");

          self.removeEntity(self.player);
          self.removeFromRenderingGrid(self.player, self.player.gridX, self.player.gridY);

          self.player = null;
          self.client.disable();

          setTimeout(function () {
            self.playerdeath_callback();
          }, 1000);
        });

        clearInterval(self.player.defenseSkillTimeout);
        self.player.defenseSkillTimeout = null;
        $("#skill-defense").removeClass("disabled").find(".skill-timeout").attr("class", "skill-timeout");

        self.player.forEachAttacker(function (attacker) {
          attacker.disengage();
        });

        self.audioManager.fadeOutCurrentMusic();
        self.audioManager.playSound("death");
      });

      self.player.onHasMoved(function (player) {
        self.assignBubbleTo(player);
      });
      self.client.onPVPChange(function (pvpFlag) {
        self.player.flagPVP(pvpFlag);
        if (pvpFlag) {
          self.showNotification("PVP is on.");
        } else {
          self.showNotification("PVP is off.");
        }
      });

      self.player.onSwitchItem(function () {
        self.storage.savePlayer(
          self.renderer.getPlayerImage(),
          self.player.getArmorName(),
          self.player.getWeaponName(),
        );
        if (self.equipment_callback) {
          self.equipment_callback();
        }
      });

      self.player.onInvincibleStart(function () {
        self.invinciblestart_callback();
        self.player.switchArmor(self.sprites["firefox"], 1);
      });

      self.player.onInvincibleStop(function () {
        self.invinciblestop_callback();
      });

      self.client.onSpawnItem(function (item, x, y) {
        self.addItem(item, x, y);
      });

      self.client.onSpawnChest(function (chest, x, y) {
        chest.setSprite(self.sprites[chest.getSpriteName()]);
        chest.setGridPosition(x, y);
        chest.setAnimation("idle_down", 150);
        self.addEntity(chest);

        chest.onOpen(function () {
          chest.stopBlinking();
          chest.setSprite(self.sprites["death"]);
          chest.setAnimation("death", 120, 1, function () {
            console.info(chest.id + " was removed");
            self.removeEntity(chest);
            self.removeFromRenderingGrid(chest, chest.gridX, chest.gridY);
            self.previousClickPosition = null;
          });
        });
      });

      self.client.onSpawnCharacter(function (data) {
        const { id, kind, name, x, y, targetId, orientation, resistances, element, isActivated, bonus } = data;

        let entity = self.getEntityById(id);
        if (!entity) {
          try {
            if (id !== self.playerId) {
              entity = EntityFactory.createEntity({ kind, id, name, resistances });

              if (element) {
                entity.element = element;
              }
              if (bonus?.attackSpeed) {
                entity.setAttackSpeed(bonus?.attackSpeed);
              }

              entity.setSprite(self.sprites[entity.getSpriteName()]);
              if (entity.element && element !== "physical") {
                entity.sprite.image.onload = () => {
                  entity.sprite.createSilhouette();
                };
                entity.sprite.image.src = entity.sprite.image.src.replace(/(-[a-z]+?)?\.png/, `-${element}.png`);
              }
              entity.setGridPosition(x, y);
              entity.setOrientation(orientation);

              if (entity.kind === Types.Entities.ZOMBIE) {
                entity.raise();

                // NOTE wait for the raise animation to complete before chasing players
                setTimeout(() => {
                  entity.aggroRange = 10;
                  entity.isAggressive = true;
                }, 1000);
              } else if (entity.kind === Types.Entities.PORTALCOW && entity.gridX === 43 && entity.gridY === 211) {
                if (self.cowPortalStart) {
                  entity.raise();
                  entity.currentAnimation.setSpeed(75);

                  setTimeout(() => {
                    entity.idle();
                    entity.currentAnimation.setSpeed(150);
                  }, 1200);
                } else {
                  entity.idle();
                }
              } else if (entity.kind === Types.Entities.PORTALMINOTAUR && entity.gridX === 40 && entity.gridY === 210) {
                if (self.minotaurPortalStart) {
                  entity.raise();
                  entity.currentAnimation.setSpeed(75);

                  setTimeout(() => {
                    entity.idle();
                    entity.currentAnimation.setSpeed(150);
                  }, 1200);
                } else {
                  entity.idle();
                }
              } else if (entity.kind === Types.Entities.MAGICSTONE) {
                entity.isActivated = isActivated;
                if (entity.isActivated) {
                  entity.walk();
                } else {
                  entity.idle();
                }
              } else if (entity.kind === Types.Entities.BLUEFLAME) {
                entity.isActivated = isActivated;
                entity.setVisible(isActivated);
                entity.idle();
              } else if (
                entity.kind === Types.Entities.ALTARCHALICE ||
                entity.kind === Types.Entities.ALTARINFINITYSTONE
              ) {
                entity.isActivated = isActivated;
                if (entity.isActivated) {
                  entity.walk();
                } else {
                  entity.idle();
                }
              } else {
                entity.idle();
              }

              if (entity.kind === Types.Entities.PORTALTEMPLE || entity.kind === Types.Entities.PORTALDEATHANGEL) {
                console.log("~~~~~PORTALZ!");
              }

              self.addEntity(entity);

              // console.debug(
              //   "Spawned " +
              //     Types.getKindAsString(entity.kind) +
              //     " (" +
              //     entity.id +
              //     ") at " +
              //     entity.gridX +
              //     ", " +
              //     entity.gridY,
              // );

              if (entity instanceof Character && !(entity instanceof Npc)) {
                entity.onBeforeStep(function () {
                  self.unregisterEntityPosition(entity);
                });

                entity.onStep(function () {
                  if (!entity.isDying) {
                    self.registerEntityDualPosition(entity);

                    if (self.player && self.player.target === entity) {
                      self.makeAttackerFollow(self.player);
                    }

                    entity.forEachAttacker(function (attacker) {
                      if (attacker.isAdjacent(attacker.target)) {
                        attacker.lookAtTarget();
                      } else {
                        attacker.follow(entity);
                      }
                    });
                  }
                });

                entity.onStopPathing(function () {
                  self.unregisterEntityPosition(entity);

                  if (entity.hasTarget() && entity.isAdjacent(entity.target)) {
                    entity.lookAtTarget();
                  }

                  if (entity instanceof Player) {
                    var gridX = entity.destination.gridX,
                      gridY = entity.destination.gridY;

                    if (self.map.isDoor(gridX, gridY)) {
                      var dest = self.map.getDoorDestination(gridX, gridY);
                      entity.setGridPosition(dest.x, dest.y);
                    }
                  }

                  entity.forEachAttacker(function (attacker) {
                    if (!attacker.isAdjacentNonDiagonal(entity) && attacker.id !== self.playerId) {
                      attacker.follow(entity);
                    }
                  });

                  self.registerEntityPosition(entity);
                });

                entity.onRequestPath(function (x, y) {
                  var ignored = [entity], // Always ignore self
                    ignoreTarget = function (target) {
                      ignored.push(target);

                      // also ignore other attackers of the target entity
                      target.forEachAttacker(function (attacker) {
                        ignored.push(attacker);
                      });
                    };

                  if (entity.hasTarget()) {
                    ignoreTarget(entity.target);
                  } else if (entity.previousTarget) {
                    // If repositioning before attacking again, ignore previous target
                    // See: tryMovingToADifferentTile()
                    ignoreTarget(entity.previousTarget);
                  }

                  return self.findPath(entity, x, y, ignored);
                });

                entity.onDeath(function () {
                  console.info(entity.id + " is dead");

                  if (entity instanceof Mob) {
                    // Keep track of where mobs die in order to spawn their dropped items
                    // at the right position later.
                    self.deathpositions[entity.id] = {
                      x: entity.gridX,
                      y: entity.gridY,
                    };
                  }

                  // Make sure the death animation happens, if the entity is currently pathing reset it
                  entity.aggroRange = 0;
                  entity.stop();
                  entity.isDying = true;

                  let speed = 120;

                  // Custom death animations
                  const hasCustomDeathAnimation = [
                    Types.Entities.RAT,
                    Types.Entities.GHOST,
                    Types.Entities.DEATHANGEL,
                    Types.Entities.WORM,
                  ].includes(entity.kind);

                  if (entity instanceof Mobs.DeathAngel) {
                    speed = 250;
                  }
                  if (!hasCustomDeathAnimation) {
                    entity.setSprite(self.sprites["death"]);
                  }

                  entity.animate("death", speed, 1, function () {
                    console.info(entity.id + " was removed");

                    self.removeEntity(entity);
                    self.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
                  });

                  entity.forEachAttacker(function (attacker) {
                    attacker.disengage();
                  });

                  if (self.player.target && self.player.target.id === entity.id) {
                    self.player.disengage();
                  }

                  // Upon death, this entity is removed from both grids, allowing the player
                  // to click very fast in order to loot the dropped item and not be blocked.
                  // The entity is completely removed only after the death animation has ended.
                  self.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                  self.removeFromPathingGrid(entity.gridX, entity.gridY);

                  if (self.camera.isVisible(entity)) {
                    if (entity.kind === Types.Entities.DEATHANGEL) {
                      self.audioManager.playSound("deathangel-death");
                    } else {
                      self.audioManager.playSound("kill" + Math.floor(Math.random() * 2 + 1));
                    }
                  }

                  self.updateCursor();
                });

                entity.onHasMoved(function (entity) {
                  self.assignBubbleTo(entity); // Make chat bubbles follow moving entities
                });
              }
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          console.debug("Entity " + entity.id + " already exists. Don't respawn.");
        }

        if (entity instanceof Player || entity instanceof Mob) {
          entity.hitPoints = data.hitPoints;
          entity.maxHitPoints = data.maxHitPoints;
        }

        if (entity instanceof Player) {
          // @NOTE Manually update locally stored entity to prevent invisible unupdated coords entity
          // Before this the entities were not updated because they already existed
          // const currentEntity = self.getEntityById(entity.id);
          self.unregisterEntityPosition(entity);

          const { weapon: rawWeapon, armor: rawArmor, level, auras, partyId, cape, shield, settings } = data;

          const [armor, armorLevel, armorBonus] = rawArmor.split(":");
          const [weapon, weaponLevel, weaponBonus, weaponSocket] = rawWeapon.split(":");

          entity.setWeaponName(weapon);
          entity.setWeaponLevel(weaponLevel);
          entity.setWeaponBonus(weaponBonus);
          entity.setWeaponSocket(weaponSocket);
          entity.setSpriteName(armor);
          entity.setArmorName(armor);
          entity.setArmorLevel(armorLevel);
          entity.setArmorBonus(armorBonus);
          entity.setAuras(auras);
          entity.setCape(cape);
          entity.setShield(shield);
          entity.setSettings(settings);
          entity.setPartyId(partyId);
          entity.setLevel(level);
          entity.setSprite(self.sprites[entity.getSpriteName()]);
          entity.setGridPosition(x, y);

          self.registerEntityPosition(entity);
        }

        if (entity instanceof Mob) {
          if (targetId) {
            var player = self.getEntityById(targetId);
            if (player) {
              self.createAttackLink(entity, player);
            }
          }
        }
      });

      self.client.onSpawnSpell(function (entity, x, y, orientation, originX, originY, element: Elements, casterId) {
        entity.setSprite(self.sprites[entity.getSpriteName(element === "physical" ? "" : element)]);

        if (entity.kind === Types.Entities.MAGESPELL) {
          entity.setTarget({ x: self.player.x, y: self.player.y });
        } else if (entity.kind === Types.Entities.DEATHANGELSPELL) {
          entity.setTarget({ x: (x + originX * 8) * 16, y: (y + originY * 8) * 16 });
        }

        const caster = self.getEntityById(casterId);
        if (!caster) return;

        entity.setGridPosition(caster.gridX, caster.gridY);

        // @NOTE Adjustment so the spell is correctly aligned
        if (entity.kind === Types.Entities.MAGESPELL) {
          entity.y = caster.y - 8;
        }
        entity.setOrientation(orientation);
        entity.idle();

        self.addEntity(entity);

        // Spell collision
        if (self.player.gridX === x && self.player.gridY === y) {
          entity.stop();
          self.makePlayerHurtFromSpell(entity);
        }

        entity.onDeath(function () {
          console.info(entity.id + " is dead");
          let speed = 120;

          // Custom death animations
          const hasCustomDeathAnimation = [Types.Entities.DEATHANGELSPELL, Types.Entities.MAGESPELL].includes(
            entity.kind,
          );

          if (!hasCustomDeathAnimation) {
            entity.setSprite(self.sprites["death"]);
          }

          entity.animate("death", speed, 1, function () {
            console.info(entity.id + " was removed");
            self.removeEntity(entity);
          });
        });
      });

      self.client.onDespawnEntity(function (entityId) {
        var entity = self.getEntityById(entityId);

        if (entity) {
          console.info("Despawning " + Types.getKindAsString(entity.kind) + " (" + entity.id + ")");

          // Instead of checking the absolute position, give a 1 tile buffer range for clearing the position
          // This is an attempt at solving the issue where after a monster death the player could not attack
          // in the same direction if the mob has moved before the attack and the wrong pos are then recorded
          if (self.previousClickPosition) {
            const isNear =
              Math.abs(entity.gridX - self.previousClickPosition.x) <= 1 &&
              Math.abs(entity.gridY - self.previousClickPosition.y) <= 1;
            if (isNear) {
              self.previousClickPosition = null;
            }
          }

          if (entity instanceof Item) {
            self.removeItem(entity);
          } else if (entity instanceof Spell) {
            entity.death_callback?.();
          } else if (entity instanceof Character) {
            entity.forEachAttacker(function (attacker) {
              if (attacker.canReachTarget()) {
                attacker.hit();
              }
            });
            if (!entity.isDead) {
              entity.die();
            }
          } else if (entity instanceof Chest) {
            entity.open();
          }

          entity.clean();
        }
      });

      self.client.onItemBlink(function (id) {
        var item = self.getEntityById(id);

        if (item) {
          item.blink(150);
        }
      });

      self.client.onPartyCreate(function () {
        self.partyInvites = [];
        self.partyInvitees = [];

        self.chat_callback({ message: "Party created!", type: "event" });
      });

      self.client.onPartyJoin(function (data) {
        const { partyId, partyLeader, members } = data;

        self.partyInvites = [];
        if (partyLeader.name === self.player.name) {
          self.partyInvitees = self.partyInvitees.filter(invitee => invitee !== data.playerName);
        }
        self.player.setPartyId(partyId);
        self.player.setPartyLeader(partyLeader);
        self.player.setPartyMembers(members);

        members?.forEach(({ id }) => {
          self.getEntityById(id)?.setPartyId(partyId);
        });

        let message = "Party joined";
        if (data.playerName !== self.player.name) {
          message = `${data.playerName} joined the party`;
        } else if (members.length === 1 && partyLeader.name === self.player.name) {
          message = `Party created, you are the party leader`;
        }

        self.app.updatePartyMembers(members);

        self.chat_callback({ message, type: "info" });
        self.nbplayers_callback();
      });

      self.client.onPartyRefuse(function (data) {
        const { partyId } = data;

        self.partyInvites = self.partyInvites.filter(invites => invites.partyId !== partyId);

        self.nbplayers_callback();
      });

      self.client.onPartyInvite(function (data) {
        // Cannot be invited if already in a party
        if (self.player.partyId) return;

        const { partyId, partyLeader } = data;

        self.partyInvites.push({ name: partyLeader.name, partyId });

        if (!$("#party").hasClass("active")) {
          self.app.partyBlinkInterval = setInterval(() => {
            $("#party-button").toggleClass("blink");
          }, 500);
        }

        self.chat_callback({
          message: `${partyLeader.name} invite you to join the party. To accept open the party panel or type /party join ${partyId}`,
          type: "info",
        });
      });

      self.client.onPartyLeave(function (data) {
        const { partyId, partyLeader, members, playerName } = data;

        // Leaving player will update it's entity list
        if (!partyId) {
          self.player.partyMembers?.forEach(({ id }) => {
            self.getEntityById(id)?.setPartyId(partyId);
          });
        } else {
          // When a player in the party left, diff the member list and remove the partyId of the leaving player
          _.differenceWith(self.player.partyMembers, members, _.isEqual)?.forEach(({ id }) => {
            self.getEntityById(id)?.setPartyId(undefined);
          });
        }

        self.player.setPartyId(partyId);
        self.player.setPartyLeader(partyLeader);
        self.player.setPartyMembers(members);

        let message = "You left the party";
        if (playerName !== self.player.name) {
          message = `${playerName} left the party`;
          self.app.updatePartyMembers(members);
        } else {
          self.app.removePartyHealthBar();
          self.partyInvites = [];
          self.partyInvitees = [];
        }
        // @NOTE add isNewLeader to determine when to display this?
        // if (self.player.name === partyLeader?.name) {
        //   message += ", you are now the party leader";
        // }
        self.chat_callback({ message, type: "info" });
        self.nbplayers_callback();
      });

      self.client.onPartyDisband(function () {
        self.partyInvites = [];
        self.partyInvitees = [];

        self.player.partyMembers?.forEach(({ id }) => {
          self.getEntityById(id)?.setPartyId(undefined);
        });

        self.player.setPartyId(undefined);
        self.player.setPartyLeader(undefined);
        self.player.setPartyMembers(undefined);

        self.chat_callback({ message: "Party was disbanded", type: "info" });
        self.nbplayers_callback();

        self.app.removePartyHealthBar();
      });

      self.client.onPartyInfo(function (message) {
        self.chat_callback({ message, type: "info" });
      });

      self.client.onPartyError(function (message) {
        self.chat_callback({ message, type: "error" });
      });

      self.client.onPartyLoot(function ({ playerName, kind, isUnique }) {
        let message = "";
        if (isUnique) {
          message = `${playerName} received the ${Types.itemUniqueMap[Types.getKindAsString(kind)][0]}`;
        } else {
          message = `${playerName} received ${EntityFactory.builders[kind]()
            .getLootMessage()
            .replace("You pick up", "")}`;
        }

        self.chat_callback({ message, type: "loot" });
      });

      self.client.onPartyHealth(function (member) {
        self.app.updatePartyHealthBar(member);
      });

      self.client.onTradeRequestSend(function (playerName) {
        self.chat_callback({ message: `Trade request sent to ${playerName}`, type: "event" });
      });

      self.client.onTradeRequestReceive(function (playerName) {
        $("#container").addClass("prevent-click");
        $("#dialog-trade-request").dialog({
          dialogClass: "no-close",
          autoOpen: true,
          draggable: false,
          title: "Trade request",
          text: "hello",
          classes: {
            "ui-button": "btn",
          },
          buttons: [
            {
              text: "Refuse",
              class: "btn btn-gray",
              click: function () {
                self.client.sendTradeRequestRefuse(playerName);
                $(this).dialog("close");
                $("#container").removeClass("prevent-click");
              },
            },
            {
              text: "Accept",
              class: "btn",
              click: function () {
                self.client.sendTradeRequestAccept(playerName);
                $(this).dialog("close");
                $("#container").removeClass("prevent-click");
              },
            },
          ],
        });
        $("#dialog-trade-request").text(`${playerName} wants to start trading with you.`);
        // @ts-ignore
        $(".ui-button").removeClass("ui-button");
      });

      self.client.onTradeStart(function (players) {
        $("#trade-player1-status-button").removeClass("disabled");
        if ($("#dialog-trade-request").dialog("instance")) {
          $("#dialog-trade-request").dialog("close");
        }

        players.forEach(({ id }) => {
          if (self.entities[id].name === self.player.name) {
            $("#trade-player1-name").text(self.entities[id].name);
          } else {
            $("#trade-player2-name").text(self.entities[id].name);
          }
        });

        self.app.openTrade();
      });

      self.client.onTradeClose(function ({ playerName, isCompleted, isInventoryFull }) {
        let message = "";
        if (isCompleted) {
          message = "trade completed";
        } else if (isInventoryFull) {
          message = `${playerName === self.player.name ? "Your" : playerName} inventory doesn't have enough space`;
        } else {
          message = `${playerName === self.player.name ? "You" : playerName} closed the trade`;
          if (playerName === self.player.name) {
          }
        }

        self.app.closeTrade(false);
        self.player.tradePlayer1 = [];

        self.chat_callback({
          message,
          type: "info",
        });
      });

      self.client.onTradeInfo(function (message) {
        self.chat_callback({ message, type: "info" });
      });

      self.client.onTradeError(function (message) {
        self.chat_callback({ message, type: "error" });
      });

      self.client.onPlayer1MoveItem(function (items) {
        self.player.setTradePlayer1(items);
        self.updateTradePlayer1();
      });

      self.client.onPlayer2MoveItem(function (items) {
        self.player.setTradePlayer2(items);
        self.updateTradePlayer2();
      });

      self.client.onPlayer1Status(function (isAccepted) {
        $("#trade-player1-status").find(".btn").toggleClass("disabled", isAccepted);

        self.updateTradePlayer1(!isAccepted);
      });

      self.client.onPlayer2Status(function (isAccepted) {
        $("#trade-player2-status").text(isAccepted ? "Accepted" : "Waiting ...");
      });

      self.client.onEntityMove(function (id, x, y) {
        var entity = null;
        if (id !== self.playerId) {
          entity = self.getEntityById(id);

          if (entity) {
            if (self.player.isAttackedBy(entity)) {
              self.tryUnlockingAchievement("COWARD");
            }
            entity.disengage();
            entity.idle();
            self.makeCharacterGoTo(entity, x, y);
          }
        }
      });

      self.client.onEntityDestroy(function (id) {
        var entity = self.getEntityById(id);
        if (entity) {
          if (entity instanceof Item) {
            self.removeItem(entity);
          } else {
            self.removeEntity(entity);
          }
          console.debug("Entity was destroyed: " + entity.id);
        }
      });

      self.client.onPlayerMoveToItem(function (playerId, itemId) {
        var player, item;
        if (playerId !== self.playerId) {
          player = self.getEntityById(playerId);
          item = self.getEntityById(itemId);

          if (player && item) {
            self.makeCharacterGoTo(player, item.gridX, item.gridY);
          }
        }
      });

      self.client.onEntityAttack(function (attackerId, targetId) {
        var attacker = self.getEntityById(attackerId);
        var target = self.getEntityById(targetId);

        if (attacker && target && attacker.id !== self.playerId) {
          console.debug(attacker.id + " attacks " + target.id);

          if (
            attacker &&
            target instanceof Player &&
            target.id !== self.playerId &&
            target.target &&
            target.target.id === attacker.id &&
            attacker.getDistanceToEntity(target) < 3
          ) {
            setTimeout(function () {
              self.createAttackLink(attacker, target);
            }, 200); // delay to prevent other attacking mobs from ending up on the same tile as they walk towards each other.
          } else {
            self.createAttackLink(attacker, target);
          }
        }
      });

      self.client.onEntityRaise(function (mobId, targetId) {
        var mob = self.getEntityById(mobId);
        if (mob) {
          if (mob.kind === Types.Entities.DEATHANGEL) {
            mob.setRaisingMode();
            self.audioManager.playSound("deathangel-spell");
            if (targetId === self.playerId) {
              self.client.sendCastSpell(mob.id, mob.gridX, mob.gridY);
            }
          } else if (mob.kind === Types.Entities.NECROMANCER) {
            mob.setRaisingMode();
            self.audioManager.playSound("raise");
          } else if (mob.kind === Types.Entities.MAGICSTONE) {
            self.audioManager.playSound("magicstone");
            self.activatedMagicStones.push(mobId);

            mob.raise();
            setTimeout(() => {
              mob.currentAnimation.reset();
              mob.walk();
            }, 1300);
          } else if (mob.kind === Types.Entities.BLUEFLAME) {
            self.activatedBlueFlames.push(mobId);

            mob.idle();
            mob.setVisible(true);
          } else if (mob.kind === Types.Entities.ALTARCHALICE) {
            self.isAltarChaliceActivated = true;

            mob.walk();

            // Set the stairs visible
            // @TODO ~~~ play sound
            // mob.setVisible(true);
          } else if (mob.kind === Types.Entities.ALTARINFINITYSTONE) {
            self.isAltarInfinityStoneActivated = true;

            mob.walk();

            // Set the stairs visible
            // @TODO ~~~ play sound
            // mob.setVisible(true);
          }
        }
      });

      self.client.onPlayerDamageMob(function ({ id, dmg, hp, maxHitPoints, isCritical, isBlocked }) {
        var mob = self.getEntityById(id);

        if (mob && (dmg || isBlocked)) {
          self.infoManager.addDamageInfo({
            value: dmg,
            x: mob.x,
            y: mob.y - 15,
            type: "inflicted",
            isCritical,
            isBlocked,
          });
        }

        if (self.player.hasTarget() || self.player.skillTargetId === id) {
          self.updateTarget(id, dmg, hp, maxHitPoints);
        }
      });

      self.client.onPlayerKillMob(function (kind, level, playerExp, exp) {
        self.player.experience = playerExp;

        if (self.player.level !== level) {
          self.player.level = level;
          self.updateRequirement();
        }

        if (exp) {
          self.updateExpBar();
          self.infoManager.addDamageInfo({
            value: "+" + exp + " exp",
            x: self.player.x,
            y: self.player.y - 15,
            type: "exp",
            duration: 3000,
          });
        }

        self.storage.incrementTotalKills();
        self.tryUnlockingAchievement("HUNTER");

        if (kind === Types.Entities.RAT) {
          self.storage.incrementRatCount();
          self.tryUnlockingAchievement("ANGRY_RATS");
        } else if (kind === Types.Entities.SKELETON || kind === Types.Entities.SKELETON2) {
          self.storage.incrementSkeletonCount();
          self.tryUnlockingAchievement("SKULL_COLLECTOR");
        } else if (kind === Types.Entities.SPECTRE) {
          self.storage.incrementSpectreCount();
          self.tryUnlockingAchievement("SPECTRE_COLLECTOR");
        } else if (kind === Types.Entities.BOSS) {
          self.tryUnlockingAchievement("HERO").then(() => {
            self.client.sendRequestPayout(Types.Entities.BOSS);
          });
        } else if (kind === Types.Entities.WEREWOLF) {
          self.storage.incrementWerewolfCount();
          self.tryUnlockingAchievement("BLOODLUST");
        } else if (kind === Types.Entities.YETI) {
          self.storage.incrementYetiCount();
          self.tryUnlockingAchievement("MYTH_OR_REAL");
        } else if (kind === Types.Entities.SKELETON3) {
          self.storage.incrementSkeleton3Count();
          self.tryUnlockingAchievement("RIP");
        } else if (kind === Types.Entities.WRAITH) {
          self.storage.incrementWraithCount();
          self.tryUnlockingAchievement("GHOSTBUSTERS");
        } else if (kind === Types.Entities.SKELETONCOMMANDER) {
          self.tryUnlockingAchievement("DEAD_NEVER_DIE");
        } else if (kind === Types.Entities.NECROMANCER) {
          self.tryUnlockingAchievement("BLACK_MAGIC");
        } else if (kind === Types.Entities.COW) {
          self.storage.incrementCowCount();
          self.tryUnlockingAchievement("FRESH_MEAT");
        } else if (kind === Types.Entities.COWKING) {
          self.tryUnlockingAchievement("COW_KING");
        } else if (kind === Types.Entities.MINOTAUR) {
          self.tryUnlockingAchievement("MINOTAUR");
        }

        if (Math.floor((self.player.hitPoints * 100) / self.player.maxHitPoints) <= 1 && kind > Types.Entities.RAT2) {
          self.tryUnlockingAchievement("NOT_SAFU");
        }
      });

      self.client.onPlayerChangeHealth(function ({ health, isRegen, isHurt }) {
        var player = self.player;
        var diff;

        if (player && !player.isDead && !player.invincible) {
          diff = health - player.hitPoints;
          player.hitPoints = health;

          if (player.hitPoints <= 0) {
            player.die();
          }
          if (isHurt) {
            player.hurt();
            self.infoManager.addDamageInfo({ value: diff, x: player.x, y: player.y - 15, type: "received" });
            self.audioManager.playSound("hurt");
            self.storage.addDamage(-diff);
            self.tryUnlockingAchievement("MEATSHIELD");
            self?.playerhurt_callback();
          } else if (!isRegen) {
            self.infoManager.addDamageInfo({ value: "+" + diff, x: player.x, y: player.y - 15, type: "healed" });
          }
          self.updateBars();
        }
      });

      self.client.onPlayerChangeStats(function ({ maxHitPoints, ...bonus }) {
        if (self.player.maxHitPoints !== maxHitPoints || self.player.invincible) {
          self.player.maxHitPoints = maxHitPoints;
          self.player.hitPoints = maxHitPoints;

          self.updateBars();
        }

        self.player.bonus = bonus;

        $("#player-damage").text(bonus.damage);
        $("#player-attackDamage").text(bonus.attackDamage);
        $("#player-criticalHit").text(bonus.criticalHit);
        $("#player-magicDamage").text(bonus.magicDamage);
        $("#player-flameDamage").text(bonus.flameDamage);
        $("#player-lightningDamage").text(bonus.lightningDamage);
        $("#player-coldDamage").text(bonus.coldDamage);
        $("#player-poisonDamage").text(bonus.poisonDamage);
        $("#player-pierceDamage").text(bonus.pierceDamage);
        $("#player-defense").text(bonus.defense);
        $("#player-blockChance").text(bonus.blockChance);
        $("#player-absorbedDamage").text(bonus.absorbedDamage);
        $("#player-magicResistance").text(bonus.magicResistance);
        $("#player-flameResistance").text(bonus.flameResistance);
        $("#player-lightningResistance").text(bonus.lightningResistance);
        $("#player-coldResistance").text(bonus.coldResistance);
        $("#player-poisonResistance").text(bonus.poisonResistance);
        $("#player-physicalResistance").text(bonus.physicalResistance);
        $("#player-magicFind").text(bonus.magicFind);
        $("#player-attackSpeed").text(bonus.attackSpeed);
        $("#player-exp").text(bonus.exp);
        $("#player-skillTimeout").text(bonus.skillTimeout);

        self.player.setAttackSpeed(bonus.attackSpeed);
      });

      self.client.onPlayerSettings(function ({ playerId, settings }) {
        var player = self.getEntityById(playerId);
        if (player) {
          if (typeof settings.capeHue === "number") {
            player.capeHue = settings.capeHue;
          }
          if (typeof settings.capeSaturate === "number") {
            player.capeSaturate = settings.capeSaturate;
          }
          if (typeof settings.capeContrast === "number") {
            player.capeContrast = settings.capeContrast;
          }
        }
      });

      self.client.onSetBonus(function (bonus) {
        self.player.setBonus = bonus;
      });

      self.client.onPlayerEquipItem(function ({ id: playerId, kind, level, bonus, socket, skill, type }) {
        var player = self.getEntityById(playerId);
        var name = Types.getKindAsString(kind);

        if (player) {
          if (type === "armor") {
            player.switchArmor(self.sprites[name], level, bonus, socket);
          } else if (type === "weapon") {
            player.switchWeapon(name, level, bonus, socket, skill);

            if (playerId === self.player.id) {
              self.setAttackSkill(skill);
            }
          } else if (type === "cape") {
            if (!kind || !level || !bonus) {
              player.removeCape();
            } else {
              player.switchCape(name, level, bonus);
            }

            if (playerId === self.player.id) {
              self.toggleCapeSliders(kind && level && bonus);
            }
          } else if (type === "shield") {
            if (!kind || !level) {
              player.removeShield();
            } else {
              player.switchShield(name, level, bonus, socket, skill);
            }
            if (playerId === self.player.id) {
              self.setDefenseSkill(skill);
            }
          } else if (type === "belt") {
            player.setBelt([name, level, bonus].filter(Boolean).join(":"));
          } else if (type === "ring1") {
            player.setRing1([name, level, bonus].filter(Boolean).join(":"));
          } else if (type === "ring2") {
            player.setRing2([name, level, bonus].filter(Boolean).join(":"));
          } else if (type === "amulet") {
            player.setAmulet([name, level, bonus].filter(Boolean).join(":"));
          }
        }
      });

      self.client.onPlayerAuras(function (playerId, auras) {
        var player = self.getEntityById(playerId);
        if (player) {
          player.setAuras(auras);
        }
      });

      self.client.onPlayerSkill(function ({ id: playerId, skill: rawSkill }) {
        const player = self.getEntityById(playerId);
        const { skill, level, isAttackSkill, mobId } = rawSkill;
        if (player) {
          if (isAttackSkill) {
            self.skillCastAnimation.reset();
            player.setCastSkill(skill);

            self.audioManager.playSound(`skill-${Types.skillToNameMap[skill]}`);

            const entity = self.getEntityById(mobId);
            if (entity) {
              self[`skill${_.capitalize(Types.skillToNameMap[skill])}Animation`].reset();
              entity.setSkillAnimation?.(skill);
            }
          } else {
            player.setDefenseSkillAnimation(
              Types.defenseSkillTypeAnimationMap[skill],
              Types.defenseSkillDurationMap[skill](level),
            );
          }
        }
      });

      self.client.onPlayerTeleport(function (id, x, y) {
        var entity = null;
        var currentOrientation;

        if (id !== self.playerId) {
          entity = self.getEntityById(id);

          if (entity) {
            currentOrientation = entity.orientation;

            self.makeCharacterTeleportTo(entity, x, y);
            entity.setOrientation(currentOrientation);

            entity.forEachAttacker(function (attacker) {
              attacker.disengage();
              attacker.idle();
              attacker.stop();
            });
          }
        }
      });

      self.client.onDropItem(function (item, mobId) {
        var pos = self.getDeadMobPosition(mobId);

        if (pos) {
          self.addItem(item, pos.x, pos.y);
          self.updateCursor();
        }
      });

      self.client.onChatMessage(function ({
        entityId,
        name,
        message,
        type,
      }: {
        entityId: number;
        name: string;
        message: string;
        type: ChatType;
      }) {
        var entity = self.getEntityById(entityId);
        if (entity) {
          self.createBubble(entityId, message);
          self.assignBubbleTo(entity);
        }

        self.audioManager.playSound("chat");
        self.chat_callback({ entityId, name, message, type });
      });

      self.client.onPopulationChange(function (players, levelupPlayer) {
        self.worldPlayers = players;

        if (self.nbplayers_callback) {
          self.nbplayers_callback();
        }
        if (levelupPlayer) {
          if (self.entities[levelupPlayer]) {
            self.entities[levelupPlayer].setLevelup();
          }

          if (levelupPlayer === self.playerId) {
            self.audioManager.playSound("levelup");
          }
        }
      });

      self.client.onBossCheck(function (data) {
        const { status, message, hash, check } = data;

        if (status === "ok") {
          const position = parseInt(check[check.length - 1]);
          if (check[position] != position) {
            self.client.sendBanPlayer("Invalid check position");
          } else {
            // let s = check;
            // s = s.slice(0, position) + s.slice(position + 1, s.length - 1);
            // s = parseInt(s);

            // const now = Date.now();
            // const absS = Math.abs(s - now);
            // 10s range
            // @TODO people getting banned here?
            // if (absS < 1000 * 10) {
            self.player.stop_pathing_callback({ x: 71, y: 21, confirmed: true });
            // } else {
            //   self.client.sendBanPlayer(`Invalid check time ${check}, ${s}, ${now}`);
            // }
          }
        } else if (status === "failed") {
          self.bosscheckfailed_callback(message);
        } else if (status === "completed") {
          self.gamecompleted_callback({ hash, fightAgain: true, show: true });
        }
      });

      self.client.onReceiveNotification(function (data) {
        const { message, hash } = data;

        if (hash) {
          self.gamecompleted_callback({ hash });
        }

        setTimeout(() => {
          self.showNotification(message);
        }, 250);
      });

      self.client.onReceiveInventory(function (data) {
        self.player.setInventory(data);
        self.updateInventory();
      });

      self.client.onReceiveStash(function (data) {
        self.player.setStash(data);
        self.updateStash();
      });

      self.client.onReceiveUpgrade(function (data, meta) {
        const { luckySlot, isLucky7, isMagic8, isSuccess } = meta || {};

        self.isUpgradeItemSent = false;
        self.player.setUpgrade(data);
        self.updateUpgrade({ luckySlot, isSuccess });

        if (isLucky7) {
          self.tryUnlockingAchievement("LUCKY7");
        } else if (isMagic8) {
          // @NOTE Note ready yet, maybe later
          // self.tryUnlockingAchievement("MAGIC8");
        }
      });

      self.client.onReceiveAnvilUpgrade(function ({
        isSuccess,
        isTransmute,
        isChestblue,
        isChestgreen,
        isChestpurple,
        // @NOTE perhaps have a different animation for red chests (extra rare, next expansion?)
        // isChestred,
      }) {
        if (isSuccess) {
          self.setAnvilSuccess();
        } else if (isTransmute || isChestgreen) {
          self.setAnvilTransmute();
        } else if (isChestblue) {
          self.setAnvilChestblue();
        } else if (isChestpurple) {
          self.setAnvilRecipe();
        } else {
          self.setAnvilFail();
        }
      });

      self.client.onReceiveAnvilOdds(function (message) {
        if (self.showAnvilOdds) {
          self.chat_callback({
            message,
            type: "info",
          });
        }
      });

      self.client.onReceiveAnvilRecipe(function (recipe) {
        self.setAnvilRecipe();

        if (recipe === "cowLevel" || recipe === "minotaurLevel") {
          self.app.closeUpgrade();
          self.audioManager.playSound("portal-open");
        }
      });

      self.client.onReceiveStoreItems(function (items) {
        self.store.addStoreItems(items);
      });

      self.client.onReceivePurchaseCompleted(function (payment) {
        if (payment.id === Types.Store.EXPANSION1) {
          self.player.expansion1 = true;
        } else if (payment.id === Types.Store.EXPANSION2) {
          self.player.expansion2 = true;
        }
        self.store.purchaseCompleted(payment);
      });

      self.client.onReceivePurchaseError(function (error) {
        self.store.purchaseError(error);
      });

      self.client.onReceiveWaypointsUpdate(function (waypoints) {
        self.player.waypoints = waypoints;
        self.initWaypoints(waypoints);
      });

      self.client.onReceiveCowLevelStart(function ({ x, y }) {
        self.cowLevelPortalCoords = {
          x,
          y,
        };

        self.cowPortalStart = true;
        setTimeout(() => {
          self.cowPortalStart = false;
        }, 1200);
      });

      self.client.onReceiveCowLevelInProgress(function (cowLevelClock) {
        var selectedDate = new Date().valueOf() + cowLevelClock * 1000;

        if (!self.player.expansion1 || self.player.level < 45) {
          self.client.sendBanPlayer("Entered CowLevel without expansion or lower than lv.45");
        }

        $("#countdown")
          .countdown(selectedDate.toString())
          .on("update.countdown", function (event) {
            // @ts-ignore
            $(this).html(event.strftime("%M:%S"));
          })
          .on("finish.countdown", function () {
            $(this).html("Portal to the secret level closed.");

            setTimeout(() => {
              $(this).html("");
            }, 5000);
          });
      });

      self.client.onReceiveCowLevelEnd(function (isCompleted) {
        $("#countdown").countdown(0);
        $("#countdown").countdown("remove");

        self.cowLevelPortalCoords = null;

        const teleportBackToTown = () => {
          if (self.player.gridY >= 464 && self.player.gridY <= 535) {
            const x = Math.ceil(randomRange(40, 45));
            const y = Math.ceil(randomRange(208, 213));

            self.player.stop_pathing_callback({ x, y, isWaypoint: true });

            if (isCompleted) {
              self.tryUnlockingAchievement("FARMER");
            }
          }
        };

        if (!self.isZoning()) {
          teleportBackToTown();
        } else {
          self.isTeleporting = true;

          // Prevent teleportation while player is zoning, see updateZoning() for timeout delay
          setTimeout(() => {
            teleportBackToTown();
            self.isTeleporting = false;
          }, 200);
        }
      });

      self.client.onReceiveMinotaurLevelStart(function () {
        self.minotaurPortalStart = true;
        setTimeout(() => {
          self.minotaurPortalStart = false;
        }, 1200);
      });

      self.client.onReceiveMinotaurLevelInProgress(function (minotaurLevelClock) {
        var selectedDate = new Date().valueOf() + minotaurLevelClock * 1000;

        if (!self.player.expansion1 || self.player.level < 53) {
          self.client.sendBanPlayer("Entered MinotaurLevel without expansion or lower than lv.53");
        }

        $("#countdown")
          .countdown(selectedDate.toString())
          .on("update.countdown", function (event) {
            // @ts-ignore
            $(this).html(event.strftime("%M:%S"));
          })
          .on("finish.countdown", function () {
            $(this).html("Portal to the secret level closed.");

            setTimeout(() => {
              $(this).html("");
            }, 5000);
          });
      });

      self.client.onReceiveMinotaurLevelEnd(function () {
        $("#countdown").countdown(0);
        $("#countdown").countdown("remove");

        if (self.player.gridY >= 464 && self.player.gridY <= 535) {
          const x = Math.ceil(randomRange(40, 45));
          const y = Math.ceil(randomRange(208, 213));

          self.player.stop_pathing_callback({ x, y, isWaypoint: true });
        }
      });

      self.client.onFrozen(function (entityId, duration) {
        self.getEntityById(entityId)?.setFrozen(duration);
      });

      self.client.onPoisoned(function (entityId, duration) {
        self.getEntityById(entityId)?.setPoisoned(duration);
      });

      self.client.onCursed(function (entityId, curseId, duration) {
        self.getEntityById(entityId)?.setCursed(curseId, duration);
      });

      self.client.onDisconnected(function (message) {
        if (self.player) {
          self.player.die();
        }
        if (self.disconnect_callback) {
          self.disconnect_callback(message);
        }
      });

      self.gamestart_callback();

      if (self.hasNeverStarted) {
        self.start();
        started_callback({ success: true });
      }
    });
  }

  /**
   * Links two entities in an attacker<-->target relationship.
   * This is just a utility method to wrap a set of instructions.
   *
   * @param {Entity} attacker The attacker entity
   * @param {Entity} target The target entity
   */
  createAttackLink(attacker, target) {
    if (attacker.hasTarget()) {
      attacker.removeTarget();
    }
    attacker.engage(target);

    if (attacker.id !== this.playerId) {
      target.addAttacker(attacker);

      if (attacker.kind === Types.Entities.ZOMBIE && Object.keys(target.attackers).length >= 15) {
        this.tryUnlockingAchievement("TICKLE_FROM_UNDER");
      }
    }
  }

  /**
   * Converts the current mouse position on the screen to world grid coordinates.
   * @returns {Object} An object containing x and y properties.
   */
  getMouseGridPosition() {
    var mx = this.mouse.x,
      my = this.mouse.y,
      c = this.renderer.camera,
      s = this.renderer.scale,
      ts = this.renderer.tilesize,
      offsetX = mx % (ts * s),
      offsetY = my % (ts * s),
      x = (mx - offsetX) / (ts * s) + c.gridX,
      y = (my - offsetY) / (ts * s) + c.gridY;

    return { x: x, y: y };
  }

  /**
   * Moves a character to a given location on the world grid.
   *
   * @param {Number} x The x coordinate of the target location.
   * @param {Number} y The y coordinate of the target location.
   */
  makeCharacterGoTo(character, x, y) {
    if (!this.map.isOutOfBounds(x, y)) {
      character.go(x, y);
    }
  }

  /**
   *
   */
  makeCharacterTeleportTo(character, x, y) {
    if (!this.map.isOutOfBounds(x, y)) {
      this.unregisterEntityPosition(character);

      character.setGridPosition(x, y);

      this.registerEntityPosition(character);
      this.assignBubbleTo(character);
    } else {
      console.debug("Teleport out of bounds: " + x + ", " + y);
    }
  }

  /**
   *
   */
  makePlayerAttackNext() {
    const pos = {
      x: this.player.gridX,
      y: this.player.gridY,
    };
    switch (this.player.orientation) {
      case Types.Orientations.DOWN:
        pos.y += 1;
        this.makePlayerAttackTo(pos);
        break;
      case Types.Orientations.UP:
        pos.y -= 1;
        this.makePlayerAttackTo(pos);
        break;
      case Types.Orientations.LEFT:
        pos.x -= 1;
        this.makePlayerAttackTo(pos);
        break;
      case Types.Orientations.RIGHT:
        pos.x += 1;
        this.makePlayerAttackTo(pos);
        break;

      default:
        break;
    }
  }

  /**
   *
   */
  makePlayerAttackTo(pos) {
    const entity = this.getEntityAt(pos.x, pos.y);
    if (entity instanceof Mob) {
      this.makePlayerAttack(entity);
    }
  }

  /**
   * Moves the current player to a given target location.
   * @see makeCharacterGoTo
   */
  makePlayerGoTo(x, y) {
    this.makeCharacterGoTo(this.player, x, y);
  }

  /**
   * Moves the current player towards a specific item.
   * @see makeCharacterGoTo
   */
  makePlayerGoToItem(item) {
    if (item) {
      this.player.isLootMoving = true;
      this.makePlayerGoTo(item.gridX, item.gridY);
      this.client.sendLootMove(item, item.gridX, item.gridY);
    }
  }

  /**
   *
   */
  makePlayerTalkTo(npc) {
    if (npc) {
      this.player.setTarget(npc);
      this.player.follow(npc);
    }
  }

  makePlayerOpenChest(chest) {
    if (chest) {
      this.player.setTarget(chest);
      this.player.follow(chest);
    }
  }

  makePlayerAttack(mob) {
    this.createAttackLink(this.player, mob);
    this.client.sendAttack(mob);
  }

  makePlayerHurtFromSpell(spell) {
    this.client.sendHurtSpell(spell);
  }

  resetAnvilAnimation() {
    this.isAnvilFail = false;
    this.isAnvilSuccess = false;
    this.isAnvilRecipe = false;
    this.isAnvilTransmute = false;
    this.isAnvilChestblue = false;
    this.isAnvilChestgreen = false;
    this.isAnvilChestpurple = false;
    this.isAnvilChestred = false;
    clearTimeout(this.anvilAnimationTimeout);
  }

  setAnvilSuccess() {
    this.resetAnvilAnimation();
    this.isAnvilSuccess = true;
    this.anvilAnimationTimeout = setTimeout(() => {
      this.isAnvilSuccess = false;
    }, 3000);
  }

  setAnvilFail() {
    this.resetAnvilAnimation();
    this.isAnvilFail = true;
    this.anvilAnimationTimeout = setTimeout(() => {
      this.isAnvilFail = false;
    }, 3000);
  }

  setAnvilRecipe() {
    this.resetAnvilAnimation();
    this.isAnvilRecipe = true;
    this.anvilAnimationTimeout = setTimeout(() => {
      this.isAnvilRecipe = false;
    }, 3000);
  }

  setAnvilTransmute() {
    this.resetAnvilAnimation();
    this.isAnvilTransmute = true;
    this.anvilAnimationTimeout = setTimeout(() => {
      this.isAnvilTransmute = false;
    }, 3000);
  }

  setAnvilChestblue() {
    this.resetAnvilAnimation();
    this.isAnvilChestblue = true;
    this.anvilAnimationTimeout = setTimeout(() => {
      this.isAnvilChestblue = false;
    }, 3000);
  }

  /**
   *
   */
  makeNpcTalk(npc) {
    var msg;

    if (npc) {
      msg = npc.talk(this);
      this.previousClickPosition = null;

      if (
        ![
          // Types.Entities.ANVIL,
          // Types.Entities.STASH,
          // Types.Entities.WAYPOINTX,
          // Types.Entities.WAYPOINTN,
          // Types.Entities.WAYPOINTO,
          // Types.Entities.PORTALCOW,
          // Types.Entities.PORTALMINOTAUR,
          Types.Entities.MAGICSTONE,
          Types.Entities.BLUEFLAME,
          Types.Entities.ALTARCHALICE,
          Types.Entities.ALTARINFINITYSTONE,
        ].includes(npc.kind)
      ) {
        if (msg) {
          this.createBubble(npc.id, msg);
          this.assignBubbleTo(npc);
          this.audioManager.playSound("npc");
        } else {
          this.destroyBubble(npc.id);
          this.audioManager.playSound("npc-end");
        }
        this.tryUnlockingAchievement("SMALL_TALK");
      }

      if (npc.kind === Types.Entities.NYAN) {
        this.tryUnlockingAchievement("NYAN");
      } else if (npc.kind === Types.Entities.RICK) {
        this.tryUnlockingAchievement("RICKROLLD");
      } else if (npc.kind === Types.Entities.ANVIL) {
        this.app.openUpgrade();
      } else if (npc.kind === Types.Entities.SORCERER) {
        this.store.openStore();
      } else if (npc.kind === Types.Entities.STASH) {
        this.app.openStash();
      } else if (
        npc.kind === Types.Entities.WAYPOINTX ||
        npc.kind === Types.Entities.WAYPOINTN ||
        npc.kind === Types.Entities.WAYPOINTO
      ) {
        const activeWaypoint = this.getWaypointFromGrid(npc.gridX, npc.gridY);
        this.app.openWaypoint(activeWaypoint);

        // Send enable request for disabled waypoint
        if (activeWaypoint && this.player.waypoints[activeWaypoint.id - 1] === 0) {
          this.player.waypoints[activeWaypoint.id - 1] = 1;
          this.activateWaypoint(activeWaypoint.id);
          this.client.sendWaypoint(activeWaypoint.id);
        }
      } else if (npc.kind === Types.Entities.SATOSHI) {
        this.tryUnlockingAchievement("SATOSHI");
      } else if (npc.kind === Types.Entities.PORTALCOW) {
        if (this.player.level >= 45) {
          if (npc.gridX === 43 && npc.gridY === 211) {
            if (this.cowLevelPortalCoords) {
              this.tryUnlockingAchievement("SECRET_LEVEL");

              this.player.stop_pathing_callback({
                x: this.cowLevelPortalCoords.x,
                y: this.cowLevelPortalCoords.y,
                isWaypoint: true,
              });
            }
          } else {
            this.player.stop_pathing_callback({ x: 43, y: 212, isWaypoint: true });
          }
        }
      } else if (npc.kind === Types.Entities.PORTALMINOTAUR) {
        if (this.player.level >= 53) {
          if (npc.gridX === 40 && npc.gridY === 210) {
            if (this.minotaurLevelPortalCoords) {
              this.player.stop_pathing_callback({
                x: this.minotaurLevelPortalCoords.x,
                y: this.minotaurLevelPortalCoords.y,
                isWaypoint: true,
              });
            }
          } else {
            this.player.stop_pathing_callback({ x: 40, y: 211, isWaypoint: true });
          }
        }
      } else if (npc.kind === Types.Entities.MAGICSTONE) {
        if (!npc.isActivated) {
          this.client.sendMagicStone(npc.id);
        }
      } else if (npc.kind === Types.Entities.ALTARCHALICE) {
        if (!npc.isActivated) {
          this.client.sendAltarChalice(npc.id);
        }
      } else if (npc.kind === Types.Entities.ALTARINFINITYSTONE) {
        if (!npc.isActivated) {
          this.client.sendAltarInfinityStone(npc.id);
        }
      } else if (npc.kind === Types.Entities.SECRETSTAIRS) {
        if (npc.gridX === 8 && npc.gridY === 683) {
          this.player.stop_pathing_callback({ x: 15, y: 678, isWaypoint: true });
        } else if (npc.gridX === 20 && npc.gridY === 643) {
          this.player.stop_pathing_callback({ x: 15, y: 642, isWaypoint: true });
        }
      }
    }
  }

  getWaypointFromGrid(x, y) {
    return Types.waypoints.find(({ gridX, gridY }) => gridX === x && gridY === y);
  }

  /**
   * Loops through all the entities currently present in the game.
   * @param {Function} callback The function to call back (must accept one entity argument).
   */
  forEachEntity(callback) {
    _.each(this.entities, function (entity) {
      callback(entity);
    });
  }

  /**
   * Same as forEachEntity but only for instances of the Mob subclass.
   * @see forEachEntity
   */
  forEachMob(callback) {
    _.each(this.entities, function (entity: Entity) {
      if (entity instanceof Mob) {
        callback(entity);
      }
    });
  }

  /**
   * Loops through all entities visible by the camera and sorted by depth :
   * Lower 'y' value means higher depth.
   * Note: This is used by the Renderer to know in which order to render entities.
   */
  forEachVisibleEntityByDepth(callback) {
    var self = this,
      m = this.map;

    this.camera.forEachVisiblePosition(
      function (x, y) {
        if (!m.isOutOfBounds(x, y)) {
          if (self.renderingGrid[y][x]) {
            _.each(self.renderingGrid[y][x], function (entity) {
              callback(entity);
            });
          }
        }
      },
      this.renderer.mobile ? 0 : 2,
    );
  }

  /**
   *
   */
  forEachVisibleTileIndex(callback, extra) {
    var m = this.map;

    this.camera.forEachVisiblePosition(function (x, y) {
      if (!m.isOutOfBounds(x, y)) {
        callback(m.GridPositionToTileIndex(x, y) - 1);
      }
    }, extra);
  }

  forEachVisibleTile(callback, extra) {
    var m = this.map;

    if (m.isLoaded) {
      this.forEachVisibleTileIndex(function (tileIndex) {
        if (_.isArray(m.data[tileIndex])) {
          _.each(m.data[tileIndex], function (id) {
            callback(id - 1, tileIndex);
          });
        } else {
          if (_.isNaN(m.data[tileIndex] - 1)) {
            //throw Error("Tile number for index:"+tileIndex+" is NaN");
          } else {
            callback(m.data[tileIndex] - 1, tileIndex);
          }
        }
      }, extra);
    }
  }

  forEachAnimatedTile(callback) {
    if (this.animatedTiles) {
      _.each(this.animatedTiles, function (tile) {
        callback(tile);
      });
    }
  }

  forEachHighAnimatedTile(callback) {
    if (this.highAnimatedTiles) {
      _.each(this.highAnimatedTiles, function (tile) {
        callback(tile);
      });
    }
  }

  /**
   * Returns the entity located at the given position on the world grid.
   * @returns {Entity} the entity located at (x, y) or null if there is none.
   */
  getEntityAt(x, y, instance = null) {
    if (this.map.isOutOfBounds(x, y) || !this.entityGrid) {
      return null;
    }

    let entities = this.entityGrid[y][x];
    let entity = null;
    if (_.size(entities) > 0) {
      if (instance) {
        entity = Object.values(entities).find(entity => entity instanceof instance);
      } else {
        entity = entities[_.keys(entities)[0]];
      }
    } else {
      entity = this.getItemAt(x, y);
    }

    return entity;
  }

  getAllEntitiesAt(x, y, instance = null) {
    if (this.map.isOutOfBounds(x, y) || !this.entityGrid) {
      return null;
    }

    let entities = this.entityGrid[y][x];
    if (_.size(entities) > 0) {
      entities = Object.values(entities);
      if (instance) {
        entities = entities.filter(entity => entity instanceof instance);
      }
    } else {
      entities = [];
    }

    return entities;
  }

  getPlayerAt(x, y) {
    var entity = this.getEntityAt(x, y, Player);
    if (entity && entity instanceof Player) {
      return entity;
    }
    return null;
  }

  getMobAt(x, y) {
    var entity = this.getEntityAt(x, y, Mob);
    if (entity && entity instanceof Mob) {
      return entity;
    }
    return null;
  }

  getNpcAt(x, y) {
    var entity = this.getEntityAt(x, y, Npc);
    if (entity && entity instanceof Npc) {
      return entity;
    }
    return null;
  }

  getSpellAt(x, y) {
    var entity = this.getEntityAt(x, y, Spell);
    if (entity && entity instanceof Spell) {
      return entity;
    }
    return null;
  }

  getChestAt(x, y) {
    var entity = this.getEntityAt(x, y, Chest);
    if (entity && entity instanceof Chest) {
      return entity;
    }
    return null;
  }

  getItemAt(x, y) {
    if (this.map.isOutOfBounds(x, y) || !this.itemGrid) {
      return null;
    }
    var items = this.itemGrid[y][x];
    var item = null;

    if (_.size(items) > 0) {
      // If there are potions/burgers stacked with equipment items on the same tile, always get expendable items first.
      _.each(items, i => {
        if (Types.isExpendableItem(i.kind)) {
          if (this.renderingGrid[y][x][i.id]) {
            item = i;
          } else {
            // Remove item from unreceived de-spawn message
            this.removeItem(i);
          }
        }
      });

      // Else, get the first item of the stack
      if (!item) {
        _.keys(items).forEach(entityId => {
          if (this.renderingGrid[y][x][entityId]) {
            item = items[entityId];
          } else {
            // Remove item from unreceived de-spawn message
            this.removeItem(items[entityId]);
          }
        });
      }
    }
    return item;
  }

  /**
   * Returns true if an entity is located at the given position on the world grid.
   * @returns {Boolean} Whether an entity is at (x, y).
   */
  isEntityAt(x, y) {
    return !_.isNull(this.getEntityAt(x, y));
  }

  isMobAt(x, y) {
    return !_.isNull(this.getMobAt(x, y));
  }

  isPlayerAt(x, y) {
    return !_.isNull(this.getPlayerAt(x, y));
  }

  isItemAt(x, y) {
    return !_.isNull(this.getItemAt(x, y));
  }

  isNpcAt(x, y) {
    return !_.isNull(this.getNpcAt(x, y));
  }

  isSpellAt(x, y) {
    return !_.isNull(this.getSpellAt(x, y));
  }

  isChestAt(x, y) {
    return !_.isNull(this.getChestAt(x, y));
  }

  /**
   * Finds a path to a grid position for the specified character.
   * The path will pass through any entity present in the ignore list.
   */
  findPath(character, x, y, ignoreList) {
    var self = this,
      grid = this.pathingGrid,
      path = [];

    if (this.map.isColliding(x, y)) {
      return path;
    }

    if (this.pathfinder && character) {
      if (ignoreList) {
        _.each(ignoreList, function (entity) {
          self.pathfinder.ignoreEntity(entity);
        });
      }

      path = this.pathfinder.findPath(grid, character, x, y, false);

      if (ignoreList) {
        this.pathfinder.clearIgnoreList();
      }
    } else {
      console.error("Error while finding the path to " + x + ", " + y + " for " + character.id);
    }
    return path;
  }

  /**
   * Toggles the visibility of the pathing grid for debugging purposes.
   */
  togglePathingGrid() {
    if (this.debugPathing) {
      this.debugPathing = false;
    } else {
      this.debugPathing = true;
    }
  }

  /**
   * Toggles the visibility of the FPS counter and other debugging info.
   */
  toggleDebugInfo() {
    if (this.renderer && this.renderer.isDebugInfoVisible) {
      this.renderer.isDebugInfoVisible = false;
    } else {
      this.renderer.isDebugInfoVisible = true;
    }
  }

  /**
   *
   */
  movecursor() {
    var mouse = this.getMouseGridPosition(),
      x = mouse.x,
      y = mouse.y;

    this.cursorVisible = true;

    if (this.player && !this.renderer.mobile && !this.renderer.tablet) {
      // if (this.isSpellAt(x, y)) {
      //   return;
      // }

      this.hoveringCollidingTile = this.map.isColliding(x, y);
      this.hoveringPlateauTile = this.player.isOnPlateau ? !this.map.isPlateau(x, y) : this.map.isPlateau(x, y);
      this.hoveringMob = this.isMobAt(x, y);
      this.hoveringPlayer = this.isPlayerAt(x, y);
      this.hoveringItem = this.isItemAt(x, y);
      this.hoveringNpc = this.isNpcAt(x, y);
      this.hoveringOtherPlayer = this.isPlayerAt(x, y);
      this.hoveringChest = this.isChestAt(x, y);

      if (
        this.hoveringMob ||
        this.hoveringPlayer ||
        this.hoveringNpc ||
        this.hoveringChest ||
        this.hoveringOtherPlayer
      ) {
        var entity = this.getEntityAt(x, y);

        this.player.showTarget(entity);
        // supportsSilhouettes hides the players (render bug I'd guess)
        if (!entity.isHighlighted && this.renderer.supportsSilhouettes && !this.hoveringPlayer) {
          if (this.lastHovered) {
            this.lastHovered.setHighlight(false);
          }
          entity.setHighlight(true);
        }
        this.lastHovered = entity;
      } else if (this.lastHovered) {
        this.lastHovered.setHighlight(null);
        if (this.timeout === undefined && !this.player.hasTarget()) {
          this.onRemoveTarget();
        }
        this.lastHovered = null;
      }
    }
  }

  onRemoveTarget = () => {
    $("#inspector").fadeOut("fast");
    $("#inspector .level").text("");
    $("#inspector .health").text("");
    if (this.player) {
      this.player.inspecting = null;
    }
  };

  /**
   * Moves the player one space, if possible
   */
  keys(pos) {
    this.hoveringCollidingTile = false;
    this.hoveringPlateauTile = false;

    if ((pos.x === this.previousClickPosition?.x && pos.y === this.previousClickPosition?.y) || this.isZoning()) {
      return;
    } else {
      if (!this.player.disableKeyboardNpcTalk) this.previousClickPosition = pos;
    }

    if (!this.player.isMoving()) {
      this.cursorVisible = false;
      this.processInput(pos);
    }
  }

  click() {
    var pos = this.getMouseGridPosition();

    if (pos.x === this.previousClickPosition?.x && pos.y === this.previousClickPosition?.y) {
      return;
    } else {
      this.previousClickPosition = pos;
    }

    this.processInput(pos);
  }

  isCharacterZoning = false;

  /**
   * Processes game logic when the user triggers a click/touch event during the game.
   */
  processInput(pos) {
    var entity;

    if (
      this.started &&
      this.client.connection.connected &&
      this.player &&
      !this.isTeleporting &&
      !this.isZoning() &&
      !this.isZoningTile(this.player.nextGridX, this.player.nextGridY) &&
      !this.player.isDead &&
      !this.hoveringCollidingTile &&
      !this.hoveringPlateauTile &&
      this.map.grid
    ) {
      entity = this.getEntityAt(pos.x, pos.y);

      // @NOTE: For an unknown reason when a mob dies and is moving, it doesn't unregister its "1" on
      // the pathing grid so it's not possible to navigate to the coords anymore. Ths fix is to manually reset
      // to "0" the pathing map if there is no entity registered on the coords.
      if (
        (entity === null || entity instanceof Item) &&
        pos.x >= 0 &&
        pos.y >= 0 &&
        this.map.grid[pos.y][pos.x] !== 1
      ) {
        this.removeFromPathingGrid(pos.x, pos.y);
      }

      if (this.pvpFlag) {
        const entities = this.getAllEntitiesAt(pos.x, pos.y, Player);
        const originalLength = entities.length;
        if (!originalLength) return;
        entity = entities.find(({ level }) => level >= 9 && Math.abs(level - this.player.level) <= 10);

        if (entity) {
          this.makePlayerAttack(entity);
        } else {
          this.chat_callback({
            message: "You can't attack a player below level 9 or with more than 10 level difference to yours",
            type: "error",
          });
        }
      } else if (entity instanceof Mob) {
        this.makePlayerAttack(entity);
      } else if (entity instanceof Item) {
        this.makePlayerGoToItem(entity);
      } else if (entity instanceof Npc) {
        if (this.player.isAdjacentNonDiagonal(entity) === false) {
          this.makePlayerTalkTo(entity);
        } else {
          if (!this.player.disableKeyboardNpcTalk) {
            this.makeNpcTalk(entity);

            if (this.player.moveUp || this.player.moveDown || this.player.moveLeft || this.player.moveRight) {
              this.player.disableKeyboardNpcTalk = true;
            }
          }
        }
      } else if (entity instanceof Chest) {
        this.makePlayerOpenChest(entity);
      } else {
        this.makePlayerGoTo(pos.x, pos.y);
      }
    }
  }

  isMobOnSameTile(mob, x?: number, y?: number) {
    var X = x || mob.gridX;
    var Y = y || mob.gridY;
    var list = this.entityGrid[Y][X];
    var result = false;

    _.each(list, function (entity) {
      if (entity instanceof Mob && entity.id !== mob.id) {
        result = true;
      }
    });
    return result;
  }

  getFreeAdjacentNonDiagonalPosition(entity) {
    var self = this,
      result = null;

    entity.forEachAdjacentNonDiagonalPosition(function (x, y, orientation) {
      if (!result && !self.map.isColliding(x, y) && !self.isMobAt(x, y)) {
        result = { x: x, y: y, o: orientation };
      }
    });
    return result;
  }

  tryMovingToADifferentTile(character) {
    var attacker = character,
      target = character.target;

    if (attacker && target && target instanceof Player) {
      if (!target.isMoving() && attacker.getDistanceToEntity(target) === 0) {
        var pos;

        switch (target.orientation) {
          case Types.Orientations.UP:
            pos = {
              x: target.gridX,
              y: target.gridY - 1,
              o: target.orientation,
            };
            break;
          case Types.Orientations.DOWN:
            pos = {
              x: target.gridX,
              y: target.gridY + 1,
              o: target.orientation,
            };
            break;
          case Types.Orientations.LEFT:
            pos = {
              x: target.gridX - 1,
              y: target.gridY,
              o: target.orientation,
            };
            break;
          case Types.Orientations.RIGHT:
            pos = {
              x: target.gridX + 1,
              y: target.gridY,
              o: target.orientation,
            };
            break;
        }

        if (pos) {
          attacker.previousTarget = target;
          attacker.disengage();
          attacker.idle();
          this.makeCharacterGoTo(attacker, pos.x, pos.y);
          target.adjacentTiles[pos.o] = true;

          return true;
        }
      }

      if (!target.isMoving() && attacker.isAdjacentNonDiagonal(target) && this.isMobOnSameTile(attacker)) {
        var pos = this.getFreeAdjacentNonDiagonalPosition(target);
        // avoid stacking mobs on the same tile next to a player
        // by making them go to adjacent tiles if they are available
        if (pos && !target.adjacentTiles[pos.o]) {
          if (this.player && this.player.target && attacker.id === this.player.target.id) {
            return false; // never unstack the player's target
          }

          attacker.previousTarget = target;
          attacker.disengage();
          attacker.idle();
          this.makeCharacterGoTo(attacker, pos.x, pos.y);
          target.adjacentTiles[pos.o] = true;

          return true;
        }
      }
    }
    return false;
  }

  onCharacterUpdate(character) {
    var time = this.currentTime;

    // If mob has finished moving to a different tile in order to avoid stacking, attack again from the new position.
    if (character.previousTarget && !character.isMoving() && character instanceof Mob) {
      var t = character.previousTarget;

      if (this.getEntityById(t.id)) {
        // does it still exist?
        character.previousTarget = null;
        this.createAttackLink(character, t);
        return;
      }
    }

    if (character.isAttacking() && (!character.previousTarget || character.id === this.playerId)) {
      if (
        character.kind === Types.Entities.NECROMANCER ||
        character.kind === Types.Entities.DEATHANGEL ||
        character.kind === Types.Entities.MAGE
      ) {
        if (character.isRaising()) {
          if (character.canRaise(time)) {
            character.stop();
            character.nextStep();
            character.raise();

            if (character.kind === Types.Entities.MAGE) {
              this.client.sendCastSpell(character.id, character.gridX, character.gridY);
            }
          }
          return;
        }
      }

      // Don't let multiple mobs stack on the same tile when attacking a player.
      var isMoving = this.tryMovingToADifferentTile(character);

      if (character.canAttack(time)) {
        if (!isMoving) {
          // don't hit target if moving to a different tile.
          if (character.hasTarget() && character.getOrientationTo(character.target) !== character.orientation) {
            character.lookAtTarget();
          }

          character.hit();

          if (character.id === this.playerId) {
            this.client.sendHit(character.target);
          }

          if (character instanceof Player && this.camera.isVisible(character)) {
            this.audioManager.playSound("hit" + Math.floor(Math.random() * 2 + 1));
          }

          if (
            character.hasTarget() &&
            character.target.id === this.playerId &&
            this.player &&
            !this.player.invincible &&
            character.type !== "player"
          ) {
            this.client.sendHurt(character);
          }
        }
      } else {
        if (
          character.hasTarget() &&
          character.isDiagonallyAdjacent(character.target) &&
          character.target instanceof Player &&
          !character.target.isMoving()
        ) {
          character.follow(character.target);
        }
      }
    }
  }

  /**
   *
   */
  isZoningTile(x, y) {
    var c = this.camera;

    x = x - c.gridX;
    y = y - c.gridY;

    if (x === 0 || y === 0 || x === c.gridW - 1 || y === c.gridH - 1) {
      return true;
    }
    return false;
  }

  /**
   *
   */
  getZoningOrientation(x, y) {
    var orientation = "",
      c = this.camera;

    x = x - c.gridX;
    y = y - c.gridY;

    if (x === 0) {
      orientation = Types.Orientations.LEFT;
    } else if (y === 0) {
      orientation = Types.Orientations.UP;
    } else if (x === c.gridW - 1) {
      orientation = Types.Orientations.RIGHT;
    } else if (y === c.gridH - 1) {
      orientation = Types.Orientations.DOWN;
    }

    return orientation;
  }

  startZoningFrom(x, y) {
    this.zoningOrientation = this.getZoningOrientation(x, y);

    if (this.renderer.mobile || this.renderer.tablet) {
      var z = this.zoningOrientation,
        c = this.camera,
        ts = this.renderer.tilesize,
        x = c.x,
        y = c.y,
        xoffset = (c.gridW - 2) * ts,
        yoffset = (c.gridH - 2) * ts;

      if (z === Types.Orientations.LEFT || z === Types.Orientations.RIGHT) {
        x = z === Types.Orientations.LEFT ? c.x - xoffset : c.x + xoffset;
      } else if (z === Types.Orientations.UP || z === Types.Orientations.DOWN) {
        y = z === Types.Orientations.UP ? c.y - yoffset : c.y + yoffset;
      }
      c.setPosition(x, y);

      this.renderer.clearScreen(this.renderer.context);
      this.endZoning();

      // Force immediate drawing of all visible entities in the new zone
      this.forEachVisibleEntityByDepth(function (entity) {
        entity.setDirty();
      });
    } else {
      this.currentZoning = new Transition();
    }
    this.bubbleManager.clean();
    this.client.sendZone();
  }

  enqueueZoningFrom(x, y) {
    // @NOTE: Prevent re-adding same x,y when player is chasing a mob multi-zone
    if (!this.zoningQueue.some(({ x: queueX, y: queueY }) => x === queueX && y === queueY)) {
      this.zoningQueue.push({ x: x, y: y });
    }

    if (this.zoningQueue.length === 1) {
      this.startZoningFrom(x, y);
    }
  }

  endZoning() {
    this.currentZoning = null;
    this.isCharacterZoning = false;
    this.resetZone();
    this.zoningQueue.shift();

    if (this.zoningQueue.length > 0) {
      var pos = this.zoningQueue[0];
      this.startZoningFrom(pos.x, pos.y);
    }
  }

  isZoning() {
    return !_.isNull(this.currentZoning) || this.isCharacterZoning;
  }

  resetZone() {
    this.bubbleManager.clean();
    this.initAnimatedTiles();
    this.renderer.renderStaticCanvases();
  }

  resetCamera() {
    this.camera.focusEntity(this.player);
    this.resetZone();
  }

  say(message) {
    const partyRegexp = /^\/party (create|join|invite|leave|remove|disband|leader)(.+)?/;
    const tradeRegexp = /^\/trade (.+)?/;

    if (message.startsWith("/party")) {
      const args = message.match(partyRegexp);
      if (args) {
        const action = args[1];
        const param = (args[2] || "").trim();

        switch (action) {
          case "create":
            this.client.sendPartyCreate();
            break;
          case "join":
            if (param) {
              this.client.sendPartyJoin(parseInt(param, 10));
            } else {
              this.chat_callback({ message: "You must specify the party id you want to join", type: "error" });
            }
            break;
          case "invite":
            if (param) {
              this.client.sendPartyInvite(param);
            } else {
              this.chat_callback({
                message: "You must specify the player you want to invite to the party",
                type: "error",
              });
            }
            break;
          case "leave":
            if (this.player.partyId) {
              this.client.sendPartyLeave();
            } else {
              this.chat_callback({
                message: "You are not in a party",
                type: "error",
              });
            }
            break;
          case "remove":
            if (param) {
              this.client.sendPartyRemove(param);
            } else {
              this.chat_callback({
                message: "You must specify the player name you want to remove from the party",
                type: "error",
              });
            }
            break;
          case "disband":
            if (!this.player.partyLeader?.id) {
              this.chat_callback({
                message: "You are not in a party",
                type: "error",
              });
            } else if (this.player.partyLeader?.id === this.player.id) {
              this.client.sendPartyDisband(param);
            } else {
              this.chat_callback({
                message: "Only the party leader can disband the party",
                type: "error",
              });
            }
            break;
          case "leader":
            if (!this.player.partyLeader?.id) {
              this.chat_callback({
                message: "You are not in a party",
                type: "error",
              });
            } else if (this.player.partyLeader?.id === this.player.id) {
              // @TODO!
              // this.client.sendPartyLeader(param);
            } else {
              this.chat_callback({
                message: "Only the party leader can assign another player as the party leader",
                type: "error",
              });
            }
            break;
          default:
            this.chat_callback({
              message: "invalid /party command",
              type: "error",
            });
        }

        return;
      }
    } else if (message.startsWith("/trade")) {
      const args = message.match(tradeRegexp);
      const playerName = (args?.[1] || "").trim();
      let isPlayerFound = false;

      if (!playerName || playerName === this.player.name) {
        this.chat_callback({
          message: `Type a player name to trade with.`,
          type: "error",
        });
        return;
      }

      if (!this.player.hash) {
        this.chat_callback({
          message: `You must kill the Skeleton King before you can trade.`,
          type: "error",
        });
        return;
      }

      if (this.player.gridY < 195 || this.player.gridY > 250 || this.player.gridX > 90) {
        this.chat_callback({
          message: `You can only trade in town.`,
          type: "error",
        });
        return;
      }

      for (const i in this.entities) {
        if (this.entities[i].kind !== Types.Entities.WARRIOR) {
          continue;
        }

        if (this.entities[i].name === playerName) {
          isPlayerFound = true;
          if (
            Math.abs(this.entities[i].gridX - this.player.gridX) > 3 ||
            Math.abs(this.entities[i].gridY - this.player.gridY) > 3
          ) {
            this.chat_callback({
              message: `You can only trade with ${playerName} if the player is 3 or less tiles away.`,
              type: "error",
            });
          } else {
            this.client.sendTradeRequest(playerName);
          }

          break;
        }
      }

      if (playerName && !isPlayerFound) {
        this.chat_callback({
          message: `${playerName} is not online.`,
          type: "error",
        });
      }

      return;
    }

    this.client.sendChat(message);
  }

  createBubble(id, message) {
    this.bubbleManager.create(id, message, this.currentTime);
  }

  destroyBubble(id) {
    this.bubbleManager.destroyBubble(id);
  }

  assignBubbleTo(character) {
    var bubble = this.bubbleManager.getBubbleById(character.id);

    if (bubble) {
      var s = this.renderer.scale,
        t = 16 * s, // tile size
        x = (character.x - this.camera.x) * s,
        w = parseInt(bubble.element.css("width")) + 24,
        offset = w / 2 - t / 2,
        offsetY,
        y;

      if (character instanceof Npc) {
        offsetY = 0;
      } else {
        if (s === 2) {
          if (this.renderer.mobile) {
            offsetY = 0;
          } else {
            offsetY = 15;
          }
        } else {
          offsetY = 12;
        }
      }

      y = (character.y - this.camera.y) * s - t * 2 - offsetY;

      bubble.element.css("left", x - offset + "px");
      bubble.element.css("top", y + "px");
    }
  }

  respawn() {
    console.debug("Beginning respawn");

    this.entities = {};
    this.initEntityGrid();
    this.initPathingGrid();
    this.initRenderingGrid();

    this.player = new Warrior("player", this.username);
    this.player.account = this.account;

    // this.initPlayer();
    this.app.initTargetHud();

    this.started = true;
    this.client.enable();
    this.client.sendLogin({ name: this.username, account: this.account, password: this.password });

    this.storage.incrementRevives();

    if (this.renderer.mobile || this.renderer.tablet) {
      this.renderer.clearScreen(this.renderer.context);
    }

    console.debug("Finished respawn");
  }

  onGameStart(callback) {
    this.gamestart_callback = callback;
  }

  onDisconnect(callback) {
    this.disconnect_callback = callback;
  }

  onPlayerDeath(callback) {
    this.playerdeath_callback = callback;
  }

  onGameCompleted(callback) {
    this.gamecompleted_callback = callback;
  }

  onBossCheckFailed(callback) {
    this.bosscheckfailed_callback = callback;
  }

  onUpdateTarget(callback) {
    this.updatetarget_callback = callback;
  }

  onPlayerExpChange(callback) {
    this.playerexp_callback = callback;
  }

  onPlayerHealthChange(callback) {
    this.playerhp_callback = callback;
  }

  onPlayerHurt(callback) {
    this.playerhurt_callback = callback;
  }

  onPlayerEquipmentChange(callback) {
    this.equipment_callback = callback;
  }

  onNbPlayersChange(callback) {
    this.nbplayers_callback = callback;
  }

  onChatMessage(callback) {
    this.chat_callback = callback;
  }

  onNotification(callback) {
    this.notification_callback = callback;
  }

  onPlayerStartInvincible(callback) {
    this.invinciblestart_callback = callback;
  }

  onPlayerStopInvincible(callback) {
    this.invinciblestop_callback = callback;
  }

  resize() {
    var x = this.camera.x;
    var y = this.camera.y;

    this.renderer.rescale();
    this.camera = this.renderer.camera;
    this.camera.setPosition(x, y);

    this.renderer.renderStaticCanvases();
  }

  updateBars() {
    if (this.player && this.playerhp_callback) {
      this.playerhp_callback(this.player.hitPoints, this.player.maxHitPoints);
      $("#player-hp").text(this.player.maxHitPoints);
    }
  }

  updateExpBar() {
    if (this.player && this.playerexp_callback) {
      var expInThisLevel = this.player.experience - Types.expForLevel[this.player.level - 1];
      var expForLevelUp = Types.expForLevel[this.player.level] - Types.expForLevel[this.player.level - 1];
      this.playerexp_callback(expInThisLevel, expForLevelUp);

      $("#player-level").text(this.player.level);
    }
  }

  updateTarget(targetId, dmg, hitPoints, maxHitPoints) {
    if ((this.player.hasTarget() || this.player.skillTargetId === targetId) && this.updatetarget_callback) {
      const target = this.getEntityById(targetId);

      if (!target) return;

      target.points = dmg;
      target.hitPoints = hitPoints;
      target.maxHitPoints = maxHitPoints;
      this.updatetarget_callback(target);
    }
  }

  getDeadMobPosition(mobId) {
    var position;

    if (mobId in this.deathpositions) {
      position = this.deathpositions[mobId];
      delete this.deathpositions[mobId];
    }

    return position;
  }

  onAchievementUnlock(callback) {
    this.unlock_callback = callback;
  }

  tryUnlockingAchievement(name) {
    var achievement = null;
    var self = this;

    return new Promise<void>(resolve => {
      if (name in this.achievements) {
        achievement = this.achievements[name];

        if (achievement.isCompleted() && self.storage.unlockAchievement(achievement.id)) {
          if (self.unlock_callback) {
            self.client.sendAchievement(achievement.id);
            self.unlock_callback(achievement.id, achievement.name, achievement[self.network]);
            self.audioManager.playSound("achievement");
            resolve();
          }
        }
      }
    });
  }

  showNotification(message, timeout = 3500) {
    if (this.notification_callback) {
      this.notification_callback(message, timeout);
    }
  }

  removeObsoleteEntities() {
    var nb = _.size(this.obsoleteEntities),
      self = this;

    if (nb > 0) {
      _.each(this.obsoleteEntities, function (entity) {
        if (entity.id != self.player.id) {
          // never remove yourself
          self.removeEntity(entity);
        }
      });
      console.debug(
        "Removed " +
          nb +
          " entities: " +
          _.map(
            _.reject(this.obsoleteEntities, function (id) {
              return id === self.player.id;
            }),
            "id",
          ),
      );
      this.obsoleteEntities = null;
    }
  }

  /**
   * Fake a mouse move event in order to update the cursor.
   *
   * For instance, to get rid of the sword cursor in case the mouse is still hovering over a dying mob.
   * Also useful when the mouse is hovering a tile where an item is appearing.
   */
  updateCursor() {
    if (!this.cursorVisible) var keepCursorHidden = true;

    this.movecursor();
    this.updateCursorLogic();

    if (keepCursorHidden) this.cursorVisible = false;
  }

  /**
   * Change player plateau mode when necessary
   */
  updatePlateauMode() {
    if (this.map.isPlateau(this.player.gridX, this.player.gridY)) {
      this.player.isOnPlateau = true;
    } else {
      this.player.isOnPlateau = false;
    }
  }

  updatePlayerCheckpoint() {
    var checkpoint = this.map.getCurrentCheckpoint(this.player);

    if (checkpoint) {
      var lastCheckpoint = this.player.lastCheckpoint;
      if (!lastCheckpoint || (lastCheckpoint && lastCheckpoint.id !== checkpoint.id)) {
        this.player.lastCheckpoint = checkpoint;
        this.client.sendCheck(checkpoint.id);
      }
    }
  }

  checkUndergroundAchievement() {
    var music = this.audioManager.getSurroundingMusic(this.player);

    if (music) {
      if (music.name === "cave") {
        this.tryUnlockingAchievement("UNDERGROUND");
      }
    }
  }

  makeAttackerFollow(attacker) {
    var target = attacker.target;

    if (attacker.isAdjacent(attacker.target)) {
      attacker.lookAtTarget();
    } else {
      attacker.follow(target);
    }
  }

  forEachEntityAround(x, y, r, callback) {
    for (var i = x - r, max_i = x + r; i <= max_i; i += 1) {
      for (var j = y - r, max_j = y + r; j <= max_j; j += 1) {
        if (!this.map.isOutOfBounds(i, j)) {
          _.each(this.renderingGrid[j][i], function (entity) {
            callback(entity);
          });
        }
      }
    }
  }

  checkOtherDirtyRects(r1, source, x, y) {
    var r = this.renderer;

    this.forEachEntityAround(x, y, 2, function (e2) {
      if (source && source.id && e2.id === source.id) {
        return;
      }
      if (!e2.isDirty) {
        var r2 = r.getEntityBoundingRect(e2);
        if (r.isIntersecting(r1, r2)) {
          e2.setDirty();
        }
      }
    });

    if (source && !source.hasOwnProperty("index")) {
      this.forEachAnimatedTile(function (tile) {
        if (!tile.isDirty) {
          var r2 = r.getTileBoundingRect(tile);
          if (r.isIntersecting(r1, r2)) {
            tile.isDirty = true;
          }
        }
      });
    }

    if (!this.drawTarget && this.selectedCellVisible) {
      var targetRect = r.getTargetBoundingRect();
      if (r.isIntersecting(r1, targetRect)) {
        this.drawTarget = true;
        this.renderer.targetRect = targetRect;
      }
    }
  }

  tryLootingItem(item) {
    try {
      this.player.loot(item);
      this.client.sendLoot(item); // Notify the server that this item has been looted
      this.removeItem(item);

      if (!this.player.partyId) {
        this.showNotification(item.getLootMessage());
      }

      if (item.type === "armor") {
        this.tryUnlockingAchievement("FAT_LOOT");
      } else if (item.type === "weapon") {
        this.tryUnlockingAchievement("A_TRUE_WARRIOR");
      } else if (item.kind === Types.Entities.CAKE) {
        this.tryUnlockingAchievement("FOR_SCIENCE");
      } else if (item.kind === Types.Entities.FIREFOXPOTION) {
        this.tryUnlockingAchievement("FOXY");
        this.audioManager.playSound("firefox");
      } else if (item.kind === Types.Entities.NANOPOTION || item.kind === Types.Entities.BANANOPOTION) {
        this.app.updateNanoPotions(this.player.nanoPotions);
        if (this.player.nanoPotions >= 5) {
          this.tryUnlockingAchievement("NANO_POTIONS");
        }
      } else if (Types.Entities.Gems.includes(item.kind)) {
        this.app.updateGems(this.player.gems);
        if (!this.player.gems.some(found => !found)) {
          this.tryUnlockingAchievement("GEM_HUNTER");
        }
      } else if (Types.Entities.Artifact.includes(item.kind)) {
        this.app.updateArtifact(this.player.artifact);
        if (!this.player.artifact.some(found => !found)) {
          this.tryUnlockingAchievement("INDIANA_JONES");
        }
      } else if (item.kind === Types.Entities.SKELETONKEY) {
        this.tryUnlockingAchievement("SKELETON_KEY");
        this.player.skeletonKey = true;
      }

      if (Types.isHealingItem(item.kind)) {
        this.audioManager.playSound("heal");
      } else {
        this.audioManager.playSound("loot");
      }

      if (item.wasDropped && !item.playersInvolved.includes(this.playerId)) {
        this.tryUnlockingAchievement("NINJA_LOOT");
      }
    } catch (err) {
      if (err instanceof Exceptions.LootException) {
        this.showNotification(err.message);
        this.audioManager.playSound("noloot");
      } else {
        throw err;
      }
    }
  }
}

export default Game;
