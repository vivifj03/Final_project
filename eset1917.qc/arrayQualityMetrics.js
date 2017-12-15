// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, false, true, true, false, false, false, true, false, false, true, false, true, false, true, false, false, false, false, true, true, false, false, true, false, false, false, false ];
var arrayMetadata    = [ [ "1", "GSM92460.cel.gz", "1", "04/24/05 15:33:02" ], [ "2", "GSM92461.cel.gz", "2", "04/24/05 16:37:34" ], [ "3", "GSM92462.cel.gz", "3", "04/24/05 16:24:54" ], [ "4", "GSM92463.cel.gz", "4", "04/24/05 14:55:47" ], [ "5", "GSM92464.cel.gz", "5", "04/24/05 15:20:52" ], [ "6", "GSM92465.cel.gz", "6", "04/24/05 15:03:21" ], [ "7", "GSM92466.cel.gz", "7", "04/24/05 16:10:24" ], [ "8", "GSM92467.cel.gz", "8", "04/24/05 15:53:41" ], [ "9", "GSM92468.cel.gz", "9", "04/24/05 15:41:07" ], [ "10", "GSM92469.cel.gz", "10", "04/24/05 15:28:30" ], [ "11", "GSM92470.cel.gz", "11", "04/24/05 16:12:02" ], [ "12", "GSM92471.cel.gz", "12", "04/24/05 15:33:55" ], [ "13", "GSM92472.cel.gz", "13", "04/24/05 15:08:26" ], [ "14", "GSM92473.cel.gz", "14", "04/24/05 14:43:45" ], [ "15", "GSM92474.cel.gz", "15", "04/24/05 15:15:55" ], [ "16", "GSM92475.cel.gz", "16", "04/24/05 15:21:05" ], [ "17", "GSM92476.cel.gz", "17", "04/24/05 14:31:12" ], [ "18", "GSM92477.cel.gz", "18", "04/24/05 15:57:56" ], [ "19", "GSM92478.cel.gz", "19", "04/24/05 14:50:37" ], [ "20", "GSM92479.cel.gz", "20", "04/24/05 14:25:22" ], [ "21", "GSM92480.cel.gz", "21", "04/24/05 14:38:10" ], [ "22", "GSM92481.cel.gz", "22", "04/24/05 15:59:20" ], [ "23", "GSM92482.cel.gz", "23", "04/24/05 15:46:35" ], [ "24", "GSM92483.cel.gz", "24", "04/24/05 15:08:26" ], [ "25", "GSM92484.cel.gz", "25", "04/24/05 14:56:08" ], [ "26", "GSM92485.cel.gz", "26", "04/24/05 16:22:47" ], [ "27", "GSM92486.cel.gz", "27", "04/24/05 16:35:17" ], [ "28", "GSM92487.cel.gz", "28", "04/24/05 15:45:25" ] ];
var svgObjectNames   = [ "pca", "dens", "dig" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
	var success = false;
	i = 0; 
	/* Some of this looping could already be cached in reportInit() */
	while( (!success) & (i < ssrules.length) ) {
	    selector = ssrules[i].selectorText;  // The selector 
            if (!selector) 
		continue; // Skip @import and other nonstyle rules
            if (selector == (".aqm" + reportObjId)) {
		success = true; 
		ssrules[i].style.cssText = cssText[0+status];
	    } else {
		i++;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
