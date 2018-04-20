module.exports = TarBackend;

var tar = require('tar-stream')
var url = require('url')
var path = require('path')
var qs = require('querystring')

function TarBackend (uri, callback) {
  if (typeof uri === 'string') uri = url.parse(uri, true);
  else if (typeof uri.query === 'string') uri.query = qs.parse(uri.query);
  uri.query = uri.query || {};
  this.filetype = path.extname(uri.host) || '.png'
  this.basepath = uri.hostname.substring(0, uri.hostname.indexOf(this.filetype))
  this.safe = uri.query.safe === 'true';
  this.pack = tar.pack()
  callback(null, this)
  return undefined
}

TarBackend.registerProtocols = function(tilelive) {
  tilelive.protocols['tar:'] = TarBackend;
};

TarBackend.prototype.getPath = function(z, x, y, ext) {
  if (this.safe) {
    var col = String("000000" + x).slice(String(x).length);
    var row = String("000000" + y).slice(String(y).length);

    return path.join(this.basepath, String(z), col.slice(0, 3), col.slice(3, 6), row.slice(0, 3), row.slice(3, 6) + ext);
  } else {
    return path.join(this.basepath, String(z), String(x), String(y) + ext);
  }
}

TarBackend.prototype.getTile = function(z, x, y, callback) {
  return callback(new Error('TODO'))
}

TarBackend.prototype.getGrid = function(z, x, y, callback) {
  return callback(new Error('TODO'))
}

TarBackend.prototype.getInfo = function(callback) {
  return callback(new Error('TODO'))
}

TarBackend.prototype.startWriting = function(callback) {
  callback(null)
}

TarBackend.prototype.stopWriting = function(callback) {
    callback(null);
}

TarBackend.prototype.putInfo = function(info, callback) {
  var data = JSON.stringify(info)
  this.pack.entry({name: path.join(this.basepath, 'metadata.json')}, data, callback)
}

TarBackend.prototype.putTile = function(z, x, y, tile, callback) {
  var filename = this.getPath(z, x, y, this.filetype)
  this.pack.entry({name: filename}, tile, callback)
};

TarBackend.prototype.putGrid = function(z, x, y, grid, callback) {
  var data = JSON.stringify(grid)
  var filename = this.getPath(z, x, y, 'json')
  this.pack.entry({name: filename}, data, callback)
};

TarBackend.prototype.close = function(callback) {
  this.pack.finalize()
  callback(null);
}
