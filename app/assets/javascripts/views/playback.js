Capstone.Views.Playback = Backbone.CompositeView.extend({
  template: JST["playback"],

  initialize: function() {
    //maybe move the button to the song-info -- or make its own view!
    this.installListeners();

    this.replaceQueue();
    this.replacePlaybackBar();
    this.replaceSongInfo();
  },

  events: {
    "click .playback-play-button" : "playOrPause"
  },

  activate: function () {
    this.$(".playback-play-button").addClass("playing");
    this.$(".playback-play-button").removeClass("glyphicon-play");
    this.$(".playback-play-button").addClass("glyphicon-pause");
  },

  deactivate: function () {
    this.$(".playback-play-button").removeClass("playing");
    this.$(".playback-play-button").removeClass("glyphicon-pause");
    this.$(".playback-play-button").addClass("glyphicon-play");
  },

  digNow: function () {
    console.log("dug at " + this.secondsCounter);
    this.model.get("digs")[this.secondsCounter]++;
  },

  installListeners: function () {
    //must call again when model is switched
    this.listenTo(this.model, "play", this.activate)
    this.listenTo(this.model, "pause", this.deactivate)
  },

  playOrPause: function (event) {
    if (this.$(".playback-play-button").hasClass("playing")) {
      this.model.pause();
    } else {
      this.model.play();
    }
  },

  replaceQueue: function () {
    if (this.subviews(".queue").first()) {
      this.removeSubview(".queue", this.subviews(".queue").first());
    }
    var view = new Capstone.Views.Queue();
    this.addSubview(".queue", view);
  },

  replacePlaybackBar: function () {
    if (this.subviews(".playback-bar").first()) {
      this.removeSubview(".playback-bar", this.subviews(".playback-bar").first());
    }
    var view = new Capstone.Views.PlaybackBar({model: this.model});
    this.addSubview(".playback-bar", view);
  },

  replaceSongInfo: function () {
    if (this.subviews(".playback-song-info").first()) {
      this.removeSubview(".playback-song-info", this.subviews(".playback-song-info").first());
    }
    var view = new Capstone.Views.PlaybackSongInfo({model: this.model});
    this.addSubview(".playback-song-info", view);
  },

  pauseSong: function(song) {
    this.$(".audio-tag")[0].pause();
    this.wrapUpSong();
    Capstone.currentSong.playing = false;
  },

  playSong: function(song) {
    if (!this.$("nav").hasClass("active")) {
      this.$("nav").addClass("active");
      this.$("#dig-button").html("DIG");
      this.$(".playback-play-button").addClass("playing").addClass("glyphicon-pause");
    }

    if (Capstone.currentSong && Capstone.currentSong.id === song.id) {
      //unpause current song
      this.$(".audio-tag")[0].play();
    } else {
      //wrap up currently playing Song
      if (Capstone.currentSong) this.wrapUpSong()

      this.$(".audio-tag").attr("src", song.escape("file_path"))
      this.$(".audio-tag")[0].play();

      this.secondsCounter = 0

      Capstone.currentSong && Capstone.currentSong.trigger("pause");
      Capstone.currentSong = song;
      this.model = song;
      this.installListeners();
      this.replacePlaybackBar();
      this.replaceSongInfo();
    }

    Capstone.currentSong.playing = true
    this.setDigInterval();
  },

  setDigInterval: function () {
    //remember to remove listener on stop
    $("#dig-button").click(this.digNow.bind(this))
    this.digInterval = setInterval(function(){
      this.secondsCounter++
      if (this.secondsCounter === this.model.get("length")) {
        this.model.pause();
        Capstone.currentSong = nil;
      }
      console.log(this.secondsCounter)
    }.bind(this), 1000)
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);
    this.attachSubviews();
    return this;
  },

  wrapUpSong: function () {
    clearInterval(this.digInterval)
    $("#dig-button").off("click");
    //Can't do this here b/c won't be able to continue playing
    // Capstone.currentSong = null;
    this.model.save({}, {silent: true});
  }
});
