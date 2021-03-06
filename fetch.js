//gets user by id
function fetchUser(id){
    return fetch(`http://localhost:3000/users/${id}`)
    .then(r => r.json())
}

//creates user by username and password
function fetchCreateUser(username, pass){
    return fetch(`http://localhost:3000/users`, {
        method: "POST",
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify({
            username: username,
            password: pass
        })
    }).then(r => r.json())
}

//gets bar graph specs by id
function fetchGraph(id){
    return fetch(`http://localhost:3000/bar_graphs/${id}`)
    .then(r => r.json())
    .then((graph) => {
        graph.flattenedSeries = JSON.parse(graph.flattenedSeries)
        graph.xAxis = JSON.parse(graph.xAxis)
        return graph
    })
}

//gets line graph specs by id
function fetchLineGraph(id){
    return fetch(`http://localhost:3000/line_graphs/${id}`)
    .then(r => r.json())
    .then((graph) => {
        graph.flattenedSeries = JSON.parse(graph.flattenedSeries)
        graph.xAxis = JSON.parse(graph.xAxis)
        return graph
    })
}

//gets pie graph specs by id
function fetchPieGraph(id){
    return fetch(`http://localhost:3000/pie_graphs/${id}`)
    .then(r => r.json())
    .then((graph) => {
        graph.flattenedSeries = JSON.parse(graph.flattenedSeries)
        graph.xAxis = JSON.parse(graph.xAxis)
        return graph
    })
}

//following three delete respective graphs by id

function fetchDeleteBarGraph(graph_id){
    return fetch(`http://localhost:3000/bar_graphs/${graph_id}`, {
        method: "DELETE"
    })
}

function fetchDeleteLineGraph(graph_id){
    return fetch(`http://localhost:3000/line_graphs/${graph_id}`, {
        method: "DELETE"
    })
}

function fetchDeletePieGraph(graph_id){
    return fetch(`http://localhost:3000/pie_graphs/${graph_id}`, {
        method: "DELETE"
    })
}

//fetches seeded user for testing
function fetchGriff(){
    return fetch("http://localhost:3000/users")
    .then(r => r.json())
    .then((users) => {
        return users.find((user) => {
            return user.username == "griff"
        })
    })
}

//fetches dataset from cloudinary by URL
function fetchDataset(dataset){
    return fetch(dataset.csv_url)
    .then(r => r.blob())
    .then(r => r.text())
}

//following two outsource insertion functions to make DOM manipulation easier in other files 
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode);
}

//following three save new graphs to backend
function fetchPersistBarGraph(ds_id, submission){
    submission["dataset_id"] = ds_id
    return fetch("http://localhost:3000/bar_graphs", {
        method: "POST",
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify(submission)
    })
    .then(r => r.json())
}

function fetchPersistLineGraph(ds_id, submission){
    submission["dataset_id"] = ds_id
    return fetch("http://localhost:3000/line_graphs", {
        method: "POST",
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify(submission)
    })
    .then(r => r.json())
}

function fetchPersistPieGraph(ds_id, submission){
    submission["dataset_id"] = ds_id
    return fetch("http://localhost:3000/pie_graphs", {
        method: "POST",
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify(submission)
    })
    .then(r => r.json())
}

//updates graphs descriptions on backend 
function fetchUpdateGraphDescription(value, id, chartType){
    return fetch(`http://localhost:3000/${chartType.toLowerCase()}_graphs/${id}`, {
        method: "PATCH",
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify({
            description: value
        })
    })
}

//renders the navbar on all pages
function renderTopBar(user, body){
    let newDiv = document.createElement("div")
    newDiv.id = "topbar"
    let main = document.createElement("p")
    let log = document.createElement("p")
    main.innerText = "Main Menu"
    log.innerText = "Logout"
    main.addEventListener("click", (evt) => {
        renderMainMenu(user, body)
    })
    log.addEventListener("click", (evt) => {
        constructMain()
    })
    newDiv.append(log)
    newDiv.append(main)
    body.append(newDiv)
}