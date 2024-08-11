$(document).ready(function () {
  const $datepicker = $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    showButtonPanel: false,
    onSelect: function (dateText) {
      const selectedDate = new Date(dateText);
      if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
        $('.time-slots').html('<div class="closed">Closed</div>');
      } else {
        updateSelectedDate(selectedDate);
        generateTimeSlots(selectedDate);
      }
    }
  });


  const $selectedDate = $("#selected-date");
  const currentDate = new Date();

  function updateSelectedDate(date) {
    $datepicker.datepicker("setDate", date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $selectedDate.text(date.toLocaleDateString(undefined, options));
  }

  function changeDay(days) {
    const newDate = new Date($datepicker.datepicker("getDate"));
    newDate.setDate(newDate.getDate() + days);
    if (newDate.getDay() === 0 || newDate.getDay() === 6) {
      $('.time-slots').html('<div class="closed">Closed</div>');
    } else {
      updateSelectedDate(newDate);
      generateTimeSlots(newDate);
    }
  }

  $("#prev-day").click(function () {
    changeDay(-1);
  });

  $("#next-day").click(function () {
    changeDay(1);
  });

  function generateTimeSlots(date) {
    const timeSlotsContainer = $('.time-slots');
    timeSlotsContainer.empty();

    const slots = getSlotsForDate(date);

    slots.forEach(slot => {
      let slotClass = 'time-slot';
      if (slot.isEmergency) {
        slotClass += ' emergency';
      }

      const slotElement = $(`
    <div class="${slotClass}" data-time="${slot.time}">
        <span class="tick-mark"><i class="fas fa-check"></i></span>
        ${slot.time}
    </div>
    `);

      slotElement.on('click', function () {
        if ($(this).hasClass('booked')) {
          $("#dialog-booked").dialog({
            modal: true,
            dialogClass: 'custom-dialog no-header',
            open: function () {
              $(".ui-widget-overlay").bind("click", function () {
                $("#dialog-booked").dialog("close");
              });
            },
            buttons: {
              "Close": function () {
                $(this).dialog("close");
              }
            }
          });
        } else if ($(this).hasClass('emergency')) {
          $("#dialog-emergency").dialog({
            modal: true,
            dialogClass: 'custom-dialog no-header',
            open: function () {
              $(".ui-widget-overlay").bind("click", function () {
                $("#dialog-emergency").dialog("close");
              });
            },
            buttons: {
              "OK": function () {
                $(this).dialog("close");
              }
            }
          });
        } else {
          $("#dialog-confirm").dialog({
            modal: true,
            dialogClass: 'custom-dialog no-header',
            open: function () {
              $(".ui-widget-overlay").bind("click", function () {
                $("#dialog-confirm").dialog("close");
              });
            },
            buttons: {
              "Yes": function () {
                slotElement.addClass('booked')
                  .find('.tick-mark').css('display', 'block');
                $(this).dialog("close");
              },
              "No": function () {
                $(this).dialog("close");
              }
            }
          });
        }
      });
      timeSlotsContainer.append(slotElement);
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
      'box-sizing': 'border-box'
    });
  }

  updateSelectedDate(currentDate);
  generateTimeSlots(currentDate);
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
