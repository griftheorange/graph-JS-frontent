let barDivHeight = 30

function barGraphShowPage(user_id, data_id, graph_id){
    let body = document.querySelector("body")
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

    fetchUser(user_id)
    .then(user => renderTopBar(user, body))
    .then((r) => {
        fetchGraph(graph_id)
        .then((graph) => {
            barGraphDivs(body, graph)
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

function renderBarGraph(graph, json, orderedColumns, graphData){

    let series = Object.keys(graphData)
    let categories = Object.keys(graphData[1])
    let values = []
    let testValues = []

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

    console.log(graphData)
    console.log(series)
    console.log(categories)
    console.log(values)

    let heightScale = d3.scaleLinear()
                    .domain([0, Math.max(...posValues)])
                    .range([0, 100])

    let canvas = d3.select("#graph-div")
                .append("svg")
                .attr("width", `${width}%`)
                .attr("height", `${height}%`)
                
    let svgClientSize = canvas.node().getBoundingClientRect()

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
                    .attr("height", function(d){
                        if (hasNegatives){
                            return `${heightScale(Math.abs(d))/2}%`
                        } else {
                            return `${heightScale(Math.abs(d))}%`
                        }
                    })
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
                    .attr("x", function(d, i){
                        return `${spreadScale(i)+((100/values.length)/2)/2}%`
                    })
                    .attr("fill", function(d, i){
                        return color((i)%(series.length+2))
                    })
                    .attr("id", function(d, i){return i})
                    
    let legend = canvas.selectAll("div")
                .data(series)
                .enter()
                    .append("rect")
                    .attr("width", `2%`)
                    .attr("height", `1%`)
                    .attr("y", function(d, i){
                        return `${i*5}%`
                    })
                    .attr("x", '90%')
                    .attr("fill", function(d, i){
                        return color(i)
                    })
}

function barGraphDivs(body, graph){
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
    title.innerText = `Bar Graph: ${graph.title}`
    titleDiv.append(title)

    let description = document.createElement("textarea")
    description.value = graph.description
    descDiv.append(description)


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