var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game= new Phaser.Game(config);
var score = 0;
function preload ()
  //loading progress bar animation
  {

    var progress = this.add.graphics();

    this.load.on('progress', function (value) {

        progress.clear();
        progress.fillStyle(0xffffff, 1);
        progress.fillRect(0, 270, 800 * value, 60);

    });

    this.load.on('complete', function () {

        progress.destroy();

    });



    console.log('preload');
    this.load.tilemapTiledJSON('map', 'asset/map2.json');

    this.load.spritesheet('tiles', 'asset/tiles.png',  { frameWidth: 70, frameHeight: 70 });
    this.load.spritesheet('collect', 'asset/collect.png',  { frameWidth: 70, frameHeight: 70 });



    this.load.image('sky', 'asset/sky.png');
    this.load.image('sky', 'asset/sky.png');
    this.load.image('intro', 'asset/intro.png');

    this.load.spritesheet('ninja', 'asset/ninja_sprite.png',  { frameWidth: 165, frameHeight: 292 });



  }

function create ()
{
  console.log('create')
    this.add.image(400, 300, 'sky');
    this.add.image(400, 400, 'intro');
   map = this.make.tilemap({key: 'map'});
   console.log(map)
  var groundTiles = map.addTilesetImage('tiles');
  var collectTiles = map.addTilesetImage('collect');
   groundLayer = map.createDynamicLayer('World', groundTiles, 0,0);
   text_layer = map.createDynamicLayer('background', groundTiles, 0, 0);
  collect_layer= map.createDynamicLayer('collect', collectTiles, 0, 0);
  groundLayer.setCollisionByExclusion([-1]);



    ninja = this.physics.add.sprite(100, 200, 'ninja').setScale(0.4);

    this.physics.add.collider(groundLayer, ninja);

    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    collect_layer.setTileIndexCallback(89, collectitems, this);
    collect_layer.setTileIndexCallback(90, collectitems, this);
    collect_layer.setTileIndexCallback(91, collectitems, this);
    collect_layer.setTileIndexCallback(92, collectitems, this);
    collect_layer.setTileIndexCallback(93, collectitems, this);
    collect_layer.setTileIndexCallback(94, collectitems, this);
    collect_layer.setTileIndexCallback(95, collectitems, this);
    this.physics.add.overlap(ninja, collect_layer);
    ninja.setCollideWorldBounds(true);
    //ninja.body.setSize(ninja.width, ninja.height);
  cursors = this.input.keyboard.createCursorKeys();
  //ninja=this.add.sprite(200, 350, 'ninja');
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  // make the camera follow the player
    this.cameras.main.startFollow(ninja);




    this.anims.create({
    key:'run',
    frames: this.anims.generateFrameNumbers('ninja', { start: 5, end: 29})
    //repeat:-1
  });

    this.anims.create({
    key:'runfaster',
    frames: this.anims.generateFrameNumbers('ninja', { start: 5, end: 29}),
    frameRate: 40
    //repeat:-1
  });

   this.anims.create({
    key:'jump',
    frames: this.anims.generateFrameNumbers('ninja', { start: 31, end: 62}),
    //frameRate: 20
    //repeat:-1
  });

text = this.add.text(20, 570, '0', {
    fontSize: '20px',
    fill: '#ffffff'
});
// fix the text to the camera
text.setScrollFactor(0);

}

function collectitems(sprite, tile) {
    console.log('collect')
    collect_layer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 10 points to the score
    text.setText(score); // set the text to show the current score
    return false;
}

var Pressed=false
function update ()
{

if ((cursors.up.isUp)&&(Pressed==false)){
  if (ninja.flipX==-1){
    ninja.body.setVelocityX(-100);
  }
  else{
  ninja.body.setVelocityX(100);
    }
    ninja.anims.play('run', true);
}
if (cursors.up._justDown && ninja.body.onFloor()){
  Pressed=true;
  //ninja.body.setVelocityY(-360);
  //
  ninja.body.setVelocityY(-380);
  ninja.anims.play('jump',true);
  //ninja.body.setVelocityX(500);



}
if (cursors.right.isDown && (!(ninja.anims.currentAnim.key=='jump'))){

  Pressed=true;
  if (ninja.flipX==-1){
    ninja.flipX=0
  }

  ninja.body.setVelocityX(250);
  ninja.anims.play('runfaster',true)
}

if (cursors.right.isDown && (ninja.anims.currentAnim.key=='jump')){
  Pressed=true;
  ninja.flipX=0
  ninja.body.setVelocityX(250);
  //ninja.anims.play('runfaster',true)
}

if (cursors.left.isDown && (ninja.anims.currentAnim.key=='jump')){
  Pressed=true;
  ninja.flipX=-1
  ninja.body.setVelocityX(-250);
  //ninja.anims.play('runfaster',true)
}

if (cursors.left.isDown && (!(ninja.anims.currentAnim.key=='jump'))){
  Pressed=true;
  ninja.flipX =-1
  ninja.body.setVelocityX(-250);
  ninja.anims.play('runfaster',true)
}

  //ninja.anims.play('runfaster',true)


if(!(ninja.anims.isPlaying)){
  Pressed=false;
}



//pause code
   var _anims = this.anims;

    document.addEventListener('mouseup', function () {

        if (_anims.paused)
        {
            _anims.resumeAll();

            }

        else
        {
            _anims.pauseAll();
            ninja.body.setVelocityX(0)


          }

    });


}
