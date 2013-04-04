$(function() {
    var initialMood = 8;   // Perfect mood is 10, start with 8
    $('#chart').data('moodNumber', initialMood);

    setQuestionListener('office_temp');
    setQuestionListener('cups_of_coffee');
    setQuestionListener('time_of_day');
    setQuestionListener('number_of_dogs');

    drawChart(36 * -2);
});

function setQuestionListener(questionText) {
    $("input[name='" + questionText + "']").change(function(e) {
        var prevAnswer = $("#chart").data(questionText);
        var newAnswer = parseInt($(this).val());
        if (prevAnswer !== undefined) {
            alterMood(this, prevAnswer * -1); // Undo current value
        }
        $("#chart").data(questionText, newAnswer);
        alterMood(this, newAnswer);
    });
}

function alterMood(checkbox, amount) {
    var moodNumber = $('#chart').data('moodNumber');

    if (checkbox.checked) {
        moodNumber += amount;
    }
    else {
        moodNumber -= amount;
    }

    $('#chart').data('moodNumber', moodNumber);

    var offset = moodNumber;
    if (moodNumber > 10) {
        offset = 10;
    }
    else if (moodNumber <= 1) {
        offset = 1.5;
    }
    redrawChart(offset * 36);
}
