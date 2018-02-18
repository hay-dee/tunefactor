class VerificationProcess {
  constructor(songs) {
    this.songs        = songs;
    this.currentSongs = [];
    this.one          = "";
    this.two          = "";
    this.three        = "";
    this.score        = 0;
    this.attempt      = 0;
  }

  static extractSongData(song) {
    return {
             id:         song.id,
             name:       song.name.replace(/\s?\(.+?\)\s?/g, " ").trim(),
             previewURL: song.preview_url,
             coverArt:   song.album.images.reduce((smallest, next) => smallest.height > next.height ? next : smallest).url,
             artists:    song.artists.map(a => a.name).reduce((ns, n) => `${ns}, ${n}`)
           };
  }

  static shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
  }

  getSongs() {
    const groupSize = Math.floor(this.songs.length / 3);

    this.currentSongs[0] = this.songs[Math.floor(groupSize * Math.random())];
    this.currentSongs[1] = this.songs[Math.floor(groupSize * Math.random()) + groupSize];
    this.currentSongs[2] = this.songs[Math.floor(groupSize * Math.random()) + (groupSize * 2)];
    
    this.one   = this.currentSongs[0].id;  // spotify ID for the track
    this.two   = this.currentSongs[1].id;
    this.three = this.currentSongs[2].id;

    console.dir(this.currentSongs.map(s => s.name));

    return VerificationProcess.shuffle(this.currentSongs.map(VerificationProcess.extractSongData));
  }

  updateScore(orderedSongs) {
    // returns -1 < n < 1 
    //  where n > 0.5 means the user is verified

    this.attempt++;

    const roundScore = this.getRoundScore(orderedSongs);
    const multiplier = ((roundScore < 0) ? 1.3 : 0.7) ** (this.attempt - 1);
    
    this.score += roundScore * multiplier;

    return this.score;
  }

  getRoundScore(orderedSongs) {
    // returns a score for the round
    // 0   = half correct
    // +ve = mostly correct
    // -ve = mostly wrong
    
    if (orderedSongs[0] == this.one) {
      if (orderedSongs[1] == this.two) return 0.5;

      return 0.3;
    }

    if (orderedSongs[0] == this.two) {
      if (orderedSongs[1] == this.one) return 0.1;

      else return -0.1;
    }

    if (orderedSongs[1] == this.one) return -0.3;

    return -0.5;
  }

}

module.exports = VerificationProcess;


