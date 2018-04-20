# tilelive-tar

A tar sink for tilelive. 

```
npm install tilelive-tar
```

## Usage

```js
var tilelive = require('tilelive')
var TarBackend = require('tilelive-tar')
TarBackend.registerProtocols(tilelive)

tilelive.load('somewhere://path/to/some/tiles', function (err, source) {
  if (err) throw err
  tilelive.load('tar://tiles.png', function (err, sink) {
    if (err) throw err
    var readStream = source.createReadStream({minzoom, maxzoom, bounds})
    var writeStream = sink.createWriteStream()
    readStream.pipe(writeStream)
    .on('error', console.error)
    .on('end', function () {
      // sink.pack is the finalized tar file 
      // as a streams2 read stream that can be piped anywhere
      sink.pack.pipe(process.stdout)
    })
  })
})
```
