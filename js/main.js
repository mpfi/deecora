
// After Page is load
window.onload = function() {

  //Local Scope
  (function () {
    // Save
    'use strict';
    
    // VAR
    //XMLHttpRequest
    var xhr = null,
    //multiples, 1 for each file to load 
    xhr2 = null, xhr3 = null, xhr4 = null, 
    // tmp Button Element Variable can be used several times
    bEl,
    //callback function for Button random colors 
    buttonActionRandomcolors, 
    //callback function for Button Similar 
    buttonActionSimilar,
    //callback function for click on upper svg to open new tab      
    buttonActionNewTabTOP,    
    //callback function for Colorpickers
    colorbuttonhandler,
    //callback function for click on generated svg (those below the buttons and sliders)
    svgclick,          
    //list of existing path-IDs   
    patharray = [];             

    // Functions
  //fetch similar rgb , ignores sliders. Value in SVG is hex or rgb
  function similar(pathNR){ 
    //origsvgX is div containing original svg 
    var startpic = document.getElementById("origsvg"+document.getElementById("target").value).firstChild; 
    //initializes chroma color element of type hex, style.fill can be non-hex
    var starthex = new chroma.color(startpic.getElementById(pathNR).style.fill,'hex');   
    //converts to array of 3 numbers, rgb values
    var startrgb = starthex.rgb();                             
    //100 points range with starting value in the middle, stay makes negatives to 0 and too big numbers to 255        
    var sr = getRandomInt(stay(startrgb[0]-50), stay(startrgb[0]+50));  
    var sg = getRandomInt(stay(startrgb[1]-50), stay(startrgb[1]+50));      
    var sb = getRandomInt(stay(startrgb[2]-50), stay(startrgb[2]+50)); 
    //experiments have shown 50 works. Can be made smaller for more similarity or bigger for more variation
    // return string to go to style.fill of pathelement
    return "rgb(" + sr+","+sg+","+sb + ")";                            
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
    //0 to 360 because color wheel, angle is color
    var hue = getRandomInt(document.getElementById("huemin").value, document.getElementById("huemax").value);  
    //0 to 100 divided by 100 because needs to be percentage
    var sat = getRandom(document.getElementById("satmin").value/100, document.getElementById("satmax").value/100); 
    //neds to be percentage
    var light = getRandom(document.getElementById("lumin").value/100, document.getElementById("lumax").value/100);   
    //initialize chroma element type hsl
    var col = chroma.hsl(hue, sat, light);         
    //return as rgb because style.fill prefers rgb                                                           
    return "rgb(" + col.rgb() + ")";                                                                         
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
    xhr.onreadystatechange = function(){
      if((xhr.readyState==4)&&(xhr.status==200)){
        var el = document.getElementById("origsvg1"); 
        //while there is a first child node
        while (el.firstChild) {                            
          //delete it to get rid of old stuff          
          el.removeChild(el.firstChild);                            
        }    
        //put newly loaded svg there
        el.appendChild(xhr.responseXML.documentElement);     
      }
    };

    xhr.open("GET","media/drawing.svg");
    // Following line is just to be on the safe side;
    // not needed if your server delivers SVG with correct MIME type
    xhr.overrideMimeType("image/svg+xml");
    xhr.send("");
    /////////###################copy start          
    //this part is a copy of the above but for another image. Will be replaced by uploading function or ability to choose from files on a server.    
    xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function(){
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
    xhr3.onreadystatechange = function(){
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
    xhr4.onreadystatechange = function(){
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
    //////////##################copy end   copied part end
    }
  
  //make color picker list, append pickers as li-elements to ul from randomcolors(), 
  //is called once per svg-variant generated
  function makecolorpickers(cel){   
    //color of pathelement
    var getcolor;                            
    //node type input type color 
    var input;                             
    //node type list
    var liEl;                                   
    //entry is pathID, patharray is array of all paths of current svg file
    patharray.forEach(function(entry){       
      //currentsvg.getElementById(pathid) color, is hex or rgb
      getcolor = cel.getElementById(entry).style.fill; 
      //element type input 
      input = document.createElement("input");     
      //input type color to make predefined colorpicker
      input.type = "color";                     
      //starting color of corresponding path, needs to be hex for colorpicker
      input.value = chroma.hex(getcolor);       
       //id is pathID_svgID
      input.id = entry+"_"+cel.id;              

      // add eventlistener to input button
      if(input.addEventListener){
        input.addEventListener("change", colorbuttonhandler);
      } else {
        input.attachEvent("change", colorbuttonhandler);
      }
      //list element gets added to ul element from randomcolors()  
      //create element type list
      liEl = document.createElement("LI");
      //find element with ID listcurrentSVG, which is container ul for colorpickers and append li element
      document.getElementById("list"+cel.id).appendChild(liEl); 
      //append colorpicker to li element 
      liEl.appendChild(input);                                           
    });
    }
   //Make array of pathnames, checks only from 0 to 100
   function fillpatharray(el){ 
      //counter, if paths start at high numbers (inkcscape) put this to lowest path number
      var fi = 0;           
      var arraypath;
      var arraypos = 0;    
      //array to be filled         
      var tmp = [];     
      // if highest path number bigger than 100 increase this number
      while (fi < 100) { 
          //create ID to test
          arraypath = "path" + fi.toString(); 
          //only get path if path exists, else skip
          //el is sourceSVG from randomcolors()
          if(el.getElementById(arraypath) != null){ 
            //save existing ID in array
            tmp[arraypos] = arraypath;         
            arraypos++;
          }
      fi++;
      }
      return tmp;
    } 

  //Randomize colors
  //patharray drawing.svg = ["path1", "path2", "path3", "path5"];
  function randomcolors(target, simil){ 
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
    //get list of existing path ids
    patharray = fillpatharray(el);
    //Delete All nested elements in "resulting svg" container div, these are old svgs and we will make new ones
    while (pdest.firstChild) {
      pdest.removeChild(pdest.firstChild);
    }
    // Get Nr of copies to do
    cnumEl = document.getElementById("nrOfCopies");
    cnum  = parseInt(cnumEl.value);

    //insert nested cloned copy
    for (var i = cnum; i > 0; i--) {
      //clone Source svg, true means all children get cloned too, children are pathelements, these make up the picture
      cel = el.cloneNode(true);          
      //new ID because it's a new picture       
      cel.id = "picture"+i;           
      //for each entry = pathID within patharray
      patharray.forEach(function(entry){  
        //path to be recolored
        colorpath = cel.getElementById(entry);       
        //this is true if the similar-button was pressed and false if the random-variants button was pressed 
        if(simil){           
          //similar will check designated source svg to get starting values
          colorpath.style.fill = similar(entry); 
        }else{
          //randomrgb will check sliders to get random ranges
          colorpath.style.fill = randomrgb(); 
        }
      });
      //div for colorpickers to have them besides svg
      inputdiv = document.createElement("div");  
      //makes everything flow left which looks nice and it arranges itself to the windowsize
      inputdiv.className = "leftflow";   
      //div for picture to add eventlistener to
      picdiv = document.createElement("div"); 
      picdiv.className = "leftflow";
      //div for svg and inputdiv to keep svg besides its colorpickers
      svgdiv = document.createElement("div");
      svgdiv.className = "leftflow";
      // add eventlistener to svg element cel
      if(picdiv.addEventListener){
        picdiv.addEventListener("click", svgclick);
      } else {
        picdiv.attachEvent("click", svgclick);
      }
      //This part will look like this: destclone{ svgdiv[ picdiv() inputdiv() ] }
      pdest.appendChild(svgdiv);            
      picdiv.appendChild(cel);                                                   
      svgdiv.appendChild(picdiv);                                           
      svgdiv.appendChild(inputdiv);       
      //ul-element for list of inputs created in makecolorpickers     
      list = document.createElement("UL");  
      list.id = "list"+ cel.id;
      inputdiv.appendChild(list);
      //now it will look like this: destclone{ svgdiv[ picdiv( cel) inputdiv( ul{ Li}) ] }  
      //makecolorpickers will add more li-elements with colorpickers in them to ul 
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
  buttonActionRandomcolors = function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         //false because this is not the similar chain, this is the sliders chain
         randomcolors(document.getElementById("target").value, false); 
    };
  buttonActionSimilar = function(event){
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false;  
         //true because this is the similar chain and not the sliders chain
         randomcolors(document.getElementById("target").value, true); 
    };
  //Variant for new tab by clicking on svg in top row
  buttonActionNewTabTOP = function(event){                           
      if ( event.preventDefault ) { event.preventDefault();}
         event.returnValue = false; 
         //could be used for other clicked stuff but the other svg have a different click behavior, svgclick
         show_svg(event.target.parentNode.id);               
    };
    //gets added to colorpickers
    colorbuttonhandler = function(event){                        
      var tmp = event.target.id.split("_");
      // 1 SVG ID , 0 Path ID
      document.getElementById(tmp[1]).getElementById(tmp[0]).style.fill = event.target.value;
    };
  svgclick = function(event){
    var tmp;
    if(event.target.nodeName == "path"){
        //event.target is path element, user clcked on picture
        tmp = event.target.parentNode.id;
    } else {
        if(event.target.nodeName == "svg"){
            //event.target is svg element, user clicked on transparent space around picture
             tmp = event.target.id;
        } else {
            if(event.target.nodeName == "DIV"){
                //event.target is div container of svg element, user clicked inside the tiny space between svg and not-click-listening rest of page
                tmp = event.target.firstChild.id;
            } else {
                //it should not be possible to reach another event target than the above three targets
                alert("error. Event target unsupported: "+event.target.nodeName);
            }
        }
    }
    var oldsvg = document.getElementById("origsvg"+document.getElementById("target").value);
    var tmpID = oldsvg.firstChild.id;
    while (oldsvg.firstChild) {
        oldsvg.removeChild(oldsvg.firstChild);
    }
    var newsvg = document.getElementById(tmp).cloneNode(true);
    //use ID of the old svg
    newsvg.id = tmpID;                                       
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