JXG.Options.text.display = 'internal';
var brd = JXG.JSXGraph.initBoard('box', {boundingbox: [-10,10,10,-10], axis:false,showCopyright:false,showNavigation:false});

var a = brd.create('point',[-5,-5],{fixed:true,color:"#000000"});
var b = brd.create('point',[-3,5],{fixed:true,color:"#000000"});
var c = brd.create('point',[5,-5],{fixed:true,color:"#000000"});

var ab = brd.create('segment',[a,b],{color:"#000000"});
var bc = brd.create('segment',[b,c],{color:"#000000"});
var ca = brd.create('segment',[c,a],{color:"#000000"});

var d = brd.create('point',[(a.X()+b.X())/2,(a.Y()+b.Y())/2],{attractors: [ab], attractorDistance:0.01, snatchDistance: 50});
var e = brd.create('point',[(b.X()+c.X())/2,(b.Y()+c.Y())/2],{attractors: [bc], attractorDistance:0.01, snatchDistance: 50});
var f = brd.create('point',[(c.X()+a.X())/2,(c.Y()+a.Y())/2],{fixed:true,color:"#000000",attractors: [ca], attractorDistance:0.01, snatchDistance: 50});

var de = brd.create('segment',[d,e],{strokeColor:"#ff0000"});
var ef = brd.create('segment',[e,f],{strokeColor:"#ffff00"});
var fd = brd.create('segment',[f,d],{strokeColor:"#ffa500"});

var fprime = brd.create('reflection',[f,ab],{name:"F'",visible:false,color:"#000000"});
var fprimeprime = brd.create('reflection',[f,bc],{name:"F''",visible:false,color:"#000000"});

var fprimed = brd.create('segment',[fprime,d],{visible:false,strokeColor:"#ffa500"});
var fprimeprimee = brd.create('segment',[fprimeprime,e],{visible:false,strokeColor:"#ffff00"});

var fprimefprimeprime = brd.create('segment',[fprime,fprimeprime],{visible:false});
var dactual = brd.create('intersection',[fprimefprimeprime,ab],{visible:false});
var eactual = brd.create('intersection',[fprimefprimeprime,bc],{visible:false});

function perimeter() {
	return d.Dist(f)+f.Dist(e)+e.Dist(d);
}
var textPerimeter = brd.create('text',[2,8,function(){return "Perimeter = "+perimeter().toFixed(2)}],{fontSize:18})

var currentStage = 0;
var maxStage = 3;
var allHiddenEles = [fprime,fprimeprime,fprimed,fprimeprimee,fprimefprimeprime];
function hideEles(){
	for (var i=0;i<allHiddenEles.length;i++){
		allHiddenEles[i].setAttribute({visible:false});
	}
	return false;
}
function ge(eleIdList) {
	var newlist = eleIdList.map(function (x) {return document.getElementById(x);});
	return newlist;
}
var allHiddenTexts = ge(["main1","main2","main3"]);
function hideTexts(){
	for (var i=0;i<allHiddenTexts.length;i++){
		allHiddenTexts[i].style.visibility = 'hidden';
	}
	return false;
}
hideTexts();
var visList = [
{
	texts:ge(["main0"]),
	eles:[]
},
{
	texts:ge(["main0","main1"]),
	eles:[]
},
{
	texts:ge(["main0","main1","main2"]),
	eles:[fprime,fprimeprime,fprimeprimee,fprimed]
},
{
	texts:ge(["main0","main1","main2","main3"]),
	eles:[fprime,fprimeprime,fprimeprimee,fprimed,fprimefprimeprime]
}
]

function increment(inc) {
	currentStage = currentStage + inc;
	console.log("currentStage = "+currentStage)
	if (currentStage < 0) {
		currentStage = 0;
	}
	if (currentStage > maxStage) {
		currentStage = maxStage;
	}
	var visEles = visList[currentStage].eles;
	var visTexts = visList[currentStage].texts;
	hideEles();
	hideTexts();
	for (var i=0;i<visEles.length;i++){
		visEles[i].setAttribute({visible:true});
	}
	for (var i=0;i<visTexts.length;i++){
		visTexts[i].style.visibility = 'visible';
	}
}