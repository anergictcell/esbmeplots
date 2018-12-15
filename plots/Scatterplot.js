/**
 * Scatterplot creates a new Scatterplot
 * @version 1.0
 * @author Jonas Marcello <rujmarcello@gmail.com>
 * @instance
 * @module EsbmePlots
 * @memberof module:EsbmePlots
 * @augments module:EsbmePlots
 * @constructor module:EsbmePlots.Scatterplot
 * @example
 * var x = Scatterplot()
 *  .parent(d3.selectAll(".container"))
 *  .seriesNames(["blue","pink"])
 *  .margin("auto")
 *  .data([
 *    [
 *      [30,26],
 *      [10,15],
 *      [12,0]
 *    ],
 *    [
 *      [3,2],
 *      [1,1],
 *      [1,0]
 *    ]
 *  ])
 *  .draw()
 */
function Scatterplot(){
  var highlights = [],
    radius = 1,
    highlightRadius = 0,
    highlightColor = "#000000",
    canvas = "auto",
    maxDots = 100,
    scaleX =  d3.scaleLinear()
      .range([0,0]),
    scaleY = d3.scaleLinear()
      .range([0,0]),
    colors = ["#D32F2F","#388e3c","#1976D2","#ffeb3b","#ff9800","#673ab7"]
    labelShiftX = d3.scaleLinear()
      .range([0.5,-9])
      .domain([0,-90]),
    labelShiftY = d3.scaleLinear()
      .range([9,-0.5])
      .domain([0,-90]),
    labelShiftDY = d3.scaleLinear()
      .range([0.71,0.29])
      .domain([0,-90])


  // creates a new EsbmePlot instance to use as Scatterplot
  var plot = new EsbmePlot()

  // updates the default classname to still include the id, but
  // also contain "piechart"
  var id = plot.className()
  plot.className("scatterplot "+id)

  /**
   * <p>Defines data points to be highlighted</p>
   * Data needs to be passed an Array of highlight<br>
   * Each highlight is [x-Value, y-Value, Text, labelPosition]
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @param {Array} [highlights]
   * @method highlights
   */
  plot.highlights = function(_){
    if (arguments.length){
      highlights = _
      return plot
    } else {
      return highlights
    }
  }

  /**
   * <p>Defines radius of highlighted points</p>
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @param {Int} radius
   * @method highlightRadius
   */
  plot.highlightRadius = function(_){
    if (arguments.length){
      highlightRadius = +_
      return plot
    } else {
      return highlightRadius || (radius * 2)
    }
  }

  /**
   * <p>Defines color of highlighted points</p>
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @param {String} RGB_Color
   * @method highlightColor
   */
  plot.highlightColor = function(_){
    if (arguments.length){
      highlightColor = _
      return plot
    } else {
      return highlightColor
    }
  }

  /**
   * <p>Defines the radius of the dots</p>
   * If value is specified, sets the value.<br>
   * If value is not specified, returns the current value
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @param {Integer} [value=0]
   * @method radius
   */
  plot.radius = function(_){
    if (arguments.length){
      radius = +_
      return plot
    } else {
      return radius
    }
  }

  /**
   * <p>Defines whether to draw on a canvas or SVG</p>
   * If value is specified, sets the value.<br>
   * If value is not specified, returns the current value
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @param {String} [value="auto"] Allowed values: auto|svg|canvas
   * @method radius
   */
  plot.canvas = function(_){
    if (arguments.length){
      canvas = _
      return plot
    } else {
      return canvas
    }
  }

  /**
   * <p>If `canvas` is set to `auto` sets the limit of data points to draw on an SVG</p>
   * If more data points than `maxDots` are present, plot is drawn as canvas.<br>
   * This might not work well with adding more data etc. In this case use canvas as default
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @param {Integer} [value=100]
   * @method radius
   */
  plot.maxDots = function(_){
    if (arguments.length){
      maxDots = _
      return plot
    } else {
      return maxDots
    }
  }

  /**
   * <p>Defines the custom Scatterplot specifc scale for the x-axis</p>
   * If value is specified, sets the x-axis scale.<br>
   * If value is not specified, return the current scale
   * Should not be used as setter in most cases
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @param {Function} [value]
   * @method scaleX
   */
  plot.scaleX = function(_){
    if (arguments.length){
      scaleX = _
      return plot
    } else {
      return scaleX
    }
  }

  /**
   * <p>Defines the custom Scatterplot specifc scale for the y-axis</p>
   * If value is specified, sets the y-axis scale.<br>
   * If value is not specified, return the current scale
   * Should not be used as setter in most cases
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @param {Function} [value]
   * @method scaleY
   */
  plot.scaleY = function(_){
    if (arguments.length){
      scaleY = _
      return plot
    } else {
      return scaleY
    }
  }

  /**
   * <p>Defines the custom colors for dots on the canvas</p>
   * If value is specified, sets the color groups.<br>
   * If value is not specified, return the current color groups
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @param {Function} [value]
   * @method colors
   */
  plot.colors = function(_){
    if (arguments.length){
      colors = _
      return plot
    } else {
      return colors
    }
  }


  /**
   * <p>Sets the domain for the x- and y-axis scales</p>
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @private
   * @param {Function} [value]
   * @method setScaleDomains
   */
  plot.setScaleDomains = function(){
    scaleX.domain(plot.xDomain())
    scaleY.domain(plot.yDomain())
  }

  /**
   * <p>Sets the range for the x- and y-axis scales</p>
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @private
   * @method setScaleRanges
   */
  plot.setScaleRanges = function(dimensions){
    scaleX.range([0,dimensions.plotWidth])
    scaleY.range([dimensions.plotHeight,0])
  }

  /**
   * <p>Adds the X- and Y-axes to the plot</p>
   * Both axes will get automated tickValues
   * @memberof module:EsbmePlots.Scatterplot
   * @instance
   * @private
   * @method addAxes
   */
  plot.addAxes = function(){
    plot.addXAxis()
    plot.addYAxis()
  }

  plot.checkData = checkData

  plot.drawData = drawData

  return plot

  function drawData(canvas, dimensions){

    // Always remove previous 2D <canvas>
    plot.parent().selectAll("canvas").remove()

    var dataSize = calculateTotalDataSize()

    if (plotOnCanvas(dataSize)) {
      canvas.selectAll("*").remove()
      // If plot should be plotted on a 2D <canvas>
      // the `canvas` object is changed to be virtual and not added to the DOM
      var virtualCanvas = d3.select(document.createElement("customContainer"))
      virtualCanvas.attr("transform", canvas.attr("transform"))
      canvas = virtualCanvas
    }

    var className = plot.className()

    plot.seriesNames().forEach(function(singleSeries,i){
      var seriesData = (plot.data()[i] || []).map(function(datum,j){
          return {
            x:          datum[0],
            y:          datum[1],
            seriesName: singleSeries
          }
        })
      var dots = canvas.selectAll("circle."+singleSeries)
        .data(seriesData)
      dots.exit().remove()
      dots = dots.enter()
        .append("circle")
        .merge(dots)
        .attr("class",function(d){
          return "esbmeplot series "+className +" " +d.seriesName
        })
        .attr("cx",function(d){
          return scaleX(d.x)
        })
        .attr("cy",function(d){
          return scaleY(d.y)
        })
        .attr("r",radius)
        .attr("filLStyle",colors[i] || "#000000")
    })

    if (highlights.length){
      plotHighlights(canvas)
    }

    if (plotOnCanvas(dataSize)) {
      // draw the 2D <canvas> using the virtual DOM <svg> canvas
      // as blueprint
      drawCanvas(canvas)
    }
  }

  function plotHighlights(canvas){
    var highlightData = highlights.map(function(highlight){
      return {
        x:          highlight[0],
        y:          highlight[1],
        seriesname: "highlight",
        label:      highlight[2],
        labelpos:   highlight[3]
      }
    })
    var dots = canvas.selectAll("circle.highlights")
      .data(highlightData)
    dots.exit().remove()
    dots = dots.enter()
      .append("circle")
      .merge(dots)
      .attr("class",function(d){
        return "esbmeplot series "+plot.className() +" " +d.seriesName
      })
      .attr("cx",function(d){
        return scaleX(d.x)
      })
      .attr("cy",function(d){
        return scaleY(d.y)
      })
      .attr("r",highlightRadius || radius * 2)
      .attr("filLStyle",highlightColor || "#FF0000")

    // Add the labels as well
    var labels = canvas.selectAll("text.highlight")
      .data(highlightData)
    labels.exit().remove()
    labels = labels.enter()
      .append("text")
      .merge(labels)
      .attr("class",function(d){
        return "esbmeplot label highlight "+ plot.className()
      })
      .attr("transform",function(d){
        return "translate("+ scaleX(d.x)+","+scaleY(d.y)+")"
      })
      .attr("dy","0.355em")
      .attr("dx", (highlightRadius || radius * 2) + 3 + "px" )
      .attr("text-anchor",function(d){
        return d.labelpos === "left" ? "end" : "start"
      })
      .text(function(d){return d.label})

  }

  function drawCanvas(virtualCanvas){

    // The 2d <canvas> should be placed directly over the SVG
    var margin = plot.margin()
    var leftMargin = + virtualCanvas.attr("transform").slice(10).split(",")[0]
    var topMargin = + virtualCanvas.attr("transform").slice(10).split(",")[1].slice(0,-1)

    var chart = plot.parent().append("canvas")
      .attr("width",plot.width()+"px")
      .attr("height",plot.height()+"px")

    var context = chart.node().getContext("2d");
    var dots = virtualCanvas.selectAll("circle")
    dots.each(function(dot){
      var node = d3.select(this)
      var x = +node.attr("cx") + leftMargin
      var y = +node.attr("cy") + topMargin
      var radius = +node.attr("r")

      context.beginPath()
      context.fillStyle = node.attr("fillStyle")
      context.arc(x, y, radius, 0, 2 * Math.PI)
      context.fill()
      context.closePath()
    })

    virtualCanvas.selectAll("text").each(function(label){
      context.beginPath()
      context.font = (highlightRadius || radius * 2 ) + 10 +"px Helvetica sans-serif";
      context.textBaseline = "middle";
      context.textAlign = label.labelpos === "left" ? "right" : "left"
      context.fillStyle = "#000000"
      context.fillText(
        label.label,
        scaleX(label.x) + leftMargin + 3 + (highlightRadius || radius * 2),
        scaleY(label.y) + topMargin)
      context.closePath()
    })

  }

  function checkData(){
    if (!(plot.data() instanceof Array)){
      throw new TypeError("Data has to be an Array")
    }

    // ensures that we have a nested Array with one or multiple series
    plot.data(plot.data().map(function(datum){
      return datum instanceof Array ?
        datum :
        [datum]
    }))

    if (plot.yDomain() === "auto"){
      plot.yDomain([0,getMaxY()])
    }

    if (plot.xDomain() === "auto"){
      plot.xDomain([0,getMaxX()])
    }
  }

  function calculateTotalDataSize(){
    return plot.data().reduce(function(total, series){
      return total + series.length
    },0)
  }

  function plotOnCanvas(dataSize){
    if (canvas === "canvas") return true
    if (canvas === "auto" && dataSize > maxDots) return true
    return false
  }

  function getMaxX(){
    return getMax(0)
  }
  function getMaxY(){
    return getMax(1)
  }

  function getMax(idx){
    return plot.data().reduce(function(max,series){
      var seriesMax = series.reduce(function(localMax, datum){
        return datum[idx] > localMax ? datum[idx] : localMax
      },0)
      return seriesMax > max ? seriesMax : max
    },0)
  }

}


