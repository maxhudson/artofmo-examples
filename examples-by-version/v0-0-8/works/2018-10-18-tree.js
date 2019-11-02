var run = () => {
  mo.colors.fetch({samples: [[91, 97, 138]], count: 5}).then(colors => {
    var customColors;
    var colors = customColors || colors;

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var trees = {count: 16};

      trees.spacing = {x: size.width * 0.7 / (trees.count - 3)};

      _.times(trees.count, x => {
        var tree = {
          height: size.width / 2,
          heightFactor: (1 - rand(0.5)),
          width: size.width * 0.04 * (1 - rand(0.8)),
          trunkHeight: 50,
          xScalar: randInt(2) ? 1 : -1
        };

        tree.height *= tree.heightFactor;

        var offset = {
          x: -size.width * 0.4 + x * trees.spacing.x + trees.spacing.x * (1 + rand(0.8, -0.5)),
          y: size.height / 2 - tree.trunkHeight
        };

        var branches = {
          shape: 'path',
          position: sum({x: 0, y: -tree.trunkHeight}, offset),
          points: [{x: 0, y: tree.trunkHeight}, {x: 0, y: 2}, {x: 0, y: 5}],
          stroke: 'white',
          fill: _.sample(colors),
          count: 30
        };

        branches.spacing = {x: tree.width / 2, y: tree.height / branches.count};

        _.times(branches.count, b => {
          branches.points.push({
            x: ((b % 2) === 0 ? -1 : 1) * tree.xScalar * branches.spacing.x * ((branches.count - b * 0.7) / branches.count) * (1 + rand(1)),
            y: -b * branches.spacing.y - rand(branches.spacing.y * 0.9)
          });
        });

        branches.points.push({x: 0, y: -tree.height});

        branches.commands = mo.g.pathCommands.forCurveThrough({points: branches.points, smoothing: 2});

        branches.object = new mo.FabricCanvasObject({...branches});

        canvasView.add(branches);
      });

      render();
    });
  });
};

export default {run};
