const fs = require('fs')

fs.readFile('./p3_data.txt', 'utf8', function(err, data) {
  let rows = data.split('\n')
  let wire1 = rows[0].split(',')
  let wire2 = rows[1].split(',')

  let wire1Coords = mapCoords(wire1)
  let wire2Coords = mapCoords(wire2)
  let matches = new Set()

  matches = [... wire1Coords.points.keys()].filter(point => wire2Coords.points.get(point))

  let closest = matches.reduce((acc, point) => {
    let sum = wire1Coords.points.get(point) + wire2Coords.points.get(point)
    return Math.min(acc, sum)
  }, Number.MAX_SAFE_INTEGER)

  console.log(closest)
})

function mapCoords(wire) {
  let allCoords = []
  let allPoints = new Map()
  let d = 0
  wire.forEach((item, index) => {
    if(index === 0) {
      let {coord, points, distance} = getCoords(item)
      d = distance
      allCoords[index] = coord
      allPoints = points
      return
    }

    let { coord, points, distance } = getCoords(item, allCoords[index-1], allPoints, d)
    d = distance
    allCoords[index] = coord
    allPoints = points
  })

  return { coords: allCoords, points: allPoints }
}

function getCoords(move, coord = [0, 0], points = new Map(), d = 1) {
  let direction = move[0]
  let num = Number(move.slice(1))
  let start

  switch(direction) {
    case 'L':
        start = coord[0]

        while(start !== coord[0] - num) {
          start--
          d++
          points.set([start - 1, coord[1]].join(','), d)
        }

        coord = [coord[0] - num, coord[1]]
        break;
    case 'R':
        start = coord[0]

        while(start !== coord[0] + num) {
          start++
          d++
          points.set([start + 1, coord[1]].join(','), d)
        }

        coord = [coord[0] + num, coord[1]]
        break;
    case 'U':
        start = coord[1]

        while(start !== coord[1] + num) {
          start++
          d++
          points.set([coord[0], start + 1].join(','), d)
        }

        coord = [coord[0], coord[1] + num]
        break;
    case 'D':
        start = coord[1]

        while(start !== coord[1] - num) {
          start--
          d++
          points.set([coord[0], start - 1].join(','), d)
        }

        coord = [coord[0], coord[1] - num]
        break;
    default:
  }

  return { coord, points, distance: d }
}