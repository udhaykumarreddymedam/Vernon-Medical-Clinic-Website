$(document).ready(function () {
  const $datepicker = $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    showButtonPanel: false,
    minDate: 0,
    maxDate: "+14D",
    beforeShowDay: function (date) {
      const today = new Date();
      return [date >= today, ""];
    },
    onSelect: function (dateText) {
      const selectedDate = new Date(dateText);
      updateSelectedDate(selectedDate);
      generateTimeSlots(selectedDate);
    }
  });

  const $selectedDate = $("#selected-date");
  const today = new Date();
  const minDate = $datepicker.datepicker("option", "minDate");
  const maxDate = $datepicker.datepicker("option", "maxDate");

  function updateSelectedDate(date) {
    $datepicker.datepicker("setDate", date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $selectedDate.text(date.toLocaleDateString(undefined, options));
  }

  function generateTimeSlots(date) {
    const timeSlotsContainer = $('.time-slots');
    const noSlotsMessage = $('#no-slots-message');
    timeSlotsContainer.empty();

    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      noSlotsMessage.text("The clinic is closed on Saturdays and Sundays.").show();
      timeSlotsContainer.html('<div class="closed">Closed</div>');
      return;
    }

    const slots = getSlotsForDate(date);
    if (slots.length === 0) {
      noSlotsMessage.text("No slots available for the selected date.").show();
      return;
    }

    noSlotsMessage.hide(); 

    slots.forEach(slot => {
      if (!slot.isEmergency) {  // Hide emergency slots
        let slotClass = 'time-slot';
        const slotElement = $(`
          <div class="${slotClass}" data-time="${slot.time}">
            ${slot.time}
          </div>
        `);

        slotElement.on('click', function () {
          var $this = $(this);

          if ($this.hasClass('booked')) {
            $("#dialog-booked").dialog({
              modal: true,
              dialogClass: 'custom-dialog no-header',
              open: function () {
                $(".ui-widget-overlay").on("click", function () {
                  $("#dialog-booked").dialog("close");
                });
              },
              buttons: {
                "Close": function () {
                  $(this).dialog("close");
                }
              }
            });
          } else {
            $("#dialog-confirm").dialog({
              modal: true,
              dialogClass: 'custom-dialog no-header',
              open: function () {
                $(".ui-widget-overlay").on("click", function () {
                  $("#dialog-confirm").dialog("close");
                });
              },
              buttons: {
                "Yes": function () {
                  $this.addClass('booked'); // Mark slot as booked
                  $(this).dialog("close");
                },
                "No": function () {
                  $(this).dialog("close");
                }
              }
            });
          }
        });

        slotElement.hover(function () {
          if ($(this).hasClass('booked')) {
            $(this).append('<span class="disabled-icon"><i class="fas fa-ban" style="color: red;"></i></span>');
          }
        }, function () {
          $(this).find('.disabled-icon').remove();
        });

        timeSlotsContainer.append(slotElement);
      }
    });

    adjustSlotLayout();
  }

  function getSlotsForDate(date) {
    const slots = [];
    const dayOfWeek = date.getDay();

    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0);

    while (currentTime.getHours() < 13) {
      slots.push({ time: formatTime(currentTime), isEmergency: isEmergencySlot(currentTime) });
      currentTime.setMinutes(currentTime.getMinutes() + 5);
    }

    if (dayOfWeek !== 3) { // If not Wednesday
      currentTime.setHours(14, 0, 0, 0);

      while (currentTime.getHours() < 17) {
        slots.push({ time: formatTime(currentTime), isEmergency: isEmergencySlot(currentTime) });
        currentTime.setMinutes(currentTime.getMinutes() + 5);
      }
    }

    return slots;
  }

  function isEmergencySlot(time) {
    return time.getMinutes() % 30 === 0 && !(time.getHours() === 9 && time.getMinutes() === 0);
  }

  function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  }

  function adjustSlotLayout() {
    const timeSlotsContainer = $('.time-slots');
    const timeSlots = timeSlotsContainer.children('.time-slot');
    timeSlots.css({
      'flex': '1 1 calc(25% - 10px)',
      'text-align': 'center',
      'border-radius': '10px',
      'padding': '10px',
      'font-size': '14px',
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'box-sizing': 'border-box',
      'position': 'relative',
      'margin': '5px'
    });
  }

  $('#no-slots-message').show(); 
});



// calendar-container

$('#cbx2').on('change', function () {
  var timeContainer = $('#time-container');
  if ($(this).is(':checked')) {
    timeContainer.css('display', 'flex');
  } else {
    timeContainer.css('display', 'none');
  }
});

// hero-section-animation-slides
$(document).ready(function () {
  const testimonials = $('.testimonial');
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonials.each(function (i) {
      $(this).removeClass('show slide-in-left slide-in-right slide-out-left slide-out-right');
      if (i === index) {
        if (index % 2 === 0) {
          $(this).addClass('show slide-in-left');
        } else {
          $(this).addClass('show slide-in-right');
        }
      } else if (i === currentTestimonial) {
        if (currentTestimonial % 2 === 0) {
          $(this).addClass('slide-out-left');
        } else {
          $(this).addClass('slide-out-right');
        }
      }
    });
    currentTestimonial = index;
  }

  function nextTestimonial() {
    const nextTestimonialIndex = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(nextTestimonialIndex);
  }

  setInterval(nextTestimonial, 5000);
  showTestimonial(0);
});


// appointment
$(document).ready(function () {
  $("#appointment-btn").click(function () {
    $("#appointment").show();
    $("#other-div").hide();
    $("#hero").hide();
  });
  $('.nav-link').click(function () {
    $("#appointment").hide();
    $("#other-div").show();
    $("#hero").show();
  });
  $('.child-checkbox input, .child-checkbox select').attr('disabled', true);
  $(".enable-cb").change(function () {
    if (this.checked) {
      $(".child-checkbox input,.child-checkbox select").attr('disabled', false);
      $('.btn-container').css('display', 'flex');
    } else {
      $(".child-checkbox input,.child-checkbox select").attr('disabled', true);
      $('.btn-container').css('display', 'none');
    }
  });
  $('#date-picker').click(function () {
    $('.hours').show();
  });
  $("#book-appointment").click(function () {
    $("#overlay").fadeIn();
  });
  $(".close").click(function () {
    $("#overlay").fadeOut();
  });
  $(".overlay-inner").click(function (event) {
    event.stopPropagation();
  });
  $("#cancel-btn").click(function () {
    $('#submit-form')[0].reset();
  })
});
