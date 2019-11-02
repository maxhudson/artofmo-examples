var run = () => {
  mo.colors.fetch({samples: [[144, 45, 29], [31, 27, 31]], count: 5}).then(colors => {
    var customColors = ["rgb(149, 51, 34)","rgb(40, 35, 39)","rgb(113, 139, 100)","rgb(211, 191, 49)"];
    var colors = customColors || colors;

    //["rgb(149, 51, 34)","rgb(40, 35, 39)","rgb(113, 139, 100)","rgb(147, 170, 123)","rgb(211, 191, 49)"]
    //["rgb(143, 45, 27)","rgb(33, 29, 34)","rgb(92, 102, 84)","rgb(223, 215, 179)","rgb(197, 174, 110)"]
    //["rgb(49, 54, 57)","rgb(127, 115, 112)","rgb(186, 165, 147)","rgb(244, 232, 185)","rgb(225, 94, 66)"]
    //["rgb(49, 55, 56)","rgb(121, 150, 134)","rgb(224, 204, 146)","rgb(217, 177, 118)","rgb(107, 91, 66)"]
    //["rgb(49, 55, 60)","rgb(105, 124, 115)","rgb(187, 183, 158)","rgb(191, 182, 148)","rgb(183, 143, 102)"]
    //["rgb(53, 57, 57)","rgb(156, 118, 90)","rgb(190, 147, 101)","rgb(195, 155, 103)","rgb(208, 180, 121)"]
    //["rgb(145, 46, 28)","rgb(181, 100, 44)","rgb(237, 187, 90)","rgb(165, 178, 85)","rgb(56, 57, 63)"]

    console.log(JSON.stringify(colors)); //eslint-disable-line

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      var offset = {x: size.width * -1/6, y: -size.height / 2};
      var circles = {spacing: 50};

      _.times(11, y => {
        var drawCircle = rand() < 0.4;
        _.times(10, x => {
          var drawCircle2 = drawCircle || rand() < 0.2;

          if (drawCircle2) {
            var color = _.sample(colors);

            var circle = {
              type: 'shape',
              shape: 'circle',
              position: sum({x: x * circles.spacing + rand(circles.spacing * 0.5), y: y * circles.spacing}, offset),
              fill: color,
              radius: 30,
              opacity: 0.4,
              shadow: {
                color: color,
                blur: 20,
                offsetX: 0,
                offsetY: 0
              }
            };

            circle.object = new mo.FabricCanvasObject({...circle});

            canvasView.add(circle);
          }
        });
      });

      render();
    });
  });
};

export default {run};
