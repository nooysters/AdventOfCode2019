const fs = require('fs')
const readline = require('readline');
const DEBUG_MODE = false

class Program {
  constructor(tape) {
    this.tape = tape
    this.head = 0
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
}

const computer = async (tape) => {
  const program = new Program(tape)

  while(program.getHead() < program.tapeLength) {
    let value = program.readCurrentValue()
    if(value == 99) break

    if(isInstruction(value)) {
      await parseInstruction(program)
    }
    else {
      program.incrementHead()
    }
  }

  return program
}

function isInstruction(value = -1) {
  let code = Number(`${value}`.slice(-2))
  let validMode = `00${value}`.slice(0, -2).split('').reduce(
                                (acc, v) => (v == 1 || v == 0) && acc, true
                              )
  return [1, 2, 3, 4, 5, 6, 7, 8].includes(code) && validMode
}

async function parseInstruction(program) {
  const { opCode, modes } = getOpMode(program.readCurrentValue())
  const op = getOperation(opCode) || {}
  if (DEBUG_MODE) console.log("Parsing Instruction", opCode,  modes)
  await op({ modes }, program)
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

async function input({}, program) {
  const input = await getInput("enter input: ")

  program.setValueAt(program.getParams(1), input)
  program.incrementHead(2)

  if (DEBUG_MODE) console.log('input')
}

function getInput(query) {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
  }))
}

function output({}, program) {
  console.log(program.readValueAt(program.getParams(1)), "output")
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
// './p5_data.txt'
fs.readFile('./p5_data.txt', 'utf8', function(err, data) {
  let tape = data.split(',').map(Number)
})

// TESTS
function programTest() {
  let program = new Program([1,2,3,4,5,6,7])
  let o = program.head
  let h = program.incrementHead(2)
  console.log(h === 2, program.readCurrentValue(), h, o)

  program = new Program([1,2,3,4,5,6,7])
  console.log(program.readValueAt(3) === 4, program.readValueAt(3))

  program = new Program([1,2,3,4,5,6,7])
  program.head = 0
  let args = program.getParams(3)
  console.log(args.join('') === [2,3,4].join(''), args)
}

async function computerTest() {
  console.log("computer test")

  let tape = [1101,100,-1,4,0]
  let program = await computer(tape)
  console.log("add imediate for both params", program.readValueAt(4) === 99, program.readValueAt(4))

  tape = [1001,2,3,4,5]
  program = await computer(tape)
  console.log("add mixed for both params", program.readValueAt(4) === 6, program.readValueAt(4))

  tape = [101,2,3,4,5]
  program = await computer(tape)
  console.log("add mixed for both params", program.readValueAt(4) === 6, program.readValueAt(4))

  tape = [101,-2,3,4,5]
  program = await computer(tape)
  console.log("add mixed for both params with negative", program.readValueAt(4) === 2, program.readValueAt(4))

  tape = [1,3,3,4,5]
  program = await computer(tape)
  console.log("add positional for both params", program.readValueAt(4) === 8, program.readValueAt(4))

  tape = [1102,100,-1,4,0]
  program = await computer(tape)
  console.log("multiply imediate for both params", program.readValueAt(4) === -100, program.readValueAt(4))

  tape = [1002,2,3,4,5]
  program = await computer(tape)
  console.log("multiply mixed for both params", program.readValueAt(4) === 9, program.readValueAt(4))

  tape = [102,2,3,4,5]
  program = await computer(tape)
  console.log("multiply mixed for both params", program.readValueAt(4) === 8, program.readValueAt(4))

  tape = [102,-2,3,4,5]
  program = await computer(tape)
  console.log("multiply mixed for both params with negative", program.readValueAt(4) === -8, program.readValueAt(4))

  tape = [2,3,3,4,5]
  program = await computer(tape)
  console.log("multiply positional for both params", program.readValueAt(4) === 16, program.readValueAt(4))
}

function getOpModeTest() {
  console.log('getOpMode test')
  let result = getOpMode(1102)
  console.log(result.opCode === 2)
  console.log(result.modes.join('') === [1, 1, 0].join(''))

  result = getOpMode(02)
  console.log(result.opCode === 2)
  console.log(result.modes.join('') === [0, 0, 0].join(''))

  result = getOpMode(01)
  console.log(result.opCode === 1)
  console.log(result.modes.join('') === [0, 0, 0].join(''))

  result = getOpMode(1)
  console.log(result.opCode === 1)
  console.log(result.modes.join('') === [0, 0, 0].join(''))

  result = getOpMode(11102)
  console.log(result.opCode === 2)
  console.log(result.modes.join('') === [1, 1, 1].join(''))

  result = getOpMode(1002)
  console.log(result.opCode === 2)
  console.log(result.modes.join('') === [0, 1, 0].join(''))

  result = getOpMode(10002)
  console.log(result.opCode === 2)
  console.log(result.modes.join('') === [0, 0, 1].join(''))
}


function isInstructionTest() {
  console.log('isInstructionTest')
  console.log(isInstruction(0) === false)
  console.log(isInstruction(1) === false)
  console.log(isInstruction(2) === false)
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