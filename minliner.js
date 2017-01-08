#!/usr/bin/env node
var htmlparser = require("htmlparser2");
var cheerio = require('cheerio');
var fs = require('fs');
var tex2svg = require( 'tex-equation-to-svg' );

var inputFilePath = process.argv[2];
var outputFilePath = process.argv[3];

function getSVGPromise(tex) {
    return new Promise(
	function(resolve,reject){
	    tex2svg(tex,function(error,svg){
		if (error) { throw error;}
		else {resolve(svg);}
	    }
		   )
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
	$('script[id="inline"]').each(
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
	$('img[id="inline"]').each(
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
	$('script[id="hide"]').each(
		function(index,element){
			var scriptString = $.html(element);
			scriptList.push(scriptString);
		}
		);
	return scriptList;
}

function hideScripts(str,hideList) {
	var outString = [str];
	for (var i=0;i<hideList.length;i++){
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
	var imgSrcFilePromiseList = imgSrcList.map(function(src){return getFilePromise(src);});

	var hideList = getHideScripts(outFile[0]);
	outFile[0] = hideScripts(outFile[0],hideList);

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

	Promise.all(inlineSVGPromiseList).then(inlineSVGList=>{
	Promise.all(srcFilePromiseList).then(srcFileList=>{
	Promise.all(imgSrcFilePromiseList).then(imgSrcFileList=>{
	Promise.all(displaySVGPromiseList).then(displaySVGList=>{
		console.log(inlineMathsList);
		console.log(displayMathsList);
		// console.log(imgSrcFileList);
		outFile[0] = replaceList(outFile[0],displayMathsList,displaySVGList,"<p style='text-align:center'>","</p>");
		outFile[0] = replaceList(outFile[0],inlineMathsList,inlineSVGList," "," ");
		outFile[0] = replaceList(outFile[0],imgList,imgSrcFileList," "," ");

		outFile[0] = replaceScripts(outFile[0],scriptList,srcFileList);
		// console.log(outFile[0]);
		fs.writeFile(outputFilePath,outFile[0]);
	});
	});
	});
	});
});
