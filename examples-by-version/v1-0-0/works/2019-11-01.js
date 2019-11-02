var run = () => {

  mo.colors.fetch({samples: [[100, 100, 100]], count: 6}).then(colors => {

    //["rgb(101, 102, 100)","rgb(177, 200, 182)","rgb(245, 225, 185)","rgb(202, 162, 98)","rgb(104, 89, 65)"]
    //["rgb(49, 50, 48)","rgb(122, 163, 107)","rgb(204, 194, 143)","rgb(193, 173, 108)","rgb(172, 54, 43)"]
    var customColors = ["rgb(101, 101, 100)","rgb(160, 167, 141)","rgb(244, 221, 204)","rgb(206, 191, 89)","rgb(175, 122, 99)"];//.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
    var colors = customColors || colors;
    // var originalColors = _.clone(colors); //eslint-disable-line;

    console.log(JSON.stringify(colors)); //eslint-disable-line


    _.pullAt(colors, 0);

    var bgColor = colors[0];

    _.pullAt(colors, 0);

    //["rgb(237, 120, 122)","rgb(245, 213, 144)","rgb(214, 208, 140)","rgb(98, 162, 135)","rgb(75, 67, 91)"]

    mo.ui.init.basic({
      backgroundColor: bgColor,
      containerId: 'mo-container',
      size: {width: 500, height: 500}
    }).then(({sum, product, min, max, rand, randInt, randPoint, render, canvasView, size, images}) => { //eslint-disable-line
      render = _.throttle(render, 20);

      _.times(20, p => {
        var dots = [];

        _.times(10, (i) => {

          var dot = {
            shape: 'circle',
            fill: _.sample(colors),
            origin: {x: 'center', y: 'center'},
            position: {
              x: 0 + (p * 10 + 100)*Math.cos(Math.PI*2/10 * i),
              y: 0 + (p * 10 + 100)*Math.sin(Math.PI*2/10 * i)
            },
            radius: p*2,
            rotation: 0
          };

          dot.object = new mo.FabricCanvasObject({...dot});

          canvasView.add(dot);

          dots.push(dot);
        });


        // dot.object.set({});


        // _.times(16, row => {
        //   _.times(row + Math.floor(Math.random() * 35), col => {
        //     var dot = {
        //       shape: 'circle',
        //       fill: _.sample(colors),
        //       origin: {x: 'center', y: 'center'},
        //       position: {x: -250 + 15 + 10 * col, y: 10 * row},
        //       radius: 3
        //     };
        //
        //     dot.object = new mo.FabricCanvasObject({...dot});
        //
        //     canvasView.add(dot);
        //   });
        // });

        render();

        var n = 1;

        setInterval(() => {
          _.forEach(dots, (dot) => {
            dot.object.set({
              fill: _.sample(colors),
            });
          });

          render();
        }, 100);

        setInterval(() => {
          _.forEach(dots, (dot) => {
            dot.object.set({
              opacity: _.max([1 - n / 800, 0])
            });
          });

          render();
        }, 500);

        setInterval(() => {
          _.forEach(dots, (dot, i) => {
            dot.object.set({
              position: {
                x: 0 + (p * 10 + 100)*Math.cos((Math.PI*2 + n)/10 * i),
                y: 0 + (p * 10 + 100)*Math.sin((Math.PI*2 + n)/10 * i)
              }
            });
          });

          n += Math.PI / 100 + n/100;

          render();
        }, 20);
      });
    });
  });
};

export default {run};
