const fs = require('fs')
// './p6_data.txt'
fs.readFile('./test.txt', 'utf8', function(err, data) {
  let input = data.split('\n').filter(i => i)

  let map = {}

  let graph = input.reduce((acc, orbit) => {
    let [b, a] = orbit.split(')')
    acc[a] = b
    return acc
  }, {})

  let v = new Set()
  input.forEach(orbit => {
    let [b, a] = orbit.split(')')
    map[a] = [b]
    map[b] = [a]
    let curr = b
    while (curr) {
      curr = graph[curr]
      if(v.has(curr)) continue;
      if(curr) map[a].push(curr)
      map[curr] ? map[curr].push(a) : [a]
    }
    v.add(curr)
  })

  // part 2
  let start = 'YOU'
  let end = 'SAN'

  let Q = [[start, 0]]
  let visited = new Set()

  // console.log(map[start].length, map[end].length)
  let curr = start
  let steps = 0
  let min_steps = Number.MAX_SAFE_INTEGER

  while(curr) {
    curr = graph[curr]
    steps++
    console.log(curr)
    let tmp_steps = steps
    let curr1 = end
    while(curr1) {
      if(curr === curr1) {
        min_steps = Math.min(min_steps, tmp_steps)
        break;
      }
    }
  }

  console.log(steps, min_steps)
  //console.log(Object.keys(map).reduce((acc, item) => { return acc + map[item].length}, 0))
})
