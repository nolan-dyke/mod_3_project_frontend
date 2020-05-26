const form = document.getElementById('hat-pattern-form')
const patternBox = document.querySelector('.pattern')

form.addEventListener('submit', createPattern)

function createPattern() {
    event.preventDefault()
    const formData = new FormData(form)
    const gauge = formData.get('gauge')
    const circumference = formData.get('circumference')
    const brimLength = formData.get('length_of_brim')
    const brimStyle = formData.get('brim_style')
    const bodyLength = formData.get('length_of_body')
    const bodyStyle = formData.get('body_style')
    const hat = {
        gauge: gauge,
        circumference: circumference,
        brimLength: brimLength,
        brimStyle: brimStyle,
        bodyLength: bodyLength,
        bodyStyle: bodyStyle
    }
    writePattern(hat)
}

function writePattern(hat){
    stitchesForCir = (hat.gauge * hat.circumference)
    let brimKnit = ''
    while ((stitchesForCir % 4) !== 0){
        stitchesForCir ++
    }
    if (hat.brimStyle == 'stockinette'){
        brimKnit = 'Knit'
    } else if (hat.brimStyle == 'one_by_one'){
        brimKnit = 'Knit one purl one'
    } else if (hat.brimStyle == 'one_by_two'){
        brimKnit = 'Knit one purl two'
    } else if (hat.brimStyle == 'two_by_two'){
        brimKnit = 'Knit two purl tow'
    }
    const brimPattern = `<b> Brim: </b> Cast ${stitchesForCir} stitches onto circular needles. ${brimKnit} for ${hat.brimLength} inches.`
    patternBox.innerHTML = `${brimPattern}`
}