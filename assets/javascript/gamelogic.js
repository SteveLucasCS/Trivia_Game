/********************************************************************************
 * @author Steve Lucas (stevelucas.github.io)
 * This is a simple trivia game, where the user selectes from multiple choice
 * answer. Questions can be created manually or generated from a db/API call.
 * The user's score keeps track of how many questions they have gotten correct,
 * and the game ends when they answer the final question (the last question
 * object)
 ********************************************************************************/

/** Keeps track of user's score (correct answer) */
var score = 0
/** Current round of the game (used to iterate through questions).
 *  set to -1 by default to indicate it's the tutorial screen */
var round = -1
/** Array of HTML elements containing choices' text */
var choicesText = $(".choice-text").toArray()

/** Array of checkboxes corresponding to choices */
var choicesCheck = $("input:radio").toArray()

/** The indeces(or index) of correct answer(s) */
var answerIndex = 0

/** Round timer */
var timer
var timeLimit = 10
var countdown = 10

var srcDifficulty = "easy"
var srcComputerScience = `https://opentdb.com/api.php?amount=10&category=18&difficulty=${srcDifficulty}&type=multiple`
var srcVideoGames = `https://opentdb.com/api.php?amount=10&category=15&difficulty=${srcDifficulty}&type=multiple`
var srcMythology = `https://opentdb.com/api.php?amount=10&category=20&difficulty=${srcDifficulty}&type=multiple`
/** amount (integer) of questions to pull (# of rounds/questions in game) */
var srcAmount = 10


/**
 * Question class contains the properties
 * @property text - Displayed to the user via HTML
 * @property {string[]} choices - array of multiple choice options for the question
 * @property {string[]} answer - array of true/false answer to corresponding choices^
 */
class Question {
  /** Constructor for a question object
   * @param {string} question - string that will be displayed as the question in UI
   * @param {string[]} choices - array of choices given to user
   * @param {string[] || string} answer - array of answer corresponding to the choice at the same index
   */
  constructor(question, choices, answer) {

    this.question = question
    this.choices = choices
    this.answer = answer
    this.choices.push(answer)
  }
}

/**
 * Builds a questionArray by pulling questions from a databse API
 * @param {string} source - url to send get request
 */
function downloadQuestions(source) {
  //results will be set to an array of object returned from API call
  var results
  var successful = function(response) {
    console.log("API request Successful")
    results = response.results
    buildQuestionList(results)
    $("#next-btn").prop("disabled", false)
  }
  var failed = function() {
    console.log("API quest Failed. Switching to local question defaults")
  }
  $.ajax({
    url: source,
    method: "GET"
  }).then(successful, failed)
}


function buildQuestionList(results) {
  /** Each object from opentdb trivia database contains the following properties
   * @property {string} category - category of trivia
   * @property {string} correct_answer - appears to always return 1 correct answer
   * @property {string} difficulty - the difficulty of the questions, as decided by opentdb
   * @property {string[]} incorrect_answers - array of incorrect answer strings
   * @property {string} question - the all important question (answer is 42)
   * @property {string} type - "multiple" for multiple choice
   */

  for (var i = 0; i < results.length; i++) {
    questionArray.push(new Question(results[i].question,
      results[i].incorrect_answers, results[i].correct_answer))
  }
}


function defaultQuestions() {
  var questionArray = []
  questionArray.push(new Question("Well, this is awkard.",
    ["Something broke", "And we wouldn't acess a dependancy", "This text is just here", "So the page doesn't crash and burn."],
    "There is no right answer"))
  return questionArray
}


/**
 * Checks if the checkbox corresponding to the correct answer is checked
 * @return true if answer is correct
 * @return false if answer is incorrect
 */
function checkAnswer() {
  for (var i = 0; i < 4; i++) {
    i === answerIndex ? $(choicesText[i]).css("font-weight", "bold") :
      $(choicesText[i]).css("text-decoration", "line-through")
    $(choicesCheck[i]).prop("disabled", true)
  }

  if (choicesCheck[answerIndex].checked)
    score++

  $("#score").text(score)
  $("#next-btn").prop("disabled", false)
  clearInterval(timer)
}

/**
 * Update's HTML based on parameters
 * @param {Question} q- a question object representing the current question
 */
function nextRound(q) {
  // random number decides where in the choiceText array the correct answer will be
  answerIndex = Math.floor(Math.random() * (4 - 0));
  $("#question").html(q.question)
  $("#score").html(score)
  //current index of choices
  var c = 0
  //current index of choicesText
  var i = 0
  while (i < 4) {
    // i increments every loop
    // c only increments if an incorrect answer is written
    if (i === answerIndex) {
      $(choicesText[i]).html(q.answer)
    } else {
      $(choicesText[i]).html(q.choices[c])
      c++
    }

    //unchecks checked box
    if (choicesCheck[i].checked)
      choicesCheck[i].checked = false
    if ($(choicesCheck[i]).prop("disabled"))
      $(choicesCheck[i]).prop("disabled", false)

    $(choicesText[i]).css("text-decoration", "none")
    $(choicesText[i]).css("font-weight", "normal")

    $("#round").text(round + 1)
    //total number of rounds
    $("#total-rounds").text(srcAmount)
    i++
  }
  countdown = timeLimit
  $("#countdown").text(countdown)
  timer = setInterval(tick, 1000)

}

function tick() {
  countdown--
  $("#countdown").text(countdown)
  if (countdown === 0) {
    checkAnswer()
  }
}



/** main questionArray containing all questions for a game */
var questionArray = []

// // Question array is given a default placeholder, replaced by API pull if successful
// questionArray.push(new Question("This is a test question",
//   ["choice 1", "choice 2", "choice 3"], "answer"))
  
// Main execution
downloadQuestions(srcVideoGames)


$(choicesCheck).on("click", function() {
  $("#submit-btn").prop("disabled", false)
})

// called when user clicks submit-btn
$("input:radio").on("click", function() {

  if (round >= 0)
    checkAnswer()
  
})

$("#next-btn").on("click", function() {
  if (round < questionArray.length - 1) {
    round++
  } else {
    alert("Game Over!")
    round = 0
  }
  nextRound(questionArray[round])
})