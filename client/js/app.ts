import { TRANSITIONEND, isValidAccountAddress, getAccountAddressFromText } from "./utils";

import Storage from "./storage";
import Store from "./store";

import { Types } from "../../shared/js/gametypes";

// define(["jquery", "lib/jquery.qrcode", "lib/jquery.countdown"], function (

class App {
  constructor() {
    this.currentPage = 1;
    this.blinkInterval = null;
    this.achievementTimeout = null;
    this.isParchmentReady = true;
    this.ready = false;
    this.storage = new Storage();
    this.store = new Store(this);
    this.watchNameInputInterval = setInterval(this.toggleButton.bind(this), 100);
    this.initFormFields();

    if (
      this.storage &&
      this.storage.data &&
      this.storage.data.player &&
      this.storage.data.player.name &&
      this.storage.data.player.account
    ) {
      this.frontPage = "loadcharacter";

      $("#loginnameinput").val(this.storage.data.player.name);
      $("#loginaccountinput").val(this.storage.data.player.account);
    } else {
      this.frontPage = "createcharacter";

      const account = getAccountAddressFromText(window.location.search);
      if (account) {
        $("#accountinput").val(account);
      }
    }

    document.getElementById("parchment").className = this.frontPage;
  }

  setGame(game) {
    this.game = game;
    this.isMobile = this.game.renderer.mobile;
    this.isTablet = this.game.renderer.tablet;
    this.isDesktop = !(this.isMobile || this.isTablet);
    this.supportsWorkers = !!window.Worker;
    this.ready = true;
  }

  initFormFields() {
    var self = this;

    // Play button
    this.$play = $(".play");
    this.getPlayButton = function () {
      return this.getActiveForm().find(".play span");
    };
    this.setPlayButtonState(true);

    // Login form fields
    this.$loginnameinput = $("#loginnameinput");
    this.$loginaccountinput = $("#loginaccountinput");
    this.loginFormFields = [this.$loginnameinput, this.$loginaccountinput];

    // Create new character form fields
    this.$nameinput = $("#nameinput");
    this.$accountinput = $("#accountinput");
    this.createNewCharacterFormFields = [this.$nameinput, this.$accountinput, this.$accountinput];

    // Functions to return the proper username / account fields to use, depending on which form
    // (login or create new character) is currently active.
    this.getUsernameField = function () {
      return this.createNewCharacterFormActive() ? this.$nameinput : this.$loginnameinput;
    };
    this.getAccountField = function () {
      return this.createNewCharacterFormActive() ? this.$accountinput : this.$loginaccountinput;
    };
  }

  center() {
    window.scrollTo(0, 1);
  }

  canStartGame() {
    if (this.isDesktop) {
      return this.game && this.game.map && this.game.map.isLoaded;
    } else {
      return this.game;
    }
  }

  tryStartingGame() {
    if (this.starting) return; // Already loading

    var self = this;
    var action = this.createNewCharacterFormActive() ? "create" : "login";
    var username = this.getUsernameField().val();
    var useraccount = this.getAccountField().val();

    if (!this.validateFormFields(username, useraccount)) return;

    this.setPlayButtonState(false);

    if (!this.ready || !this.canStartGame()) {
      var watchCanStart = setInterval(function () {
        console.debug("waiting...");
        if (self.canStartGame()) {
          clearInterval(watchCanStart);
          self.startGame(action, username, useraccount);
        }
      }, 100);
    } else {
      this.startGame(action, username, useraccount);
    }
  }

  startGame(action, username, useraccount) {
    var self = this;
    self.firstTimePlaying = !self.storage.hasAlreadyPlayed();

    if (username && !this.game.started) {
      var optionsSet = false,
        config = this.config;

      //>>includeStart("devHost", pragmas.devHost);
      if (config.local) {
        console.debug("Starting game with local dev config.");
        this.game.setServerOptions(config.local.host, config.local.port, username, useraccount);
      } else {
        console.debug("Starting game with default dev config.");
        this.game.setServerOptions(config.dev.host, config.dev.port, username, useraccount);
      }
      optionsSet = true;
      //>>includeEnd("devHost");

      //>>includeStart("prodHost", pragmas.prodHost);
      if (!optionsSet) {
        console.debug("Starting game with build config.");
        this.game.setServerOptions(config.build.host, config.build.port, username, useraccount);
      }
      //>>includeEnd("prodHost");

      if (!self.isDesktop) {
        // On mobile and tablet we load the map after the player has clicked
        // on the login/create button instead of loading it in a web worker.
        // See initGame in main.js.
        self.game.loadMap();
      }

      this.center();
      this.game.run(action, function (result) {
        if (result.success === true) {
          self.start();
        } else {
          self.setPlayButtonState(true);

          switch (result.reason) {
            case "invalidlogin":
              // Login information was not correct (either username or password)
              self.addValidationError(null, "The username or address you entered is incorrect.");
              self.getUsernameField().focus();
              break;
            case "userexists":
              // Attempted to create a new user, but the username was taken
              self.addValidationError(self.getUsernameField(), "The username you entered is not available.");
              break;
            case "invalidusername":
              // The username contains characters that are not allowed (rejected by the sanitizer)
              self.addValidationError(self.getUsernameField(), "The username you entered contains invalid characters.");
              break;
            case "loggedin":
              // Attempted to log in with the same user multiple times simultaneously
              self.addValidationError(
                self.getUsernameField(),
                "A player with the specified username is already logged in.",
              );
              break;
            case "banned-1":
            case "banned-365":
              $("." + result.reason).show();
              self.animateParchment("loadcharacter", "banned");
              break;
            case "invalidconnection":
              self.animateParchment("loadcharacter", "invalidconnection");
              break;
            default:
              self.addValidationError(
                null,
                "Failed to launch the game: " + (result.reason ? result.reason : "(reason unknown)"),
              );
              break;
          }
        }
      });
    }
  }

  start() {
    this.hideIntro();
    $("body").addClass("started");

    if (this.firstTimePlaying) {
      this.toggleInstructions();
    }
  }

  setPlayButtonState(enabled) {
    var self = this;
    var $playButton = this.getPlayButton();

    if (enabled) {
      this.starting = false;
      this.$play.removeClass("loading");
      $playButton.click(function () {
        self.tryStartingGame();
      });
      if (this.playButtonRestoreText) {
        $playButton.text(this.playButtonRestoreText);
      }
    } else {
      // Loading state
      this.starting = true;
      this.$play.addClass("loading");
      $playButton.unbind("click");
      this.playButtonRestoreText = $playButton.text();
      $playButton.text("Loading...");
    }
  }

  getActiveForm() {
    if (this.loginFormActive()) return $("#loadcharacter");
    else if (this.createNewCharacterFormActive()) return $("#createcharacter");
    else return null;
  }

  loginFormActive() {
    return $("#parchment").hasClass("loadcharacter");
  }

  createNewCharacterFormActive() {
    return $("#parchment").hasClass("createcharacter");
  }

  /**
   * Performs some basic validation on the login / create new character forms (required fields are filled
   * out, account match looks valid). Assumes either the login or the create new character form
   * is currently active.
   */
  validateFormFields(username, account) {
    this.clearValidationErrors();

    if (!username) {
      this.addValidationError(this.getUsernameField(), "Please enter a username.");
      return false;
    }

    if (!isValidAccountAddress(account)) {
      this.addValidationError(this.getAccountField(), "Please enter a valid nano account.");
      return false;
    }

    return true;
  }

  addValidationError(field, errorText) {
    $("<span/>", {
      class: "validation-error blink",
      text: errorText,
    }).appendTo(".validation-summary");

    if (field) {
      field.addClass("field-error").select();
      field.bind("keypress", function (event) {
        field.removeClass("field-error");
        $(".validation-error").remove();
        $(this).unbind(event);
      });
    }
  }

  clearValidationErrors() {
    var fields = this.loginFormActive() ? this.loginFormFields : this.createNewCharacterFormFields;
    $.each(fields, function (i, field) {
      field.removeClass("field-error");
    });
    $(".validation-error").remove();
  }

  setMouseCoordinates(event) {
    var gamePos = $("#container").offset(),
      scale = this.game.renderer.getScaleFactor(),
      width = this.game.renderer.getWidth(),
      height = this.game.renderer.getHeight(),
      mouse = this.game.mouse;

    mouse.x = event.pageX - gamePos.left - (this.isMobile ? 0 : 5 * scale);
    mouse.y = event.pageY - gamePos.top - (this.isMobile ? 0 : 7 * scale);

    if (mouse.x <= 0) {
      mouse.x = 0;
    } else if (mouse.x >= width) {
      mouse.x = width - 1;
    }

    if (mouse.y <= 0) {
      mouse.y = 0;
    } else if (mouse.y >= height) {
      mouse.y = height - 1;
    }
  }

  //Init the hud that makes it show what creature you are mousing over and attacking
  initTargetHud() {
    var self = this;
    var scale = self.game.renderer.getScaleFactor(),
      healthMaxWidth = $("#inspector .health").width() - 12 * scale,
      timeout;

    this.game.player.onSetTarget(function (target, name, mouseover) {
      var el = "#inspector";
      // var sprite = target.sprite;

      // var x = (sprite.animationData.idle_down.length - 1) * sprite.width;
      // var y = sprite.animationData.idle_down.row * sprite.height;

      var alias = target.name || Types.getAliasFromName(name) || name;

      $(el + " .name").text(alias);

      //Show how much Health creature has left. Currently does not work. The reason health doesn't currently go down has to do with the lines below down to initExpBar...
      if (target.healthPoints) {
        $(el + " .health").css("width", Math.round((target.healthPoints / target.maxHp) * 100) + "%");
      } else {
        $(el + " .health").css("width", "0%");
      }
      var level = Types.getMobLevel(Types.getKindFromString(name));
      if (level !== undefined) {
        $(el + " .level").text("Level " + level);
      } else {
        $("#inspector .level").text("");
      }

      $(el).fadeIn("fast");

      if (!self.isDesktop) {
        var hideTarget = _.debounce(() => {
          self.game.player.onRemoveTarget;
        }, 3000);
        hideTarget();
      }
    });

    self.game.onUpdateTarget(function (target) {
      $("#inspector .health").css("width", Math.round((target.healthPoints / target.maxHp) * 100) + "%");
    });

    self.game.player.onRemoveTarget(function (targetId) {
      $("#inspector").fadeOut("fast");
      $("#inspector .level").text("");
      self.game.player.inspecting = null;
    });
  }

  initExpBar() {
    var self = this;
    var maxHeight = $("#expbar").height();

    this.game.onPlayerExpChange(function (expInThisLevel, expForLevelUp) {
      var barHeight = Math.round((maxHeight / expForLevelUp) * (expInThisLevel > 0 ? expInThisLevel : 0));
      $("#expbar").css("height", barHeight + "px");
    });

    $("#expbar").mouseover(function () {
      if (!self.game.player) return;
      var expInThisLevel = self.game.player.experience - Types.expForLevel[self.game.player.level - 1];
      var expForLevelUp = Types.expForLevel[self.game.player.level] - Types.expForLevel[self.game.player.level - 1];
      var expPercentThisLevel = (100 * expInThisLevel) / expForLevelUp;

      self.game.showNotification(
        "You are level " + self.game.player.level + ". " + expPercentThisLevel.toFixed(0) + "% of this level done.",
      );
    });
  }

  initHealthBar() {
    var scale = this.game.renderer.getScaleFactor(),
      healthMaxWidth = $("#healthbar").width() - 12 * scale;

    this.game.onPlayerHealthChange(function (hp, maxHp) {
      var barWidth = Math.round((healthMaxWidth / maxHp) * (hp > 0 ? hp : 0));
      $("#hitpoints").css("width", barWidth + "px");
    });

    this.game.onPlayerHurt(this.blinkHealthBar.bind(this));
  }

  initPlayerInfo() {
    const { name: username, account } = this.game.storage.data.player;

    $("#player-username").text(username);
    $("#player-account")
      .attr("href", "https://nanolooker.com/account/" + account)
      .text(account);
  }

  blinkHealthBar() {
    var $hitpoints = $("#hitpoints");

    $hitpoints.addClass("white");
    setTimeout(function () {
      $hitpoints.removeClass("white");
    }, 500);
  }

  toggleButton() {
    var name = $("#parchment input").val(),
      $play = $("#createcharacter .play");

    if (name && name.length > 0) {
      $play.removeClass("disabled");
      $("#character").removeClass("disabled");
    } else {
      $play.addClass("disabled");
      $("#character").addClass("disabled");
    }
  }

  hideIntro() {
    clearInterval(this.watchNameInputInterval);
    $("body").removeClass("intro");
    setTimeout(function () {
      $("body").addClass("game");
    }, 500);
  }

  showChat() {
    if (this.game.started) {
      $("#chatinput").focus();
      $("#chatbutton").addClass("active").removeClass("blink");
      $("#text-window").show();
    }
  }

  hideChat() {
    if (this.game.started) {
      // $("#chatbox").removeClass("active");
      $("#chatinput").blur();
      $("#chatbutton").removeClass("active");
      $("#text-window").hide();
    }
  }

  toggleInstructions() {
    $("#instructions").toggleClass("active");
  }

  toggleAchievements() {
    this.resetAchievementPage();
    $("#achievements").toggleClass("active");
  }

  toggleCompleted() {
    $("#completed").toggleClass("active");
  }

  toggleAbout() {
    if ($("body").hasClass("about")) {
      this.closeInGameScroll("about");
    } else {
      this.toggleScrollContent("about");
    }
  }

  resetAchievementPage() {
    var self = this;
    var $achievements = $("#achievements");

    if ($achievements.hasClass("active")) {
      $achievements.bind(TRANSITIONEND, function () {
        $achievements.removeClass("page" + self.currentPage).addClass("page1");
        self.currentPage = 1;
        $achievements.unbind(TRANSITIONEND);
      });
    }
  }

  initEquipmentIcons() {
    var scale = this.game.renderer.getScaleFactor();
    var getIconPath = function (spriteName) {
      return "img/" + scale + "/item-" + spriteName + ".png";
    };
    var weapon = this.game.player.getWeaponName();
    var weaponLevel = this.game.player.getWeaponLevel();
    var weaponBonus = this.game.player.getWeaponBonus();

    var armor = this.game.player.getArmorName();
    var armorLevel = this.game.player.getArmorLevel();
    var armorBonus = this.game.player.getArmorBonus();
    var weaponPath = getIconPath(weapon);
    var armorPath = getIconPath(armor);

    $("#weapon")
      .css("background-image", 'url("' + weaponPath + '")')
      .attr("data-item", weapon)
      .attr("data-level", weaponLevel)
      .attr("data-bonus", weaponBonus);
    $("#player-weapon").text(`${Types.getDisplayName(weapon, !!weaponBonus)} +${weaponLevel}`);

    if (armor !== "firefox") {
      $("#armor")
        .css("background-image", 'url("' + armorPath + '")')
        .attr("data-item", armor)
        .attr("data-level", armorLevel)
        .attr("data-bonus", armorBonus);
      $("#player-armor").text(`${Types.getDisplayName(armor, !!armorBonus)} +${armorLevel}`);
    }
  }

  hideWindows() {
    if ($("#achievements").hasClass("active")) {
      this.toggleAchievements();
      $("#achievementsbutton").removeClass("active");
    }
    if ($("#instructions").hasClass("active")) {
      this.toggleInstructions();
    }
    if ($("body").hasClass("credits")) {
      this.closeInGameScroll("credits");
    }
    if ($("body").hasClass("legal")) {
      this.closeInGameScroll("legal");
    }
    if ($("body").hasClass("about")) {
      this.closeInGameScroll("about");
    }
    if ($("#completed").hasClass("active")) {
      this.toggleCompleted();
      $("#completedbutton").removeClass("active");
    }
    if ($("#about").hasClass("active")) {
      this.toggleAbout();
      $("#completedbutton").removeClass("active");
    }
    if ($("#failed").hasClass("active")) {
      $("#failed").removeClass("active");
    }

    if ($("#upgrade").hasClass("visible")) {
      this.toggleUpgrade();
    }
    if ($("#waypoint").hasClass("visible")) {
      this.closeWaypoint();
    }
    if ($("#stash").hasClass("visible")) {
      this.closeStash();
    }

    if ($("#store").hasClass("active")) {
      this.store.closeStore();
    }
  }

  showAchievementNotification(id, name) {
    var $notif = $("#achievement-notification"),
      $name = $notif.find(".name"),
      $button = $("#achievementsbutton");

    $notif.removeClass().addClass("active achievement" + id);
    $name.text(name);
    if (this.game.storage.getAchievementCount() === 1) {
      this.blinkInterval = setInterval(function () {
        $button.toggleClass("blink");
      }, 500);
    }

    clearTimeout(this.achievementTimeout);
    this.achievementTimeout = setTimeout(function () {
      $notif.removeClass("active");
      $button.removeClass("blink");
    }, 5000);
  }

  displayUnlockedAchievement(id) {
    var $achievement = $("#achievements li.achievement" + id),
      achievement = this.game.getAchievementById(id);

    if (achievement && achievement.hidden) {
      this.setAchievementData($achievement, achievement.name, achievement.desc, achievement.nano);
    }
    $achievement.addClass("unlocked");
  }

  unlockAchievement(id, name, nano) {
    this.showAchievementNotification(id, name);
    this.displayUnlockedAchievement(id);

    var nb = parseInt($("#unlocked-achievements").text());
    const totalNano = parseInt(parseFloat($("#unlocked-nano-achievements").text()) * 100000);
    $("#unlocked-achievements").text(nb + 1);
    $("#unlocked-nano-achievements").text((totalNano + (nano || 0)) / 100000);
  }

  initAchievementList(achievements) {
    var self = this,
      $lists = $("#lists"),
      $page = $("#page-tmpl"),
      $achievement = $("#achievement-tmpl"),
      page = 0,
      count = 0,
      $p = null;

    $lists.empty();

    var totalNano = 0;
    _.each(achievements, function (achievement) {
      count++;

      var $a = $achievement.clone();
      $a.removeAttr("id");
      $a.addClass("achievement" + count);
      if (!achievement.hidden) {
        self.setAchievementData($a, achievement.name, achievement.desc, achievement.nano);
      }

      $a.show();

      totalNano += achievement.nano || 0;

      if ((count - 1) % 4 === 0) {
        page++;
        $p = $page.clone();
        $p.attr("id", "page" + page);
        $p.show();
        $lists.append($p);
      }
      $p.append($a);
    });

    $("#total-achievements").text($("#achievements").find("li").length);
    $("#total-nano-achievements").html(`
        <span>${totalNano / 100000}</span>
        <span class="xno">Ӿ</span>
      `);
  }

  initUnlockedAchievements(ids, totalNano) {
    var self = this;

    _.each(ids, function (id) {
      self.displayUnlockedAchievement(id);
    });
    $("#unlocked-achievements").text(ids.length);
    $("#unlocked-nano-achievements").text(totalNano / 100000);
  }

  setAchievementData($el, name, desc, nano) {
    $el.find(".achievement-name").html(name);
    $el.find(".achievement-description").html(desc);
    $el.find(".achievement-nano").html(`
        <span>${nano ? nano / 100000 : ""}</span>
        <span class="xno">${nano ? "Ӿ" : ""}</span>
      `);
  }

  updateNanoPotions(nanoPotions) {
    for (var i = 0; i < nanoPotions; i++) {
      if (i === 5) break;
      $("#nanopotion-count").find(`.item-nanopotion:eq(${i})`).addClass("active");
    }
  }

  updateGems(gems) {
    $("#achievements-unlocks-count")
      .find(".item-gem")
      .each((index, element) => {
        if (gems[index] !== 0) {
          $(element).addClass("active");
        }
      });
  }

  updateArtifact(artifact) {
    // @TODO Update an artifact grayed out "map"?
  }

  toggleScrollContent(content) {
    var currentState = $("#parchment").attr("class");

    if (this.game.started) {
      $("#parchment").removeClass().addClass(content);

      $("body").removeClass("credits legal about").toggleClass(content);

      if (!this.game.player) {
        $("body").toggleClass("death");
      }

      if (content !== "about") {
        $("#completedbutton").removeClass("active");
      }
    } else {
      if (currentState !== "animate") {
        if (currentState === content) {
          this.animateParchment(currentState, this.frontPage);
        } else {
          this.animateParchment(currentState, content);
        }
      }
    }
  }

  closeInGameScroll(content) {
    $("body").removeClass(content);
    $("#parchment").removeClass(content);
    if (!this.game.player) {
      $("body").addClass("death");
    }
    if (content === "about") {
      $("#completedbutton").removeClass("active");
    }
  }

  togglePopulationInfo() {
    $("#population").toggleClass("visible");

    if ($("#upgrade, #inventory").hasClass("visible")) {
      this.toggleInventory();
    }
  }

  togglePlayerInfo() {
    $("#player").toggleClass("visible");
  }

  toggleMute() {
    if ($("#mute-button").hasClass("active")) {
      this.storage.setAudioEnabled(true);
      this.game.audioManager.enableAudio();
    } else {
      this.storage.setAudioEnabled(false);
      this.game.audioManager.disableAudio();
    }
  }

  toggleInventory() {
    if ($("#upgrade").hasClass("visible")) {
      $("#upgrade").removeClass("visible");
      $("#inventory").removeClass("upgrade");
      $("#player").addClass("visible");
      if (this.game.player.upgrade.length) {
        this.game.client.sendMoveUpgradeItemsToInventory();
      }
    } else if (!$("#inventory").hasClass("visible")) {
      $("#player").addClass("visible");
      this.openInventory();
    } else {
      this.closeInventory();
    }
  }

  openInventory() {
    if (!$("#inventory").hasClass("visible")) {
      $("#inventory").addClass("visible");
      this.game.initDraggable();
    }
  }

  closeInventory() {
    $("#inventory").removeClass("visible");
    $("#player").removeClass("visible");
    this.game.destroyDraggable();
  }

  openStash() {
    this.closeUpgrade();
    $("#stash").addClass("visible");
    this.openInventory();
  }

  closeStash() {
    $("#stash").removeClass("visible");
    this.closeInventory();
  }

  openUpgrade() {
    if ($("#upgrade").hasClass("visible")) return;
    this.closeStash();
    this.toggleUpgrade();
  }

  closeUpgrade() {
    if (!$("#upgrade").hasClass("visible")) return;

    this.toggleUpgrade();
  }

  toggleUpgrade() {
    $("#upgrade").toggleClass("visible");

    if ($("#upgrade").hasClass("visible")) {
      if (!$("#inventory").hasClass("visible")) {
        this.game.initDraggable();
      }
      $("#inventory").addClass("visible upgrade");
      $("#player").removeClass("visible");
    } else {
      this.game.destroyDraggable();
      if (this.game.player.upgrade.length) {
        this.game.client.sendMoveUpgradeItemsToInventory();
      }
      $("#inventory").removeClass("visible upgrade");
      $(".item-scroll").empty();
      $("#upgrade .item-slot").removeClass("item-upgrade-success-slot item-upgrade-fail-slot");
    }
  }

  openWaypoint(activeWaypoint) {
    $("#waypoint").find(".active").removeClass("active");
    if (activeWaypoint) {
      $(`#waypoint-${activeWaypoint.id}`).addClass("active");
    }
    $("#waypoint").addClass("visible");

    $("#foreground")
      .off(".waypoint")
      .on("click.waypoint", () => {
        this.closeWaypoint();
        $("#foreground").off(".waypoint");
      });
  }

  closeWaypoint() {
    $("#waypoint").find(".active").removeClass("active");
    $("#waypoint").removeClass("visible");
  }

  openPopup(type, url) {
    var h = $(window).height(),
      w = $(window).width(),
      popupHeight,
      popupWidth,
      top,
      left;

    switch (type) {
      case "twitter":
        popupHeight = 450;
        popupWidth = 550;
        break;
      case "facebook":
        popupHeight = 400;
        popupWidth = 580;
        break;
    }

    top = h / 2 - popupHeight / 2;
    left = w / 2 - popupWidth / 2;

    newwindow = window.open(
      url,
      "name",
      "height=" + popupHeight + ",width=" + popupWidth + ",top=" + top + ",left=" + left,
    );
    if (window.focus) {
      newwindow.focus();
    }
  }

  animateParchment(origin, destination) {
    var self = this,
      $parchment = $("#parchment"),
      duration = 1;

    if (this.isMobile) {
      $parchment.removeClass(origin).addClass(destination);
    } else {
      if (this.isParchmentReady) {
        if (this.isTablet) {
          duration = 0;
        }
        this.isParchmentReady = !this.isParchmentReady;

        $parchment.toggleClass("animate");
        $parchment.removeClass(origin);

        setTimeout(function () {
          $("#parchment").toggleClass("animate");
          $parchment.addClass(destination);
        }, duration * 1000);

        setTimeout(function () {
          self.isParchmentReady = !self.isParchmentReady;
        }, duration * 1000);
      }
    }
  }

  animateMessages() {
    var $messages = $("#notifications div");

    $messages.addClass("top");
  }

  resetMessagesPosition() {
    var message = $("#message2").text();

    $("#notifications div").removeClass("top");
    $("#message2").text("");
    $("#message1").text(message);
  }

  showMessage(message, timeout) {
    var $wrapper = $("#notifications div"),
      $message = $("#notifications #message2");

    this.animateMessages();
    $message.text(message);
    if (this.messageTimer) {
      this.resetMessageTimer();
    }

    this.messageTimer = setTimeout(function () {
      $wrapper.addClass("top");
    }, timeout || 5000);
  }

  resetMessageTimer() {
    clearTimeout(this.messageTimer);
  }

  resizeUi() {
    if (this.game) {
      if (this.game.started) {
        this.game.resize();
        this.initHealthBar();
        this.initTargetHud();
        this.initExpBar();
        this.game.updateBars();
      } else {
        var newScale = this.game.renderer.getScaleFactor();
        this.game.renderer.rescale(newScale);
      }
    }
  }
}

export default App;
