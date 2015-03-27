/*
 * LoadFont()
 * A function to load fonts once and then store them inside
 * localStorage. Fonts need to be base64 encoded and inside a style
 * sheet.
 *
 * Example 1: Load single Font
 * loadFont('OpenSans', 'https://my.tld/assets/fonts/opensans.css');
 *
 * Example 2: Load Multiple fonts
 * loadFont([
 * 	['OpenSans', 'https://my.tld/assets/fonts/opensans.css'],
 *  ['SourceCodePro', 'https://my.tld/assets/fonts/sourcecodepro.css']
 * ]);
 *
 * Params (Example 1):
 * @param {String} - Font Name used as LocalStorage key
 * @param {String} - URL to Font CSS file
 *
 * Params (Example 2)
 * @param {Array} - Multi-dimension Array containing an Array with the
 * Parms explained above, e.g.
 * [['FontName', 'FontUrl']]
 */
function loadFont(fontName, fontUrl) {
  // Throw an error if one calls the script without any parameter.
  // This will not work!
  if(arguments.length === 0) {
    throw Error('Invalid number of arguments. 2 arguments required but 0 present.');
  }

  // check if the first argument is an array
  var isArray = fontName.constructor.toString().toLowerCase().indexOf('array') > -1;

  // if we've only one argument and it is an array,
  // it's likely a multi-load (see Example 2)
  if(arguments.length === 1  && isArray) {
    // loop through the array and assign the inner array to the
		// variable fontItem
    for(var i = 0; i <= fontName.length - 1, fontItem = fontName[i]; i++) {
      // Call loadFont with the two parameter from the array
      loadFont(fontItem[0], fontItem[1]);
    }
  }

  // If the FontName is not present inside localStorage and
  // the fontUrl is not undefine
  if(!localStorage.getItem(fontName) && fontUrl !== undefined) {
   		// start a new Ajax Request
      var xhr = new XMLHttpRequest();
			// Open the font URL
      xhr.open('GET', fontUrl, true);

    	// Listen to the readystatechange
      xhr.onreadystatechange = function() {
        // If we get a response that's not an error (Status 200)
				// and the readyState is 4 (OK)
        if(xhr.status === 200 & xhr.readyState === 4) {
          // Store the font in Local Storage
          localStorage.setItem(fontName, xhr.responseText);
          // and re-run the script to apply the changes.
          loadFont(fontName, fontUrl);
        }
      }
      // sent the Ajax request.
      xhr.send();
  }
  	// create a new style element
    var style = document.createElement('style');
  	// give it a unique ID
    style.id = 'loadFont' + fontName;
  	// set it's type
    style.type = 'text/css';
  	// Append it to the head
    document.head.appendChild(style);
  	// And write in the CSS from localStorage
    style.textContent = localStorage.getItem(fontName);
}
