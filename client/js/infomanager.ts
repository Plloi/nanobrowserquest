import type { Game } from "./types/game";

class InfoManager {
  constructor(game: Game) {
    this.game = game;
    this.infos = {};
    this.destroyQueue = [];
  }

  addDamageInfo({ value, x, y, type, duration, isCritical }) {
    var time = this.game.currentTime;
    var id = time + "" + (isNaN(value * 1) ? value : value * 1) + "" + x + "" + y;
    var self = this;
    var string = value;
    if (isCritical) {
      string += " Critical";
    } else if (value === 0) {
      string = "Blocked";
      type = "inflicted";
    }

    var info = new HoveringInfo(id, string, x, y, duration ? duration : 1000, type);

    info.onDestroy(function (id) {
      self.destroyQueue.push(id);
    });
    this.infos[id] = info;
  }

  forEachInfo(callback) {
    var self = this;

    _.each(this.infos, function (info, id) {
      callback(info);
    });
  }

  update(time) {
    var self = this;

    this.forEachInfo(function (info) {
      info.update(time);
    });

    _.each(this.destroyQueue, function (id) {
      delete self.infos[id];
    });
    this.destroyQueue = [];
  }
}

var damageInfoColors = {
  received: {
    fill: "rgb(255, 50, 50)",
    stroke: "rgb(255, 180, 180)",
  },
  inflicted: {
    fill: "white",
    stroke: "#373737",
  },
  healed: {
    fill: "rgb(80, 255, 80)",
    stroke: "rgb(50, 120, 50)",
  },
  health: {
    fill: "white",
    stroke: "#373737",
  },
  exp: {
    fill: "rgb(80, 80, 255)",
    stroke: "rgb(50, 50, 255)",
  },
};

class HoveringInfo {
  DURATION: 1000;

  constructor(id, value, x, y, duration, type) {
    this.id = id;
    this.value = value;
    this.duration = duration;
    this.x = x;
    this.y = y;
    this.opacity = 1.0;
    this.lastTime = 0;
    this.speed = 100;
    this.fillColor = damageInfoColors[type].fill;
    this.strokeColor = damageInfoColors[type].stroke;
  }

  isTimeToAnimate(time) {
    return time - this.lastTime > this.speed;
  }

  update(time) {
    if (this.isTimeToAnimate(time)) {
      this.lastTime = time;
      this.tick();
    }
  }

  tick() {
    if (this.type !== "health") this.y -= 1;
    this.opacity -= 70 / this.duration;
    if (this.opacity < 0) {
      this.destroy();
    }
  }

  onDestroy(callback) {
    this.destroy_callback = callback;
  }

  destroy() {
    if (this.destroy_callback) {
      this.destroy_callback(this.id);
    }
  }
}

export default InfoManager;
