
const fs = require('fs')
//'./p2_data.txt'
fs.readFile('./p2_data.txt', 'utf8', function(err, data) {
  let input = data.split(',').map(Number)

  for(let i = 0; i <= 99; i++) {
    for(let j = 0; j <= 99; j++) {
      let result = run_program([... input], i, j)
      if(result == 19690720) {
        console.log(100*i+j)
      }
    }
  }
})

function run_program(input, noun, verb) {
  let opCodes = {
    1: add,
    2: multiply,
  }

  input[1] = noun
  input[2] = verb
  let head = 0

  while(head < input.length) {
    if(input[head] == 99) break
    let op = opCodes[input[head]]

    if(op) {
      op(input[head+1], input[head+2], input[head+3], input)
      head+=4
    }
    else {
      head++
    }
  }

  return input[0]
}

function add(a, b, p, arr) {
  arr[p] = Number(arr[a])+Number(arr[b])
}

function multiply(a, b, p, arr) {
  arr[p] = Number(arr[a])*Number(arr[b])
}

function halt(arr) {
  return arr
}