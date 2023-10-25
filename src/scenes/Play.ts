import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  player?: Phaser.GameObjects.Shape;

  enemy1?: Phaser.GameObjects.Shape;
  enemy2?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond
  movementSpeed = 3;
  enemySpeed = 1.5;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.player = this.add.rectangle(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) - 50,
      25,
      25,
      0xff0000,
    );

    this.enemy1 = this.add.rectangle(
      (this.game.config.width as number) + 100,
      100,
      75,
      50,
      0xffffff,
    );

    this.enemy2 = this.add.rectangle(
      (this.game.config.width as number) + 100,
      175,
      50,
      40,
      0xffffff,
    );
  }

  isLaunched = false;

  update(_timeMs: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown && !this.isLaunched) {
      this.player!.x -= this.movementSpeed;
    }
    if (this.right!.isDown && !this.isLaunched) {
      this.player!.x += this.movementSpeed;
    }

    if (this.fire!.isDown && !this.isLaunched) {
      this.tweens.add({
        targets: this.player,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });

      this.isLaunched = true;
    }

    if (this.isLaunched) {
      this.player!.y -= this.movementSpeed;
    }

    if (this.player!.y <= 0 - this.player!.height) {
      this.player!.y = (this.game.config.height as number) - 50;
      this.isLaunched = false;
    }

    this.enemy1!.fillColor += 0x00ff00;
    this.enemy1!.x -= this.enemySpeed;
    if (this.enemy1!.x <= 0 - this.enemy1!.width) {
      this.enemy1!.x = (this.game.config.width as number) + this.enemy1!.width;
    }

    this.enemy2!.fillColor += 0xff0000;
    this.enemy2!.x -= this.enemySpeed * 2;
    if (this.enemy2!.x <= 0 - this.enemy2!.width) {
      this.enemy2!.x = (this.game.config.width as number) + this.enemy2!.width;
    }

    if (this.checkCollision(this.player!, this.enemy1!)) {
      this.enemy1!.x = (this.game.config.width as number) + this.enemy1!.width;
      this.player!.y = (this.game.config.height as number) - 50;
      this.isLaunched = false;
    }
    if (this.checkCollision(this.player!, this.enemy2!)) {
      this.enemy2!.x = (this.game.config.width as number) + this.enemy2!.width;
      this.player!.y = (this.game.config.height as number) - 50;
      this.isLaunched = false;
    }
  }

  checkCollision(
    player: Phaser.GameObjects.Shape,
    enemy: Phaser.GameObjects.Shape,
  ) {
    return (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.height + player.y > enemy.y
    );
  }
}
