const fs = require('fs')

fs.readFile('./ps1_data.txt', 'utf8', function(err, data) {
  let rows = data.split('\n')
  let sum = 0

  rows.forEach(row => {
    let num = Number(row)
    sum += Math.floor(num / 3) - 2
  })

  console.log("Sum:", sum)
})