# Maths-inliner

Finds all MathJax inline and display formulas in an html file and replaces them with inline SVG images.

Useful when you want to display mathematics fast and/or when using an embedded webview (e.g. Xamarin HybridWebView).

Allows the user to specify certain script tags (using the id="inline") to inline these scripts.
Similarly the attribute id="inline" will inline images.
(Tested only with SVG images at present.)

## Prerequistes

* cheerio
* fs
* tex2svg

## Installation

```
npm install maths-inliner
```

of to install globally:

```
npm install -g maths-inliner
```

## Basic Usage

The exposed node script is called 'minliner'.
It requires 2 arguments: the infile and the outfile.

```
minliner infile.html outfile.html
```

In `infile.html` decorate the scripts 

## Implementation

Uses regex to locate inline and display mathematics.
Uses tex2svg to replace them with SVG code.
Uses Promises for everything async.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.