/* get a random number, with Gaussian/normal distribution */
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num
}

/**
 * Generate a set of coordinates, in clusters of normal distribution. These clusters are also arranged in a cluster.
 * @param {Number} maxPoints total max size of the set (the set could be as small as (maxPoints - numClusters)) 
 * @param {Number} numClusters number of clusters to be created
 * @param {Number} clusterFactor dispersion coefficient for the points of a cluster
 * @param {Number} translateFactor dispersion coefficient for clusters
 * @returns {Array<{x: Number, y: Number}>} set of 2-dimensional coordinates
 */
function randomSet(maxPoints, numClusters, clusterFactor, translateFactor) {
    var set = []
    var pointsPerCluster = Math.floor(maxPoints / numClusters)
    for (let i = 0; i < numClusters; i++) {
        var translate = {
            x: (randn_bm() - 0.5) * 2 * translateFactor,
            y: (randn_bm() - 0.5) * 2 * translateFactor
        }
        for (let ii = 0; ii < pointsPerCluster; ii++) {
            set.push({
                x: translate.x + ((randn_bm() - 0.5) * 2 * clusterFactor),
                y: translate.y + ((randn_bm() - 0.5) * 2 * clusterFactor)
            })
        }
    }
    return set
}

/**
 * Get the Ecludian distance between two points in 2-dimensional space
 * @param {Number} x1 1st x coordinate
 * @param {Number} y1 1st y coordinate
 * @param {Number} x2 2nd x coordinate
 * @param {Number} y2 2nd y coordinate
 * @returns {Number} Euclidean distance
 */
const getEuclideanDistance = function(x1,y1,x2,y2) {
    return Math.hypot((x1-x2), (y1-y2))
}


/* colors (colours) */
const AchartColors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)'
]

/**
 * Get a colour from a selection using seed n
 * @param {Number} n 
 */
const getColor = n => AchartColors[n % AchartColors.length]
