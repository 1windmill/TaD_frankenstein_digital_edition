// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: false,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});

// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_text.xsl").then(response => response.text())
      ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  // Initial document load
  documentLoader();
  statsLoader();
  // Event listener for sel1 change
  
  function selectHand(event) {
  
  //var visible_mary = document.getElementsByClassName('#MWS');
  //var visible_percy = document.getElementsByClassName('#PBS');
  var visible_mary = document.querySelectorAll('[data-hand = "#MWS"]'); //selection on the base of the "data-hand" custom attribute I created through .xsl; the "data-" prefix is considered good practice when creating custom attributes
  var visible_percy = document.querySelectorAll('[data-hand = "#PBS"]');
  //document.querySelectorAll('[data-foo="value"]');
  
  // Convert the HTMLCollection to an array for forEach compatibility
  var MaryArray = Array.from(visible_mary); //I think this transformation would not be considered essential anymore since querySelectorAll() returns an iterable, however I am keeping it in case I need to go back to a selection by class name.
  var PercyArray = Array.from(visible_percy);
  
      if (event.target.value == 'both') {
    //write a forEach() method that shows all the text written and modified by both hand (in black?). The forEach() method of Array instances executes a provided function once for each array element.
     MaryArray.forEach(function(element) {
         //element.style.visibility = 'visible';
         element.style.color = 'black';
         element.style.backgroundColor = 'white';
     });
     PercyArray.forEach(function(element) {
         //element.style.visibility = 'visible';
         element.style.color = 'black';
         element.style.backgroundColor = 'white';
     }); 
    } else  if (event.target.value == 'Mary') {
     //write an forEach() method that shows all the text written and modified by Mary in a different color (or highlight it) and the text by Percy in black. 
     MaryArray.forEach(function(element) {
         //element.style.visibility = 'visible';
         element.style.backgroundColor = 'lightBlue';
     });
     PercyArray.forEach(function(element) {
         element.style.color = 'grey';
         element.style.backgroundColor = 'white'
     });
    } else {
     //write an forEach() method that shows all the text written and modified by Percy in a different color (or highlight it) and the text by Mary in black.
    PercyArray.forEach(function(element) {
        //element.style.visibility = 'visible';
        element.style.color = 'black';
        element.style.backgroundColor = 'lightGreen';
    });
    MaryArray.forEach(function(element) {
        //element.style.visibility = 'visible';
        element.style.color = 'grey';
        element.style.backgroundColor = 'white'
    })
    }
  }

// write another function that will toggle the display of the deletions by clicking on a button

    var isDelHidden = false;
    var hideDelButton = document.getElementById('hideDelButton');
    
    hideDelButton.addEventListener("click", hideDel);
    
    function hideDel(event){
        var deletions = document.querySelectorAll('del');
        isDelHidden = !isDelHidden;
        if (isDelHidden){ 
            deletions.forEach(function(element){
                element.style.display = 'none';
            hideDelButton.textContent = "Show Deletions";
            })
        } else {
            deletions.forEach(function(element){
                element.style.display = 'inline';
            hideDelButton.textContent = "Hide Deletions"
            })
        }};

// EXTRA: write a function that will display the text as a reading text by clicking on a button or another dropdown list, meaning that all the deletions are removed and that the additions are shown inline (not in superscript)
        
        var isReadingModeActive = false;
        var readingModeButton = document.getElementById('toggleReadingModeButton');
        
        readingModeButton.addEventListener("click", toggleReadingMode);
        
        function toggleReadingMode(event){
            isReadingModeActive = !isReadingModeActive;
            
            var supralinearAdditions = document.getElementsByClassName('supraAdd');
            var supLinAddArray = Array.from(supralinearAdditions);
            
            var metamarks = document.getElementsByClassName('insertMetaM');
            var metamarksArray = Array.from(metamarks);
            //var whiteSpace = div.innerHTML += ' ';
            
            var deletions = document.querySelectorAll('del');
            
            if (isReadingModeActive) {
                supLinAddArray.forEach(function(element) {
                    element.style.verticalAlign = 'baseline';
                    element.style.fontSize = '1em';
                });
                metamarksArray.forEach(function(element) {
                    element.style.display = 'none';
                    var whiteSpace = document.createTextNode(' ');
                    element.parentNode.insertBefore(whiteSpace, element.nextSibling);
                });
                deletions.forEach(function(element){
                    element.style.display = 'none';
                readingModeButton.textContent = 'Standard View';
                });
            } else {
                supLinAddArray.forEach(function(element) {
                    element.style.verticalAlign = 'super';
                    element.style.fontSize = '0.75em';
                });
                metamarksArray.forEach(function(element) {
                    element.style.display = 'inline';
                    element.parentNode.removeChild(element.nextSibling);
                });
                deletions.forEach(function(element) {
                    element.style.display = 'inline';
                readingModeButton.textContent = 'Reading View';
                });
            }}