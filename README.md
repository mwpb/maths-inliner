# Maths-inliner

Finds all MathJax inline and display formulas in an html file and replaces them with inline SVG images.

Useful when you want to display mathematics fast and/or when using an embedded webview (e.g. Xamarin HybridWebView).

Allows the user to specify certain script tags (using the class="inline") to inline these scripts.
Similarly the attribute class="inline" will inline images.
(Tested only with SVG images at present.)

## Prerequistes

* cheerio
* fs
* mathjax-node

## Installation

```
npm install maths-inliner
```

or to install globally:

```
npm install -g maths-inliner
```

## Basic Usage

The exposed node script is called 'minliner'.
It requires 2 arguments: the infile and the outfile.

```
minliner infile.html outfile.html
```

In `infile.html` decorate the scripts and SVG images you would like to inline with `class="inline"` and those you would like to ignore with `class="hide"`.
(For instance if you have scripts calling MathJax it is best to hide these as the inliner doesn't use them.)

## Example

There is an example showing basic usage [here](test/inscribed.html).

## Implementation

Uses regex to locate inline and display mathematics.
Now uses mathjax-node to replace them with SVG code.
Uses Promises for everything async.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.