
// After Page is load
window.onload = function() {

  //Local Scope
  (function () {
    // Save
    'use strict';
    
    // VAR
    var xhr=null,                 //XMLHttpRequest
		xhr2 =null, xhr3=null, xhr4=null, //multiples, 1 for each file to load
        bEl, // tmp Button Element Variable can be used several times
		buttonActionRandomcolors, //callback function for Button random colors
		buttonActionSimilar,      //callback function for Button Similar    
		buttonActionNewTab,       //callback function for Button NewTab
		buttonActionNewTabTOP,    //callback function for click on upper svg to open new tab
		colorbuttonhandler,       //callback function for Colorpickers
		svgclick,                 //callback function for click on generated svg (those below the buttons and sliders)
		patharray=[];             //list of existing path-IDs

    // Functions
	//fetch similar rgb , ignores sliders. Value in SVG is hex or rgb
	function similar(pathNR){ 
		var startpic = document.getElementById("origsvg"+document.getElementById("target").value).firstChild; //origsvgX is div containing original svg 
		var starthex = new chroma.color(startpic.getElementById(pathNR).style.fill,'hex'); //initializes chroma color element of type hex, style.fill can be non-hex
		var startrgb = starthex.rgb();                                           //converts to array of 3 numbers, rgb values
		var sr = getRandomInt(stay(startrgb[0]-50), stay(startrgb[0]+50));       //100 points range with starting value in the middle, stay makes negatives to 0 and too big numbers to 255
		var sg = getRandomInt(stay(startrgb[1]-50), stay(startrgb[1]+50));       //experiments have shown 50 works. Can be made smaller for more similarity
		var sb = getRandomInt(stay(startrgb[2]-50), stay(startrgb[2]+50));       //or bigger for more variation
		return "rgb(" + sr+","+sg+","+sb + ")";                                  // return string to go to style.fill of pathelement
	}
	
	//keep values within bounds during similar()
	function stay(test){ 
		if (test < 0) {
			return 0;
		}else{
			if (test > 250) {
				return 250;
			} else{
				return test;
			}
		}
	}

	//fetch random rgb color using hsl sliders
	function randomrgb(){
		var hue = getRandomInt(document.getElementById("huemin").value, document.getElementById("huemax").value);      //0 to 360 because color wheel, angle is color
		var sat = getRandom(document.getElementById("satmin").value/100, document.getElementById("satmax").value/100); //0 to 100 divided by 100 because needs to be percentage
		var light = getRandom(document.getElementById("lumin").value/100, document.getElementById("lumax").value/100); //neds to be percentage
		var col = chroma.hsl(hue, sat, light);                                                                         //initialize chroma element type hsl
		return "rgb(" + col.rgb() + ")";                                                                               //return as rgb because style.fill prefers rgb
	}

	// returns a random int between min and max
	function getRandomInt(min, max) {
		var minimum = parseInt(min);
		var maximum = parseInt(max);
		var randomeins = Math.round(Math.random() * (maximum - minimum)); 
		var randomzwei = randomeins + minimum;
		return randomzwei;
	}

	// returns a random float number between min and max
	function getRandom(min, max) {
		return Math.random() * (max - min) + min; 
	}
	 
    // Load Images with AjAX
    // TODO Choose which SVG File to load from server
    // LATER TODO upload possibility to server
	function loadimages() {
		// Singleton only one xhr Element
		if (xhr === null){
			xhr = new XMLHttpRequest();
		}
		//callback after AJAX worked
		xhr.onreadystatechange=function(){
			if((xhr.readyState==4)&&(xhr.status==200)){
				var el = document.getElementById("origsvg1");
				while (el.firstChild) {                                            //while there is a first child node
					el.removeChild(el.firstChild);                                 // delete it to get rid of old stuff
				}
				el.appendChild(xhr.responseXML.documentElement);                    //put newly loaded svg there
			}
		};

		xhr.open("GET","media/drawing.svg");
		// Following line is just to be on the safe side;
		// not needed if your server delivers SVG with correct MIME type
		xhr.overrideMimeType("image/svg+xml");
		xhr.send("");
		/////////###################copy start          this part is a copy of the above but for another image. Will be replaced by uploading function or
		//                                              ability to choose from files on a server.    
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
		//////////##################copy end                            copied part end
    }
	
	//make color picker list, append pickers as li-elements to ul from randomcolors(), is called once per svg-variant generated
	function makecolorpickers(cel){  
		var getcolor;                                        //color of pathelement
		var input;                                           //node type input type color
		var liEl;                                            //node type list
		patharray.forEach(function(entry){                   //entry is pathID, patharray is array of all paths of current svg file
			getcolor = cel.getElementById(entry).style.fill; //currentsvg.getElementById(pathid) color, is hex or rgb
			input = document.createElement("input");         //element type input 
			input.type = "color";                            //input type color to make predefined colorpicker
			input.value = chroma.hex(getcolor);              //starting color of corresponding path, needs to be hex for colorpicker
			input.id = entry+"_"+cel.id;                     //id is pathID_SVGID

			// add eventlistener to input button
			if(input.addEventListener){
			  input.addEventListener("change", colorbuttonhandler);
			} else {
			  input.attachEvent("change", colorbuttonhandler);
			}
			//list element gets added to ul element from randomcolors()
			liEl = document.createElement("LI");           //create element type list
			document.getElementById("list"+cel.id).appendChild(liEl); //find element with ID listcurrentSVG, which is container ul for colorpickers and append li element
			liEl.appendChild(input);                       //append colorpicker to li element                           
		});
    }

   function fillpatharray(el){    //Make array of pathnames, checks only from 0 to 100
      var fi = 0;                 //counter, if paths start at high numbers (inkcscape) put this to lowest path number
      var arraypath;
      var arraypos =0;           
      var tmp = [];               //array to be filled  
      while (fi < 100) {          // if highest path number bigger than 100 increase this number
          arraypath = "path" + fi.toString(); //create ID to test
          //only get path if path exists, else skip
          if(el.getElementById(arraypath) != null){ //el is sourceSVG from randomcolors()
            tmp[arraypos]=arraypath;          //save existing ID in array
            arraypos++;
          }
      fi++;
      }
      return tmp;
    } 

	//Randomize colors
	function randomcolors(target, simil){ /*patharray drawing.svg = ["path1", "path2", "path3", "path5"]; */
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
		//div capsules: [((svg)  (colorpicker)) ((svg) (colorpicker)) ....]
		var svgdiv, inputdiv, picdiv;
		//label and text to identify correct svg for "open in new tab", is the same as ID of svg
		var label, labeltext;
		//get list of existing path ids
		patharray=fillpatharray(el);
		//Delete All nested elements in "resulting svg" container div, these are old svgs and we will make new ones
		while (pdest.firstChild) {
		  pdest.removeChild(pdest.firstChild);
		}
		// Get Nr of copies to do
		cnumEl = document.getElementById("nrOfCopies");
		cnum  = parseInt(cnumEl.value);

		//insert nested cloned copy
		for (var i = cnum; i > 0; i--) {
			cel = el.cloneNode(true);                       //clone Source svg, true means all children get cloned too, children are pathelements, these make up the picture
			cel.id = "picture"+i;                           //new ID because it's a new picture
			patharray.forEach(function(entry){              //for each entry = pathID within patharray
				colorpath = cel.getElementById(entry);      //path to be recolored
				if(simil){                                  //this is true if the similar-button was pressed and false if the variants button was pressed 
					colorpath.style.fill = similar(entry);  //similar will check designated source svg to get starting values
				}else{
					colorpath.style.fill = randomrgb();     //randomrgb will check sliders to get random ranges
				}
			});
			inputdiv = document.createElement("div");       //div for colorpickers to have them besides svg
			inputdiv.className = "leftflow";                //makes everything flow left which looks nice and it arranges itself to the windowsize
			picdiv = document.createElement("div");         //div for picture to add eventlistener to
			picdiv.className = "leftflow";
			svgdiv = document.createElement("div");         //div for svg and inputdiv to keep svg besides its colorpickers
			svgdiv.className = "leftflow";
			// add eventlistener to svg element cel
			if(picdiv.addEventListener){
				picdiv.addEventListener("click", svgclick);
			} else {
				picdiv.attachEvent("click", svgclick);
			}
			pdest.appendChild(svgdiv);               //This part will look like this: destclone{ svgdiv[ picdiv() inputdiv() ] }
			picdiv.appendChild(cel);                                                   
			svgdiv.appendChild(picdiv);                                           
			svgdiv.appendChild(inputdiv);             
			list = document.createElement("UL");     //ul-element for list of inputs created in makecolorpickers
			list.id = "list"+ cel.id;
			inputdiv.appendChild(list);
			label=document.createElement("LI");      //first list node, the one with the label
			labeltext = document.createTextNode(cel.id); //text for first list node
			label.appendChild(labeltext);
			list.appendChild(label);
			makecolorpickers(cel);                    //now it will look like this: destclone{ svgdiv[ picdiv( cel) inputdiv( ul{ Li}) ] }
		};                                            //makecolorpickers will add more li-elements with colorpickers in them to ul 
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
         randomcolors(document.getElementById("target").value, false); //false because this is not the similar chain, this is the sliders chain
    };
	buttonActionSimilar=function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         randomcolors(document.getElementById("target").value, true); //true because this is the similar chain and not the sliders chain
    };
	buttonActionNewTab=function(event){                               //new tab version started by button
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         show_svg("picture"+document.getElementById("nrOfCopies").value);
    };
	buttonActionNewTabTOP=function(event){                             //Variant for new tab by clicking on svg in top row
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;
         show_svg(event.target.parentNode.id);                         //could be used for other clicked stuff but the other svg have a different click behavior, svgclick
    };
    colorbuttonhandler=function(event){                                //gets added to colorpickers
      var tmp = event.target.id.split("_");
      // 1 SVG ID , 0 Path ID
      document.getElementById(tmp[1]).getElementById(tmp[0]).style.fill=event.target.value;
    };
	svgclick=function(event){
		var tmp = event.target.parentNode.id;                          //Needs mouse aiming to occupied image areas otherwise target is not an svg-path element and bug starts
		var tmpID = document.getElementById("origsvg"+document.getElementById("target").value).firstChild.id;
		var oldsvg = document.getElementById("origsvg"+document.getElementById("target").value);
			while (oldsvg.firstChild) {
				oldsvg.removeChild(oldsvg.firstChild);
			}
		var newsvg = document.getElementById(tmp).cloneNode(true);
		newsvg.id = tmpID;                                             //use ID of the old svg
		oldsvg.appendChild(newsvg);
    };

    // Event-Listeners 
	bEl = document.getElementById("bRandomcolors");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionRandomcolors);
    } else {
        bEl.attachEvent("click", buttonActionRandomcolors);
    }
	bEl = document.getElementById("bSimilar");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionSimilar);
    } else {
        bEl.attachEvent("click", buttonActionSimilar);
    }
	bEl = document.getElementById("bNewTab");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionNewTab);
    } else {
        bEl.attachEvent("click", buttonActionNewTab);
    }
	bEl = document.getElementById("origsvg1");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionNewTabTOP);
    } else {
        bEl.attachEvent("click", buttonActionNewTabTOP);
    }
	bEl = document.getElementById("origsvg2");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionNewTabTOP);
    } else {
        bEl.attachEvent("click", buttonActionNewTabTOP);
    }
	bEl = document.getElementById("origsvg3");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionNewTabTOP);
    } else {
        bEl.attachEvent("click", buttonActionNewTabTOP);
    }
	bEl = document.getElementById("origsvg4");
    if(bEl.addEventListener){
                 bEl.addEventListener("click", buttonActionNewTabTOP);
    } else {
        bEl.attachEvent("click", buttonActionNewTabTOP);
    }
    // Start here
	loadimages();
  })();
};