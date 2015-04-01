# LoadFont.js

Two scripts that loads CSS Font-files or JSON files over Ajax and then adds them to
the `localStorage`. 

## `inserFont()` and `fetchFont()`
##### Files: jsonfont.js / jsonfont.min.js

This technique is taken from [Dillon de
Voor](http://crocodillon.com/blog/non-blocking-web-fonts-using-localstorage) and increases load
speed for multiple files, however creating the JSON file can be tricky. Advantages of this technique
over loadFont are: 

* Handling of removing old fonts
* Single-Request for multiple fonts

### Creating the JSON file

Below you can see how to create the base64 encoded fonts and files. For this technique you'll need
to create the font files the same way and then combine each of them into a JSON file, the JSON looks
as below: 

```json
{
  "md5": "00ffe52a871eb3a9d97b87be11700409",
  "styles": "@font-face{font-family:'Open Sans'; font-weight: 300; src:
  url(data:data:application/x-font-ttf;base64,[BASE_64_STRING]) format('woff')}"  
}
```

This way you add all the styles to the `styles` key of the JSON file. Next you need to include the
MD5 checksum and the script into the page.

### Calling the two functions

```js
try {
  // try to access the stored fontKey
  cache = window.localStorage.getItem(fontKey);
  // if there is something
  if(cache) {
    // assign the parsed version to cache
    cache = JSON.parse(cache);
    // check if cache.md5 is equal to the md5 provided by the developer
    if(cache.md5 === md5Checksum) {
      // if so, insert the font from cache
      insertFont(cache.styles);
      // otherweise..
    } else {
      // remove the localStorage entry
      window.localStorage.removeItem(fontKey);
      // set back cache to null
      cache = null;
      // and fetch the Font
      fetchFont(fontUrl);
    }
    // if nothing is available
  } else {
    // make an Ajax Call and fetch the font.
    fetchFont(fontUrl);    
  }
}
catch(e) {
  // no localStorage   
}
```
Here we use a [`try
catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) to
check if the font is in localStorage. If it is, we check the md5 Checksum (more below) and include
the font if they match, otherwise we remove the item, reset `cache` and fetch the Font.

If it's the first visit, `cache` will be `undefined` and the else statement is called which will
fetch the JSON file, save it in localStorage and then extract the `styles` value.

### Create a MD5 checksum of files

With the `md5sum` function we can create md5 checksums for files, however what we need and want here is a sum of a bunch of files, namely all the files that are
combined in out `font.json` styles key. To archieve this we can call the `find` function to get all files in the directory (here `opensans_base64` that holds
the different stylesheets) and then `-exec`ute md5sum on every file. The different md5 sums are then piped to another call to md5sum that combines the sums and
creates a checksum of the checksums.

```bash
// create a checksum fot all files in the opensans_base64
// folder, then create a checksum from the different sums.
$ find opensans_base64 -type f -exec md5sum {} \; | md5sum
```

### Combining it all

This all leaves us with the following code snippet, combining the inline, minified `fetchFont` and `insertFont` functions and the `try catch` to call them.

```html
// inline, minified functions
var insertFont=function(a){var b=document.createElement("style");b.id="font_"+md5Checksum,b.type="text/css",document.head.appendChild(b),b.textContent=a},fetchFont=function(a){var b=new XMLHttpRequest;b.open("GET",a,!0),b.onreadystatechange=function(){if(200===b.status&&4===b.readyState){var a=JSON.parse(b.response);localStorage.setItem(fontKey,JSON.stringify(a)),insertFont(a.styles)}},b.send()};

// config variables

// the key used to identify the localStorage entry.
var fontKey = '_loadFont';

// path to the font.json file
var fontUrl = 'path/to/font.json';

// the sum that's also inside your font.json file
var md5checksum = '123456789456wqf524'
// initializing cache
var cache;

// use try-catch to call the functions
try {
  cache = window.localStorage.getItem(fontKey);
  if(cache) {
    cache = JSON.parse(cache);
    if(cache.md5 === md5Checksum) {
      insertFont(cache.styles);
    } else {
      window.localStorage.removeItem(fontKey);
      cache = null;
      fetchFont(fontUrl);
    }
  } else {
    fetchFont(fontUrl);    
  }
}
catch(e) {
  // no localStorage   
}

```

With this snippet we can load multiple fonts in one request and one file. There's also a validation (md5 sum) that the requested font is still the one we want
that can help us validate the font stored inside localStorage and also keeps the client's localStorage clean. `loadFont()`, however, **does not** handle the
removal of fonts! Use with caution. 

## `loadFont()`
### Usage

Call the `loadFont` function and pass in the two arguments: The Font Name (used as
key for localStorage) and the Font URL, used to fetch the font with Ajax.

### Font CSS files

The CSS files to load contain the classic `@font-face` and the font embedded as base64
string. You can create base64 strings from Font Files (ttf, woff, etc.) with the `openssl` command
line tool.

```bash
$ cat myfont.woff | opensll enc -base64 > myfontbase64.txt
```

myfontbase64.txt now contains the base64 string og myfont.woff. Next you need to create the actuall
CSS file containing the following:


```css
@font-face {
  font-family: 'Font Name';
  font-weight: 300;
  src: url(data:font/woff;charset=utf-8;base64,[YOUR_BASE64_STRING]) format('woff');
}
```

  It's save to minify these CSS files so there are no line-breaks inside the Data String.

### Example 1: Single Font

```js
loadFont('OpenSans', 'https://my.tld/assets/fonts/opensans.css');
```
### Example 2: Multiple Fonts

Multiple fonts can be loaded by passing an multi-dimensional Array to the `loadFont` function.
Each Array inside the passed Array is then passed to `loadFont`. `loadFont` will check if the font
is already saved, fetch it if it is not and otherwise load from localStorage.

```js
loadFont([
  ['OpenSans', 'path/to/opensans.css'],
  ['SourceCodePro', 'path/to/sourcecodepro.css']
  ]);
```
