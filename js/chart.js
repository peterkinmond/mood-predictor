$(function() {
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
