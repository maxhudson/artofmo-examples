var run = () => {
  mo.colors.fetch({samples: [[70, 129, 137]], count: 10}).then(colors => {
    var customColors = ["rgb(69, 130, 140)","rgb(114, 162, 145)","rgb(195, 190, 156)","rgb(195, 172, 123)","rgb(177, 107, 84)"];

    //["rgb(65, 63, 87)","rgb(63, 196, 188)","rgb(44, 224, 166)","rgb(229, 231, 123)","rgb(247, 160, 178)"]
    //["rgb(234, 195, 71)","rgb(92, 129, 190)","rgb(52, 96, 164)","rgb(114, 156, 144)","rgb(188, 172, 119)"]

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
    }).then(({sum, min, max, rand, randInt, render, canvasView, size, images}) => { //eslint-disable-line
      var padding = 0;
      var offset = {x: size.width * -0.5 + padding, y: size.height * -0.5 + padding + 150};
      var lines = {count: 120};

      lines.spacing = (size.height - 150 - padding * 2) / (lines.count - 1);
      lines.bumps = {count: 50};
      lines.width = (size.width - padding * 2 + 20);

      var transformY = 0;
      var transforms = [];

      var bumps = lines.bumps.count;
      var direction = 1;

      _.times(bumps * 2, t => {
        if (_.includes(_.times(5, () => randInt(bumps)), t)) direction *= -1;

        transformY -= direction * lines.spacing * (1 + rand(2));

        transforms.push({x: 0, y: min(transformY, 0)});
      });

      _.times(lines.count, l => {
        var color = _.sample(colors);

        var line = {
          type: 'shape',
          shape: 'path',
          stroke: '#000000',
          fill: color,
          zIndex: l,
          position: sum(offset, {x: rand(6), y: l * lines.spacing}, {x: rand(2), y: 0}),
          strokeWidth: 1,
          strokeWidth: 1,
          shadow: {
            color: '#000000',
          }
        };

        var points = _.times(bumps, t => {
          return sum(
            transforms[_.floor(t - l + 50) - randInt(1)] || {x: 0, y: 0},
            {x: 0, y: rand(0.5)},
            {x: lines.width / (bumps - 1) * t, y: rand(lines.spacing * 0.2, -0.5)}
          );
        });

        points = [{x: 0, y: 1000}, {x: 0, y: 0}, ...points, {x: lines.width, y: 0}, {x: lines.width, y: 1000}];
        points = points.map(({x, y}) => ({x: x - 10, y}));

        line.commands = mo.g.pathCommands.forCurveThrough({points, smoothing: 1});

        line.object = new mo.FabricCanvasObject(line);

        canvasView.add(line);
      });

      render();
    });
  });
};

export default {run};
