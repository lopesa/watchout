// start slingin' some d3 here.

// console.log('my fav way to start');

var gameOptions = {
  height: '96%',
  width: '96%',
  nEnemies: 40,
  padding: 20
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard = d3.select('.board').append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);


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

gameBoard.selectAll('.enemy')
  .data(newEnemyPositions, d => d.id)
  .enter()
  .append('svg:image')
    .attr('class', 'enemy')
    .attr('href', 'asteroid.png')
    .attr('x', enemy => axes.x(enemy.x))
    .attr('y', enemy => axes.y(enemy.y))

