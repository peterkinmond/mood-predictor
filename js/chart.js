$(function() {
    var initialMood = 7;   // Perfect mood is 10, start with 7
    $('#chart-container').data('moodNumber', initialMood);

   $.getJSON(loadFile(), function(json) {
      createGame(json);
    });

    var chartDimensions = $('#charted').width() * 0.8;
    drawChart(chartDimensions, chartDimensions, 36 * -2);
    resizeChartWithWindow();
});

function resizeChartWithWindow() {
    var chart = $("#chart");
    $(window).on("resize", function() {
        var targetWidth = chart.parent().width() * 0.8;
        chart.attr("width", targetWidth);
        chart.attr("height", targetWidth);
    });
}

function loadFile() {
  return ($.url().param('type') === undefined) ? 'pair.json' :
    $.url().param('type') + '.json';
}

function createGame(game) {
  $('#title-text').html(game.title);

  $(game.questions).each(function(questionIndex, question) {
    var questionName = "question" + questionIndex;
    createQuestion(questionName, question);
    if (question.type === "radio") {
      setQuestionListener(questionName);
    }
  });
}

function createQuestion(questionName, question) {
  // Question header
  $('#question-container').append('<h2>' + question.text + '</h2>');

  $(question.answers).each(function(answerIndex, answer) {
    var input = document.createElement('input');
    input.setAttribute("type", question.type);
    input.setAttribute("name", questionName);
    input.setAttribute("value", answer.value);

    if (question.type === "checkbox") {
      input.setAttribute("onclick", "alterMood(this, " + answer.value + ")");
    }

    var labelWrapper = document.createElement('label');
    labelWrapper.appendChild(input);
    labelWrapper.appendChild(document.createTextNode(answer.text));
    $('#question-container').append(labelWrapper);
    $('#question-container').append("<br/>");
  });
}

function setQuestionListener(questionText) {
    $("input[name='" + questionText + "']").change(function(e) {
        var prevAnswer = $("#chart-container").data(questionText);
        var newAnswer = parseInt($(this).val());
        if (prevAnswer !== undefined) {
            alterMood(this, prevAnswer * -1); // Undo previous value
        }
        $("#chart-container").data(questionText, newAnswer);
        alterMood(this, newAnswer);
    });
}

function alterMood(checkbox, amount) {
    var moodNumber = $('#chart-container').data('moodNumber');

    if (checkbox.checked) {
        moodNumber += amount;
    }
    else {
        moodNumber -= amount;
    }

    $('#chart-container').data('moodNumber', moodNumber);

    if(isReallyPissedOff()) {
      fuckShitUp();
    }
    else if(isReallyHappy()) {
      achieveEnlightenment();
    }
    else {
      returnToNormal();
    }

    var offset = moodNumber;
    if (moodNumber > 10) {
        offset = 10;
    }
    else if (moodNumber <= 1) {
        offset = 1.5;
    }
    var chartDimensions = $('#charted').width() * 0.8;
    rotateChart(chartDimensions, chartDimensions, offset * 36);
}

function isReallyPissedOff() {
  var moodNumber = $('#chart-container').data('moodNumber');
  var angerLimit = -6;

  return moodNumber <= angerLimit;
}

function isReallyHappy() {
  var moodNumber = $('#chart-container').data('moodNumber');
  var happyLimit = 19;

  return moodNumber >= happyLimit;
}

function fuckShitUp() {
  $('#charted').addClass('anger');
  $('body').css('background-color', 'rgb(160, 0, 0)');
}

function achieveEnlightenment() {
  $('#charted').addClass('elation');
  $('body').css('background-color', 'lightgreen');
}

function returnToNormal() {
  $('#charted').removeClass();
  $('body').css('background-color', 'white');
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

function drawChart(height, width, rotateAngle) {
    var w = width,
            h = height,
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
            .attr("height", h)
            .attr("id", "chart")
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMidYMid");

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

function rotateChart(width, height, angle) {
    var initialAngle = -125;
    angle = angle + initialAngle;

    var arcs = d3.select('body #charted')
            .selectAll('g.arc');

    arcs.transition()
            .duration(800)
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")rotate(" + angle + ")");

    var text = getSpinnerText();
    var colours = getSpinnerColours();

    d3.selectAll('path')
            .transition()
            .duration(1500)
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
