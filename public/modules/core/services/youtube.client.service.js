'use strict';

angular.module('core').service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;

  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '600',
    playerWidth: '600',
    state: 'stopped'
  };

  var history = [
    {id: 'XKa7Ywiv734', title: '[OFFICIAL HD] Daft Punk - Give Life Back To Music (feat. Nile Rodgers)'}
  ];

  function onYoutubeReady (event) {
    $log.info('YouTube Player is ready');
    youtube.player.cueVideoById(history[0].id);
    youtube.videoId = history[0].id;
    youtube.videoTitle = history[0].title;
  }

  function onYoutubeStateChange (event) {
    if (event.data === YT.PlayerState.PLAYING) {
      youtube.state = 'playing';
    } else if (event.data === YT.PlayerState.PAUSED) {
      youtube.state = 'paused';
    } else if (event.data === YT.PlayerState.ENDED) {
      youtube.state = 'ended';
    }
    $rootScope.$apply();
  }

  this.bindPlayer = function (elementId) {
    $log.info('Binding to ' + elementId);
    youtube.playerId = elementId;
  };

  this.createPlayer = function () {
    $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
    return new YT.Player(youtube.playerId, {
      height: youtube.playerHeight,
      width: youtube.playerWidth,
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onReady': onYoutubeReady,
        'onStateChange': onYoutubeStateChange
      }
    });
  };

  this.loadPlayer = function () {
    if (youtube.ready && youtube.playerId) {
      if (youtube.player) {
        youtube.player.destroy();
      }
      youtube.player = service.createPlayer();
    }
  };

  this.launchPlayer = function (id, title) {
    youtube.player.loadVideoById(id);
    youtube.videoId = id;
    youtube.videoTitle = title;
    return youtube;
  };

  this.archiveVideo = function (id, title) {
    history.unshift({
      id: id,
      title: title
    });
    return history;
  };

  this.deleteVideo = function (list, id) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].id === id) {
        list.splice(i, 1);
        break;
      }
    }
  };

  this.getYoutube = function () {
    return youtube;
  };

  this.getHistory = function () {
    return history;
  };
  $log.info('Youtube API is ready');
  youtube.ready = true;
  service.bindPlayer('placeholder');
  service.loadPlayer();
  $rootScope.$apply();


}]);
