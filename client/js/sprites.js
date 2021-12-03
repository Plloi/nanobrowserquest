define([
  "text!../sprites/agent.json",
  "text!../sprites/arrow.json",
  "text!../sprites/axe.json",
  "text!../sprites/blueaxe.json",
  "text!../sprites/bluemorningstar.json",
  "text!../sprites/bat.json",
  "text!../sprites/bat2.json",
  "text!../sprites/beachnpc.json",
  "text!../sprites/bluesword.json",
  "text!../sprites/boss.json",
  "text!../sprites/skeletonleader.json",
  "text!../sprites/chest.json",
  "text!../sprites/clotharmor.json",
  "text!../sprites/coder.json",
  "text!../sprites/crab.json",
  "text!../sprites/death.json",
  "text!../sprites/deathknight.json",
  "text!../sprites/desertnpc.json",
  "text!../sprites/eye.json",
  "text!../sprites/firefox.json",
  "text!../sprites/forestnpc.json",
  "text!../sprites/goblin.json",
  "text!../sprites/goblin2.json",
  "text!../sprites/zombie.json",
  "text!../sprites/necromancer.json",
  "text!../sprites/goldenarmor.json",
  "text!../sprites/bluearmor.json",
  "text!../sprites/frozenarmor.json",
  "text!../sprites/hornedarmor.json",
  "text!../sprites/goldensword.json",
  "text!../sprites/frozensword.json",
  "text!../sprites/guard.json",
  "text!../sprites/hand.json",
  "text!../sprites/impact.json",
  "text!../sprites/item-axe.json",
  "text!../sprites/item-blueaxe.json",
  "text!../sprites/item-bluemorningstar.json",
  "text!../sprites/item-bluesword.json",
  "text!../sprites/item-burger.json",
  "text!../sprites/item-cake.json",
  "text!../sprites/item-firepotion.json",
  "text!../sprites/item-flask.json",
  "text!../sprites/item-rejuvenationpotion.json",
  "text!../sprites/item-poisonpotion.json",
  "text!../sprites/item-nanopotion.json",
  "text!../sprites/item-gemruby.json",
  "text!../sprites/item-gememerald.json",
  "text!../sprites/item-gemamethyst.json",
  "text!../sprites/item-gemtopaz.json",
  "text!../sprites/item-gemsapphire.json",
  "text!../sprites/item-gold.json",
  "text!../sprites/item-ringbronze.json",
  "text!../sprites/item-ringsilver.json",
  "text!../sprites/item-ringgold.json",
  "text!../sprites/item-scrollupgradelow.json",
  "text!../sprites/item-scrollupgrademedium.json",
  "text!../sprites/item-scrollupgradehigh.json",
  "text!../sprites/item-skeletonkey.json",
  "text!../sprites/item-raiblockstl.json",
  "text!../sprites/item-raiblockstr.json",
  "text!../sprites/item-raiblocksbl.json",
  "text!../sprites/item-raiblocksbr.json",
  "text!../sprites/item-goldenarmor.json",
  "text!../sprites/item-bluearmor.json",
  "text!../sprites/item-frozenarmor.json",
  "text!../sprites/item-hornedarmor.json",
  "text!../sprites/item-beltleather.json",
  "text!../sprites/item-beltplated.json",
  "text!../sprites/item-beltfrozen.json",
  "text!../sprites/item-goldensword.json",
  "text!../sprites/item-frozensword.json",
  "text!../sprites/item-leatherarmor.json",
  "text!../sprites/item-mailarmor.json",
  "text!../sprites/item-morningstar.json",
  "text!../sprites/item-platearmor.json",
  "text!../sprites/item-redarmor.json",
  "text!../sprites/item-redsword.json",
  "text!../sprites/item-dagger.json",
  "text!../sprites/item-sword.json",
  "text!../sprites/king.json",
  "text!../sprites/lavanpc.json",
  "text!../sprites/leatherarmor.json",
  "text!../sprites/loot.json",
  "text!../sprites/mailarmor.json",
  "text!../sprites/morningstar.json",
  "text!../sprites/nyan.json",
  "text!../sprites/octocat.json",
  "text!../sprites/anvil.json",
  "text!../sprites/anvil-success.json",
  "text!../sprites/anvil-fail.json",
  "text!../sprites/waypointx.json",
  "text!../sprites/waypointn.json",
  "text!../sprites/ogre.json",
  "text!../sprites/yeti.json",
  "text!../sprites/werewolf.json",
  "text!../sprites/wraith.json",
  "text!../sprites/platearmor.json",
  "text!../sprites/priest.json",
  "text!../sprites/rat.json",
  "text!../sprites/rat2.json",
  "text!../sprites/redarmor.json",
  "text!../sprites/redsword.json",
  "text!../sprites/rick.json",
  "text!../sprites/scientist.json",
  "text!../sprites/shadow16.json",
  "text!../sprites/skeleton.json",
  "text!../sprites/skeleton2.json",
  "text!../sprites/skeleton3.json",
  "text!../sprites/snake.json",
  "text!../sprites/snake2.json",
  "text!../sprites/sorcerer.json",
  "text!../sprites/sparks.json",
  "text!../sprites/spectre.json",
  "text!../sprites/attack.json",
  "text!../sprites/dagger.json",
  "text!../sprites/sword.json",
  "text!../sprites/talk.json",
  "text!../sprites/target.json",
  "text!../sprites/levelup.json",
  "text!../sprites/villagegirl.json",
  "text!../sprites/villager.json",
  "text!../sprites/carlosmatos.json",
  "text!../sprites/satoshi.json",
  "text!../sprites/wizard.json",
], function () {
  var sprites = {};

  _.each(arguments, function (spriteJson) {
    var sprite = JSON.parse(spriteJson);

    sprites[sprite.id] = sprite;
  });

  return sprites;
});
