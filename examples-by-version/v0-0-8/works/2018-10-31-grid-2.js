var run = () => {

  mo.colors.fetch({samples: [], count: 4}).then(colors => {

    var customColors = [[105, 109, 125], [111, 146, 131], [141, 159, 135], [205, 198, 165]].map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
    var colors = customColors || colors;
    var originalColors = _.clone(colors); //eslint-disable-line;

    console.log(JSON.stringify(colors)); //eslint-disable-line

    //var bgColor = //colors[0];

    //_.pullAt(colors, 0);

    //["rgb(237, 120, 122)","rgb(245, 213, 144)","rgb(214, 208, 140)","rgb(98, 162, 135)","rgb(75, 67, 91)"]

    mo.ui.init.basic({
      backgroundColor: '#fff',
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var cells = {count: 4};
      var margin = 0;
      var offset = {x: (size.width - margin) / -2, y: (size.height - margin) / -2};

      _.times(cells.count, row => {
        _.times(cells.count, column => {
            var cell = {};

            cell.spacing = (size.width - margin) / (cells.count);
            cell.offset = {x: cell.spacing * 0.2, y: cell.spacing * 0.2};
            cell.position = sum(offset, {x: column * cell.spacing, y: row * cell.spacing});

            var s = cell.size = cell.spacing * 0.6;

            var rect = {
              shape: 'rect',
              fill: colors[max(min(row - (rand() < 0.5 ? randInt(3) - 1 : 0), 3), 0)],
              position: sum(cell.position),
              origin: {x: 'left', y: 'top'},
              size: cell.spacing,
              opacity: 1 - rand(0.2)
            };

            rect.object = new mo.FabricCanvasObject({...rect});

            canvasView.add(rect);

            _.times(3, i => {
                var scale = 1 - rand(0.3);

                var drop = {
                  shape: 'path',
                  fill: 'white',
                  origin: {x: 'left', y: 'top'},
                  position: sum(cell.position, {x: 30 + i * 30, y: 65}),// + rand(40, -0.5)}),
                  points: [
                    {x: 0, y: 0},
                    {x: -10 * scale, y: 10 * scale},
                    {x: 0, y: 30 * scale},
                    {x: 10 * scale, y: 10 * scale},
                    {x: 0, y: 0}
                  ],
                  rotation: rand(20, -0.5),
                  opacity: 0.6 - rand(0.4)
                };

                if (rand() < 0.7) {
                  drop.commands = mo.g.pathCommands.forCurveThrough({points: drop.points, smoothing: 1});
                  drop.object = new mo.FabricCanvasObject({...drop});

                  canvasView.add(drop);
                }

              _.times(5, r => {
                _.times(5, d => {
                  if (rand() < 1 - (r * 0.2)) {
                    var dot = {
                      shape: 'circle',
                      fill: 'white',
                      origin: {x: 'center', y: 'center'},
                      position: sum({x: 3 + (d - 2) * 6 , y: -10 - r * 6}, drop.position),
                      radius: 2 - rand(1),
                      opacity: 0.6 - rand(0.4)
                    };

                    dot.object = new mo.FabricCanvasObject({...dot});

                    canvasView.add(dot);
                  }
                });
              });
            });
          });
        });


        render();
      });
    });
};

export default {run};
