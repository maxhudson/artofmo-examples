var run = () => {
  mo.colors.fetch({samples: [[58, 64, 90]], count: 10}).then(colors => {
    var customColors = ["rgb(57, 65, 92)","rgb(128, 103, 114)","rgb(193, 183, 170)","rgb(223, 238, 233)","rgb(230, 179, 109)"];

    //["rgb(57, 65, 92)","rgb(128, 103, 114)","rgb(193, 183, 170)","rgb(223, 238, 233)","rgb(230, 179, 109)"]
    //["rgb(66, 37, 61)","rgb(137, 114, 129)","rgb(232, 191, 122)","rgb(205, 192, 125)","rgb(87, 112, 98)"]
    //["rgb(57, 65, 88)","rgb(146, 119, 89)","rgb(192, 150, 102)","rgb(199, 159, 104)","rgb(210, 173, 111)"]

    colors = customColors || colors;

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500},
      images: {
        rock: '../../assets/images/circle-1.png'
      }
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var grid = {rows: 20, columns: 20, cells: {}};

      grid.spacing = size.width / (grid.rows - 2);

      var offset = {x: -size.width * 0.5 + grid.spacing * 1, y: -size.height * 0.5 + grid.spacing * 1};

      _.times(grid.rows, row => _.times(grid.columns, column => grid.cells[`${row}-${column}`] = {row, column}));

      _.forEach(grid.cells, cell => {
        var {row, column} = cell;

        cell.targetPoints = [];

        _.forEach([[0, 1], [1, 0], [1, 1]], ([dr, dc]) => {
          cell.targetPoints.push(product({x: dr, y: dc}, grid.spacing));
        });

        cell.targetPoints.forEach((targetPoint, tp) => {
          if (rand() < 0.2 + rand(max(row + column) * 0.9 / grid.rows)) {
            var scalar = (randInt(2) ? -1 : 1);
            var magnitude = grid.spacing * (0.1 + rand(0.4));
            var dist = 1/2;

            _.times(5, w => {
              var wave = {
                type: 'shape',
                shape: 'path',
                stroke: _.sample(colors),
                zIndex: tp,
                position: sum(offset, product({x: row, y: column}, grid.spacing), randPoint(2)),
                strokeWidth: 1,
                opacity: w ? 0.5 : 1
              };

              var points = [{x: 0, y: 0}];
              var alpha = mo.util.trig.alpha({p1: {x: 0, y: 0}, p2: targetPoint, perpendicular: 1});

              var midpoint = product(targetPoint, dist);

              points.push(mo.util.trig.translate({point: midpoint, by: scalar * magnitude + w * grid.spacing * (0.03 + rand(0.02)), alpha}));
              points.push(targetPoint);

              wave.commands = mo.g.pathCommands.forCurveThrough({points, smoothing: 2});
              //wave.commands = points.map(point => ({point}));
              wave.object = new mo.FabricCanvasObject(wave);

              canvasView.add(wave);
            });
          }
        });
      });

      render();
    });
  });
};

export default {run};
