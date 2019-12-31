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
        addTable(user, dataset)
    })
}

function addTable(user, dataset){
    
}