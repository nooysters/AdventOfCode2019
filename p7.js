const fs = require('fs')
const readline = require('readline');
const DEBUG_MODE = false

/**
 * Read the test input and execute program.
 */

class IO {
  constructor() {
    this.data = []
  }

  write(value) {
    this.data.push(value)
  }

  read() {
    return this.data.shift()
  }
}

class Program {
  constructor({ tape, stdIn }) {
    this.tape = [...tape]
    this.head = 0
    this.output = new IO()
    this.input = stdIn
    this.tapeLength = tape.length
  }

  incrementHead(n = 1) {
    this.head = this.head + n
    return this.head
  }

  getHead() {
    return this.head
  }

  setHeadLocation(index) {
    this.head = index
    return this.tape[this.head]
  }

  readCurrentValue() {
    return this.tape[this.head]
  }

  getParams(number) {
    let nextIndex = this.head + 1
    return this.tape.slice(nextIndex, nextIndex + number)
  }

  readValueAt(index) { return this.tape[index] }

  setValueAt(index, value) { return this.tape[index] = value }

  readInput() {
    return this.input.read()
  }

  writeOutput(value) {
    return this.output.write(value)
  }

  readOutput() {
    return this.output.read()
  }
}

/**
 * Takes an array of instructions and executes them.
 *
 * @param {array} instructions
 */
const execute = (instructions, stdIn) => {
  const program = new Program({ tape: instructions, stdIn })

  while(program.getHead() < program.tapeLength) {
    let value = program.readCurrentValue()
    if(value == 99) break

    if(isInstruction(value)) {
      parseInstruction(program)
    }
    else {
      program.incrementHead()
    }
  }

  return program
}

// Instruction Helpers.

function isInstruction(value = -1) {
  let code = Number(`${value}`.slice(-2))
  let validMode = `00${value}`.slice(0, -2).split('').reduce(
                                (acc, v) => (v == 1 || v == 0) && acc, true
                              )
  return [1, 2, 3, 4, 5, 6, 7, 8].includes(code) && validMode
}

function parseInstruction(program) {
  const { opCode, modes } = getOpMode(program.readCurrentValue())
  const op = getOperation(opCode) || {}
  if (DEBUG_MODE) console.log("Parsing Instruction", opCode, 'value,', program.readCurrentValue(), 'head:', program.getHead())
  op({ modes }, program)
}

function getOperation(opCode) {
  let opCodes = {
    1: add,
    2: multiply,
    3: input,
    4: output,
    5: jumpIfTrue,
    6: jumpIfFalse,
    7: lessThan,
    8: equals
  }

  return opCodes[Number(opCode)]
}

function getOpMode(instruction) {
  return {
    opCode: Number(`0${instruction}`.slice(-2)),
    modes: `0000${instruction}`.slice(-5, -2).split('').reverse(),
  }
}

// Operations.
function add({ modes }, program) {
  const args = program.getParams(3)
  let output = args.pop()
  let [ a, b ] = mapArgs(args, modes, program)

  program.setValueAt(output, a + b)
  program.incrementHead(4)

  if (DEBUG_MODE) console.log("add", args, modes, program.readValueAt(output),':', a, b, output)
}

function multiply({ modes }, program) {
  const args = program.getParams(3)
  let output = args.pop()
  let [ a, b ] = mapArgs(args, modes, program)

  program.setValueAt(output, a * b)
  program.incrementHead(4)

  if (DEBUG_MODE) console.log("multiply", modes)
}

function input({}, program) {
  const input = program.readInput()
  program.setValueAt(program.getParams(1), input)
  program.incrementHead(2)
  if (DEBUG_MODE) console.log('input', input, "head:", program.getHead())
}

function output({}, program) {
  let value = program.readValueAt(program.getParams(1))
  program.writeOutput(value)
  program.incrementHead(2)
}

function jumpIfTrue({ modes }, program) {
  const args = program.getParams(3)
  let [ a, b ] = mapArgs(args, modes, program)

  if(a != 0) program.setHeadLocation(b)
  else program.incrementHead()
}

function jumpIfFalse({ modes }, program) {
  const args = program.getParams(3)
  let [ a, b ] = mapArgs(args, modes, program)

  if(a == 0) program.setHeadLocation(b)
  else program.incrementHead()
}

function lessThan({ modes }, program) {
  const args = program.getParams(3)
  let output = args.pop()
  let [ a, b ] = mapArgs(args, modes, program)

  program.setValueAt(output, Number(a < b))
  program.incrementHead(4)
}

function equals({ modes }, program) {
  const args = program.getParams(3)
  let output = args.pop()
  let [ a, b ] = mapArgs(args, modes, program)

  program.setValueAt(output, Number(a == b))
  program.incrementHead(4)
}

// Operation Helpers.

// function getInput(query) {
//   const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//   });

//   return new Promise(resolve => rl.question(query, ans => {
//       rl.close();
//       resolve(ans);
//   }))
// }


function mapArgs(args, modes, program) {
  return args.map((p, i) => Number(getParam(p, modes[i], program)))
}

function getParam(value, mode, program) {
  switch(Number(mode)) {
    case 0:
      return program.readValueAt(value)
      break;
    case 1:
      return value
      break;
  }
}

function testIO() {
  let io = new IO
  io.write("hi")
  io.write("world")
  let p = new Program({ tape: [], stdIn: io })
  let a1 =  p.readInput()
  let a2 =  p.readInput()
  console.log(a1, a2)
}
// testIO()



fs.readFile('./p7_data.txt', 'utf8', function(err, data) {
  let instructions = data.split(',').map(Number)
  // console.log(instructions)
  // let instructions = "3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0".split(",")
  let phases = [5,6,7,8,9]
  let permutations = []

  function permute(curr, j = 0) {
    if(j==curr.length-1) permutations.push(curr)

    for(let i=j; i < curr.length; i++) {
      swap(i, j, curr)
      permute([...curr], j+1)
      swap(i, j, curr)
    }
  }

  permute(phases)

  let results = []

  permutations.forEach((phazes) => {
    let p
    phazes.forEach(phaze => {
      let input = new IO()
      input.write(Number(phaze))

      let output = p ? p.readOutput() :  0
      input.write(output)

      if(DEBUG_MODE) console.log("input: ", input.data)
      p = execute(instructions, input)
      if(DEBUG_MODE) console.log("output: ", p.output.data)
    })

    results.push(p.readOutput())
  })

  console.log(results.reduce((acc, num) => { return Math.max(acc, num) }, 0))
})

function swap(a, b, curr) {
  let t = curr[a]
  curr[a] = curr[b]
  curr[b] = t
}

function isInstructionTest() {
  console.log('isInstructionTest')
  console.log(isInstruction(1002) === true)
  console.log(isInstruction(32) === false)
  console.log(isInstruction(0) === false)
  console.log(isInstruction(1) === true)
  console.log(isInstruction(2) === true)
  console.log(isInstruction(3) === true)
  console.log(isInstruction(4) === true)
  console.log(isInstruction(102) === true)
  console.log(isInstruction(22) === false)
  console.log(isInstruction(202) === false)
  console.log(isInstruction(102) === true)
  console.log(isInstruction(20102) === false)
  console.log(isInstruction(11104) === true)
  console.log(isInstruction(10002) === true)
  console.log(isInstruction(10001) === true)
  console.log(isInstruction(11112) === false)
  console.log(isInstruction(11111) === false)
}

// isInstructionTest()