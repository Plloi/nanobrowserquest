import { Types } from "../../shared/js/gametypes";
import Pet from "./pet";
import Timer from "./timer";

export const Pets = {
  Dino: class Dino extends Pet {
    constructor(id, props: any = {}) {
      super(id, Types.Entities.PETDINO, props);
      this.moveSpeed = 200;
      this.atkSpeed = 100;
      this.raiseSpeed = 125;
      this.idleSpeed = 100;
      this.atkRate = 2000;
      this.raiseRate = 1000;
      this.attackCooldown = new Timer(this.atkRate);
      this.raiseCooldown = new Timer(this.raiseRate);
      // @TODO prevent monster heal aura
      // this.auras = ["drainlife", "lowerresistance"];
    }

    idle(orientation) {
      if (!this.hasTarget()) {
        super.idle(Types.Orientations.DOWN);
      } else {
        super.idle(orientation);
      }
    }
  },
};

export default Pets;
