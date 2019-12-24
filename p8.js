const fs = require('fs')


fs.readFile('./p8_data.txt', 'utf8', function(err, data) {
  main(data.trim().split(''))
})

function main(input) {
  const cols = 25
  const rows = 6

  let layers = []
  let currLayer = 0
  let zeroCounts = []
  let cl = 0

  for(let i = 0; i < input.length; i += cols) {
    if(!Array.isArray(layers[currLayer])) layers[currLayer] = []

    for(let j = i; j < i+cols; j++) {
      if(!Array.isArray(layers[currLayer][cl])) layers[currLayer][cl] = []
      layers[currLayer][cl].push(input[j])

      if(input[j] == 0) {
        if(!zeroCounts[currLayer]) zeroCounts[currLayer] = 0
        zeroCounts[currLayer]++
      }
    }

    cl++
    if(cl % rows === 0) {
      cl = 0
      currLayer++
    }
  }

  console.log(layers[0].length)


  let arrRow = new Array(cols).fill(2)
  let answer = new Array(rows).fill().map(l => [... arrRow])

  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      let k = 0
      try {
        while(k < layers.length && layers[k][i][j] == 2) {
          k++
        }
        answer[i][j] = layers[k][i][j]
      } catch(e) {
        console.log(layers[k].length, k, i, j, layers.length, e)
      }


    }
  }

    console.log(Array(25).fill('+').join('+'))
    answer.forEach((row) => {
      let r = row.map(i => {
        if(i == 0) return ' '
        if(i == 1) return 'H'
      })
      console.log(r.join(' '))
    })
    console.log(Array(25).fill('-').join('-'))
  // console.log(answer)

  console.log(layers[1].length)
  // let minCount = Infinity
  // let minZeroLayerIndex;
  // zeroCounts.forEach((count, i) => {
  //   if(minCount > count) {
  //     minZeroLayerIndex = i
  //     minCount = count
  //   }
  // })

  // let ones = 0
  // let twos = 0
  // layers[minZeroLayerIndex].forEach(l => {
  //   l.forEach(v => {
  //     if (v == '1') ones++
  //     if (v == '2') twos++
  //   })
  // })

  //console.log(ones * twos)
 // console.log(layers[0].length, layers[0])
}
