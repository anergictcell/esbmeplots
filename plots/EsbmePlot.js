/**
 * EsbmePlot is a Constructor for Plots
 * @version 1.0
 * @author Jonas Marcello <rujmarcello@gmail.com>
 * @instance
 * @module EsbmePlots
 * @constructor module:EsbmePlots
 */
function EsbmePlot(){
  var parent  = d3.select("body"),
    data      = [],
    width     = 400,
    height    = 250,
    seriesNames = ["Series1","Series2","Series3","Series4","Series5","Series6","Series7","Series8","Series9","Series10"],
    header    = "ESBME Plot",
    xLabel    = undefined,
    yLabel    = undefined,
    yDomain   = "auto",
    xDomain   = "auto",
    info      = [],
    margin    = {},
    manualMargin = {top: "auto", right: "auto", bottom: "auto", left: "auto"},
    svg       = undefined,
    xAxis, yAxis, // will be d3.selections
    xAxisGenerator, yAxisGenerator,
    events    = {},
    className = "id-"+Math.floor(Math.random()*10000000),
    duration  = 300,
    finished  = function(){},
    xLabelRotation = 0,
    labelShiftX = d3.scaleLinear()
      .range([0.5,-9])
      .domain([0,-90]),
    labelShiftY = d3.scaleLinear()
      .range([9,-0.5])
      .domain([0,-90]),
    labelShiftDY = d3.scaleLinear()
      .range([0.71,0.29])
      .domain([0,-90])

  /**
   * <p>Defines or returns the parent DOM element onto which the svg will be appended</p>
   * If value is specified, sets the parent.<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {D3Selection} [value] - d3.js Selection
   * @method parent
   */
  this.parent = function(_){
    if (arguments.length) {
      parent = _
      return this
    } else {
      return parent
    }
  }
  /**
   * <p>Adds / Updates the data bound to the plot</p>
   * If value is specified, sets the data.<br>
   * If value is not specified, returns the currently bound data
   * @memberof module:EsbmePlots
   * @instance
   * @param {Array} [value] - Array with data
   * @method data
   */
  this.data = function(_){
    if (arguments.length) {
      data = _
      return this
    } else {
      return data
    }
  }
  /**
   * <p>Defines the total width of the SVG</p>
   * If value is specified, sets the width.<br>
   * If value is not specified, return the currently set width
   * @memberof module:EsbmePlots
   * @instance
   * @param {Int} [value] - width in px
   * @method width
   */
  this.width = function(_){
    if (arguments.length) {
      width = _
      return this
    } else {
      return width
    }
  }
  /**
   * <p>Defines the total height of the SVG</p>
   * If value is specified, sets the height.<br>
   * If value is not specified, return the currentlt set height
   * @memberof module:EsbmePlots
   * @instance
   * @param {Int} [value] - height in px
   * @method height
   */
  this.height = function(_){
    if (arguments.length) {
      height = _
      return this
    } else {
      return height
    }
  }
  /**
   * <p>Defines the class names to be added to each series</p>
   * If value is specified, sets the series names.<br>
   * If value is not specified, return the current series names
   * @memberof module:EsbmePlots
   * @instance
   * @param {String[]} [value=["Series1","Series2","Series3","Series4","Series5","Series6","Series7","Series8","Series9","Series10"]]
   * @method seriesNames
   */
  this.seriesNames = function(_){
    if (arguments.length){
      seriesNames = _
      return this
    } else {
      return seriesNames
    }
  }
  /**
   * <p>Defines the header to be printed above the plot</p>
   * If value is specified, sets the plot header.<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {String} [value="EsbmePlot"] - Header
   * @method header
   */
  this.header = function(_){
    if (arguments.length) {
      header = _
      return this
    } else {
      return header
    }
  }
  /**
   * <p>Defines the label to be printed below the X-axis</p>
   * If value is specified, sets the x-axis label.<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {String} [value]
   * @method xLabel
   */
  this.xLabel = function(_){
    if (arguments.length) {
      xLabel = _
      return this
    } else {
      return xLabel
    }
  }
  /**
   * <p>Defines the label to be printed alongside the Y-axis</p>
   * If value is specified, sets the y-axis label.<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {String} [value]
   * @method yLabel
   */
  this.yLabel = function(_){
    if (arguments.length) {
      yLabel = _
      return this
    } else {
      return yLabel
    }
  }
  /**
   * <p>Defines the domain for the X-axis</p>
   * If value is specified, sets the x-axis domain.<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {String} [value]
   * @method xDomain
   */
  this.xDomain = function(_){
    if (arguments.length) {
      xDomain = _
      return this
    } else {
      return xDomain
    }
  }
  /**
   * <p>Defines the domain for the y-axis</p>
   * If value is specified, sets the y-axis domain.<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {String} [value]
   * @method yDomain
   */
  this.yDomain = function(_){
    if (arguments.length) {
      yDomain = _
      return this
    } else {
      return yDomain
    }
  }
  /**
   * <p>Defines extra info that is stored in the DOM</p>
   * If value is specified, sets the info.<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {Object[]} [value]  - Must have the same format as data. Final elements can be any kind of object
   * @method info
   */
  this.info = function(_){
    if (arguments.length) {
      info = _
      return this
    } else {
      return info
    }
  }

  /**
   * <p>Defines the margin of the plot</p>
   * Margin is used to print labels and axes, so it should either
   * be set large enough or left to be determined automatically.
   * If value is specified, sets the margins.<br>
   * If value is not specified, return the current set value
   * @example
   * plot.margin(20)
   * => {top: 20, right: 20, bottom: 20, left: 20}
   * plot.margin("auto")
   * => {top: "auto", right: "auto", bottom: "auto", left: "auto"}
   * plot.margin(20,10)
   * => {top: 20, right: 10, bottom: 20, left: 10}
   * plot.margin(5,10,15,20)
   * => {top: 5, right: 10, bottom: 15, left: 20}
   * plot.margin({ top: 5, right: 10, bottom: 15, left: 20 })
   * => {top: 5, right: 10, bottom: 15, left: 20}
   * @memberof module:EsbmePlots
   * @instance
   * @param {(Int|Int[]|Object)} [value="auto"]  - Margins in same format as with CSS
   * @method margin
   */
  this.margin = function(_){
    if (arguments.length === 4) {
      manualMargin = {
        top:arguments[0],
        right:arguments[1],
        bottom:arguments[2],
        left:arguments[3]}
      return this
    } else if (arguments.length === 2) {
      manualMargin = {
        top:arguments[0],
        right:arguments[1],
        bottom:arguments[0],
        left:arguments[1]}
      return this
    } else if (arguments.length === 1) {
      if (typeof _ === "number" || _ === "auto") {
        manualMargin = {top:_, right:_, bottom:_, left:_}
      } else if (_.top !== undefined && _.right !== undefined && _.bottom !== undefined && _.left !== undefined){
        manualMargin = {top:_.top, right:_.right, bottom:_.bottom, left:_.left}
      } else if (_ instanceof Array){
        return this.margin.apply(this,_)
      } else {
        throw new Error("Invalid margins in Esbmeplot"+className)
      }
      return this
    } else {
      return {
        actual: margin,
        manual : manualMargin
      }
    }
  }

  /**
   * <p>Defines the svg element</p>
   * This value should rarely be used for setting the svg element and mainly used as a getter
   * If value is specified, sets the parent.<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {D3Selection} [value]
   * @method svg
   */
  this.svg = function(_){
    if (arguments.length) {
      svg = _
      return this
    } else {
      return svg
    }
  }

  /**
   * <p>Defines custom event listeners</p>
   * Not yet implemented
   * @memberof module:EsbmePlots
   * @instance
   * @param {Object} [value]  - Key=>value of events to listen and responding callbacks
   * @method events
   */
  this.events = function(_){
    if (arguments.length) {
      events = _
      return this
    } else {
      return events
    }
  }

  /**
   * <p>Defines a class to be added to all DOM elements within the SVG</p>
   * If value is specified, sets the class name.<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {String} [value=random]
   * @method className
   */
  this.className = function(_){
    if (arguments.length) {
      className = _
      return this
    } else {
      return className
    }
  }
  /**
   * <p>Defines the duration for transitions</p>
   * If value is specified, sets the length of transitions (in ms).<br>
   * If value is not specified, return the current set value
   * @memberof module:EsbmePlots
   * @instance
   * @param {Integer} [value=300]
   * @method duration
   */
  this.duration = function(_){
    if (arguments.length) {
      duration = _
      return this
    } else {
      return duration
    }
  }
  /**
   * <p>Defines a callback to be called whenever transitions finish</p>
   * Not yet implemented
   * @memberof module:EsbmePlots
   * @instance
   * @method finished
   */
  this.finished = function(_){
    if (arguments.length) {
      finished = _
      return this
    } else {
      return finished
    }
  }

  /**
   * <p>Creates a new svg or updates and existing one</p>
   * Sets / Updates widht/height/viewBox and className
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method createSVG
   */
  this.createSVG = function(){
    if (!svg){
      svg = parent.append("svg")
    }
    svg
      .attr("class", "esbmeplot " +className)
      .attr("width",width+"px")
      .attr("height",height+"px")
      .attr("viewBox","0 0 " + width + " " + height)

    var canvas = svg.selectAll("g.esbmeplot.canvas").data([data])
    canvas.enter()
      .append("g").attr("class","esbmeplot canvas "+className)
      .merge(canvas)

    this.addLabels()
  }

  /**
   * <p>Adds the x- and y-axis labels</p>
   * Adds the header and axes labels so they can be measured for defining margins
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method addLabels
   */
  this.addLabels = function(){
    if (header !== undefined){

      var headers = svg.selectAll("text.esbmeplot.header")
        .data([header])

      headers.exit().remove()
      headers.enter().append("text")
        .merge(headers)
        .attr("class", "esbmeplot header "+className)
        .attr("x",width/2)
        .style("text-anchor","middle")
        .text(header)

      svg.selectAll("text.esbmeplot.header")
        .attr("y",function(){
          return this.getBoundingClientRect().height
        })
    }

    if (yLabel !== undefined){
      var yLabelContainer = svg.selectAll("g.esbmeplot.axis-label.y")
        .data([yLabel])

      yLabelContainer.exit().remove()
      yLabelContainer = yLabelContainer.enter().append("g")
        .merge(yLabelContainer)
        .attr("class", "esbmeplot axis-label y "+className)

      var yLabelNode = yLabelContainer.selectAll("text").data([yLabel])

      yLabelNode.exit().remove()
      yLabelNode = yLabelNode.enter().append("text")
        .merge(yLabelNode)
        .attr("class", "esbmeplot axis-label y "+className)
        .attr("transform","rotate(-90)")
        .style("text-anchor","end")
        .text(yLabel)
    }

    if (xLabel !== undefined){
      var xLabelContainer = svg.selectAll("g.esbmeplot.axis-label.x")
        .data([xLabel])

      xLabelContainer.exit().remove()
      xLabelContainer = xLabelContainer.enter().append("g")
        .merge(xLabelContainer)
        .attr("class","esbmeplot axis-label x "+className)

      var xLabelNode = xLabelContainer.selectAll("text").data([xLabel])

      xLabelNode.enter().append("text")
        .merge(xLabelNode)
        .attr("class", "esbmeplot axis-label x "+className)
        .style("text-anchor","end")
        .attr("dy","0.5em")
        .text(xLabel)
    }
  }

  /**
   * <p>Calculates the required margins</p>
   * If margins are set to "auto", calculates the ideal margin for plotting
   * Overrides the "auto"-value
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method setMargins
   * @returns {Object} Dimensions of the plot
   */
  this.setMargins = function(){
    margin = manualMargin
    if (margin.top === "auto"){
      this.setTopMargin()
    }
    if (margin.bottom === "auto"){
      this.setBottomMargin()
    }

    if (margin.left === "auto"){
      this.setLeftMargin()
    }

    if (margin.right === "auto"){
      margin.right = 10
    }

    this.positionLabels()

    return {
      height: height,
      width: width,
      plotHeight: height - margin.top - margin.bottom,
      plotWidth: width - margin.left - margin.right,
      margin: margin
    }
  }

  /**
   * <p>Calculates the required top-margin</p>
   * Takes into account if a header is present and the size of the header
   * with current font settings
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method setTopMargin
   */
  this.setTopMargin = function(){
    margin.top = svg.select("text.esbmeplot.header")
      .node()
      .getBoundingClientRect().height * 1.5 + 10
  }

  /**
   * <p>Calculates the required bottom-margin</p>
   * Takes into account the size of the x-axis and an x-label
   * with current font settings
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method setBottomMargin
   */
  this.setBottomMargin = function(){
    var xAxisHeight = xAxis ?
      xAxis.node().getBoundingClientRect().height :
      0

    var xAxisLabel = svg.select("text.esbmeplot.axis-label.x").node()
    var xLabelHeight = xAxisLabel ?
      xAxisLabel.getBoundingClientRect().height : 0
    margin.bottom = (xAxisHeight + xLabelHeight) + 10
  }

  /**
   * <p>Calculates the required left-margin</p>
   * Takes into account the size of the y-axis and an y-label
   * with current font settings
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method setLeftMargin
   */
  this.setLeftMargin = function(){
    var yAxisWidth = yAxis ?
      yAxis.node().getBoundingClientRect().width :
      0

    var yAxisLabel = svg.select("text.esbmeplot.axis-label.y").node()
    var yLabelWidth = yAxisLabel ?
      yAxisLabel.getBoundingClientRect().width : 0
    margin.left = (yAxisWidth + yLabelWidth) + 10
  }

  /**
   * <p>Transforms the x- and y-labels to sit next to or below the axes</p>
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method positionLabels
   */
  this.positionLabels = function(){
    svg.selectAll("g.esbmeplot.axis-label.y")
      .attr("transform",function(){
        return "translate(" +
          this.getBoundingClientRect().width + ","+
          margin.top + ")"
      })

    svg.selectAll("g.esbmeplot.axis-label.x")
      .attr("transform",function(){
        return "translate(" +
          (width - margin.right) + "," +
          (height - this.getBoundingClientRect().height) + ")"
      })
  }


  /**
   * <p>Adds a not-complete x-axis</p>
   * This axis will have all ticks printed so the size can be calculated
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method addXAxis
   */
  this.addXAxis = function(xLabels){
    if (!this.scaleX) {
      return
    }
    xAxisGenerator = d3.axisBottom(this.scaleX())
    if (xLabels){
      xAxisGenerator.tickValues(xLabels)
    }

    xAxis = svg.selectAll("g.x-axis")
      .data(function(d){return [d]})

    xAxis.exit().remove()

    xAxis = xAxis.enter().append("g")
      .merge(xAxis)
      .attr("class","esbmeplot x-axis "+className)

    xAxis.call(xAxisGenerator)
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
  this.xLabelRotation = function(_){
    if (arguments.length){
      xLabelRotation = _
      return this
    } else {
      return xLabelRotation
    }
  }

  /**
   * <p>Rotates the x-axis category labels</p>
   * Rotates the labels if required and realigns them
   * @memberof module:EsbmePlots.Barplot
   * @instance
   * @private
   * @method applyXLabelRotation
   */
  this.applyXLabelRotation = function(){
    var label = this.svg().selectAll("g.x-axis g.tick text")
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

  /**
   * <p>Adds a not-complete y-axis</p>
   * This axis will have all ticks printed so the size can be calculated
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method addYAxis
   */
  this.addYAxis = function(yLabels){
    if (!this.scaleY) {
      return
    }
    yAxisGenerator = d3.axisLeft(this.scaleY())
    if (yLabels){
      yAxisGenerator.tickValues(yLabels)
    }

    yAxis = svg.selectAll("g.y-axis")
      .data(function(d){return [d]})

    yAxis.exit().remove()

    yAxis = yAxis.enter().append("g")
      .merge(yAxis)
      .attr("class","esbmeplot y-axis "+className)

    yAxis.call(yAxisGenerator)
  }

  /**
   * <p>Places the canvas and axes at the correct positions</p>
   * Takes into account the defined margins.
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @method setCanvas
   */
  this.setCanvas = function(){
    var canvas = svg.select("g.canvas")
      .data([data])
      .attr("transform","translate("+
        margin.left+","+
        margin.top+")")

    if (xAxis){
      xAxis
        .attr("transform","translate("+
          margin.left + "," +
          (height - margin.bottom) + ")")
        .call(xAxisGenerator)
    }

    if (yAxis){
      yAxis
        .attr("transform","translate("+
          margin.left + "," +
          margin.top + ")")
        .call(yAxisGenerator)
    }

    return canvas
  }

  /**
   * <p>Binds all defined elements to the selection</p>
   * @memberof module:EsbmePlots
   * @instance
   * @private
   * @param {D3Selection} selection
   * @method addEvents
   */
  this.addEvents = function(selection){
    Object.keys(events).forEach(function(evt){
      selection
        .on(evt,events[evt])
    })
  }

  /**
   * <p>Handles the creation of the plot</p>
   * Takes into account the defined margins.
   * @memberof module:EsbmePlots
   * @instance
   * @method setCanvas
   */
  this.draw = function(){
    this.checkData()
    if (this.scaleX || this.scaleY) {
      this.setScaleDomains()
    }
    this.createSVG()
    this.addAxes()
    var dimensions = this.setMargins()

    if (this.scaleX || this.scaleY) {
      this.setScaleRanges(dimensions)
    }
    var canvas = this.setCanvas()
    this.drawData(canvas,dimensions)
    return this
  }

  this.addAxes = function(){}
}

// Requires the following instance functions
// checkData
// drawData
// scaleX => can be undefined
// scaleY => can be undefined
// setScaleDomains
// setScaleRanges
