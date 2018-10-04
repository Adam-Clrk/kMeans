
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num
}

function randomSet(n, clusterFactor, translateFactor) {
    var set = []
    var pointsPerCluster = Math.floor(config.maxPoints / n)
    for (let i = 0; i < n; i++) {
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
