$(document).ready(function () {

    var intervalId;
    var time = 30;
    var question;
    var correctGuess = 0;
    var incorrectGuess = 0;
    var questionsArr = [];
    var questionCount = 0;

    //function because i'm tired of making rows.
    function addRow(col) {
        var row = $("<div>").addClass("row");
        row.append(col);
        return row;
    }

    //constructor for questions
    function questionBuilder(question, correctAnswer, answerOptions) {
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.answerOptions = answerOptions
    }

    //post instructions and ask to start trivia
    function boardStart() {
        var col = $("<div>").addClass("col-md-12");
        var head = $("<h4>").text("Welcome to my movie trivia game!");
        var p = $("<p>").text("Click the button to choose the game you want to play! Heads up you only get 10 seconds to answer each question. Good Luck!");
        var startBtn = $("<btn>").addClass("btn m-2 btn-primary").attr("id", "start").text("Movie trivia!");
        col.append(head, p, startBtn);
        rowCol = addRow(col);
        $("#questionBoard").append(rowCol);
    }

    //ran out of time!
    function timeRunOut() {
        clear();
        var col = $("<div>").addClass("col-md-12");
        var head = $("<h2>").text("Out of Time!");
        var p = $("<p>").text("sry you ran out of time!");
        col.append(head, p);
        rowCol = addRow(col);
        $("#questionBoard").append(rowCol);
    }

    //after 10 questions.
    function endGameScoreBoard() {
        clear();

    }


    //clock start
    function clockStart() {
        clearInterval(intervalId);
        time = 30;
        intervalId = setInterval(clock, 1000);
    }
    //will stop the clock
    function clockStop() {
        clearInterval(intervalId);
    }

    //clock
    function clock() {

        time--;
        if (time === 0) {
            setTimeout(function () {
                $("#time").html("<h2>" + 0 + "</h2>");
                clockStop();
                timeRunOut();
            }, 100);

        }
        else {
            $("#time").html("<h2>" + time + "</h2>");
        }
    }

    //clear board
    function clear() {
        $("#questionBoard").empty();
    }

    //visibility toggle
    function visibilityToggle(id) {
        $("#" + id).toggleClass("visible invisible");
    }

    //get questions and answers
    function getQuestion() {
        $.ajax({
            url: "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple",
            method: "GET"
        }).then(function (response) {
            for (let i = 0; i < 10; i++) {
                question = new questionBuilder(response.results[i].question, response.results[i].correct_answer, response.results[i].incorrect_answers);
                question.answerOptions.push(question.correctAnswer);
                questionsArr[i] = question;
                randomAnswer(questionsArr[i].answerOptions);
            }
            console.log(questionsArr);
            questionBoardUpdater();
        });
    }

    //formats questions and answers
    function questionBoardUpdater() {
        clear();
        visibilityToggle("timeRow");
        clockStart();
        var col = $("<div>").addClass("col-md-12");
        var head = $("<h4>").html(questionsArr[questionCount].question);
        var p1 = questionsArr[questionCount].answerOptions[0];
        var p2 = questionsArr[questionCount].answerOptions[1];
        var p3 = questionsArr[questionCount].answerOptions[2];
        var p4 = questionsArr[questionCount].answerOptions[3];
        col.append(head, p1, p2, p3, p4);
        rowCol = addRow(col);
        $("#questionBoard").append(rowCol);
        questionCount++;
        console.log(questionCount);
    }

    //randomize question order
    function randomAnswer(answerOptions) {
        var p1 = $("<p>").text(answerOptions[0]).addClass("incorrect");
        var p2 = $("<p>").text(answerOptions[1]).addClass("incorrect");
        var p3 = $("<p>").text(answerOptions[2]).addClass("incorrect");
        var p4 = $("<p>").text(answerOptions[3]).addClass("correct");
        answerOptions[0] = p1;
        answerOptions[1] = p2;
        answerOptions[2] = p3;
        answerOptions[3] = p4;
        var sortArray = [p1, p2, p3, p4];
        answerOptions.sort(function () {
            return 0.5 - Math.random();
        });
    }




    //function for correct answer
    $("#questionBoard").on("click", ".correct", function () {
        clear();
        visibilityToggle("timeRow");
        clockStop();
        correctGuess++;
        var col = $("<div>").addClass("col-md-12");
        var head = $("<h2>").text("Thats Correct!");
        var p = $("<p>").text("You've gotten: " + correctGuess + " right! Keep it up!");
        col.append(head, p);
        rowCol = addRow(col);
        $("#questionBoard").append(rowCol);
        setTimeout(function () {
            getQuestion();
        }, 1000 * 5);
    })

    //function for incorrect answer
    $("#questionBoard").on("click", ".incorrect", function () {
        clear();
        visibilityToggle("timeRow");
        clockStop();
        incorrectGuess++;
        var col = $("<div>").addClass("col-md-12");
        var head = $("<h2>").text("Oh sorry your chose poorly!");
        var p = $("<p>").text("You've gotten: " + incorrectGuess + " wrong! better shape up!");
        var reStateQuestion = $("<h4>").html(questionsArr[(questionCount - 1)].question);
        var pAnswer = $("<p>").text(questionsArr[(questionCount - 1)].correctAnswer);
        col.append(head, p, reStateQuestion, pAnswer);
        rowCol = addRow(col);
        $("#questionBoard").append(rowCol);
        setTimeout(function () {
            getQuestion();
        }, 1000 * 10);
    })

    // show scoreboard ask to play again
    boardStart();

    $("#questionBoard").on("click", "#start", function () {
        getQuestion()
    })


});