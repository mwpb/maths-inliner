JXG.Options.text.display = 'internal';
var b = JXG.JSXGraph.initBoard('box', {boundingbox: [-0.1, 1.1, 1.5, -1.1], axis:true,showCopyright:false,showNavigation:false});

function f(x) {
    return Math.sqrt(1-x*x);
}
var p = b.create('point',[0.75,f(0.75)],{withLabel:false});
var x = b.create('point',[function(){return p.X();},0],{visible:false, withLabel:false});

b.on('move',function(){
	if (p.X() < 0.65 ) {
		p.moveTo([0.65,f(p.X())]);
	}
	if (p.X() > 0.9 ) {
		p.moveTo([0.9,f(p.X())]);
	}
	p.moveTo([p.X(),f(p.X())]);
});

var R = b.create('point',[1,0],{visible:false,withLabel:false});
var zero = b.create('point',[0,0],{fixed:true,withLabel:false,visible:false});
b.create('circle',[[0,0],1],{fixed:true,strokeWidth:1});
b.create('angle',[R,zero,p],{withLabel:true, radius:0.15,color:"#00cc00",name:"a",fontSize:15});

var opP =  b.create('point',[function(){return p.X();},function(){return -f(p.X());}],{visible:false, withLabel:false});
var opAngle = b.create('angle',[opP,zero,R],{visible:false, radius:0.15,color:"#00cc00",name:"a",fontSize:15});
var opSin = b.create('segment',[x,opP],{color:"#00cc00",withLabel:false,name:"sin(a)",label:{offset:[-45,0],fontSize:12}});
var opL = b.create('segment',[zero,opP],{color:"#D3D3D3"});

var arc = b.create('arc',[zero,opP,p],{strokeColor:"#000000",strokeWidth:2});

var sin = b.create('segment',[x,p],{color:"#00cc00",withLabel:false,name:"sin(a)",label:{color:"#00cc00",offset:[-34,0],fontSize:12}});

var l = b.create('segment',[zero,p],{color:"#D3D3D3"});

//tangent

var fullTangent = b.create('line',[R,[1,1]],{visible:false,color:"#000000"});

var t = b.create('intersection',[l,fullTangent],{visible:false,withLabel:false});
var filler = b.create('segment',[p,t],{visible:false,color:"#D3D3D3"});
var tangent = b.create('segment',[R,t],{color:"#FFA500",visible:false,withLabel:true,name:"tan(a)",label:{color:"#FFA500"}});

//secant

var fullSecant = b.create('line',[zero,t],{color:"#000000",visible:false});
var secant = b.create('segment',[zero,t],{withLabel:true, name:"sec(a)",color:"#ff0000",visible:false,label:{offset:[-40,10],color:"#ff0000"}});


//functions

main0 = document.getElementById('main0');
main1 = document.getElementById('main1');
main2 = document.getElementById('main2');
main3 = document.getElementById('main3');
main4 = document.getElementById('main4');

var currentStep = 0;

function nextStep(inc) {
	currentStep = currentStep + inc;
	console.log("currentStep = "+currentStep);
	if (currentStep === -1) {
		currentStep = 0;
	}
	if (currentStep === 6) {
		currentStep = 5;
	}
	setAllHidden();
	if (currentStep === 0) {
		sin.setAttribute({withLabel:false});
		setListsVisible([main0],[sin,arc,opSin,opL]);
	}
	if (currentStep === 1) {
		b.setBoundingBox([-0.1, 1.1, 1.5, -1.1]);
		b.update();
		sin.setAttribute({withLabel:true});
		setListsVisible([main0,main1],[sin]);
	}
	if (currentStep === 2) {
		b.setBoundingBox([-0.1,1.2,1.2,-0.1]);
		b.update();
		setListsVisible([main0,main1],[sin]);
	}
	if (currentStep === 3) {
		setListsVisible([main0,main1,main2],[sin,fullSecant]);
	}
	if (currentStep === 4) {
		setListsVisible([main0,main1,main2,main3],[sin,fullSecant,fullTangent]);
	}
	if (currentStep === 5) {
		setListsVisible([main0,main1,main2,main3,main4],[sin,secant,tangent]);
	}
}

var elementList = [main0,main1,main2,main3,main4];

var graphList = [arc,sin,opSin,t,filler,tangent,secant,opL,fullSecant,fullTangent];

function setAllHidden(){
	for (i=0;i<elementList.length;i++) {
		elementList[i].style.visibility = 'hidden';
	}
	for (i=0;i<graphList.length;i++) {
		graphList[i].setAttribute({visible:false});
	}
}

function setListsVisible(eles,graphs) {
	for (i=0;i<eles.length;i++) {
		eles[i].style.visibility = 'visible';
	}
	for (i=0;i<graphs.length;i++) {
		graphs[i].setAttribute({visible:true});
	}
}


function export2SVG(){
    var svg = new XMLSerializer().serializeToString(b.renderer.svgRoot);
    var blob = new Blob([svg], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "test.svg");
}
