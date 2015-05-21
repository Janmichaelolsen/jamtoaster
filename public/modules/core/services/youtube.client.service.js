'use strict';

angular.module('core').service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var shuffle = false;
  var playlist = ['NT5SSgY21zg'];
  var service = this;
  var s = document.createElement('script'); // use global document since Angular's $document is weak
  var discover = false;
  s.src = 'http://www.youtube.com/iframe_api';
  document.body.appendChild(s);
  var controlState = 'Play';

  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '250',
    playerWidth: '300',
    state: 'stopped'
  };

  this.launchList = function(list){
    discover = false;
    playlist = list;
    var video = playlist[Math.floor((Math.random() * playlist.length) + 0)];
    this.launchPlayer(video.videoId, video.title);
  };
  this.launchDiscover = function(list){
    discover = true;
    $log.info(list);
    playlist = list;
    var video = playlist[Math.floor((Math.random() * playlist.length) + 0)];
    this.launchPlayer(video.id.videoId, video.snippet.title);
  };
  this.launchListSpes = function(song, list){
    discover = false;
    playlist = list;
    this.launchPlayer(song.videoId, song.title);
  };
  this.nextSong = function(){
    if(discover === false){
      if(playlist.length == 1){
        this.launchPlayer(playlist[0].videoId, playlist[0].title);
      }else {
        var video = playlist[Math.floor((Math.random() * playlist.length) + 0)];
        this.launchPlayer(video.videoId, video.title);
      }
    }else{
      if(playlist.length == 1){
        this.launchPlayer(playlist[0].id.videoId, playlist[0].snippet.title);
      }else {
        var video = playlist[Math.floor((Math.random() * playlist.length) + 0)];
        this.launchPlayer(video.id.videoId, video.snippet.title);
      }
    }
  }
  function onYoutubeReady (event) {
    youtube.player.cueVideoById('NT5SSgY21zg');
    youtube.videoId = 'NT5SSgY21zg';
    youtube.videoTitle = 'Misterwives - Reflections (Gryffin Remix)';
  }

  function onYoutubeStateChange (event) {
    if (event.data === YT.PlayerState.PLAYING) {
      youtube.state = 'playing';
      controlState = 'Pause';
    } else if (event.data === YT.PlayerState.PAUSED) {
      youtube.state = 'paused';
      controlState = 'Play';
    } else if (event.data === YT.PlayerState.ENDED) {
      youtube.state = 'ended';
      service.nextSong();
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
  youtube.ready = true;
  service.bindPlayer('placeholder');
  service.loadPlayer();
  $rootScope.$apply();
}]);
