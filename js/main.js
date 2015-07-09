
// After Page is load
window.onload = function() {
  //Local Scope
  (function () {
    // Save
    'use strict';
    
    // VAR
    var xhr=null,  
        bEl, // tmp Button Element Variable can be used several times
        buttonActionCreateCopies,
		buttonActionRandomcolors,
		buttonActionUsercolor,
		buttonActionNewTab,
		patharray=[];

    // Functions
	
	//fetch random rgb color
	 function randomrgb(){ //output: rgb(r,g,b)  huemin etc from sliders
		//var hmin = document.getElementById("huemin").value;
		//var hmax = document.getElementById("huemax").value;
		//var smin = document.getElementById("satmin").value;
		//var smax = document.getElementById("satmax").value;
		//var lmin = document.getElementById("lumin").value;
		//var lmax = document.getElementById("lumax").value;
	
		var hue = getRandomInt(document.getElementById("huemin").value, document.getElementById("huemax").value);
		var sat = getRandom(document.getElementById("satmin").value/100, document.getElementById("satmax").value/100);
		var light = getRandom(document.getElementById("lumin").value/100, document.getElementById("lumax").value/100);
		var col = chroma.hsl(hue, sat, light);
	
		return "rgb(" + col.rgb() + ")";
	}
	

	// returns a random int between min and max
	function getRandomInt(min, max) {
		var minimum = parseInt(min);
		var maximum = parseInt(max);
		var randomeins = parseInt(Math.random() * (maximum - minimum + 1)); //did not work when not split up
		var randomzwei = parseInt(randomeins + minimum);
	return randomzwei;
	}

	// returns a random float number between min and max
	function getRandom(min, max) {
		return Math.random() * (max - min) + min; 
	}
	
	 
    // Load Image with AjAX
    // TODO Choose which SVG File to load from server
    // LATER TODO upload possibility to server
    function loadimage() {
     // Singleton only one xhr Element
     if (xhr === null){
  	   xhr = new XMLHttpRequest();
     }

	 
     //callback after AJAX worked
     xhr.onreadystatechange=function(){
      if((xhr.readyState==4)&&(xhr.status==200)){
         var el = document.getElementById("origsvg");
         while (el.firstChild) {
           el.removeChild(el.firstChild);
         }
         el.appendChild(xhr.responseXML.documentElement);
      }
     };

  	 xhr.open("GET","media/drawing.svg");
  	 // Following line is just to be on the safe side;
  	 // not needed if your server delivers SVG with correct MIME type
  	 
     xhr.overrideMimeType("image/svg+xml");
  	 
     xhr.send("");
    }

    //Function cloneSVG 
    //cloneSVG tree
    function cloneSVG(){

      //Source
      var el = document.getElementById("origsvg").firstChild;
      //Clone Variable
      var cel = null;
      //Append Clone
      var pdest = document.getElementById("dest_clone");
      //Delete All nested elements
      while (pdest.firstChild) {
        pdest.removeChild(pdest.firstChild);
      }
      // Get Nr of copies to do
      var cnumEl = document.getElementById("nrOfCopies");
      var cnum  = parseInt(cnumEl.value);

      //insert nested cloned copy

      for (var i = cnum; i > 0; i--) {
        cel = el.cloneNode(true);
        pdest.appendChild(cel);
      };

    }
	//Usercolor is not defined
	/*
	function usercolor(element) { //on change function for color pickers, id of picker = element=path1svgnr1  list id = "list"+ svgcounter;
		var pathname = element.slice(0,5);
		var childofsvg = element.slice(5,11).replace("svgnr", "list");
		var svgDoc = document.getElementById(childofsvg).parentNode; //element is 0
		var newcolor = document.getElementById(element).value;
		var svgItem = svgDoc.getElementById(pathname);
		svgItem.style.fill = newcolor;
	//document.getElementById("list1").parentNode.getElementById("path1").style.fill = document.getElementById("path1svgnr1").value;
	}	
	*/
	//Randomize colors
	
	function randomcolors(){ /*patharray drawing.svg = ["path1", "path2", "path3", "path5"]; */
	
		function fillpatharray(){ //Make array of pathnames, checks only from 0 to 100
			var fi = 0;
			var arraypath;
			var arraypos =0;
			while (fi < 100) {
					arraypath = "path" + fi.toString();
					//only get path if path exists, else skip
					if(el.getElementById(arraypath) != null){ //el is sourceSVG from randomcolors()
						patharray[arraypos]=arraypath;
						arraypos++;
					}
			fi++;
			}
		
		}	
		function makecolorpickers(){ //make color picker list 
			var getcolor; 
			var input; 
			patharray.forEach(function(entry){
				getcolor = cel.getElementById(entry).style.fill;
				input = document.createElement("input"); //input type color
				input.type = "color";
				input.value = chroma.hex(getcolor);
				input.id = patharray[entry]+"svgnr"+svgcounter;
				input.setAttribute("onchange", "usercolor(this.id)");
				//TODO ist ul mit child input, sollte? ul mit child li mit child input sein?
				document.getElementById("list"+ svgcounter).appendChild(input);
			});
		}
		//counter for IDs for colorpickers
		var svgcounter=1;
		//list element to add colorpickers to
		var list;
      //Source
      var el = document.getElementById("origsvg").firstChild;
      //Clone Variable
      var cel = null;
      //Append Clone
      var pdest = document.getElementById("dest_clone");
	  //colorpath
	  var colorpath;
	  //get list of existing path ids
	  fillpatharray();
	  //delete list ID counter
	  svgcounter=1;
      //Delete All nested elements
      while (pdest.firstChild) {
        pdest.removeChild(pdest.firstChild);
      }
      // Get Nr of copies to do
      var cnumEl = document.getElementById("nrOfCopies");
      var cnum  = parseInt(cnumEl.value);

      //insert nested cloned copy

      for (var i = cnum; i > 0; i--) {
        cel = el.cloneNode(true);
		patharray.forEach(function(entry){
			colorpath = cel.getElementById(entry);
			colorpath.style.fill = randomrgb();
		});
		
        pdest.appendChild(cel);
		list = document.createElement("UL"); 
		list.id = "list"+ svgcounter;
		pdest.appendChild(list);
		makecolorpickers();
		svgcounter ++;
      };

    }
	
	function show_svg() { //opens either svg or colorpicker in new tab. svg when in "quantity" odd number 
    var serializer = new XMLSerializer();
    var svg_blob = new Blob([serializer.serializeToString(document.getElementById("list1").parentNode.childNodes[document.getElementById("nrOfCopies").value-1])],
                            {'type': "image/svg+xml"});
    var url = URL.createObjectURL(svg_blob);

    var svg_win = window.open(url, "svg_win");
      }
  	 

    // Callback-Functions

    buttonActionCreateCopies=function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         cloneSVG()

    };
	buttonActionRandomcolors=function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         randomcolors()

    };
	buttonActionNewTab=function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         show_svg()
    };
	
	
	//TODO convert
	function buttonActionUsercolor() { 
	//var pathname = element.slice(0,5); //element = patharray[entry]+"svgnr"+svgcounter
	//var bildname = element.slice(5,10);
	//var ucolsvgDoc = document.getElementById("list1").parentNode;
	//x is new value of colorpicker
    //var ucolsvgItem = document.getElementById("list1").parentNode.getElementById("path1");
	document.getElementById("list1").parentNode.getElementById("path1").style.fill = document.getElementById("path1svgnr1").value;
	
}

    // Event-Listeners

    bEl = document.getElementById("bCreateCopies");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionCreateCopies);
    } else {
        bEl.attachEvent("click", buttonActionCreateCopies);
    }
	bEl = document.getElementById("bRandomcolors");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionRandomcolors);
    } else {
        bEl.attachEvent("click", buttonActionRandomcolors);
    }
	bEl = document.getElementById("bNewTab");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionNewTab);
    } else {
        bEl.attachEvent("click", buttonActionNewTab);
    }
	/* evetlistener geht nicht weil svg noch nicht existiert
	bEl = document.getElementById("path1svgnr1"); // input id patharray[entry]+"svgnr"+svgcounter
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionUsercolor);
    } else {
        bEl.attachEvent("click", buttonActionUsercolor);
    }
	*/
    // Start here
    loadimage();
	
  })();
};