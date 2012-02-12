(function($) {
    var time_of_day_count = 0;

    $(function() {
        $("input[name='time_of_day']").change(function(e) {
            alterMood(this, time_of_day_count * -1); // Reset count
            time_of_day_count = 0;

            if ($(this).val() == 'morning') {
               time_of_day_count -= 1;
            }
            else if($(this).val() == 'afternoon') {
               time_of_day_count += 0;
            }
            else if($(this).val() == 'evening') {
               time_of_day_count -= 3;
            }

            alterMood(this, time_of_day_count);
        });
    });
})(jQuery);
