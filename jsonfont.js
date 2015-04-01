var insertFont = function(value) {
      // create a new style element
    var style = document.createElement('style');
    // give it a unique ID
    style.id = 'font_' + md5Checksum;
    // set it's type
    style.type = 'text/css';
    // Append it to the head
    document.head.appendChild(style);
    // And write in the CSS from localStorage
    style.textContent = value;
}

var fetchFont = function(url) {
  var http = new XMLHttpRequest();
  http.open('GET', url, true);
  http.onreadystatechange = function() {
    if(http.status === 200 && http.readyState === 4) {
      var res = JSON.parse(http.response);
      localStorage.setItem(fontKey, JSON.stringify(res));
      insertFont(res.styles);
    }
  }
  http.send();
}