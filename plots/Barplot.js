
/**
 * Barplot creates a new Barplot
 * @version 1.0
 * @author Jonas Marcello <rujmarcello@gmail.com>
 * @instance
 * @module EsbmePlots
 * @memberof module:EsbmePlots
 * @augments module:EsbmePlots
 * @constructor module:EsbmePlots.Barplot
 * @example
 * var x = Barplot()
 *  .parent(d3.selectAll(".container"))
 *  .categories(["Monday","Tuesday","Wednesday"])
 *  .margin("auto")
 *  .xLabelRotation(-45)
 *  .data([[3,1],[4,5],[6,7]])
 *  .yLabel("# of commits")
 *  .xLabel("Weekday")
 *  .draw()
 */
function Barplot(){
  var stacked = true,
    categories = [],
    xLabelRotation = 0,
    paddingInner = 0.1,
    paddingOuter = 0.1,
    scaleX = d3.scaleBand()
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
      .rangeRound([0, 0]),
    scaleY = d3.scaleLinear()
      .range([0,0]),
    labelShiftX = d3.scaleLinear()
      .range([0.5,-9])
      .domain([0,-90]),
    labelShiftY = d3.scaleLinear()
      .range([9,-0.5])
      .domain([0,-90]),
    labelShiftDY = d3.scaleLinear()
      .range([0.71,0.29])
      .domain([0,-90])

  // creates a new EsbmePlot instance to use as Barplot
  var plot = new EsbmePlot()

  // updates the default classname to still include the id, but
  // also contain "barplot"
  var id = plot.className()
  plot.className("barplot "+id)

  /**
   * <p>Defines whether series will be drawn `stacked` (on top of each other) or next to each other</p>
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @param {Boolean} [stacked=true] - Should the series be plotted on top of each other
   * @method stacked
   */
  plot.stacked = function(_){
    if (arguments.length){
      stacked = _
      return plot
    } else {
      return stacked
    }
  }

  /**
   * <p>Defines the category names to be printed on the x-axis</p>
   * If value is specified, sets the categories.<br>
   * If value is not specified, return the current categories
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @param {String[]} [value]
   * @method categories
   */
  plot.categories = function(_){
    if (arguments.length){
      categories = _
      return plot
    } else {
      return categories
    }
  }

  /**
   * <p>Defines if the category names of the X-axis should be rotated</p>
   * If value is specified, sets the degree of rotation.<br>
   * If value is not specified, return the current degree of roation
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @param {Int} [value]
   * @method xLabelRotation
   */
  plot.xLabelRotation = function(_){
    if (arguments.length){
      xLabelRotation = _
      return plot
    } else {
      return xLabelRotation
    }
  }

  /**
   * <p>Defines if the inner padding of the bars</p>
   * If value is specified, sets the padding between bars.<br>
   * If value is not specified, return the current inner padding
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @param {Number} [value=0.1] - between 0 - 1
   * @method paddingInner
   */
  plot.paddingInner = function(_){
    if (arguments.length){
      paddingInner = _
      scaleX.paddingInner(paddingInner)
      return plot
    } else {
      return paddingInner
    }
  }

  /**
   * <p>Defines if the outer padding of the bars</p>
   * If value is specified, sets the padding between bars.<br>
   * If value is not specified, return the current outer padding
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @param {Number} [value=0.1] - between 0 - 1
   * @method paddingOuter
   */
  plot.paddingOuter = function(_){
    if (arguments.length){
      paddingOuter = _
      scaleX.paddingOuter(paddingOuter)
      return plot
    } else {
      return paddingOuter
    }
  }

  /**
   * <p>Defines the custom Barplot specifc scale for the x-axis</p>
   * If value is specified, sets the x-axis scale.<br>
   * If value is not specified, return the current scale
   * Should not be used as setter in most cases
   * @memberof module:EsbmePlots.Barplot
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
   * <p>Defines the custom Barplot specifc scale for the y-axis</p>
   * If value is specified, sets the y-axis scale.<br>
   * If value is not specified, return the current scale
   * Should not be used as setter in most cases
   * @memberof module:EsbmePlots.Barplot
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
   * <p>Sets the domain for the x- and y-axis scales</p>
   * X-axis scale is defined via `categories`
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @private
   * @param {Function} [value]
   * @method setScaleDomains
   */
  plot.setScaleDomains = function(){
    scaleX.domain(categories)
    scaleY.domain(plot.yDomain())
  }

  /**
   * <p>Sets the range for the x- and y-axis scales</p>
   * X-axis gets range-round <br>
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @private
   * @method setScaleRanges
   */
  plot.setScaleRanges = function(dimensions){
    scaleX.rangeRound([0,dimensions.plotWidth])
    scaleY.range([dimensions.plotHeight,0])
  }

  /**
   * <p>Adds the X- and Y-axes to the plot</p>
   * X-axis receives custom tickValues<br>
   * Y-axis will get automated tickValues
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @private
   * @method addAxes
   */
  plot.addAxes = function(){
    plot.addXAxis(categories)
    plot.addYAxis()
    applyXLabelRotation()
  }

  plot.checkData = checkData
  plot.drawData = drawData


  return plot


  /**
   * <p>Barplot specific function to draw the actual plot</p>
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @private
   * @method drawData
   */
  function drawData(canvas, dimensions){

    // Have to call this again to override values set by axisGenerator
    applyXLabelRotation()

    var className = this.className()
    var categoryGroups = canvas.selectAll("g.category")
      .data(this.data().map(function(datum,i){
        return {
          x: categories[i],
          data: datum,
          total: datum.reduce(function(tot,x){
            return tot+x
          }),
          nSeries: datum.length,
          info : plot.info()[i] || []
        }
      }))

    categoryGroups.exit().remove()

    categoryGroups = categoryGroups.enter()
      .append("g")
      .merge(categoryGroups)
      .attr("class","esbmeplot category "+className)
      .attr("transform",function(d){
        return "translate("+
        scaleX(d.x)+
        ",0)"
      })

    var seriesNames = plot.seriesNames()
    var series = categoryGroups.selectAll("g.series").data(function(d){
      return d.data.map(function(datum,i){
        return {
          category: d.x,
          value: datum,
          seriesName: seriesNames[i],
          total: d.total,
          nSeries: d.nSeries,
          previous: d.data.slice(0,i).reduce(function(tot,x){
            return tot+x
          },0),
          info: d.info[i]
        }
      })
    })

    series.exit().remove()

    series = series.enter()
      .append("g")
      .attr("transform",function(d,i){
        var zero = {
          previous: 0,
          value: 0,
          nSeries: d.nSeries
        }
        return stackBars(zero,i,dimensions)
      })
      .merge(series)

    series
      .attr("class","esbmeplot series "+className)
      .transition().duration(plot.duration())
      .attr("transform",function(d,i){
        return stackBars(d, i, dimensions)
      })

    var bars = series.selectAll("rect.bar")
      .data(function(d){return [d]})

    bars.exit().remove()

    bars = bars.enter()
      .append("rect")
      .attr("height",0)
      .attr("width",function(d){
        if (stacked){
          return scaleX.bandwidth()
        } else {
          return scaleX.bandwidth()/d.nSeries
        }
      })
      .merge(bars)
      .attr("class",function(d){
        return "esbmeplot bar " + className + " " + d.seriesName
      })

    bars.transition().duration(plot.duration())
      .attr("height",function(d){
        return dimensions.plotHeight - scaleY(d.value)
      })
      .attr("width",function(d){
        if (stacked){
          return scaleX.bandwidth()
        } else {
          return scaleX.bandwidth()/d.nSeries
        }
      })

    plot.addEvents(bars)

    return plot
  }


  /**
   * <p>Shifts rects based on their stack status</p>
   * If `stacked` = `true`, bars will be placed on top of each other.<br>
   * Otherwise, bars will be places next to each other
   * Calculates width of bars as well.
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @private
   * @method stackBars
   */
  function stackBars(d, i, dimensions){
    var transform = "translate(",
      x = 0,
      y = 0

    if (stacked){
      y = scaleY(d.previous) - (dimensions.plotHeight - scaleY(d.value))
    } else {
      y = scaleY(d.value)
      x = scaleX.bandwidth()/d.nSeries*i
    }
    return transform + x + "," + y + ")"
  }

  /**
   * <p>Ensures the data is in the right format</p>
   * Corrects small data errors, such as not nested Array
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @private
   * @method checkData
   */
  function checkData(){
    if (!(plot.data() instanceof Array)){
      throw new TypeError("Data has to be an Array")
    }
    if (stacked){
      plot.data().forEach(function(datum){
        if (!(datum instanceof Array)){
          throw new Error("For a stacked Bar plot, the data needs to be a nested Array")
        }
      })
    }
    plot.data(plot.data().map(function(datum){
      return datum instanceof Array ?
        datum :
        [datum]
    }))

    plot.info(plot.info().map(function(info){
      return info instanceof Array ?
        info :
        [info]
    }))

    if (plot.yDomain() === "auto"){
      plot.yDomain([0,getMax()])
    }
  }

  /**
   * <p>Returns the maximum value of the dataset</p>
   * Takes into account whether bars will be stacked or not
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @private
   * @method getMax
   */
  function getMax(){
    return plot.data().reduce(function(max,cur){
      var value = stacked ?
        cur.reduce(function(insideTot,insideCur){
          return insideTot + insideCur
        }) :
        cur.reduce(function(insideMax,insideCur){
          return insideMax > insideCur ? insideMax : insideCur
        })
      return max > value ? max : value
    },0)
  }

  /**
   * <p>Rotates the x-axis category labels</p>
   * Rotates the labels if required and realigns them
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @private
   * @method applyXLabelRotation
   */
  function applyXLabelRotation(){
    var label = plot.svg().selectAll("g.x-axis g.tick text")
      .attr("transform","rotate("+xLabelRotation+")")
      .attr("text-anchor","end")
      .attr("x",labelShiftX(xLabelRotation)+"px")
      .attr("y",labelShiftY(xLabelRotation)+"px")
      .attr("dy",labelShiftDY(xLabelRotation)+"em")
    if (xLabelRotation){
      label.attr("text-anchor","end")
    } else {
      label.attr("text-anchor","middle")
    }
  }

}
