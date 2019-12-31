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
    let newSub = document.createElement("input")
    newSub.type = "submit"
    newSub.value = "New Graph"
    newSub.addEventListener("click", (evt) => {
        createNewGraphHandler(evt, dataset)
    })

    newDiv.append(newSelect)
    newDiv.append(newSub)
    body.append(newDiv)
}

function addTable(dataset){
    fetchDataset(dataset)
    .then((file_text) => {
        generateTable(csvJSON(file_text))
    })
}

function createNewGraphHandler(evt, dataset){
    let selectBar = evt.target.parentNode.querySelector("select")
    let submit = evt.target.parentNode.querySelector("input")

    switch(selectBar.value){
        case "Bar Graph":
            renderBarForm(dataset, submit)
            break;
        case "Line Graph":
            renderLineForm(dataset, submit)
            break;
        case "Pie Chart":
            renderPieForm(dataset, submit)
            break;
        default:
    }
}

function renderBarForm(dataset, submit){
    let form = document.getElementById("graph-gen")
    if(form){form.remove()}

    let newDiv = document.createElement("div")
    newDiv.id = "graph-gen"
    let newP = document.createElement("p")
    newP.innerText = "Bar Graph Specs"
    newDiv.append(newP)
    submit.parentNode.insertBefore(newDiv, submit.nextSibling)
}

function renderLineForm(dataset, submit){
    console.log("Line Form")
}

function renderPieForm(dataset, submit){
    console.log("Pie Form")
}