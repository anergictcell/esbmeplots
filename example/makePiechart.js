(function makePiechart(){
  var controls = [
    {
      name: "parent",
      type: "text",
      value: ".piechart-plot",
      parser: function(d){
        return d3.selectAll(d)
      }
    },
    {
      name: "className",
      type: "text",
      value: "test-plot"
    },
    {
      name: "width",
      type: "number",
      value: "200",
      parser: Number
    },
    {
      name: "height",
      type: "number",
      value: "200",
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
      name: "innerRadius",
      type: "number",
      value: "0",
      parser: Number
    },
    {
      name: "cornerRadius",
      type: "number",
      value: "3",
      parser: Number
    },
    {
      name: "header",
      type: "text",
      value: "Look at this Piechart"
    },
    {
      name: "categories",
      type: "text",
      value: "Awesome,Great",
      parser: function(x){return x.replace(/\s/g,"").split(",")}
    },
    {
      name: "seriesNames",
      type: "text",
      value: "green,blue",
      parser: function(x){return x.replace(/\s/g,"").split(",")}
    },
    {
      name: "showCategories",
      type: "checkbox",
      value: false
    },
    {
      name: "showValues",
      type: "text",
      value: "",
      parser: function(x){
        if (x === "" || x === "null" || x === "false") {
          return false
        } else if (x === "percent") {
          return "percent"
        } else if  (x === "number") {
          return "number"
        } else {
          alert("The only allowed options are:\nnull\npercent\nnumber\n")
          return false
        }
      }
    },
    {
      name: "data",
      type: "text",
      value: ""+Math.floor(Math.random()*100)+","+Math.floor(Math.random()*100),
      parser: function(x){
        return x.replace(/\s/g,"").split(",").map(function(x){
          return +x
        }
      )}
    }
  ]
  function createPiechartControls(){
    var inputs = d3.select(".piechart-controls").selectAll(".controller").data(controls)
    inputs.exit().remove()
    inputs = inputs.enter()
      .append("div")
      .merge(inputs)
      .attr("class","controller piechart")
      .call(function(el){
        var label = el.selectAll("label").data(function(d){return [d]})
        label.enter()
          .append("label")
          .merge(label)
          .attr("class","controller-label piechart")
          .attr("for",function(d){
            return "controller-piechart-"+d.name
          })
          .text(function(d){return d.name})
      })
      .call(function(el){
        var input = el.selectAll("input.piechart").data(function(d){return [d]})
        input.enter()
          .append("input")
          .merge(input)
          .attr("class",function(d){return d.name + " piechart controller-input"})
          .attr("type",function(d){return d.type})
          .attr("name",function(d){
            return d.name
          })
          .attr("id",function(d){
            return "controller-piechart-"+d.name
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
            createPiechartControls()
          })
      })
    var command = ["Piechart()",".parent(d3.select(\".piechart-plot\"))"]
    myPlot.parent(d3.select(".piechart-plot"))
    d3.selectAll("input.piechart:not(.parent)").each(function(d){
      var value = d.parser ?
        d.parser(d.value) :
        d.value
      myPlot[d.name](value)
      command.push("."+d.name+"("+JSON.stringify(value)+")")
    })
    myPlot.events(events)
    myPlot.draw()
    addCode(d3.select(".piechart-description"),command)
  }
  var myPlot = Piechart()
  createPiechartControls()
})()