(function($) {
    var time_of_day_count = 0,
        number_of_dogs_count = 0;

    $(function() {
        $("input[name='time_of_day']").change(function(e) {
            alterMood(this, time_of_day_count * -1); // Reset count
            time_of_day_count = 0;

            if ($(this).val() == 'morning') {
                time_of_day_count -= 1;
            }
            else if ($(this).val() == 'afternoon') {
                time_of_day_count += 0;
            }
            else if ($(this).val() == 'evening') {
                time_of_day_count -= 3;
            }

            alterMood(this, time_of_day_count);
        });

        $("input[name='number_of_dogs']").change(function(e) {
            alterMood(this, number_of_dogs_count * -1); // Reset count
            number_of_dogs_count = 0;

            if ($(this).val() == 'zero') {
                number_of_dogs_count += 0;
            }
            else if ($(this).val() == 'one') {
                number_of_dogs_count += 0;
            }
            else if ($(this).val() == 'two') {
                number_of_dogs_count -= 3;
            }

            alterMood(this, number_of_dogs_count);
        });
    });
})(jQuery);
