# Esbme Plots

An extension of the **D3.js** (v4) library for fast and flexible generation of basic plot types
- Barplots
- Scatterplots
- Piecharts

The chart generation supports argument chaining in D3.js style and allows for seamless chart generation.

[Check out an interactive example of EsbmePlots](https://esbme.com/plots/).

The plots support multi data-series plots as well. Each series will be classed differently so they can be styled accordingly.

Scatterplot is designed to utilize <code>canvas</code> functionality with large datasets to prevent DOM overload. This can also be manually defined for each plot.


# Brief Examples
Simply include the requires JS files in your HTML source:
```html
<!-- You need to include d3.js version 4.0 -->
<script src="https://d3js.org/d3.v4.min.js"></script>

<!-- Base EsbmePlot.js script must be included everytime -->
<script src="plots/EsbmePlot.js"></script>

<!-- You can import only the plots you actually need -->
<script src="plots/Barplot.js"></script>
<script src="plots/Piechart.js"></script>
<script src="plots/Scatterplot.js"></script>
```

## Barplots
```javascript
Barplot()
    .parent(d3.select("div.plot-container"))
    .className("test-plot")
    .width(400)
    .height(300)
    .header("Look at this barplot")
    .xLabel("Weekday")
    .xLabelRotation(-45)
    .yLabel("Percent happyness")
    .categories(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"])
    .data([1,2,3,4,5,6,7])
    .draw()
```

## Scatterplot
```javascript
Scatterplot()
    .parent(d3.select("div.plot-container"))
    .className("test-plot")
    .width(400)
    .height(300)
    .header("Look at this scatterplot")
    .xLabel("Years experience")
    .yLabel("Number of bugs")
    .yDomain("auto")
    .xDomain("auto")
    .radius(5)
    .data([[1,1],[2,2],[3,3],[4,4]])
    .draw()
```
## Piechart
```javascript
Piechart()
    .parent(d3.select("div.plot-container"))
    .className("test-plot")
    .width(200)
    .height(200)
    .header("Look at this Piechart")
    .showValues(false)
    .data([35,57])
    .draw()
```

## API
[Chek out the API documentation](https://esbme.com/plots/docs/module-EsbmePlots.html) or look at the <code>docs</code> folder for detailed documentation of all functions and the full API.


## Examples
[Check out the interactive example of EsbmePlots](https://esbme.com/plots/).

The code is also present in the <code>example</code> subfolder.

