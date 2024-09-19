// Selecting the elements
const start_btn = document.querySelector(".start_btn");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");
const saveScoreBtn = document.querySelector("#save_score");

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

// Event listeners for buttons
start_btn.onclick = () => {
  info_box.classList.add("activeInfo"); // Show info box
};

exit_btn.onclick = () => {
  info_box.classList.remove("activeInfo"); // Hide info box
};

continue_btn.onclick = () => {
  startQuiz();
};

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

restart_quiz.onclick = () => {
  resetQuiz();
  startQuiz();
};

quit_quiz.onclick = () => {
  window.location.reload(); // Reload the current window
};

next_btn.onclick = () => {
  if (que_count < questions.length - 1) {
    que_count++; // Increment question count
    que_numb++; // Increment question number
    showQuestions(que_count); // Show next question
    queCounter(que_numb); // Update question counter
    resetTimer(); // Reset timer
  } else {
    clearInterval(counter); // Clear timer
    clearInterval(counterLine); // Clear timer line
    showResult(); // Show result box
  }
};

saveScoreBtn.onclick = () => {
  const pseudo = document.querySelector("#username").value;
  const data = localStorage.getItem("leaderboard");
  let parsedData = data ? JSON.parse(data) : {};
  parsedData[pseudo] = userScore;
  localStorage.setItem("leaderboard", JSON.stringify(parsedData));
  window.location.reload();
};

function startQuiz() {
  info_box.classList.remove("activeInfo"); // Hide info box
  quiz_box.classList.add("activeQuiz"); // Show quiz box
  showQuestions(0); // Show first question
  queCounter(1); // Update question counter
  startTimer(timeValue); // Start timer
  startTimerLine(0); // Start timer line
}

function showQuestions(index) {
  const que_text = document.querySelector(".que_text");
  const question = questions[index];

  // Create question and options tags
  let que_tag = `<span>${question.numb}. ${question.question}</span>`;
  let option_tag = question.options
    .map((option) => `<div class="option"><span>${option}</span></div>`)
    .join("");

  que_text.innerHTML = que_tag; // Add question tag
  option_list.innerHTML = option_tag; // Add options tag

  const options = option_list.querySelectorAll(".option");

  // Set onclick attribute to all available options
  options.forEach((option) => {
    option.setAttribute("onclick", "optionSelected(this)");
  });
}

const tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIconTag =
  '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(answer) {
  clearInterval(counter); // Clear timer
  clearInterval(counterLine); // Clear timer line
  let userAns = answer.textContent; // Get user selected option
  let correctAns = questions[que_count].answer; // Get correct answer
  const allOptions = option_list.children.length; // Get all option items

  if (userAns === correctAns) {
    userScore++; // Increment score
    answer.classList.add("correct"); // Add green color to correct option
    answer.insertAdjacentHTML("beforeend", tickIconTag); // Add tick icon
  } else {
    answer.classList.add("incorrect"); // Add red color to incorrect option
    answer.insertAdjacentHTML("beforeend", crossIconTag); // Add cross icon

    // Auto select correct answer
    for (let i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent === correctAns) {
        option_list.children[i].classList.add("correct"); // Add green color
        option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Add tick icon
      }
    }
  }

  // Disable all options
  for (let i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled");
  }
  next_btn.classList.add("show"); // Show next button
}

function showResult() {
  info_box.classList.remove("activeInfo"); // Hide info box
  quiz_box.classList.remove("activeQuiz"); // Hide quiz box
  result_box.classList.add("activeResult"); // Show result box
  const scoreText = result_box.querySelector(".score_text");

  let scoreTag;
  if (userScore > 3) {
    scoreTag = `<span>et félicitations! 🎉, Vous avez obtenu <p>${userScore}</p> sur <p>${questions.length}</p></span>`;
  } else if (userScore > 1) {
    scoreTag = `<span>et bien joué 😎, Vous avez obtenu <p>${userScore}</p> sur <p>${questions.length}</p></span>`;
  } else {
    scoreTag = `<span>et désolé 😐, Vous n'avez obtenu que <p>${userScore}</p> sur <p>${questions.length}</p></span>`;
  }
  scoreText.innerHTML = scoreTag; // Add score tag
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time; // Update timer text
    time--; // Decrement time
    if (time < 10) {
      timeCount.textContent = "0" + time; // Add leading zero
    }
    if (time < 0) {
      clearInterval(counter); // Clear timer
      timeText.textContent = "Terminé"; // Update timer text
      autoSelectCorrectAnswer(); // Auto select correct answer
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 29);
  function timer() {
    time++; // Increment time
    time_line.style.width = time + "px"; // Update time line width
    if (time > 549) {
      clearInterval(counterLine); // Clear timer line
    }
  }
}

function queCounter(index) {
  // Create question counter tag
  let totalQueCountTag = `<span><p>${index}</p> sur <p>${questions.length}</p> Questions</span>`;
  bottom_ques_counter.innerHTML = totalQueCountTag; // Add question counter tag
}

function resetQuiz() {
  timeValue = 15;
  que_count = 0;
  que_numb = 1;
  userScore = 0;
  widthValue = 0;
  clearInterval(counter); // Clear timer
  clearInterval(counterLine); // Clear timer line
}

function resetTimer() {
  clearInterval(counter); // Clear timer
  clearInterval(counterLine); // Clear timer line
  startTimer(timeValue); // Start timer
  startTimerLine(widthValue); // Start timer line
  timeText.textContent = "Temps :"; // Reset timer text
  next_btn.classList.remove("show"); // Hide next button
}

function autoSelectCorrectAnswer() {
  const allOptions = option_list.children.length; // Get all option items
  let correctAns = questions[que_count].answer; // Get correct answer
  for (let i = 0; i < allOptions; i++) {
    if (option_list.children[i].textContent === correctAns) {
      option_list.children[i].classList.add("correct"); // Add green color
      option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Add tick icon
    }
  }
  for (let i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); // Disable all options
  }
  next_btn.classList.add("show"); // Show next button
}
