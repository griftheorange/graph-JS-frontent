let barDivHeight = 38

function prepPage(user_id, data_id, graph_id, body){
    let child = body.lastElementChild
    while (child){
        child.remove()
        child = body.lastElementChild
    }
    let dataStore = document.createElement("div")
    dataStore.id = "data"
    dataStore.dataset.user_id = user_id
    dataStore.dataset.graph_id = graph_id
    dataStore.dataset.data_id = data_id
    dataStore.diplay = "none"
    body.append(dataStore)
}

function pieGraphShowPage(user_id, data_id, graph_id){
    let body = document.querySelector("body")
    prepPage(user_id, data_id, graph_id, body)

    fetchUser(user_id)
    .then(user => renderTopBar(user, body))
    .then((r) => {
        let topBarData = document.createElement("p")
        let topBar = document.getElementById("topbar")
        topBarData.innerText = "Dataset"
        topBarData.addEventListener("click", (evt) => {
            renderDsPageLink(data_id, user_id)
        })
        topBar.append(topBarData)
        fetchPieGraph(graph_id)
        .then((graph) => {
            graphDivs(body, graph, "Pie")
            fetch(`http://localhost:3000/datasets/${data_id}`)
            .then(r => r.json())
            .then((dataset) => {
                fetchDataset(dataset)
                .then((csv) => {
                    let jsonifiedCSV = csvJSON(csv)
                    let orderedColumns = getOrderedColumns(jsonifiedCSV)
                    let graphData = extractDataArrays(graph, jsonifiedCSV, orderedColumns)

                    // renderBarGraph(graph, jsonifiedCSV, orderedColumns, graphData)
                    // renderLineGraph(graph, jsonifiedCSV, orderedColumns, graphData)
                    renderPieGraph(graph, jsonifiedCSV, orderedColumns, graphData)
                })
            })
        })
    })
}

function lineGraphShowPage(user_id, data_id, graph_id){
    let body = document.querySelector("body")
    prepPage(user_id, data_id, graph_id, body)

    fetchUser(user_id)
    .then(user => renderTopBar(user, body))
    .then((r) => {
        let topBarData = document.createElement("p")
        let topBar = document.getElementById("topbar")
        topBarData.innerText = "Dataset"
        topBarData.addEventListener("click", (evt) => {
            renderDsPageLink(data_id, user_id)
        })
        topBar.append(topBarData)
        fetchLineGraph(graph_id)
        .then((graph) => {
            graphDivs(body, graph, "Line")
            fetch(`http://localhost:3000/datasets/${data_id}`)
            .then(r => r.json())
            .then((dataset) => {
                fetchDataset(dataset)
                .then((csv) => {
                    let jsonifiedCSV = csvJSON(csv)
                    let orderedColumns = getOrderedColumns(jsonifiedCSV)
                    let graphData = extractDataArraysLine(graph, jsonifiedCSV, orderedColumns)

                    renderLineGraph(graph, jsonifiedCSV, orderedColumns, graphData)
                    // renderBarGraph(graph, jsonifiedCSV, orderedColumns, graphData)
                })
            })
        })
    })
}

function barGraphShowPage(user_id, data_id, graph_id){
    let body = document.querySelector("body")
    prepPage(user_id, data_id, graph_id, body)

    fetchUser(user_id)
    .then(user => renderTopBar(user, body))
    .then((r) => {
        let topBarData = document.createElement("p")
        let topBar = document.getElementById("topbar")
        topBarData.innerText = "Dataset"
        topBarData.addEventListener("click", (evt) => {
            renderDsPageLink(data_id, user_id)
        })
        topBar.append(topBarData)
        fetchGraph(graph_id)
        .then((graph) => {
            graphDivs(body, graph, "Bar")
            fetch(`http://localhost:3000/datasets/${data_id}`)
            .then(r => r.json())
            .then((dataset) => {
                fetchDataset(dataset)
                .then((csv) => {
                    let jsonifiedCSV = csvJSON(csv)
                    let orderedColumns = getOrderedColumns(jsonifiedCSV)
                    let graphData = extractDataArrays(graph, jsonifiedCSV, orderedColumns)

                    renderBarGraph(graph, jsonifiedCSV, orderedColumns, graphData)
            })
        })
    })
    })
}

function renderLineGraph(graph, json, orderedColumns, graphData){

    let width = 90
    let height = 100
    let values = []
    let series = []
    let dates = []
    let seriesNames = []
    for(let key in graph.flattenedSeries){
        if(graph.flattenedSeries[key][0] == "Column"){
            seriesNames.push(`${Object.keys(json[0])[graph.flattenedSeries[key][1]-1]}`)
        }
    }
    for (let ser in graphData){
        if (ser != "x"){
            series.push(ser)
            graphData[ser].forEach((num) => {
                values.push(num)
            })
        } else {
            graphData["x"].forEach((value) => {
                dates.push(parseFloat(value))
            })
        }
    }
    let minDate = Math.min(...dates)
    let maxDate = Math.max(...dates)

    let xScale = d3.scaleLinear()
                .domain([minDate, maxDate])
                .range([0, 90])

    let yScale = d3.scaleLinear()
                .domain([Math.min(...values), Math.max(...values)])
                .range([0, 95])

    let colorScale = d3.scaleLinear()
                    .domain([0, series.length])
                    .range(["green", "#cbdb14"])

    let canvas = d3.select("#graph-div")
                .append("svg")
                .style("margin-top", "1%")
                .attr("width", `${width}%`)
                .attr("height", `${height}%`)
                .append("g")
    
    let bottomLabel = d3.select("#graph-div")
                        .append("svg")
                        .attr("width", `${width}%`)
                        .attr("height", `${height}%`)
                        .append("g")

    let parent = canvas.node().parentNode

    let svgClientSize = parent.getBoundingClientRect()

    let axisScale = d3.scaleLinear()
                    .domain([Math.max(...values), Math.min(...values)])
                    .range([-5, svgClientSize.height-10])

    let xAxisScale = d3.scaleLinear()
                    .domain([minDate, maxDate])
                    .range([0, svgClientSize.width*0.9])

    let axis = d3.axisRight(axisScale)

    let xAxis = d3.axisBottom(xAxisScale)

    canvas.call(axis)
    bottomLabel.call(xAxis)

    let counter = 0
    series.forEach((ser, index) => {
        let circles = canvas.selectAll("div")
        .data(graphData[ser])
        .enter()
            .append("circle")
            .attr("r", "0.2em")
            .attr("cx", function(d, i){
                return `${xScale(graphData["x"][i])}%`
            })
            .attr("cy", function(d, i){
                return `${95 - yScale(graphData[ser][i]) + 2.5}%`
            })
            .attr("fill", function(d, i){
                return colorScale(parseInt(ser))
            })
            .style("opacity", 0)
            counter += 1

            let lines = canvas.selectAll("div")
            .data(graphData[ser])
            .enter()
                .append("line")
                .attr("x1", function(d, i){
                    return `${xScale(graphData["x"][i])}%`
                })
                .attr("y1", function(d, i){
                    return `${95 - yScale(graphData[ser][i]) + 2.5}%`
                })
                .attr("x2", function(d, i){
                    return `${xScale(graphData["x"][i])}%`
                })
                .attr("y2", function(d, i){
                    return `${95 - yScale(graphData[ser][i]) + 2.5}%`
                })
                .style("display", function(d, i){
                    if (i == graphData["x"].length - 1){
                        return "none"
                    }
                })
                .attr("style", function(d, i){
                    return `fill: ${colorScale(parseInt(ser))}; stroke: ${colorScale(parseInt(ser))}; stroke-width: 1.5;`
                })

        canvas.append("line")
              .attr("x1", "0%")
              .attr("y1", "89.5%")
              .attr("x2", "90%")
              .attr("y2", "89.5%")
              .attr("style", "fill: black; stroke: black; stroke-width: 1;")

        circles.transition()
              .delay(500)
              .duration(2000)
              .style("opacity", 1.0)

        lines.transition()
             .delay(1500)
             .duration(3000)
             .attr("x2", function(d, i){
                if (i == graphData["x"].length - 1){
                    return `${xScale(graphData["x"][i])}%`
                } else {
                    return `${xScale(graphData["x"][i+1])}%`
                }
                })
                .attr("y2", function(d, i){
                    if (i == graphData["x"].length - 1){
                        return `${95 - yScale(graphData[ser][i]) + 2.5}%`
                    } else {
                        return `${95 - yScale(graphData[ser][i+1]) + 2.5}%`
                    }
                })
    })

    let legend = canvas.selectAll("#ayy")
                .data(series)
                .enter()
                    .append("g")

    legend.append("rect")
            .attr("width", `2%`)
            .attr("height", `1%`)
            .attr("y", function(d, i){
                return `${(i+1)*5}%`
            })
            .attr("x", '90%')
            .attr("fill", function(d, i){
                return colorScale(i)
            })

    legend.append("text")
            .attr("style", "stroke: #660000; fill: #660000 ")
            .attr("y", function(d, i){
                return `${(i+0.8)*5}%`
            })
            .attr("x", '90%')
            .text(function(d){return `${seriesNames[d-1]}`})
}

function renderPieGraph(graph, json, orderedColumns, graphData){
    let total = 0
    for (let key in graphData[1]){
        total += Math.abs(graphData[1][key])
    }
    let series = Object.keys(graphData)
    let seriesNames = []
    let categories = Object.keys(graphData[1])
    let values = []
    let testValues = []

    for(let key in graph.flattenedSeries){
        if(graph.flattenedSeries[key][0] == "Column"){
            seriesNames.push(`: ${Object.keys(json[0])[graph.flattenedSeries[key][1]-1]}`)
        }
    }

    for(let i = 0; i < categories.length; i++){
        values
        testValues.push([])
        for(let ser in series){
            values.push(graphData[series[ser]][categories[i]])
            testValues[i].push(graphData[series[ser]][categories[i]])
        }
    }

    let sortedValues = [...values]
    sortedValues.sort(function(a, b){return a-b})
    let negValuesTrack = sortedValues.filter((value) => {return value <= 0})
    let posValuesTrack = sortedValues.filter((value) => {return value > 0})

    let posValues = values.map((num) => {
        return Math.abs(num)
    })

    let hasNegatives = !!values.find((num) => {
        return num < 0
    })

    let width = 90
    let height = 90
    let bottom = 100
    let center = 50
    let heightCorrect = 1.8

    let topCanvas = d3.select("#graph-div")
                    .append("svg")
                    .style("margin-top", "1%")
                    .attr("width", `${width}%`)
                    .attr("height", `${height}%`)

    let canvas = topCanvas
                .append("svg")
                .attr("x", "25%")
                .attr("y", "0%")
                .append("g")
                .attr("class", "pie-group")


    let parent = canvas.node().parentNode.parentNode
    let svgClientSize = parent.getBoundingClientRect()
    canvas
        .attr("transform", `translate(${svgClientSize.x*2}, ${svgClientSize.y})`)

    let negColor = d3.scaleLinear()
        .domain([0, negValuesTrack.length/3, negValuesTrack.length/3*2, negValuesTrack.length])
        .range(["#a11003", "red" ,"orange", "yellow"])
                
    let posColor = d3.scaleLinear()
        .domain([0, posValuesTrack.length/3, posValuesTrack.length])
        .range(["#00570d", "#0f8020", "#7eb51f", ])

    let arc = d3.arc()
        .innerRadius(svgClientSize.y/2.3)
        .outerRadius(svgClientSize.y/1.15)

    let pie = d3.pie()
        .value(function (d) { return Math.abs(d) })
        .sort(null)
        .padAngle(0.02)

    let arcs = canvas.selectAll(".arc")
        .data(pie(sortedValues))
        .enter()
        .append('g')
        .attr("class", "arc")

    arcs.append("path")
        .transition()
        .delay(function(d, i){return i * 200})
        .duration(function(d, i){return 2000/values.length})
        .attrTween("d", function(d){
            let i = d3.interpolate(d.startAngle+0.1, d.endAngle)
            return function(t){
                d.endAngle = i(t)
                return arc(d)
            }
        })
        .attr("fill", function(d){
            if(d.data <= 0){
                return negColor(d.index)
            } else {
                return posColor(d.index-negValuesTrack.length)
            }
        })
        .attr("stroke", function(d){
            if(d.data <= 0){
                return negColor(d.index)
            } else {
                return posColor(d.index-negValuesTrack.length)
            }
        })
        .attr("opacity", "1")
        .attr("stroke-width", "3px")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("class", "arc-path")

        let legend = canvas.selectAll("div")
                .data(sortedValues)
                .enter()
                    .append("g")

    legend.append("rect")
            .attr("width", `2%`)
            .attr("height", `1%`)
            .attr("y", function(d, i){
                return `${(i+1)*3-30}%`
            })
            .attr("x", '20em')
            .attr("fill", function(d, i){
                if(d <= 0){
                    return negColor(i)
                } else {
                    return posColor(i-negValuesTrack.length)
                }
            })

    legend.append("text")
            .attr("style", "stroke: #660000; fill: #660000")
            .attr("y", function(d, i){
                return `${(i+1)*3-28.9}%`
            })
            .attr("font-size", "0.8em")
            .attr("x", '27.8em')
            .text(function(d){
                let found = ""
                for(let key in graphData[1]){
                    if (graphData[1][key] == d){
                        found = key.toLowerCase()
                    }
                }
                found = found.split(" ")
                found = found.map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1)
                })
                return `${found.join(" ")}`
            })

    let tooltip = topCanvas.append("svg")
        .append("g")
        .attr("class", "toolTip")
    
    let toolTipRect = tooltip
        .append("rect")
        .attr("width", "120px")
        .attr("height", "90px")
        .attr("rx", "10")
        .style("opacity", "0")
        .style("fill", "#fdf2d5")
        .style("stroke", "#867b5f")
        .style("stroke-width", "3")

    let dataName = tooltip.append("text")
        .attr("style", "stroke: #660000; fill: #660000")
        .attr("font-size", "0.8em")
        .attr("x", "15em")
        .attr("y", "15em")
        .style("opacity", "0")

    let dataValue = tooltip.append("text")
        .attr("style", "stroke: #660000; fill: #660000")
        .attr("font-size", "0.8em")
        .attr("x", "15em")
        .attr("y", "17em")
        .style("opacity", "0")

    let dataPercent = tooltip.append("text")
        .attr("style", "stroke: #660000; fill: #660000")
        .attr("font-size", "0.8em")
        .attr("x", "15em")
        .attr("y", "19em")
        .style("opacity", "0")


    d3.selectAll("path").on("mousemove", function(d){
        let found = ""
        for (let key in graphData[1]){
            if(graphData[1][key] == d.data){
                found = key.toLowerCase()
            }
        }
        found = found.split(" ")
        found = found.map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        toolTipRect.style("x", `${d3.event.offsetX+5}px`)
        toolTipRect.style("y", `${d3.event.layerY-55}px`)
        toolTipRect.style("opacity", "0.9")
        toolTipRect.style("stroke-opacity", "0.9")

        dataName.attr("x", `${d3.event.offsetX+15}px`)
        dataName.attr("y", `${d3.event.layerY-35}px`)
        dataName.text(`${found.join(" ")}`)
        dataName.style("opacity", "0.9")

        dataValue.attr("x", `${d3.event.offsetX+15}px`)
        dataValue.attr("y", `${d3.event.layerY-6}px`)
        dataValue.text(`${d.data.toFixed(2)}`)
        dataValue.style("opacity", "0.9")

        dataPercent.attr("x", `${d3.event.offsetX+15}px`)
        dataPercent.attr("y", `${d3.event.layerY+23}px`)
        dataPercent.text(`${(Math.abs(d.data)/total*100).toFixed(2)}%`)
        dataPercent.style("opacity", "0.9")
    })

    d3.selectAll("path").on("mouseout", function(d){
        toolTipRect.style("opacity", "0")
        dataName.style("opacity", "0")
        dataValue.style("opacity", "0")
        dataPercent.style("opacity", "0")
    })
}

function renderBarGraph(graph, json, orderedColumns, graphData){
    let series = Object.keys(graphData)
    let seriesNames = []
    let categories = Object.keys(graphData[1])
    let values = []
    let testValues = []

    for(let key in graph.flattenedSeries){
        if(graph.flattenedSeries[key][0] == "Column"){
            seriesNames.push(`: ${Object.keys(json[0])[graph.flattenedSeries[key][1]-1]}`)
        }
    }

    for(let i = 0; i < categories.length; i++){
        values
        testValues.push([])
        for(let ser in series){
            values.push(graphData[series[ser]][categories[i]])
            testValues[i].push(graphData[series[ser]][categories[i]])
        }
        values.push(0)
        values.push(0)
    }

    let posValues = values.map((num) => {
        return Math.abs(num)
    })

    let hasNegatives = !!values.find((num) => {
        return num < 0
    })
    let width = 90
    let height = 90
    let bottom = 100
    let center = 50
    let heightCorrect = 1.8

    let heightScale = d3.scaleLinear()
                    .domain([0, Math.max(...posValues)])
                    .range([0, 100])

    let canvas = d3.select("#graph-div")
                .append("svg")
                .style("margin-top", "1%")
                .attr("width", `${width}%`)
                .attr("height", `${height}%`)
                .append("g")

    let bottomLabel = d3.select("#graph-div")
                        .append("svg")
                        .attr("width", `${width}%`)
                        .attr("height", `${height}%`)
                        .append("g")
                        .attr("id", "bottom-axis")
                        .selectAll("div")
                        .data(categories)
                        .enter()
                            .append("text")
                            .attr("style", "stroke: #660000; fill: #660000; font-size: 0.5em; stroke-width: 0.01em;")
                            .attr("text-anchor", "middle")
                            .attr("x", function(d, i){
                                return `${(100/categories.length * (i+1))-(100/categories.length*0.65)}%`
                            })
                            .attr("y", '5%')
                            .text(function(d){return d})
                
    let svgClientSize = canvas.node().parentNode.getBoundingClientRect()

    let axisScale = d3.scaleLinear()
                    .domain(axisDomain())
                    .range([0-25, svgClientSize.height])

    function axisDomain(){
        if(hasNegatives){
            return [Math.max(...posValues)+(25/svgClientSize.height*Math.max(...posValues)), -Math.max(...posValues)+(25/svgClientSize.height*Math.max(...posValues))]
        } else {
            return [Math.max(...posValues)+(25/svgClientSize.height*Math.max(...posValues)), 0]
        }
    }

    let axis = d3.axisRight(axisScale)

    canvas.call(axis)

    canvas.append("line")
            .style("stroke", "black")
            .style("opacity", '0.5')
            .attr("x1", "0%")
            .attr("y1", function(){
                if (hasNegatives){
                    return '50%'
                } else {
                    return '100%'
                }
            })
            .attr("x2", "100%")
            .attr("y2", function(){
                if (hasNegatives){
                    return '50%'
                } else {
                    return '100%'
                }
            })
            
    let spreadScale = d3.scaleLinear()
                    .domain([0, values.length])
                    .range([0, 100])
    
    let color = d3.scaleLinear()
                .domain([0, series.length-1])
                .range(["green", "#cbdb14"])

    let bars = canvas.selectAll("div")
                .data(values)
                .enter()
                    .append("rect")
                    .attr("width", `${(100/values.length)/2}%`)
                    .attr("height", 0)
                    .attr("position", "fixed")
                    .attr("y", function(d){
                        if (hasNegatives){
                            if(d < 0){
                                return `${center}%`
                            } else {
                                return `${center - heightScale(d)/2}%`
                            }
                        } else {
                            return `${bottom - heightScale(d)}%`
                        }
                    })
                    .attr("x", function(d, i){return `${i/values.length*3}%`})
                    .attr("fill", function(d, i){
                        return color((i)%(series.length+2))
                    })
                    .attr("id", function(d, i){return i})
    
    bars.transition()
        .duration(1500)
        .attr("height", function(d){
            if (hasNegatives){
                return `${heightScale(Math.abs(d))/2}%`
            } else {
                return `${heightScale(Math.abs(d))}%`
            }
        })
    
    bars.transition()
        .delay(1500)
        .duration(3000)
        .attr("x", function(d, i){
            return `${spreadScale(i)+((100/values.length)/2)/2}%`
        })


    let labels = canvas.selectAll("div")
                .data(values)
                .enter()
                    .append("text")
                    .attr("y", "55%")
                    .attr("x", function(d, i){
                        return `${spreadScale(i)+((100/values.length)/2)/2 + ((100/values.length)/4)}%`
                    })
                    .attr("display", function(d){
                        if(d == 0 || values.length > 100){
                            return "none"
                        }
                    })
                    .attr("style", "stroke: #660000; fill: #660000; font-size: 1em; writing-mode: tb;")
                    .text(function(d){return d.toFixed(2)})

    let legend = canvas.selectAll("div")
                .data(series)
                .enter()
                    .append("g")

    legend.append("rect")
            .attr("width", `2%`)
            .attr("height", `1%`)
            .attr("y", function(d, i){
                return `${(i+1)*5}%`
            })
            .attr("x", '90%')
            .attr("fill", function(d, i){
                return color(i)
            })

    legend.append("text")
            .attr("style", "stroke: #660000; fill: #660000")
            .attr("y", function(d, i){
                return `${(i+0.8)*5}%`
            })
            .attr("x", '90%')
            .text(function(d){return `Series ${d}${seriesNames[d-1]}`})
}

function graphDivs(body, graph, chartType){
    let headerDiv = document.createElement("div")
    headerDiv.id = "header-div"
    let titleDiv = document.createElement("div")
    titleDiv.id = "title-div"
    let descDiv = document.createElement("div")
    descDiv.id = "desc-div"
    let graphDiv = document.createElement("div")
    graphDiv.id = "graph-div"
    graphDiv.style.width = "90%"
    graphDiv.style.height = `${barDivHeight}em`
    headerDiv.append(titleDiv)
    headerDiv.append(descDiv)

    let title = document.createElement("h1")
    title.innerText = `${chartType} Graph: ${graph.title}`
    titleDiv.append(title)

    let description = document.createElement("textarea")
    description.value = graph.description
    let updateDesc = document.createElement("input")
    updateDesc.type = "submit"
    updateDesc.value = "Update Decsription"
    updateDesc.addEventListener("click", (evt) => {
        fetchUpdateGraphDescription(description.value, graph.id, chartType)
    })
    descDiv.append(description)
    descDiv.append(updateDesc)


    body.append(headerDiv)
    body.append(graphDiv)
}

function getOrderedColumns(json){
    let ordered = []
    let count = 1
    for(let key in json[0]){
        ordered.push(key)
        count += 1
    }
    return ordered
}

function extractDataArraysLine(graph, json, orderedColumns){
    let dataHash = {
        x: []
    }
    if (graph.xAxis[0] == "Column"){
        let columnName = orderedColumns[graph.xAxis[1]-1]
        json.forEach((row) => {
            row[columnName] != undefined ? dataHash["x"].push(row[columnName]): 5
        })
    } else if(graph.xAxis[0] == "Row"){
        for (let key in json[graph.xAxis[1]-1]){
            dataHash["x"].push(json[graph.xAxis[1]-1][key])
        }
    } else {
        alert("This is an enormous error, line 85")
    }

    //get all values of each series
    let countSeries = 1
    for(let series in graph.flattenedSeries){
        dataHash[countSeries] = []
        if (graph.flattenedSeries[series][0] == "Column"){
            let columnName = orderedColumns[graph.flattenedSeries[series][1]-1]
            json.forEach((row) => {
                row[columnName] != undefined ? dataHash[countSeries].push(row[columnName]): 5
            })
        } else if(graph.flattenedSeries[series][0] == "Row"){
            for (let key in json[graph.flattenedSeries[series][1]-1]){
                dataHash[countSeries].push(json[graph.flattenedSeries[series][1]-1][key])
            }
        } else {
            alert("Critical Error Line 103")
        }
        countSeries += 1
    }

    return dataHash
}


function extractDataArrays(graph, json, orderedColumns){
    let dataHash = {
        x: []
    }
    //inserts xAxis
    if (graph.xAxis[0] == "Column"){
        let columnName = orderedColumns[graph.xAxis[1]-1]
        json.forEach((row) => {
            row[columnName] != undefined ? dataHash["x"].push(row[columnName]): 5
        })
    } else if(graph.xAxis[0] == "Row"){
        for (let key in json[graph.xAxis[1]-1]){
            dataHash["x"].push(json[graph.xAxis[1]-1][key])
        }
    } else {
        alert("This is an enormous error, line 85")
    }

    //Get series from CSV, Need to isolate columns, aggregate Data By Category
    let countSeries = 1
    for(let series in graph.flattenedSeries){
        dataHash[countSeries] = []
        if (graph.flattenedSeries[series][0] == "Column"){
            let columnName = orderedColumns[graph.flattenedSeries[series][1]-1]
            json.forEach((row) => {
                row[columnName] != undefined ? dataHash[countSeries].push(row[columnName]): 5
            })
        } else if(graph.flattenedSeries[series][0] == "Row"){
            for (let key in json[graph.flattenedSeries[series][1]-1]){
                dataHash[countSeries].push(json[graph.flattenedSeries[series][1]-1][key])
            }
        } else {
            alert("Critical Error Line 103")
        }
        countSeries += 1
    }
    let x = dataHash["x"]
    let series = []
    delete dataHash["x"]
    for(let key in dataHash){
        series.push(dataHash[key])
    }

    return aggregateByUniques(x, series)
}

function aggregateByUniques(x, series){
    let hash = {}
    let aggHash = {}
    x.filter(onlyUnique).forEach((element) => {
        hash[element] = 0
    })
    let count = 0
    series.forEach((series) => {
        count += 1
        aggHash[count] = {...hash}
    })

    for (let key in aggHash){
        for (let j = 0; j < x.length; j++){
            if(Object.is(parseFloat(series[key-1][j]), NaN)){
                continue
            } else {
                aggHash[key][x[j]] = aggHash[key][x[j]] + parseFloat(series[key-1][j])
            }
            
        }
    }
    return aggHash
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}