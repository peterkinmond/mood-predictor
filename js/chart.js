$(function() {
    var initialMood = 7;   // Perfect mood is 10, start with 7
    $('#chart').data('moodNumber', initialMood);

   $.getJSON(loadFile(), function(json) {
      createGame(json);
    });

    drawChart(36 * -2);
});

function loadFile() {
  return ($.url().param('type') === undefined) ? 'pair.json' :
    $.url().param('type') + '.json';
}

function createGame(game) {
  $('#titleText').html(game.title);

  $(game.questions).each(function(questionIndex, question) {
    var questionName = "question" + questionIndex;
    createQuestion(questionName, question);
    if (question.type === "radio") {
      setQuestionListener(questionName);
    }
  });
}

function createQuestion(questionName, question) {
  $('#container').append('<h2>' + question.text + '</h2>');

  $(question.answers).each(function(answerIndex, answer) {
    var input = document.createElement('input');
    input.setAttribute("type", question.type);
    input.setAttribute("name", questionName);
    input.setAttribute("value", answer.value);

    if (question.type === "checkbox") {
      input.setAttribute("onclick", "alterMood(this, " + answer.value + ")");
    }

    $('#container').append(input);
    $('#container').append(answer.text);
    $('#container').append("<br/>");
  });
}

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
    rotateChart(offset * 36);
}

function isReallyPissedOff() {
  var moodNumber = $('#chart').data('moodNumber');
  var angerLimit = -6;

  return moodNumber <= angerLimit;
}

function isReallyHappy() {
  var moodNumber = $('#chart').data('moodNumber');
  var happyLimit = 19;

  return moodNumber >= happyLimit;
}

function getSpinnerColours() {
  // Colour chart:
  // [ Dark Green, Light Green, Orange, Pink, Red ]
  // ['#2ca02c', '#98df8a', "#ff7f0e", '#ff9896', "#d62728"]

  if (isReallyHappy()) {
    return ['#2ca02c','#2ca02c','#2ca02c','#2ca02c','#2ca02c'];
  }
  else if (isReallyPissedOff()) {
    return ["#d62728", "#d62728", "#d62728", "#d62728", "#d62728"];
  }
  else {
    return ['#2ca02c', '#98df8a', "#ff7f0e", '#ff9896', "#d62728"];
  }
}

function getSpinnerText() {
  // Make text match colour
  if (isReallyHappy()) {
    return ['elated', 'elated', 'elated', 'elated', 'elated'];
  }
  else if (isReallyPissedOff()) {
    return ['nuclear', 'nuclear', 'nuclear', 'nuclear', 'nuclear'];
  }
  else {
    return ['elated', 'happy', 'so-so', 'angry', 'nuclear'];
  }
}

function drawChart(rotateAngle) {
    var w = 400,
            h = 400,
            r = Math.min(w, h) / 2,
            initialAngle = -125,
            rotation = initialAngle + rotateAngle,
            text = getSpinnerText(),
            data = d3.range(text.length).map(function () {
                return 1 / text.length;
            }),
            colours = getSpinnerColours();
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

function rotateChart(angle) {
    var initialAngle = -125;
    angle = angle + initialAngle;

    var arcs = d3.select('body #charted')
            .selectAll('g.arc');

    arcs.transition()
            .duration(800)
            .attr("transform", "translate(200,200)rotate(" + angle + ")");

    var text = getSpinnerText();
    var colours = getSpinnerColours();

    d3.selectAll('path')
            .transition()
            .duration(3000)
            .style('fill', function(d,i) {
              return colours[i];
            });

    d3.selectAll('text')
            .text(function(d,i) {
              return text[i];
            })
            .transition()
            .duration(500)
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")rotate(" + (-1 * angle) + ")";
            });
}
