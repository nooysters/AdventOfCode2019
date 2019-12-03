const fs = require('fs')

fs.readFile('./p3_data.txt', 'utf8', function(err, data) {
  let rows = data.split('\n')
  let wire1 = rows[0].split(',')
  let wire2 = rows[1].split(',')

  let wire1Coords = mapCoords(wire1)
  let wire2Coords = mapCoords(wire2)
  let matches = new Set()

  matches = [... wire1Coords.points.values()].filter(point => wire2Coords.points.has(point))

  let closest = matches.reduce((acc, point) => {
    let p = point.split(',').map(Number)
    let sum = Math.abs(p[0]) + Math.abs(p[1])
    return Math.min(acc, sum)
  }, Number.MAX_SAFE_INTEGER)

  console.log(closest)
})

function mapCoords(wire) {
  let allCoords = []
  let allPoints = new Set()

  wire.forEach((item, index) => {
    if(index === 0) {
      let {coord, points} = getCoords(item)
      allCoords[index] = coord
      allPoints = points
      return
    }

    let { coord, points } = getCoords(item, allCoords[index-1], allPoints)
    allCoords[index] = coord, points
  })

  return { coords: allCoords, points: allPoints }
}

function getCoords(move, coord = [0, 0], points = new Set()) {
  let direction = move[0]
  let num = Number(move.slice(1))
  let start

  switch(direction) {
    case 'L':
        start = coord[0]

        while(start !== coord[0] - num) {
          start--
          points.add([start - 1, coord[1]].join(','))
        }

        coord = [coord[0] - num, coord[1]]
        break;
    case 'R':
        start = coord[0]

        while(start !== coord[0] + num) {
          start++
          points.add([start + 1, coord[1]].join(','))
        }

        coord = [coord[0] + num, coord[1]]
        break;
    case 'U':
        start = coord[1]

        while(start !== coord[1] + num) {
          start++
          points.add([coord[0], start + 1].join(','))
        }

        coord = [coord[0], coord[1] + num]
        break;
    case 'D':
        start = coord[1]

        while(start !== coord[1] - num) {
          start--
          points.add([coord[0], start - 1].join(','))
        }

        coord = [coord[0], coord[1] - num]
        break;
    default:
  }

  return { coord, points }
}