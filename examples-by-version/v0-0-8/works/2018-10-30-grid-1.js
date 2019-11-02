var run = () => {
  mo.colors.fetch({samples: [[255, 244, 236], [242, 184, 128]], count: 5}).then(colors => {
    var customColors;
    var colors = customColors || colors;
    var originalColors = _.clone(colors); //eslint-disable-line;

    //["rgb(251, 248, 243)","rgb(238, 185, 130)","rgb(193, 162, 120)","rgb(123, 113, 98)","rgb(98, 81, 74)"]
    //["rgb(253, 247, 237)","rgb(245, 187, 129)","rgb(231, 123, 59)","rgb(46, 55, 36)","rgb(38, 68, 52)"]
    //["rgb(247, 241, 231)","rgb(242, 186, 127)","rgb(204, 154, 96)","rgb(115, 119, 118)","rgb(76, 94, 101)"]

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var cells = {count: 5};
      var margin = 100;
      var offset = {x: (size.width - margin) / -2, y: (size.height - margin) / -2};

      _.times(cells.count, row => {
        _.times(cells.count, column => {
          if (row > -1) {
            var cell = {};

            cell.spacing = (size.width - margin) / (cells.count);
            cell.offset = {x: cell.spacing * 0.2, y: cell.spacing * 0.2};
            cell.position = sum(offset, cell.offset, {x: column * cell.spacing, y: row * cell.spacing});

            var s = cell.size = cell.spacing * 0.6;

            _.times(4, b => {
              if (rand() < 0.8) {
                var bar = {
                  shape: 'rect',
                  fill: _.sample(colors),
                  origin: {x: 'left', y: 'bottom'},
                  rx: 1,
                  ry: 1,
                  position: sum(cell.position, {x: 7 * b, y: s}),// + rand(4, -0.5)}),
                  size: {width: 3, height: s * (0.6 + rand(0.4))},
                  opacity: 0.9 - (randInt(2) ? 0.4 : 0)
                };

                // ring.commands = mo.g.pathCommands.forCurveThrough({points: ring.points, smoothing: 0});
                bar.object = new mo.FabricCanvasObject({...bar});

                canvasView.add(bar);
              }
            });

            _.times(9, b => {
              if (!_.includes([8, 7, 5], b) && rand() < 0.8) {
                var box = {
                  shape: 'rect',
                  fill: _.sample(colors),
                  origin: {x: 'left', y: 'bottom'},
                  rx: 1, ry: 1,
                  size: {width: s * 0.15, height: s * 0.1},
                  opacity: 0.8 - rand(0.8)
                };

                box.position = sum(cell.position, {
                  x: s * 0.55 + 1 + (b % 3) * (s * 0.15 + 2),
                  y: s - _.floor(b / 3) * (s * 0.1 + 2)
                });

                // ring.commands = mo.g.pathCommands.forCurveThrough({points: ring.points, smoothing: 0});
                box.object = new mo.FabricCanvasObject({...box});

                canvasView.add(box);
              }
            });
          }
        });
      });

      render();
    });
  });
};

export default {run};
