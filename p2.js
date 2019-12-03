const fs = require('fs')

fs.readFile('./ps1_data.txt', 'utf8', function(err, data) {
  let rows = data.split('\n')
  let sum = 0

  rows.forEach(row => {
    let num = Number(row)
    sum += calcFuel(num)
  })

  console.log("Sum:", sum)
})

function calcFuel(fuelMass, total = 0) {
  let mass = Math.floor(fuelMass / 3) - 2
  if(mass <= 0) return total

  return calcFuel(mass, total + mass)
}