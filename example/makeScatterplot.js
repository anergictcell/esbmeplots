(function makeScatterplot(){
  var controls = [
    {
      name: "className",
      type: "text",
      value: "test-plot"
    },
    {
      name: "width",
      type: "number",
      value: "400",
      parser: Number
    },
    {
      name: "height",
      type: "number",
      value: "300",
      parser: Number
    },
    {
      name: "margin",
      type: "text",
      value: "auto",
      parser: function(x){
        return x.replace(/\s/g,"").split(",").map(function(value){
          if (value !== "auto"){
            value = +value
          }
          return value
        })
      }
    },
    {
      name: "header",
      type: "text",
      value: "Look at this scatterplot"
    },
    {
      name: "xLabel",
      type: "text",
      value: "Years experience"
    },
    {
      name: "yLabel",
      type: "text",
      value: "Number of bugs"
    },
    {
      name: "seriesNames",
      type: "text",
      value: "green,blue",
      parser: function(x){return x.replace(/\s/g,"").split(",")}
    },
    {
      name: "colors",
      type: "text",
      value: "#388e3c,#1976D2",
      parser: function(x){return x.replace(/\s/g,"").split(",")}
    },
    {
      name: "canvas",
      type: "text",
      value: "auto",
      parser: function(x){
        if (x === "" || x === "auto") {
          return "auto"
        } else if (x === "canvas") {
          return "canvas"
        } else if  (x === "svg") {
          return "svg"
        } else {
          alert("The only allowed options are:\nauto\ncanvas\nsvg\n")
          return "auto"
        }
      }
    },
    {
      name: "yDomain",
      type: "text",
      value: "auto",
      parser: function(x){
        return x === "auto" ?
          x :
          x.replace(/\s/g,"").split(",")
      }
    },
    {
      name: "xDomain",
      type: "text",
      value: "auto",
      parser: function(x){
        return x === "auto" ?
          x :
          x.replace(/\s/g,"").split(",")
      }
    },
    {
      name: "radius",
      type: "number",
      value: 5,
      parser: Number
    }
  ]
  var data = []
  function createScatterplotControls(){
    var seriesNames = controls.filter(function(control){
      return control.name === "seriesNames"
    })[0]

    seriesNames.parser(seriesNames.value).forEach(function(series,i){
      if (!data[i]) {
        data[i] = {
          type: "text",
          // value: ""+Math.floor(Math.random()*100)+","+Math.floor(Math.random()*100),
          value: randomArray(),
          parser: function(x){
            return x.replace(/\s/g,"").split(";").map(function(ary){
              return ary.split(",").map(function(x){
                return +x
              })
            })
          }
        }
      }
      data[i].name =  "data "+series
    })


    function randomArray(){
      var n = 20
      var items = []
      for (var i=0; i < n; i++) {
        items.push(""+Math.floor(Math.random()*100)+","+Math.floor(Math.random()*500))
      }
      return items.join(";")
    }

    var inputs = d3.select(".scatterplot-controls").selectAll(".controller").data(controls.concat(data))
    inputs.exit().remove()
    inputs = inputs.enter()
      .append("div")
      .merge(inputs)
      .attr("class","controller scatterplot")
      .call(function(el){
        var label = el.selectAll("label").data(function(d){return [d]})
        label.enter()
          .append("label")
          .merge(label)
          .attr("class","controller-label scatterplot")
          .attr("for",function(d){
            return "controller-scatterplot-"+d.name
          })
          .text(function(d){return d.name})
      })
      .call(function(el){
        var input = el.selectAll("input.scatterplot").data(function(d){return [d]})
        input.enter()
          .append("input")
          .merge(input)
          .attr("class",function(d){return d.name + " scatterplot controller-input"})
          .attr("type",function(d){return d.type})
          .attr("name",function(d){
            return d.name
          })
          .attr("id",function(d){
            return "controller-scatterplot-"+d.name
          })
          .attr("value",function(d){
            return d.value
          })
          .on("change",function(d){
            if (d.type === "checkbox"){
              d.value = this.checked
            } else {
              d.value = this.value
            }
            createScatterplotControls()
          })
      })

    var command = ["Scatterplot()",".parent(d3.select(\".scatterplot-plot\"))"]
    myPlot.parent(d3.select(".scatterplot-plot"))
    d3.selectAll("input.scatterplot:not(.data):not(.parent):not(.nDataPointsPerSeries)").each(function(d){
      var value = d.parser ?
        d.parser(d.value) :
        d.value
      myPlot[d.name](value)
      command.push("."+d.name+"("+JSON.stringify(value)+")")
    })
    var plotData = []
    d3.selectAll("input.scatterplot.data").each(function(d){
      plotData.push(d.parser(d.value))
    })
    myPlot.data(plotData)
    myPlot.events(events)
    myPlot.draw()
    command.push(".data("+JSON.stringify(plotData)+")")
    addCode(d3.select(".scatterplot-description"),command)
  }

  var myPlot = Scatterplot()
  createScatterplotControls()
})()