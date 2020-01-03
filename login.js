    let bod = document.querySelector("body")
    // constructMain()
    // loggedInTest()
    // datasetTest(11)
    barGraphShowPage(9, 29, 100)

    function datasetTest(ds_id){
        let newH1 = document.createElement("h1")
        newH1.dataset.user_id = 9
        bod.append(newH1)
        renderDsPage(ds_id)
    }

    function loggedInTest(){
        fetchGriff()
        .then((griff) => {
            renderMainMenu(griff, bod)
        })
    }
   
    function constructMain(){
        let body = document.querySelector("body")
        let child = body.lastElementChild
        while(child){
            child.remove()
            child = body.lastElementChild
        }

        let newH1 = document.createElement("h1")
        let username = document.createElement("h3")
        let password = document.createElement("h3")
        let log = document.createElement("h4")
        let cre = document.createElement("h4")

        newH1.innerText = "graphJS"
        username.innerText = "Username"
        username.id = "username_text"
        password.innerText = "Password"
        password.id = "password_text"
        log.innerText = "Login"
        log.addEventListener("click", loginClick)
        cre.innerText = "Create Account"
        cre.addEventListener("click", createClick)

        bod.append(newH1)
        bod.append(username)
        bod.append(password)
        bod.append(log)
        bod.append(cre)
    }

    function loginClick(evt){
        logMenuClickEventHandler(evt, "login")
    }

    function createClick(evt){
        logMenuClickEventHandler(evt, "create")
    }

    function logMenuClickEventHandler(evt, buttonType){
        let input = document.querySelector("input")
        while (input){
            input.remove()
            input = document.querySelector("input")
        }
        let user = document.getElementById("username_text")
        let pass = document.getElementById("password_text")
        let tf_1 = document.createElement("input")
        tf_1.id = `username_${buttonType}`
        let tf_2 = document.createElement("input")
        tf_2.id = `password_${buttonType}`
        let submit = document.createElement("input")
        submit.type = "submit"
        submit.value = "Submit"
        submit.addEventListener("click", evt => submitClickEventHandler(evt, tf_1, tf_2))
        
        insertAfter(tf_1, user)
        insertAfter(submit, pass)
        insertAfter(tf_2, pass)
    }

    function submitClickEventHandler(evt, tf_1, tf_2){
        let userInput = tf_1.value
        let passInput = tf_2.value 
        fetch("http://localhost:3000/users")
        .then(r => r.json())
        .then((users) => {
            let found = users.find((user) => {
                return user.username == userInput
            })
            if(found && tf_1.id == "username_login"){
                if(found.password == passInput){
                    renderMainMenu(found, bod)
                } else {
                    printLogError("No username matching that password")
                }
            } else if(!found && tf_1.id == "username_create" && passInput != ""){
                console.log("successful create")
            } else {            
                printLogError("Incorrect input")
            }
        })
    }

    function printLogError(str){
        console.log(str)
    }