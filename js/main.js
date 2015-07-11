
// After Page is load
window.onload = function() {

  //Local Scope
  (function () {
    // Save
    'use strict';
    
    // VAR
    var xhr=null,  //multiples, 1 for each file to load
		xhr2 =null, xhr3=null, xhr4=null,
        bEl, // tmp Button Element Variable can be used several times
        buttonActionCreateCopies,
		buttonActionRandomcolors,
		buttonActionUsercolor,
		buttonActionNewTab,
		colorbuttonhandler,
		patharray=[];

    // Functions
	
	//fetch random rgb color using hsl sliders
	 function randomrgb(){
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
    function loadimage(filename, imagecount) {  //loadimage("media/drawing.svg",1);
		// Singleton only one xhr Element
		if (xhr === null){
			xhr = new XMLHttpRequest();
		}
	 
		//callback after AJAX worked
		xhr.onreadystatechange=function(){
			if((xhr.readyState==4)&&(xhr.status==200)){
				var el = document.getElementById("origsvg"+imagecount);
				while (el.firstChild) {
					el.removeChild(el.firstChild);
				}
				el.appendChild(xhr.responseXML.documentElement);
			}
		};

		xhr.open("GET",filename);
		// Following line is just to be on the safe side;
		// not needed if your server delivers SVG with correct MIME type
		xhr.overrideMimeType("image/svg+xml");
		xhr.send("");
    }
	function loadimages() {
		// Singleton only one xhr Element
		if (xhr === null){
			xhr = new XMLHttpRequest();
		}
		//callback after AJAX worked
		xhr.onreadystatechange=function(){
			if((xhr.readyState==4)&&(xhr.status==200)){
				var el = document.getElementById("origsvg1");
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
		/////////###################copy start
		xhr2 = new XMLHttpRequest();
		xhr2.onreadystatechange=function(){
			if((xhr2.readyState==4)&&(xhr.status==200)){
				var el2 = document.getElementById("origsvg2");
				while (el2.firstChild) {
					el2.removeChild(el2.firstChild);
				}
			el2.appendChild(xhr2.responseXML.documentElement);
			}
		};
		xhr2.open("GET","media/bird.svg");
		xhr2.send("");
		xhr3 = new XMLHttpRequest();
		xhr3.onreadystatechange=function(){
			if((xhr3.readyState==4)&&(xhr.status==200)){
				var el3 = document.getElementById("origsvg3");
				while (el3.firstChild) {
					el3.removeChild(el3.firstChild);
				}
			el3.appendChild(xhr3.responseXML.documentElement);
			}
		};
		xhr3.open("GET","media/colibrisimple.svg");
		xhr3.send("");
		xhr4 = new XMLHttpRequest();
		xhr4.onreadystatechange=function(){
			if((xhr4.readyState==4)&&(xhr.status==200)){
				var el4 = document.getElementById("origsvg4");
				while (el4.firstChild) {
					el4.removeChild(el4.firstChild);
				}
			el4.appendChild(xhr4.responseXML.documentElement);
			}
		};
		xhr4.open("GET","media/colibri.svg");
		xhr4.send("");
		//////////##################copy end
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
			//list element gets added to ul element from randomcolors()
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
	function randomcolors(target){ /*patharray drawing.svg = ["path1", "path2", "path3", "path5"]; */
		'use strict';
		//list element to add colorpickers to
		var list;
		//Source
		var el = document.getElementById("origsvg"+target).firstChild;
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
		//div capsules: [(svg  (colorpicker)) (svg (colorpicker)) ....]
		var svgdiv;
		var inputdiv;
		//label and text to identify correct svg for "open in new tab"
		var label, labeltext;
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
			cel.id = "picture"+i;
			patharray.forEach(function(entry){    //for each entry = pathID within patharray
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
			label=document.createElement("LI"); //first list node
			labeltext = document.createTextNode(cel.id); //text for first list node
			label.appendChild(labeltext);
			list.appendChild(label);
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
	buttonActionRandomcolors=function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         randomcolors(document.getElementById("target").value);
    };
	buttonActionNewTab=function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         show_svg("picture"+document.getElementById("nrOfCopies").value);
    };
    colorbuttonhandler=function(event){
      var tmp = event.target.id.split("_");
      // 1 SVG ID , 0 Path ID
      document.getElementById(tmp[1]).getElementById(tmp[0]).style.fill=event.target.value;
    };

    // Event-Listeners
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
	loadimages();
	
	
  })();
};