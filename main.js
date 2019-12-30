function renderMainMenu(user, bod){
    let child = bod.lastElementChild
    while (child) {
        child.remove()
        child = bod.lastElementChild
    }

    let userHead = document.createElement("h1")
    let fileInput = document.createElement("input")
    let submit = document.createElement("input")

    userHead.innerText = `Welcome ${user.username.replace(user.username.charAt(0), user.username.charAt(0).toUpperCase())}`
    fileInput.type = "file"
    fileInput.accept = ".csv"
    fileInput.addEventListener("change", csvUploadedEvent)
    submit.type = "submit"
    submit.value = "save"
    submit.addEventListener("click", saveCSV)

    bod.append(userHead)
    bod.append(fileInput)
    bod.append(submit)
}

function saveCSV(evt){
    console.log("CSV not yet saved")
}

function csvUploadedEvent(evt) {
    let f = evt.target.files[0];
    let reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            let newCSV = csvJSON(e.target.result)
            generateTable(newCSV)
        };
    })(f);
    reader.readAsText(f);
}

//sourced from https://gist.github.com/iwek/7154578
function csvJSON(csv){
    csv = csv.replace(/"/g,"")
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

