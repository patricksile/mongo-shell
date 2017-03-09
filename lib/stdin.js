const EventEmitter = require('events');

class StdIn extends EventEmitter {
  constructor(stream) {
    super();

    this._stream = stream;
    this._paused = false;
    const self = this;

    for (var name in this._stream) {
      if (!this[name]) this[name] = this._stream[name];
    }

    this._stream.on('data', (data) => {
      if(!self._paused) self.emit('data', data);
    });

    this._stream.on('readable', () => {
      if(!self._paused) self.emit('readable');
    });

    this._stream.on('error', (err) => {
      if(!self._paused) self.emit('error', err);
    });

    this._stream.on('end', () => {
      if(!self._paused) self.emit('end');
    });

    this._stream.on('close', () => {
      if(!self._paused) self.emit('close');
    });

    this.isPaused = function() {
      return self._paused;
    }

    this.pause = function() {
      this._paused = true;
      return self;
    }

    this.resume = function() {
      this._paused = false;
      return self;
    }

    this.pipe = function(destination, options = {}) {
      self._stream.pipe(destination, options);
    }

    this.unpipe = function(destination) {
      self._stream.unpipe(destination);
    }

    this.unshift = function(chunk) {
      self._stream.unshift(chunk);
    }

    this.wrap = function(stream) {
      self._stream.wrap(stream);
    }

    this.setEncoding = function(encoding) {
      self._stream.setEncoding(encoding);
      return self;
    }

    this.read = function(size) {
      if(!self._paused) return self._stream.read(size);
      return '';
    }    
  }
}

module.exports = StdIn;