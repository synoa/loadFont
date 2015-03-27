# LoadFont.js

A very basic script that loads CSS Font-files over Ajax and then adds them to
the `localStorage`.

### Usage

Call the `loadFont` function and pass in the two arguments: The Font Name (used as
key for localStorage) and the Font URL, used to fetch the font with Ajax.

### Font CSS files

The CSS files to load contain the classic `@font-face` and the font embedded as base64
string. You can create base64 strings from Font Files (ttf, woff, etc.) with the `openssl` command
line tool.

```
$ cat myfont.woff | opensll enc -base64 > myfontbase64.txt
```

myfontbase64.txt now contains the base64 string og myfont.woff. Next you need to create the actuall
CSS file containing the following:


```
@font-face {
  font-family: 'Font Name';
  font-weight: 300;
  src: url(data:font/woff;charset=utf-8;base64,[YOUR_BASE64_STRING]) format('woff');
}
```

  It's save to minify these CSS files so there are no line-breaks inside the Data String.

### Example 1: Single Font

```
loadFont('OpenSans', 'https://my.tld/assets/fonts/opensans.css');
```
### Example 2: Multiple Fonts

Multiple fonts can be loaded by passing an multi-dimensional Array to the `loadFont` function.
Each Array inside the passed Array is then passed to `loadFont`. `loadFont` will check if the font
is already saved, fetch it if it is not and otherwise load from localStorage.

```
loadFont([
  ['OpenSans', 'path/to/opensans.css'],
  ['SourceCodePro', 'path/to/sourcecodepro.css']
  ]);
```
