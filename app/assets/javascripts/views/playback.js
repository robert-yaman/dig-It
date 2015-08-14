Capstone.Views.Playback = Backbone.CompositeView.extend({
  template: JST["playback"],

  initialize: function() {
    this.replaceQueue();
    this.replacePlaybackBar();
    this.replaceSongInfo();
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
  },

  playSong: function(song) {
    if (!this.$("nav").hasClass("active")) {
      this.$("nav").addClass("active");
      this.$("#dig-button").html("DIG")
    }

    if (Capstone.currentSong && Capstone.currentSong.id === song.id) {
      //unpause current song
      this.$(".audio-tag")[0].play();
    } else {
      this.$(".audio-tag").attr("src", song.escape("file_path"))
      this.$(".audio-tag")[0].play();

      Capstone.currentSong && Capstone.currentSong.trigger("pause");
      Capstone.currentSong = song;
      this.model = song;
      this.replacePlaybackBar();
      this.replaceSongInfo();
    }
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);
    this.attachSubviews();
    return this;
  }
});
