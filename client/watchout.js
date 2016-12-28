// start slingin' some d3 here.

// console.log('my fav way to start');
// var transition = require('../d3-transition');

// var transition = d3.transition();


var gameOptions = {
  height: '450',
  width: '700',
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
      .attr('y', enemy => axes.y(enemy.y));


  enemies.exit()
    .remove();

  // console.log(enemies.transition());
  enemies.transition()
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



