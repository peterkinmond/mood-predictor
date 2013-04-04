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
            alterMood(this, prevAnswer * -1); // Undo previous value
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

function drawChart(rotateAngle) {
    var w = 400,
            h = 400,
            r = Math.min(w, h) / 2,
            initialAngle = -125,
            rotation = initialAngle + rotateAngle;
    text = ['elated', 'happy', 'so-so', 'angry', 'nuclear'],
            data = d3.range(text.length).map(function () {
                return 1 / text.length;
            }),
            colours = ['#2ca02c', '#98df8a', "#ff7f0e", '#ff9896', "#d62728"],
            colour = d3.scale.ordinal().range(colours),
            donut = d3.layout.pie(),
            arc = d3.svg.arc().innerRadius(r * .5).outerRadius(r);

    var vis = d3.select("body #charted")
            .append("svg")
            .data([data])
            .attr("width", w)
            .attr("height", h);

    var arcs = vis.selectAll("g.arc")
            .data(donut)
            .enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + r + "," + r + ")rotate(" + rotation + ")");

    arcs.append("path")
            .transition()
            .duration(1500)
            .attr("fill", function (d, i) {
                return colour(i);
            })
            .attr("d", arc);

    arcs.append("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")rotate(" + (-1 * rotation) + ")";
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("display", function (d) {
                return null;
            })
            .attr("class", "pie-piece")
            .text(function (d, i) {
                return text[i];
            });
}

function redrawChart(angle) {
    var initialAngle = -125;
    angle = angle + initialAngle;

    var arcs = d3.select('body #charted')
            .selectAll('g.arc');

    arcs.transition()
            .duration(800)
            .attr("transform", "translate(200,200)rotate(" + angle + ")");

    arcs.selectAll('text')
            .transition()
            .duration(500)
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")rotate(" + (-1 * angle) + ")";
            });
}
