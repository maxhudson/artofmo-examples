var run = () => {

  mo.colors.fetch({samples: [[40, 40, 40]], count: 5}).then(colors => {

    //["rgb(50, 50, 48)","rgb(120, 154, 97)","rgb(203, 199, 150)","rgb(191, 173, 110)","rgb(176, 56, 42)"]
    var customColors = ["rgb(40, 41, 39)","rgb(92, 101, 90)","rgb(211, 190, 124)","rgb(213, 175, 112)","rgb(87, 86, 69)"];//[[220, 84, 78], [102, 172, 91]].map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
    var colors = customColors || colors;
    // var originalColors = _.clone(colors); //eslint-disable-line;

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    //["rgb(237, 120, 122)","rgb(245, 213, 144)","rgb(214, 208, 140)","rgb(98, 162, 135)","rgb(75, 67, 91)"]

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      // var cells = {count: 4};
      var margin = 0;
      var offset = {x: (size.width - margin) * -0.1, y: (size.height - margin) * -1};

        var intervals = [
          {
            fps: 30,
            frame: ({tick}) => {
              var diameter = 300;

              var yOffset = tick % 5 * -20 + tick * rand(5);
              var xOffset = tick % 5 * 20;
              var bigT = tick;
              // var x = diameter / 2;
              // var y = 0;

              // if (tick > 10) {
              //   y = tick;
              // }

              var dot = {
                shape: 'circle',
                fill: _.sample(colors),
                origin: {x: 'center', y: 'center'},
                position: {x: -1000, y: -1000},
                radius: (4 + rand(10)) * Math.min(10, tick + 2) / 10 / 2 + Math.min(10, bigT / 80)// + ((tick * 5) % 8 - 4) * 2
                // radius: 2 - rand(1),
                // opacity: 0.6 - rand(0.4)
              };

              dot.object = new mo.FabricCanvasObject({...dot});

              canvasView.add(dot);

              runInterval({
                fps: 60,
                frame: ({tick}) => {
                  var x = diameter / 2 * Math.cos(tick * Math.PI / 100) + xOffset;

                  dot.object.set({position: sum({
                    x, y: tick + yOffset}, offset)});
                }
              });
            }
          }
        ];

        var runInterval = ({fps, frame}) => {
          var freq = 1/fps;
          var tick = 1;

          setInterval(() => {
            frame({tick});

            tick += 1;
          }, freq * 1000);
        };

        _.forEach(intervals, runInterval);

        setInterval(() => {
          render();
        }, 1000/60);
      });
    });
};

export default {run};
