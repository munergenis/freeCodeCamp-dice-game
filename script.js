// DOM ELS
const listOfAllDice = document.querySelectorAll(".die")
const scoreInputs = document.querySelectorAll("#score-options input")
const scoreSpans = document.querySelectorAll("#score-options span")
const currentRound = document.querySelector("#current-round")
const currentRoundRolls = document.querySelector("#current-round-rolls")
const totalScore = document.querySelector("#total-score")
const scoreHistory = document.querySelector("#score-history")
const rollDiceBtn = document.querySelector("#roll-dice-btn")
const keepScoreBtn = document.querySelector("#keep-score-btn")
const rulesBtn = document.querySelector("#rules-btn")
const rulesContainer = document.querySelector(".rules-container")

// GLOB VARS
let isModalShowing = false
let diceValuesArr = []
let rolls = 0
let score = 0
let total = 0
let round = 1

// const numtest = {
//   4: "a",
//   5: "b",
//   3: "e",
//   1: "g",
//   2: "f"
// }

// console.log(typeof Math.min(...Object.keys(numtest)))

// FUNCTIONS
function toggleRulesModal() {
  isModalShowing = !isModalShowing

  if (isModalShowing) {
    rulesContainer.style.display = "inherit"
    rulesBtn.textContent = "Hide Rules"
  } else {
    rulesContainer.style.display = "none"
    rulesBtn.textContent = "Show Rules"
  }  
}
function rollDice() {
  diceValuesArr = []

  for (let i = 0; i < 5; i++) {
    diceValuesArr.push(Math.floor(Math.random() * 6) + 1)
  }

  diceValuesArr.forEach((die, index) => listOfAllDice[index].textContent = die)
}
function updateStats() {
  if (round > 6) return
  
  currentRoundRolls.textContent = rolls
  currentRound.textContent = round
}
function updateRadioOption(index, scoreVal) {
  scoreInputs[index].disabled = false
  scoreInputs[index].value = scoreVal
  scoreSpans[index].textContent = `, score = ${scoreVal}`
}
function resetRadioOptions() {
  scoreInputs.forEach(input => {
    input.disabled = true
    input.checked = false
  })
  scoreSpans.forEach(span => span.textContent = "")
}
function getAndUpdateResults(arr) {
  const dups = arr.map(num => {
    let counts = 0
    arr.forEach(num2 => {
      if (num === num2) counts++
    })
    return counts
  })

  const maxDups = Math.max(...dups)
  const isFullHouse = maxDups === 3 && dups.findIndex(num => num === 2) !== -1
  const {isSmallStraight, isLargeStraight} = checkForStraights(arr)

  const arrSum = arr.reduce((acc, curr) => acc + curr, 0)

  if (maxDups >= 4) {
    updateRadioOption(1, arrSum)
    updateRadioOption(0, arrSum)
  } else if (maxDups === 3) {
    updateRadioOption(0, arrSum)
  }

  if (isFullHouse) {
    updateRadioOption(2, 25)
  }

  if (isSmallStraight) {
    updateRadioOption(3, 30)
  }

  if (isLargeStraight) {
    updateRadioOption(4, 40)
  }

  updateRadioOption(5, 0)
}
function checkForStraights(arr) {
  const numsArr = arr.map(num => num).sort()
  
  let isSmallStraight = false
  let isLargeStraight = false

  // checking for largeStraight
  // all numbers must be consecutive
  let currIteration = 1
  let targetIterations = 4
  let possibleLargeStraight = true

  while (possibleLargeStraight && currIteration <= targetIterations) {
    let currIndex = currIteration - 1
    let nextIndex = currIteration
    let currNum = numsArr[currIndex]
    let nextNum = numsArr[nextIndex]

    if (currNum + 1 !== nextNum) {
      possibleLargeStraight = false
    }

    if (possibleLargeStraight && currIteration === targetIterations) {
      isLargeStraight = true
      isSmallStraight = true
      return {isSmallStraight, isLargeStraight}
    }

    currIteration++
  }

  // checking for smallStraight
  // first OR last four numbers must be consecutive
 
  // first four
  // we want to check 
  // 1st-2nd, 2nd-3rd, 3rd-4th 
  // OR 
  // 2nd-3rd, 3rd-4th, 4th-5th
  // so 3 iterations
  currIteration = 1
  targetIterations = 3
  let possibleSmallStraight = true

  while (possibleSmallStraight && currIteration <= targetIterations) {
    let currIndex = currIteration - 1
    let nextIndex = currIteration
    let currNum = numsArr[currIndex]
    let nextNum = numsArr[nextIndex]

    if (currNum + 1 !== nextNum) {
      possibleSmallStraight = false
    }

    if (possibleSmallStraight && currIteration === targetIterations) {
      isSmallStraight = true

      return {isSmallStraight, isLargeStraight}
    }

    currIteration++
  }

  // checking for last four nums if not found smallStraight in first four nums
  // so starting at index = 1 (second num)
  currIteration = 1
  targetIterations = 3
  possibleSmallStraight = true

  while (possibleSmallStraight && currIteration <= targetIterations) {
    let currIndex = currIteration
    let nextIndex = currIteration + 1
    let currNum = numsArr[currIndex]
    let nextNum = numsArr[nextIndex]

    if (currNum + 1 !== nextNum) {
      possibleSmallStraight = false
    }

    if (possibleSmallStraight && currIteration === targetIterations) {
      isSmallStraight = true

      return {isSmallStraight, isLargeStraight}
    }

    currIteration++
  }

  return {isSmallStraight, isLargeStraight}
}
function updateScore(scoreVal, achieved) {
  score += Number(scoreVal)
  totalScore.textContent = score

  const achievedListItem = document.createElement("li")
  const formattedString = achieved[0].toUpperCase() + achieved.slice(1).replace(/-/g, " ")
  achievedListItem.textContent = `${formattedString} : ${scoreVal}`

  scoreHistory.append(achievedListItem)
}
function resetGame() {
  diceValuesArr = []
  listOfAllDice.forEach(die => die.textContent = "")

  rolls = 0
  score = 0
  total = 0
  round = 1

  updateStats()

  totalScore.textContent = 0
  scoreHistory.textContent = ""

  scoreInputs.forEach((inp, index) => {
    inp.value = inp.id
    scoreSpans[index].textContent = ""
  })
}

// EVENT LISTENERS
rulesBtn.addEventListener("click", toggleRulesModal)
rollDiceBtn.addEventListener("click", () => {
  if (rolls >= 3) {
    alert("You must select a score")
    return
  }
  
  rolls++
  rollDice()
  resetRadioOptions()
  getAndUpdateResults(diceValuesArr)
  updateStats()
})
keepScoreBtn.addEventListener("click", () => {
  let scoreVal
  let achieved

  scoreInputs.forEach(inp => {
    if (inp.checked) {
      scoreVal = inp.value
      achieved = inp.id
    }
  })

  if (!achieved) {
    alert("You should select an option")
    return
  }

  updateScore(scoreVal, achieved)
  round++
  rolls = 0
  resetRadioOptions()
  updateStats()

  if (round > 6) {
    setTimeout(() => {
      alert(`Game over! Total score: ${score}`)
      resetGame()
    }, 500);
  }
})