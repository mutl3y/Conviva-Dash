/**
 * Created by Mark on 29/12/2014.
 */
app.directive('d3Bar', function () {

    // constants
    var margin = 20,
        width = 600,
        height = 500 - .5 - margin,
        color = d3.scale.category20c(); // Provides easy colour scheme for charts

    return {
        restrict: 'E',
        scope: {
            val: '=',
            grouped: '=',
            lab: '='
        },
        link: function (scope, element, attrs) {


            // Tailored to suit collection naming scheme
            var decodeColDate = function (str1) {
                if (str1 === 'current') {
                    return 'current';
                } else {
                    var yr1 = parseInt(str1.substring(0, 4));
                    var mon1 = parseInt(str1.substring(5, 7));
                    var dt1 = parseInt(str1.substring(8, 10));
                    return new Date(yr1, mon1 - 1, dt1).toDateString();
                }
            };

            scope.$watch('val', function (newVal, oldVal) {
                var label = scope.lab || 'No Labels';

                // Based on: http://mbostock.github.com/d3/ex/stack.html
                var n = newVal.length + 1,  // number of layers
                    m = newVal[0].length,   // number of samples per layer
                    data = d3.layout.stack()(newVal),
                    chartKeyWidth = 155,
                    chartWidth = 4,// How many labels wide,  Max visable = 4
                    chartKeyDepth = Math.ceil(data[0].length / chartWidth);

                // set up initial svg object
                var vis = d3.select(element[0])
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height + margin + (chartKeyDepth * 32));

                // clear the elements inside of the directive
                vis.selectAll('*').remove();

                // if 'val' is undefined, exit
                if (!newVal) {
                    return;
                }

                // Sort data by label derived from data
                for (var i = 0; i <= data.length - 1; i++) {
                    data[i].sort(function (a, b) {
                        "use strict";
                        if (a[label] < b[label]) {
                            return -1;
                        }
                        if (a[label] > b[label]) {
                            return 1;
                        }
                        return 0;
                    });
                }

                var mx = m,
                    my = d3.max(data, function (d) {
                        return d3.max(d, function (d) {
                            return d.y0 + d.y;
                        });
                    }),
                    mz = d3.max(data, function (d) {
                        return d3.max(d, function (d) {
                            return d.y;
                        });
                    }),
                    x = function (d) {
                        return d.x * width / mx;
                    },
                    y0 = function (d) {
                        return height - d.y0 * height / my;
                    },
                    y1 = function (d) {
                        return height - (d.y + d.y0) * height / my;
                    },
                    y2 = function (d) {
                        return d.y * height / mz;
                    }; // or `my` not rescale

                // Layers for each color
                // =====================
                var layers = vis.selectAll("g.layer")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "layer");

                // Bars
                // ====
                var bars = layers.selectAll("g.bar")
                    .data(function (d) {
                        return d;
                    })
                    .enter().append("g")
                    .attr("class", "bar")
                    .style("fill", function (d, i) {
                        return color(i);
                    })
                    .attr("transform", function (d) {
                        return "translate(" + x(d) + ",0)";
                    });

                bars.append("rect")
                    .attr("width", x({x: .9}))
                    .attr("x", 0)
                    .attr("y", height)
                    .attr("height", 0)
                    .transition()
                    .delay(function (d, i) {
                        return i * 10;
                    })
                    .attr("y", y1)
                    .attr("height", function (d) {
                        return y0(d) - y1(d);
                    });

                // X-axis labels
                // =============
                var labels = vis.selectAll("text.label")
                    .data(data[0])
                    .enter().append("text")
                    .attr("class", "label")
                    .attr("x", x)
                    .attr("y", height + 6)
                    .attr("dx", x({x: .45}))
                    .attr("dy", ".71em")
                    .attr("text-anchor", "middle")
                    .text(function (d, i) {
                        return d.y
                    });

                // Chart Key
                // =========
                var keyText = vis.selectAll("text.key")
                    .data(data[0])
                    .enter().append("text")
                    .attr("class", "key")
                    .attr("y", function (d, i) {
                        return height + 42 + 30 * (i % chartKeyDepth);
                    })
                    .attr("x", function (d, i) {
                        return chartKeyWidth * Math.floor(i / chartKeyDepth) + 10;
                    })
                    .attr("dx", x({x: .5}))
                    .attr("dy", ".71em")
                    .attr("text-anchor", "center")
                    .text(function (d, i) {
                        return decodeColDate(d[label]);
                    });

                var keySwatches = vis.selectAll("rect.swatch")
                    .data(data[0])
                    .enter().append("rect")
                    .attr("class", "swatch")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("fill", function (d, i) {
                        return color(i / (n - 1));
                    })
                    .attr("y", function (d, i) {
                        return height + 36 + 30 * (i % chartKeyDepth);
                    })
                    .attr("x", function (d, i) {
                        return chartKeyWidth * Math.floor(i / chartKeyDepth);
                    });
            });
        }
    }
});