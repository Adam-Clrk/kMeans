

var counter = 0
var done = false

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
    dataset.data = randomSet(config.maxPoints, config.numClusters, config.clusterFactor, config.translateFactor)
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
        var closestDist = getEuclideanDistance(point.x, point.y, centres.data[0].x, centres.data[0].y)
        centres.data.forEach((centre, index) => {
            var dist = getEuclideanDistance(point.x, point.y, centre.x, centre.y)
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
        var value = getEuclideanDistance(oldCentres[i].x, oldCentres[i].y, newCentres[i].x, newCentres[i].y)
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