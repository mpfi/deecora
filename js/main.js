
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
		colorbuttonhandler,
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
		var randomeins = Math.round(Math.random() * (maximum - minimum)); //did not work when not split up
		var randomzwei = randomeins + minimum;
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
	
  function makecolorpickers(cel){ //make color picker list 
    var getcolor; 
    var input;
	var liEl;	
    patharray.forEach(function(entry){
		getcolor = cel.getElementById(entry).style.fill;
        input = document.createElement("input"); //input type color
        input.type = "color";
        input.value = chroma.hex(getcolor);
        input.id = entry+"_"+cel.id;

        // add eventlistener to input button
        if(input.addEventListener){
          input.addEventListener("change", colorbuttonhandler);
        } else {
          input.attachEvent("change", colorbuttonhandler);
        }
        //TODO ist ul mit child input, sollte? ul mit child li mit child input sein?
		liEl = document.createElement("LI");
		document.getElementById("list"+cel.id).appendChild(liEl);
        liEl.appendChild(input);
      });
    }

   function fillpatharray(el){ //Make array of pathnames, checks only from 0 to 100
      var fi = 0;
      var arraypath;
      var arraypos =0;
      var tmp = [];
      while (fi < 100) {
          arraypath = "path" + fi.toString();
          //only get path if path exists, else skip
          if(el.getElementById(arraypath) != null){ //el is sourceSVG from randomcolors()
            tmp[arraypos]=arraypath;
            arraypos++;
          }
      fi++;
      }
      return tmp;
    } 

	//Randomize colors
	function randomcolors(){ /*patharray drawing.svg = ["path1", "path2", "path3", "path5"]; */
		'use strict';
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
		// html-form element of nr copy field
		var cnumEl;
		// value of this element
		var cnum;
		//div capsules for (svg and colorpicker) and (colorpicker)
		var svgdiv;
		var inputdiv;
		//get list of existing path ids
		patharray=fillpatharray(el);
		//Delete All nested elements
		while (pdest.firstChild) {
		  pdest.removeChild(pdest.firstChild);
		}
		// Get Nr of copies to do
		cnumEl = document.getElementById("nrOfCopies");
		cnum  = parseInt(cnumEl.value);

		//insert nested cloned copy
		for (var i = cnum; i > 0; i--) {
			cel = el.cloneNode(true);
			cel.id = "clone"+i;
			patharray.forEach(function(entry){
				colorpath = cel.getElementById(entry);
				colorpath.style.fill = randomrgb();
			});
			inputdiv = document.createElement("div");  //div for colorpickers to have them besides svg
			inputdiv.className = "leftflow";
			svgdiv = document.createElement("div");  //div for svg and inputdiv to keep svg besides its colorpickers
			svgdiv.className = "leftflow";
			pdest.appendChild(svgdiv);
			svgdiv.appendChild(cel);
			svgdiv.appendChild(inputdiv);
			list = document.createElement("UL"); //ul-element for list of inputs created in makecolorpickers
			list.id = "list"+ cel.id;
			inputdiv.appendChild(list);
			makecolorpickers(cel);
		};
	}
	//opens colorpicker in new tab
	function show_svg(cloneID) {  
		var serializer = new XMLSerializer();
		var svg_blob = new Blob([serializer.serializeToString(document.getElementById(cloneID))],{'type': "image/svg+xml"});
		var url = URL.createObjectURL(svg_blob);
		var svg_win = window.open(url, "svg_win");
    }
  	 

    // Callback-Functions

    buttonActionCreateCopies=function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         cloneSVG();

    };
	buttonActionRandomcolors=function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         randomcolors();
    };
	buttonActionNewTab=function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         show_svg("clone"+document.getElementById("nrOfCopies").value);
    };
    colorbuttonhandler=function(event){
      var tmp = event.target.id.split("_");
      // 1 SVG ID , 0 Path ID
      document.getElementById(tmp[1]).getElementById(tmp[0]).style.fill=event.target.value;
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
	bEl = document.getElementById("bNewTab");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionNewTab);
    } else {
        bEl.attachEvent("click", buttonActionNewTab);
    }
    // Start here
    loadimage();
	
  })();
};