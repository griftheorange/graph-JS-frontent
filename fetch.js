function fetchUser(id){
    return fetch(`http://localhost:3000/users/${id}`)
    .then(r => r.json())
}

function fetchGraph(id){
    return fetch(`http://localhost:3000/bar_graphs/${id}`)
    .then(r => r.json())
    .then((graph) => {
        graph.flattenedSeries = JSON.parse(graph.flattenedSeries)
        graph.xAxis = JSON.parse(graph.xAxis)
        return graph
    })
}

function fetchDeleteBarGraph(graph_id){
    return fetch(`http://localhost:3000/bar_graphs/${graph_id}`, {
        method: "DELETE"
    })
}

function fetchGriff(){
    return fetch("http://localhost:3000/users")
    .then(r => r.json())
    .then((users) => {
        return users.find((user) => {
            return user.username == "griff"
        })
    })
}

function fetchDataset(dataset){
    return fetch(dataset.csv_url)
    .then(r => r.blob())
    .then(r => r.text())
}

function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode);
}

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
    newDiv.append(main)
    newDiv.append(log)
    body.append(newDiv)
}