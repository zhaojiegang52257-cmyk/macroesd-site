/* Admin helpers: client-side image compression before upload */
(function () {
  'use strict';
  var input = document.getElementById('imgFiles');
  var info = document.getElementById('imgInfo');
  if (!input || !info) return;

  function compress(file) {
    return new Promise(function (resolve) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var maxW = 1400, scale = Math.min(1, maxW / img.width);
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        var out = c.toDataURL('image/webp', 0.85);
        URL.revokeObjectURL(url);
        if (out.indexOf('data:image/webp') !== 0) { resolve(file); return; } // browser without webp export
        var parts = out.split(',');
        var bin = atob(parts[1]);
        var arr = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        resolve(new File([arr], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' }));
      };
      img.onerror = function () { resolve(file); };
      img.src = url;
    });
  }

  input.addEventListener('change', function () {
    var files = Array.prototype.slice.call(input.files || []);
    if (!files.length) return;
    info.textContent = 'Compressing…';
    Promise.all(files.map(compress)).then(function (out) {
      var dt = new DataTransfer();
      var total = 0;
      out.forEach(function (f) { dt.items.add(f); total += f.size; });
      input.files = dt.files;
      info.textContent = files.length + ' photo(s), ~' + Math.round(total / 1024) + ' KB after compression - ready.';
    });
  });
})();
