$(document).ready(function() {
    var URL_PATH = '../lipo-dr'; // katalog startowy strony
    var buy_form_changed = false;
    var countdown_timer = null;
    var countdown_seconds = 300;
    var popup_el = null;
    var popup_delay = 10000;
    
    const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    const date = new Date();
    const month = months[date.getMonth()]
    const day = date.getDate();
    const year = date.getFullYear();
    const currenDateString = month + ' ' + day + ', ' + year;
    $('.header-date').html(currenDateString)
    
  
    $("button.comments__header-button").click(function(){
      $("form.comments__form").fadeToggle();
    });
  
    //Cookie communicate 
    var visit = GetCookie("cookieAccept");
    if (visit == null) {
        cookiebar();
    }

    $('.closeCookies').click(function () {
        setAgreeCookie();
        $('.cookieBox').addClass('closeCookieBox');
    });
    
    // DISCARD COOKIE CONFIRMATION
    $('.discardCookie').click(function() {
        $('.confirmation-title').html('Czy jesteś pewny?');
        $('.confirmation-body').html('<p>Po odrzuceniów plików cookie, strona nie będzie działać prawidłowo. Czy na pewno chcesz odrzucić pliki cookie?</p>');
        $('.confirmation-footer').html(`
            <button class="discard-action" onclick=discardCookieConfirm()>Odrzuć cookie</button>
            <button class="accept-action" onclick=acceptCookieConfirm()>Zaakceptuj cookie</button>
        `);
        $('.confirmation').addClass('is-visible')
    });

    $('.close-confirmation-icon').click(function() {
        cleanConfirmation();
    });
    // /Cookie communicate

    jQuery('.datepicker').datetimepicker({
        timepicker: true,
        format: 'd-m-Y H:i:s',
        mask: true,
        dayOfWeekStart: 1
    });
    jQuery.datetimepicker.setLocale('pl');
    
    $('input[type=radio][name=pay]').change(function() {
        checkPayField();
    });
    
    checkPayField();
    
    function checkPayField() {
        $('.rowEmailField').hide();
        $('.s-email-notrequired').show();
        
        var radio = $('input[type=radio][name=pay]:checked');
        
        if (radio.length > 0 && radio.val() === '2') { // platnosc z gory
            var form = radio.closest('form');
            form.find('.rowEmailField').show();
            form.find('.s-email-notrequired').hide();
        }
    }
    
    // jesli po przejsciu na strone z formularzem pojawia sie jakies bledy, to przewinie strone bardziej na formularz
    if ($('.buyForm:not(.popupForm) .errors2').length > 0) {
        $('html, body').animate({
                scrollTop: ($('.buyForm .errors2').first().offset().top - 50)
        }, 'slow');
    }
    
    if ($('.popupBox').length > 0) {
        if (isMobile()) { // popup dla wersji mobilnej
            if ($('#popup_2').length > 0) {
                var showed = false;
                var touchstart = false;
                var oldScrollY = 0;
                var countScroll = 0;

                $(window).on('touchstart', function() {
                    var length = event.touches.length;
                    if (length === 0) {
                        return true;
                    }

                    if ($(event.touches[0].target).closest('.popupBox').length > 0) {
                        return true;
                    }

                    var pageY = event.touches[0].pageY;
                    var element1 = $('.mobileContent #pText101').first();
                    var element2 = $('#pText102').first();

                    if (!element1.length || !element2.length) {
                        return true;
                    }

                    var element1_top = element1.offset().top;
                    var element2_top = element2.offset().top;

                    if (pageY >= element1_top && pageY <= element2_top) {
                        oldScrollY = $(document).scrollTop();
                        touchstart = true;
                    }
                    else {
                        touchstart = false;
                    }

                    $(window).bind('scroll.v1', onScroll);
                });

                $(window).on('touchend', function() {
                    touchstart = false;
                    $(window).unbind('scroll.v1');
                });

                function onScroll() {
                    if (!touchstart || showed) {
                        return;
                    }

                    var element1 = $('.mobileContent #pText101').first();
                    var element2 = $('#pText102').first();

                    if (!element1.length || !element2.length) {
                        return;
                    }

                    var element1_top = element1.offset().top;
                    var element2_top = element2.offset().top;

                    if (this.scrollY >= element1_top && this.scrollY <= element2_top) {
                        if (oldScrollY > this.scrollY) { // jesli przeskrolowano strone w gore (w gore/poczatek strony)
                            showed = true;

                            setTimeout(function() {
                                ouibounce(document.getElementById('popup_2'), {
                                    aggressive: false,
                                    cookieExpire: 1, // 1 day
                                    delay: 1000,
                                    callback: function() {
                                        $('body').css('overflow', 'hidden');
                                        //window.location.hash = 'popup';
                                        //history.pushState(null, null, url);

                                        $(window).bind('hashchange', function() {
                                            if (location.hash == null || location.hash == "") {
                                                closePopup();
                                            }
                                        });

                                        $(window).on('popstate', function (event) {  //pressed back button
                                            if (event.state !== null) {
                                                closePopup();
                                            }
                                        });
                                    }
                                }).fire();
                            }, 500);
                        }
                    }

                    oldScrollY = this.scrollY;
                }
            }
        }
        else { // popup dla wersji desktop
            if ($('#popup_1').length > 0) {
                popup_el = ouibounce(document.getElementById('popup_1'), {
                    aggressive: false,
                    timer: popup_delay,
                    cookieExpire: 1, // 1 day
                    callback: function() {
                        $('body').css('overflow', 'hidden');
                        //startCountdown();
                    }
                });
            }
        }
    }
    
    function isMobile() { 
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        }
        else {
            return false;
        }
    }
    
    $('.popupBox').click(function(e) {
        if ($(e.target).closest('.popupContent').length === 0) {
            closePopup();
        }
    });
    
    if ($('.countdown').length > 0) {
        startCountdown();
    }
    
    function startCountdown() {
        countdown_timer = setInterval(function() {
            var el_countdown = $('.countdown').first();
            
            if (!el_countdown.length > 0) {
                clearInterval(countdown_timer);
                return;
            }
            
            countdown_seconds--;
            
            var minutes = Math.floor(countdown_seconds/60);
            var seconds = Math.floor(countdown_seconds%60);
            
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            
            el_countdown.text(minutes + ':' + seconds);
            
            if (countdown_seconds <= 0) {
                clearInterval(countdown_timer);
            }
        }, 1000);
    }
    
    $('#zglos').click(function(e) {
        e.preventDefault();
        
        var el = $(this);
        var form = el.closest('form');
        
        if (el.attr('data-loading')) {
            return false;
        }
        
        var text = el.text();
        var el_errors = form.find('.errors2').first();
        var el_success = form.find('.successMsg').first();
        var el_email = form.find('input[name=phone]').first();
        
        el.attr('data-loading', true);
        el_email.prop('disabled', true);
        el.prop('disabled', true);
        el.html('<span class="loader"></span>');
        
        $.ajax({
            type: 'POST',
            url: URL_PATH + '/ajax/process_free_popup.php',
            dataType: 'json',
            data: {
                phone: el_email.val() || ''
            },
            success: function(json) {
                el_errors.html('');
                el_success.html(''); 
                
                if (json['errors'] && Object.keys(json['errors']).length > 0) {
                    for (var i in json['errors']) {
                        el_errors.append('<p>' + json['errors'][i] + '</p>');
                    }
                }
                else {
                    form.find('.formGroup').hide();
                    form.find('button').hide();
                    el_success.text('Dziękujemy za zaufanie. Skontaktujemy się z Tobą w ciągu 24 h.'); 
                }
            },
            complete: function() {
                el.removeAttr('data-loading');
                el.text(text);
                el_email.prop('disabled', false);
                el.prop('disabled', false);
            },
            error: function() {
                el.removeAttr('data-loading');
                el.text(text);
                el_email.prop('disabled', false);
                el.prop('disabled', false);
                el_success.html(''); 
                el_errors.html('Wystąpił nieoczekiwany błąd podczas przetwarzania żądania. Spróbuj jeszcze raz za chwilę.');
            }
        });
        return false;
    });
    
    function saveFormData() {
        var form = $('form.buyForm.changed').first();
        if (!form.length) {
            return;
        }
        
        var form_type = form.attr('data-form-type') || 0;
        var fd = new FormData();
        
        $.each(form.find('input[type=text]'), function() {
            if ($(this).attr('name')) {
                fd.append($(this).attr('name'), $(this).val());
            }
        });
        
        fd.append('form_type', form_type);
        navigator.sendBeacon(URL_PATH + '/ajax/save_form_data.php', fd);
    }
    
    if ($('form.buyForm.changed').length > 0) {
        buy_form_changed = true;
    }
    
    $('form.buyForm').on('input', function() {
        buy_form_changed = true;
        
        if (!$(this).hasClass('changed')) {
            $(this).addClass('changed');
        }
    });
    
    $('form.buyForm').on('focusout', function() {
        if (!$(this).val().length) {
            return;
        }
        
        buy_form_changed = true;
        
        if (!$(this).hasClass('changed')) {
            $(this).addClass('changed');
        }
    });
    
    $(window).on('unload', function() {
        if (buy_form_changed) {
            saveFormData();
        }
    });
    
    $('form').on('submit', function() {
        buy_form_changed = false;
    });
    
    /*$('.contactBox2 > a').click(function(e) {
        e.preventDefault();
        
        $('html, body').animate({
                scrollTop: ($('#pTextAboveProductImg').first().offset().top - $('.contactBox2').first().outerHeight() - 10)
        }, 'slow');
        return false;
    });*/
});


function cleanConfirmation() {
    $('.confirmation').removeClass('is-visible');
    setTimeout(() => {
        $('.confirmation-title').html('');
        $('.confirmation-body').html('');
        $('.confirmation-footer').html('');
    }, 400);
}


function acceptCookieConfirm() {
    setAgreeCookie();
    $('.cookieBox').addClass('closeCookieBox');
    cleanConfirmation();
}

//Cookie communicate 
function GetCookie(name) {
    var arg = name + "=";
    var arglen = arg.length;
    var dclen = document.cookie.length;
    var i = 0;

    while (i < dclen) {
        var j = i + arglen;
        if (document.cookie.substring(i, j) == arg)
            return "here";
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
            break;
    }

    return null;
}

function setAgreeCookie() {
    var expire = new Date();
    expire = new Date(expire.getTime() + 7776000000);
    document.cookie = "cookieAccept=true; expires=" + expire;
}

function cookiebar() {
    $('.cookieBox').addClass('display');
}

function discardCookieConfirm() {
    window.location.href = '../../https@google.pl';
}



function openPopup(el) {
   $('.popupBox').hide();
   $('#' + el).fadeIn(200);  
   $('body').css('overflow','hidden'); 
}

function closePopup() {
    $('.popupBox').fadeOut(300);
    $('body').css('overflow','auto');
    window.location.hash = "";
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}