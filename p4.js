// 236491-713787
const start = 236491
const end = 713787
let curr = start
let results = new Set()

while(curr <= end) {
  let arr = (curr + "").split('')
  if(checkForDouble(arr) && isRising(arr)) {
    results.add(curr)
  }

  curr++
}
console.log(results.size)

function isRising(arr) {
  for(let i = 0; i < arr.length-1; i++) {
    let curr = arr[i]
    let next = arr[i+1]
    if (curr > next) return false
  }
  return true
}
function checkForDouble(arr) {
  curr_run = 1
  for(let i = 0; i < arr.length-1; i++) {
    let curr = arr[i]
    let next = arr[i+1]

    if (curr == next) {
      curr_run ++
    }
    else {
      if(curr_run === 2) return true
      curr_run = 1
    }
  }

  return curr_run == 2
}