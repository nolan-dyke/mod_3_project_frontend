const welcomeSection = document.getElementById('welcome')
const hatPatternButton = document.getElementById('hat-pattern-button')
const form = document.getElementById('hat-pattern-form')
const patternBox = document.getElementById('pattern-box')
const patternSpan = document.querySelector('.pattern')
const loginForm = document.getElementById('login')
const createUserForm = document.getElementById('create-new-user')
const patternList = document.getElementById('pattern-list')
const navbar = document.getElementById('navbar')
const saveButton = document.getElementById('save-button')

welcome()
function welcome() {
    form.style.display = 'none'
    patternBox.style.display = 'none'
    patternList.style.display = 'none'
    navbar.style.display = 'none'
    saveButton.style.display = 'none'
}

loginForm.addEventListener('submit', loginUser)
createUserForm.addEventListener('submit', createUser)

function loginUser(){
    event.preventDefault()
    formData = new FormData(loginForm)
    const username = formData.get('username')
    const password = formData.get('password')
    const user = {
        username: username,
        password: password
    }
    fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/JSON'},
        body: JSON.stringify(user)
    })
    .then(resp => resp.json())
    .then(response => handlePatterns(response))
    loginForm.reset()
}

function handlePatterns(response) {
    console.log(response)
    localStorage.setItem('token', response.token)
    displayPatterns(response.patterns)
}

function displayPatterns(patterns){
    welcomeSection.style.display = 'none'
    patternList.style.display = 'block'
    navbar.style.display = 'block'
    if(patterns.length == 0){
        const $li = document.createElement('li')
        $li.textContent = 'No patterns to display'
        patternList.append($li)
    } else {
        patterns.forEach(pattern => {
            displayPattern(pattern)
        })
    }
}

function displayPattern(pattern) {
    const $li = document.createElement('li')
    $li.innerHTML = pattern.content 
    patternList.append($li)
}

function createUser(){
    event.preventDefault()
    formData = new FormData(createUserForm)
    const username = formData.get('username')
    const password = formData.get('password')
    const user = {
        username: username,
        password: password
    }
    fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/JSON'},
        body: JSON.stringify(user)
    })
    .then(resp => resp.json())
    .then(response => {
        console.log(response)
        const pleaseLogIn = document.createElement('p')
        pleaseLogIn.textContent = 'Profile created. Please log in.'
        createUserForm.append(pleaseLogIn)
    })
    createUserForm.reset()
}

hatPatternButton.addEventListener('click', renderForm)

function renderForm(){
    patternList.style.display = 'none'
    form.style.display = 'block'
}

form.addEventListener('submit', createHatPattern)

function createHatPattern() {
    event.preventDefault()
    const formData = new FormData(form)
    const gauge = formData.get('gauge')
    const circumference = formData.get('circumference')
    const brimLength = formData.get('length_of_brim')
    const brimStyle = formData.get('brim_style')
    const bodyLength = formData.get('length_of_body')
    const bodyStyle = formData.get('body_style')
    let castOnStitches = (gauge * circumference)
    while ((castOnStitches % 4) !== 0){
        castOnStitches ++   
    }

    const hat = {
        gauge: gauge,
        circumference: circumference,
        brimLength: brimLength,
        brimStyle: brimStyle,
        bodyLength: bodyLength,
        bodyStyle: bodyStyle,
        stitches: castOnStitches
    }
    writePattern(hat)
    patternBox.style.display = 'block'
    saveButton.style.display = 'block'
    form.style.display = 'none'
    console.log(saveButton)
}

function writePattern(hat){
    const brimPattern = writeHatBrim(hat)
    const bodyPattern = writeHatBody(hat)
    const decreasePattern = writeHatDecrease(hat)
    patternBox.innerHTML = `<h2> Hat Pattern </h2> ${brimPattern} <br> ${bodyPattern} <br> ${decreasePattern}`
}

saveButton.addEventListener('click', savePattern)

function savePattern() {
    const type = 'hat'
    const content = patternBox.innerHTML 
    const pattern = {type: type, content: content}
    fetch('http://localhost:4000/patterns', {
        method: 'POST',
        headers: {'content-type': 'application/JSON', 'Authorization': `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify(pattern)
    }).then(resp => resp.json())
    .then(console.log)
}

function writeHatBrim(hat){
    const brimRows = (hat.gauge * hat.brimLength)
    let brimKnit = ''

    if (hat.brimStyle == 'stockinette'){
        brimKnit = 'Knit every stitch in the round'
    } else if (hat.brimStyle == 'one_by_one'){
        brimKnit = 'Knit one purl one all the way around the round'
    } else if (hat.brimStyle == 'one_by_two'){
        brimKnit = 'Knit one purl two all the way around the round'
    } else if (hat.brimStyle == 'two_by_two'){
        brimKnit = 'Knit two purl two all the way around the round'
    }
    const brimPattern = `<b> Brim: </b> Cast ${hat.stitches} stitches onto circular needles. ${brimKnit} for ${brimRows} rounds.`
    return brimPattern
}

function writeHatBody(hat) {
    let bodyKnit = ''
    if (hat.bodyStyle == 'stockinette') {
        bodyKnit = 'Knit every stitch in the round.'
    } else if (hat.bodyStyle == 'cables') {
        bodyKnit = 'Cable 4 back, purl 4. Repeat to end of round.'
    }
    const stitchesForBody = ((hat.bodyLength - 2) * hat.gauge)
    const bodyPattern = `<b> Body: </b> ${bodyKnit} Continue to knit each round in this way for ${stitchesForBody} rounds.`
    return bodyPattern
}

function writeHatDecrease(hat){
    let stitchesremaining = hat.stitches
    let decreases = []
    while (stitchesremaining > 4) {
        decreases.push(`Knit ${(stitchesremaining / 4) -2} stitches, then knit two together. Repeat three times to complete round.`)
        stitchesremaining -= 4
    }
    decreaseString = decreases.join(" ")
    const decreasePattern = `<b> Decreases: </b> ${decreaseString} ${stitchesremaining} stitches remaining. Break yarn and thread through remaining stitches. Weave in ends.`
    return decreasePattern
}