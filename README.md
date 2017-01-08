# Maths-inliner

Finds all MathJax inline and display formulas in an html file and replaces them with inline SVG images.

Useful when you want to display mathematics fast and/or when using Xamarin HybridWebView.

Allows the user to specify certain script tags (using the id="inline") to inline these scripts.
Similarly the attribute id="inline" will inline images.
(Tested only with SVG images at present.)

## Prerequistes

cheerio
fs
tex2svg

## Basic Usage

The exposed node script is called 'minliner'.
It requires 2 arguments: the infile and the outfile.

```
minliner infile.html outfile.html
```

## Implementation

Uses regex to locate inline and display mathematics.
Uses tex2svg to replace them with 
Uses Promises for everything async.




