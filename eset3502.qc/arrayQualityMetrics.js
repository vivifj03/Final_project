// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, true, true, true, false, true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false, true, false, false, true, true, false ];
var arrayMetadata    = [ [ "1", "GSM318410.CEL.gz", "1", "01/31/06 13:05:05" ], [ "2", "GSM318411.CEL.gz", "2", "01/31/06 14:54:11" ], [ "3", "GSM318412.CEL.gz", "3", "01/31/06 13:29:22" ], [ "4", "GSM318413.CEL.gz", "4", "01/31/06 14:42:14" ], [ "5", "GSM318414.CEL.gz", "5", "05/26/06 16:05:02" ], [ "6", "GSM318415.CEL.gz", "6", "05/26/06 15:53:30" ], [ "7", "GSM318416.CEL.gz", "7", "05/26/06 15:10:16" ], [ "8", "GSM318417.CEL.gz", "8", "05/26/06 13:11:40" ], [ "9", "GSM318418.CEL.gz", "9", "05/26/06 12:47:45" ], [ "10", "GSM318419.CEL.gz", "10", "05/26/06 14:30:00" ], [ "11", "GSM318420.CEL.gz", "11", "05/26/06 15:41:20" ], [ "12", "GSM318421.CEL.gz", "12", "05/26/06 14:18:14" ], [ "13", "GSM318422.CEL.gz", "13", "05/26/06 12:59:55" ], [ "14", "GSM318423.CEL.gz", "14", "05/26/06 14:04:42" ], [ "15", "GSM318424.CEL.gz", "15", "05/26/06 12:35:51" ], [ "16", "GSM318425.CEL.gz", "16", "12/08/05 14:04:38" ], [ "17", "GSM318426.CEL.gz", "17", "12/08/05 14:20:04" ], [ "18", "GSM318427.CEL.gz", "18", "12/08/05 15:34:56" ], [ "19", "GSM318428.CEL.gz", "19", "12/08/05 15:49:09" ], [ "20", "GSM318429.CEL.gz", "20", "12/08/05 14:40:25" ], [ "21", "GSM318430.CEL.gz", "21", "05/30/06 14:32:30" ], [ "22", "GSM318433.CEL.gz", "22", "05/30/06 14:08:28" ], [ "23", "GSM318436.CEL.gz", "23", "05/30/06 15:33:56" ], [ "24", "GSM318438.CEL.gz", "24", "05/30/06 13:02:47" ], [ "25", "GSM318439.CEL.gz", "25", "05/30/06 12:50:34" ], [ "26", "GSM318440.CEL.gz", "26", "05/30/06 15:57:46" ], [ "27", "GSM318441.CEL.gz", "27", "05/30/06 14:20:44" ] ];
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
