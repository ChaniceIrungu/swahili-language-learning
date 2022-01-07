// create a new scene named "Game"
let gameScene = new Phaser.Scene("Game");

// some parameters for our scene
gameScene.init = function () {
  //word database
  this.words = [
    {
      key: "building",
      setXY: {
        x: 100,
        y: 240,
      },
      spanish: "edificio",
    },
    {
      key: "house",
      setScale: {
        x: 0.8,
        y: 0.8,
      },
      setXY: {
        x: 240,
        y: 280,
      },
      spanish: "casa",
    },
    {
      key: "car",
      setScale: {
        x: 0.8,
        y: 0.8,
      },
      setXY: {
        x: 400,
        y: 300,
      },
      spanish: "automovil",
    },

    {
      key: "tree",
      setXY: {
        x: 550,
        y: 250,
      },
      spanish: "arbol",
    },
  ];
};

// load asset files for our game
gameScene.preload = function () {
  this.load.image("mtKenya", "assets/images/mtKenya.jpg");
  this.load.image("building", "assets/images/building.png");
  this.load.image("car", "assets/images/car.png");
  this.load.image("house", "assets/images/house.png");
  this.load.image("tree", "assets/images/tree.png");

  this.load.audio("treeAudio", "assets/audio/arbol.mp3");
  this.load.audio("carAudio", "assets/audio/auto.mp3");
  this.load.audio("houseAudio", "assets/audio/casa.mp3");
  this.load.audio("buildingAudio", "assets/audio/edificio.mp3");
  this.load.audio("correct", "assets/audio/correct.mp3");
  this.load.audio("wrong", "assets/audio/wrong.mp3");
};

// executed once, after assets were loaded
gameScene.create = function () {
  //background
  let bg = this.add.sprite(0, 0, "mtKenya").setOrigin(0, 0);
  //make bg interactive
  bg.setInteractive();
  bg.on("pointerdown", function (pointer) {
    console.log("click");
    console.log(pointer);
  });

  //building
  this.items = this.add.group(this.words);

  let items = this.items.getChildren();

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    //make an Item Interactive
    item.setInteractive();

    //create tween - resize tween
    item.resizeTween = this.tweens.add({
      targets: item,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      paused: true, //gives control on when tween will begin
      yoyo: true, //return to original size
      ease: "Quad.easeInOut",
    });

    //Transparency Tween when hovering
    item.alphaTween = this.tweens.add({
      targets: item,
      alpha: 0.7,
      duration: 200,
      paused: true, //gives control on when tween will begin
      yoyo: true, //return to original size
    });

    //tween for correct
    item.correctTween = this.tweens.add({
      targets: item,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      paused: true, //gives control on when tween will begin
      yoyo: true, //return to original size
      ease: "Quad.easeInOut",
    });

    //tween for wrong
    item.wrongTween = this.tweens.add({
      targets: item,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      angle: 90,
      paused: true, //gives control on when tween will begin
      yoyo: true, //return to original size
      ease: "Quad.easeInOut",
    });

    //listen to the pointerdown event
    item.on(
      "pointerdown",
      function (pointer) {
        let result = this.processAnswer(this.words[i].spanish);
        if (result) {
          item.correctTween.restart();
        } else {
          item.wrongTween.restart();
        }
        //show next question
        this.showNextQuestion();
      },
      this
    );

    // listen to pointerover event to let user know clicking should happen

    item.on("pointerover", function (pointer) {
      item.alphaTween.restart();
    });
    //create a sound for each word
    this.words[i].sound = this.sound.add(this.words[i].key + "Audio");
  }

  //text object
  this.wordText = this.add.text(30, 20, "", {
    font: "40px Open Sans",
    fill: "black",
  });

  //correct/ wrong sounds
  this.correctSound = this.sound.add("correct");
  this.wrongSound = this.sound.add("wrong");

  //show the first question
  this.showNextQuestion();
};

//show new question
gameScene.showNextQuestion = function () {
  //select a random word
  this.nextWord = Phaser.Math.RND.pick(this.words);

  //play a sound for that word in spanish

  this.nextWord.sound.play();
  //show the text of the word in spanish
  this.wordText.setText(this.nextWord.spanish);
};

//check answer
gameScene.processAnswer = function (userResponse) {
  if (userResponse == this.nextWord.spanish) {
    //it's correct

    //play sound
    this.correctSound.play();
    return true;
  } else {
    // it's wrong

    //play sound
    this.wrongSound.play();
    return false;
  }
};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: "Swahili Learning Game",
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
