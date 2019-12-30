function renderMainMenu(user, bod){
    let child = bod.lastElementChild
    while (child) {
        child.remove()
        child = bod.lastElementChild
    }

    let userHead = document.createElement("h1")
    let fileInput = document.createElement("input")

    userHead.innerText = `Welcome ${user.username.replace(user.username.charAt(0), user.username.charAt(0).toUpperCase())}`
    fileInput.type = "file"

    bod.append(userHead)
    bod.append(fileInput)
}