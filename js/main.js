
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
		patharray=[];

    // Functions
	//Make array of pathnames, checks only from 0 to 100
	function fillpatharray(){ 
	/*var fi = 0;
	var arraypath;
	var arraypos =0;
	
	var fillsvg = document.getElementById("origsvg").firstChild;
	alert(fillsvg.getElementById("path1").style.fill);
	while (fi < 100) {
			arraypath = "path" + fi.toString();
			//only get path if path exists, else skip
			if(fillsvg.getElementById(arraypath) != null){
						patharray[arraypos]=arraypath;
						arraypos++;
			}
			fi++;
			}
		*/
		patharray = ["path1", "path2", "path3", "path5"]; 
	}
	//fetch random rgb color
	 function randomrgb(){ //output: rgb(r,g,b)  huemin etc from sliders
		var hmin = document.getElementById("huemin").value;
		var hmax = document.getElementById("huemax").value;
		var smin = document.getElementById("satmin").value;
		var smax = document.getElementById("satmax").value;
		var lmin = document.getElementById("lumin").value;
		var lmax = document.getElementById("lumax").value;
	
		var hue = getRandomInt(hmin, hmax);
		var sat = getRandom(smin/100, smax/100);
		var light = getRandom(lmin/100, lmax/100);
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
	
		
	//Randomize colors
	
	function randomcolors(){

      //Source
      var el = document.getElementById("origsvg").firstChild;
      //Clone Variable
      var cel = null;
      //Append Clone
      var pdest = document.getElementById("dest_clone");
	  //colorpath
	  var colorpath;
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
			colorpath = el.getElementById(entry);
			colorpath.style.fill = randomrgb();
		});
		
        pdest.appendChild(cel);
      };

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

    // Start here
    loadimage();
	fillpatharray();
  })();
};