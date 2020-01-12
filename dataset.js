function renderDsPage(ds_id){
    let body = document.querySelector("body")
    let child = body.lastElementChild
    let user_id = document.querySelector("h1").dataset.user_id

    while(child){
        child.remove()
        child = body.lastElementChild
    }


    let hidden = document.createElement("div")
    hidden.dataset.user_id = user_id
    hidden.dataset.data_id = ds_id
    hidden.display = "none"
    hidden.id = "user_id"
    body.append(hidden)
    
    fetchUser(user_id)
    .then((user) => {
        let dataset = user.datasets.find((dataset) => {
            return dataset.id == ds_id
        })
        renderTopBar(user, body)

        let newH1 = document.createElement("h1")
        newH1.innerText = `${user.username}: ${dataset.name}`
        body.append(newH1)
        addTable(dataset, newH1)
        let graphsDiv = document.createElement("div")
        graphsDiv.id = "graphs_div"
        body.append(graphsDiv)
        addGraphs(dataset, graphsDiv)
        addGraphForm(user, dataset, body)
    })
}

function renderDsPageLink(data_id, user_id){
    let body = document.querySelector("body")
    let child = body.lastElementChild

    while(child){
        child.remove()
        child = body.lastElementChild
    }

    let trackH1 = document.createElement("h1")
    trackH1.style = "display: none"
    trackH1.dataset.user_id = user_id
    body.append(trackH1)

    renderDsPage(data_id)
}

function addGraphs(dataset, graphsDiv){
    let child = graphsDiv.lastElementChild
    while (child){
        child.remove()
        child = graphsDiv.lastElementChild
    }

    let barGraphs = dataset.bar_graphs
    let lineGraphs = dataset.line_graphs
    let pieGraphs = dataset.pie_graphs
    let barDiv = document.createElement("div")
    let barP = document.createElement("p")
    let lineDiv = document.createElement("div")
    let lineP = document.createElement("p")
    let pieDiv = document.createElement("div")
    let pieP = document.createElement("p")
    barDiv.id = "barDiv"
    barDiv.classList.add("graphDiv")
    barP.innerText = "Bar Graphs"
    lineDiv.id = "lineDiv"
    lineDiv.classList.add("graphDiv")
    lineP.innerText = "Line Graphs"
    pieDiv.id = "pieDiv"
    pieDiv.classList.add("graphDiv")
    pieP.innerText = "Pie Graphs"
    barDiv.append(barP)
    lineDiv.append(lineP)
    pieDiv.append(pieP)
    barGraphs.forEach((graph) => {
        let newDiv = document.createElement("div")
        let newP = document.createElement("p")
        let del = document.createElement("input")
        del.type = "submit"
        del.value = "Delete Graph"
        del.addEventListener("click", (evt) => {
            let parent = evt.target.parentNode
            let graph_id = parent.dataset.graph_id
            fetchDeleteBarGraph(graph_id)
            .then((r) => {
                parent.remove()
            })
        })
        newDiv.class = "bar_graph"
        newDiv.dataset.graph_id = graph.id
        newP.innerText = graph.title
        newP.addEventListener("click", () => {
            let ids = document.getElementById("user_id")
            let user_id = ids.dataset.user_id
            let data_id = ids.dataset.data_id
            let graph_id = newDiv.dataset.graph_id
            barGraphShowPage(user_id, data_id, graph_id)
        })
        newDiv.append(newP)
        newDiv.append(del)
        barDiv.append(newDiv)
    })
    lineGraphs.forEach((graph) => {
        let newDiv = document.createElement("div")
        let newP = document.createElement("p")
        let del = document.createElement("input")
        del.type = "submit"
        del.value = "Delete Graph"
        del.addEventListener("click", (evt) => {
            let parent = evt.target.parentNode
            let graph_id = parent.dataset.graph_id
            fetchDeleteLineGraph(graph_id)
            .then((r) => {
                parent.remove()
            })
        })
        newDiv.class = "line_graph"
        newDiv.dataset.graph_id = graph.id
        newP.innerText = graph.title
        newP.addEventListener("click", () => {
            let ids = document.getElementById("user_id")
            let user_id = ids.dataset.user_id
            let data_id = ids.dataset.data_id
            let graph_id = newDiv.dataset.graph_id
            lineGraphShowPage(user_id, data_id, graph_id)
        })
        newDiv.append(newP)
        newDiv.append(del)
        lineDiv.append(newDiv)
    })
    pieGraphs.forEach((graph) => {
        let newDiv = document.createElement("div")
        let newP = document.createElement("p")
        let del = document.createElement("input")
        del.type = "submit"
        del.value = "Delete Graph"
        del.addEventListener("click", (evt) => {
            let parent = evt.target.parentNode
            let graph_id = parent.dataset.graph_id
            fetchDeletePieGraph(graph_id)
            .then((r) => {
                parent.remove()
            })
        })
        newDiv.class = "pie_graph"
        newDiv.dataset.graph_id = graph.id
        newP.innerText = graph.title
        newP.addEventListener("click", () => {
            let ids = document.getElementById("user_id")
            let user_id = ids.dataset.user_id
            let data_id = ids.dataset.data_id
            let graph_id = newDiv.dataset.graph_id
            pieGraphShowPage(user_id, data_id, graph_id)
        })
        newDiv.append(newP)
        newDiv.append(del)
        pieDiv.append(newDiv)
    })
    graphsDiv.append(barDiv)
    graphsDiv.append(lineDiv)
    graphsDiv.append(pieDiv)
}

function addGraphForm(user, dataset, body){
    let h3 = document.createElement("h3")
    h3.innerText = "New Graph Form"
    let arr = ["Bar Graph", "Line Graph", "Pie Chart"]
    let newDiv = document.createElement("div")
    newDiv.id = "graph_form_div"
    newDiv.append(h3)
    let newSelect = document.createElement("select")
    newSelect.id = "graph_select"
    let optDef = document.createElement("option")
    optDef.selected = ""
    optDef.innerText = "Please Select" 
    newSelect.append(optDef)
    arr.forEach((graph) => {
        let opt = document.createElement("option")
        opt.innerText = graph
        newSelect.append(opt)
    })
    newSelect.addEventListener("change", (evt) => {
        createNewGraphHandler(evt, dataset)
    })

    newDiv.append(newSelect)
    body.append(newDiv)
}

function addTable(dataset, newH1){
    fetchDataset(dataset)
    .then((file_text) => {
        let table = generateTable(csvJSON(file_text))
        // insertAfter(table, newH1)
        document.querySelector("body").append(table)
    })
}

function createNewGraphHandler(evt, dataset){
    let selectBar = evt.target
    
    switch(selectBar.value){
        case "Bar Graph":
            renderChartForm(dataset, selectBar, "Bar")
            break;
        case "Line Graph":
            renderChartForm(dataset, selectBar, "Line")
            break;
        case "Pie Chart":
            renderChartForm(dataset, selectBar, "Pie")
            break;
        default:
    }
}

function renderChartForm(dataset, selectBar, chartType){
    fetchDataset(dataset)
    .then((ds_json) => {
        ds_json = csvJSON(ds_json)
        let form = document.getElementById("graph-gen")
        if(form){form.remove()}

        let newDiv = document.createElement("div")
        newDiv.id = "graph-gen"
        let newP = document.createElement("p")
        newP.innerText = `${chartType} Graph Specs:`
        newDiv.append(newP)
        selectBar.parentNode.insertBefore(newDiv, selectBar.nextSibling)

        let titleDiv = document.createElement("div")
        titleDiv.id = "title-div-center"
        let titleLab = document.createElement("label")
        titleLab.innerText = "Title: "
        titleLab.for = "graph-title"
        let title = document.createElement("input")
        title.type = "text"
        title.id = "graph-title"
        title.value = dataset.name
        titleDiv.append(titleLab)
        titleDiv.append(title)
        newDiv.append(titleDiv)

        genSelects("X-Axis", newDiv, ds_json)
        genSelects("Series-1", newDiv, ds_json)

        let sub = document.createElement("input")
        let del = document.createElement("input")
        let mkGraph = document.createElement("input")
        sub.type = "submit"
        del.type = "submit"
        mkGraph.type = "submit"
        sub.value = "New Series"
        del.value = "Remove Series"
        mkGraph.value = "Create Graph"
        sub.addEventListener("click", (evt) => {
            sub.remove()
            del.remove()
            mkGraph.remove()
            let count = document.querySelectorAll(".select-div").length
            genSelects(`Series-${count}`, newDiv, ds_json)
            if(chartType != "Pie"){newDiv.append(sub)}
            if(chartType != "Pie"){newDiv.append(del)}
            newDiv.append(mkGraph)
        })
        del.addEventListener("click", (evt) => {
            let selects = document.querySelectorAll(".select-div")
            let last = selects[selects.length-1]
            if (last.id != "X-Axis-select-div" && last.id != "Series-1-select-div"){
                last.remove()
            }
        })
        mkGraph.addEventListener("click", (evt) => {
            let titleInp = document.getElementById("graph-title")
            let selects = document.querySelectorAll(".select-div")
            let submition = {
                title: titleInp.value,
                numberOfSeries: selects.length-1
            }
            selects.forEach((block) => {
                let specs = block.querySelectorAll("select")
                let block_key = block.id.replace(/-/g, "_").replace(/_select_div/, "")
                submition[block_key] = []
                specs.forEach((spec) => {
                    let selOption = spec.options[spec.selectedIndex]
                    if (selOption.dataset.id){
                        submition[block_key].push(selOption.dataset.id)
                    } else {
                        submition[block_key].push(spec.value)
                    }
                })
            })
            if (chartType == "Bar"){
                fetchPersistBarGraph(dataset.id, submition)
                .then((newGraph) => {
                let user_id = document.getElementById("user_id").dataset.user_id
                let ds_id = document.getElementById("user_id").dataset.data_id
                fetchUser(user_id)
                .then((user) => {
                    let ds = user.datasets.find((dataset) => {
                        return dataset.id == newGraph.dataset_id
                    })
                    addGraphs(ds, document.getElementById("graphs_div"))
                })
            })
            } else if(chartType == "Line"){
                fetchPersistLineGraph(dataset.id, submition)
                .then((newGraph) => {
                let user_id = document.getElementById("user_id").dataset.user_id
                let ds_id = document.getElementById("user_id").dataset.data_id
                fetchUser(user_id)
                .then((user) => {
                    let ds = user.datasets.find((dataset) => {
                        return dataset.id == newGraph.dataset_id
                    })
                    addGraphs(ds, document.getElementById("graphs_div"))
                })
            })
            } else {
                fetchPersistPieGraph(dataset.id, submition)
                .then((newGraph) => {
                let user_id = document.getElementById("user_id").dataset.user_id
                let ds_id = document.getElementById("user_id").dataset.data_id
                fetchUser(user_id)
                .then((user) => {
                    let ds = user.datasets.find((dataset) => {
                        return dataset.id == newGraph.dataset_id
                    })
                    addGraphs(ds, document.getElementById("graphs_div"))
                })
            })
            }
        })
        if(chartType != "Pie"){newDiv.append(sub)}
        if(chartType != "Pie"){newDiv.append(del)}
        newDiv.append(mkGraph)
        

    })
}

function columnRowOptions(selectBox){
    let op1 = document.createElement("option")
    op1.innerText = "Column"
    let op2 = document.createElement("option")
    op2.innerText = "Row"
    selectBox.append(op1)
    selectBox.append(op2)
}

function genSelects(text, newDiv, ds_json){
    let selectDiv = document.createElement("div")
    selectDiv.id = `${text}-select-div`
    selectDiv.classList.add("select-div")
    let label = document.createElement("label")
    label.innerText = `${text}:`
    label.for = text
    selectDiv.append(label)

    let preferenceSelect = document.createElement("select")
    preferenceSelect.id = `${text}Pref`
    columnRowOptions(preferenceSelect)
    selectDiv.append(preferenceSelect)
    newDiv.append(selectDiv)
    preferenceSelect.addEventListener("change", (evt) => {
        genSeriesOptions(evt.target.value, preferenceSelect, ds_json, text)
    })
    genSeriesOptions("Column", preferenceSelect, ds_json, text)

}

function genSeriesOptions(column_or_row, selectBoxPref, ds_json, id){
    let dropbar = document.getElementById(`${id}`)
    if(dropbar){dropbar.remove()}
    let newSelect = document.createElement("select")
    newSelect.id = id
    let counter = 1
    if (column_or_row == "Column"){
        Object.keys(ds_json[0]).forEach((key) => {
            let op = document.createElement("option")
            op.innerText = `${counter}. ${key}`
            op.dataset.id = counter
            newSelect.append(op)
            counter = counter + 1
        })
    } else if(column_or_row == "Row"){
        for(let i = 0; i < ds_json.length-1; i++){
            let op = document.createElement("option")
            op.innerText = `Row ${counter}`
            op.dataset.id = counter
            newSelect.append(op)
            counter = counter + 1
        }
    } else {
        alert("ERROR")
    }
    insertAfter(newSelect, selectBoxPref)
}

