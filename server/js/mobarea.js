/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false, undef:true,
    unused:true, curly:true, browser:true, node:true, maxerr:50, camelcase: true, quotmark: single,
    trailing: true*/

var _ = require('underscore');
var Area = require('./area');
var Types = require('../../shared/js/gametypes');
var Utils = require('./utils');

var MobArea = Area.extend({
    init: function (id, nb, kind, x, y, width, height, world) {
        this._super(id, x, y, width, height, world);
        this.nb = nb;
        this.kind = kind;
        this.respawns = [];
        this.setNumberOfEntities(this.nb);

        //this.initRoaming();
    },

    spawnMobs: function () {
        for (var i = 0; i < this.nb; i += 1) {
            this.addToArea(this._createMobInsideArea());
        }
    },

    _createMobInsideArea: function () {
        var k = Types.getKindFromString(this.kind);
        var Mob = require('./mob');
        var pos = this._getRandomPositionInsideArea();
        var mob = new Mob('1' + this.id + '' + k + '' + this.entities.length, k, pos.x, pos.y);

        mob.onMove(this.world.onMobMoveCallback.bind(this.world));

        return mob;
    },

    respawnMob: function (mob, delay) {
        var self = this;

        this.removeFromArea(mob);

        setTimeout(function () {
            var pos = self._getRandomPositionInsideArea();

            mob.x = pos.x;
            mob.y = pos.y;
            mob.isDead = false;
            self.addToArea(mob);
            self.world.addMob(mob);
        }, delay);
    },

    initRoaming: function (mob) {
        var self = this;

        setInterval(function () {
            _.each(self.entities, function (mob) {
                var canRoam = (Utils.random(20) === 1);
                var pos;

                if (canRoam) {
                    if (!mob.hasTarget() && !mob.isDead) {
                        pos = self._getRandomPositionInsideArea();
                        mob.move(pos.x, pos.y);
                    }
                }
            });
        }, 500);
    },

    createReward: function () {
        var pos = this._getRandomPositionInsideArea();

        return { x: pos.x, y: pos.y, kind: Types.Entities.CHEST };
    }
});

module.exports = MobArea;
