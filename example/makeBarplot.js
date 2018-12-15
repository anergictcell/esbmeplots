(function makeBarplot(){
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
      name: "paddingInner",
      type: "number",
      value: "0.1",
      parser: Number
    },
    {
      name: "paddingOuter",
      type: "number",
      value: "0.1",
      parser: Number
    },
    {
      name: "header",
      type: "text",
      value: "Look at this barplot"
    },
    {
      name: "xLabel",
      type: "text",
      value: "Weekday"
    },
    {
      name: "yLabel",
      type: "text",
      value: "Percent happyness"
    },
    {
      name: "categories",
      type: "text",
      value: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday",
      parser: function(x){return x.replace(/\s/g,"").split(",")}
    },
    {
      name: "seriesNames",
      type: "text",
      value: "green,blue",
      parser: function(x){return x.replace(/\s/g,"").split(",")}
    },
    {
      name: "xLabelRotation",
      type: "number",
      value: -45,
      parser: Number
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
      name: "stacked",
      type: "checkbox",
      value: false
    }
  ]
  var data = []
  function createBarplotControls(){
    var categories = controls.filter(function(control){
      return control.name === "categories"
    })[0]

    categories.parser(categories.value).forEach(function(category,i){
      if (!data[i]) {
        data[i] = {
          type: "text",
          value: ""+Math.floor(Math.random()*100)+","+Math.floor(Math.random()*100),
          parser: function(x){
            return x.replace(/\s/g,"").split(",").map(function(x){
              return +x
            }
          )}
        }
      }
      data[i].name =  "data "+category
    })

    var inputs = d3.select(".barplot-controls").selectAll(".controller").data(controls.concat(data))
    inputs.exit().remove()
    inputs = inputs.enter()
      .append("div")
      .merge(inputs)
      .attr("class","controller barplot")
      .call(function(el){
        var label = el.selectAll("label").data(function(d){return [d]})
        label.enter()
          .append("label")
          .merge(label)
          .attr("class","controller-label barplot")
          .attr("for",function(d){
            return "controller-barplot-"+d.name
          })
          .text(function(d){return d.name})
      })
      .call(function(el){
        var input = el.selectAll("input.barplot").data(function(d){return [d]})
        input.enter()
          .append("input")
          .merge(input)
          .attr("class",function(d){return d.name + " barplot controller-input"})
          .attr("type",function(d){return d.type})
          .attr("name",function(d){
            return d.name
          })
          .attr("id",function(d){
            return "controller-barplot-"+d.name
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
            createBarplotControls()
          })

      })
    var command = ["Barplot()",".parent(d3.select(\".barplot-plot\"))"]
    myPlot.parent(d3.select(".barplot-plot"))
    d3.selectAll("input.barplot:not(.data):not(.parent)").each(function(d){
      var value = d.parser ?
        d.parser(d.value) :
        d.value
      myPlot[d.name](value)
      command.push("."+d.name+"("+JSON.stringify(value)+")")
    })
    var plotData = []
    d3.selectAll("input.barplot.data").each(function(d){
      plotData.push(d.parser(d.value))
    })
    myPlot.data(plotData)
    myPlot.events(events)
    myPlot.draw()
    command.push(".data("+JSON.stringify(plotData)+")")
    addCode(d3.select(".barplot-description"),command)
  }
  var myPlot = Barplot()
  createBarplotControls()
})()