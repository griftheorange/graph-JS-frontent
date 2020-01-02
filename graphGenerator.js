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

                    console.log(graph)
                    console.log(jsonifiedCSV)
                    console.log(orderedColumns)
                    console.log(graphData)
                    
                    let canvas = d3.select("#graph-div")
                                .append("svg")
                                .attr("width", 500)
                                .attr("height", 500)


            })
        })
    })
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
            aggHash[key][x[j]] = aggHash[key][x[j]] + parseFloat(series[key-1][j])
        }
    }
    return aggHash
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}