function fetchUser(id){
    return fetch(`http://localhost:3000/users/${id}`)
    .then(r => r.json())
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