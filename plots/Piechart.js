/**
 * Piechart creates a new Piechart
 * @version 1.0
 * @author Jonas Marcello <rujmarcello@gmail.com>
 * @instance
 * @module EsbmePlots
 * @memberof module:EsbmePlots
 * @augments module:EsbmePlots
 * @constructor module:EsbmePlots.Piechart
 * @example
 * var x = Piechart()
 *  .parent(d3.selectAll(".container"))
 *  .categories(["Boys","Girls"])
 *  .seriesNames(["blue","pink"])
 *  .margin("auto")
 *  .data([[30,26])
 *  .draw()
 */
function Piechart() {
  var categories = [],
    showValues  = "number",
    showCategories = true,
    innerRadius = 0,
    cornerRadius = 0,
    total = 0


  // creates a new EsbmePlot instance to use as Piechart
  var plot = new EsbmePlot()

  // updates the default classname to still include the id, but
  // also contain "piechart"
  var id = plot.className()
  plot.className("piechart "+id)

  /**
   * <p>Defines the category names to be printed on the x-axis</p>
   * If value is specified, sets the categories.<br>
   * If value is not specified, return the current categories
   * @memberof module:EsbmePlots.Piechart
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
   * <p>Defines if percentage, numbers or nothing should be written on each pie</p>
   * If value is specified, sets showValues.<br>
   * If value is not specified, return the current value
   * @memberof module:EsbmePlots.Piechart
   * @instance
   * @param {String} [value="number"] - Can be either "number", "percent" or null
   * @method showValues
   */
  plot.showValues = function(_){
    if (arguments.length){
      showValues = _
      return plot
    } else {
      return showValues
    }
  }

  /**
   * <p>Defines whether the names of the category should be written on each pie</p>
   * If value is specified, sets the value.<br>
   * If value is not specified, returns the current value
   * @memberof module:EsbmePlots.Piechart
   * @instance
   * @param {String[]} [value]
   * @method showCategories
   */
  plot.showCategories = function(_){
    if (arguments.length){
      showCategories = _
      return plot
    } else {
      return showCategories
    }
  }

  /**
   * <p>Defines the inner radius of the arcs to create a donut-chart</p>
   * If value is specified, sets the value.<br>
   * If value is not specified, returns the current value
   * @memberof module:EsbmePlots.Piechart
   * @instance
   * @param {Integer} [value=0]
   * @method innerRadius
   */
  plot.innerRadius = function(_){
    if (arguments.length){
      innerRadius = _
      return plot
    } else {
      return innerRadius
    }
  }
  /**
   * <p>Defines the corner radius of each pie</p>
   * If value is specified, sets the value.<br>
   * If value is not specified, returns the current value
   * @memberof module:EsbmePlots.Piechart
   * @instance
   * @param {Integer} [value]
   * @method cornerRadius
   */
  plot.cornerRadius = function(_){
    if (arguments.length){
      cornerRadius = _
      return plot
    } else {
      return cornerRadius
    }
  }

  plot.checkData = checkData

  plot.drawData = drawData

  return plot

  /**
   * <p>Draws the piechart</p>
   * @memberof module:EsbmePlots.Piechart
   * @instance
   * @param  {D3Selection} canvas
   * @param  {Object} dimensions  - Dimensions of the plot (margins etc)
   */
  function drawData(canvas,dimensions){
    var radius = Math.floor(
      Math.min(dimensions.plotWidth,dimensions.plotHeight)/2
    )
    if (innerRadius >= radius){
      throw new TypeError("Inner radius must be smaller than the outer radius")
    }
    var className = plot.className()
    var seriesNames = plot.seriesNames()
    var infos = plot.info()

    var pieData = d3.pie()
      .sortValues(null)(plot.data())

    // Add normalized properties to each piece
    // for mousever events etc
    pieData.forEach(function(pieceData,i){
      pieceData.category = categories[i]
      pieceData.seriesName = seriesNames[i]
      pieceData.total = total,
      pieceData.info = infos[i]
    })
    var arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(innerRadius)
      .cornerRadius(cornerRadius)

    var center = canvas.selectAll("g.center").data([pieData])
    center.exit().remove()
    center = center.enter()
      .append("g")
      .merge(center)
      .attr("class","esbmeplot center "+className)
      .attr("transform","translate("+dimensions.plotWidth/2+","+radius+")")

    // Creates an array with data from the last draw() event
    // Those ones are used as starting point for transitions
    var oldAngles = center.selectAll("path.piece").data()
      .map(function(item){
        return {
          startAngle: item.startAngle,
          endAngle: item.endAngle
        }
      })
    // In case there is more data than previous pieces
    // this add fake previous 360° angles to all new elements
    pieData.slice(oldAngles.length).forEach(function(){
      oldAngles.push({
        startAngle: 2*Math.PI,
        endAngle: 2*Math.PI
      })
    })

    var pieces = center.selectAll("path.piece").data(pieData)

    pieces.exit().remove()
    pieces = pieces.enter()
      .append("path")
      // new pieces get 360° angles as starting point
      .attr("d",function(){
        return arc({startAngle:2*Math.PI,endAngle:2*Math.PI})
      })
      .merge(pieces)
      .attr("class",function(d){
        return "esbmeplot piece "+d.seriesName + " "+ className
      })

    pieces.transition().duration(plot.duration())
      .attrTween("d", function(d,i){
        return arcTween(d,i)
      })

    var categoryLabels = center.selectAll("text.category-label")
      .data(pieData)
    categoryLabels.exit().remove()
    if (showCategories) {
      categoryLabels = categoryLabels.enter()
        .append("text")
        .merge(categoryLabels)
        .attr("class","esbmeplot category-label "+className)
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")" })
        .attr("dy", "-0.5em")
        .attr("text-anchor", "middle")
        .style("cursor","default")
        .text(function(d){return d.category})
    } else {
      categoryLabels.remove()
    }

    var valueLabels = center.selectAll("text.value-label")
      .data(pieData)
    valueLabels.exit().remove()
    if (showValues) {
      valueLabels = valueLabels.enter()
        .append("text")
        .merge(valueLabels)
        .attr("class","esbmeplot value-label "+className)
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")" })
        .attr("dy", "0.5em")
        .attr("text-anchor", "middle")
        .style("cursor","default")
        .text(function(d){
          return showValues === "percent" ?
            Math.floor( d.value/d.total*100 ) + "%" :
            d.value
        })
    } else {
      valueLabels.remove()
    }

    plot.addEvents(pieces)
    plot.addEvents(categoryLabels)
    plot.addEvents(valueLabels)

    // Interpolation function for starting and end angles
    // of each piece
    function arcTween(d,i){
      var oldStart = oldAngles[i].startAngle
      var oldEnd = oldAngles[i].endAngle
      var intStart = d3.interpolate(oldStart, d.startAngle)
      var intEnd = d3.interpolate(oldEnd, d.endAngle)
      return function(t){
        return arc({
          startAngle: intStart(t),
          endAngle: intEnd(t)
        })
      }
    }

    return plot
  }

  function checkData(){
    if (!(plot.data() instanceof Array)){
      throw new TypeError("Piechart expects an Array as data")
    }
    total = plot.data().reduce(function(total,datum){
      if (typeof datum !== "number"){
        throw new TypeError("Values given to Piechart must be numberic")
      }
      return total+datum
    })
    if (total === 0) {
      plot.data([1])
      categories = ["No data available"]
      plot.seriesNames(["invalid"])
      plot.events({})
      showValues = false
      showCategories = true
    }
  }
}
