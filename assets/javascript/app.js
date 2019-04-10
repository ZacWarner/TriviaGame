$(document).ready(function () {

    var intervalId;
    var time = 30;
    var question;
    var correctGuess = 0;
    var incorrectGuess = 0;

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

    //add question objects into array


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
        clear();
        visibilityToggle("timeRow");
        clockStart();
        $.ajax({
            url: "https://opentdb.com/api.php?amount=1&category=11&difficulty=easy&type=multiple",
            method: "GET"
        }).then(function (response) {
            // console.log(response.results[0]);
            question = new questionBuilder(response.results[0].question, response.results[0].correct_answer, response.results[0].incorrect_answers);
            console.log(question);
            question.answerOptions.push(question.correctAnswer);
            var sortArray = randomAnswer(question);
            questionBoardUpdater(question, sortArray);
        });
    }

    //formats questions and answers
    function questionBoardUpdater(question, sortArray) {
        var col = $("<div>").addClass("col-md-12");
        var head = $("<h4>").text(question.question);
        var p1 = sortArray[0];
        var p2 = sortArray[1];
        var p3 = sortArray[2];
        var p4 = sortArray[3];
        col.append(head, p1, p2, p3, p4);
        rowCol = addRow(col);
        $("#questionBoard").append(rowCol);
    }

    //randomize question order
    function randomAnswer(question) {
        var p1 = $("<p>").text(question.answerOptions[0]).addClass("incorrect");
        var p2 = $("<p>").text(question.answerOptions[1]).addClass("incorrect");
        var p3 = $("<p>").text(question.answerOptions[2]).addClass("incorrect");
        var p4 = $("<p>").text(question.correctAnswer).addClass("correct");
        var sortArray = [p1, p2, p3, p4];
        sortArray.sort(function () {
            return 0.5 - Math.random();
        });
        return sortArray;
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
        var reStateQuestion = $("<h4>").text(question.question);
        var pAnswer = $("<p>").text(question.correctAnswer);
        col.append(head, p, reStateQuestion, pAnswer);
        rowCol = addRow(col);
        $("#questionBoard").append(rowCol);
        setTimeout(function () {
            getQuestion();
        }, 1000 * 5);
    })

    //rotate through questions

    // show scoreboard ask to play again
    boardStart();

    $("#questionBoard").on("click", "#start", function () {
        getQuestion();
    })


});