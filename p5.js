
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
    1: { jump: 4, op: add },
    2: { jump: 4, op: multiply},
    3: { jump: 2, op: output},
    4: { jump: 2, op: input }
  }

  input[1] = noun
  input[2] = verb
  let head = 0

  while(head < input.length) {
    if(input[head] == 99) break
    // let code = input[head]

    let { jump, op } = opCodes[input[head]]
    let args = input.subarray(head+1, jump+1),
    if(op) {
      op( undefined, input)
      head+=jump
    }
    else {
      head++
    }
  }

  return input[0]
}

function add(params, modes, arr) {
  let args = params.map((p, i) => Number(getParam(p, modes[i], arr)))
  arr[output] = args.reduce((acc, v) => (acc + v), 0)
}

function multiply(params, modes, arr) {
  let args = params.map((p, i) => Number(getParam(p, mode[i], arr)))
  arr[output] = args.reduce((acc, v) => (acc * v), 0)
}

function input(_params, modes, arr) {
  let arg = arr[1]
  arr[output] = args
}

function output(params, _modes, arr) {
  arr[0] = arr[params[0]]
}

function getParam(v, mode, arr) {
  switch(mode) {
    case 1:
      return arr[v]
      break;
    case 2:
      return v
      break;
  }
}
