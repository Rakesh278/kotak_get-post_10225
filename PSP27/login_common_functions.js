var logoutFiredAlready = false;
var modalOpened = false;
var browser_name = navigator.appName;
var queryString = window.location.search;
var isPopupWin = (queryString.search("isPopUp")!=-1)?true:false;
var std_submit;
var TOGGLE_CALENDAR_BASE = null;
var TOGGLE_TIME_ZONE = null;
var switchCalArr = new Array();
var JSP_PARAMS_AVAILABLE = ".jsp?";
var formAlreadySubmitted = false;
var isConfirmDialogOpen="";
var aFlag = "Y";

var isChildSubmit= false;
var winOpen = null;
var winOpenTemp = null;
var unloadCounter = 0;

var finConst=
{
ONS_ROOT_MENU:"ONSMNU"
,CRV_ROOT_MENU:"HCRVMU"
,FAB_ROOT_MENU:"FABMNU"
,FAV_ROOT_MENU:"FAVMNU"
,HOME_MENU:"HOME"
,CRV_HOME_MENU:"HOME" 
,ONS_PREC:"O"
,FAB_PREC:"F"
,BOTH_PREC:"B"
,CRV_PREC:"C"
,URL_MENU:"U"
,MOD_MENU:"M"
,FINBRANCH:"finbranch"
,DELAYED_TIME:1000
,WEB:"WEB"
,ONS:"ONS"
,PUREONS:"PUREONS"
,DISPLAYPARENT:"DISPLAYPARENT"
,DOLOGOUT:"DOLOGOUT"
,CONTEXTSWITCH:"CONTEXTSWITCH"
,WFCRMCONTEXTSWITCH:"WFCRMCONTEXTSWITCH"
,APPLETFRAME:"finappl"
,FINFRAME:"FINW"
,DEVICEFRAME:"DEVICEFRAME"
,GLOBALJSFRAME:"GLOBALJSFRAME"
,COREAPPLET:"coreapplet"
,COREALERT:"corealert"
,SHOWAUTH:"SHOWAUTH"
,DORMANCY:"Dormancy"
,FINDTRANHISTORY:"findTransHistory"
,FORCED_LOGOUT:"F"
,NORMAL_LOGOUT:"N"
,ACTION_CANCEL:"cancel"
,LML_LOGIN_EVT:"lml_login"
,LML_LOGOUT_EVT:"lml_logout"
,LML_DCLOGOUT_EVT:"lml_dclogout"
,LML_FABLOGOUT_EVT:"lml_fablogout"
,FIN_SESS_ID:"finsessionid"
,FAB_SESS_ID:"fabsessionid"
,ACTION_CODE:"actionCode"
,FAB_SEC_TOKEN:"fabSecTok"
,FIN_SEC_TOKEN:"finSecTok"
,TOGGLE_CALENDAR:"lml_toggle"
,YES:"Y"
,NO:"N"
}

var modalWin = null;
var std_onerror = window.onerror;
window.onerror = function(msg, url, line, col, error){
	if (onsJSErrLogReqd != undefined && onsJSErrLogReqd == 'Y'){
        var req = new XMLHttpRequest();
        var params = "Error="+msg+"~URI="+url+"~LineNum="+line;
        params = encodeURIComponent(params).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/'/g, "%27");
        var bUrl = getBaseUrl();

        if(bUrl == "")
                url = "arjspmorph/logJSError.jsp?errMsg="+params;
        else
                url = bUrl+finContextPath+"/arjspmorph/logJSError.jsp?errMsg="+params;
			
		if(typeof(reqId) != "undefined"){
			url = url + "&reqId=" + reqId;
		}
		
		if(typeof(rtId) != "undefined"){
			url = url + "&rtId=" + rtId;
		}

        req.open("GET",url,true);
        req.send(params);
	}
}

// This Function Disables controls on a form.
function disableButtons(){
	var obj=document.forms[0].elements;
	var len=obj.length;
	for(var i=0;i<len;i++){
		switch(obj[i].type){
			case "button" :
			case "submit" :
			case "reset" :

			obj[i].disabled=true;
			break;
		}
	}
	if(this.WF_IN_PROGRESS == undefined || this.WF_IN_PROGRESS != "PEAS")
	{   
		disableTabs();
	}
}

//This function disables all the tabs
function disableTabs(){
    var sTabcss = get_lyr_css('sTab');
    var hTabcss = get_lyr_css('hTab');

    if ((hTabcss != undefined && hTabcss != null) && (sTabcss != undefined && sTabcss != null)){
        hTabcss.cssText = "position:absolute; visibility:visible;"
        sTabcss.cssText = "position:absolute; visibility:hidden;"
    }
}

function createReqParamToken(sFinal){
	if(sFinal.indexOf("&reqUnqId") != -1) {
		sFinal = removeParam(reqUnqId, sFinal);
	}
				
	var params_temp,params,dynSplit_array,decode_dynUrl;
	if(sFinal.indexOf("dynURL") == -1){
		params_temp = sFinal.substring(sFinal.indexOf("?")+1);
		params = params_temp.substring(0).split("&");
		params.push(rtId.substring(2, rtId.length -1));
		params.sort();
	}else{
		var dynUrl_temp = sFinal.substring(sFinal.indexOf("?")+1);
		dynSplit_array = dynUrl_temp.substring(0).split("&");
		for(var i=0;i<dynSplit_array.length;i++){
			if(dynSplit_array[i].indexOf('dynURL=') != -1){
				var dynURL = dynSplit_array[i].substr(0,dynSplit_array[i].indexOf('='));
				var dynURL_Value = dynSplit_array[i].substr(dynSplit_array[i].indexOf('=')+1);
				decode_dynUrl = decodeURIComponent(dynURL_Value);
				dynSplit_array.splice(i,1);
			}
		}
		var decodedynUrl = "dynURL="+decode_dynUrl; 
		dynSplit_array.push(decodedynUrl);
		params = dynSplit_array;
		params.push(rtId.substring(2, rtId.length -1));
		params.sort()
	}
	var hashOutput  = computeAdler32Hash(params);
	sFinal = sFinal + "&" +reqUnqId +"="+hashOutput;
	return sFinal;
}

var jsUtil = (function() {

		var submitFldTypeArr = {
			NO_ACTION : "0"
			,DEFAULT : "1"
			,ACTION_CODE : "2"
			,SUBMIT_FORM : "3"
			,TEXT_ACTION : "4"
			,END_TRAN  : "5"
		};

		function low_submit(frm) {
			enableFormElements();
			convertToCaps();
			hideAnchors();
			disableButtons();
			frm.submit();
		}	

        return{
				cancelEvent:function(evtObj) {
					if (!evtObj) {
						return;
					}

					//For browsers other than MSIE, preventDefault() will be defined.       

					if (evtObj.preventDefault){
						evtObj.preventDefault();
					}
					else{
						evtObj.cancelBubble=true;
						evtObj.returnValue=false; //for MSIE, returnValue should be set as false.
					}	
				},

				getType : function() {
					return submitFldTypeArr;
				},

				submit : function(actionValue, submitFldType, grpName) {
					
					var fldType = submitFldType;
					var locArr = submitFldTypeArr;
					var frm = document.forms[0];

					/* Added for localization */
					if(fldType != locArr.NO_ACTION) {
						 if(!fnLocaleValidateForm(actionValue)) return;
					}

					if ( fnIsNullOrUndefined(submitFldType) ) {
						fldType = submitFldTypeArr.DEFAULT;
					}

					switch(fldType) {
						
						case locArr.NO_ACTION:
							 break;

						case locArr.DEFAULT:
							frm.actionCode.value = actionValue;
							if (frm.submitform != undefined) {
								frm.submitform.value = actionValue;
							}
							break;

						case locArr.ACTION_CODE:
							frm.actionCode.value = actionValue;
							break;

						case locArr.SUBMIT_FORM:
							frm.submitform.value = actionValue;
							break;

						case locArr.TEXT_ACTION:
							frm.txtaction.value = actionValue;
							break;

						case locArr.END_TRAN:
							var jspAction = null;
							if (!fnIsNull(grpName)) {
								jspAction = "../" + grpName + "/" + grpName + "_ctrl.jsp";                
							}
							else
							{
								jspAction = document.forms[0].action;
								if (fnIsNull(jspAction)) {
									jspAction = "../" + CURR_GROUP_NAME + "/" + CURR_GROUP_NAME + "_ctrl.jsp"; 
								}
							}	

							jspAction = jspAction + "?rtId=" + rtId + "&actionCode=" + actionValue;
							if(typeof(reqId) != "undefined"){
								jspAction = jspAction + "&reqId=" + reqId;
							}
							if (frm.submitform != undefined) {
								submitInPost(jspAction + "&submitform=" + actionValue); 
							}
							else
							{
								submitInPost(jspAction); 
							}

							return true;

						default:
							alert("Invalid Submit Field Type Passed.");
							return false;
					}

					low_submit(frm);
					return true;
				},

				replaceLocation : function(sUrl) {
					submitInPost(jsUtil.formatUrl(sUrl));
					return true;
				},

                formatUrl:function(sUrl) {
                    var sTemp = sUrl;
                    var sFinal = sUrl;
                    var id1, id2;

                    id1 = sTemp.indexOf(".jsp?");
                    if(id1 != -1) {
		        if(typeof(reqId) == "undefined")
			{
				if(sUrl.indexOf("rtId=") == -1) {
					sFinal = sUrl + "&rtId=" + rtId;
				}
			}	
			else{			
				if(sUrl.indexOf("rtId=") == -1) {
					sFinal = sUrl + "&rtId=" + rtId;
				}
				if(sFinal.indexOf("reqId=") == -1) {
					sFinal = sFinal + "&reqId=" + reqId;
				}
			}    
                        sTemp = sFinal;
                    }
                    else {
                      	 if(typeof(reqId) == "undefined")
                         {
				if(sUrl.indexOf("rtId=") == -1) {
					sFinal = sUrl + "?rtId=" + rtId;
				}
			 }
			 else{		
				if(sUrl.indexOf("rtId=") == -1) {
					sFinal = sUrl + "?rtId=" + rtId;
				}
				if(sFinal.indexOf("reqId=") == -1) {
					sFinal = sFinal + "&reqId=" + reqId;
				}
                        } 
			sTemp = sFinal;
                    }

                    /* In DynUrl the char '?' is escaped and taken as '%3F'. %26 is char '&' */

                    id2 = sTemp.indexOf(".jsp%3F");
                    if(id2 != -1) {
                        sFinal = sTemp.substring(0, (id2+7)) + "rtId="+ rtId + "%26"  +sTemp.substring(id2+7);
                    }

		    if(reqParamValReqd=="Y") {
			sFinal = createReqParamToken(sFinal);
		    }
                return sFinal
                },
				encodeChar:function(str) {
			   		if(str == null || !isNaN(str))
					   	return str;

				   	if(fnTrim(str) == "")
						return str;

				   	var newStr = "";
				   	for (var i = 0; i < str.length; i++) {
					   	var uniChar = str.charAt(i);

				   		if (uniChar == "&") {
					   		var tmpStr = str.substring(i+1,i+6);
							if (tmpStr == "nbsp;") {
					   			newStr = newStr + "&nbsp;";
					   			i = i+5;
					   			continue;
				   			}
				   		}
				   		if ((uniChar >= "[" && uniChar <= "`") ||
							(uniChar >= ";" && uniChar <= "@") ||
							(uniChar >= "!" && uniChar <= "/")) {
					   			uniChar = "&#" + uniChar.charCodeAt() + ";";
						}
						newStr += uniChar;
			   		}
			   		return newStr;
            	},
				htmlEncode:function(str) {
                	document.write(jsUtil.encodeChar(str));
                },
				noEncode : function (str) {
                    return str;
                }
		}
})();

function computeAdler32Hash(input) {
	var str= null;
	
	for(var i=0; i<input.length; i++) {
		if(str == null)
			str =  input[i];
		else
			str = str + ","+ input[i];	
	}
	str = encodeURIComponent(str).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\~/g, "%7E").replace(/\-/g, "%2D").replace(/\'/g, "%27");
	
	var a = 1, b = 0, c = 0, d = 0 ;
    for (var i = 0; i < str.length;) {
		c = str.charCodeAt(i++);
        if (c < 128) {
			a += c;
        } else if (c < 2048) {
			a += 192 | c >> 6 & 31;
			b += a;
			a += 128 | 63 & c;
        } else if (c >= 55296 && c < 57344) {
			c = 64 + (1023 & c);
            d = 1023 & str.charCodeAt(i++);
            a += 240 | c >> 8 & 7;
            b += a;
            a += 128 | c >> 2 & 63;
            b += a;
            a += 128 | d >> 6 & 15 | (3 & c) << 4;
            b += a;
            a += 128 | 63 & d;
        } else {
			a += 224 | c >> 12 & 15;
            b += a;
            a += 128 | c >> 6 & 63;
            b += a;
            a += 128 | 63 & c;
        }
        b += a;
        a = 15 * (a >>> 16) + (65535 & a);
        b = 15 * (b >>> 16) + (65535 & b);
    }
    return (b % 65521 << 16 | a % 65521) >>> 0;
}

  function writeHeader(screenName){
 	with(document) {
 		write('<input type="hidden" name="actionCode" id="actionCode">');
 		write('<input type="hidden" name="tabName">');
 		write('<input type="hidden" name="callMode"   id="callMode"  value="E">');
 		write('<input type="hidden" name="screenName">');
 		write('<input type="hidden" name="expldQryStr" id="expldQryStr">');
 		write('<input type="hidden" name="reqId" id="reqId">');
 		write('<input type="hidden" name="rtId" id="rtId" value="">');
		write('<input type="hidden" name="reqIdChkByPass" id="reqIdChkByPass">');
 		write('<input type="hidden" name="ContextSwitchDoneFrom" id="ContextSwitchDoneFrom">');
 		if(isPopup != null && isPopup=="Y"){ 
			write('<input type="hidden" name="isPopUp" id="isPopUp" value="Y">'); 
		} 
		if(!window.showModalDialog){
			write('<div id="overlay"></div>');
		}


 	}
 		document.forms[0].rtId.value = rtId;
		document.forms[0].screenName.value = screenName;
		document.forms[0].reqId.value = reqId;
		document.forms[0].reqIdChkByPass.value = reqIdChkByPass;
		document.forms[0].ContextSwitchDoneFrom.value = ContextSwitchDoneFrom;

	fnFormOverride();
}

/**
 * This function is required to check whether the value of an object
 * is empty or null or undefined.
 *
 * @param 		object
 *
 * @return		boolean.
 *
 **/
function isEmptyObjValue(objValue)	{
	if(undefined == objValue || null == objValue || 0==fnTrim(objValue).length)	{
		return true;
	}
	return false;
}

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

// Trims the input string of leading and trailing spaces and returns  new string
if(typeof(std_modalDialog) == "undefined"){
	if(window.showModalDialog){
    	var std_modalDialog = window.showModalDialog; 
        window.showModalDialog = function(url,dialogArg,param){
	if(typeof(rtId) != "undefined")
	{
		if(url.indexOf("rtId=") == -1)
		{
		    if(url.indexOf("?")==-1)
		    {
			url+="?rtId="+rtId;
		    }
		    else
		    {
			url+="&rtId="+rtId;
		    }
		}
        }
        var sUrl = url+"&isPopUp=Y";
	if(reqParamValReqd=="Y") {
		sUrl = createReqParamToken(sUrl);
	}
		
	if(!modalOpened){
            modalOpened = true; 
            var retVal = std_modalDialog(sUrl,dialogArg,param); 
            modalOpened = false; 
            return retVal; 
        } 
        } 
    }else if(window.open){
        var std_modalDialog = window.open; 
                                      
        window.open = function(url,dialogArg,param){
	if(typeof(rtId) != "undefined")
	{
		if(url.indexOf("rtId=") == -1)
		{
		    if(url.indexOf("?")==-1)
		    {
			url+="?rtId="+rtId;
		    }
		    else
		    {
			url+="&rtId="+rtId;
		    }
		}
	}
        var sUrl = url+"&isPopUp=Y"; 
	if(reqParamValReqd=="Y") {
		sUrl = createReqParamToken(sUrl);
	}
			if(!window.showModalDialog){
				//No overlay for Help files and audit info 
				if (sUrl.indexOf("HelpRenderer")==-1 && sUrl.indexOf("/audit_info.jsp")==-1)
				{
					if(document.getElementById("overlay") != undefined && typeof document.getElementById("overlay") != "undefined"){
						document.getElementById("overlay").style.display = "block";
					}
				}
				// storing the window object to a temp variable when an window is already open and another window.open is triggered
				// scenario : window.open triggered from a callback function
				if (winOpen!=null && !winOpen.closed){
					//winOpenTemp = { ...winOpen};
					winOpenTemp = Object.assign({}, winOpen);
				}
			}
			winOpen = std_modalDialog(sUrl,dialogArg,param); 
			return winOpen; 
        }
    }
}
/*	overriding window.onbeforeunload to remove overlay and reset callback registry on popup window close
	scenario : Manual browser close of popup
			   window.close() call
*/
std_onbeforeunload = function () {
	if(!window.showModalDialog){
		if (unloadCounter == 0){	 // proactive check to stop onbeforeunload event multiple times
			if (document.forms[0] != undefined && document.forms[0].actionCode != undefined){  // icfg searcher or non-icfg searcher
				if(document.forms[0].actionCode.value.toUpperCase() != "SUBMIT" && document.forms[0].actionCode.value.toUpperCase() != "FORWARD" && document.forms[0].actionCode.value.toUpperCase() != "BACKWARD") 
				{  

					// skip removal of overlay and resetRegistry for submit/forward/backward inside icfg searcher

					if(document.forms[0].actionCode.value.toUpperCase() == "ACCEPTPOPUP" && window.opener.callBackFn == "showTextAreaTemp_callback")
					{
						//Dummy condition to skip else part code for SWIFT2023 custom field text area.
					}
					else
					{
						if(window.opener != null){
							if(window.opener.document.getElementById("overlay") != undefined && typeof window.opener.document.getElementById("overlay") != "undefined"){
								window.opener.document.getElementById("overlay").style.display = "none";
							}
							if (window.opener.parent.winOpenTemp == null)  // indicates that only one child window is opened and resetRegistry can be called.
							{
								window.opener.parent.resetRegistry();
							}
							else{
								window.opener.parent.winOpenTemp = null;  
							}
							unloadCounter++;
						}
					}
				}
			}else{
				if(!isChildSubmit){  // identify if there is a submit inside a popup with multiple frame [Account id searcher]
					if(window.opener != null){	
						if(window.opener.document.getElementById("overlay") != undefined && typeof window.opener.document.getElementById("overlay") != "undefined"){
							window.opener.document.getElementById("overlay").style.display = "none";
						}
						if (window.opener.parent.winOpenTemp == null)
						{
							window.opener.parent.resetRegistry();
						}
						else{
							window.opener.parent.winOpenTemp = null;
						}
						unloadCounter++;
					}
				}
				isChildSubmit=false;
			}
		}
	}
}
window.onbeforeunload =  std_onbeforeunload;

var isChrome=new Boolean();
isChrome=navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
if(isChrome){
        window.showModalDialog=undefined;
        window.dialogArguments=undefined;
}

function isSSOLogin(){ 
	if(!isPopupWin) 
	{ 
		if((prodEnv=="Y") && (window.parent == undefined || window.parent.login == undefined)) 
			return true; 
	} 
	return false; 
} 

function paintHeader(){ 
	if(isPopupWin){ 
		return false; 
	}else if(isSSOLogin()){ 
		return false; 
	} 
	return true; 
} 

// Trims the input string of leading and trailing spaces and returns  new string
function fnTrim(a_strString)
{
	if(null == a_strString || undefined == a_strString)
		return '';

	var cnt;
	var len = a_strString.length;
	var str = a_strString;
	begin = -1;
	for(cnt=0;cnt<len;cnt++)
	{
		if (str.charAt(cnt) == " ")
		{
			begin = cnt;
		}
		else
			break;
	}
	str = str.slice(begin+1,len);
	len = str.length;
	end = len;
	for(cnt=len-1;cnt>=0;cnt--)
	{
		if (str.charAt(cnt) == " ")
		{
			end = cnt;
		}
		else
			break;
	}
	str = str.slice(0,end);
	return str;
}

// Get reference
function get_lyr_css(id) {

	var lyr, lyrcss;
	lyr = document.getElementById(id);
	if (lyr) lyrcss = (lyr.style)? lyr.style: lyr;
	return lyrcss;
}

function MenuProperties()
{
	//'self' variable is needed as few problems arised while accessing the object across the frames.
	this.self = null;
	this.usrMenuId = null;
	this.finMenu = null;
	this.fabMenu = null;
	this.crvMenu = null;
	this.portalTabMenu = null;
    this.portalLhnAMenu = null;
    this.portalLhnBMenu = null;
	this.miscMenu = null;
	this.bgMenu = null;
	this.isBackground = false;

	this.setMenuObj = setMenuPropObj;
	this.setBgMode = setBackgroundMode;
	this.isBgMode = getBackgroundMode;
	this.setUsrMenuId = setUserMenuId;
	this.setFinMenu = setFinMenuArr;
	this.getFinMenu = getFinMenuArr;
	this.setFabMenu = setFabMenuArr;
	this.getFabMenu = getFabMenuArr;
	this.setCrvMenu = setCrvMenuArr;
	this.getCrvMenu = getCrvMenuArr;
	this.setMenuProps = setMenuPropArr;
	this.setBgMenu = setBgMenuArr;
	this.getBgMenu = getBgMenuArr;
	this.setPortalTabMenu = setTabMenuArr;
	this.getPortalTabMenu = getTabMenuArr;
    this.setPortalLhnAMenu = setLhnAMenuArr;
    this.getPortalLhnAMenu = getLhnAMenuArr;
    this.setPortalLhnBMenu = setLhnBMenuArr;
    this.getPortalLhnBMenu = getLhnBMenuArr;
	this.setMiscMenu = setMiscMenuArr;
	this.getMiscMenu = getMiscMenuArr;
	this.getMenuInfo = getMenuData;
}

function setMenuPropObj(obj) {
	this.self = (obj == null || obj == undefined) ? null : obj;
}
function setUserMenuId(id) {
	this.usrMenuId = id;
}
function setBackgroundMode(bool) {
	this.isBackground = (bool == true);
}
function setFinMenuArr(finArr) {
	this.finMenu = (finArr == null || finArr == undefined) ? new Array() : finArr;
}
function setFabMenuArr(fabArr) {
	this.fabMenu = (fabArr == null || fabArr == undefined) ? new Array() : fabArr;
}
function setCrvMenuArr(crvArr) {
	this.crvMenu = (crvArr == null || crvArr == undefined) ? new Array() : crvArr;
}
function setBgMenuArr(bgArr) {
	this.bgMenu = (bgArr == null || bgArr == undefined) ? new Array() : bgArr;
}
function setTabMenuArr(portalTabArr) {
    this.portalTabMenu = (portalTabArr == null || portalTabArr == undefined) ? new Array() : portalTabArr;
}
function setLhnAMenuArr(portalLhnAArr) {
    this.portalLhnAMenu = (portalLhnAArr == null || portalLhnAArr == undefined) ? new Array() : portalLhnAArr;
}
function setLhnBMenuArr(portalLhnBArr) {
    this.portalLhnBMenu = (portalLhnBArr == null || portalLhnBArr == undefined) ? new Array() : portalLhnBArr;
}
function setMiscMenuArr(miscArr) {
	this.miscMenu = (miscArr == null || miscArr == undefined) ? new Array() : miscArr;
}
function getBackgroundMode() { return this.isBackground; }
function getFinMenuArr() {
return this.finMenu;
}
function getFabMenuArr() { return this.fabMenu; }
function getCrvMenuArr() { return this.crvMenu; }
function getBgMenuArr() { return this.bgMenu; }
function getTabMenuArr() { return this.portalTabMenu; }
function getLhnAMenuArr() { return this.portalLhnAMenu; }
function getLhnBMenuArr() { return this.portalLhnBMenu; }
function getMiscMenuArr() { return this.miscMenu; }

function setMenuPropArr(menuId, finArr, fabArr, crvArr, bgArr, portalTabArr, portalLhnAArr, portalLhnBArr, miscArr)
{
	var usrMenuId = this.usrMenuId;
	if (usrMenuId != menuId) {
		alert(finbranchResArr.get("FAT001742"));
		return;
	}
	this.self.setFinMenu(finArr);
	this.self.setFabMenu(fabArr);
	this.self.setCrvMenu(crvArr);
	this.self.setBgMenu(bgArr);
	this.self.setPortalTabMenu(portalTabArr);
    this.self.setPortalLhnAMenu(portalLhnAArr);
    this.self.setPortalLhnBMenu(portalLhnBArr);
	this.self.setMiscMenu(miscArr);
}
function getMenuData(menuName)	{
	var finMenuArr = this.self.getFinMenu();
	var fabMenuArr = this.self.getFabMenu();
	var crvMenuArr = this.self.getCrvMenu();
	var bgMenuArr = this.self.getBgMenu();
	var miscMenuArr = this.self.getMiscMenu();
	var isBgMode = this.self.isBgMode();
	var menuInfoArr = null;

	if (!isBgMode && (menuName == finConst.HOME_MENU || menuName == finConst.FAB_ROOT_MENU || menuName == finConst.FAV_ROOT_MENU)) {
		return getMenuArr(menuName, miscMenuArr);
	}

	if (isBgMode) {
		return getMenuArr(menuName, bgMenuArr);
	}

	menuInfoArr = getMenuArr(menuName, finMenuArr);
	if (menuInfoArr != null) {
		return menuInfoArr;
	}
	menuInfoArr = getMenuArr(menuName, fabMenuArr);
	if (menuInfoArr != null) {
		return menuInfoArr;
	}
	menuInfoArr = getMenuArr(menuName, crvMenuArr);

	return menuInfoArr;
}

function getMenuArr(menuName, menuArr) {
	var menuInfo = null;
	var len = (menuArr != null) ? menuArr.length : 0;

	for (var i=0; i<len; i++)
	{
		if (menuArr[i][0] == menuName) {
			menuInfo = menuArr[i][1];
			break;
		}
	}

	return (menuInfo != undefined && menuInfo != null) ? menuInfo.split("|") : null;
}

function handleWindowDisplay(evtCode, params)
{
	try
	{
		var isSSO = (this.SSO != undefined && SSO);
		if (isSSO)
		{
			var parentObj = window.parent;
			switch(evtCode)
			{
				case finConst.DISPLAYPARENT:
					if (!isONSLogin) {
						parentObj.frames[finConst.FINFRAME].location.href = finContextPath + "/arjspmorph/onssessioncleanup.jsp?rtId="+rtId;
						parentObj.frames[finConst.APPLETFRAME].sendHTMLResp("STDOUT.ErrorCode=5&STDOUT.ErrorDesc=Released");
					}	else if (CURR_GROUP_NAME != undefined && CURR_GROUP_NAME == "arjspmorph") {
						self.close();
					}
					break;
				case finConst.DOLOGOUT:
		       //Return from here if the forced logout got fired already
		       if(params != undefined && params[0] == finConst.FORCED_LOGOUT && logoutFiredAlready)
		       		return;

                       if (this.isONSLogin == undefined)
                       {
                            window.returnValue = "TIMEOUT";
                                self.close();
                                return;
                        }
                        if (params != undefined && params[0] == finConst.FORCED_LOGOUT) {
                                alert(finbranchResArr.get("FAT001912"));
                        }
					if (isONSLogin) {
						var logoutType = (params != undefined) ? params[0] : finConst.NORMAL_LOGOUT;
						var logoutAction = finConst.LML_LOGOUT_EVT;
						if (logoutType == finConst.NORMAL_LOGOUT) {
							logoutAction = getLogoutAction();

							if(finConst.ACTION_CANCEL == logoutAction)	{
								break;
							}
							parentObj.showHTMLWindow(finConst.FINFRAME);
						}
						parentObj.doLogout(logoutAction);
						logoutFiredAlready = true;
					}
					else {
						parentObj.frames[finConst.GLOBALJSFRAME].flushGlobal();	
						parentObj.frames[finConst.FINFRAME].location.href = finContextPath + "/arjspmorph/onssessioncleanup.jsp?rtId="+rtId;
						parentObj.frames[finConst.APPLETFRAME].sendHTMLResp("STDOUT.ErrorCode=5&STDOUT.ErrorDesc=Released");
						parentObj.frames[finConst.APPLETFRAME].BancsApplet.logoutExternal();
					}
					break;
				case finConst.CONTEXTSWITCH:
					var ssoAppServer = params[0];
					var data = params[1];
					var rule = params[2];
					var winObj = parentObj.parent;
					winObj.invokeApplicationContext(ssoAppServer,data,rule);
					break;
				case finConst.WFCRMCONTEXTSWITCH:
					var ssoAppServer = params[0];
					var data = params[1];
					var rule = params[2];
					var winObj = parentObj;
					if (!isONSLogin) {
						parentObj.frames[finConst.APPLETFRAME].sendHTMLResp("STDOUT.ErrorCode=5&STDOUT.ErrorDesc=Released");
						winObj = parentObj.parent;
					}
					winObj.parent.invokeApplicationContext(ssoAppServer,data,rule);
					break;

				case finConst.SHOWAUTH:
					var retVal;	
					if(window.parent.getLoginFrame != undefined){
						if (window.parent.getLoginFrame() != undefined)
							retVal = window.parent.getLoginFrame().validateAuthorizer("Authorizer Login Page");
					}	
					return retVal;
			}
		}
		else
		{
			switch(evtCode)
			{
				case finConst.DISPLAYPARENT:
					if (CURR_GROUP_NAME != undefined && CURR_GROUP_NAME == "arjspmorph") {
						self.close();
					}
					break;
				case finConst.DOLOGOUT:
					document.location.href = finContextPath + "/arjspmorph/cleanup.jsp?rtId="+rtId+"&logout=YES";
					break;
			}
		}
	}
	catch (e) {
		var msg = (typeof(e.length) == "undefined") ? e.message : e;
		alert("Error Occured (handleWindowDisplay) : " + msg);
	}
}

function getLogoutAction()
{
	var literalList = "FLT015139|FLT000192";
	var actionList = finConst.LML_LOGOUT_EVT + "|" + finConst.ACTION_CANCEL;
	var pW = "20";var pH = "10";var dW = "17";var dH = "9";

	if (isLoggedInFin && isLoggedInFab)	{
		literalList = "FLT015137|FLT015138|FLT015139|FLT000192";
		actionList = finConst.LML_DCLOGOUT_EVT + "|" + finConst.LML_FABLOGOUT_EVT + "|" + finConst.LML_LOGOUT_EVT + "|" + finConst.ACTION_CANCEL;
		pW = "20";pH = "10";dW = "24";dH = "10";
	}

	var retVal = showConfirm("FLT015136", literalList, actionList,pW,pH,dW,dH);
	if (!isEmptyObjValue(retVal)) {
		return retVal;
	}
	return finConst.ACTION_CANCEL;
}

function showConfirm(title,literalList,actionList,pWidth,pHeight,dWidth,dHeight) {
	if(!window.showModalDialog)
	{
		callBackFn="showConfirm_callBack";
	}
	literalList = fnTrim(literalList);
	actionList = fnTrim(actionList);
	var litBuf = literalList.split("|");
	var evtBuf = actionList.split("|");

	if (fnIsNull(title) || litBuf.length == 0 || evtBuf.length == 0 || litBuf.length != evtBuf.length) {
		alert(finbranchResArr.get("FAT001813"));
		return;
	}

	var retVal;
	var winName = "ConfirmWin";
	var url = "../arjspmorph/"+applangcode+"/print_confirm.jsp";
	url += "?displayMsg="+title+"&buttonsList="+literalList+"&actionList="+actionList;

	if (arguments.length > 3) {
		retVal = popModalWindowVar(url,winName,pWidth,pHeight,dWidth,dHeight);
	}
	else {
		retVal = popModalWindow(url,winName);
	}
	if (window.showModalDialog)
	{
	if (retVal == null || retVal == undefined) {
		retVal = "";
	}
	return retVal;
	}
}
function showConfirm_callBack(retVal)
{
    if (retVal == null || retVal == undefined) {
        retVal = "";
    }
    return retVal;
}
// Checks if the input string is null or blanks
function fnIsNull(a_strString)
{
	if (a_strString == null) {
		return true;
	}

	a_strString = fnTrim(a_strString + '');

	if (a_strString == "") {
    	return true;
    }

	return false;
}

function popModalWindowVar(sUrl,wName,pWidth,pHeight,dWidth,dHeight){
	var retval;
	sUrl = jsUtil.formatUrl(sUrl);
	if(window.showModalDialog){
		if("Microsoft Internet Explorer" == browser_name)
			retval = window.showModalDialog(sUrl,wName,"dialogWidth:"+dWidth+";dialogHeight:"+dHeight+";status=no;toolbar=no;menubar=no;resizable=yes");
		else{
			sUrl = getAbsoluteUrl(sUrl);
			retval = window.showModalDialog(sUrl,wName,"dialogHeight:100px;dialogleft:843px;dialogWidth:175px;dialogtop:588px;status=no;toolbar=no;menubar=no;resizable=yes;");
		}
		if(retval != null && typeof(retval) == "string" && retval == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	else {
		sUrl = getAbsoluteUrl(sUrl);
		retval = window.open(sUrl,wName,"width="+pWidth+",height="+pHeight+",modal=yes,top=400,left=350,scrollbars=yes,toolbar=no,menubar=0,resizable=yes,dialog=yes");
		if(retval != null && typeof(retval) == "string" && retval == "TIMEOUT")
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
		modalWin = retval;
	}
	return(retval);
}

function popModalWindowVarAuth(sUrl,wName,pWidth,pHeight,dWidth,dHeight){
	var retval;
	sUrl = jsUtil.formatUrl(sUrl);
	pWidth="800";
	pHeight="375";
	sUrl = getAbsoluteUrl(sUrl);
	retval = window.open(sUrl,wName,"width="+pWidth+",height="+pHeight+",modal=yes,top=250,left=350,scrollbars=yes,toolbar=no,menubar=0,resizable=yes,dialog=yes");
	if(retval != null && typeof(retval) == "string" && retval == "TIMEOUT")
	{
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
	modalWin = retval;

	return(retval);
}

function popModalWindow(sUrl,wName){
	var retval;
	sUrl = jsUtil.formatUrl(sUrl);
	if(window.showModalDialog){
		if("Microsoft Internet Explorer" == browser_name)
			retval = window.showModalDialog(sUrl,wName,"dialogWidth:54;dialogHeight:27.25;status=no;toolbar=no;menubar=no;resizable=yes");
		else{
			var xMax = screen.width, yMax = screen.height;
			var xOffset = (xMax - 120), yOffset = (yMax - 150);
			sUrl = getAbsoluteUrl(sUrl);
			retval = window.showModalDialog(sUrl,wName,"dialogWidth=0px;dialogHeight=0px;dialogLeft="+xOffset+"px;dialogTop="+yOffset+"px;status=no;toolbar=no;menubar=no;resizable=yes;");	
		}
		if(retval != null && typeof(retval) == "string" && retval == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	else {
		sUrl = getAbsoluteUrl(sUrl);
		retval = window.open(sUrl,wName,"width=900,height=425,modal=yes,left=150,top=40,scrollbars=yes,toolbar=no,menubar=0,resizable=yes,dialog=yes");
		if(retval != null && typeof(retval) == "string" && retval == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
		modalWin = retval;
	}
	return(retval);
}

function popModalWindowPBP(sUrl,wName){
	
		 var retval;
	 	 sUrl = jsUtil.formatUrl(sUrl);
	   	 sUrl = getAbsoluteUrl(sUrl);
		 retval = window.open(sUrl,wName,"width=900,height=425,modal=yes,left=150,top=40,scrollbars=yes,toolbar=no,menubar=0,resizable=yes,dialog=yes");
	  if(retval != null && typeof(retval) == "string" && retval == "TIMEOUT") 
	  {
	 	 var logoutParams = new Array(1);
	 	 logoutParams[0]  = finConst.FORCED_LOGOUT;
	 	 handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
	 	 return;
	   }
	  	 modalWin = retval;
	  	 return(retval);
	}
function showCrncyConverter(){
    var bUrl = getBaseUrl();
	popModalWindow(bUrl + finContextPath + "/arjspmorph/"+applangcode+"/crncyconv.jsp","crncyconv");
}

function getBaseUrl()
{
	var tagArr = document.getElementsByTagName('BASE');
	var baseHref = (tagArr.length == 0) ? "" : tagArr[0].href;
 	var bUrl = (baseHref != undefined && !fnIsNull(baseHref)) ? baseHref + "../.." : "";

	return bUrl;
}


/*
* function 	: getEvtKeyCode()
* Description	: This function gives the keycode of the event
*
*/
function getEvtKeyCode(evt)
{
	var keyCode;
	if ("Microsoft Internet Explorer" == browser_name){
		keyCode = window.event.keyCode;
	}
	else{
		keyCode = evt.which;
	}
	return 	keyCode;
}

function invokeFAB(finAvlFlg,ctrlArr,menuName,params,protName) {
	var ctrlName = ctrlArr[4];
	var arr = strBaseRef.split("//");
	if (fnIsNull(fabBaseUrl)) {
		fabBaseUrl = strBaseRef;
		return;
	}

	if (fnIsNull(ctrlName) || fnIsNull(menuName))
	{
		alert(finbranchResArr.get("FAT000484"));
	}

	var fabUrl = getFABUrl(ctrlArr, menuName ,protName);

	if(params != undefined && !fnIsNull(params)) {
		fabUrl += "&" + params;
	}

	var inputParam = new Array(1);
	inputParam[0] = fabUrl;
	document.location.href = fabUrl;
}


function displayFinacleVersion()
{
	var bUrl = getBaseUrl();
	var obj = window.open(bUrl + finContextPath + "/arjspmorph/"+applangcode+"/fin_version.jsp?rtId="+rtId,"finversion","width=500,height=190,menubar=no,scrollbars=no,status=no,left=230,top=270" );
	if (obj != null && typeof(obj) == "string" && obj == "TIMEOUT") 
	{
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
	obj.focus();
}

function showHelpFile(file){
	var sUrl = getCustHelpUrl(file);
	var winHandle = window.open(sUrl,USERID+"_HelpScreen", "height=300%, width=575px, left=224, top=120, status=no, toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no");
	if (winHandle != null && typeof(winHandle) == "string" && winHandle == "TIMEOUT") 
	{ 
		var logoutParams = new Array(1); 
		logoutParams[0] = finConst.FORCED_LOGOUT; 
		handleWindowDisplay(finConst.DOLOGOUT, logoutParams);
		return; 
	}
    if(winHandle != null && winHandle != undefined)
		winHandle.focus();
}

function getCustHelpUrl(file){
        var retUrl = "";
        var funcName = "this.getExternalHelpUrl";
       	var bUrl = getBaseUrl(); 
	var altlitcode  = "";
		if (eval(funcName) != undefined) {
			retUrl = eval(funcName).call(this,file,mopId.toUpperCase());
			if(retUrl != undefined && !fnIsNull(retUrl))
			return retUrl;
        }
	/*
           if the literal context value from security info/application.properties is 'C',            helpfiles will be picked from default applangcode.
           if the literal context is 'A', helpfiles will be picked from the directory in
           helpfiles/<applangcode>/<altlitcode>
         */
        if (Literal == 'A')
        { altlitcode  = 'ISLING/';
        }

	return bUrl + finContextPath + "/HelpRenderer/" + file +"?appLangCode="+applangcode+"&rtId="+rtId;
}

function isMenuTreeAvl()
{
	var mtDiv = document.getElementById("menutree_div");
	var mtLyr = get_lyr_css("menutree");
	var isDivVisible = (mtDiv) ? (mtDiv.style.visibility == 'visible') : false;
	var isLyrDisplayed = (mtLyr) ? (mtLyr.display == "") : false;
	var isMenuTreeShown = isDivVisible && isLyrDisplayed;

	return isMenuTreeShown;
}

/*
* function 		: closeAllDevice()
* Description	: This function  is used to call the close function of the device loaded in the
*		 		  Device Frame
*
*/

function closeAllDevice()
{
	for(i=0; i<window.parent.DEVICEFRAME.frames.length;i++)
	{
		if(window.parent.DEVICEFRAME.frames[i] != undefined && window.parent.DEVICEFRAME.frames[i].closeDevice != undefined)
		{
			window.parent.DEVICEFRAME.frames[i].closeDevice();
		}
	}
	/* Commenting dummy.jsp call to prevent creation of new Jsession id at logout. This is done to ensure no CORE request is triggered after lml logout so that every Core Login has a new Jsession id */
	
	//window.parent.DEVICEFRAME.location.href = finContextPath+"/dummy.jsp?rtId="+rtId;
}

function doSubmit(actionCode){
	var frm = document.forms[0];

	if(isConfirmDialogOpen == "Y")
	{
		submitAction_CD = actionCode;
		return true;
	}
	/* Added for localization */ 
	if(!fnLocaleValidateForm(actionCode)) return; 
		   
	if(frm.submitform != undefined){
		frm.submitform.value = actionCode;
	}
	frm.actionCode.value = actionCode;
	enableFormElements();
	convertToCaps();
	hideAnchors();
	disableButtons();
	frm.submit();
}

//This function is to convert all the letters and words in all textfields to CAPS
function convertToCaps()
{
	var obj=document.forms[0];
    var len=obj.length;
	var divIdAttr; 

	for(i=0;i<len;i++)
	{
		if (obj[i].type == "text" || obj[i].type == "hidden" || obj[i].type == "textarea" )	{
			obj[i].value = fnTrim(obj[i].value);
		}
		if( ((obj[i].type == "text")||(obj[i].type == "textarea")) && obj[i].getAttribute("fdt") != 'lcase')
		{
			var inputCase = obj[i].getAttribute("inputCase");
			if (!fnIsNull(inputCase) && (inputCase != 'U'))
				{
					continue;
				}
			var txtStr = obj[i].value;
			obj[i].value = txtStr.toUpperCase();
		}
	}
}

/* Function to check the existence of locale fnValidateForm function If found 
    * then that gets called. */ 
   function fnLocaleValidateForm(actionCode)  { 
       if(localeCode != "DF" && localeCode != "") { 
            var locFuncName="this." + localeCode + "_fnValidateForm"; 
            if(eval(locFuncName) != undefined) { 
                return eval(locFuncName).call(this, actionCode); 
            } 
       } 
       return true; 
   }
   
   function hideAnchors(){
   	var ancLen = document.anchors.length;
   	var obj;
   	for (var i=0; i<ancLen; i++){
   		obj = document.anchors[i];
   		if ((obj.id).substr(0,4) == "sLnk")
   			hideImage(obj.id);
   	}
   }
   
   function hideHyperLinks(){ 
    var ancLen = document.anchors.length; 
    var obj; 
    for (var i=0; i<ancLen; i++){ 
   	 obj = document.anchors[i]; 
   	 var ctrls = document.all(obj.id); 
   	 hideMultipleAnchors(obj.id); 
   	 hideImage(obj.id); 
    } 
   } 
   
   function hideMultipleAnchors(ctrlId) 
   { 
   	var Ctrls = document.all(ctrlId); 
   	for (var i = 0; i<Ctrls.length; i++) 
   	{ 
   	   var Ctrl = Ctrls[i]; 
   	   Ctrl.style.display = "none"; 
   	} 
   } 


function hideImage(ancId){
	var curcss = get_lyr_css(ancId);
	if (curcss) curcss.display="none";
}

function hideVisibility(ancId){
    var curcss = get_lyr_css(ancId);
    if (curcss) curcss.visibility="hidden";
}

function getSSOSessId()
{
	var retSSOSessionID;	
	if(window.parent.getLoginFrame != undefined){
		if (window.parent.getLoginFrame() != undefined)
			retSSOSessionID = window.parent.getLoginFrame().getSessionID();
	}
	return retSSOSessionID;
}


function getFABUrl(ctrlArr, menuName ,protocol)
{
	var ctrlLen   = ctrlArr.length;
	var appRouter = "AppRouter";
	url = self.location.protocol + "//" + fabBaseUrl + "/";
	url += appRouter + "?sessionid="+sessionid;
	url =  protocol + "//" + fabBaseUrl + "/";
	url += ctrlArr[4] + "?sessionid=" + sessionid;
	url += "&sectok=" +	sectok + "&finsessionid=" + finsessionid;
	if (this.isLoggedInFab != undefined && isLoggedInFab) {
		url += "&fabsessionid="+fabsessionid;
	}
	else {
		url += "&fabsessionid=";
	}
	if (menuName != undefined && menuName != null) {
		url += "&mo=" + menuName;
	}
	url += "&mprec=" + finConst.FAB_PREC;

	if (isONSLogin) {
		url += "&invokeType=PUREONS";
	}
	else {
		url += "&invokeType=ONS";
	}
	if (ctrlLen>=8 && ctrlArr[7] != "") {
			 url += '&sid='+ctrlArr[7];
	  }
	 if (ctrlLen>=11 && ctrlArr[10] != "") {
	 		 url += '&mid='+ctrlArr[10];
	  }

	url += "&calendarBase=" + calbase;
	url += "&rtId="+rtId;
	url += "&reqId="+reqId;	
	return url;
}


/* Function returns true if the entered date is in Hijri Format. Else returns False. */
function isHijDate(stdDateString)
{

    var displayStr = stdDateString;
    var a_strDate=new Array();

    if(displayStr.indexOf("/") != -1)
            a_strDate = displayStr.split("/");
    if(displayStr.indexOf("-") != -1)
            a_strDate = displayStr.split("-");
    if(displayStr.indexOf(".") != -1)
            a_strDate = displayStr.split(".");

    if((a_strDate[2] >= lowHijYear)&&(a_strDate[2] <= highHijYear))
        return true;
    else
        return false;
}

/* Function returns true if the entered date is in Buddha Format. Else returns False. */
function isBuddhaDate(stdDateString)
{
    var displayStr = stdDateString;
    var a_strDate=new Array();

    if(displayStr.indexOf("/") != -1)
            a_strDate = displayStr.split("/");
    if(displayStr.indexOf("-") != -1)
            a_strDate = displayStr.split("-");
    if(displayStr.indexOf(".") != -1)
            a_strDate = displayStr.split(".");

    if ((a_strDate[2] >= 2442)&&(a_strDate[2] <= 2642))
        return true;
    else
        return false;
}

/* Function to convert date into Buddha Format from Gregorian Format. */
function convertGregToBuddha (stdDateString)
{

	var displayStr = stdDateString;
	var a_strDate=new Array();

	if(displayStr.indexOf("/") != -1)
		a_strDate = displayStr.split("/");
	if(displayStr.indexOf("-") != -1)
		a_strDate = displayStr.split("-");
	if(displayStr.indexOf(".") != -1)
		a_strDate = displayStr.split(".");

	a_strDate[2] = parseInt(a_strDate[2]) + 543;

	return a_strDate[0] + "-" + a_strDate[1] + "-" + a_strDate[2];
}

function disableMTreeTimer()
{
	if (isMenuTreeAvl()) {
		var mtFrame = window.frames["menutree"];
		mtFrame.disableTimers();
	}
}

function enableMTreeTimer()
{
	if (isMenuTreeAvl()) {
		var mtFrame = window.frames["menutree"];
		mtFrame.prevEventDate = new Date();
		mtFrame.handleTimers();
	}
}

function switchCalendar(calBase)
{
	valSwitch = true;
	if(!validateTypes(document.forms[0]))
    {
		switchCalArr[0] = false;
		return switchCalArr;
    }

	if (calBase == 'G')
    {
        calBase = '00';
    }
    else if (calBase == 'H')
    {
        calBase = '01';
    }
    else if (calBase == 'B')
    {
        calBase = '02';
    }

	if(!validateDateConvWithNewCalBase(document.forms[0],calBase))
    {
		switchCalArr[0] = false;
		return switchCalArr;
    }

	if(lastCalMappedDate == "" || lastCalMappedDate == "undefined" || lastCalMappedDate == null)
    {
        if(calBase == "01")
        {
			switchCalArr[0] = false;
			switchCalArr[1] = finbranchResArr.get("FAT002819");
            return switchCalArr;
        }
    }

	for(var cnt=0; cnt<iCalCount ;cnt++)
	{
		if(calStringArr[cnt] == calBase)
		{
				TOGGLE_CALENDAR_BASE = calBase;
				switchCalArr[0] = true;
				return switchCalArr;
		}
	}
	switchCalArr[0] = false;
	return switchCalArr;
}


//This javascript object is used to retrieve the properties of the field
function Properties(propObj)
{
	this.props = propObj;
	this.get = getProperty;
}


//This function checks if the customized properties are available for a particular field,
//if they are not found then the default value for the field property, which is  based on the type of property returned.
function getProperty(propName)
{
	var propObj = this.props;
	var retVal = eval("propObj." + propName);

	//Case where the property is defined in the finbranchcustom.properties file
	if (retVal != undefined)
		return retVal;

	//Below is the case for different properties when the property is not defined
	if (propName.indexOf("_MANDATORY") != -1)
		return "N";
	else if (propName.indexOf("_ENABLED") != -1)
		return "enabled";
	else if (propName.indexOf("_CHECKED") != -1)
		return "";

	alert("Invalid Property Accessed : " + propName);
	return;
}

function enableFormElements(){
        var frmElem = document.forms[0].elements;
        var totElem = frmElem.length;
        var type = "";

        for (var i = 0; i < totElem; i++) {
                type = frmElem[i].type;
                if (type == 'checkbox' || type == 'radio' || type == 'select-one') {
                        frmElem[i].disabled = false;
                }
                else if (type == 'text' || type == 'textarea' ) {
                        frmElem[i].disabled = false;
                }
        }
}

var userInfoUtil = (function() {
        var userEffTenor = "";
        var contextSol = "";
        var tenorConst = {
                FREE:"F"
                ,CAPTIVE:"C"
        };

        return {
                setEffTenor:function(tmpEffTenor) {
                        switch (tmpEffTenor) {
                                case tenorConst.FREE:
                                case tenorConst.CAPTIVE:
                                        break;
                                default:
                                        alert("Invalid User Tenor");
                                        return;
                        }
                        userEffTenor = tmpEffTenor;
                },

                setContextSol:function(tmpCtxSol) {
                        /* Null check can be performed */
                        contextSol = tmpCtxSol;
                },

                isFreeTenor:function() {
                        return (userEffTenor == tenorConst.FREE)
},

                getContextSol:function() {
                        return contextSol;
                }
        }
})();

function MenuShortCutProperties()
{
	this.self = null;
	this.usrSCMenuId = null;
	this.normalONSMenu = null; 	
	this.fcfgMenu = null;		
	this.bcfgMenu = null;		
	this.icfgMenu = null;
	this.radfxMenu = null;
	this.BcfgMenu = null;
	this.setMenuSCObj = setMenuSCPropObj;
	this.setUsrSCMenuId = setUserSCMenuId;
	this.setNormalONSMenu = setNormalONSMenuArr;
	this.getNormalONSMenu = getNormalONSMenuArr;
	this.setFcfgMenu = setFcfgMenuArr;
	this.getFcfgMenu = getFcfgMenuArr;
	this.setIcfgMenu = setIcfgMenuArr;
	this.getIcfgMenu = getIcfgMenuArr;
	this.setBcfgMenu = setBcfgMenuArr;
	this.getBcfgMenu = getBcfgMenuArr;
	this.setRadfxMenu = setRadfxMenuArr;
	this.getRadfxMenu = getRadfxMenuArr;
	this.setMenuSCProps = setMenuSCPropArr;
	this.getMenuSCInfo = getMenuSCData;
}

function setMenuSCPropObj(obj) {
	this.self = (obj == null || obj == undefined) ? null : obj;
}
function setUserSCMenuId(id) {
	this.usrSCMenuId = id;
}

function setNormalONSMenuArr(normalONSArr) {
	this.normalONSMenu = (normalONSArr == null || normalONSArr == undefined) ? new Array() : normalONSArr;
}
function setFcfgMenuArr(fcfgArr) {
	this.fcfgMenu = (fcfgArr == null || fcfgArr == undefined) ? new Array() : fcfgArr;
}
function setIcfgMenuArr(icfgArr) {
	this.icfgMenu = (icfgArr == null || icfgArr == undefined) ? new Array() : icfgArr;
}
function setBcfgMenuArr(bcfgArr) {
	this.bcfgMenu = (bcfgArr == null || bcfgArr == undefined) ? new Array() : bcfgArr;
}
function setRadfxMenuArr(radfxArr) {
	this.radfxMenu = (radfxArr == null || radfxArr == undefined) ? new Array() : radfxArr;
}

function getNormalONSMenuArr() {return this.normalONSMenu;}
function getFcfgMenuArr() { return this.fcfgMenu; }
function getIcfgMenuArr() { return this.icfgMenu; }
function getBcfgMenuArr() { return this.bcfgMenu; }
function getRadfxMenuArr() { return this.radfxMenu; }


function setMenuSCPropArr(menuId, normalONSArr, fcfgArr, icfgArr, bcfgArr, radfxArr)
{	
	var usrMenuId = this.usrSCMenuId;
	if (usrMenuId != menuId) {
		alert(finbranchResArr.get("FAT001742"));
		return;
	}
	this.self.setNormalONSMenu(normalONSArr);
	this.self.setFcfgMenu(fcfgArr);
	this.self.setIcfgMenu(icfgArr);
	this.self.setBcfgMenu(bcfgArr);
	this.self.setRadfxMenu(radfxArr);
	
}

function getMenuSCData(menuName)	{
	var normalONSArr = this.self.getNormalONSMenu();
	var fcfgArr = this.self.getFcfgMenu();
	var icfgArr = this.self.getIcfgMenu();
	var bcfgArr = this.self.getBcfgMenu();
	var radfxArr = this.self.getRadfxMenu();
	var menuInfoArr = null;
	menuInfoArr = getMenuArr1(menuName, normalONSArr);
	
	if (menuInfoArr != null) {
		var menuInfoArrSplit = menuInfoArr.split("|")
		return menuInfoArrSplit[0]+"|"+menuInfoArr;
	}
	menuInfoArr = getMenuArr1(menuName, fcfgArr);
	if (menuInfoArr != null) {
		return "filemnt|"+menuInfoArr;
	}
	menuInfoArr = getMenuArr1(menuName, icfgArr);
	if (menuInfoArr != null) {
		return "inquiry|"+menuInfoArr;
	}
	menuInfoArr = getMenuArr1(menuName, bcfgArr);
	if (menuInfoArr != null) {
		return "batch|"+menuInfoArr;
	}
	menuInfoArr = getMenuArr1(menuName, radfxArr);
	if (menuInfoArr != null) {
		return "radfx|"+menuInfoArr;
	}
	menuInfoArr = getMenuArr1(menuName, bcfgArr);
	
	return menuInfoArr;
}
function getMenuArr1(menuName, menuArr) {
	var menuInfo = null;
	var len = (menuArr != null) ? menuArr.length : 0;
	for (var i=0; i<len; i++)
	{
		if (menuArr[i][0] == menuName) {
			menuInfo = menuArr[i][1];
			break;
		}
	}
	return (menuInfo != undefined && menuInfo != null) ? menuInfo : null;

}

function isPopupWindow(){ 
	return isPopupWin; 
}

function getAbsoluteUrl(sUrl){
	var location = document.location.href;
	location = location.substring(0,location.lastIndexOf("/")+1);
        if(sUrl.indexOf("http://") == -1 && sUrl.indexOf("https://") == -1){	
	         sUrl = location + sUrl;
	}
	return sUrl;
}

function submitInPost(url){ 
           var frm = document.getElementById("url_submit"); 
           var hid_inp; 
           if(frm == null) 
           { 
                   frm = document.createElement("form"); 
                   setPostUrlParams(url,frm); 
           } 
           frm.id="url_submit"; 
           frm.method="POST"; 
           url = url.substring(0,url.indexOf("?")); 
           frm.action=url; 
           var frameName = window.parent.frames[finConst.FINFRAME].name; 
           frm.target=frameName; 
           frm.submit(); 
}

   function setPostUrlParams(url,frm){ 
      var queryString = url.substring(url.indexOf("?")+1,url.length); 
      var queryStringLen = queryString.length; 
      var a_queryParams = ""; 
	      if(queryString.indexOf("&")!=-1){ 
		      a_queryParams = queryString.split("&"); 
	      } 
	      var a_queryParamsLen = a_queryParams.length; 
	      for(i=0;i<a_queryParamsLen;i++) 
	      { 
		       if(a_queryParams[i].indexOf("=")!=-1){ 
			      var a_paramNameValue = a_queryParams[i].split("="); 
			      if(a_paramNameValue!=null){ 
                                           setPostParams(a_paramNameValue,frm); 
			      } 
		       } 
	      } 
}

function setPostParams(a_paramNameValue,frm){ 
	      if(a_paramNameValue!=null){ 
		      hid_inp = document.createElement("input"); 
		      hid_inp.setAttribute("id", a_paramNameValue[0]); 
		      hid_inp.setAttribute("name", a_paramNameValue[0]); 
		      hid_inp.setAttribute("type","hidden"); 
		      if(a_paramNameValue[1]==null) 
			      a_paramNameValue[1]=""; 
		      hid_inp.setAttribute("value", a_paramNameValue[1]); 
                           frm.appendChild(hid_inp); 
                           document.body.appendChild(frm); 
      } 

} 

function disableFields(){
    for(i=0; i < arguments.length; i++  ){
            obj =   eval("document.forms[0]."+arguments[i]);
            if((undefined != obj)&&
                (null != obj)){
                //disable UI field for given hidden field.
                if(obj.length == undefined && obj.getAttribute("fdt") == "fdate")
                    fnEnableUIField(obj,"N");
                else{
                    if(!(typeof(obj.length) != "undefined" && typeof(this.obj.type) == "undefined"))
                        obj.disabled = true;
                    else
                        fnEnableDisableRadioButtons(obj,'D');
                }
            }
    }
}

function refreshScreen()
{
    var frm = document.forms[0];
        if(frm.groupName != undefined)
                submitInPost(frm.screenName.value + "_ctrl.jsp?rtId="+rtId);
    if (TOGGLE_CALENDAR_BASE != "" && TOGGLE_CALENDAR_BASE != null)
    {
        if (frm.action.indexOf(JSP_PARAMS_AVAILABLE)!=-1)
        {
            frm.action = frm.action + '&rtId=' + rtId + '&calBase=' + TOGGLE_CALENDAR_BASE;
        }
        else
        {
            frm.action = frm.action + '?rtId=' + rtId + '&calBase=' + TOGGLE_CALENDAR_BASE;
        }
    }
    if (TOGGLE_TIME_ZONE != "" && TOGGLE_TIME_ZONE != null)
        {
            if (frm.action.indexOf(JSP_PARAMS_AVAILABLE)!=-1 ||
                (TOGGLE_CALENDAR_BASE != "" && TOGGLE_CALENDAR_BASE != null) )
            {
                frm.action = frm.action + '&rtId=' + rtId + '&timeZone=' + TOGGLE_TIME_ZONE;
            }
            else
            {
                frm.action = frm.action + '?rtId=' + rtId + '&timeZone=' + TOGGLE_TIME_ZONE;
            }
    }
     if ((TOGGLE_CALENDAR_BASE !="" && TOGGLE_CALENDAR_BASE != null)
            || (TOGGLE_TIME_ZONE != "" && TOGGLE_TIME_ZONE != null))
        {
            doSubmit("refreshFromSSO");
        }

}

function validateAsciiData(obj){

   var isMultByte = obj.getAttribute("fmb");
   if (!(isMultByte =='Y' ) && (!isAsciiVal(obj.value)) ){
       return false;
   }
   return true;
}

function isAsciiVal(str){
    // Returning true from here as a temporary fix for enabling ML in all fields.

     return true;
     if(fnIsNull(str)) {
         return true;
     }

    for (i=0,n=str.length;i<n;i++){
      if(str.charCodeAt(i) >= 127){
         return false;
      }
    }
   return true;
}

function dateDiff(dateStr1, dateStr2){
    var d1 = new Date(dateStr1.substring(6,10), parseInt(dateStr1.substring(3,5) - 1,10), dateStr1.substring(0,2));
    var d2 = new Date(dateStr2.substring(6,10), parseInt(dateStr2.substring(3,5) - 1,10), dateStr2.substring(0,2));

    //Taking the difference of two dates
    var d3 = d1 - d2;

    //Getting the number of days and rounding it off
    var d4 = Math.round(d3/(24*3600*1000));

    //Returning the date difference in No of Days
    return d4;

}

//  This function validates all the form controls based on their datatypes
//  Added by Vasudevan G on 29-08-02

function validateTypes(objForm) 
{
	var frmElements = objForm.elements;
	var obj,uiField,objName;
	for(var i=0; i < frmElements.length; i++){
		obj = frmElements[i];

		// Validation is skipped for ActiveX objects
		if(obj.type == 'application/x-oleobject')
			continue;

		var datatype = obj.getAttribute("fdt");
		if ((obj.type != "hidden") && (obj.disabled != true) && (obj.readOnly != true)) {
			if ((datatype == null) && (!validateAsciiData(obj))){
				if (valSwitch)
				{
					switchCalArr[1] = finbranchResArr.get("FAT000591");
				}
				else
					alert(finbranchResArr.get("FAT000591"));
				obj.focus();
				return false;
			}
		}

		if ((datatype != null) && ((datatype != "")) && ((datatype.length != 0))){
			objName = String(obj.id);
			uiField = objName.substring((objName.length -3),objName.length);
			if(uiField == '_ui')    {
				if(!fnEventFormatDate(obj))    {
					return false;
				}
			}
			//If DataType is Date
			if ((datatype == 'fdate') || (datatype == 'datetime') || (datatype == 'date'))  {
				if (!fnIsValidDate(obj)) {
					if(calbase == "00")
					{
						if (valSwitch)
						{
							switchCalArr[1] = finbranchResArr.get("FAT002593");
						}
						else
						{   if (aFlag == 'Y')
							{
								alert(finbranchResArr.get("FAT002593"));
							}
						}
						fnSetFocusForDate(obj);
						return false;
					}
					if(calbase == "01")
					{
						if (valSwitch)
						{
							switchCalArr[1] = finbranchResArr.get("FAT002594");
						}
						else
							alert(finbranchResArr.get("FAT002594"));
						fnSetFocusForDate(obj);
						return false;
					}
				}
			}

			//If DataType is Date
			if (datatype == 'ftime')    {
				if (!fnIsValidTime(obj.value)) {
					if (valSwitch)
					{
						switchCalArr[1] = finbranchResArr.get("FAT000278");
					}
					else
						alert(finbranchResArr.get("FAT000278"));
					obj.focus();
					return false;
				}
			}

			//new call for function validating time in HH:MM format
			//added on 10/10/2005 for new time format
			if (datatype == 'ftimeHHMM') {
				if (!fnIsValidTimeHHMM(obj)){
					obj.focus();
					return false;
				}
			}

			//If DataType is Percentage
			if (datatype == 'fpcnt' || datatype == 'fnpcnt'){
				if (!fnIsNull(obj.value)){
					var locPcnt = getValInStdFormat(obj.value);
					var chk = (isNaN(locPcnt) || locPcnt.indexOf(" ") != -1 || parseFloat(locPcnt)>100) || (datatype == 'fpcnt' && parseFloat(locPcnt) < 0);
					if (chk){
						if (valSwitch)
						{
							switchCalArr[1] = finbranchResArr.get("FAT000167");
						}
						else
							alert(finbranchResArr.get("FAT000167"));
						obj.focus();
						return false;
					}

					if (!fnValidatePercent(obj.value,6)){
						obj.focus();
						return false;
					}
				}
			}

			//If DataType is Integer
			if (datatype == 'fint') {
				if (!fnIsNull(obj.value)) {
					var locNum = getValInStdFormat(obj.value);
					if ((isNaN(locNum)) || (locNum.indexOf(DEF_DECIMAL_SEPARATOR) != -1)) {
						if (valSwitch)
						{
							switchCalArr[1] = finbranchResArr.get("FAT000201");
						}
						else
							alert(finbranchResArr.get("FAT000201"));
						obj.focus();
						return false;
					}
				}
			}

			//If DataType is PositiveInteger
			if (datatype == 'fpint')    {
				if (!fnIsNull(obj.value)) {
					var locNum = getValInStdFormat(obj.value);
					if (((isNaN(locNum)) || (locNum.indexOf(DEF_DECIMAL_SEPARATOR) != -1) || (parseFloat(locNum) <= 0))) {
						if (valSwitch)
						{
							switchCalArr[1] = finbranchResArr.get("FAT000202");
						}
						else
							alert(finbranchResArr.get("FAT000202"));
						obj.focus();
						return false;
					}
					if(!fnValidateSpecialChars(obj))
						return false;
				}
			}

			//If DataType is Conversion Rate
			//((!isNaN(obj.value)) ||
			if (datatype == 'frate')    {
				var locRate = getValInStdFormat(obj.value);
				if (isNaN(locRate)) {
					if (valSwitch)
					{
						switchCalArr[1] = finbranchResArr.get("FAT000203");
					}
					else
						alert(finbranchResArr.get("FAT000203"));
					obj.focus();
					return false;
				}   else if (!fnIsNull(obj.value) && !fnValidateConvRate(obj,10)){
					obj.focus();
					return false;
				}
				if(parseFloat(locRate)<0) {
					if (valSwitch)
					{
						switchCalArr[1] = finbranchResArr.get("FAT000487");
					}
					else
						alert(finbranchResArr.get("FAT000487"));
					obj.focus();
					return false;
				}
			}

			//If DataType is PositiveInteger with Zero
			if (datatype == 'fpzint')    {
				if (!fnIsNull(obj.value)) {
					var locNum = getValInStdFormat(obj.value);
					if ((isNaN(locNum)) || (locNum.indexOf(DEF_DECIMAL_SEPARATOR) != -1)) {
						if (valSwitch)
						{
							switchCalArr[1] = finbranchResArr.get("FAT000277");
						}
						else
							alert(finbranchResArr.get("FAT000277"));
						obj.focus();
						return false;
					}
					if(parseFloat(locNum) < 0){
						if (valSwitch)
						{
							switchCalArr[1] = finbranchResArr.get("FAT001462");
						}
						else
							alert(finbranchResArr.get("FAT001462"));
						obj.focus();
						return false;
					}
					if(!fnValidateSpecialChars(obj))
						return false;

				}
			}
			//If DataType is Percentage where 0 <= value <= 999
			if (datatype == 'fgpcnt') {
				var fldValue = getValInStdFormat(removeMantissa(obj.value));
				if (!fnIsNull(fldValue)) {
					var check = (isEmptyObjValue(fldValue) || !isNumber(fldValue) ||
							(-1 != fldValue.indexOf(" ")) ||
							(999 < getValInFloat(fldValue)) ||
							(0 > getValInFloat(fldValue)) ||
							(-1 != fldValue.toUpperCase().indexOf("E")));
					if (check) {
						if (valSwitch)
						{
							switchCalArr[1] = finbranchResArr.get("FAT000167");
						}
						else
							alert(finbranchResArr.get("FAT000167"));
						obj.focus();
						return false;
					}
					if (!fnValidatePercent(fldValue,6)) {
						obj.focus();
						return false;
					}
				}
			}
		}
	}
	return true;
}

function validateDateConvWithNewCalBase(objForm, newCalBase) 
{
    var frmElements = objForm.elements;
    var obj;
    var convDate;
    for(var i=0; i < frmElements.length; i++){
        obj = frmElements[i];

        // Validation is skipped for ActiveX objects
        if(obj.type == 'application/x-oleobject')
            continue;

        var datatype = obj.getAttribute("fdt");
        if ((obj.type != "hidden") && (obj.disabled != true) && (obj.readOnly != true)) {
            if ((datatype == null) && (!validateAsciiData(obj))){
                if (valSwitch)
                {
                    switchCalArr[1] = finbranchResArr.get("FAT000591");
                }
                else
                    alert(finbranchResArr.get("FAT000591"));
                obj.focus();
                return false;
                }
        }
        if ((datatype != null) && ((datatype != "")) && ((datatype.length != 0))){
            //If DataType is Date
            if ((datatype == 'fdate') || (datatype == 'datetime') || (datatype == 'date'))  {
                if (obj.value != null && obj.value != "" && obj.value.length != 0)
                {
                    convDate = convertBetweenNewDate(obj.value,newCalBase);
                    if (newCalBase == "01" && convDate == obj.value)
                    {
                        switchCalArr[1] = finbranchResArr.get("FAT002819");
                        fnSetFocusForDate(obj);
                        return false;
                    }
                }

            }
        }
    }
    return true;
}


function fnFormOverride(){

	if(typeof std_submit == "undefined") {
		if(this.HTMLFormElement)
				HTMLFormElement.prototype.std_submit = document.forms[0].submit;   // UXH_CHANGE
			else
				std_submit = document.forms[0].submit;
			
			document.forms[0].submit = function()               // Override the form submit function
			{
				if (document.forms[0].screenName != undefined && (document.forms[0].screenName.value == "fdmadet" || document.forms[0].screenName.value == "fdmaexplode" || document.forms[0].screenName.value == "fdmatabdet")) {
					if(eval(this.std_submit)!=undefined)
						this.std_submit();        // Invoke the original submit
					else
						std_submit();             // Invoke the original submit
				}
				else {
					/*To Disable the Menu Shortcut while processing, to avoid locking of DB*/
					disableFields("menuName","gotomenu");
					if(!formAlreadySubmitted)   // We need to submit the form only if it was not submitted earlier.
					{
						var allElem = document.forms[0].elements;
						var totalElem = allElem.length;
								var reqParamsArray = [];
						var j=0;
						disableButtons();
						if(this.disableButtons!= null && this.disableButtons!= undefined)
						{
							disableButtons();
							hideAnchors();
						}                                           // Disabling buttons & tabs
					
						if(isEncodeReqd == "Y" )                  
						{
							for (var i = 0; i < totalElem; i++) {
								if(allElem[i].disabled == false){
									var propName = allElem[i].name;
									if(encodeLst.indexOf(","+propName+",") != "-1")
									{
										var propValue = allElem[i].value;
										var encodeName = encodeURIComponent(allElem[i].value).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\'/g, "%27").replace(/\-/g, "%2D");
										document.forms[0].elements[i].value = encodeName;
									}
									
									if( (allElem[i].type == "radio" && allElem[i].checked == false) || (allElem[i].type == "checkbox" && allElem[i].checked == false) )
									{
										continue;
									}
									
									if(reqParamValReqd=="Y") {
										if(reqParamsIgnoreList.indexOf(","+propName+",") == "-1") {
											reqParamsArray[j] = propName + "=" +document.forms[0].elements[i].value;	
											j++;
										}
									}
								}
							}
						}else{
							for(var i=0;i<totalElem;i++){
								if(allElem[i].disabled == false){
									if(allElem[i].name != ""){
										var fieldName = allElem[i].name;
										if( (allElem[i].type == "radio" && allElem[i].checked == false) || (allElem[i].type == "checkbox" && allElem[i].checked == false) )
										{
											continue;
										}
												
										if(reqParamValReqd=="Y") {
											if(reqParamsIgnoreList.indexOf(","+fieldName+",") == "-1") {
												reqParamsArray[j] = fieldName + "=" +allElem[i].value;
												j++;
											}
										}
									}
								}
							}
						}
								
						if(reqParamValReqd=="Y") {
							var actionElement = document.forms[0].action;
							if(actionElement.indexOf("?")!= -1) {
								var actionParams;
								var actionParams_array;
								actionParams = actionElement.substring(actionElement.indexOf("?")+1);
								actionParams_array = actionParams.split("&");
								for(var i=0;i<actionParams_array.length;i++) {
									reqParamsArray.push(actionParams_array[i]);
								}
							}
							reqParamsArray.push(rtId.substring(2, rtId.length -1));
							reqParamsArray.sort();

							var hashOutput  = computeAdler32Hash(reqParamsArray);
							var appendEncNames = document.createElement("input");
							appendEncNames.setAttribute("type", "hidden");
							appendEncNames.setAttribute("name", reqUnqId);
							appendEncNames.setAttribute("value", hashOutput);
							document.forms[0].appendChild(appendEncNames);
						}
						
						formAlreadySubmitted = true;      // Set the variable so that form doesn get submitted again.
						if(isPopupWin=='Y')
							isChildSubmit=true;
						if(eval(this.std_submit)!=undefined)
							this.std_submit();                               // Invoke the original submit
						else
							std_submit();             // Invoke the original submit
					}
				}
			}
	}
}
