(function($) {
    var time_of_day_count = 0,
        number_of_dogs_count = 0;

    $(function() {
        $("input[name='time_of_day']").change(function(e) {
            alterMood(this, time_of_day_count * -1); // Reset count
            time_of_day_count = 0;
            time_of_day_count += parseInt($(this).val());
            alterMood(this, time_of_day_count);
        });

        $("input[name='number_of_dogs']").change(function(e) {
            alterMood(this, number_of_dogs_count * -1); // Reset count
            number_of_dogs_count = 0;
            number_of_dogs_count += parseInt($(this).val());
            alterMood(this, number_of_dogs_count);
        });
    });
})(jQuery);
