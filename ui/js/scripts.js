'use strict';

var username;
var audios = {};

$(function() {
  $(document).ready(function(){
    $('.owl-carousel').owlCarousel({
      mouseDrag: false,
      autoWidth: true,
      autoHeight: true,
      dotsSpeed: 400
    });
  });

  $('.next').click(function(e) {
    e.preventDefault();

    var next = $('.owl-dot.active').next();

    var ids = $('.owl-item.active li').get().map(function(el) {
      return $(el).data('id');
    });

    if ($('.owl-item.active section').hasClass('initial')) {
      Sortable.create($('.owl-item.active ul')[0], {
        animation: 150
      });

      username = $('#username').val();

      $.post('/login', {
        username: $('#username').val(),
        password: $('#password').val()
      }, function(data) {
        if (data.success) {
          $.post('/api/initial_song', { username: username }, function(data) {
            data.forEach(function(song) {
              $('.owl-item.active').next()
                .find('ul')
                .append('<li data-id="' + song.id + '">' +
                          '<img src="' + song.coverArt + '">' +
                          '<div>' +
                            '<p>' + song.name + '</p>' +
                            '<p>' + song.artists + '</p>' +
                          '</div>' +
                          '<a href="#" class="listen">' +
                            '<i class="fas fa-volume-up"></i>' +
                          '</a>' +
                        '</li>');

              audios[song.id] = new Audio(song.previewURL);
            });

            next.click();
          });
        }
      });
    } else {
      $.post('/api/authenticate', {
        username: username,
        order: ids
      }, function(data) {
        switch (data.mode) {
          case 'hold':
            data.songs.forEach(function(song) {
              $('.owl-item.active').next()
                .find('ul')
                .append('<li data-id="' + song.id + '">' +
                          '<img src="' + song.coverArt + '">' +
                          '<div>' +
                            '<p>' + song.name + '</p>' +
                            '<p>' + song.artists + '</p>' +
                          '</div>' +
                          '<a href="#" class="listen">' +
                            '<i class="fas fa-volume-up"></i>' +
                          '</a>' +
                        '</li>');
            });

            next.click();
            break;
          case 'pass':
            alert('Passed');
            break;
          case 'fail':
            alert('Failed');
            break;
          default:
            console.error('Invalid mode: ' + data.mode);
        }
      });
    }
  });

  $('ul').on('click', 'a.listen', function(e) {
    e.preventDefault();
    var audio = audios[$(this).parent().attr('data-id')];

    if ($(this).hasClass('play')) audio.pause();
    else audio.play();

    audio.currentTime = 0;
    $(this).toggleClass('play');
  });
});
