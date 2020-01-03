function renderMainMenu(user, bod){

    let child = bod.lastElementChild
    while (child) {
        child.remove()
        child = bod.lastElementChild
    }
    renderTopBar(user, bod)
    let userHead = document.createElement("h1")
    let fileInput = document.createElement("input")
    let submit = document.createElement("input")
    let dsDiv = document.createElement("div")
    dsDiv.id = "dataset_div"

    userHead.innerText = `Welcome ${user.username.replace(user.username.charAt(0), user.username.charAt(0).toUpperCase())}`
    userHead.dataset.user_id = user.id
    fileInput.type = "file"
    fileInput.accept = ".csv"
    fileInput.addEventListener("change", csvUploadedEvent)
    submit.type = "submit"
    submit.value = "save"
    submit.addEventListener("click", saveCSV)

    bod.append(userHead)
    bod.append(fileInput)
    bod.append(submit)
    bod.append(dsDiv)
    renderDatasets()
}

function renderDatasets(){
    let user = getUser()
    user.then((user) => {
        let dsDiv = getDsDiv()
        let child = dsDiv.lastElementChild
        while(child) {
            child.remove()
            child = dsDiv.lastElementChild
        }
        user["datasets"].forEach((ds) => {
            let newDs = document.createElement("div")
            let newP = document.createElement("p")
            let deleteButt = document.createElement("input")
            deleteButt.type = "submit"
            deleteButt.value = "Delete CSV"
            deleteButt.addEventListener("click", deleteCSV)
            newP.innerText = `${ds.name}`
            newP.dataset.ds_id = ds.id
            newDs.dataset.ds_id = ds.id
            newDs.append(newP)
            newDs.append(deleteButt)
            dsDiv.append(newDs)
            newP.addEventListener("click", renderDs)
        })
    })
}

function renderDs(evt){
    renderDsPage(evt.target.dataset.ds_id)
}

function deleteCSV(evt){
    let parentDiv = evt.target.parentNode
    fetch(`http://localhost:3000/datasets/${parentDiv.dataset.ds_id}`, {
        method: "DELETE"
    })
    .then(r => r.json())
    .then((response) => {
        if (response["id"]){
            parentDiv.remove()
        }
    })
}

function saveCSV(evt){
    let file = document.querySelector("input").files[0]
    let formData = new FormData();
    formData.append('file', file);
    formData.append('user', document.querySelector("h1").dataset.user_id)
    let options = {
        method: 'POST',
        body: formData
      }
    fetch("http://localhost:3000/datasets", options)
    .then(r => r.json())
    .then((response) => {
        renderDatasets()
    })
}

function csvUploadedEvent(evt) {
    let t = document.getElementById("tableDiv")
    if (t){t.remove()}
    let f = evt.target.files[0];
    let reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            let newCSV = csvJSON(e.target.result)
            document.querySelector("body").append(generateTable(newCSV))
        };
    })(f);
    reader.readAsText(f);
}

//sourced from https://gist.github.com/iwek/7154578
function csvJSON(csv){
    csv = csv.replace(/"/g, "").replace(/,+/g, ",").replace(/\$/g, "")
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(",");

    for(let i=1;i<lines.length;i++){
        let obj = {};
        let currentline=lines[i].split(",");
        for(let j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

function generateTable(json){
    let bod = document.querySelector("body")
    let newDiv = document.createElement("div")
    let newTable = document.createElement("table")
    let headerRow = document.createElement("tr")
    let headers = ["Row Number"]
    for (let key in json[0]){
        headers.push(key)
    }
    
    newDiv.id = "tableDiv"

    let count = 0
    headers.forEach((header) => {
        let newTh = document.createElement("th")
        header == "Row Number" ? newTh.innerText = `${header}` : newTh.innerText = `${count} ${header}`
        count++
        headerRow.append(newTh)
    })
    newTable.append(headerRow)
    newDiv.append(newTable)

    count = 1
    for(let i = 0; i < json.length-1; i++){
        let newTr = document.createElement("tr")
        headers.forEach((header) => {
            let newTd = document.createElement("td")
            header == "Row Number" ? newTd.innerText = count : newTd.innerText = json[i][header]
            newTr.append(newTd)
        })
        newTable.append(newTr)
        count += 1
    }

    return newDiv
}

function getUser(){
    let user_id = document.querySelector("h1").dataset.user_id
    return fetch(`http://localhost:3000/users/${user_id}`)
    .then(r => r.json())
}

function getDsDiv(){
    return document.getElementById("dataset_div")
}