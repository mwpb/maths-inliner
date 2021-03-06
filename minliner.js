#!/usr/bin/env node
var cheerio = require('cheerio');
var fs = require('fs');
var mjAPI = require("mathjax-node");

var inputFilePath = process.argv[2];
var outputFilePath = process.argv[3];
var texFlag = process.argv[4];
var texEnabled = true;

if (texFlag != 'n') {
	texEnabled = true;
	console.log("tex enabled");
}
else {
	texEnabled = false;
	console.log("tex diabled");
}

mjAPI.config({
  MathJax: {
    // traditional MathJax configuration
  }
});
mjAPI.start();

function getSVGPromise(tex) {
    return new Promise(
	function(resolve,reject){
		mjAPI.typeset({
			math: tex,
			format: "TeX",
			svg:true,
			}, function (data) {
			if (data.errors) {
				reject(data.errors)
			}
			else {resolve(data.svg)}
			});
		}
    )
};

function getFilePromise(filePath){
return new Promise(
    function(resolve,reject){
	fs.readFile(filePath,{encoding:'utf8'},function(error,data){
	    if (error) {
		reject(error);
	    }
	    else {
		resolve(data);
	    }
	}
		)
    }
);
};

var inlinedStringPromise = getFilePromise(inputFilePath);

// function getScriptDictPromise(html){
// 	return new Promise(
// 		function(resolve,reject){
// 		jsdom.env(html,function(error,window){
// 			if (error) {
// 				reject(error);
// 			}
// 			else {
// 				var scriptList = window.document.getElementByTag('script');
// 				var scriptDict = {};
// 				for (i=0;i<scriptList.length;i++){
// 					var src = scriptList[i].getAttribute('src');
// 					scriptDict[src] = scriptList[i];
// 				}
// 				console.log(scriptDict);
// 				resolve(scriptDict);
// 			}
// 		}
// 		);
// 		}
// 		);
// }


function getInlineScripts(html){
	var $ = cheerio.load(html);
	var scriptList = [];
	var srcList = []
	$('script[class="inline"]').each(
		function(index,element){
			var source = $(element).attr('src');
			var scriptString = $.html(element);
			scriptList.push(scriptString);
			srcList.push(source);
		}
		);
	return [srcList, scriptList];
}

function getInlineImgs(html){
	var $ = cheerio.load(html);
	var scriptList = [];
	var srcList = []
	$('img[class="inline"]').each(
		function(index,element){
			var source = $(element).attr('src');
			var scriptString = $.html(element);
			scriptList.push(scriptString);
			srcList.push(source);
		}
		);
	return [srcList, scriptList];
}

function getHideScripts(html){
	var $ = cheerio.load(html);
	var scriptList = [];
	$('script[class="hide"]').each(
		function(index,element){
			var scriptString = $.html(element);
			scriptList.push(scriptString);
		}
		);
	return scriptList;
}

function hideScripts(str,hideList) {
	var outString = [str];
	for (var i=0;i<hideList.length;i++) {
		var newString = outString[0].replace(hideList[i],"");
		outString[0] = newString;
	}
	return outString[0];
}

function replaceScripts(str,findList,replaceList){
	var outString = [str];
	for (var i=0;i<findList.length;i++){
		var newSrcFile = replaceList[i].replace('</script>','<\\/script>');
		var newFileString = outString[0].replace(findList[i],'<script type="text/javascript">'+newSrcFile+'</script>');
		outString[0] = newFileString;
	}
	return outString[0];
}

function getInlineMaths(str){
	var reg = new RegExp('[^\\$]\\$([^\\$]+?)\\$[^\\$]','g');
	var matches = str.match(reg);
	if (matches == null) {return [];}
	var trimmedMatches = matches.map(function(tex){return tex.substring(1,tex.length-1);})
	return trimmedMatches;
}

function getDisplayMaths(str){
	var reg = new RegExp('\\$\\$(.+?)\\$\\$','g');
	var matches = str.match(reg);
	if (matches == null) {return [];}
	return matches;
}

function replaceList (str,findList,replaceList,prepend,postfix){
	var outString = [str];
	for (var i=0;i<findList.length;i++){
		var newFileString = outString[0].replace(findList[i],prepend+replaceList[i]+postfix);
		// console.log(prepend+replaceList[i]+postfix);
		outString[0] = newFileString;
	}
	return outString[0];
}

inScriptElement = false;
inlinedStringPromise.then(fileString => {
	var outFile = [fileString];

	var [srcList, scriptList] = getInlineScripts(outFile[0]);

	var srcFilePromiseList = srcList.map(function(src){return getFilePromise(src);});

	var [imgSrcList, imgList] = getInlineImgs(outFile[0]);
	console.log("img list = "+imgList);
	console.log("img src list = "+imgSrcList);
	var imgSrcFilePromiseList = imgSrcList.map(function(src){return getFilePromise(src);});

	var hideList = getHideScripts(outFile[0]);
	console.log("hide list = "+hideList)
	outFile[0] = hideScripts(outFile[0],hideList);

	if (texEnabled) {
		var inlineMathsList = getInlineMaths(outFile[0]);
		var inlineSVGPromiseList = inlineMathsList.map(function(tex){
			var trimmedTex = tex.substring(1,tex.length-1);
			return getSVGPromise(trimmedTex);
		});

		var displayMathsList = getDisplayMaths(outFile[0]);
		var displaySVGPromiseList = displayMathsList.map(function(tex){
			var trimmedTex = tex.substring(2,tex.length-2);
			return getSVGPromise(trimmedTex);
		});
	}
	Promise.all(srcFilePromiseList).then(srcFileList=>{
	Promise.all(imgSrcFilePromiseList).then(imgSrcFileList=>{
	Promise.all(inlineSVGPromiseList).then(inlineSVGList=>{
	Promise.all(displaySVGPromiseList).then(displaySVGList=>{
		if (texEnabled) {
			
			console.log("img list = "+imgSrcFileList);
			console.log(inlineMathsList);
			console.log(displayMathsList);

			outFile[0] = replaceList(outFile[0],displayMathsList,displaySVGList,"<p style='text-align:center'>","</p>");
			outFile[0] = replaceList(outFile[0],inlineMathsList,inlineSVGList," "," ");
		}

		outFile[0] = replaceList(outFile[0],imgList,imgSrcFileList," "," ");
		outFile[0] = replaceScripts(outFile[0],scriptList,srcFileList);
		console.log(displaySVGList)
		// console.log(outFile[0])
		fs.writeFileSync(outputFilePath,outFile[0]);
	});
	});
	});
	});
});
