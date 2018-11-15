/********************************************************************************
 * @author Steve Lucas (stevelucas.github.io)
 * This is a simple trivia game, where the user selectes from multiple choice
 * answers. Questions can be created manually or generated from a db/API call.
 * The user's score keeps track of how many questions they have gotten correct,
 * and the game ends when they answer the final question (the last question
 * object)
 ********************************************************************************/

 TODO - iterate through questions (starting at questionArray[0])
      - build checkAnswer function
      - Keep going from there
/** Keeps track of user's score (correct answers) */
var score = 0
/** Current round of the game (used to iterate through questions).
 *  set to -1 by default to indicate it's the tutorial screen */
var round = -1
/** Array of HTML elements containing choices' text */
var choicesText = $(".choice-text")

/** Array of checkboxes corresponding to choices */
var choicesCheck = $(".form-check-input")

var srcDifficulty = "medium"
var srcComputerScience = "https://opentdb.com/api.php?amount=10&category=18&difficulty=" + srcDifficulty + "&type=multiple"
var srcVideoGames = "https://opentdb.com/api.php?amount=10&category=15&difficulty=" + srcDifficulty + "&type=multiple"
/** amount (integer) of questions to pull (# of rounds/questions in game) */
var srcAmount = 10


/**
 * Question class contains the properties
 * @property text - Displayed to the user via HTML
 * @property {string[]} choices - array of multiple choice options for the question
 * @property {string[]} answers - array of true/false answers to corresponding choices^
 */
class Question {
  /** Constructor for a question object
   * @param {string} question - string that will be displayed as the question in UI
   * @param {string[]} choices - array of choices given to user
   * @param {string[]} answers - array of answers corresponding to the choice at the same index
   */
  constructor(question, choices, answers) {
    this.question = question
    this.choices = choices
    this.answers = answers
  }
}

function downloadQuestions(source) {
  //results will be set to an array of object returned from API call
  var results
  var successful = function(response) {
    console.log("API request Successful")
    results = response.results
    buildQuestionList(results)
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
    questionArray.push(new Question(results[i].question),
      results[i].incorrect_answers, results[i].correct_answer)
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
 * Starts a new round in the game
 * Iterates through questions and rounds
 */
function nextRound() {
  round++
  //TODO: iterate to next question
  updateUI(CurQuestion.text, curQuestion.choices)
}


/**
 * TODO 
 */
function checkAnswers(choices, answers) {
  console.log("TODO: checkAnswers()");
}

/**
 * Update's HTML based on parameters
 * @param {string} text 
 * @param {string[]} choices 
 * @param {number} score 
 */
function updateUI(text, choices, score) {
  $("#question").text(text)
  $("#score").text(score)
  for (var i = 0; i < choices.length; i++) {
    choicesText[i] = choices[i]
    if (choicesCheck[i].checked)
      choicesCheck[i].checked = false
  }
}

/** Current question object based on the round */
var curQuestion = new Question("This is a test question",
  ["choice 1", "choice 2", "choice 3", "choice 4"], "choice 2")

var defaultQuestionArray = defaultQuestions()

/** main questionArray containing all questions for a game */
var questionArray = []

// Main execution
downloadQuestions(srcComputerScience)


// called when user clicks submit-btn
$("#submit-btn").on("click", function() {
  updateUI(curQuestion.text, curQuestion.choices, score)
  //tutorial screen, does not check answers
  if (round > -1) {
    round++
    return
  }
  //checks if ALL answers were correct
  if (checkAnswers(curQuestion.choices, curQuestion.answers)) {
    score++
    nextRound()
  } else {
    nextRound()
  }


})