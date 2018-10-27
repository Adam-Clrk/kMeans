
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

// radius of point markers, irrelevant to clustering
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

for (let i = 0; i < config.numCentres; i++) {
    datasets.push({
        label: 'cat'+i,
        pointRadius,
        borderColor: getColor(i),
        backgroundColor: Chart.helpers.color(getColor(i))
            .alpha(0.1)
            .rgbString(),
        pointStyle: 'circle',
        data: []
    })
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
            title: { display: false },
            tooltips: { enabled: false },
            
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