
const chartColors = {
	blue: 'rgb(54, 162, 235)',
    grey: 'rgb(201, 203, 207)',
}

AchartColors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)'
]

const getColor = n => AchartColors[n % 6]

const color = Chart.helpers.color

var counter = 0
var done = false

const datasets = {
    get cats() {
        return scatterChartData.datasets.filter((a) => a.label.startsWith('cat'))
    },
    get unsorted() {
        return scatterChartData.datasets.find((a) => a.label == 'unsorted')
    },
    get centres() {
        return scatterChartData.datasets.find((a) => a.label == 'centres')
    },
    cat(n) {
        return scatterChartData.datasets.find((a) => a.label == 'cat'+n)
    },
    push(o) {
        return scatterChartData.datasets.push(o)
    }
}

const pointRadius = 6
var scatterChartData = {
    datasets: [
        {
            label: 'unsorted',
            pointRadius,
            borderColor: 'rgb(201, 203, 207)',
            backgroundColor: 'rgba(201, 203, 207, 0.1)',
            data: []
        },
        {
            label: 'centres',
            borderColor: 'rgb(54, 162, 235)',
            pointStyle: 'crossRot',
            pointRadius: 10,
            borderWidth: 4,
            data: []
        }
    ]
}
for (let i = 0; i < 4; i++) {
    datasets.push({
        label: 'cat'+i,
        pointRadius,
        borderColor: getColor(i),
        backgroundColor: color(getColor(i)).alpha(0.1).rgbString(),
        pointStyle: 'circle',
        data: []
    })
}

const getEcludDistance = function(x1,y1,x2,y2) {
    return Math.hypot((x1-x2), (y1-y2))
}

const randomizeData = function() {
    $('.datarow').remove()
    counter = 0
    done = false
    var cats = datasets.cats
    for (const cat of cats) {
        cat.data = []
    }
    var dataset = datasets.unsorted
    dataset.data = []
    window.myScatter.update()
    for (let i = 0; i < config.maxPoints; i++) {
        dataset.data.push({})
    }
    datasets.centres.data = [
        {x: 100, y: 100},
        {x: -100,y: 100},
        {x: 100,y: -100},
        {x: -100,y: -100}
    ]
    dataset.data = randomSet(config.numClusters, config.clusterFactor, config.translateFactor)
    window.myScatter.update()
}

const catData = function() {
    var cats = datasets.cats
    var unsorted = datasets.unsorted
    for (const cat of cats) {
        if (cat.data.length > 0) unsorted.data = []
    }
    for (const cat of cats) {
        unsorted.data = unsorted.data.concat(cat.data)
        cat.data = []
    }
    window.myScatter.update()
    var centres = datasets.centres
    while (unsorted.data.length > 0) {
        var point = unsorted.data.pop()
        var closest = 0
        var closestDist = getEcludDistance(point.x, point.y, centres.data[0].x, centres.data[0].y)
        centres.data.forEach((centre, index) => {
            var dist = getEcludDistance(point.x, point.y, centre.x, centre.y)
            if (dist < closestDist) {
                closestDist = dist
                closest = index
            }
            
        })
        var cat = datasets.cat(closest)
        cat.data.push(point)
    }
    window.myScatter.update()
}

const resetCentres = function() {
    var cats = datasets.cats
    var oldCentres = datasets.centres.data
    var newCentres = []
    if (done) {
        clearInterval(interval)
        return
    }
    for (const cat of cats) {
        var data = cat.data
        var totals = {x:0, y:0}
        for (const point of data) {
            totals.x += point.x
            totals.y += point.y
        }
        mean = {
            x: totals.x / data.length,
            y: totals.y / data.length
        }
        var index = cat.label.match(/[0-9]+/)[0]
        newCentres[index] = mean
    }
    var diffs = []

    for (let i = 0; i < oldCentres.length; i++) {
        var value = getEcludDistance(oldCentres[i].x, oldCentres[i].y, newCentres[i].x, newCentres[i].y)
        diffs[i] = value.toFixed(config.statPrecision)
    }

    done = true
    for (var item of diffs) {
        item = parseFloat(item)
        if (item !== 0 && item !== NaN) done = false
    }

    var row = $(document.createElement("tr"))
        .addClass('datarow')
        .append('<td>' + counter++ + '</td>')

    for (const n of diffs) {
        row.append($(document.createElement("td")).text(n))
    }

    $('#datatable').append(row)
    datasets.centres.data = newCentres
    window.myScatter.update()
}

const returnUnsorted = function() {
    var cats = scatterChartData.datasets.filter((a) => a.label.startsWith('cat'))
    var unsorted = scatterChartData.datasets.find((a) => a.label == 'unsorted')
    
    unsorted.data = []
    for (const cat of cats) {
        
        unsorted.data = unsorted.data.concat(cat.data)
        cat.data = []
    }

    window.myScatter.update()
}

$('#randomizeData').on('click', randomizeData)

$('#catData').on('click', catData)
$('#resetCentres').on('click', resetCentres)

$('#spam').on('click', () => {
    catData()
    resetCentres()
})

var interval
$('#start').on('click', () => {
    clearInterval(interval)
    randomizeData()
    var foo = 0
    interval = setInterval(() => {
        catData()
        resetCentres()
        console.log(foo++)
    }, 400)
})
$('#stop').on('click', () => {
    clearInterval(interval)
})

$(() => {
    var ctx = document.getElementById('graph').getContext('2d')
    window.myScatter = Chart.Scatter(ctx, {
        data: scatterChartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: false,
                text: 'Chart.js Scatter Chart'
            },
            tooltips: {
                enabled: false
            },
            
            scales: {
                yAxes: [{
                    ticks: {
                        min: -config.axisMagnitude,
                        max: config.axisMagnitude
                    }
                }],
                xAxes: [{
                    ticks: {
                        min: -config.axisMagnitude,
                        max: config.axisMagnitude
                    }
                }]
            }
        
        }
    })
})