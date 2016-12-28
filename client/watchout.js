// start slingin' some d3 here.

// console.log('my fav way to start');
// var transition = require('../d3-transition');

var transition = d3.transition();


var gameOptions = {
  height: '96%',
  width: '96%',
  nEnemies: 5,
  padding: 20
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard = d3.select('.board').append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);


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




var tweenWithoutCollisionDetection = (endData) => {
  // var enemy = d3.select(this);
  console.log(this);
  // console.log(context);
  // console.log(enemy);
  console.log(endData);
  // console.log(other);
  console.log('from in tweenWithoutCollisionDetection');
  debugger;


  var startPos = {
    x: parseFloat(enemy.attr('x')),
    y: parseFloat(enemy.attr('y'))
  };

  var endPos = {
    x: axes.x(endData.x),
    y: axes.y(endData.y)
  };

  return (t) => {
    var enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };

    enemy.attr('x', enemyNextPos.x)
      .attr('y', enemyNextPos.y);
  };
};




var render = enemyData => {
  debugger;
  var enemies = gameBoard.selectAll('.enemy')
    .data(enemyData, d => d.id);
  enemies.enter()
    .append('svg:image')
      .attr('class', 'enemy')
      .attr('href', 'asteroid.png')
      .attr('x', enemy => axes.x(enemy.x))
      .attr('y', enemy => axes.y(enemy.y));

  // enemies.update()
  //   .

  enemies.exit()
    .remove();
  // console.log(enemies)
  // console.log('enemies.transition', enemies.transition());
  // gameBoard.selectAll('.enemy').transition()
    // .duration(500)
    // .attr('href', 'grinning-face.png')
    // .attr('x', '50px')
  console.log(enemies.transition());
  enemies.transition()
    // .tween('custom', tweenWithoutCollisionDetection.bind(this));
    .tween('custom', function(endData) {
      console.log('endData', endData);
      console.log('node', node);

      var node = this;
      return function(t) {
        node.setAttribute('x', axes.x(endData.x));
        node.setAttribute('y', axes.y(endData.y));
      };

      // tweenWithoutCollisionDetection.call(context);
    //   console.log('anythihng');
    });
};

var gameTurn = () => {
  var newEnemyPositions = createEnemies();
  render(newEnemyPositions);
};

var play = () => {
  gameTurn();
  setInterval(gameTurn, 2000);
};

play();



