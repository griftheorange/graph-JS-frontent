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
    hidden.display = "none"
    hidden.id = "user_id"
    body.append(hidden)
    
    fetchUser(user_id)
    .then((user) => {
        let dataset = user.datasets.find((dataset) => {
            return dataset.id == ds_id
        })
        
        let newH1 = document.createElement("h1")
        newH1.innerText = `${user.username}: ${dataset.name}`
        body.append(newH1)
        addGraphForm(user, dataset, body)
        addTable(dataset)
    })
}

function addGraphForm(user, dataset, body){
    let arr = ["Bar Graph", "Line Graph", "Pie Chart"]
    let newDiv = document.createElement("div")
    newDiv.id = "graph_form_div"
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

function addTable(dataset){
    fetchDataset(dataset)
    .then((file_text) => {
        generateTable(csvJSON(file_text))
    })
}

function createNewGraphHandler(evt, dataset){
    let selectBar = evt.target
    
    switch(selectBar.value){
        case "Bar Graph":
            renderBarForm(dataset, selectBar)
            break;
        case "Line Graph":
            renderLineForm(dataset, selectBar)
            break;
        case "Pie Chart":
            renderPieForm(dataset, selectBar)
            break;
        default:
    }
}

function renderBarForm(dataset, selectBar){
    fetchDataset(dataset)
    .then((ds_json) => {
        ds_json = csvJSON(ds_json)
        let form = document.getElementById("graph-gen")
        if(form){form.remove()}

        let newDiv = document.createElement("div")
        newDiv.id = "graph-gen"
        let newP = document.createElement("p")
        newP.innerText = "Bar Graph Specs:"
        newDiv.append(newP)
        selectBar.parentNode.insertBefore(newDiv, selectBar.nextSibling)

        genSelects("X-Axis", newDiv, ds_json)
        genSelects("Series-1", newDiv, ds_json)

        let sub = document.createElement("input")
        let del = document.createElement("input")
        sub.type = "submit"
        del.type = "submit"
        sub.value = "New Series"
        del.value = "Remove Series"
        sub.addEventListener("click", (evt) => {
            sub.remove()
            del.remove()
            let count = document.querySelectorAll(".select-div").length
            genSelects(`Series-${count}`, newDiv, ds_json)
            newDiv.append(sub)
            newDiv.append(del)
        })
        del.addEventListener("click", (evt) => {
            let selects = document.querySelectorAll(".select-div")
            let last = selects[selects.length-1]
            if (last.id != "X-Axis-select-div" && last.id != "Series-1-select-div"){
                last.remove()
            }
        })
        newDiv.append(sub)
        newDiv.append(del)
        

    })
}

function renderLineForm(dataset, submit){
    console.log("Line Form")
}

function renderPieForm(dataset, submit){
    console.log("Pie Form")
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
            newSelect.append(op)
            counter = counter + 1
        })
    } else if(column_or_row == "Row"){
        for(let i = 0; i < ds_json.length-1; i++){
            let op = document.createElement("option")
            op.innerText = `Row ${counter}`
            newSelect.append(op)
            counter = counter + 1
        }
    } else {
        alert("ERROR")
    }
    insertAfter(newSelect, selectBoxPref)
}