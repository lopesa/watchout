// start slingin' some d3 here.

// console.log('my fav way to start');
// var transition = require('../d3-transition');

// var transition = d3.transition();


var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 20,
  padding: 20
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard = d3.select('.board').append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);


////////////////////////
//    THE PLAYER
////////////////////////


var Player = () => {
  // debugger;

  var instance = {};

  var path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';

  var fill = '#ff6600';
  var x = 0;
  var y = 0;
  var angle = 0;
  var r = 5;
  var el;

  instance.render = to => {
    el = to.append('svg:path')
      .attr('d', path)
      .attr('fill', fill);

    instance.transform({
      x: gameOptions.width * 0.5,
      y: gameOptions.height * 0.5
    });

    instance.setUpDragging();
  };

  instance.getX = () => x;
  instance.getY = () => y;
  instance.getR = () => r;

  instance.setX = newX => {
    var minX = gameOptions.padding;
    var maxX = gameOptions.width - gameOptions.padding;

    if (newX <= minX) {
      newX = minX;
    }
    if (newX >= maxX) {
      newX = maxX;
    }

    x = newX;
  };

  instance.setY = newY => {
    var minY = gameOptions.padding;
    var maxY = gameOptions.height - gameOptions.padding;

    if (newY <= minY) {
      newY = minY;
    }
    if (newY >= maxY) {
      newY = maxY;
    }

    y = newY;
  };


  instance.transform = opts => {
    // console.log('el', el);
    instance.setX(opts.x || x);
    instance.setY(opts.y || y);

    // todo: use backticks to do this.
    el.attr('transform', 'translate(' + instance.getX() + ',' + instance.getY() + ')');
    // el.attr('transform', `translate({instance.getX()},{instance.getY()})`);
  };

  instance.moveRelative = (dx, dy) => {
    instance.transform({
      x: instance.getX() + dx,
      y: instance.getY() + dy
    });
  };

  instance.setUpDragging = () => {
    var dragMove = () => {
      instance.moveRelative(d3.event.dx, d3.event.dy);
    };

    var drag = d3.behavior.drag()
      .on('drag', dragMove);

    el.call(drag);
  };



  return instance;
};

// var players = [];
var player = Player();
player.render(gameBoard);

// players.push(player.render(gameBoard));

////////////////////////
//    END PLAYER
////////////////////////


var checkCollision = (enemy, collidedCallback) => {
  // console.log('ever here');

  var radiusSum = parseFloat(enemy.attr('r')) + player.getR();
  var xDiff = parseFloat(enemy.attr('x')) - player.getX();
  var yDiff = parseFloat(enemy.attr('y')) - player.getY();

  var separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) );

  if (separation < radiusSum) {
    collidedCallback(player, enemy);
  }
};

var onCollision = () => {
  console.log('collision');
  // updateBestScore();
  // gameStats.score = 0;
  // updateScore();
};


var createEnemies = () => {
  var newEnemyPositions = [];

  for (var i = 0; i < gameOptions.nEnemies; i++) {
    newEnemyPositions.push(
      {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }
    );
  }
  return newEnemyPositions;
};




// var tweenWithoutCollisionDetection = (endData) => {
//   // var enemy = d3.select(this);
//   console.log(this);
//   // console.log(context);
//   // console.log(enemy);
//   console.log(endData);
//   // console.log(other);
//   console.log('from in tweenWithoutCollisionDetection');
//   // debugger;


//   var startPos = {
//     x: parseFloat(enemy.attr('x')),
//     y: parseFloat(enemy.attr('y'))
//   };

//   var endPos = {
//     x: axes.x(endData.x),
//     y: axes.y(endData.y)
//   };

//   return (t) => {
//     var enemyNextPos = {
//       x: startPos.x + (endPos.x - startPos.x) * t,
//       y: startPos.y + (endPos.y - startPos.y) * t
//     };

//     enemy.attr('x', enemyNextPos.x)
//       .attr('y', enemyNextPos.y);
//   };
// };




var render = enemyData => {
  // debugger;
  var enemies = gameBoard.selectAll('.enemy')
    .data(enemyData, d => d.id);

  enemies.enter()
    .append('svg:image')
      .attr('class', 'enemy')
      .attr('href', 'asteroid.png')
      .attr('x', enemy => axes.x(enemy.x))
      .attr('y', enemy => axes.y(enemy.y))
      .attr('r', 0);


  enemies.exit()
    .remove();

  // console.log(enemies.transition());
  enemies.transition()
    .duration(200)
      .attr('r', 10)
    .transition()
      .duration(800)
    // todo, make this happen as a named external function
    // .tween('custom', tweenWithoutCollisionDetection.bind(this));
      .tween('custom', function(endData) {

        var d3node = d3.select(this);

        var startPos = {
          x: parseFloat(d3node.attr('x')),
          y: parseFloat(d3node.attr('y'))
        };

        var endPos = {
          x: parseFloat(axes.x(endData.x)),
          y: parseFloat(axes.y(endData.y))
        };

        return function(t) {
          checkCollision(d3node, onCollision);

          var enemyNextPos = {
            x: startPos.x + (endPos.x - startPos.x) * t,
            y: startPos.y + (endPos.y - startPos.y) * t
          };

          d3node.attr('x', enemyNextPos.x)
           .attr('y', enemyNextPos.y);
        };
      });
};


// INIT
//
//
//

var gameTurn = () => {
  var newEnemyPositions = createEnemies();
  render(newEnemyPositions);
};

var play = () => {
  gameTurn();
  setInterval(gameTurn, 1000);
};

play();



