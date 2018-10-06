var run = () => {
  mo.colors.fetch({samples: [[232, 197, 71], [92, 128, 188]], count: 10}).then(colors => {
    var customColors = ["rgb(234, 195, 71)","rgb(92, 129, 190)","rgb(52, 96, 164)","rgb(114, 156, 144)","rgb(188, 172, 119)"];

    //["rgb(234, 195, 71)","rgb(92, 129, 190)","rgb(52, 96, 164)","rgb(114, 156, 144)","rgb(188, 172, 119)"]

    colors = customColors || colors;

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    //_.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500},
      images: {
        rock: '../../assets/images/circle-1.png'
      }
    }).then(({sum, min, max, rand, randInt, render, canvasView, size, images}) => { //eslint-disable-line


      var offset = {x: -size.width * 1/3, y: -size.height / 2};
      var waves = {count: 30};
      var points = {count: 7};

      waves.spacing = size.width * 0.5 / (waves.count - 1);
      points.spacing = size.height * 1.2 / (points.count - 1);

      points.positions = [{x: 0, y: size.width / 2}, {x: -10, y: 0}];

      _.times(points.count, p => points.positions.push({
        x: points.spacing * p + rand(points.spacing * 0.3, -0.5),
        y: (-(p % 2) * waves.spacing) - rand(waves.spacing * 0.3)
      }));

      points.positions.push({x: size.height + 10, y: 0}, {x: size.height + 10, y: size.width / 2});

      var yTransforms = _.times(points.count + 4, rand(waves.spacing * 2));

      _.times(waves.count, s => {
        var wave = {
          type: 'shape',
          shape: 'path',
          stroke: '#ffffff',
          fill: _.sample(colors),
          zIndex: -s,
          position: sum(offset, {x: 0, y: 0}),
          strokeWidth: 1,
          rotation: 90,
          strokeWidth: 0.5
        };

        wave.commands = mo.g.pathCommands.forCurveThrough({points: points.positions, smoothing: 2});
        //wave.commands = points.positions.map(point => ({point}));
        wave.object = new mo.FabricCanvasObject(wave);

        canvasView.add(wave);

        yTransforms = yTransforms.map(t => _.max([0, t + rand(waves.spacing * 0.2, -0.5)]));

        points.positions = points.positions.map(({x, y}, p) => ({
          x,
          y: y - waves.spacing * 0.7 - yTransforms[p] * 2
        }));
      });

      render();
    });
  });
};

export default {run};
