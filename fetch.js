function fetchUser(id){
    return fetch(`http://localhost:3000/users/${id}`)
    .then(r => r.json())
}