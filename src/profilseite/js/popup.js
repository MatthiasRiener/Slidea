
$("#dBactPU").click(function () {
    $(".popupbox").css('display', 'flex');
    $("#del").css('display', 'flex');
    $("#tf").css('display', 'none');
});

$("#tfBactPU").click(function () {
    $(".popupbox").css('display', 'flex');
    $("#del").css('display', 'none');
    $("#tf").css('display', 'flex');
});

$('.popupbox').click(function (e) {
    if (!e.target.classList.contains("popupbox")) return;
    closePUP();
});

function closePUP() {
    $('.buttons').css('display', 'flex');
    $('#confirm').css('display', 'none');
    $('.popupbox').css('display', 'none');
    $("#deleteButtonConf").prop('disabled', true);
    $('.mm-number-input-item input').val('');
    $('#activated').prop('disabled', true);
    $('.lockicon').css('background-color', '#E7F2FF');
    $('.lockicon').css('color', '#4E82FC');
    $(".lockicon").addClass("fa-lock");
    $(".lockicon").removeClass("fa-lock-open");
}

$("#deletebutton").click(function () {
    $('.buttons').css('display', 'none');
    $('#confirm').css('display', 'block');
});

$("#deleteButtonConf").click(function () {
    $('.buttons').css('display', 'flex');
    $('#confirm').css('display', 'none');
    $('.popupbox').css('display', 'none');
    $("#deleteButtonConf").prop('disabled', true);
    $('#confirmtext').val('');
});

$('#confirmtext').on('input', function () {
    text = $('#confirmtext').val();
    $("#deleteButtonConf").prop('disabled', text == "GregorDeschwanden" ? false : true);
});

$("#cancelbutton, #activated").click(function () {
    closePUP();
});

/**
 * Two Factor auth
 */

jQuery(document).ready(function () {

    var password = 111111;
    jQuery('.mm-number-input-item:nth-child(1) input').focus();

    jQuery('.mm-number-input-item').each(function (index) {
        var item, id, input;
        item = jQuery(this);
        id = index + 1;
        input = item.children('input');
        item.addClass('mm-number-input-item-' + id);
        input.data('id', id);
    });

    jQuery('.mm-number-input-item input').on('keyup', function (e) {

        var item, value, id, count, pass = [];
        item = jQuery(this);
        value = item.val();
        id = item.data('id');
        count = jQuery('.mm-number-input-item').length;

        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            jQuery('.mm-number-input-item-' + (id) + ' input').val('');
        }
        else {
            if (!value) {
                jQuery('.mm-number-input-item-' + id + ' input').focus().select();
            }
            else {
                if (id < count) {
                    jQuery('.mm-number-input-item-' + (id + 1) + ' input').focus().select();
                }
                else {
                    //
                }
            }

            jQuery('.mm-number-input-item input').each(function () {
                var x;
                x = jQuery(this);
                pass.push(x.val());
            });

            var number = pass.join("");
        }

        if (id === count) {
            if (parseInt(number) === password) {
                $('.mm-number-input-container').addClass('bounceOutUp');
                $(".lockicon").removeClass("fa-lock");
                $(".lockicon").addClass("fa-lock-open");
                $('.lockicon').css('background-color', '#E2FFEA');
                $('.lockicon').css('color', '#00BE4E');
                $('#activated').prop('disabled', false);
            }
            else {
                $('.mm-number-input-item input').addClass('shake');
                $('#activated').prop('disabled', true);
                $(".lockicon").addClass("fa-lock");
                $(".lockicon").removeClass("fa-lock-open");
                $('.lockicon').css('background-color', '#E7F2FF');
                $('.lockicon').css('color', '#4E82FC');
                $('.shake').on("animationend", function () {
                    $(this).removeClass('shake');
                    $('.mm-number-input-item-1 input').focus();
                    $('.mm-number-input-item input').val('');
                });
            }
        }
        else {
            //
        }

    });

});