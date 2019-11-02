var run = () => {

  mo.colors.fetch({samples: [[40, 40, 40]], count: 5}).then(colors => {

    //["rgb(50, 50, 48)","rgb(120, 154, 97)","rgb(203, 199, 150)","rgb(191, 173, 110)","rgb(176, 56, 42)"]
    var customColors// = ["rgb(40, 41, 39)","rgb(92, 101, 90)","rgb(211, 190, 124)","rgb(213, 175, 112)","rgb(87, 86, 69)"];//[[220, 84, 78], [102, 172, 91]].map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
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
      _.times(16, row => {
        _.times(row + Math.floor(Math.random() * 35), col => {
          var dot = {
            shape: 'circle',
            fill: _.sample(colors),
            origin: {x: 'center', y: 'center'},
            position: {x: -250 + 15 + 10 * col, y: 10 * row},
            radius: 3
          };

          dot.object = new mo.FabricCanvasObject({...dot});

          canvasView.add(dot);
        });
      });

      render();
    });
  });
};

export default {run};
