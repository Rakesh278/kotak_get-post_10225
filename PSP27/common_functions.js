var ns4=document.layers?1:0
var ie4=document.all?1:0
var ns6=document.getElementById&&!document.all?1:0
var gfkmCookie = null;
var MAX_AMOUNT = "9999999999999999";
var MAX_UNIT = "999999999999999";
var EQTYPRICE_PREC = 6;
var FETCH_ERR = "FETCH_ERR=";
var FETCH_ERR_LEN = 10;
var BJS_MODE = "BJS";
var DEF_DECIMAL_SEPARATOR = '.';
var DEF_MANTISSA_SEPARATOR = ',';
var ACCOUNT_EXPLODE = "AccountExplode";
var JSP_PARAMS_AVAILABLE = ".jsp?";
var SEARCHER_INDEX      = 100;
var TOGGLE_CALENDAR_BASE = null;
var TOGGLE_TIME_ZONE = null;
var switchCalArr = new Array();
var valSwitch = false;
var aFlag = "Y";
var formAlreadySubmitted = false;
var saveFinacleLiteMode = false;
var MAX_NO_OF_KEY_FIELDS = 9;
var callBackFn = "";
var opFieldsArr = new Array();
var genericCallBackFn = "";
var callBackSearchInd ="";
var isConfirmDialogOpen="";
var submitAction_CD="";
var callBackFn_CD="";
var callBackFn_SDS ="";
var genericCallBackFn_SDS="";
var customCallBackFn_SDS="";
var callBackIsPopulateReqd;
var dateObj_tmp="";
var wReturnDescGeneric="";
var acctFieldGeneric="";
var custNameGeneric;
var cifFieldGeneric;
var callBackFn_locale="";
var svsdata="";
var svsrule="";
var outputFields="";
var currDate;
var currTime;
//This variable is responsible of holding the current child window
//object opened using window.open method
var modalWin = null;
var winOpenObj = null;
var isPrintPage=false;



var childFormAlreadySubmitted=false;

// The standard javascript function escape is being overridden below.
// However if the original escape functionality is required (not
// encodeURIComponent)
// we need to have a pointer to the original function
var std_escape = escape;
// Declaring the function using the syntax "function <funcname>(<args>){}"
// will overrite the original function. To avoid this,
// the function is being declared using syntax "<funcname> = function(<args>){}"

// Sudarsan: escape function is not capable of encoding all the reqd. data so
// "encodeURIComponent" function has been used to overwrite escape function functionality.

escape = function(str)
{
    var result = encodeURIComponent(str).replace(/['()-]/g, function(c) {
		return '%' + c.charCodeAt(0).toString(16);
		});
	return result;
}

function resetRegistry(){
	callBackFn = "";
	opFieldsArr = new Array();
	genericCallBackFn = "";
	callBackSearchInd = "";
	isConfirmDialogOpen  = "";
	submitAction_CD = "";
	callBackFn_CD = "";
	callBackFn_SDS = ""; 
	genericCallBackFn_SDS = "";
	customCallBackFn_SDS = "";
	callBackIsPopulateReqd = "";
	callBackFn_locale = "";
	outputFields = "";
	dateObj_tmp = "";
}
function resetSDS()
{
    if(typeof multiSDS!='undefined')
    {
        multiSDS="N";
    }

	genericCallBackFn_SDS="";
	callBackFn_SDS="";
}
function CommonCallBack_SDS(action)
{
	var tempAction= action;
	if (typeof(tempAction) == "string")
		tempAction=tempAction.replace(/'/g, "\\'");

	var localSDS = "N";	
	if(typeof multiSDS!='undefined')
	{
		localSDS = multiSDS;
	}
	if(genericCallBackFn_SDS)
	{
		eval(genericCallBackFn_SDS+"('"+ tempAction +"')");
		if(localSDS == "N")
		{
			genericCallBackFn_SDS="";
		}
		callBackFn_locale="";
	}
	if(callBackFn_SDS)
	{
		eval(callBackFn_SDS+"('"+ tempAction +"')");
		if(localSDS == "N")
    	{	
			callBackFn_SDS="";
		}
		callBackFn_locale="";
	}
	if(callBackFn_locale)
    {
        eval(callBackFn_locale+"('"+ tempAction +"')");
        if(localSDS == "N")
        {
        //  callBackFn_locale="";	
		   }
    }
	if(customCallBackFn_SDS)  // introducing new callback variable to handle custom functions
	{
		eval(customCallBackFn_SDS+"('"+ tempAction +"')");
		if(localSDS == "N")
		{
			customCallBackFn_SDS="";
        }
    }
}
function CommonCallBack(rValue) {

	if(rValue!= null && typeof(rValue) == "string" && rValue == "TIMEOUT"){
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
	}
	if (rValue != null && rValue != undefined )
	{
		var temprValue= rValue;
		if (typeof(temprValue) == "string")
			temprValue=temprValue.replace(/'/g, "\\'");
		
		if(genericCallBackFn)
		{
			eval(genericCallBackFn+"('"+ temprValue +"')");
			genericCallBackFn="";
		}
		else
		{
			var liarrBufArray = rValue.split("|");
			var length=opFieldsArr.length;
	
	
			for(var i=0; i < length; i++)
			{
				if(opFieldsArr[i] != null) 
					opFieldsArr[i].value=liarrBufArray[i];
	
			}
		}
		
		if(callBackFn)
		{
			eval(callBackFn+"('"+ temprValue +"')");
    			callBackFn="";
		}
	}
	opFieldsArr = [];
	callBackFn="";
	genericCallBackFn="";
}

function CommonCallBack_CD() {
	
	isConfirmDialogOpen="N";
	if(callBackFn_CD)
	{
		eval(callBackFn_CD+"()");
	}
	else if (submitAction_CD)
	{
		doSubmit(submitAction_CD);
	}
	callBackFn_CD="";
	submitAction_CD="";
}

function CommonCallBack_icfg(rValue) {	
	// Handle TIME OUT scenarios
	if(rValue!= null && typeof(rValue) == "string" && rValue == "TIMEOUT"){
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
	if(callBackSearchInd != "")
	{		
		popModalWindowRES(rValue);
	}
	
	if(callBackFn)
	{
		eval(callBackFn+"()");
    	callBackFn="";
    }
}


function isSSOLogin(){
if(!isPopupWin)
{
if((isProdEnv=="Y") && (window.parent == undefined || window.parent.login == undefined))
        return true;
}
}

// Checks if the passed date is a valid date. Expects date in dd/mm/yyyy format
function fnIsValidDate(dateObj){

	var mnemonicEnabled = dateObj.getAttribute("mnebl");
	var mneblMode = null;
	var lstrDobFlg;
	var liLowYear=1900;
	var datatype = dateObj.getAttribute("fdt");
    var locCalBase = calbase;
    var stdDateString = null;
    var convDate = null;
    var a_convDay = null;
    var a_convMonth = null;
    var a_convYear = null;
    var a_strDay = null; 
    var a_strMonth =null; 
    var a_strYear = null; 
    var isMMDD = false; 

    if (dateObj.value == "invalid")
        return false;

	if (datatype == "fdate")
        locCalBase='00';

	a_strDate=dateObj.value;
	stdDateString = dateObj.value;


	if(a_strDate=="")
		return true;

	if((null != mnemonicEnabled) && (mnemonicEnabled))
    {
        mneblMode = dateObj.getAttribute("mneblMode");
        if ((null != mneblMode) && (BJS_MODE == mneblMode))
        {
            if(isValidBjsDateMneumonic(a_strDate))
            {
                return true;
            }
        }
        else
        {
            if(isValidDateMneumonic(a_strDate))
            {
                return true;
            }
        }
    }

	if(a_strDate.indexOf("/") != -1)
		var a_strDate = a_strDate.split("/");
	else
	if(a_strDate.indexOf("-") != -1)
		var a_strDate = a_strDate.split("-");
	else
	if(a_strDate.indexOf(".") != -1)
		var a_strDate = a_strDate.split(".");
	else
	{
		return false;
	}

	 if (calbase == "01" && !isHijDate(stdDateString))
    {
        if (isGregDate(stdDateString))
        {

            convDate = convertGregToHij(stdDateString);

        }
        if (convDate == stdDateString)
        {

            return false;
        }

            convDate=convDate.split("-");
            a_convDay = convDate[0];
        a_convMonth = convDate[1];
        a_convYear = convDate[2];
        if(a_convDay.length==1)
		   {
        a_convDay="0"+a_convDay;
        }
        if(a_convMonth.length==1)
        {
        a_convMonth="0"+a_convMonth;
        }
    }
    else
    {
        a_convDay = a_strDate[0];
		a_convMonth = a_strDate[1];
        a_convYear = a_strDate[2];
    }
  if  ( dateFormat == "01") 
           { 
                   var objName = String(dateObj.id); 
                   var uiField = objName.substring((objName.length -3),objName.length); 
                   var temp = null; 
                   if (uiField == "_ui") 
                   { 
                           isMMDD = true; 
                           temp          = a_strDate[0]; 
                           a_strDate[0]  = a_strDate[1]; 
                           a_strDate[1] = temp; 
                   } 
           } 
	
a_strDay = a_strDate[0];
	a_strMonth = a_strDate[1];
	a_strYear = a_strDate[2];
	if(a_strDay.length==1)
	{
	a_strDay="0"+a_strDay;
	}
	if(a_strMonth.length==1)
	{
	a_strMonth="0"+a_strMonth;
	}
	lstrDobFlg = dateObj.getAttribute("fdob");
	if (locCalBase =="00"){
	// if it is a date of birth field set lower year as 1850
	if (lstrDobFlg != null && lstrDobFlg == "Y")
		liLowYear=1850;

	if ( ( isNaN( a_strYear ) ) || ( isNaN( a_strMonth ) ) || ( isNaN( a_strDay ) ) || a_strDay.length <=1)	{
		return false;
	}
	else {
		if ( ( a_strYear < liLowYear ) || ( a_strYear > 2099 ) || ( a_strMonth > 12 ) || ( a_strMonth<1 ) || ( a_strDay < 1 ) || ( a_strDay > 31 ) || ( ( ( a_strMonth == 4 ) || ( a_strMonth == 6 ) || ( a_strMonth == 9 ) || (  a_strMonth == 11 ) ) && ( a_strDay > 30 ) ) )
			return false;
		else {
			if ( ( a_strYear % 4 == 0 ) && ( ( a_strYear % 100 != 0 ) || ( a_strYear % 400 == 0 ) ) )	{
				if ( ( a_strMonth == 2 ) && ( ( a_strDay > 29 ) || ( a_strDay < 1 ) ) ) {
					return false;
				}
			}
			else {
				if ( ( a_strMonth == 2 ) && ( ( a_strDay > 28 ) || ( a_strDay < 1 ) ) ) {
					return false;
				}
			}
		} // end of else
	}//end of else
	}//end of if

		if(locCalBase =="01"){

            //Check if the date components are all dates
        	if ( ( isNaN( a_convYear ) ) || ( isNaN( a_convMonth ) ) || ( isNaN( a_convDay ) ) || a_convDay.length <=1) {
                return false;
            }
            else {

            if ( (a_convYear <= lowHijYear) ||  (a_convYear >= highHijYear) || (a_convMonth > 12) || (a_convMonth<1) || (a_convDay > 30) || (a_convDay < 1) )
                    return false;
            }

        }//end of if
        if(locCalBase =="02"){
        if ( ( isNaN( a_strYear ) ) || ( isNaN( a_strMonth ) ) || ( isNaN( a_strDay ) ) || a_strDay.length <=1) {
            return false;
        }
        else {
        	if ( ( a_strYear < 2400 ) || ( a_strYear > 2700 ) || ( a_strMonth > 12 ) || ( a_strMonth<1 ) || ( a_strDay < 1 ) || ( a_strDay > 31 ) || ( ( ( a_strMonth == 4 ) || ( a_strMonth == 6 ) || ( a_strMonth == 9 ) || (  a_strMonth == 11 ) ) && ( a_strDay > 30 ) ) )
				return false;
			  else {
                  if ( ( a_strYear % 4 == 0 ) && ( ( a_strYear % 100 != 0 ) || ( a_strYear %400 == 0 ) ) )   {
                    if ( ( a_strMonth == 2 ) && ( ( a_strDay > 29 ) || ( a_strDay < 1 ) ) )
 {
                        return false;
                    }
                }
                else {
                    if ( ( a_strMonth == 2 ) && ( ( a_strDay > 28 ) || ( a_strDay < 1 ) ) )
 {
                        return false;
					}
                }
            } // end of else
	}//end of else
	}
	if  (dateFormat == "01" && isMMDD == true) 
	{ 
		dateObj.value=a_strMonth+"-"+a_strDay+"-"+a_strYear; 

                   } 
                   else 
                   { 
                           dateObj.value=a_strDay+"-"+a_strMonth+"-"+a_strYear; 
                   } 

	return true;
}

// Checks if the passed date1 is greater than date2. Expects the dates in the dd-mm-yyyy format
// a==b true, a < b = true, a > b false.
// Modified to return true/false if one of the inputs is "" to avoid split failing.
function fnCompareDates(a_strDate1, a_strDate2) {

	var a_strMonth1;
	var a_strDay1;
	var a_strYear1;
	var a_strMonth2;
	var a_strDay2;
	var a_strYear2;

	var blFlag = true;

/* If any of the dates is null , then the function will return true */
	if (a_strDate1=="" ||  a_strDate2==""){return true;}

			var arrDate1 = a_strDate1.split("-");
			var arrDate2 = a_strDate2.split("-");
			a_strMonth1 = arrDate1[1];
			a_strDay1 = arrDate1[0];
			a_strYear1 = arrDate1[2];
			a_strMonth2 = arrDate2[1];
			a_strDay2 = arrDate2[0];
			a_strYear2 = arrDate2[2];


	if (parseInt(a_strYear1, 10) > parseInt(a_strYear2, 10))
		return false;
	else
		if ((parseInt(a_strMonth1, 10) > parseInt(a_strMonth2, 10)) && (parseInt(a_strYear1, 10) == parseInt(a_strYear2, 10)))
			return false;
		else
			if ((parseInt(a_strDay1, 10) > parseInt(a_strDay2, 10))
				&& (parseInt(a_strYear1, 10) == parseInt(a_strYear2, 10))
				&& (parseInt(a_strMonth1, 10) == parseInt(a_strMonth2, 10)))
				return false;

	return true;
}

// Checks if the passed amt1 is greater than amt2.
// amt1 == amt2  true, amt1 < amt2  true, amt1 > amt2 false.
function fnCompareAmounts(amt1,amt2)
{
    var amt1 = getAmtInStdFormat(amt1);
    var amt2 = getAmtInStdFormat(amt2);
    var index1 = 0;
    var index2 = 0;

    index1 = amt1.indexOf(DEF_DECIMAL_SEPARATOR);
    index2 = amt2.indexOf(DEF_DECIMAL_SEPARATOR);
    if (index1 < index2)
    {
        amt1 = fnAmtLpad(amt1,(index2-index1));
    }
    else
    {
        amt2 = fnAmtLpad(amt2,(index1-index2));
    }

    if(parseFloat(amt1) > parseFloat(amt2))
        return false;
    else
        return true;
}

function fnAmtLpad(amt, index)
{
       for(i=1; i <= index; i++)
               amt = "0" + amt;

       return amt;
}

// Checks if the passed string is a positive number
function fnIsPositiveNumber(custVal) {

	var stdVal = getValInStdFormat(custVal);
	if(( isNaN(stdVal) ) || (stdVal.indexOf( " " ) != -1 ) || (stdVal.indexOf(DEF_DECIMAL_SEPARATOR) != -1 ))
		return false;
	// Number should be >= 0
	else if (stdVal < 0 )
		return false;
	else
		return true;
}

//This function removes commas from the given amount
function removeCommas(sNum)
{
	sNew ="";
	var sTemp = sNum.split(",");
	for (i=0;i<sTemp.length;i++)
	{
		if (sTemp[i]!=null)
			sNew = sNew + sTemp[i];
	}
	return sNew;
}

//This function converts the given number to Lakh format
//Included by Vasudevan G on 07-03-01
function formatToLakh(Num)
{
	if (fnIsNull(Num))
		return "";
	//Return if invalid number
	if (isNaN(removeCommas(Num)))
	{
		alert(finbranchResArr.get("FAT000029"));
		return 0;
	}
	//If no of digits less than 3 return the number
	if ((Num.indexOf(DEF_DECIMAL_SEPARATOR)!=-1) && (Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR)-1).length < 3))
		return Num;
	//Take mantissa part out of the number
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) != -1)
		sNum=Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR));
	else
		sNum = Num;
	if (sNum.length<4)
		return Num+".00";
	//Remove commas if present
	sNum = removeCommas(sNum);
	var sRes="";
	var j=0;
	if (sNum.length >4)
	{
		for (i=sNum.length-4;i>=0;i--)
		{
			sRes=sRes + sNum.charAt(i);
			temp = (sRes.substring(0,j+1)).length;
			if ((temp%2)==0)
				sRes=sRes+",";
			j+=1;
		}
		var sOrig="";
		for (i=sRes.length-1;i>=0;i--)
		{
			sOrig=sOrig + sRes.charAt(i);
		}
		sOrig=sOrig+","+sNum.substring(sNum.length-3);
	}
	if (sNum.length==4)
		sOrig=sNum.charAt(0)+","+sNum.substring(1);
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) == -1)
		sOrig=sOrig+".00";
	else
		sOrig=sOrig+Num.substring(Num.indexOf(DEF_DECIMAL_SEPARATOR));
	if (sOrig.charAt(0) == DEF_MANTISSA_SEPARATOR)
		sOrig=sOrig.substring(sOrig.indexOf(DEF_MANTISSA_SEPARATOR)+1);
	return sOrig;
}

//This function converts the given number to Million format
//Included by Vasudevan G on 07-03-01
function formatToMillion(Num)
{
	if (fnIsNull(Num))
		return "";
	//Return if invalid number
	if (isNaN(removeCommas(Num)))
	{
		alert(finbranchResArr.get("FAT000029"));
		return 0;
	}
	//If no of digits less than 3 return the number
	if ((Num.indexOf(DEF_DECIMAL_SEPARATOR)!=-1) && (Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR)-1).length < 3))
		return Num;
	//Take mantissa part out of the number
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) != -1)
		sNum=Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR));
	else
		sNum = Num;
	if (sNum.length<4)
		return Num+".00";
	//Remove commas if present
	sNum = removeCommas(sNum);
	var sRes="";
	var j=0;
	for (i=sNum.length-1;i>=0;i--)
	{
		sRes=sRes + sNum.charAt(i);
		temp = (sRes.substring(0,j+1)).length;
		if ((temp%3)==0)
			sRes=sRes+",";
		j+=1;
	}
	var sOrig="";
	for (i=sRes.length-1;i>=0;i--)
	{
		sOrig=sOrig + sRes.charAt(i);
	}
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) == -1)
		sOrig=sOrig+".00";
	else
		sOrig=sOrig+Num.substring(Num.indexOf(DEF_DECIMAL_SEPARATOR));
	if (sOrig.charAt(0) == ",")
	{
		sOrig=sOrig.substring(sOrig.indexOf(DEF_MANTISSA_SEPARATOR)+1);
	}
	return sOrig;
}

function fnFormatDate(cStr,evt)
{
	var HYPHEN = "-";
	var sEnteredDate = cStr.value;
	var sRawDate = "";
	var mnebl = cStr.getAttribute("mnebl");
   	if((null != mnebl )&& (mnebl) && ("$" == sEnteredDate.substring(0,1)) )
	{
   		return;
   	}
   	if((9 == evt.keyCode) || (16 == evt.keyCode))
	{
   		cStr.focus();
		return;
	}
	if((8==evt.keyCode)||(37==evt.keyCode)||(39==evt.keyCode)||(46==evt.keyCode))
		return;
	var arrDate = sEnteredDate.split(HYPHEN);
	if(arrDate.length == 3)
	{
		if(arrDate[2].length > 0 && arrDate[2].length <= 4 && arrDate[1].length > 0 && arrDate[1].length <= 2 && arrDate[0].length > 0 && arrDate[0].length <= 2)
			return true;
	}

	if(arrDate.length == 2)
	{
		if(arrDate[1].length != 2 || arrDate[0].length != 2)
			if(arrDate[1].length > 0 && arrDate[1].length <= 2 && arrDate[0].length > 0 && arrDate[0].length <= 2)
				return true;
	}

	//remove HYPHENS to form raw date string
	for(i=0; i<sEnteredDate.length; i++)
	{
		if(sEnteredDate.charAt(i) != HYPHEN)
			sRawDate += sEnteredDate.charAt(i);
	}
	var iRawDateLen = sRawDate.length;
	var sFmtdDate = sRawDate;
	if(iRawDateLen > 8) {			//More than 8 chars entered, format date with first 8 chars and ignore the rest
		sFmtdDate = sRawDate.substring(0,2)+HYPHEN+sRawDate.substring(2,4)+HYPHEN+sRawDate.substring(4,8);
	} else if (iRawDateLen > 4) {	//DD MM and some of YYYY is entered, format date completely
		sFmtdDate = sRawDate.substring(0,2)+HYPHEN+sRawDate.substring(2,4)+HYPHEN+sRawDate.substr(4);
	} else if (iRawDateLen == 4) {	//only DD and MM entered, format date leaving year part
		sFmtdDate = sRawDate.substring(0,2)+HYPHEN+sRawDate.substring(2)+HYPHEN;
	} else if (iRawDateLen == 3) {	//only DD and M entered add HYPHEN btwn DD and M
		sFmtdDate = sRawDate.substring(0,2)+HYPHEN+sRawDate.substr(2);
	} else if (iRawDateLen == 2) {	//only DD entered add HYPHEN
		sFmtdDate = sRawDate.substring(0,2)+HYPHEN;
	}
	cStr.value = sFmtdDate;
}

function validFields(isMandatory,ctrl,msg1,msg2)
{
	if(isMandatory=="Mandatory")
	{
			if(fnIsNull(ctrl.value))
			{
				alert(msg1);
				ctrl.focus();
				return false;
			}
			if((!(fnIsPositiveNumber(ctrl.value))||(ctrl.value==0))&&(msg2!=""))
			{
				alert(msg2);
				ctrl.focus();
				return false;
			}
		}
		return true;
}

function onSaveVerify(s)
{
	var frm = document.forms[0];

	/* Added for localization */ 
	if(!fnLocaleValidateForm(s)) return; 
		   
	if(validatefields())
	{
		convertToCaps();
		frm.saveVerify.value=s;
		if(s=="Authorize")
			return true;
		frm.Save.disabled=true;
		frm.Verify.disabled=true;
		frm.Cancel.disabled=true;
		frm.Authorize.disabled=true;
		frm.submit();
	}
 	else
	{
 		return false;
	}
}

function openWindow(sURL,ctrl,inVal,msg)
{
	var retValue;
	if((inVal!='optional')&&(inVal==""))
	{
		alert(msg);
		return ;
	}

	sURL = jsUtil.formatUrl(sURL);
	//Check for browser
	if(window.showModalDialog){
		if("Microsoft Internet Explorer" == browser_name){
			retValue = window.showModalDialog(sURL,"title","dialogWidth:40;dialogHeight:25;status=no;toolbar=no;menubar=no;resizable=yes");
		}else{
			sURL = getAbsoluteUrl(sURL);
			retval = window.showModalDialog(sURL,wName,"dialogHeight:400;dialogleft:100;dialogWidth:800;dialogtop:150;status=no;toolbar=no;menubar=no;resizable=yes;location=no");
		}
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT")
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
		if(ctrl!="")
		{
			if(retValue!=null)
				ctrl.value=retValue;
		}
	}
	else{
		retValue = window.open(sURL,"title","width=500,height=500,modal=yes,top=40,left=150,scrollbars=yes,toolbar=no,menubar=no");
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
}

function openAuthorizeWindow(URL)
{
	URL = jsUtil.formatUrl(URL);
	if(onSaveVerify('Authorize'))
	{
		convertToCaps();
		var retValue = window.open(URL,USERID+"_Authorize","Width=300,Height=110, Top=230, Left=270");
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	else
		return false;
}

function fnDisableControls1()
{
    var frm = document.forms[0];
	frm.SaveTemplate.disabled = true;
    frm.Cancel.disabled = true;
    frm.Back.disabled = true;
}

function fnDisableControls()
{
	var frm = document.forms[0];
	frm.Verify.disabled = true;
	frm.Authorize.disabled = true;
	frm.Save.disabled = true;
	frm.Cancel.disabled = true;
}

function fnDisableParentFormControls()
{
	var obj = window.opener.document.forms[0];
	if(null != obj.Verify && undefined != obj.Verify)
	{
		obj.Verify.disabled = true;
	}
	if(null != obj.Authorize && undefined != obj.Authorize)
	{
		obj.Authorize.disabled = true;
	}
	if(null != obj.Save && undefined != obj.Save)
	{
		obj.Save.disabled = true;
	}
	if(null != obj.Cancel && undefined != obj.Cancel)
	{
		obj.Cancel.disabled = true;
	}
}

function clearFields()
{
	var frm = document.forms[0];
	frm.accInqFlg.value="False";
	frm.saveVerify.value = "1";
	fnClearFields();
}

function getUserInfo()
{
	var retValue = window.open("../arjspmorph/"+applangcode+"/get_user_info.jsp?rtId="+rtId ,USERID+"_userInfo","width=330, height=240,top=290,left=390");
	if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
	{
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
}

function displaySignatureWindow(sGrpName,sAcctId)
{
	var retValue = window.open("../arjspmorph/"+applangcode+"/signature.jsp?rtId="+rtId+"&acctId="+sAcctId,USERID+"_Signature","width=600,height=520,left=20,top=80,resizable=1,status=0,toolbar=0,scrollbars=1");
	if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
	{
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
}

function displaySVSWindow(data, rule)
{
	var sAcctType = "";
	var sAcctId = "";
	var sSVSAddnDtls = "";
	var sSVSAddnDtls1 = "";
	var dataArr = "";
	var valArr = "";
	svsdata="";
	svsrule="";
	dataArr = data.split("sAcctId=");
	valArr = dataArr[1].split("&");
	sAcctId = valArr[0].toUpperCase();
	var parentObj = window.parent;

	if (data.indexOf("sAcctType=") == -1) {
		sAcctType="N";
	} else {
		dataArr = data.split("sAcctType=");
		valArr = dataArr[1].split("&");
		sAcctType = valArr[0];
	}
	if(!window.showModalDialog)
	{
		svsdata=data;
		svsrule=rule;
		callBackFn_SDS="displaySVSWindow_callBack";
	}
	sSVSAddnDtls = fetchSVSAddnDetails('dummyFrame','SVSADDNDTLS','F',sAcctId+"|"+sAcctType);
	if(window.showModalDialog)
	{
		if(sSVSAddnDtls != 'null' && sSVSAddnDtls != '')	
		{
			dataArr = sSVSAddnDtls.split("&");
            		valArr = dataArr[1].split("=");
            		for(iCount = 1; iCount < dataArr.length; iCount++)
            		{
                		valArr = dataArr[iCount].split("=");
                		if(valArr[0] == "sOdCustid")
                			sSVSAddnDtls1 = sSVSAddnDtls1 + "&" + valArr[0] + "=" + encodeURIComponent(valArr[1]);
                		else
                			sSVSAddnDtls1 = sSVSAddnDtls1 + "&" + valArr[0] + "=" + valArr[1];
            		}

            		data = data + sSVSAddnDtls1;
		}

		var params = new Array(3);
		if (rule == undefined) {
			rule = "applyRule";
		}
		params[0] = svsServer;
		params[1] = data;
		params[2] = rule;
    
		if(parentObj.isFinacleLite())
        {
               if(null == isUserAccesAvbl("IES"))
                   {
                           alert(finbranchResArr.get("FAT002367"));
                           return ;
                   }

            //change for finacle lite :Muragesh
            //handleWindowDisplay(finConst.CONTEXTSWITCH,params);
            svsUrl="../SVSPreLoginCtrl?DATA="+escape(data)+"&MENUOPTION="+rule+"&CALLTYPE=CONTEXT_SWITCH";
        	window.open(svsUrl,"SVS","width=800,height=375,modal=yes,left=150,top=40,scrollbars=yes,toolbar=no,menubar=0,resize=yes,dialog=yes");
    	}
		else	
        {
        		
			handleWindowDisplay(finConst.CONTEXTSWITCH,params);
		}
	}
}
function displaySVSWindow_callBack(sSVSAddnDtls)
{
	var parentObj = window.parent;	
	if(sSVSAddnDtls != 'null')
	{
		svsdata = svsdata + sSVSAddnDtls;
	}
	
	var params = new Array(3);
	if (svsrule == undefined) {
		svsrule = "applyRule";
	}
	params[0] = svsServer;
	params[1] = svsdata;
	params[2] = svsrule;
		
	if(parentObj.isFinacleLite())
    {
		if(null == isUserAccesAvbl("IES"))
        {
            alert(finbranchResArr.get("FAT002367"));
            return ;
        }

        //change for finacle lite :Muragesh
        //handleWindowDisplay(finConst.CONTEXTSWITCH,params);
        svsUrl="../SVSPreLoginCtrl?DATA="+escape(svsdata)+"&MENUOPTION="+svsrule+"&CALLTYPE=CONTEXT_SWITCH";
        window.open(svsUrl,"SVS","width=800,height=375,modal=yes,left=150,top=40,scrollbars=yes,toolbar=no,menubar=0,resize=yes,dialog=yes");
    }
    else
	{
	        	
		handleWindowDisplay(finConst.CONTEXTSWITCH,params);
	}
}

/*	THIS FUNCTION IS VERY SIMILAR TO sendDataToServer function and the logic
 *	is derived from there.  The reason to add this function is the existing
 *	function cannot handle the input that is sent (it requires an object) and
 *	the return needs to be a string having the additional details required by
 *	SVS.
*/
function fetchSVSAddnDetails(frameName,fetchId, precedence, wReturn){
	var tmpStr="";

	tmpStr = wReturn; 
	
    var bUrl = getBaseUrl();
    var sUrl = bUrl + finContextPath + "/arjspmorph/"+applangcode+"/frm_fetch.jsp?rtId="+rtId+"&fetchId="+fetchId+"&precedence="+precedence;
	if(wReturn != '')
		sUrl = sUrl+"&wReturn="+tmpStr;

    var xMax = screen.width, yMax = screen.height;
    var xOffset = (xMax - 120), yOffset = (yMax - 150);
    var params = "dialogWidth=0px;dialogHeight=0px;dialogLeft="+xOffset+"px;dialogTop="+yOffset+"px";
    params += ";status=no;toolbar=no;menubar=no;resizable=no;help=no;center=no";
    
    var retValue = popModalWindowForProcessing(sUrl,document.forms[0],params);
	return retValue;
}

function showAuthorizeWindow(sGrpName){
	var retValue = window.open("../arjspmorph/"+applangcode+"/authorize_user.jsp?rtId="+rtId+"&groupName="+sGrpName,USERID+"_UserAuthorization","width=300, height=110,top=230,left=270");
	if (retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT")
	{
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
}

function showErrorWindow(sGrpName){

	/* Changes made for tracker 102337 */
	//var retVal = popModalWindowVarRef("../arjspmorph/"+applangcode+"/error.jsp?groupName="+sGrpName,USERID+"_ErrorDetails","300","200","43","24");
    /*
     *  Reverted back the changes done under 102337 tracker Id
     *  This is a temporary change to resolve the issue in exception handling
     *  in FAB
     */
	var retValue = window.open("../arjspmorph/"+applangcode+"/error.jsp?groupName="+sGrpName,USERID+"_ErrorDetails","width=800,height=400,modal=yes,left=120,top=150,scrollbars=yes,toolbar=no,menubar=0");
	if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") {
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
	/* End of Changes*/
}

function openAdditionalDetailsWindow(sAcctId,tobj,sFlag,sFieldstatus){
	if (!fnIsNull(tobj.value)){
		if( sFlag=="selected" ){
			var retVal = window.open("../arjspmorph/"+applangcode+"/minor_sub_details.jsp?rtId="+rtId+"&sCreditOrDebit=null&Amount="+sFieldstatus,USERID+"_AdditionalDetails", "width=600, height=400,top=20,left=80");
			if(retVal != null && typeof(retVal) == "string" && retVal == "TIMEOUT") 
			{
				var logoutParams = new Array(1);
				logoutParams[0]  = finConst.FORCED_LOGOUT;
				handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
				return;
			}	
		}
		else if( sFlag=="tobeselected" ){
			var retVal = window.open("../arjspmorph/"+applangcode+"/additional_details_selection.jsp?rtId="+rtId+"&Amount="+sFieldstatus+"&AcctId="+sAcctId+"&TranAmount="+tobj.value,USERID+"_AdditionalDetails", "width=600, height=400,scrollbars=1,top=20,left=80");
			if(retVal != null && typeof(retVal) == "string" && retVal == "TIMEOUT") 
			{
				var logoutParams = new Array(1);
				logoutParams[0]  = finConst.FORCED_LOGOUT;
				handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
				return;
			}
		}
	}
	else{
		alert(finbranchResArr.get("FAT000104"));
		tobj.focus();
	}
}


function popModalWindowVarRef(sUrl,wName,pWidth,pHeight,dWidth,dHeight)
{
    if(SSO)
	{
		var argArr              = new Array();
    	var sessionId           = window.parent.parent.getSessionID();
		argArr['ssoParentWindow'] 	= this;
    	argArr["ssoSessionId"]  = sessionId;
		var retval              = popModalWindowVar(sUrl,argArr,pWidth,pHeight,dWidth,dHeight);
    	return(retval);
	}
	else
	{
		var argArr              = new Array();
    	argArr["parentWindow"]  = self;
    	argArr["title"]         = wName;
    	var retval              = popModalWindowVar(sUrl,argArr,pWidth,pHeight,dWidth,dHeight);
    	return(retval);
	}
}
function popModalWindowVarRefAuth(sUrl,wName,pWidth,pHeight,dWidth,dHeight)
{
    if(SSO)
	{
		var argArr              = new Array();
    	var sessionId           = window.parent.parent.getSessionID();
		argArr['ssoParentWindow'] 	= this;
    	argArr["ssoSessionId"]  = sessionId;
		var retval              = popModalWindowVarAuth(sUrl,argArr,pWidth,pHeight,dWidth,dHeight);
    	return(retval);
	}
	else
	{
		var argArr              = new Array();
    	argArr["parentWindow"]  = self;
    	argArr["title"]         = wName;
    	var retval              = popModalWindowVarAuth(sUrl,argArr,pWidth,pHeight,dWidth,dHeight);
    	return(retval);
	}
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

        return {
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
                    evtObj.returnValue=false; //for MSIE, returnValue should be set to false.
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
                        else {
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
							submitInPost(jspAction) ;
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
            formatUrl : function(sUrl) {
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
					sFinal = sUrl + "?rtId=" + rtId; /* When Url has no query String */
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
                return sFinal;
            },

            encodeChar : function(str) {
                if(str == null || !isNaN(str))
                    return str;

                if(fnTrim(str) == "")
                    return str;

                var newStr = "";
                for (var i = 0; i < str.length; i++) {
                    var uniChar = str.charAt(i);

                    if (uniChar == "&") {
                        var tmpStr = str.substring(i);

                        if (tmpStr.indexOf("&nbsp;") == 0) {
                            newStr = newStr + "&nbsp;";
                            i = i + 5;
                            continue;
                        }
                        else if (tmpStr.indexOf("&amp;nbsp;") == 0) {
                            newStr = newStr + "&nbsp;";
                            i = i + 9;
                            continue;
                        }
                    }
                    if ((uniChar >= "[" && uniChar <= "`") ||
                        (uniChar >= ";" && uniChar <= "@") ||
                        (uniChar >= "!" && uniChar <= "/"))
                    {

                            uniChar = "&#" + uniChar.charCodeAt() + ";";
                    }

                    newStr += uniChar;
                }
                return newStr;
            },
            htmlEncode : function (str) {
                document.write(jsUtil.encodeChar(str));
            },
            noEncode : function (str) {
                return str;
            }
        }

})();

var WinUtil = (function() {

            var stdTypes = [{type:"0", width:'0px', height:'0px'}
                           ,{type:"1", width:'860px', height:'600px'}
                           ,{type:"2", width:'860px', height:'400px'}
                           ,{type:"3", width:'575px', height:'600px'}
                           ,{type:"4", width:'575px', height:'400px'}
                           ,{type:"5", width:'250px', height:'250px'}
                           ];
            var retVal;
            var params;

            function validateArgs(url, winName, winType)
            {
                if (fnIsNull(url) || (typeof(winName)=="string" && fnIsNull(winName))  || fnIsNull(winType))
                {
                    alert("Invalid Window Arguments.");
                    return false;
                }

                if (winType == undefined || winType.type == undefined || winType.height == undefined || winType.width == undefined)
                {
                    alert("Invalid Window Arguments.");
                    return false;
                }

                var isValidType = false;
                for (var i=0; i<stdTypes.length; i++)
                {
                    var rec = stdTypes[i];
                    if ((rec.type == winType.type) && (rec.width == winType.width) && (rec.height == winType.height))
                    {
                        isValidType = true;
                        break;
                    }
                }

                if (!isValidType)
                {
                    alert("Window Sizes not Standard.");
                    return false;
                }

                return true;
            }

            function fetchType(winType)
            {
                var rec = null;
                for (var i=0; i<stdTypes.length; i++)
                {
                    rec = stdTypes[i];
                    if (rec.type == winType)
                    {
                        break;
                    }
                }
                return rec;
            }

            function assignAdditionalParams(winType,winCallType)
            {
                if(winType.type == 0)
                {
                    var xOffset = (screen.width - 120)+"px";
                    var yOffset = (screen.height - 150)+"px";

                    if(window.showModalDialog && winCallType == "windialog")
                    {
                    params = "dialogWidth:"+winType.width+";dialogHeight:"+winType.height+";dialogLeft:"+xOffset+";dialogTop:"+yOffset+";status=no;toolbar=no;menubar=no;resizable=no;help=no;center=no";
                    }
                    else
                    {
                        params = "width=10px,height=10px,modal=yes,left="+xOffset+",top="+yOffset+",scrollbars=yes,toolbar=no,menubar=no,help=no";
                    }
                }
                else
                {
                    var width = (winType.width).split("px");
                    var height = (winType.height).split("px");

                    var xOffset = ((screen.width-width[0])/2)+"px";
                    var yOffset = ((screen.height-height[0])/2)+"px";

                    if(window.showModalDialog && winCallType == "windialog")
                    {
                    params = "dialogWidth:"+winType.width+";dialogHeight:"+winType.height+";dialogLeft:"+xOffset+";dialogTop:"+yOffset+";status=no;toolbar=no;menubar=no;resizable=yes";
                    }
                    else
                    {
                    params = "width="+winType.width+",height="+winType.height+",modal=yes,left="+xOffset+",top="+yOffset+",scrollbars=yes,toolbar=no,menubar=0,resizable=yes,dialog=yes";
                    }
                }
            }

            return{
                    openModalWindow:function(url, winName, winType) {
                        if (!validateArgs(url, winName, winType)) {
                            return;
                        }

                        assignAdditionalParams(winType,"windialog");
                        url = jsUtil.formatUrl(url);

                        if(window.showModalDialog) {
                            retVal = window.showModalDialog(url,winName,params);
                        }
                        else {
                            retVal = window.open(url,winName,params);
                            modalWin = retVal;
                        }

                        if (retVal != null && typeof(retVal) == "string" && retVal == "TIMEOUT")
                        {
                            var logoutParams = new Array(1);
                            logoutParams[0] = finConst.FORCED_LOGOUT;
                            handleWindowDisplay(finConst.DOLOGOUT, logoutParams);
                        }
                        return retVal;
                    },
                    openWindow:function(url, winName, winType) {
                        if (!validateArgs(url, winName, winType)) {
                            return;
                        }

                        assignAdditionalParams(winType,"winopen");
                        url = jsUtil.formatUrl(url);

                        if(window.open) {
                            retVal = window.open(url,winName,params);
                            modalWin = retVal;
                        }

                        if (retVal != null && typeof(retVal) == "string" && retVal == "TIMEOUT")
                        {
                            var logoutParams = new Array(1);
                            logoutParams[0] = finConst.FORCED_LOGOUT;
                            handleWindowDisplay(finConst.DOLOGOUT, logoutParams);
                        }
                        return retVal;
                    },
                    isModal:function() {
                        return(window.showModalDialog);
                    },
                    type0: function() {
                        return fetchType(0);
                    },
                    type1: function() {
                        return fetchType(1);
                    },
                    type2: function() {
                        return fetchType(2);
                    },
                    type3: function() {
                        return fetchType(3);
                    },
                    type4: function() {
                        return fetchType(4);
                    },
                    type5: function() {
                        return fetchType(5);
                    }
                  }
    })();

function popCalendarModalWindowVar(sUrl,wName,pWidth,pHeight,dWidth,dHeight){
	var retval;
	sUrl = jsUtil.formatUrl(sUrl);
	if(window.showModalDialog){
		if("Microsoft Internet Explorer" == browser_name){
			retval = window.showModalDialog(sUrl,wName,"dialogWidth:"+dWidth+";dialogHeight:"+dHeight+";status=no;toolbar=no;menubar=no;resizable=yes; scroll=no");
		}else{
			sUrl = getAbsoluteUrl(sUrl);
			retval = window.showModalDialog(sUrl,wName,"dialogHeight:165;dialogleft:400;dialogWidth:235;dialogtop:250;status=no;toolbar=no;menubar=no;resizable=yes;");
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
		retval = window.open(sUrl,wName,"width="+pWidth+",height="+pHeight+",modal=yes,top=400,left=350,scrollbars=yes,toolbar=no,menubar=0,dialog=yes");
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

function getAbsoluteUrl(sUrl){
	var location = document.location.href;
	location = location.substring(0,location.lastIndexOf("/")+1);
	if((sUrl.indexOf("http://") == -1) && (sUrl.indexOf("https://") == -1)){
		sUrl = location + sUrl;
	}	
	return sUrl;
}

function popModalWindowForProcessing(sUrl,dialogArg,params){

	var xMax = screen.width, yMax = screen.height;
	var xOffset = (xMax - 120), yOffset = (yMax - 150);
	var newParam = "";
	if(params == null || params == undefined)
	{
		newParam = "dialogWidth=0px;dialogHeight=0px;dialogLeft="+xOffset+"px;dialogTop="+yOffset+"px";
		newParam += ";status=no;toolbar=no;menubar=no;resizable=yes;help=no;center=no";
	}
	else{
		newParam = params;
	}
	var retVal = "";
	if("Microsoft Internet Explorer" == browser_name){
		retVal = window.showModalDialog(jsUtil.formatUrl(sUrl),dialogArg,newParam);
	}else{
		sUrl = getAbsoluteUrl(sUrl);
		if(window.showModalDialog){
			retVal = window.showModalDialog(jsUtil.formatUrl(sUrl),dialogArg,"dialogHeight:100px;dialogleft:843px;dialogWidth:175px;dialogtop:588px;status=no;toolbar=no;menubar=no;resizable=yes;");
		}else{
			retVal = window.open(jsUtil.formatUrl(sUrl),dialogArg,"width=10px,height=10px,modal=yes,top="+yOffset+"px,left="+xOffset+"px,scrollbars=yes,toolbar=no,menubar=no,help=no");
		}
		if(retVal != null && typeof(retVal) == "string" && retVal == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	return(retVal);

}
function openModalWindow(sUrl,tObj){
//Check the browser
	var retval;
	sUrl = jsUtil.formatUrl(sUrl);
	if(window.showModalDialog){
		if("Microsoft Internet Explorer" == browser_name){
			retval = window.showModalDialog(sUrl,"","dialogWidth:54;dialogHeight:27.25;status=no;toolbar=no;menubar=no;resizable=yes");
		}else{
			sUrl = getAbsoluteUrl(sUrl);
			retval = window.showModalDialog(sUrl,"","dialogHeight:400;dialogleft:100;dialogWidth:800;dialogtop:150;status=no;toolbar=no;menubar=no;resizable=yes;location=no");
		}
		if(retval != null && typeof(retval) == "string" && retval == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
		if(null != retval){
			tObj.value = retval;
		}
		return(retval);
	}
	else{
		retval = window.open(sUrl,"","width=850,height=375,modal=yes,top=40,left=150,scrollbars=yes,toolbar=no,menubar=no,resizable=yes");
		if(retval != null && typeof(retval) == "string" && retval == "TIMEOUT") {
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
}

function openLienListWindow(sAcctId){
	if(sAcctId == ""){
		alert(finbranchResArr.get("FAT000519"));
	}
	else{
		var retValue = window.open("../arjspmorph/"+applangcode+"/lien_list.jsp?rtId="+ rtId +"&AcctId="+sAcctId, USERID+"_LienList", "width=700, height=400,top=20,left=80,scrollbars=1");
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
}

function checkFieldMandatory(strFieldValue,strMessage){
    if (fnIsNull(strFieldValue)){
		alert(strMessage);
		return true;
	}
}

function openMemoPadEntryWindow(AcctId){
	var retValue; 
	//Check the browser
	if(window.showModalDialog){
		if("Microsoft Internet Explorer" == browser_name)
		{	
			retValue = window.showModalDialog("../arjspmorph/"+applangcode+"/memo_pad_inquiry.jsp?rtId="+ rtId +"&AcctId="+AcctId,"MemoPadInquiry","dialogWidth:40;dialogHeight:25;status=no;toolbar=no;menubar=no;resizable=yes");
		}else{
		retValue = window.showModalDialog("../arjspmorph/"+applangcode+"/memo_pad_inquiry.jsp?rtId="+ rtId +"&AcctId="+AcctId,"MemoPadInquiry","dialogWidth:40;dialogHeight:400;dialogleft:100;dialogWidth:800;dialogtop:150;status=no;toolbar=no;menubar=no;resizable=yes;location=no");
	}
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	else
	{
		retValue = window.open("../arjspmorph/"+applangcode+"/memo_pad_inquiry.jsp?rtId="+ rtId +"&AcctId="+AcctId,"MemoPadInquiry","MemoPadInquiry","width=500,height=500,modal=yes");
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
}

function CheckLinkStatus(Obj){
    if(Obj.value == "True"){
        return true;
    }else{
        alert(finbranchResArr.get("FAT000054"));
        return false;
    }
}

//This function converts the given number to Million format
//Included by Srinivas.B
function formatToLakh1(Num, precision){
    var mantissa;
    var ordinate;
    precision = parseInt(precision,10) + 1;
    var pre=precision-1;
    if (fnIsNull(Num))
        return "";
    //Return if invalid number
    if (isNaN(removeCommas(Num))){
        alert(finbranchResArr.get("FAT000029"));
        return 0;
    }

    if (Num.indexOf(DEF_DECIMAL_SEPARATOR)!=-1){
        mantissa=Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR));
        ordinate=Num.substring(Num.indexOf(DEF_DECIMAL_SEPARATOR)+1);
        mantissa= removeCommas(mantissa);
        ordinate= removeCommas(ordinate);
        if(ordinate.length < pre){
            var noOfZeros = pre - ordinate.length;
            for(i=0;i<noOfZeros;i++){
                ordinate +="0";
            }
        }
        else if(ordinate.length > pre){
            ordinate = ordinate.substring(0,precision);
            var tn=ordinate.charAt(pre);
            if(tn>=5){
                if(ordinate.charAt(0)=='0'){
                    ordinate=parseInt(ordinate.substring(0,pre),10)+1;
                    if(ordinate !=10)ordinate="0"+ordinate;
                }
                else{
                    befOrdinate = ordinate;
                    ordinate=parseInt(ordinate.substring(0,pre),10)+1;
                    strOrdi = ordinate+"";
                    if(strOrdi.length > (befOrdinate.length-1)){
                        imantissa = parseInt(mantissa,10)+1 ;
                        mantissa = imantissa + "";
                        ordinate = strOrdi.substring(1);
                    }
                }
            }
            else{
                ordinate=ordinate.substring(0,pre);
            }
        }

    }
     else{
        mantissa=Num;
        ordinate='';
        var noOfZeros = pre;
        for(i=0;i<noOfZeros;i++){
            ordinate +="0";
        }
    }
	/* added to avoid putting comma after minus sign */
	var bIsAmtNegative = Number(mantissa) < 0 ? true : false;
	var sSign = "";	//default no sign[positive number]
	if( bIsAmtNegative ){
		mantissa = mantissa.substring(1);//remove negative sign
		sSign = "-";//update sign to negative
	}

    if(mantissa.length <=3){
		if(precision == 1)
			return  sSign+""+mantissa;

        return  sSign+""+mantissa+"."+ordinate;
    }

    if (mantissa.length>3){
        var sRes="";
        var temp="";
        for(i=mantissa.length-1;i>=0;i--){
            sRes += mantissa.charAt(i);
        }
            for(j=0;j<sRes.length;j++){
                temp +=sRes.charAt(j);
                if((j!=0)&&(j%2)==0)temp += ",";
            }
            mantissa="";
            for(k=temp.length-1;k>=0;k--){
            mantissa += temp.charAt(k);
        }
    if(mantissa.charAt(0)==',') mantissa = mantissa.substring(1);
    }

	if(precision == 1)
		return  sSign+""+mantissa;

    return sSign+""+mantissa+"."+ordinate;
}

//This function converts the given number to Million format
//Included by Srinivas.B
function formatToMillion1(Num, precision){
        var mantissa="";
        var ordinate="";
        precision = parseInt(precision,10) + 1;
        var pre=precision-1;
        if (fnIsNull(Num))
            return "";
        //Return if invalid number
        if (isNaN(removeCommas(Num))){
            alert(finbranchResArr.get("FAT000029"));
            return 0;
        }
        if (Num.indexOf(DEF_DECIMAL_SEPARATOR)!=-1){
        mantissa=Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR));
        ordinate=Num.substring(Num.indexOf(DEF_DECIMAL_SEPARATOR)+1);
        mantissa= removeCommas(mantissa);
        ordinate= removeCommas(ordinate);
        if(ordinate.length < pre){
                var noOfZeros = pre - ordinate.length;
                for(i=0;i<noOfZeros;i++){
                    ordinate +="0";
                }
            }
        if(ordinate.length >pre){
        ordinate = ordinate.substring(0,precision);
        var tn=ordinate.charAt(pre);
        if(tn>=5){
            if(ordinate.charAt(0)=='0'){
            ordinate=parseInt(ordinate.substring(0,pre),10)+1;
            if(ordinate !=10)ordinate="0"+ordinate;
                }
            else{
                befOrdinate = ordinate;
                ordinate=parseInt(ordinate.substring(0,pre),10)+1;
                strOrdi = ordinate+"";
                if(strOrdi.length > (befOrdinate.length-1)){
                    imantissa = parseInt(mantissa,10)+1 ;
                    mantissa = imantissa + "";
                    ordinate = strOrdi.substring(1);
                }
            }
        }
        else{
            ordinate=ordinate.substring(0,pre);
        }
        }
        }
         else{
            mantissa=Num;
            ordinate='';
            var noOfZeros = pre;
            for(i=0;i<noOfZeros;i++){
                ordinate +="0";
            }
        }
		/* added to avoid putting comma after minus sign */
		var bIsAmtNegative = Number(mantissa) < 0 ? true : false;
		var sSign = "";	//default no sign[positive number]
		if( bIsAmtNegative ){
			mantissa = mantissa.substring(1);//remove negative sign
			sSign = "-";//update sign to negative
		}

        if(mantissa.length <=3){
       		if(precision == 1)
				return  sSign+""+mantissa;

            return  sSign+""+mantissa+"."+ordinate;
        }
        if (mantissa.length>3){
            var sRes="";
            var temp="";
            for(i=mantissa.length-1;i>=0;i--){
            sRes += mantissa.charAt(i);
            }
            for(j=1;j<=sRes.length;j++){
            temp +=sRes.charAt(j-1);
            if((j!=0)&&(j%3)==0)temp += ",";
            }
            mantissa="";
            for(k=temp.length-1;k>=0;k--){
            mantissa += temp.charAt(k);
            }
            if(mantissa.charAt(0)==',')mantissa = mantissa.substring(1);
        }

	if(precision == 1)
		return  sSign+""+mantissa;

    return sSign+""+mantissa+"."+ordinate;
}

function formatAmountToMillionOrLakh(format, obj, precision, prn, idx)
{
	low_formatAmt(format, obj, null, precision, prn, idx);
}

function fnChangePage(sAction){
	var frm = document.forms[0];
	/* Added for localization */ 
	if(!fnLocaleValidateForm(sAction)) return; 
		   
	frm.submitform.value = sAction;
	frm.submit();
}

function getAmountCodeValue(Code){
  var multiplierMap ={

     T : 1000
    ,L : 100000
    ,M : 1000000
    ,C : 10000000
    ,B : 1000000000

  };

  return multiplierMap[Code];
}

function templateCheck(templateStatus){
    if(("C" != templateStatus) && ("M" != templateStatus)){
        return true;
    }
    return false;
}

function fnsubmitStopRevPay(form){
	if(validateForm(form) && fnIsValidChqDate()){
		return onSaveVerify('Verify');
    }
}

function fnClearFields(){
	var obj=document.forms[0];
	var len=obj.length;
	for(i=0;i<len;i++){
		if(obj[i].type == "text"){
			var txtStr = obj[i].value;
			obj[i].value = "";
		}
	}
	obj.submit();
}

function fnsaveStopRevPay(form){
      if(validateForm(form) && fnIsValidChqDate()){
              return onSaveVerify('Save');
      }
}

function fnIsacctIdNull(acctIdVal){
      if (fnIsNull(acctIdVal)){
              alert(finbranchResArr.get("FAT000090"));
              document.forms[0].acctId.focus();
              return 0;
      }
      return 1;
}

function fnIsValidChqDate(){
      var frm = document.forms[0];
	  if(!fnIsNull(frm.chequeDate.value)){
              if(!fnIsValidDate(frm.chequeDate)){
                      alert(finbranchResArr.get("FAT000101"));
					  fnSetFocusForDate(chequeDate);
                      return false;
              }
      }
      return true;
}

function showCurrencyList(currObj){
	if(!window.showModalDialog)
	{
		opFieldsArr=[];
		opFieldsArr[0]=currObj;
	}
    var retVal = popModalWindow("../arjspmorph/"+applangcode+"/get_currency.jsp?wReturn="+currObj.id+"&Currency="+escape(currObj.value),"CurrencyList");
	if(window.showModalDialog)
	{
    if (retVal != null){
    	var j = retVal.split("|");
        currObj.value = j[0];
     }
	}
}

function showSolList(solObj){
	if(!window.showModalDialog)
	{
		opFieldsArr=[];
		opFieldsArr[0]=solObj;
	}
    var retVal = popModalWindow("../arjspmorph/"+applangcode+"/get_sol_list.jsp?wReturn="+solObj.id+"&SolId="+escape(solObj.value),"SolIdList");
	if(window.showModalDialog)
	{
    if (retVal != null)
        solObj.value = retVal;
	}
}

function checkTolerance(lowTolerance,highTolerance,rate)
{
	rate = getValInStdFormat(rate);
    if((lowTolerance == "" && highTolerance == "") ||(fnIsNull(rate))){
        return true;
    }
    lowFloatTolerance = parseFloat(lowTolerance);
    highFloatTolerance = parseFloat(highTolerance);
    rateFloat = parseFloat(rate);

    rateNew = getValInStdFormat(document.forms[0].rate.value);
    if(rateNew == "")
    	return true;
    lowLimit = rateFloat - (rateFloat*lowFloatTolerance)/100 ;
    highLimit = rateFloat + (rateFloat*highFloatTolerance)/100 ;

    if(rateNew <= highLimit && rateNew >= lowLimit){
            return true;
    }
    else{
        alert(finbranchResArr.get("FAT000039"));
        return true;
    }
}

function changeRateCodeFlag(rate){
	var frm = document.forms[0];
	if("selected" != frm.flag.value){
		if((frm.rateCode.value).toUpperCase() != rate){
		frm.rate.value="";
		frm.rateCodeFlag.value="False";
		}
	}
}

function onChangeCurrency(){
    var frm = document.forms[0];
	frm.Amount.value="";
    frm.rate.value="";
}

function openPartitionedDtlsWindow(spartSelFlg,sConVarSuffix){
	var retValue = window.open("../arjspmorph/"+applangcode+"/partitioned_details.jsp?rtId="+rtId+"&partSelFlg="+spartSelFlg+"&sConVarSuffix="+sConVarSuffix+"&preceedence=B",USERID+"_PartitionedDetails","width=300,height=150,top=230,left=270");
	if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") {
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
}

function fnShowAdditionalDetails(sAcctId,tobj,sFlag,sFieldstatus){
	if(fnIsNull(tobj.value)){
		alert(finbranchResArr.get("FAT000041"));
		return;
	}
	openAdditionalDetailsWindow(sAcctId,tobj,sFlag,sFieldstatus);
}

function getRateInfoCrossCurrency(sAction,Currency,type,lowTolerance,highTolerance,rate){
   var frm = document.forms[0];
   var xcurr = frm.xCurrency.value;
   if ( (null == Currency) || (Currency.length <= 0) || (null == xcurr) || (xcurr.length <= 0)){
		alert(finbranchResArr.get("FAT000032"));
		return;
	}
    if ((frm.xCurrency.value).toUpperCase() != Currency){
		if(!(frm.xAmount.value =="" || frm.xCurrency.value=="" || frm.Currency.value=="")){
			if("Rate" == type){
				if(checkTolerance(lowTolerance,highTolerance,rate)){
					 frm.submitform.value  = sAction;
					 convertToCaps();
					 frm.submit();
				}
			}
			else{
				frm.submitform.value  = sAction;
				convertToCaps();
				frm.submit();
			}
		}
	}
    else{
	frm.rateCode.value = "";
	alert(finbranchResArr.get("FAT000001"));
	}
}

function fnShowListNreturn(sURL,obj){
    openModalWindow(sURL,obj);
}

function openDocWindow(URL){
	var retValue = window.open(URL,USERID+"_DocumentDetails","Width=800,Height=400, Top=100, Left=70");
	if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
	{
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
}
function openDenomWindow(URL){
	var retValue = window.open(URL,USERID+"_DenominationDetails","Width=600,Height=400, Top=100, Left=70");
	if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
	{
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
}
function getRateInfoCommon(sAction,Currency1,Currency2){
	var frm = document.forms[0];
	if (Currency1.toUpperCase() != Currency2.toUpperCase()){
        frm.submitform.value  = sAction;
        convertToCaps();
        frm.submit();
    }
    else{
    	frm.rateCode.value = "";
    	alert(finbranchResArr.get("FAT000001"));
    }
}

function getRateInfoCommonTC(sAction,Currency1,Currency2,type,lowTolerance,highTolerance,rate){
   var frm = document.forms[0];
    if (fnIsNull(frm.rateCode.value)){
        return;
    }
   if (Currency1.toUpperCase() != Currency2.toUpperCase()){
		if(!(frm.amount.value ==""  || Currency1 =="" || Currency2 =="")){
		if("Rate" == type){
		    if(checkTolerance(lowTolerance,highTolerance,rate)){
		       frm.submitform.value  = sAction;
		       convertToCaps();
		       frm.submit();
		    }
		}
			else{
		           frm.submitform.value  = sAction;
           	 	   convertToCaps();
           	 	   frm.submit();
			}
		}
    }
    else{
        frm.rateCode.value = "";
        alert(finbranchResArr.get("FAT000001"));
    }
}

function setValue(obj,string){
    var objCtr=eval("document.forms[0]."+obj);
    objCtr.value = string;
}

function writeDenom(){
	var retVal = true;
	var funcName = "this.writeCustDenominations";
	if (eval(funcName) != undefined) {
		retVal = eval(funcName).call(this);
	}
	if(null == retVal) {
		with(document) {
		write('<OPTION selected VALUE=""></OPTION>');
	    write('<OPTION VALUE="1000">1000</OPTION>');
	    write('<OPTION VALUE="500">500</OPTION>');
	    write('<OPTION VALUE="100">100</OPTION>');
	    write('<OPTION VALUE="50">50</OPTION>');
	    write('<OPTION VALUE="20">20</OPTION>');
	    write('<OPTION VALUE="10">10</OPTION>');
	    write('<OPTION VALUE="5">5</OPTION>');
	    write('<OPTION VALUE="2">2</OPTION>');
	    write('<OPTION VALUE="1">1</OPTION>');
		}
    }
}

function writeDoc(){
	var retVal = true;
	var funcName = "this.writeCustDocumentTypes";
	if (eval(funcName) != undefined) {
		retVal = eval(funcName).call(this);
	}
	if(null == retVal) {
		with(document) {
		write('<OPTION selected VALUE="">--Select--</OPTION>');
		write('<OPTION VALUE="PSPRT">Passport</OPTION>');
		write('<OPTION VALUE="SSNUM">Social Security No</OPTION>');
		write('<OPTION VALUE="NATID">Nation Id</OPTION>');
		write('<OPTION VALUE="DRVLC">Drivers Licence</OPTION>');
		write('<OPTION VALUE="OTHER">Other</OPTION>');
		}
	}
}

function formatAmtOnBlur(sAmtFormat,amtObj,crncyCode,checkValueObj){
	if( null != checkValueObj ){
	if("true" != checkValueObj.value){
		formatAmountToMillionOrLakh(sAmtFormat,amtObj,crncyCode,"N");
	}
	checkValueObj.value="false";
	}
	if(isNaN(getAmtInStdFormat(amtObj.value))){
		amtObj.focus();
	}
}

function fnOpenChargesWindow(chrgFlgObjName,chrgAmtObjName,
			exchgAmtObjName,grExchgAmtObjName,acctIdObjName,
			sellPurCrncyObj,evtIdObj,tcCrncyObj,chrgPgVisitedFlg,sGroupName,templateStatus){
	if(!templateCheck(templateStatus)){
    	return;
	}
	var frm = document.forms[0];
	var retValue;
	chrgFlgObj 		= eval("frm."+chrgFlgObjName);
	chrgAmtObj		= eval("frm."+chrgAmtObjName);
	exchgAmtObj		= eval("frm."+exchgAmtObjName);
	grExchgAmtObj	= eval("frm."+grExchgAmtObjName);
	acctIdObj		= eval("frm."+acctIdObjName);
	if(null != acctIdObj){
		acctIdVal = acctIdObj.value;
	}else{
		acctIdVal = "";
	}

	if(fnIsNull(sellPurCrncyObj.value)){
		alert(finbranchResArr.get("FAT000520"));
		sellPurCrncyObj.focus();
		return;
	}
	if(fnIsNull(evtIdObj.value)){
		alert(finbranchResArr.get("FAT000521"));
		evtIdObj.focus();
		return;
	}
	if((sGroupName == "cpurchase") ||(sGroupName == "tcpurchase")){
		if(fnIsNull(grExchgAmtObj.value)){
			alert(finbranchResArr.get("FAT000522"));
			grExchgAmtObj.focus();
			return;
		}
		retValue = window.open("../arjspmorph/"+applangcode+"/tc_crncy_charges.jsp?rtId="+rtId+"&flag="+chrgFlgObj.value+"&chrgTCAmount="+grExchgAmtObj.value+"&eventID="+evtIdObj.value+"&acCrncy="+sellPurCrncyObj.value+"&chrgAmtObjName="+chrgAmtObjName+"&exchgAmtObjName="+exchgAmtObjName+"&grExchgAmtObjName="+grExchgAmtObjName+"&debitAcct="+acctIdVal+"&tcCrncy="+tcCrncyObj.value+"&chrgFlgObjName="+chrgFlgObjName,USERID+"_chargesPage","width=650,height=300,top=60,left=80");
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}else{
		if(fnIsNull(exchgAmtObj.value)){
			alert(finbranchResArr.get("FAT000522"));
			exchgAmtObj.focus();
			return;
		}
		retValue = window.open("../arjspmorph/"+applangcode+"/tc_crncy_charges.jsp?rtId="+rtId+"&flag="+chrgFlgObj.value+"&chrgTCAmount="+exchgAmtObj.value+"&eventID="+evtIdObj.value+"&acCrncy="+sellPurCrncyObj.value+"&chrgAmtObjName="+chrgAmtObjName+"&exchgAmtObjName="+exchgAmtObjName+"&grExchgAmtObjName="+grExchgAmtObjName+"&debitAcct="+acctIdVal+"&tcCrncy="+tcCrncyObj.value+"&chrgFlgObjName="+chrgFlgObjName,USERID+"_chargesPage","width=650,height=300,top=60,left=80");
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	chrgPgVisitedFlg.value ="True";
}

function openUserAdditionalDtlWindow(){
	var retValue = window.open("../arjspmorph/"+applangcode+"/additional_dtl.jsp?rtId="+rtId,USERID+"_AdditionalDetails","width=750, height=300,left=25,top=100");
	if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
	{
		var logoutParams = new Array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
}

function checkForEnter(evt, obj){
    if (evt.keyCode == 13){
        obj.focus();
        return false;
    }
}

function clearDescField(){

	for(i=0; i < arguments.length; i++  ){
		eval("document.forms[0]."+arguments[i]+".value=''");
	}
}

//Changes done for chrome browser
function callBack_getStatus(sTabReqd, sTabName){

    var frm = document.forms[0];
    var objCB = eval("frm.chk"+sTabName);

    if( (sTabReqd == "Y") && !(objCB.checked) ) {
        if( (objCB.getAttribute("fds") == null)||(objCB.getAttribute("fds") == "")||(objCB.getAttribute("fds") != "Y") )
            objCB.click();
    }
    if(frm.submitform)  {
        frm.submitform.value=sTabName;
     }
    if(frm.actionCode)  {
        frm.actionCode.value="goToTab";
    }
    frm.tabName.value = sTabName;
    convertToCaps();
    disableButtons();
    enableFormElements();
    fnEnableDescFields(frm);
    if(isConfirmDialogOpen != "Y")
        frm.submit();
    else {
        callBackFn_CD="common_callBack_CD";
    }

    if(frm.screenName != undefined && post_TAB_SWITCH(sTabReqd, sTabName, frm.screenName.value) == false) {
        return false;
    }

    return true;

}

function getStatus(sTabReqd, sTabName){
	var frm = document.forms[0];
	/* Added for localization */ 
	if(!fnLocaleValidateForm(sTabName)) return; 
		   
	var objCB = eval("frm.chk"+sTabName);

	if(frm.screenName != undefined && pre_TAB_SWITCH(sTabReqd, sTabName, frm.screenName.value) == false) {
        return false;
    }

	if(fnValidateForm(sTabName,sTabReqd)) {
		if( (sTabReqd == "Y") && !(objCB.checked) ) {
			if( (objCB.getAttribute("fds") == null)||(objCB.getAttribute("fds") == "")||(objCB.getAttribute("fds") != "Y") )
				objCB.click();
		}
		if(frm.submitform)	{
			frm.submitform.value=sTabName;
		}
		if(frm.actionCode)	{
		 	frm.actionCode.value="goToTab";
		}
		frm.tabName.value = sTabName;
		convertToCaps();
		disableButtons();
		enableFormElements();
		fnEnableDescFields(frm);
		if(isConfirmDialogOpen != "Y")
			frm.submit();
		else {
			callBackFn_CD="common_callBack_CD";
		}

		if(frm.screenName != undefined && post_TAB_SWITCH(sTabReqd, sTabName, frm.screenName.value) == false) {
            return false;
        }

		return true;
	} else {
		return false;
	}
}

function common_callBack_CD()
{
	var frm = document.forms[0];
	frm.submit();
}

function getTabStatus(sTabReqd, sTabName){
	var frm = document.forms[0];
	/* Added for localization */ 
	if(!fnLocaleValidateForm(sTabName)) return; 
		   
	var objCB = eval("frm.chk"+sTabName);

	if (frm.screenName != undefined && pre_TAB_SWITCH(sTabReqd, sTabName, frm.screenName.value) == false) {
        return false;
    }

	if(fnValidateForm(sTabName)) {
	if( (sTabReqd == "Y") && !(objCB.checked) ) {
        if( (objCB.getAttribute("fds") == null)||(objCB.getAttribute("fds") == "")||(objCB.getAttribute("fds") != "Y") )
            objCB.click();
	}
    	frm.actionCode.value = "gotoTab";
        frm.tabName.value = sTabName;
    	convertToCaps();
    	disableButtons();
    	fnEnableDescFields(frm);
    	frm.submit();

		if (frm.screenName != undefined && post_TAB_SWITCH(sTabReqd, sTabName, frm.screenName.value) == false) {
                return false;
        }

    	return true;
    	} else {
        return false;
    	}
}

function displayHand(obj){
	if("Microsoft Internet Explorer" == browser_name){
		obj.style.cursor="hand";
	} else {
		obj.style.cursor="pointer";
	}
}

function setMandatory(blnMandatory){
	var sStar = "";
	if((fnTrim(blnMandatory) == "true") || (fnTrim(blnMandatory) == "Y")){
		sStar = "<font color='red' size='+0.5'>&nbsp;*</font>";
	}
	document.write(sStar);
}

//Function to show the calendar
function openDate(obj,inpDate){
	var date = "";
	if(inpDate == null) inpDate = '';

	if(!window.showModalDialog)
	{
		dateObj_tmp=obj;
		genericCallBackFn="openDate_genericCallBack";
	}
	/* Date selector enhancement:Start */
	var objName = String(obj.name);
	objName = objName.substring(0,(objName.length -3));
	hidObj = document.getElementsByName(objName);
	var i = (obj.fmult == "Y")?obj.recNum:0;
	var hidVal = hidObj[i].value;

	if((calbase == "01")&&(hidVal != null)&&(hidVal != "")&&(hidVal != "undefined"))
    {
        if(!chkHijriMapping(hidVal))
        {
            alert(finbranchResArr.get("FAT002843"));
                return;
        }
    }

	hidVal = (!fnIsValidContextDate(hidObj[i]))?inpDate:hidVal;

	date = popCalendarModalWindowVar("../arjspmorph/"+applangcode+"/date.jsp?txtDate="+obj.id+"&date="+inpDate+"&dateVal="+hidVal+"&calbase="+calbase,"Calendar",250,165,15,12);
    /* Date selector enhancement:End  */

	if(window.showModalDialog)
	{
	if(date != null){
		//set the value to ui and hidden fields.
		obj.value = fnConvertToUIDate(date);
		fnAssignDateOnEnter(obj);
	
		/*changes for the ticket 246672*/
        fnSetFocusForDate(obj);	
	}
	}
}
function openDate_genericCallBack(date)
{
    if(date != null){
        //set the value to ui and hidden fields.
        dateObj_tmp.value = fnConvertToUIDate(date);
        fnAssignDateOnEnter(dateObj_tmp);

        /*changes for the ticket 246672*/
        fnSetFocusForDate(dateObj_tmp);
    }
}
//Function to check if the amount is valid.
function isValidAmount(amount){
    amt = getAmtInStdFormat(amount);
    if((amt.length >17)||(isNaN(amt)))
        return false;
    index =amt.indexOf(DEF_DECIMAL_SEPARATOR);
    if(index > 14)
        return false;
    if((index== -1)&&(amt.length > 14))
        return false;
    return true;
}

function formReset(objForm){
	var frmElements = objForm.elements;
	var totalElements = frmElements.length;
	for(i = 0; i < totalElements; i++){
			if((((frmElements[i].readOnly==false)||frmElements[i].readOnly==undefined)&&(frmElements[i].disabled ==false)) && ( (frmElements[i].type == 'text') || (frmElements[i].type == 'select-one') )){
						frmElements[i].value = '';
			}
			fieldObj = frmElements[i];
			dateFldAttr  = fieldObj.getAttribute("fdt");
			// the date field attr = date or datetime is done
			// for the framework datatypes.
			if (dateFldAttr != null && (dateFldAttr == "fdate"||
				dateFldAttr =="date" || dateFldAttr=="datetime"))	{
				frmElements[i].value = '';
			}
			fieldObjAttributeValue = fieldObj.getAttribute("fds");
			/* field attribute value is null or blank, skip */
			if( (fieldObjAttributeValue == null) || (fieldObjAttributeValue == "") ) continue;
			fieldObjAttributeValue = fieldObjAttributeValue.toUpperCase();
			/* field attribute value is found, clear the field object*/
			if(fieldObjAttributeValue == "Y") frmElements[i].value = '';
	}
}

function setNumVal(sField,sVal){
	if(sVal =="0")
	eval("document.forms[0]."+sField+".value=''");
}

function fnValidateNumberFields(){
	var i = 0;
	var argc = arguments.length;
	for(; i < argc ; i++){
		arguments[i].value = fnTrim(arguments[i].value);
		if( !fnIsNull(arguments[i].value) && !fnIsPositiveNumber(arguments[i].value) ){
			err.setErr(arguments[i],finbranchResArr.get ("FAT000189"));
			return false;
		}
	}
	return true;
}

function showConfirmDialog(sGrpName){
	var sMsg = finbranchResArr.get ("FAT000554");
	var sBtnOne = "Delete";
	var sBtnTwo = "Restore";
	var sBtnThree = "Modify";
	var frm = document.forms[0];
	isConfirmDialogOpen="N";
	if("Microsoft Internet Explorer" == browser_name){
		frm.ConfirmChoice.value = window.showModalDialog("../arjspmorph/"+applangcode+"/confirm_dialog.jsp?rtId="+rtId+"&groupName="+sGrpName+"&Msg="+sMsg+"&BtnOne="+sBtnOne+"&BtnTwo="+sBtnTwo+"&BtnThree="+sBtnThree,"title","dialogWidth:40;dialogHeight:10;status=no;toolbar=no;menubar=no;resizable=no");
		if(frm.ConfirmChoice.value != null && typeof(frm.ConfirmChoice.value) == "string" && frm.ConfirmChoice.value == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	else{
		isConfirmDialogOpen="Y";
		var retValue = window.open("../arjspmorph/"+applangcode+"/confirm_dialog.jsp?rtId="+rtId+"&groupName="+sGrpName+"&Msg="+sMsg+"&BtnOne="+sBtnOne+"&BtnTwo="+sBtnTwo+"&BtnThree="+sBtnThree, "title",	"modal=yes, width=600, height=110,top=230,left=270,scrollbars=yes,toolbar=no,menubar=no");
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	return frm.ConfirmChoice.value;
}

function submitFromErr(sGroupName, sErrLLName, sRecNo, sFocusField, sOuterErrLLName, sOuterRecNo, isMRMError)
{
	if(fnValidateForm())
	{
		var frm = document.forms[0];
		if(window.MULTIREC_NEW_ARCH)
		{
			if(window.LIST_MRH_FLAG && window.PAGE_MRH_FLAG)
			{
				var objRec = eval("document.forms[0]."+ sErrLLName + "RecNo");
				objRec.value = sRecNo;
				var objDir = eval("document.forms[0]."+ sErrLLName + "direction");
				objDir.value = sErrLLName + "::GoToErrField";

				if(sOuterErrLLName != undefined && sOuterRecNo != undefined &&
                  !fnIsNull(sOuterErrLLName) && !fnIsNull(sOuterRecNo))
				{
					var objOuterRec = eval("document.forms[0]."+ sOuterErrLLName + "RecNo");
					objOuterRec.value = sOuterRecNo;
					var objOuterDir = eval("document.forms[0]."+ sOuterErrLLName + "direction");
					objOuterDir.value = sOuterErrLLName + "::GoToErrField";

					if(frm.submitform) frm.submitform.value = sOuterErrLLName + "::MultirecAct";
					if(frm.actionCode) frm.actionCode.value = sOuterErrLLName + "::MultirecAct";
				} else {
					if(frm.submitform) frm.submitform.value = sErrLLName + "::MultirecAct";
					if(frm.actionCode) frm.actionCode.value = sErrLLName + "::MultirecAct";
				}
			} else {
				frm.RecNo.value = sRecNo;
				frm.direction.value = sErrLLName + "::GoToErrField";
				if(frm.submitform) frm.submitform.value = sErrLLName + "::MultirecAct";
				if(frm.actionCode) frm.actionCode.value = sErrLLName + "::MultirecAct";
			}
		}
		else
		{
			if(frm.submitform) frm.submitform.value = sGroupName;
			if(frm.actionCode) frm.actionCode.value = "GoToErrField";
		}

		if(isMRMError == undefined || isMRMError.toUpperCase() == 'N')
		{
			frm.ErrLLName.value=sErrLLName;
			frm.RecNo.value=sRecNo;
			frm.FocusField.value=sFocusField;
		} else if(isMRMError.toUpperCase() == 'Y')
		{
			frm.MRMErrLLName.value=sErrLLName;
			frm.MRMRecNo.value=sRecNo;
			frm.MRMFocusField.value=sFocusField;
		}
		if(sOuterErrLLName != undefined && sOuterRecNo != undefined && !fnIsNull(sOuterErrLLName) && !fnIsNull(sOuterRecNo)){
			frm.OuterErrLLName.value = sOuterErrLLName;
			frm.OuterRecNo.value = sOuterRecNo;
		}
		convertToCaps();
		disableButtons();
		frm.submit();
	 }
}

function fnValidateFreqFields(objFreqType, objFreqWeek, objFreqDay, objFreqStartDD, objFreqHldyStat){
	var freqType	= objFreqType.value;
	var weekNum	= objFreqWeek.value;
	var weekDay 	= objFreqDay.value;
	var monthDay	= objFreqStartDD.value;
	var hldyStat 	= objFreqHldyStat.value;

	//if all the controls are blank, return true
	if(	fnIsNull(freqType) &&	fnIsNull(weekNum) && fnIsNull(weekDay) &&	fnIsNull(monthDay) && fnIsNull(hldyStat) ){
			return true;
	}
	if(!fnIsNull(freqType) && fnIsNull(hldyStat)){
		err.setErr(objFreqType,finbranchResArr.get ("FAT000192"));
		return false;
	}
	//if freq type is daily/weekly/fortnightly, freq-week, frew-day and freq-startdd are not required
	switch (freqType){
		case 'D'	:
		case 'W'	:
		case 'F'	:
		case 'B'	:
		case 'N'	:
			if(fnIsNull(weekNum) && fnIsNull(weekDay) && fnIsNull(monthDay)){
					return true;
			} else {
                err.setErr(objFreqType,finbranchResArr.get ("FAT000192"));
				return false;
			}
			break;
		case 'M'	:
		case 'T'    :
		case 'Q'	:
		case 'H'	:
		case 'Y'	:
		case 'I'	:
			if(!fnIsNull(weekNum) && !fnIsNull(weekDay) && fnIsNull(monthDay)){
				return true;
			} else  if(fnIsNull(weekNum) && fnIsNull(weekDay) && !fnIsNull(monthDay)) {
				//freq-startdd should be a valid month day
				if(isNaN(monthDay) || (Number(monthDay) < 1) || (Number(monthDay) >31)){
					err.setErr(objFreqStartDD,finbranchResArr.get ("FAT000197"));
					return false;
				}
				return true;
			} else {
				err.setErr(objFreqType,finbranchResArr.get ("FAT000192"));
				return false;
			}
			break;
		 case 'U'	:
						return true;
						break;
		default:
				err.setErr(objFreqType,finbranchResArr.get ("FAT000192"));
				return false;
	}
}
function fnValidateBpFreqFields(objFreqType,objNDays,objFreqWeek, objFreqDay, objFreqStartDD, objFreqHldyStat){
    var freqType    = objFreqType.value;
	var nDays	= objNDays.value;
    var weekNum = objFreqWeek.value;
    var weekDay     = objFreqDay.value;
    var monthDay    = objFreqStartDD.value;
    var hldyStat    = objFreqHldyStat.value;

    //if all the controls are blank, return true
    if( fnIsNull(freqType) &&   fnIsNull(weekNum) && fnIsNull(weekDay) &&   fnIsNull(monthDay) && fnIsNull(hldyStat) ){
            return true;
    }
    if(!fnIsNull(freqType) && fnIsNull(hldyStat)){
        err.setErr(objFreqType,finbranchResArr.get ("FAT000192"));
        return false;
    }
    //if freq type is daily/weekly/fortnightly, freq-week, frew-day and freq-startdd are not required
    switch (freqType){
        case 'D'    :
        case 'W'    :
        case 'F'    :
        case 'B'    :
        case 'N'    :
            if(fnIsNull(weekNum) && fnIsNull(weekDay) && fnIsNull(monthDay)){
                    return true;
            } else {
                err.setErr(objFreqType,finbranchResArr.get ("FAT000192"));
                return false;
            }
            break;
        case 'M'    :
        case 'T'    :
        case 'Q'    :
        case 'H'    :
        case 'Y'    :
            if(!fnIsNull(weekNum) && !fnIsNull(weekDay) && fnIsNull(monthDay)){
                return true;
            } else  if(fnIsNull(weekNum) && fnIsNull(weekDay) && !fnIsNull(monthDay)) {
                //freq-startdd should be a valid month day
				if(isNaN(monthDay) || (Number(monthDay) < 1) || (Number(monthDay) >31)){
                    err.setErr(objFreqStartDD,finbranchResArr.get ("FAT000197"));
                    return false;
                }
                return true;
            } else {
                err.setErr(objFreqType,finbranchResArr.get ("FAT000192"));
                return false;
            }
            break;
         case 'U'   :
                        if(!fnIsNull(nDays))
							return true;
						else{
						 err.setErr(objFreqType,finbranchResArr.get ("FAT000192"));
						 return false;
						}
                        break;
        default:
                err.setErr(objFreqType,finbranchResArr.get ("FAT000192"));
                return false;
    }
}
//FUNCTIONS to handle ALERT errors
function displayErr(){
	if(this.hasErr){
		//set the focus for ui field.
		if(!(typeof(this.oId.length) != "undefined" && typeof(this.oId.type) == "undefined")){
			if(this.oId.getAttribute("fdt") == "fdate")
				fnSetFocusForDate(this.oId);
			else
				this.oId.focus();
		}
		else{
			if(this.oId[0].type == "radio")
				this.oId[0].focus();
		}
		alert(this.sMsg);
		this.clearErr();
		this.hasErr = false;
	}
}

function setErr(oId, sMsg){
	this.hasErr = true;
	this.oId = oId;
	this.sMsg = sMsg;
}

function clearErr(){
	this.oId = "";
	this.sMsg = "";
}

function ErrObject(){
	this.hasErr = false;
	this.oId = "";
	this.sMsg = "";
	this.setErr = setErr;
	this.clearErr = clearErr;
	this.displayErr = displayErr;
}

function fnSelectField(groupName, errField){
	var ERR_FIELD_SEPARATOR = "_";
	var errFieldId = errField;
	var pgPos = errField.indexOf("pg");
	var dotPos = errField.indexOf(ERR_FIELD_SEPARATOR);
	var fieldObj	=	null;
	if((dotPos != -1) && (pgPos != -1)) {
		var fieldPrefix = errField.substr(0,2);

		if(fieldPrefix == "pg") //multi-page error
		{
			var errPgNum = errField.substring(2,dotPos);

			if(objForm.pgNum.value == errPgNum) {	//errField is on currenct page
				errFieldId = errField.substring(dotPos+1);
			} else {	//errField is on some other page
				if(fnValidateForm()) {
					var frm = document.forms[0];
					/* Added for localization */ 
					if(!fnLocaleValidateForm(errField)) return; 
													   
					frm.submitform.value=groupName;
					frm.FocusField.value=errField;
					frm.actionCode.value="MultiPageError";
					convertToCaps();
					disableButtons();
					frm.submit();
				}
				return true;
			}
		}
	}
    //check for divId attribute of field for RADFX.
    //If present then make that div section enable and then set focus to the field.
    if(eval("document.forms[0]." + errFieldId) != undefined)
    {
        fieldObj  = eval("document.forms[0]." + errFieldId);
        if(fieldObj.id != undefined)
        {
            var fldDivAttr = fieldObj.getAttribute("divId");
            if(fldDivAttr !=null && (!fnIsNull(fldDivAttr))){
                showCurrentDiv(fldDivAttr);
            }
        }
    }
	setErrFieldFocus(errFieldId);
}

function setErrFieldFocus(errFieldId)	{
	var fieldObj	=	eval("document.forms[0]." + errFieldId);
	var fieldObjLen =	null;
	var fieldType	=	null;
	var fld		=	null;
	if(!isEmptyObj(fieldObj))	{
		fieldObjLen	=	fieldObj.length;
	}
	//this if condition gets evaluated for group fields like radio butto
	//and multiple checkboxes. fieldObjLen is undefined for other cases
	//this if condition must is not evaluated for combo boxes
	if(!isEmptyObj(fieldObj) && !isNaN(fieldObjLen) && ("radio" == fieldObj[0].type ||
		"checkbox" == fieldObj[0].type))	{
		for(var eleCount = 0;eleCount<fieldObjLen;eleCount++)	{
			var flag	=	false;
			if(true == fieldObj[eleCount].checked)	{
				fld	= fieldObj[eleCount];
				flag		=	true;
				break;
			}
		}
		//if the flag is false, then there is no group field that is checked.
		if(!flag)	{
			fld=fieldObj[0];
		}
		setFieldFocus(fld);
	}	else if(!isEmptyObj(fieldObj))	{
		fld	=fieldObj;
		//this visual field id is used by the framework
		//in cases where the hidden field is used internally
		//for setting the values as in case of amount, date,
		//and checkbox.
		//the visual id field will be the one that appears on
		//the screen.
		var visualFldId	=	fieldObj.getAttribute("vFldId");
		if(!isEmptyObjValue(visualFldId))	{
			var visualFldObj	=	eval("document.forms[0]." + visualFldId);
			if(!isEmptyObj(visualFldObj))	{
				fld	=	visualFldObj;
			}
		}
		setFieldFocus(fld);

	}
	return ;
}

function getFieldForFocus(errFieldId)	{
	var fieldObj	=	eval("document.forms[0]." + errFieldId);
	var fieldObjLen =	null;
	var fieldType	=	null;

	if(!isEmptyObj(fieldObj))	{
		fieldObjLen	=	fieldObj.length;
	}
	//this if condition gets evaluated for group fields like radio butto
	//and multiple checkboxes. fieldObjLen is undefined for other cases
	//this if condition must is not evaluated for combo boxes
	if(!isEmptyObj(fieldObj) && !isNaN(fieldObjLen) && ("radio" == fieldObj[0].type ||
													"checkbox" == fieldObj[0].type))	{
		for(var eleCount = 0;eleCount<fieldObjLen;eleCount++)	{
			var flag	=	false;
			if(true == fieldObj[eleCount].checked)	{
				fieldObj	=	eval("document.forms[0]." + fieldObj[eleCount].id);
				flag		=	true;
				break;
			}
		}
		//if the flag is false, then there is no group field that is checked.
		if(!flag)	{
			fieldObj	=	eval("document.forms[0]." + fieldObj[0].id)
		}
	}	else	{
		if(!isEmptyObj(fieldObj))	{
			//this visual field id is used by the framework
			//in cases where the hidden field is used internally
			//for setting the values as in case of amount, date,
			//and checkbox.
			//the visual id field will be the one that appears on
			//the screen.
			var visualFldId	=	fieldObj.getAttribute("vFldId");
			if(!isEmptyObjValue(visualFldId))	{
				var visualFldObj	=	eval("document.forms[0]." + visualFldId);
				if(!isEmptyObj(visualFldObj))	{
					fieldObj	=	visualFldObj;
				}
			}
		}
	}
	return fieldObj;
}

function setFieldFocus(fieldObj)	{
	if(!isEmptyObj(fieldObj))	{
		dataType  = fieldObj.getAttribute("fdt");
	
		if (!fnIsNull(dataType) && (dataType == "fdate" ||dataType =="date" || dataType =="datetime"))
		{
			fnSetFocusForDate(fieldObj);
		}
		else if(fieldObj.disabled == false)	{
			if(fieldObj.type == "text")	{
				fieldObj.focus();
				fieldObj.select();
			} else if (fieldObj.type != "hidden") {
				fieldObj.focus();
			}
		}
	}
}

/**	This function refines the string and returns the
*	parsed string. It looks for single quotes ('),
*	double quotes ("),less than (<), greater than (>),
*	etc. and precedes them with a "\".
*/
function refineString (parseString){
	var charArray=["'", "\"", "<", ">"];

	for(var i=0;i<charArray.length;i++){
		var fromIndex = 0;
		var index = 0;
		var parseStr = null;

		switch(charArray[i]){
			case "'": parseStr="#39"; 	//ASCII for '\'';
				break;
			case "\"": parseStr="#34";	//ASCII for '"';
				break;
			case "<": parseStr="#60";	//ASCII for '<';
				break;
			case ">": parseStr="#62";	//ASCII for '>';
				break;
			default: parseStr="#34";	//ASCII for '"';
		}

		if (parseString == null || parseString.length == 0)
			return parseString;

		var tmp1,tmp2,tmp3;

		while (fromIndex < parseString.length){
			index = parseString.indexOf (charArray[i]);

			if (index == -1){
				fromIndex = parseString.length;
				continue;
			}

			tmp1 = parseString.substring(0,index);
			tmp2 = parseString.substring(index,index+1);
			tmp3 = parseString.substring(index+1,parseString.length);

			tmp2 = "&"+parseStr+";";

			parseString = tmp1+tmp2+tmp3;

			fromIndex++;
		}
	}

	return parseString;
}//End of refineString


/**	This function refines the string and returns the
*	parsed string. It looks for ASCII values of single quotes (&#39;),
*	double quotes (&#34;), etc. and precedes them with a "\".
*/
function addSlash (parseString){
	var charArray=["&#39;", "&#34;"];

	for(var i=0;i<charArray.length;i++){
		var fromIndex = 0;
		var index = 0;
		var parseStr = null;

		if (parseString == null || parseString.length == 0)
			return parseString;

		var tmp1,tmp2,tmp3;

		while (fromIndex < parseString.length){
			index = parseString.indexOf (charArray[i],fromIndex);

			if (index == -1){
				fromIndex = parseString.length;
				continue;
			}

			tmp1 = parseString.substring(0,index);
			tmp2 = parseString.substring(index,index+1);
			tmp3 = parseString.substring(index+1,parseString.length);

			tmp2 = "\\"+tmp2;

			parseString = tmp1+tmp2+tmp3;

			fromIndex = index + 2;
		}
	}

	return parseString;
}//End of addSlash

function showSetList(obj,ctrlOrMorph,inPreceedence,objDesc){
	var set = "";
	var sUrl = "";
	var preceedence = 'B';
	var url = "../arjspmorph/";

    if(arguments.length > 1){
		if(ctrlOrMorph == 'morph')
		url = "../";
	}

	obj.value = obj.value.replace(/\'/,"\"");

    if(arguments.length > 2){
        preceedence = inPreceedence;
    }

	if(obj != null){
		set = obj.id;
	}

	if (arguments.length <4){
		sUrl = url +applangcode+"/get_set_list.jsp?SetId="+escape(obj.value)+"&wReturn="+set+"&wReturnDesc=NULL&preceedence="+preceedence;
	}else{
		sUrl = url +applangcode+"/get_set_list.jsp?SetId="+escape(obj.value)+"&wReturn="+set+"&wReturnDesc="+objDesc.id+"&preceedence="+preceedence;
	}

	if(!window.showModalDialog)
	{
		opFieldsArr=[];
		opFieldsArr[0]=obj;
		opFieldsArr[1]=objDesc;
	}
	var retVal = popModalWindow(sUrl,"SetIdList");

	  if(window.showModalDialog){ 
	    if (retVal != null && retVal != undefined ){
			//Array for taking the values after splitting the value with "|".
			var liarrBufArray = retVal.split("|");

	        obj.value = liarrBufArray[0];
			if(objDesc != null) objDesc.value = liarrBufArray[1];
		}
    }
}


function disableFields(){
	for(i=0; i < arguments.length; i++  ){
			obj = 	eval("document.forms[0]."+arguments[i]);
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

function enableFields(){
	for(i=0; i < arguments.length; i++  ){
		obj = 	eval("document.forms[0]."+arguments[i]);
		if((undefined != obj) && (null != obj)){
			//enable ui field for given hidden field.
			if(obj.length == undefined && obj.getAttribute("fdt") == "fdate" )
				fnEnableUIField(obj,"Y");
			else{
				if(!(typeof(obj.length) !="undefined" && typeof(this.obj.type) == "undefined"))
					obj.disabled = false;
				else
					fnEnableDisableRadioButtons(obj,'');
			}
		}
	}
}
function fnPopUpExceptionWindow(returnObj){
	funcName = "this."+"locfnPopUpExceptionWindow";
	if(eval(funcName) != undefined){
		return eval(funcName).call(this);
	}
        localPrintFired = "this."+"isLocalPrintFired";
        var isLocalPrintFired = (eval(localPrintFired) != undefined);

	if(sPopUpExceptionWindow.toUpperCase() != 'TRUE') return;
	var returnObjId = "submitform"; //default return object id
	if((returnObj != null) && (returnObj != undefined)){
		returnObjId = returnObj.id;
	}
			
	genericCallBackFn="genericCallBack_Excp";
	winOpenObj = popModalWindowVarRefAuth("../arjspmorph/"+applangcode+"/excp_popup_screen.jsp?wReturn=submitform", "excp_popup_screen","600","325","43","24");
	
}

function genericCallBack_Excp(rValue)
{

	localPrintFired = "this."+"isLocalPrintFired";
    var isLocalPrintFired = (eval(localPrintFired) != undefined);

	var returnObjId = "submitform"; //default return object id
    if((rValue != null) && (rValue != undefined)){
        returnObjId = rValue;
    }
	if(isLocalPrintFired){
                        if(this.isLocalPrintFired.toUpperCase() == 'Y' && returnObjId  == "Submit"){
                                document.forms[0].callMode.value = 'N';
                                document.forms[0].localPrint.click();
                                return;
                        }
                }

	if(returnObjId == "Submit"){
    	fnAssignDateOnLoad(document.forms[0]);
        document.forms[0].callMode.value = 'N';
		 if((document.forms[0].Submit != undefined) && (document.forms[0].Submit != null)){
        document.forms[0].Submit.click();
		}
		else if((document.forms[0].Accept != undefined) && (document.forms[0].Accept != null)){
		document.forms[0].Accept.click();
		}
    }
    if(returnObjId == "Refer"){
        document.forms[0].submitform.value = 'REFERDATA';
        document.forms[0].actionCode.value='REFERDATA';
        document.forms[0].submit();
    }
    if(returnObjId == "RefSubmit"){
        fnAssignDateOnLoad(document.forms[0]);
        document.forms[0].Submit.click();
    }
}

function Authorize_CallBack(){
	winOpenObj.blur();
	window.focus();
	if (SSO)
    {
		var retVal	=	CallSSOFunctionForModalDailogue(this);
	}
    else
    {
		window.name="excp_popup_screen";
    	window.open(jsUtil.formatUrl("../../arjspmorph/INFENG/authorize_user.jsp?groupName=<%=GroupName%>"),USERID+"_UserAuthorization", "width=400, height=135,top=230,left=270");
	}
}

function ssoAuthCallBack(retVal){
	winOpenObj.focus();
	winOpenObj.ssoAuthCallBackWinOpen(retVal);
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

//	This function validates all the form controls based on their datatypes
//	Added by Vasudevan G on 29-08-02

function validateTypes(objForm) {
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
			if ((datatype == 'fdate') || (datatype == 'datetime') || (datatype == 'date'))	{
				 if (!fnIsValidDate(obj)) {
                    if(calbase == "00")
                        {
                            if (valSwitch)
                            {
                                switchCalArr[1] = finbranchResArr.get("FAT002593");
                            }
                            else
							{	if (aFlag == 'Y')
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
			if (datatype == 'ftime')	{
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
			if (datatype == 'fint')	{
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
			if (datatype == 'fpint')	{
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
			if (datatype == 'frate')	{
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
				}	else if (!fnIsNull(obj.value) && !fnValidateConvRate(obj,10)){
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

//	This function validates the coversion rate form field
//	Added by Vasudevan G on 29-08-02
function fnValidateConvRate(objAmtField, precision){
	var numericPart = 0;
	var decimalPart = 0;
	var iIndex = 0;
	var bValidAmount = false;
	var sourceAmt = getValInStdFormat(objAmtField.value);
	var DEC_PART_LEN = 10;
	var NUM_PART_LEN = 11;
	var TOTAL_LEN = 21;

	if(isNaN(sourceAmt)){
		alert(finbranchResArr.get("FAT000189"));
	} else {
		iIndex = sourceAmt.indexOf(".");
		if(iIndex == -1){
			numericPart = sourceAmt;
		} else {
			numericPart = sourceAmt.substring(0,iIndex);
			decimalPart = sourceAmt.substring(iIndex+1);
			DEC_PART_LEN = DEC_PART_LEN > precision ? precision : DEC_PART_LEN;
		}
		if(sourceAmt.length > TOTAL_LEN){
			alert(finbranchResArr.get("FAT000523")+TOTAL_LEN+""+finbranchResArr.get("FAT000524"));
		} else if(numericPart.length > NUM_PART_LEN){
			alert(finbranchResArr.get("FAT000529"));
		} else if(decimalPart.length > DEC_PART_LEN){
			alert(finbranchResArr.get("FAT000523")+DEC_PART_LEN+""+finbranchResArr.get("FAT000526"));
		} else {
			bValidAmount = true;
		}
	}
	objAmtField.value = getValInCustomFormat(sourceAmt);
	return bValidAmount;
}

function isPageEmpty(objForm){
	var FMND_ATTRIB_NAME = "fmnd";
	var frmElem = objForm.elements;
	var fmndVal = ""

	for(var i=0; i < frmElem.length; i++){
		fmndVal = frmElem[i].getAttribute(FMND_ATTRIB_NAME) ;
		if( (fmndVal != null) && (fmndVal != "") ){
			fmndVal = fmndVal.toUpperCase();
			if( ( (fmndVal == 'Y' ) || (fmndVal == 'TRUE' ) )  &&
				!fnIsNull(frmElem[i].value) && frmElem[i].type!='radio' ) {
				return false;

			}	else if	( ( fmndVal == 'Y'  || fmndVal == 'TRUE' )  &&
				frmElem[i].type=='radio')	{
				var obj=	eval("document.forms[0]."+ frmElem[i].id);
				if(!fnIsNull(getRadioValue(obj)))	{
					return false;
				}
			}
		}
	}
	return true;
}

/* enables label[readonly] fields */
function fnEnableDescFields(objForm){
	fnEnableFieldsBasedOnAttribute(objForm, "fds", "Y")
}

/* enables fields based on the attribute and its value */
function fnEnableFieldsBasedOnAttribute(objForm, sAttributeName, sAttributeValue){
	var frmElem = objForm.elements;
	var frmElemLen = frmElem.length;
	var fieldObj = "";
	var fieldObjAttributeValue = "";
	for(iCount = 0; iCount < frmElemLen; iCount++){
		fieldObj = frmElem[iCount];
		fieldObjAttributeValue = fieldObj.getAttribute(sAttributeName);

		/* field attribute value is null or blank, skip */
		if( (fieldObjAttributeValue == null) || (fieldObjAttributeValue == "") )
		continue;
		fieldObjAttributeValue = fieldObjAttributeValue.toUpperCase();

		/* field attribute value is found, disable the field object*/
		if(fieldObjAttributeValue == sAttributeValue.toUpperCase()) fieldObj.disabled = false;
	}
}

/* validates form fields based on fmnd [mandatory] attribute and its value */
function fnValidateMandatoryFields(){
	var frmElem = document.forms[0].elements;
	var frmElemLen = frmElem.length;
	var fieldObj = "";
	var mandatoryAttributeValue = "";

	for(iCount = 0; iCount < frmElemLen; iCount++)	{
		fieldObj = frmElem[iCount];
        /*
        Changes done to implement mandatory check in RADFX for tabs.
        divId is an attribute of the fields in the page.
        Code is added to disable the FE validation during naviagation between tabs
        */
        var divIdAttr = fieldObj.getAttribute("divId");//field attribute divId is captured
        var blockId =  fieldObj.getAttribute("blockId");// field attribute blockId is captured
        if(divIdAttr !=null)
        {
            var fldPrntDivId = divIdAttr.split("#");
            if(eval(document.forms[0].divId.value.split("#")) != undefined){
                var frmPrntDivId = document.forms[0].divId.value.split("#");
                //Checks whether the formelement is null or not
                if (frmPrntDivId[0] != fldPrntDivId[0])//to avoid FE validation during tab navigation.
                    continue;
            }
        }

		/* field obj is neither text or select type, skip validation */
		if( (fieldObj.type != 'text') && (fieldObj.type != 'select-one') && (fieldObj.type != 'textarea') && (fieldObj.type != 'radio') ) continue;
		mandatoryAttributeValue = fieldObj.getAttribute("fmnd");

		/* mandatory attribute value is null or blank, skip validation */
		if( (mandatoryAttributeValue == null) || (mandatoryAttributeValue == "") ) continue;
		mandatoryAttributeValue = mandatoryAttributeValue.toUpperCase();

		/* mandatory attribute value is either true or y[es], do validation */
		if( (mandatoryAttributeValue == "TRUE") || (mandatoryAttributeValue == "Y") ){
			/*fieldObj is a radio and value selected is null*/
			if((fieldObj.type == 'radio') )	{
				var flds	=	eval("document.forms[0]."+fieldObj.id);
				var len	=	flds.length;
				if(len!=undefined && len!=null)	{
					iCount=iCount+(len-1);
				}
				if(!checkAndFocusRadio(flds,len,divIdAttr,blockId)) {
					return false;
				}
			}
			if(fieldObj.type != 'radio'){
				/* field object value is either null or blank, alert err msg */
				if( fnIsNull(fieldObj.value) ){
                   if(divIdAttr !=null){
                        if(blockId !=null){
                            var fldBlkId =blockId.split("_");
                            if(fldBlkId[1]=="2")
                                fnShowNextMultPage();
                            else if(fldBlkId[1]=="1")
                                fnShowPrevMultPage();
                        }
                    }
					fieldObj.focus();
					alert(finbranchResArr.get("FAT000924"));
					return false;
				}
				fieldType = fieldObj.getAttribute("fdt");
				/* field type is numeric type, check if it is zero*/
				if( (fieldType != null) && (fieldType != "") && ((fieldType == "fint") || (fieldType == "fpint") || (fieldType == "frate")) ){
					var tempVal = getValInStdFormat(fieldObj.value);
					if( isNaN(tempVal) || (Number(tempVal) == 0) ){
                        var fieldDivId = fieldObj.getAttribute("divId");//field attributddivId is captured
                        if(fieldDivId !=null && (!fnIsNull(fieldDivId)))
                        {
                            showCurrentDiv(fieldDivId);
                        }
						if(divIdAttr !=null){
							 if(blockId !=null){
								var fldBlkId =blockId.split("_"); 
	                            if(fldBlkId[1]=="2") 
                                fnShowNextMultPage(); 
                                else if(fldBlkId[1]=="1") 
                                fnShowPrevMultPage(); 
                                } 
                         } 

						fieldObj.focus();
						alert(finbranchResArr.get("FAT000146"));
						return false;
					}
				}
			}
		}
	}
	if(!validateSpecialChar()){
		return false;
	}
	/* everything is okey */
	return true;
}
function checkAndFocusRadio(flds,len,divIdAttr,blockId)	{
	var fld		=	null;
	var isChecked=	false;
	if(len==undefined ||len==null)	{
		fld=flds;
	}	else	{
		fld	=flds[0];
	}
	for(var i=1;i<len;i++)	{
		if(flds[i].checked==true)	{
			fld	=	flds[i];
			isChecked	=true;
			break;
		}
	}
	if(!isChecked && fld.checked==false)	{

            if(divIdAttr !=null){
                 if(blockId !=null){
                	 var fldBlkId =blockId.split("_");
                	 if(fldBlkId[1]=="2")
                     fnShowNextMultPage();
                     else if(fldBlkId[1]=="1")
                          fnShowPrevMultPage();
                       }
                 }
		fld.focus();
		alert(finbranchResArr.get("FAT001313"));
		return false;
	}	else if(fnIsNull(fld.value) )	{

           var fieldDivId = fld.getAttribute("divId");//field attribute divId is captured
            if ((fieldDivId !=null) && (!fnIsNull(fieldDivId))){
                showCurrentDiv(fieldDivId);
            }
		/* field object value is either null or blank, alert err msg */
		
            if(divIdAttr !=null){
                 if(blockId !=null){
                     var fldBlkId =blockId.split("_");
                     if(fldBlkId[1]=="2")
                     fnShowNextMultPage();
                     else if(fldBlkId[1]=="1")
                          fnShowPrevMultPage();
                       }
                 }
		fld.focus();
		alert(finbranchResArr.get("FAT001313"));
		return false;
	}
	return true;
}

/*	CALL THIS FUNCTION IN PAGE ONLOAD EVENT HANDLER		*/
var theBuffer;

function initialize(){
	theBuffer = new exchanger("myframe");
}

/*	CALL THIS FUNCTION WHEN DATA NEEDS TO BE SENT TO THE SERVER		****
*	This function builds a url based on the return values expected and sends the data to server.
*	@fetchId		- 	This field is helpful to indicate which function to call in the backend
*	@precedence		-	This field is helpful to set the precedence (FAB or FIN) in the backend
*	@wReturn		-	This field is helpful to the take the value as parameter for fetching the record from the backend
*	@wReturnDesc	-	This field is the helpful to populate the return value. This is used for populating return values.
*						This field will contain '|' seperated html element id's into which the return values need to be
*						populated.
*
* This function needs to be called from a local javascript function with the
* group link javacript after checking the field for null value.If the field is
* null then call the clearDescField() function with the required parameters.
*/
function sendDataToServer(frameName,fetchId, precedence, wReturn, wReturnDesc){
	var strArray = wReturn.split("|");
	var tmpStr="";
	if (strArray.length > 0){
	var newStr="";
	
	for (var i=0;i<strArray.length;i++){
		newStr=eval('document.forms[0].'+strArray[i]+'.value');
		newStr=fnTrim(newStr);
		tmpStr = tmpStr+"|"+escape(newStr);
		}
		tmpStr = tmpStr.substring(1);
	}

    var bUrl = getBaseUrl();
    var sUrl = bUrl + finContextPath + "/arjspmorph/"+applangcode+"/fetch.jsp?rtId="+rtId+"&fetchId="+fetchId+"&precedence="+precedence;
	if(wReturn != '')
		sUrl = sUrl+"&wReturn="+tmpStr;

	if(wReturnDesc != '')
		sUrl = sUrl+"&wReturnDesc="+wReturnDesc;

    var xMax = screen.width, yMax = screen.height;
    var xOffset = (xMax - 120), yOffset = (yMax - 150);
    var params;
    if(window.showModalDialog){
	    params = "dialogWidth=0px;dialogHeight=0px;dialogLeft="+xOffset+"px;dialogTop="+yOffset+"px";
    }else{
	    params = "dialogHeight:100px;dialogleft:843px;dialogWidth:175px;dialogtop:588px";
    }
     params += ";status=no;toolbar=no;menubar=no;resizable=no;help=no;center=no";

	if(window.showModalDialog){
		var inpData = wReturnDesc;
		var obj = document.forms[0];
		var outData = window.showModalDialog(sUrl,document.forms[0],params);
		
		if(outData == undefined)
		{
			return false;
		}
	
		if (outData != null && typeof(outData) == "string" && outData == "TIMEOUT") 
		{ 
			var logoutParams = new Array(1); 
			logoutParams[0] = finConst.FORCED_LOGOUT; 
			handleWindowDisplay(finConst.DOLOGOUT, logoutParams);
			return; 
		}

		if (outData.toLowerCase().indexOf("|") == -1){
			if(outData != "")
				alert(""+outData+"");
			return false;
		}

		var inBufferArr 	= 	inpData.split("|");
		var outBufferArr 	= 	outData.split("|");
		var outDataArrLen   =   outBufferArr.length;
		var checkDoubleSel	=   'N';

		if (inBufferArr.length > outBufferArr.length){
			 alert("Input fields which needs to be populated are \nnot matching the return values");
			 return false;
		}

		var inputFld	=	null;
		var outFldValue	=	null;
    	var i=0;
    	var errIndex=0;
		for (i=0;i<inBufferArr.length;i++){
			inputFld	=	inBufferArr[i];
			outFldValue	=	outBufferArr[i];
			if(isEmptyObjValue(inputFld))	{
				continue;
			}
			if(inputFld.substring(0,4) == 'sel1'){
				eval("obj."+inputFld.substring(4,inputFld.length)+".value=\""+outFldValue+"\"");
				checkDoubleSel = 'N';
			}
			else if(inputFld.substring(0,4) == 'sel2'){
				var tmpOutBufferArr = outFldValue+"/"+outBufferArr[i+1];
				eval("obj."+inputFld.substring(4,inputFld.length)+".value=\""+tmpOutBufferArr+"\"");
				checkDoubleSel = 'Y';
			}
			else if(inputFld.substring(0,3) != 'chk'){
				if(checkDoubleSel != 'Y'){
					if(inputFld.substring(0,3) == 'rdo'){
						setRadioValue(inputFld.substring(3,inputFld.length),outFldValue);
					}else{
						eval("obj."+inputFld+".value=outFldValue");
					}
				}
				else{
					if(inputFld.substring(0,3) == 'rdo')
						setRadioValue(inputFld.substring(3,inputFld.length),outBufferArr[i+1]);
					else
					eval("obj."+inputFld+".value=\""+outBufferArr[i+1]+"\"");
				}
			}
			else
			{
				if(outFldValue == 'Y')
				{
					eval("obj."+inputFld+".checked=true");
				}
			}
		}

   		// This change was done to display the description togethre with warning.
      	// Such scenario will arise, in cases of account id when warning such as
		// "Account has been closed" is thrown but at the same time, description
      	// also is displayed.
     	// Corresponding change has to be done in fetch.jsf to send the error message
      	// prepended with FETCH_ERR.
		if((outDataArrLen-1)>0&& inBufferArr.length < outDataArrLen && !isEmptyObjValue(outBufferArr[outDataArrLen-1]))
		{
			errIndex=outBufferArr[outDataArrLen-1].indexOf(FETCH_ERR);
			if (errIndex != -1)
			{
				alert(outBufferArr[outDataArrLen-1].substring(errIndex + FETCH_ERR_LEN));
				return false;
			}
		}
	}
	else
	{
		var retValue = window.open(sUrl,"","width=10px,height=10px,modal=yes,top="+yOffset+"px,left="+xOffset+"px,scrollbars=yes,toolbar=no,menubar=no,help=no");
		if(retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	return true;
}

function setRadioValue(obj,value){
    var obj1 = document.forms[0];
    var isArray = (typeof(obj.length)=="undefined")?false:true;

    if(value=="") return;

    if(isArray && (typeof(obj.type)=="undefined")){
        for(var i=0;i<obj.length;i++){
            if(eval("obj1."+obj+"["+i+"].value") == value){
                eval("obj1."+obj+"["+i+"].checked = true");
                break;
            }
        }
    }

    return;
}

// Holds id of currently visible layer
var cur_lyr;

function loadLyr(lyr) {
	if (cur_lyr) {
		var curcss = get_lyr_css(cur_lyr);
		if (curcss) curcss.display="none";
	}
	cur_lyr = lyr;
	var curcss = get_lyr_css(cur_lyr);
	if (curcss) {
		curcss.display = "";
		curcss.zIndex = 1000;	// some browsers need z-index set
	}
}

//Hides the currently visible layer
function hideLyr(id) {
	if (cur_lyr) {
		var curcss = get_lyr_css(cur_lyr);
		if (curcss) curcss.display="none";
	}
}

//This function disables all the search icons having the id 'sLnk*'
function disableHyperLnks(count){
	var lnkStr = "sLnk";

	for (var i=1;i<=parseInt(count+1,10);i++){
		var lnkStrId = lnkStr+i;
		hideImage(lnkStrId);
	}
}

function fnValidateAndFormatAmt(format, obj, crncy, prn, idx) 
{ 
	return(low_formatAmt(format, obj, crncy, null, prn, idx)); 
} 

function newformatAmt(format, obj, crncy, prn, idx)
{
	return(low_formatAmt(format, obj, crncy, null, prn, idx));
}
function newformatunit(format, obj, crncy, prn, idx,zerchk)
{
	return(low_formatUnit(format, obj, crncy, null, prn, idx,zerchk));
}
function low_formatUnit(format, obj, crncy, prec, prn, idx,zerochk)
{
	var isObject = (prn != 'Y');
	
	var isCrncyAvl = !fnIsNull(crncy);
	var isPrecAvl = !fnIsNull(prec);

	var sourceAmt = 0;
	var iIndex = 0;
		
	format = (fnTrim(format)).toUpperCase();
	if (format != "MILLION" && format != "LAKH") {
	    alert(finbranchResArr.get("FAT001374"));	
		low_setAmtFldFocus(isObject, obj, idx);
		return false;
	}

	var amt = (isObject) ? obj.value : obj;
	amt = fnTrim(amt);
	if (fnIsNull(amt)) {
		if (!isObject)
			return obj;

		return;
	}

	 amt = removeMantissa(amt);
	amt = getAmtInStdFormat(amt);

	if (!low_isValidUnit(amt)) {
		low_setAmtFldFocus(isObject, obj, idx);
		return false;
	}

	amt = low_convertAmt(amt);

	if (zerochk == 'Y') 
	{
		prec = '0';
		sourceAmt = removeCommas(amt);
		
		// Remove the decimal part. set amount with only mantissa.
		iIndex = sourceAmt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex != -1)
		{
			amt = sourceAmt.substring(0,iIndex);
		}
	}
	else
		prec = '6';

	if (isObject && !low_validateUnitWithPrec(amt,obj, prec, zerochk))
	{
		low_setAmtFldFocus(isObject, obj, idx);
		return false;
	}

	amt = checkZeroes(amt,prec);

	if (format == 'MILLION'){
		amt = formatToMillion1(amt,prec);
	}
	else {
		amt = formatToLakh1(amt,prec);
	}

	amt = getAmtInCustomFormat(amt);
	if (isObject) {
		obj.value = amt;
	}
	else {
		document.write(amt);
	}
	return true;
}

function low_isValidUnit(unit)
{
    var unitLen = unit.length;
    var lastChar = (unit.charAt(unitLen - 1)).toUpperCase();

    if (isNaN(lastChar) && lastChar != '.') {
        var str = unit.substring(0, unitLen - 1);
        if (isNaN(str)) {
            alert(finbranchResArr.get("FAT003921"));
            return false;
        }

        var val = "";
        if (eval("this.custGetAmountCodeValue") != undefined) {
            val = custGetAmountCodeValue(lastChar);
        }
        else {
            val = getAmountCodeValue(lastChar);
        }
        if (val == undefined) {
            alert(finbranchResArr.get("FAT001374"));
            return false;
        }
        else {
            return true;
        }
    }

    if (isNaN(unit)) {
        alert(finbranchResArr.get("FAT003921"));
        return false;
    }

    var regExp = /[Ee]/g;
    if (regExp.test(unit)) {
        alert(finbranchResArr.get("FAT003921"));
        return false;
    }

    return true;
}

function getPrec(crncy){
	var crncyPrec = 2;
	var defaultPrec = 2;

	if(fnIsNull(crncy))
		return crncyPrec;
	crncy = crncy.replace('\'','\\\'');
	var prec = eval("precArray['"+crncy.toUpperCase()+"']");
	if(prec != undefined && prec != "")
		return prec;
	else
		return defaultPrec;
}

function checkAmtWithCrncy(format,amtObj,crncyObj){
	var amt = amtObj.value;
	var crncy = crncyObj.value;
	if(fnIsNull(crncy)){
		alert(finbranchResArr.get("FAT000530"));
		if(!crncyObj.disabled)
			crncyObj.focus();
		return;
	}

	var prec = getPrec(crncy);
	formatAmountToMillionOrLakh(format, amtObj, prec, 'N');
}

function checkZeroes(amt,prec){
	var sourceAmt = removeCommas(amt);
	var finalAmt = "";
	var numericPart = 0;
	var decimalPart = 0;
	var iIndex = 0;
	var count = 0;

	//Strip initial zeroes.
	iIndex = sourceAmt.indexOf(DEF_DECIMAL_SEPARATOR);
	if(iIndex != -1){
		numericPart = sourceAmt.substring(0,iIndex);
		decimalPart = sourceAmt.substring(iIndex+1);
	}
	else{
		numericPart = sourceAmt;
	}
	for (iIndex=0; iIndex<numericPart.length; iIndex++) {
		if (numericPart.charAt(iIndex) != '0') {
			break;
		}
		count++;
	}
	if (count == numericPart.length) {
		numericPart = "0";
	}
	else {
		numericPart = numericPart.substring(iIndex);
	}
	if (parseFloat(decimalPart) == 0) {
		sourceAmt = numericPart;
	}
	else {
		sourceAmt = numericPart + "." + decimalPart;
	}

	iIndex = sourceAmt.indexOf(DEF_DECIMAL_SEPARATOR);
	if(iIndex != -1){
		numericPart = sourceAmt.substring(0,iIndex);
		decimalPart = sourceAmt.substring(iIndex+1);
	}
	else{
		return sourceAmt;
	}

	var decPartLength = decimalPart.length;

	if(decPartLength > prec){
		var ZERO = '0';
		var val = ZERO;
		var diff = decPartLength - prec;
		var bCheck = true;

		for(var i=decPartLength;i>prec;i--){
			val = decimalPart.charAt(i - 1);
			if(val != ZERO){
				bCheck = false;
				break;
			}
		}

		if(bCheck){
			if(prec == 0)
				finalAmt = numericPart;
			else
				finalAmt = sourceAmt.slice(0,-(diff));
		}
	}

	if(finalAmt != "")
		return finalAmt;

	return sourceAmt;
}

function submitFromAddrTypeErr(sGroupName,sErrLLName, sFocusField){
	if(fnValidateForm()){
		var frm = document.forms[0];
		frm.submitform.value="addrType";
		frm.addrType.value=sErrLLName;
		frm.FocusField.value=sFocusField;
		frm.submit();
	 }
}

function fnIsLeapYear(sYear){
	var iYear = Number(sYear);
	return ( (((iYear % 4) == 0) && ((iYear % 100) != 0)) || ((iYear % 400) == 0) );
}

function fnAddYearsToDate(sYearsToAdd, sDate){
	var arrDate = sDate.split("-");
	var iDay = arrDate[0];
	var iMonth = arrDate[1];
	var iYear = arrDate[2];
	var bSrcYrLeapYr = fnIsLeapYear(iYear);

	iYear = Number(iYear)+Number(sYearsToAdd);

	if(	(bSrcYrLeapYr)
	&& 	(!fnIsLeapYear(iYear))
	&& 	(Number(iMonth) == 2)
	&&	(Number(iDay) > 28)){
		iDay = 28;
	}
	return iDay+"-"+iMonth+"-"+iYear;
}

function fnRemoveCrncy(sSrcAmt){
	var iCrncyIndex = sSrcAmt.indexOf("|");
	if(iCrncyIndex != -1)	return sSrcAmt.substring(0, iCrncyIndex);
	else return sSrcAmt;
}

function arjspmorphFooter() {
    with(document) {
        write('<input type="hidden" name="rtId" id="rtId" value="">');
        write('<input type="hidden" name="reqId" id="reqId" value="">');
		    if(!window.showModalDialog){
			    write('<div id="overlay"></div>');
		    }
    }
     document.forms[0].rtId.value = rtId;
     document.forms[0].reqId.value = reqId;

    var unauthErrDesc = "Unauthorized Session, Close the window to logout";
    if(document.forms[0].innerText.indexOf(unauthErrDesc) != -1){
       window.returnValue = "TIMEOUT";
    }
	
	if(!window.showModalDialog){
		if(this.HTMLFormElement)
			HTMLFormElement.prototype.std_child_submit = document.forms[0].submit;   // UXH_CHANGE
		else
			std_child_submit = document.forms[0].submit;
				
		document.forms[0].submit = function()               // Override the form submit function
		{
			if(!childFormAlreadySubmitted)
			{
				childFormAlreadySubmitted = true;      // Set the variable so that form doesn get submitted again.
				if(document.forms[0].target !=null && window.parent.frames[document.forms[0].target] != undefined)
					window.parent.frames[document.forms[0].target].isChildSubmit= true; // handled only for popups with frames [ Account id searcher ] where submit is not reloading the popup 
				isChildSubmit=true;
				if(eval(this.std_child_submit)!=undefined)
					this.std_child_submit();                               // Invoke the original submit
				else
					std_child_submit();
			}
			childFormAlreadySubmitted=false;
		}	 
	}
}

function showCancelWaitScr()
{
	try
	{
		disableTimers();
		disableMTreeTimer();

		window.scroll(0,0);
		window.document.body.scroll = "NO";
		var cwDiv = get_lyr_css("cancelwait_div");
		var cwLyr = null;
		var isVisible = (cwDiv.visibility == 'visible');

		if (isVisible)
		{
			cwLyr = get_lyr_css("cancelwait");
			if (cwLyr) cwLyr.display="";
		}
		else {
			cwDiv.top='0px';
			cwDiv.left='0px';
			cwDiv.height='690px';
			cwDiv.width='1020px';
			cwDiv.visibility = 'visible';
			var id = "cancelwait";
			cwLyr = document.getElementById(id);
			if (cwLyr) cwLyr.src='../arjspmorph/' + applangcode + '/cancelwait.jsp';
		}
	}
	catch (e) {
		throw e;
	}
}

function hideCancelWaitScr()
{
	try
	{
		window.document.body.scroll = "YES";
		var cwDiv = get_lyr_css("cancelwait_div");
		cwDiv.top='0px';
		cwDiv.left='0px';
		cwDiv.height='0px';
		cwDiv.width='0px';
		cwDiv.visibility = "hidden";
		var id = "cancelwait";
		cwLyr = document.getElementById(id);
		if (cwLyr) cwLyr.src='../arjspmorph/' + applangcode + '/cancelwait.jsp?stopTimer=Y';

		enableTimers();
		prevEventDate = new Date();
		enableMTreeTimer();
	}
	catch (e) {
		throw e;
	}
}

function addRow(arrObj){
	var recNum = arrObj[0]; //Record Number.
	var isCurrRec = arrObj[1]; //Is the record is current one.

	var locStyle = "";
	var suffix = "[" + recNum + "]";
	var status = "";

	if( isCurrRec == 'Y')
		locStyle = 'class="searclist1arow"';
	else{
		if(recNum % 2 == 0){
			locStyle = 'class="searclist1"';
		}
		else{
			locStyle = 'class="searclist2"';
		}
	}

	document.write('<tr ' + locStyle + ' >');

	for(iInputs = 0;iInputs < inputs.length;iInputs++){
		document.write('<td class="ctext_small" align="' + inputs[iInputs][1] + '">');

		if(inputs[iInputs][0] == "checkbox"){
			if(arrObj[iInputs+2] == 'Y')
				status = " checked ";
			document.write('<input type="checkbox" id=""chkBox' + suffix + '" name="chkBox' + suffix + '" disabled ' + status + '> </td>' );
		}
		else if(inputs[iInputs][0] == "radio"){
			if(arrObj[iInputs+2] == 'Y')
				status = " checked ";
			document.write('<input type="radio" id="rad' + suffix + '" name="rad' + suffix + '" disabled ' + status + '> </td>' );
		}
		else{
			 if(inputs[iInputs][2] != null && inputs[iInputs][2] == "amt"){
				var locAmt = '';
				var locCurr = '';
				var index = arrObj[iInputs+2].indexOf('|');
				if(index != -1){
					locAmt = arrObj[iInputs+2].substring(0,index);
					locCurr = arrObj[iInputs+2].substring(index+1);
				}
				newformatAmt(amtFormat,locAmt,locCurr,'Y');
				document.write('&nbsp; </td>');
			}
			else if(inputs[iInputs][2] != null && inputs[iInputs][2] == "date"){
            			document.write(jsUtil.encodeChar(fnConvertToUIDate(arrObj[iInputs+2]))+'&nbsp;</td>');
            		}
            		else{
						document.write(jsUtil.encodeChar(arrObj[iInputs+2]) + '&nbsp; </td>');
			}
		}
		status = "";
	}

	document.write('</tr>');
}

function addMonthsToDate(initDateObj,adnMonths,adnDays,dispDateObj){
        var tempDate;
        if(fnIsNull(initDateObj.value) || !fnIsValidDate(initDateObj)){
                dispDateObj.value="";
                return false;
        }

        tempDate=initDateObj.value;
        var mnemonicEnabled = initDateObj.getAttribute("mnebl");
        if((null != mnemonicEnabled) && (mnemonicEnabled) && isValidDateMneumonic(tempDate)){
                return true;
        }

        var tempDay = "01";
        var strArray = tempDate.split("-");
        var iDay = adnDays;
        var iMonth = parseFloat(strArray[1]);
        var iYear = parseFloat(strArray[2]);

        if(!fnIsNull(adnMonths) &&fnIsPositiveNumber(adnMonths)){
                iMonth = iMonth+parseInt(adnMonths,10);
        }

        var targetDate = new Date();
        targetDate.setFullYear(iYear, --iMonth, tempDay);       //"--" because JS month range is 0-11 [Jan-Dec]
        iMonth = targetDate.getMonth() + 1;     //"+1" because JS month range is 0-11 [Jan-Dec]
        iYear = targetDate.getFullYear();

                if( (adnDays == 29) || (adnDays == 30) || (adnDays == 31) )
                {
                        if (iMonth == 2)
                        {
                                if (fnIsLeapYear(iYear))
                                        iDay = 29;
                                else
                                        iDay = 28;
                        }
                }

                if(adnDays == 31)
                {
                        if(iMonth == 4)
                                iDay = 30;
                        else if (iMonth == 6)
                                iDay = 30;
                        else if (iMonth == 09)
                                iDay = 30;
                        else if (iMonth == 11)
                                iDay = 30;
                }

        iDay = iDay < 10 ? "0"+iDay : iDay;
        iMonth = iMonth < 10 ? "0"+iMonth : iMonth;
        dispDateObj.value = iDay+"-"+iMonth+"-"+iYear;
}

function addDaysToDate(initDateObj,adnDays,dispDateObj){
        var tempDate;
        if(fnIsNull(initDateObj.value) || !fnIsValidDate(initDateObj)){
                dispDateObj.value="";
                return false;
        }

        tempDate=initDateObj.value;
        var mnemonicEnabled = initDateObj.getAttribute("mnebl");
        if((null != mnemonicEnabled) && (mnemonicEnabled) && isValidDateMneumonic(tempDate)){
                return true;
        }

        var strArray = tempDate.split("-");
        var iDay = parseFloat(strArray[0]);
        var iMonth = parseFloat(strArray[1]);
        var iYear = parseFloat(strArray[2]);

        var tempDays = parseInt(adnDays);
        tempDays = parseInt(tempDays) + parseInt(iDay);

        var targetDate = new Date();
        targetDate.setFullYear(iYear, --iMonth, tempDays);      //"--" because JS month range is 0-11 [Jan-Dec]

        iDay = targetDate.getDate();
        iMonth = targetDate.getMonth() + 1;     //"+1" because JS month range is 0-11 [Jan-Dec]
        iYear = targetDate.getFullYear();

        iDay = iDay < 10 ? "0"+iDay : iDay;
        iMonth = iMonth < 10 ? "0"+iMonth : iMonth;
        dispDateObj.value = iDay+"-"+iMonth+"-"+iYear;
}

/*The months and days will be added to initDate and will be  displayed in dispDate.
 First and last fields are objects
 Second and third fields are strings
 Date in dd-mm-yyyy form */
function addDayMonthsToDate(initDateObj,adnMonths,adnDays,dispDateObj){
	var tempDate;
	if(fnIsNull(initDateObj.value) || !fnIsValidDate(initDateObj)){
		dispDateObj.value="";
		return false;
	}

	tempDate=initDateObj.value;
	var mnemonicEnabled = initDateObj.getAttribute("mnebl");
	if((null != mnemonicEnabled) && (mnemonicEnabled) && isValidDateMneumonic(tempDate)){
		return true;
	}
	var strArray = tempDate.split("-");
	var iDay = parseFloat(strArray[0]);
	var iMonth = parseFloat(strArray[1]);
	var iYear = parseFloat(strArray[2]);
		if(!fnIsNull(adnMonths) &&fnIsPositiveNumber(adnMonths)){
			iMonth = iMonth+parseInt(adnMonths,10);
		}
		if(!fnIsNull(adnDays)&& fnIsPositiveNumber(adnDays)){
			iDay = iDay+parseInt(adnDays,10);
		}
	/*
	Create a date object, set the above computed iDay/iMonth/iYear to it
	get the day/month/year from date object and set these to dispObject field
	*/
	var targetDate = new Date();
	targetDate.setFullYear(iYear, --iMonth, iDay);	//"--" because JS month range is 0-11 [Jan-Dec]
	iDay = targetDate.getDate();
	iMonth = targetDate.getMonth() + 1;	//"+1" because JS month range is 0-11 [Jan-Dec]
	iYear = targetDate.getFullYear();
	iDay = iDay < 10 ? "0"+iDay : iDay;
	iMonth = iMonth < 10 ? "0"+iMonth : iMonth;
	dispDateObj.value = iDay+"-"+iMonth+"-"+iYear;
}

function fnDisableFormDataControls(sMode, objForm, iLinksCount){
	ADD = "A";
	COPY = "C";
	MODIFY = "M";
	VERIFY = "V";
	INQUIRY = "I";
	DELETE = "D";
	UNDELETE = "U";
	CANCEL = "X";
	REVERSAL = "E";
	CLOSE	="O";

	if(sMode == VERIFY || sMode == INQUIRY || sMode == DELETE || sMode == UNDELETE || sMode == CANCEL || sMode == REVERSAL || sMode == CLOSE ) {
		var frmElements = objForm.elements;
		var totalElements = frmElements.length;
		var argc = arguments.length;

		if(Number(iLinksCount) > 0){
			disableHyperLnks(Number(iLinksCount));
		}else if(Number(iLinksCount) == 0){
			hideAnchors();
		}

		for(i = 0; i < totalElements; i++){
			if(( frmElements[i].type == 'text' )||( frmElements[i].type == 'textarea' )) {
				frmElements[i].readOnly = true;
				if(frmElements[i].getAttribute("hotKeyId") == 'LowLimit')
					frmElements[i].readOnly = false;
			} else if (frmElements[i].type == 'select-one'){
				frmElements[i].disabled = true;
			} else if ( frmElements[i].type == 'checkbox' ) {
				frmElements[i].disabled = true;
				frmElements[i].setAttribute("fds", "Y"); //will never reset again
			}else if ( frmElements[i].type == 'radio' ) {
				frmElements[i].disabled = true;
			}

			if (objForm.menuName != null && objForm.menuName != undefined){
			objForm.menuName.readOnly = false;
			}

		}
		if( (objForm.Validate != undefined) && (objForm.Validate != null) ){
			objForm.Validate.disabled = true;
		}
		if( (objForm.Cancel != undefined) && (objForm.Cancel != null) ){
			objForm.Cancel.disabled = true;
		}
	}
	if(sMode != ADD && sMode != MODIFY && sMode != COPY)
	{
		if( (objForm.AddNew != undefined) && (objForm.AddNew != null) ){
			objForm.AddNew.disabled = true;
		}
		if( (objForm.AddNewPage != undefined) && (objForm.AddNewPage != null) ){
			objForm.AddNewPage.disabled = true;
		}
	}
}

function fnEnableFormDataControls(objForm){
	var frmElements = objForm.elements;
	var totalElements = frmElements.length;
	var argc = arguments.length;

	for(i = 0; i < totalElements; i++){
		if (frmElements[i].type == 'select-one'){
			frmElements[i].disabled = false;
		} else if ( frmElements[i].type == 'checkbox' || frmElements[i].type == 'radio') {
			frmElements[i].disabled = false;
		}
	}
	if( (objForm.Clear != undefined) && (objForm.Clear != null) ){
		objForm.Clear.disabled = false;
	}
}

function fnLpad(str,len){
    var tempstr = "";
    for(i = 0;i<(len - str.length);i++)
        tempstr = tempstr + "0";
    tempstr = tempstr + str;
    return tempstr;

}

function fnRpad(str,len){
    var templen = str.length;
    for(i = 0;i<(len - templen);i++)
        str = str + "0";
    return str;

}

function fnAddAmount(String1,String2){
	String1 = getAmtInStdFormat(String1);
	String2 = getAmtInStdFormat(String2);

    var numericPart1 = '0';
    var numericPart2 = '0';
    var decimalPart1 = '0';
    var decimalPart2 = '0';
    var decimalPart3 = '0';
    var iIndex1 = 0;
    var iIndex2 = 0;
    var index = 0;
    var mantLenMax = 0;
    var decLenMax = 0;
    var decimalSum = 0;
    var mantSum = 0;
    var carry = 0;
    var amt1 = removeCommas(String1);
    var amt2 = removeCommas(String2);

    iIndex1 = amt1.indexOf(DEF_DECIMAL_SEPARATOR);
    iIndex2 = amt2.indexOf(DEF_DECIMAL_SEPARATOR);
    if(iIndex1 == -1){
        numericPart1 = amt1;
		decimalPart1 = 'N';
    } else {
        numericPart1 = amt1.substring(0,iIndex1);
        decimalPart1 = amt1.substring(iIndex1+1);
    }
    if(iIndex2 == -1){
        numericPart2 = amt2;
		decimalPart2 = 'N';
    } else {
        numericPart2 = amt2.substring(0,iIndex2);
        decimalPart2 = amt2.substring(iIndex2+1);
    }
    mantLenMax = (numericPart1.length >numericPart2.length)?numericPart1.length : numericPart2.length;
    if(decimalPart1 != 'N' || decimalPart2 != 'N')
	{
	decLenMax = (decimalPart1.length>decimalPart2.length)?decimalPart1.length:decimalPart2.length;
	if(isNaN(decimalPart1))
	{decimalPart1 ='0';}
	if(isNaN(decimalPart2))
	{decimalPart2 ='0';}
	}
	else {
		decimalPart1 ='0';
		decimalPart2 ='0';
	}
    numericPart1 = fnLpad(numericPart1,mantLenMax);
    numericPart2 = fnLpad(numericPart2,mantLenMax);
    decimalPart1 = fnRpad(decimalPart1,decLenMax);
    decimalPart2 = fnRpad(decimalPart2,decLenMax);

    var numericPart3 = new Array();
    decimalSum = parseInt(decimalPart1,10) + parseInt(decimalPart2,10);
    decimalPart3 = (decimalSum) % (Math.pow(10,decLenMax));
    decimalPart3 = decimalPart3 + '';
    decimalPart3 = fnLpad(decimalPart3,decLenMax);

    carry = (decimalSum/(Math.pow(10,decLenMax))) >= 1 ? 1 : 0;
    for(index = mantLenMax - 1;index >= 0;index--){
        mantSum = parseInt(numericPart1.charAt(index),10) + parseInt(numericPart2.charAt(index),10) + carry;
        numericPart3[index + 1] = mantSum % 10;
        carry = mantSum > 9 ? 1 : 0;
    }
    numericPart3[0] = (carry == 1)? carry :"";
    var i =0;
    var len=numericPart3.length;
    var result = "";
    for (i =0;i<len ; i++){
        result = result+numericPart3[i];
    }

    if(decLenMax!= 0){ 
	result = result+"."+decimalPart3;
    }
    return result;
}

function fnSubtractAmt(String1,String2){
	String1 = getAmtInStdFormat(String1);
	String2 = getAmtInStdFormat(String2);
	return low_fnSubtractAmt(String1,String2);
}

function low_fnSubtractAmt(String1,String2){
    var numericPart1 = '0';
    var numericPart2 = '0';
    var decimalPart1 = '0';
    var decimalPart2 = '0';
    var decimalPart3 = '0';
    var iIndex1 = 0;
    var iIndex2 = 0;
    var index = 0;
    var mantLenMax = 0;
    var decLenMax = 0;
    var decimalSub = 0;
    var mantSub = 0;
    var carry = 0;
	var decCheck = false;
	var negCheck = false;
    var amt1 = removeCommas(String1);
    var amt2 = removeCommas(String2);
    var result = "";

    iIndex1 = amt1.indexOf(DEF_DECIMAL_SEPARATOR);
    iIndex2 = amt2.indexOf(DEF_DECIMAL_SEPARATOR);
    if(iIndex1 == -1){
        numericPart1 = amt1;
    } else {
        numericPart1 = amt1.substring(0,iIndex1);
        decimalPart1 = amt1.substring(iIndex1+1);
    }

    if(iIndex2 == -1){
        numericPart2 = amt2;
    } else {
        numericPart2 = amt2.substring(0,iIndex2);
        decimalPart2 = amt2.substring(iIndex2+1);
    }
    mantLenMax = (numericPart1.length >numericPart2.length)?numericPart1.length : numericPart2.length;
    decLenMax = (decimalPart1.length>decimalPart2.length)?decimalPart1.length:decimalPart2.length;

	numericPart1 = fnLpad(numericPart1,mantLenMax);
    numericPart2 = fnLpad(numericPart2,mantLenMax);
    decimalPart1 = fnRpad(decimalPart1,decLenMax);
    decimalPart2 = fnRpad(decimalPart2,decLenMax);

	if(parseInt(numericPart2,10) > parseInt(numericPart1,10)){
		var numTemp = numericPart1;
		var decTemp = decimalPart1;
		numericPart1 = numericPart2;
		numericPart2 = numTemp;
		decimalPart1 = decimalPart2;
		decimalPart2 = decTemp;
		negCheck = true;
	}
	else if(parseInt(numericPart1,10) == parseInt(numericPart2,10)){
		if(parseInt(decimalPart2,10) > parseInt(decimalPart1,10)){
			var decTemp = decimalPart1;
			decimalPart1 = decimalPart2;
			decimalPart2 = decTemp;
			negCheck = true;
		}
	}

	decimalSub = parseInt(decimalPart1,10) - parseInt(decimalPart2,10);
	if(decimalSub < 0){
		decimalPart3 = 	Math.pow(10,decLenMax) + decimalSub;
		decCheck = true;
	}
	else
		decimalPart3 = decimalSub;
	decimalPart3 = decimalPart3 + '';
	decimalPart3 = fnLpad(decimalPart3,decLenMax);

	mantSub = parseInt(numericPart1,10) - parseInt(numericPart2,10);
	if(decCheck){
		mantSub -= 1;
	}
	result = mantSub+"."+decimalPart3;
	if(negCheck){
		result = "-" + result;
	}
    return result;
}

function showCookies(){
  	var xMax = screen.width, yMax = screen.height;
        var xOffset = (xMax - 360), yOffset = (yMax - 205);
		if(gfkmCookie != null && gfkmCookie != ''){
		var cookieArr = gfkmCookie.split("|");
		var date= fnConvertToUIDate(cookieArr[3]);
		var date1= fnConvertToUIDate(cookieArr[5]);
		cookieArr[3]=date;
		cookieArr[5]=date1;
		gfkmCookie=cookieArr.join("|");
        window.open('../arjspmorph/showCookies.jsp?rtId='+rtId+'&cookie='+gfkmCookie+'&isPopUp=Y','msgWin','status=yes,width=300,height=150,left='+xOffset+',top='+yOffset+'');
        }
        /* A new jspc introduced and the jsp is called above, instead of
         * dynamically painting the page.. as part of
         * tracker 101711*/

	/*if(gfkmCookie != null && gfkmCookie != ''){
		var xMax = screen.width, yMax = screen.height;
		var xOffset = (xMax - 360), yOffset = (yMax - 205);
		var cookieArr = gfkmCookie.split("|");
		var msgWin=window.open('',USERID+'_msgWin','width=300,height=150,left='+xOffset+',top='+yOffset+'');
        msgWin.location.reload();
		with(msgWin.document){
			write("<head><title>Cookie Info</title>");
			write("<script language='javascript'>");
			write("self.focus();");
            write("setTimeout('self.close()',120000)");
            write("</script>");
			write("</head>")
			write("<LINK href='../Renderer/stylesheets/services.css' rel=STYLESHEET  title='Finacle Stylesheet'type=text/css /><body><form>");
			write("<table class=ctable border=0 cellspacing=1 cellpadding=1 width=100%>");
			write("<tr><td class=slabel>Created by</td>");
			write("<td class=stable>"+jsUtil.encodeChar(cookieArr[2])+"</td></tr>");
			write("<tr><td class=slabel>Created on</td>");
			write("<td class=stable>"+jsUtil.encodeChar(cookieArr[3])+"</td></tr>");
			write("<tr><td class=slabel>Modified by</td>");
			write("<td class=stable>"+jsUtil.encodeChar(cookieArr[4])+"</td></tr>");
			write("<tr><td class=slabel>Modified on</td>");
			write("<td class=stable>"+jsUtil.encodeChar(cookieArr[5])+"</td></tr>");
			write("<tr><td class=slabel>Deleted (Y/N)</td>");
			write("<td class=stable>"+jsUtil.encodeChar(cookieArr[8])+"</td></tr></table>");
            write("<div align=center>");
        	write("<input type=\"button\" class=\"button\" id=\"Close\" value=" + finbranchResArr.get ("FAT000773") + " onClick=\"javascript:self.close();\">");
            write("<script> document.forms[0].Close.focus(); </script>");
            write("</div>");
            write("</form></body>");
		}
	}*/
}


function setObjAndDescValuesForIE(retVal,obj,objDesc){

	if (window.showModalDialog){
		if (retVal != null && retVal != undefined ){
			//Array for taking the values after splitting the value with "|".
			var liarrBufArray = retVal.split("|");

			obj.value = liarrBufArray[0];
			if(objDesc != null) objDesc.value = liarrBufArray[1];
		}
	}
}

/** This function will set focus on field id passed as parameter or first
 * editable field */
function fnSetFocusOnFirstField(frmFld){
	if(frmFld != null || undefined){
		frmFld.focus();
		return;
	}
	var frmElements = document.forms[0].elements;
	var totalElements = frmElements.length;
	for(i = 0; i < totalElements; i++){
		if(( frmElements[i].type == 'text' )||( frmElements[i].type == 'textarea' )){
			if(frmElements[i].readOnly == false && frmElements[i].disabled == false){
				if((frmElements[i].name != "menuName") && (-1 ==(frmElements[i].name.search("_LowLimit"))))
				{
					frmElements[i].focus();
					break;
				}
			}
		}
		if((frmElements[i].type == 'select-one')|| ( frmElements[i].type == 'checkbox' )){
			if(frmElements[i].disabled == false){
				frmElements[i].focus();
				break;
			}
		}
	}
}
function getRadioValue(obj){
	var isArray = (typeof(obj.length)=="undefined")?false:true;

	if(!isArray){
		return obj.value;
	}

	var str = "";

	if(isArray && (typeof(obj.type)=="undefined")){
		for(var i=0;i<obj.length;i++){
			if(obj[i].checked){
				str = obj[i].value;
				break;
			}
		}
	}

	return str;
}
function getRadioObj(obj){
	var isArray = (typeof(obj.length)=="undefined")?false:true;

	if(!isArray){
		return obj.value;
	}

	var str = "";

	if(isArray && (typeof(obj.type)=="undefined")){
		for(var i=0;i<obj.length;i++){
			if(obj[i].checked){
				str = obj[i];
				break;
			}
		}
	}

	return str;
}

function showTemplateIdList(url){
	if(!window.showModalDialog)
	{
		opFieldsArr=[];
		opFieldsArr[0]=arguments[1];
		opFieldsArr[1]=arguments[2];
	}
    var retVal = popModalWindow(url,"TemplateIdList");
	if(window.showModalDialog)
	{
	if (null != retVal){
		var str = retVal.split("|");
		arguments[1].value = str[0];
		arguments[2].value = str[1];
	}
	}
}

function fnSetCheckboxFld(objChkCtrl){
	var objChkCtrlId = objChkCtrl.id;
	var objChkFld = eval("document.forms[0]."+objChkCtrlId.substring(3));
	if(objChkCtrl.checked)
		objChkFld.value = "Y";
	else
		objChkFld.value = "N";
}

function fnSetCheckboxCtrl(objForm){
	var objChkCtrl = null;
	var objChkCtrlId = "";
	var objChkFldCtr = null;
	var objChkFldVal = "";
	var iCtr = 0;
	for(iCtr = 0; iCtr < objForm.elements.length; iCtr++){
		if(objForm.elements[iCtr].type == 'checkbox'){
			objChkCtrl = objForm.elements[iCtr];
			objChkCtrlId = objChkCtrl.id;
			objChkFldCtr = eval("objForm."+objChkCtrlId.substring(3));

			if( (objChkFldCtr != null && objChkFldCtr != undefined) ){
				objChkFldVal = objChkFldCtr.value;
				if(objChkFldVal == 'Y') {
					objChkCtrl.checked = true;
				} else {
					objChkCtrl.checked = false;
					objChkFldCtr.value = 'N';
				}
			}
		}
	}
}

// valid time 00:00:00 - 23:59:59
function fnIsValidTime(sTime){
	//valid time separator used here is only ':'
	//if new separator(s) are required, append them
	//just after ':' in regular expression 'reInvalidTimeChars'
	//valid time characters are digits and time separator(s)

	//invalid time characters are all but valid time characters
	var reInvalidTimeChars = /[^0-9:]/g;
	if(fnIsNull(sTime))
		return true;
	if(reInvalidTimeChars.test(sTime))
		return false;
	if (sTime.length != 8)
		return false;

	var sHH 	= sTime.substr(0,2);	//extracts hh from [hh:mm:ss]
	var sMM= sTime.substr(3,2);	//extracts mm from [hh:mm:ss]
	var sSS 	= sTime.substr(6,2);	//extracts ss from [hh:mm:ss]

	if( isNaN(sHH) || isNaN(sMM) || isNaN(sSS) )
		return false;

	var iHH 	= Number(sHH);
	var iMM = Number(sMM);
	var iSS	= Number(sSS);

	if(iHH < 0 || iHH > 23 || iMM < 0 || iMM > 59 || iSS < 0 || iSS> 59)
		return false;
	return true;
}

/***************************************************
*This function is new version for fnDisableFormDataControls
*It also disables Submit button in case of INQUIRY MODE
****************************************************/
function fnDisableFormControls(sMode, objForm, iLinksCount){

	var ADD = "A";
	var COPY = "C";
	var MODIFY = "M";
	var VERIFY = "V";
	var INQUIRY = "I";
	var DELETE = "D";
	var UNDELETE = "U";
	var CANCEL = "X";

	if(sMode == VERIFY || sMode == INQUIRY || sMode == DELETE || sMode == UNDELETE || sMode == CANCEL){
		var frmElements = objForm.elements;
		var totalElements = frmElements.length;

		//disable links
		if(Number(iLinksCount) > 0)
			disableHyperLnks(Number(iLinksCount));

		//disable form visible data controls
		for(i = 0; i < totalElements; i++){
			if(( frmElements[i].type == 'text' )||( frmElements[i].type == 'textarea' )) {
				frmElements[i].readOnly = true;
				if(frmElements[i].getAttribute("hotKeyId") == 'LowLimit')
					frmElements[i].readOnly = false;
			} else if (frmElements[i].type == 'select-one'){
				frmElements[i].disabled = true;
			} else if ( frmElements[i].type == 'checkbox' || frmElements[i].type == 'radio') {
				frmElements[i].disabled = true;
				frmElements[i].setAttribute("fds", "Y");
			}
			if(objForm.menuName != undefined)
				objForm.menuName.readOnly = false;
		}
		if( (objForm.Validate != undefined) && (objForm.Validate != null) ){
			objForm.Validate.disabled = true;
		}
		if( (objForm.Clear != undefined) && (objForm.Clear != null) ){
			objForm.Clear.disabled = true;
		}
	}

	if(sMode == INQUIRY){
		if( (objForm.Submit != undefined) && (objForm.Submit != null) ){
			objForm.Submit.disabled = true;
		}
	}
	if(sMode != ADD && sMode != MODIFY && sMode != COPY)
	{
		if( (objForm.AddNew != undefined) && (objForm.AddNew != null) ){
			objForm.AddNew.disabled = true;
		}
		if( (objForm.AddNewPage != undefined) && (objForm.AddNewPage != null) ){
			objForm.AddNewPage.disabled = true;
		}
	}
}

function checkRadio(obj,str){
    var isArray = (typeof(obj.length)=="undefined")?false:true;

    if(!isArray){
        if(obj.value == str){
            obj.checked = true;
            return;
        }

    }

    if(isArray && (typeof(obj.type)=="undefined")){
        for(var i=0;i<obj.length;i++){
            if(obj[i].value == str){
                obj[i].checked = true;
                break;
            }
        }
    }

    return;
}
function fnShowCancelDialog(sMode){
   var VERIFY = "V";
   var INQUIRY = "I";
   var DELETE = "D";
   var UNDELETE = "U";
   var CANCEL = "X";
   var POST = "P";
   var RELEASE = "R";
   var REGULARIZE = "G";

   if(sMode == VERIFY || sMode == INQUIRY || sMode == DELETE || sMode == UNDELETE || sMode == CANCEL || sMode == POST || sMode == RELEASE || sMode == REGULARIZE){
        document.forms[0].submitform.value="Cancel";
        document.forms[0].submit();
   }
   else{
        if(confirm(finbranchResArr.get ("FAT000925"))){
           document.forms[0].submitform.value="Cancel";
           document.forms[0].submit();
        }
   }
}

function submitFormError(subType){
	var frm = document.forms[0];
    frm.submitform.value=subType;
    convertToCaps();
    disableButtons();
    frm.submit();
}

function fnToggleCheckbox(chkObj){
    var chkObjId = chkObj.id;
    var hdnFldObj = eval("document.forms[0]."+chkObjId.substring(3));
    if(chkObj.checked)
        hdnFldObj.value = "Y";
    else
        hdnFldObj.value = "N";
}

function fnEnableAllParentFormControls(iLinksCount){
	var len = window.opener.document.forms[0].elements.length
	var obj = window.opener.document.forms[0];
	if(Number(iLinksCount) > 0){
		var lnkStr = "sLnk";
		var lnkCount = parseInt(iLinksCount,10);
		for (var i=1;i<=lnkCount;i++){
			var lnkStrId = lnkStr+i;
			fnEnableLink(lnkStrId);
		}
	}
	for(var i=0;i<len;i++){
		if(obj.elements[i].type == 'button'){
			obj.elements[i].disabled = false;
		}
	}
}

function fnDisableAllParentFormControls(iLinksCount){
	var len = window.opener.document.forms[0].elements.length
	var obj = window.opener.document.forms[0];
	if(Number(iLinksCount) > 0){
		var lnkStr = "sLnk";
		var lnkCount = parseInt(iLinksCount,10);
		for (var i=1;i<=lnkCount;i++){
			var lnkStrId = lnkStr+i;
			fnDisableLink(lnkStrId);
		}
	}
	for(var i=0;i<len;i++){
		if(obj.elements[i].type == 'button'){
			obj.elements[i].disabled = true;
		}
	}
}

function get_parent_lyr_css(id) {
	var lyr, lyrcss;
	lyr = window.opener.document.getElementById(id);
	if (lyr) lyrcss = (lyr.style)? lyr.style: lyr;
	return lyrcss;
}

function fnEnableLink(linkId){
	var curcss = get_parent_lyr_css(linkId);
	if (curcss) {
	        curcss.display = "";
	        curcss.zIndex = 1000;   // some browsers need z-index set
	}
}

function fnDisableLink(linkId){
	var curcss = get_parent_lyr_css(linkId);
	if (curcss) {
		curcss.visibility = "hidden";
		curcss.zIndex = 1000;
	}
}
function fnTmplBack(sTmplMode){
	if(("A" == sTmplMode) ||
	   ("C" == sTmplMode) ||
	   ("F" == sTmplMode) ||
	   ("M" == sTmplMode)){
		if(!confirm(finbranchResArr.get ("FAT000925"))){
			return false;
		}
	}
	return true;
}
function fnTmplDelete(){
	if(!confirm(finbranchResArr.get ("FAT000357"))){
		return false;
	}
	return true;
}
/* Function to get the Function Code Description*/
 function fnGetFuncCodeDesc(fnCode){
	 switch(fnCode){
		 case 'A': return finbranchResArr.get ("FAT002242");
		 case 'M': return finbranchResArr.get ("FAT002243");
		 case 'C': return finbranchResArr.get ("FAT002244");
		 case 'D': return finbranchResArr.get ("FAT001505");
		 case 'F':
		 case 'I': return finbranchResArr.get ("FAT000826");
		 case 'U': return finbranchResArr.get ("FAT002245");
		 case 'X': return finbranchResArr.get ("FAT001423");
		 case 'V': return finbranchResArr.get ("FAT001731");
		 case 'P': return finbranchResArr.get ("FAT002246");
		 case 'T': return finbranchResArr.get ("FAT002247");
		 case 'E': return finbranchResArr.get ("FAT002485");
		 case 'W': return finbranchResArr.get ("FAT004795");
		 case 'O': return finbranchResArr.get("FAT000773");
		 default : return fnCode;
	 }
 }

/* Function to get the Function Code Description*/
 function getApplFlagDesc(osbCode, sDefault) {
	 switch(osbCode) {
		 case 'O': return finbranchResArr.get ("FAT003851");
		 case 'S': return finbranchResArr.get ("FAT003852");
		 case 'B': return finbranchResArr.get ("FAT003853");
		 default : return sDefault;
	}
 }

/* Function to get the Function Code and Function Code Description*/
  function fnGetFuncCodeCodeAndDesc(fnCode){
     switch(fnCode){
        case 'A': return finbranchResArr.get("FAT002565");
		case 'M': return finbranchResArr.get("FAT002564");
		case 'C': return finbranchResArr.get("FAT002566");
		case 'D': return finbranchResArr.get("FAT002567");
		case 'F':
		case 'I': return finbranchResArr.get("FAT002568");
		case 'U': return finbranchResArr.get("FAT002569");
		case 'X': return finbranchResArr.get("FAT002570");
		case 'V': return finbranchResArr.get("FAT002571");
		case 'P': return finbranchResArr.get("FAT002572");
		case 'T': return finbranchResArr.get("FAT002573");
		case 'E': return finbranchResArr.get("FAT002574");
		default : return fnCode;
     }
 }

function MnemonicsClass(mnemonicsList,mnemonicsDesc){
	this.mnemonicsList = mnemonicsList;
	this.mnemonicsDesc = mnemonicsDesc;
}

function getMnemonics(){
	var mnemonicsList = new Array("$BOD$","$BOD-1$","$BOD+1$","$MEND$","$QEND$","$HEND$","$YEND$");
	var mnemonicsDesc = new Array("Begin of Day","Date Previous to Begin Of Day","Date Next To Begin Of Day","Month End","Quarter End","Half Year End","Year End");
	var len = mnemonicsDesc.length;
	var mnemonics = new Array(len);
	for(var index = 0 ; index < len; index++){
		mnemonics[index] = new MnemonicsClass(mnemonicsList[index],mnemonicsDesc[index]);
	}
	return mnemonics;
}

function showMnemonics(dateObj){
	if(!window.showModalDialog)
	{
		dateObj_tmp=dateObj;
		genericCallBackFn = "showMnemonics_callback";
	}

		var retVal	= popModalWindowVar("../arjspmorph/"+applangcode+"/get_mnemonics_list.jsp?wReturn="+dateObj.id,"Mnemonics List",400,200,50,30);
		if(window.showModalDialog)
		{
		if (null != retVal)
        dateObj.value = retVal;
		//set the date value to hidden field from UI field.
		fnAssignDateOnEnter(dateObj);
		}
}
function showMnemonics_callback(retVal){
        if (null != retVal)
        dateObj_tmp.value = retVal;
        //set the date value to hidden field from UI field.
        fnAssignDateOnEnter(dateObj_tmp);
}
function bjsMnemonicsClass(bjsMnemonicsList,bjsMnemonicsDesc){
    this.bjsMnemonicsList = bjsMnemonicsList;
    this.bjsMnemonicsDesc = bjsMnemonicsDesc;
}

function getBjsMnemonics(){
	var bjsMnemonicsList = new Array("$BOM$","$EOM$","$BOLM$","$EOLM$");
    var bjsMnemonicsDesc = new Array("Begin of Month","End of Month","Begin of Last Month","End of Last Month");
    var len = bjsMnemonicsDesc.length;
    var bjsMnemonics = new Array(len);
    for(var index = 0 ; index < len; index++){
        bjsMnemonics[index] = new bjsMnemonicsClass(bjsMnemonicsList[index],bjsMnemonicsDesc[index]);
    }
    return bjsMnemonics;
}

function showBjsMnemonics(dateObj){
    if(!window.showModalDialog)
    {
        dateObj_tmp=dateObj;
        genericCallBackFn = "showBjsMnemonics_callback";
	}
        var retVal  = popModalWindowVar("../arjspmorph/"+applangcode+"/bjsmnemonicslist.jsp?wReturn="+dateObj.id,"BJS Mnemonics List",400,200,50,30);
		if(window.showModalDialog)
		{
        if (null != retVal)
        dateObj.value = retVal;
        //set the date value to hidden field from UI field.
        fnAssignDateOnEnter(dateObj);
		}
}
function showBjsMnemonics_callback(retVal){
        if (null != retVal)
        dateObji_tmp.value = retVal;
        //set the date value to hidden field from UI field.
        fnAssignDateOnEnter(dateObj_tmp);
}
function isValidDateMneumonic(dateMneumonic){
	var mnemonics	= getMnemonics();
    var len			= mnemonics.length;
	for(var index = 0; index < len; index++){
		if(mnemonics[index].mnemonicsList == dateMneumonic){
			return true;
		}
	}
	return false;
}

function isValidBjsDateMneumonic(bjsDateMneumonic){
    var bjsMnemonics   = getBjsMnemonics();
    var len         = bjsMnemonics.length;
    for(var index = 0; index < len; index++){
      if(bjsMnemonics[index].bjsMnemonicsList == bjsDateMneumonic){
          return true;
       }
    }
    return false;
}

//This function disables all the search icons having the id 'sLnk*'
function disableMnicsHyperLnks(count){
	var lnkStr = "msLnk";

	for (var i=1;i<=parseInt(count+1,10);i++){
		var lnkStrId = lnkStr+i;
		loadLyr(lnkStrId);
	}
}


function fnBack(){
	if(noConfirm || confirm(finbranchResArr.get ("FAT000925"))){
		document.forms[0].submitform.value="Back";
		document.forms[0].submit();
	}
}

function getCrncyFromAmt(sSrcAmt){
	var iCrncyIndex = sSrcAmt.indexOf("|");
	if(iCrncyIndex != -1)	return sSrcAmt.substring(iCrncyIndex+1);
	else return "";
}

function isMneblAndValidMnem(dateObj){
		if((dateObj.getAttribute("mnebl") && isValidDateMneumonic(dateObj.value))){
			return true;
		}
		return false;
}


function fnIsNullOrUndefined(obj) {
    if( (obj == null) || (obj == undefined) ) {
            return true;
    } else {
            return false;
    }
}

function fnAppendOption(objSelectBox, sOptionDisplayText, sOptionValue) {
    if( fnIsNullOrUndefined(objSelectBox)
    || fnIsNullOrUndefined(sOptionDisplayText)
    || fnIsNullOrUndefined(sOptionValue)
    || (-1 != getOptionIndex(objSelectBox, sOptionValue)) ) {
        return false;
    } else {
        objSelectBox.options[objSelectBox.options.length] = new Option(sOptionDisplayText, sOptionValue);
        return true;
    }
}

function fnRemoveOption(objSelectBox, sOptionValue) {
    var objIndex = getOptionIndex(objSelectBox, sOptionValue);
    if(objIndex != -1) {
        objSelectBox.options[objIndex] = null;
        return true;
    }
    return false;
}

function getOptionIndex(objSelectBox, sOptionValue) {
    if( fnIsNullOrUndefined(objSelectBox) ) return -2;
    for(var i = 0; i < objSelectBox.options.length; i++) {
        if( objSelectBox.options[i].value == sOptionValue ) {
            return i;
        }
    }
    return -1;
}

function fnValidateTextArea(objTextArea, maxLength){
    if (objTextArea.value.length > maxLength){
		alert(finbranchResArr.get("FAT004428")+' '+finbranchResArr.get("FAT000532")+' '+maxLength);
        objTextArea.focus();
        return false;
    }
    return true;
}


/*
 *      INPUT VALUE     : html form elements separated by comma
 *      RETURN VALUE    : boolean true for success, false for failure with alert
 *      EXAMPLE             : document.forms[0].ipaddress1[, document.forms[0].ipaddress2 [,..]]
 *      ASSUMPTION      : inputs are assumed to be form elements of select-box, input-types
 */
function fnValidateIPAddresses(){
    var objIPAddress = null;
    for(var i = 0; i < arguments.length; i++){
        objIPAddress = eval(arguments[i]);
        if( (objIPAddress.value != "") && (false == fnIsValidIPAddress(objIPAddress.value)) ){
            objIPAddress.focus();
            alert(finbranchResArr.get("FAT000394"));
            return false;
        }
    }
    return true;
}


/*
 *      INPUT VALUE     : IP Address (string value)
 *      RETURN VALUE    : boolean true for success, false for failure
 *      EXAMPLE             : 192.168.133.214
 *      ASSUMPTION      : input is assumed to a valid string of characters
 */
function fnIsValidIPAddress(ipaddress){
    var IP_ADDRESS_SEPARATOR = ".";
    var IP_ADDRESS_PARTS_LENGTH = 4;
    var IP_ADDRESS_PARTS_MIN_VALUE = 0;
    var IP_ADDRESS_PARTS_MAX_VALUE = 255;
    var IP_ADDRESS_INVALID_CHARS = /[^0-9.]/g; /* reg-exp:: all but valid chars */

    if(IP_ADDRESS_INVALID_CHARS.test(ipaddress)){
        return false;
    }

    if(ipaddress.indexOf(IP_ADDRESS_SEPARATOR) == -1){
        return false;
    }

    var ipParts = ipaddress.split(IP_ADDRESS_SEPARATOR);
    if(ipParts.length != IP_ADDRESS_PARTS_LENGTH){
        return false;
    }

    for(var i = 0; i < IP_ADDRESS_PARTS_LENGTH; i++){
        if(isNaN(ipParts[i])){
            return false;
        }
        if((Number(ipParts[i]) < IP_ADDRESS_PARTS_MIN_VALUE) ||
            (Number(ipParts[i]) > IP_ADDRESS_PARTS_MAX_VALUE) ){
            return false;
        }
    }
    return true;
}

function validateCrncy(frame,crncyObj,descObj,isValidObj){
    if (fnIsNull(crncyObj.value)) {
        return;
    }

    var descId = '';
	var isValidFlg = '';
    if (descObj != null) {
        descId = descObj.id;
    }
	if (isValidObj != null) {
		isValidFlg = isValidObj.id;
		isValidObj.value = 'N';
	}
    sendDataToServer(frame,'CRNCY','F',crncyObj.id,descId + "|" + isValidFlg);
}

function validateSol(frame,solIdObj,descObj,isValidObj){
	if (fnIsNull(solIdObj.value)) {
		return;
	}

	var descId = '';
	var isValidFlg = '';
	if (descObj != null) {
		descId = descObj.id;
	}
	if (isValidObj != null) {
		isValidFlg = isValidObj.id;
		isValidObj.value = 'N';
	}
	sendDataToServer(frame,'SOLID','F',solIdObj.id,descId + "|" + isValidFlg);
}
//The functions takes the object and a string
//obj should be document.forms[0].<OBJECT_ID>
//str should be either 'E' or 'D' for Enabling / Disabling respectively.
function fnEnableDisableRadioButtons(obj,str){
    var isArray = (typeof(obj.length)=="undefined")?false:true;

    if(!isArray){
		if (str == 'D'){
        	obj.disabled = true;
	        return;
		}else{
		    obj.disabled = false;
		    return;
		}
    }

    if(isArray && (typeof(obj.type)=="undefined")){
        for(var i=0;i<obj.length;i++){
            if (str == 'D'){
	            obj[i].disabled = true;
	        }else{
		        obj[i].disabled = false;
	        }
        }
    }

    return;
}

/*
	Function added by Vasudevan G on May 21 2003
	This function evaluates whether form needs to be
	submitted or not for next / prev button click. This will evaluate
	to false when the current record is either the first or last
	record. Based on its return value, form can be submitted

	Parameters
		sAction = will be either next or prev
		currCount = current count of multirec
		totRecs = total size of multirec
		objFocus = if focus needs to be set in any form control

*/

function isNavigationRequired(sAction, currCount, totRecs, objFocus) {
    currCount = parseInt(currCount,10);
    totRecs = parseInt(totRecs,10);
    if ((sAction == 'prev' && currCount == 0) ||
        (sAction == 'next' && (currCount+1 >= totRecs))) {
        alert(finbranchResArr.get("FAT000426"));
        if ((objFocus != null) && (objFocus != undefined)) {
	        objFocus.focus();
        }
        return false;
    }
    return true;
}

function disableFormElements(count){
	var frmElem = document.forms[0].elements;
	var totElem = frmElem.length;
	var type = "";

	disableHyperLnks(count);

	for (var i = 0; i < totElem; i++) {
		type = frmElem[i].type;
		if (type == 'checkbox' || type == 'radio' || type == 'select-one') {
			frmElem[i].disabled = true;
		}
		else if (type == 'text') {
			frmElem[i].disabled = true;
			if(frmElem[i].getAttribute("hotKeyId") == 'LowLimit')
				frmElem[i].disabled = false;
		}
	}
    var menuObj = document.forms[0].menuName;
    if (menuObj != null && menuObj != undefined) {
        menuObj.disabled = false;
    }

}

function showImage(ancId){
	var curcss = get_lyr_css(ancId);
	if (curcss) {
		curcss.display = "";
		curcss.zIndex = 1000;	// some browsers need z-index set
	}
}

function showVisibility(ancId){
    var curcss = get_lyr_css(ancId);
    if (curcss) {
        curcss.visibility = "visible";
    }
}

function validateDate(date){
    if (!(fnIsValidDate(date))) {
      if(calbase == "00")
        {   if (aFlag == 'Y'){
            alert(finbranchResArr.get("FAT002593"));
            }
			fnSetFocusForDate(date);
            return false;
    }
      if(calbase == "01")
        {   if (aFlag == 'Y'){
            alert(finbranchResArr.get("FAT002594"));
            }
			fnSetFocusForDate(date);
            return false;
        }

	}
        return true;
}


function showVerfyPendList(tableName, func, mode, schmType, listType,inPreceedence, key1Obj, key2Obj, key3Obj,adtadnlparams)
{
	var sUrl = "";
	var tmpK1Obj = "";
	var tmpK2Obj = "";
	var tmpK3Obj = "";
	var preceedence = 'B';
	var tmpadtadnlparams = ""; 
    
	if(inPreceedence != "")
        preceedence = inPreceedence;

	if (func == null || func == undefined)
		func = "";

    if(key1Obj != "")
	   tmpK1Obj = key1Obj.id;

    if(key2Obj != "")
       tmpK2Obj = key2Obj.id;

    if(key3Obj != "")
      tmpK3Obj = key3Obj.id;

	if(!fnIsNull(adtadnlparams))
    tmpadtadnlparams = adtadnlparams.value;

	sUrl ="../arjspmorph/"+applangcode+"/get_pend_verify_list.jsp?wReturn1="+tmpK1Obj+"&wReturn2="+tmpK2Obj+"&wReturn3="+tmpK3Obj+"&tableName="+tableName+"&funcCode="+func+"&preceedence="+preceedence+"&mode="+mode+"&schmType="+schmType+"&listType="+listType+"&adtadnlparams="+tmpadtadnlparams;


	if (!window.showModalDialog){
		opFieldsArr=[];
		opFieldsArr[0]=key1Obj;
        opFieldsArr[1]=key2Obj;
        opFieldsArr[2]=key3Obj;
	}
    var retVal = popModalWindow(sUrl,"VerfyPendList");

	if (window.showModalDialog){
	    if (retVal != null && retVal != undefined ){

			//Array for taking the values after splitting the value with "|".
			var liarrBufArray = retVal.split("|");

	        key1Obj.value = liarrBufArray[0];
			if(key2Obj != "")
	          key2Obj.value = liarrBufArray[1];
			if(key3Obj != "")
			  key3Obj.value = liarrBufArray[2];
		}
    }
}

function chkSpace(str){
	var regExp = /[ ]/ //for space.
	str = fnTrim(str);
	if (regExp.test(str)) {
		alert(finbranchResArr.get("FAT000483"));
		return false;
	}
	return true;
}

function fnValidateSpecialChars(objectField){
    var invalidChars = /[^0-9]/; //Anything other than 0-9 is invalid.

    if(invalidChars.test(objectField.value)){
		alert(finbranchResArr.get("FAT000485"));
		objectField.focus();
		return false;
	}

	return true;
}


function fnShowTCCharges(strURL,objectField){
	var retval = openModalWindow(strURL,objectField);
    if (null != retval || objectField.value!=""){
        document.forms[0].ChargeFlag.value ="False";
    }
}

function SetVisitFlg(chrgEvtObj,chrgFlg){
	if((!fnIsNull(chrgEvtObj.value))){
		chrgFlg.value ="False";
	}
}

function fnCheckNegativeAmt(obj){
    var objVal = getAmtInStdFormat(obj.value);
	if(parseFloat(objVal) < 0.00){
        alert(finbranchResArr.get("FAT000223"));
        obj.focus();
        return false;
    }
    return true;
}

function fnCheckAmtGtZero(obj){
    var objVal = getAmtInStdFormat(obj.value);
	if(parseFloat(objVal) <= 0.00){
        alert(finbranchResArr.get("FAT000252"));
        obj.focus();
        return false;
    }
    return true;
}
function showAcctDtls(acctIdObj){
	if (fnIsNull(acctIdObj.value)){
		alert(finbranchResArr.get("FAT000200"));
		acctIdObj.focus();
		return;
	}
	var sUrl = "../arjspmorph/"+applangcode+"/acctdtls.jsp?acctId="+acctIdObj.value+"&isAcctDtlsAvbl=N"; 
	popModalWindow(sUrl,"Acct Details");
}

//This function generates two Date fields one hidden
//and one UI field.
function PRINTDATEFLD(objName,grpNameReqd,linkNum,literalDesc,isMandatoryFlg,isReadOnlyFlg,isMnecEnbld,mneLink,onChangeFn,strEvent,tdNotReqd,altDateSearcher,propNotAvailable,isDOBFlg,altClassReqd){
    var strTdNotReqd = "";
    var strAltDateSearcher = "";
    var strPropNotAvailable = "";
    var lstrDobFlg="N";
    var strAltClassReqd = "";
    SEARCHER_INDEX = SEARCHER_INDEX + 1;

        //onblur property replaced with onchange
    //The earlier function had only 10 parameters. The expanded fn has 13 params.
    if(arguments.length > 10){
        strTdNotReqd = tdNotReqd;
        strAltDateSearcher = altDateSearcher;
        strPropNotAvailable = propNotAvailable;
    }
    //Now function has expanded to  14 params to chek date of birth field. make lower year is 1850.
    if(arguments.length > 13){
        lstrDobFlg=isDOBFlg;
    }

    //Now function has expanded to  15 params to provide for an alternate class for the textbox in certain pages. GUI change.
    if(arguments.length > 14)
        strAltClassReqd = altClassReqd;

    if(grpNameReqd != null && grpNameReqd == "Y")
        eleName = sPrntDtGroupName + "." + objName;
    else
            eleName = objName;

    if (isMandatoryFlg == "N"  &&  strPropNotAvailable != "Y"){
        mandatString = eval(sPrntDtGroupName + "Props.get(\""+objName+"_MANDATORY\")");
    }
	else{
        mandatString = isMandatoryFlg;
    }

    if (isReadOnlyFlg != null && isReadOnlyFlg == "Y")
        isReadOnly = "ReadOnly";
    else
        isReadOnly = "";

    if(isMnecEnbld != null && isMnecEnbld == "Y"){
        isMnemonicEnbld = bMnemonic;
    }
    else{
        isMnemonicEnbld = "false";
        bMnemonic = "false";
    }

    if(onChangeFn != null && onChangeFn != "")
        strOnChangeFn = ";" + onChangeFn;
    else
        strOnChangeFn = "";

    if(strEvent == null)
        strEvent = "";
    if(strPropNotAvailable != "Y"){
        strEnabledFlg = eval(sPrntDtGroupName + "Props.get(\"" + objName + "_ENABLED\")") ;
    }else{
        strEnabledFlg = "enabled";
    }
    with(document){
      	if( literalDesc != null && literalDesc !="" ){
         	//This creates display date field.
         	write('<td class="textlabel">'+ jsUtil.encodeChar(literalDesc) + ' ');
         	write('<script>setMandatory("' + mandatString + '")</script></td>');
		 }
                if (strTdNotReqd != "Y") //Default. This value would be passed as Y very rarely when TD printing is not required.
                {
         write('<td class="textfield">');
         }

         write('<input ' );
         if(strPropNotAvailable != "Y"){
            write(eval(sPrntDtGroupName + "Props.get(\"" + objName + "_ENABLED\")") + ' ');
         }
         write(isReadOnly + ' id ="' + objName +'_ui" hotKeyId="calendar'+SEARCHER_INDEX+'" type="text" fdt= "uidate" ');
         write('mnebl='+isMnemonicEnbld+' name="' + eleName + '_ui" size="10" ');

         if(strAltClassReqd != "Y")
            write('maxlength="10" class="textfieldfont" fmnd = "' + mandatString + '" ');
         else
            write('maxlength="10" class="textfieldinsidemultirec" fmnd = "' + mandatString + '" ');

		 write('onChange="fnEventFormatDate(this)'+strOnChangeFn + '" ' + strEvent + '>');
         if(linkNum != null && linkNum != "" &&  strEnabledFlg == "enabled" && isReadOnly == ""){
            if (strAltDateSearcher =="Y") //Alternative date searcher is required.
            {
                write('<a target=_self id ="sLnk'+ linkNum + '" ');
                write('href=javascript:fnOpenDate(document.forms[0].' +objName+'_ui,"' + BODDate + '"');
                write(')>');
                write('<img class="img"  src="../Renderer/images/' +applangcode+ '/calender.gif" width="24" height="19" border="0" style="cursor:hand" alt="' + finbranchResArr.get("FTT000501") + '" align=absmiddle hotKeyId="calendar'+SEARCHER_INDEX+'">');
                write('</img></a>');
            }
            else{
				write('<a target=_self id ="sLnk'+ linkNum + '" ');
                write('href=javascript:openDate(document.forms[0].' +objName+'_ui,"' + BODDate + '"');
                write(')>');
                write('<img class="img"  src="../Renderer/images/' +applangcode+ '/calender.gif" width="24" height="19" border="0" style="cursor:hand" alt="' + finbranchResArr.get("FTT000501") + '" align=absmiddle hotKeyId="calendar'+SEARCHER_INDEX+'">');
                write('</img></a>');
            }
         }
         if(bMnemonic == "true" &&  strEnabledFlg == "enabled" && isReadOnly == ""){
            write('<a target=_self id="msLnk' + mneLink + '" ');
            write('href=javascript:showMnemonics(document.forms[0].' + objName+'_ui)>');
            write('<img class="img" src="../Renderer/images/' +applangcode+ '/search_icon.gif" ');
            write('width="16" height="17" border="0"></img> </a>');
         }

         if (strTdNotReqd != "Y"){
         write('</td>'); //Default. Only very specific instances will pass Y as tdNotReqd value.
         }

        //creation of hidden field
    write('<input type="hidden" id="'+objName+'" ');
    write('fmnd = "' + mandatString + '" ');
    if (lstrDobFlg == "Y")
        write('fdob = "' + lstrDobFlg + '"');
    write('fdt="fdate" mneb1='+isMnemonicEnbld+' vFldId='+objName+'_ui name="' + eleName +'">');
    }
}

/*This function converts any date format to Standard date
  field format (i.e) "DDMMYYYY".
*/
function fnConvertToStdDate(UIDateString)
{

	var day = "";
	var month = "";
	var year="";
	var newdatestr = UIDateString;

	if(UIDateString=="")
		return UIDateString;

	if(isValidBjsDateMneumonic(UIDateString))
    {
        newdatestr = UIDateString;
        return newdatestr;
	}
	else if(isValidDateMneumonic(UIDateString))
	{
		newdatestr = UIDateString;
		return newdatestr;

	}

	/*change for hijri date support*/
    if (!isGregDate(UIDateString))
    {
        UIDateString = convertDateToGreg(UIDateString);
        if (!isGregDate(UIDateString) && calbase != "00")
        {
            newdatestr = "invalid";
            return newdatestr;
        }


        newdatestr = UIDateString;

    }

    /*change for hijri date support end.*/

	if(UIDateString.indexOf("/") != -1)
		var a_strDate = UIDateString.split("/");
	if(UIDateString.indexOf("-") != -1)
		var a_strDate = UIDateString.split("-");
	if(UIDateString.indexOf(".") != -1)
		var a_strDate = UIDateString.split(".");

	// if mnemonic , copy as it is
    if(isValidDateMneumonic(UIDateString)){
       	newdatestr = UIDateString;
       	return newdatestr;
    }
	if(a_strDate != null)
	{
		if(calbase == "02")
		{
			var loc_year = "";
			year = parseInt(a_strDate[2]);
			loc_year = parseInt(NumLocYears);
			year = year - loc_year;
			a_strDate[2] = year.toString();
			newdatestr = a_strDate[0] +"-"+a_strDate[1]+"-"+a_strDate[2];
		}
		if  (dateFormat == "01")
		{
			newdatestr = a_strDate[1] +"-"+a_strDate[0]+"-"+a_strDate[2];
			return newdatestr;
		}
		return newdatestr;
	}
	return newdatestr;
}

function fnConvertToUIDate(stdDateString)
/*Convert Date function is needed to switch between MMDDYYYY and DDMMYYYY
This would stand in use at display only sections (viz. explodes, result pages where
there is no textbox object with datatype of fdate.
The function can be enhanced with more error handling*/
{
	var day = "";
	var month = "";
	var year="";

	var displayStr = stdDateString; 	//This is default return value

	if (displayStr == "" || fnIsNull(displayStr))
		return displayStr;

	/*change for hijri date support*/

    displayStr = convertBetweenDate(displayStr);

     /*change for hijri date support end.*/

	// if mnemonic , copy as it is
	if(isValidDateMneumonic(displayStr))
	   return displayStr;

	if(displayStr.indexOf("/") != -1)
		var	a_strDate = displayStr.split("/");
	if(displayStr.indexOf("-") != -1)
		var	a_strDate = displayStr.split("-");
	if(displayStr.indexOf(".") != -1)
		var	a_strDate = displayStr.split(".");

	if(calbase == "02")
	{
		year = parseInt(a_strDate[2]);
		year = year + parseInt(NumLocYears);
		a_strDate[2] = year.toString();
		displayStr = a_strDate[0]+"-"+a_strDate[1]+"-"+a_strDate[2];
	}
	//check for the delimeter and seperate date, month and year.
	if(dateFormat == "01")
	{
		displayStr = a_strDate[1]+"-"+a_strDate[0]+"-"+a_strDate[2];
		return displayStr;
	}
	return displayStr;
}
/* This function is responsible for converting format of given
   UI date field value to standard date format and assigns the
   value to corresponding hidden field.
*/
function fnAssignDateOnEnter(objElement){
	  var objName;
	  objForm = document.forms[0];
	  objName = String(objElement.name);
	  var fmult = objElement.getAttribute("fmult");
	  var recNum = objElement.getAttribute("recNum");
	  var uiField = objName.substring((objName.length -3),objName.length);
      if(uiField == "_ui"){
        objName = objName.substring(0,(objName.length -3));
      }
      else
        objName = objName.substring(0,objName.length);
	  // Convert and assign the value to hidden field
	  element = document.getElementsByName(objName);
          if (fmult == "Y"){
	    var i = recNum;
       if(element[i] == null)
		return;
	   else
		element[i].value = fnConvertToStdDate(objElement.value);
	}
	else{
	  if(element[0] == null)
		return;
	  else
		element[0].value = fnConvertToStdDate(objElement.value);
	}
}

/*This function searches for date fields in the given form and
  assign values from hidden field to UI field after converting
  the format to UI format.
*/
function fnAssignDateOnLoad(objForm){

   i = 0;
   var itemName;
   //Enumerate the form fields.
   while(objForm.elements[i] != null) {

      //Deriving the corresponding ui field name.
      itemName = objForm.elements[i].name + "_ui";
	  element = document.getElementsByName(itemName);
      if (element[0] != undefined)
	  {
	  	//Check for date fields.
      	if (objForm.elements[i] != null && objForm.elements[i].getAttribute("fdt") == "fdate" && objForm.elements[i] != ""){
      		//Assign the value to UI field.
			if (objForm.elements[i].getAttribute("fmult") == "Y"){
				var j = objForm.elements[i].getAttribute("recNum");
				element[j].value = fnConvertToUIDate(objForm.elements[i].value);
			}
			else{
      			element[0].value = fnConvertToUIDate(objForm.elements[i].value);
			}
      	}
	  }
      i++;
   }

}

/*This function is responsible for setting the focus to
  corresponding UI date field for the given hidden date
  field passed as argument.
*/
function fnSetFocusForDate(objDate){

   var objName = objDate.name;
	element = document.getElementsByName(objName + "_ui");
	if(element[0] == null){
		if(objDate.disabled == false){
			setTimeout('document.forms[0].'+objDate.id+'.focus()', 10);
			setTimeout('document.forms[0].'+objDate.id+'.select()', 10);
		}
		return;
	}
	//set the focus to corresponding ui field
	if(element[0].disabled == false){
		setTimeout('document.forms[0].'+element[0].id+'.focus();',10);
		setTimeout('document.forms[0].'+element[0].id+'.select();',10);
	}

}
/*This function is responsible for assigning value to
  corresponding UI date field for the given hidden date field
  after conversion of date format.
*/
function fnAssignUIDate(objDate){

 itemName = objDate.name + "_ui";
 element = document.getElementsByName(itemName);
 if(element[0] == null)
   return;
 element[0].value = fnConvertToUIDate(objDate.value);

}
/*This function is responsible for enabling or disabling
  of corresponding UI date field for given hidden date field.
*/
function fnEnableUIField(obj,status){


 itemName = obj.name + "_ui";
 element = document.getElementsByName(itemName);

 if(element[0] == null)
   return;

 if(status != null && status != ""){
	if(status == "Y"){
		element[0].disabled = false;
	}
	else{
		element[0].disabled = true;
	}
 }
 fnAssignUIDate(obj);
}
/* This function is used to set the property value
   to UI field from corresponding hidden field
   for given hidden object, property and value.
*/
function fnSetPropertyValue(obj,property,value){

   var itemName = obj.name + "_ui";
   element = document.getElementsByName(itemName);

   if (obj.fmult == "Y"){
		var i = obj.recNum;
		if(element[i].name == undefined){
			element[i] = obj;
		}
		if(property != null && property !=""){
			if ( (typeof value) == "string" ){
    			eval("document.forms[0]." + element[i].id + "["+i+"]."  + property + "='"  + value + "'");
			}
			else{
				eval("document.forms[0]." + element[i].id + "["+i+"]." + property + "="  + value);
			}
		}
	}
	else{
			if(element.length == 0)
			{
				element = obj;
			}
            else //There is a single element in the array
            {
                element = element[0];
            }

			if(property != null && property !=""){
				if ( (typeof value) == "string" ){
    				eval("document.forms[0]." + element.id + "." + property + "='"  + value + "'");
				}
				else{
					eval("document.forms[0]." + element.id + "." + property + "="  + value);
				}
			}
	}
}
/* This function is used to replace a label field with
   a ui label field and a hidden field for the purpose
   of date format conversion.
*/
function PRINTDATELABEL(objName,grpNameReqd,literalDesc,stdDateFormatValue,strEvent,tdNotRqd){

    var strTdNotRqd = "";

    if(arguments.length > 5)
        strTdNotRqd = tdNotRqd;

    if(grpNameReqd != null && grpNameReqd == "Y")
        eleName = sPrntDtGroupName + "." + objName;
    else
        eleName = objName;
    if(strEvent == null)
        strEvent = "";
    with(document){
     //If literalDesc is null or blank hide the literal value.
     if( literalDesc != null && literalDesc !="" )
        write('<td class="textlabel" >'+ jsUtil.encodeChar(literalDesc) + ' </td>');

     //creation of ui label field.Class of <td> tag changed to "textfield" in Finnacle v9.0
     if (strTdNotRqd != "Y") //Default. This value would be passed as Y very rarely when TD printing is not required.
        write('<td class="textfield">');

     write('<input class="textfielddisplaylabel1" ');
     write('name="'+ eleName + '_ui" id="'+ objName +'_ui" ');
     write('size=10 maxlength=10 ');
     write('fdt="uidate" disabled ' + strEvent + ' >');

     if (strTdNotRqd != "Y")
        write('</td>');

     //creation of hidden field.
     write('<input type="hidden" id="'+objName+'" ');
     write('fdt="fdate" name="' + eleName + '" ');
	 write('value="' + stdDateFormatValue + '" >');
    }
}




/* This function is used to clear both hidden date field
   and ui date field values for given hidden field.
*/
function fnClearDateFields(dateObj){

    //clear the hidden field value
    dateObj.value = "";
    fnAssignUIDate(dateObj);    //Assign hidden field value to ui field.

}
/* This function is used to get property value of UI
   date field for given hidden date field object
*/
function fnGetPropertyValue(obj,property){

   itemName = obj.name + "_ui";
   element = document.getElementsByName(itemName);

   // if ui field does not exists, set value to original field.
   if( element[0].name == undefined )
		element[0] = obj;

   if( property != null && property != ""){
		return eval("document.forms[0]." + String(element[0].id) + "." + property);
   }

}
/* This function is used to set values for attribute of
   ui field if exists else set the value to original field.
*/
function fnSetAttributeValue(obj,attribName,attribVal){

   itemName = obj.name + "_ui";
   element = document.getElementsByName(itemName);

    // if ui field does not exists, set value to original field.
	if (element.length == 0)
     {
           element = obj;
     }
     else
     {
           element = element[0];
     }

   if(attribName != null && attribName != "" && attribVal != null){
		eval("document.forms[0]." + String(element.id) + ".setAttribute(\"" + attribName + "\",\"" + attribVal + "\")");
		}
}
/* This function is used to get values for attribute of
   ui field if exists else set the value to original field.
*/
function fnGetAttributeValue(obj,attribName){

   itemName = obj.name + "_ui";
   element = document.getElementsByName(itemName);

    // if ui field does not exists, set value to original field.
   if( element[0].name == undefined )
        element[0] = obj;

   if(attribName != null && attribName != "" && attribVal != null)
        return eval("document.forms[0]." + String(element[0].id) + ".getAttribute(\"" + attribName + "\")");
}

//Functions to print Date fields in Multi Rec Modifier.
function PRINTDATEMRC(objName,grpNameReqd,recNum,linkNum,literalDesc,stdDateFormatValue, isMandatoryFlg,isReadOnlyFlg,isMnecEnbld,mneLink,onChangeFn,strEvent,tdNotReqd,altDateSearcher,propNotAvailable){

    var strTdNotReqd = "";
    var strAltDateSearcher = "";
    var strPropNotAvailable = "";
    SEARCHER_INDEX = SEARCHER_INDEX + 1;

    //onblur property replaced with onchange
    //The earlier MRC function had only 12 parameters. The expanded fn has 15 params.
    if(arguments.length > 12){
        strTdNotReqd = tdNotReqd;
        strAltDateSearcher = altDateSearcher;
        strPropNotAvailable = propNotAvailable;
    }

    if(grpNameReqd != null && grpNameReqd == "Y")
        eleName = sPrntDtGroupName + "." + objName;
    else
            eleName = objName;

    if (isMandatoryFlg == "N" && strPropNotAvailable != "Y"){
        mandatString = eval(sPrntDtGroupName + "Props.get(\""+objName+"_MANDATORY\")");
    }
    else{
        mandatString = isMandatoryFlg;
    }

    if (isReadOnlyFlg != null && isReadOnlyFlg == "Y")
        isReadOnly = "ReadOnly";
    else
        isReadOnly = "";
	if(isMnecEnbld != null && isMnecEnbld == "Y"){
        isMnemonicEnbld = bMnemonic;
    }
    else{
        isMnemonicEnbld = "false";
        bMnemonic = "false";
    }

    if(onChangeFn != null && onChangeFn != "")
        strOnChangeFn = ";" + onChangeFn;
    else
        strOnChangeFn = "";

    if(strEvent == null)
        strEvent = "";
    if(strPropNotAvailable != "Y"){
        strEnabledFlg = eval(sPrntDtGroupName + "Props.get(\"" + objName + "_ENABLED\")") ;
    }else{
        strEnabledFlg = "enabled";
    }
    with(document){
      	if( literalDesc != null && literalDesc !="" ){
        	//This creates display date field.
         	write('<td class="textlabel">'+ jsUtil.encodeChar(literalDesc) + ' ');
         	write('<script>setMandatory("' + mandatString + '")</script></td>');
      	}

                 if (strTdNotReqd != "Y") //Default. This value would be passed as Y very rarely when TD printing is not required.
                 {
         write('<td class="textfield">');
         }

         write('<input ' );
		 if(strPropNotAvailable != "Y"){
            write(eval(sPrntDtGroupName + "Props.get(\"" + objName + "_ENABLED\")") + ' ');
         }
         write(isReadOnly + ' id ="' + objName +'_ui" hotKeyId="calendar'+SEARCHER_INDEX+'" type="text" fdt= "uidate" fmult= "Y" recNum="'+recNum+'" ');
         write('mnebl='+isMnemonicEnbld+' name="' + eleName + '_ui" size="10" ');
         write('maxlength="10" class="textfieldfont" fmnd = "' + mandatString + '" ');
         write('onChange="fnEventFormatDate(this)'+ strOnChangeFn + '" ' + strEvent + '>');
		 if(linkNum != null && linkNum != "" &&  strEnabledFlg == "enabled" && isReadOnly == ""){
            if (strAltDateSearcher =="Y") //Alternative date searcher is required.
            {
                write('<a target=_self id ="sLnk'+ linkNum + '" ');
                write('href=javascript:fnOpenDate(document.forms[0].' +objName+'_ui['+recNum+'],"' +BODDate + '"');
                write(')>');
                write('<img class="img"  src="../Renderer/images/' +applangcode+ '/calender.gif" width="24" height="19" border="0" style="cursor:hand" align=absmiddle hotKeyId="calendar'+SEARCHER_INDEX+'">');
                write('</img></a>');
            }
            else{
                write('<a target=_self id ="sLnk'+ linkNum + '" ');
                write('href=javascript:openDate(document.forms[0].' +objName+'_ui['+recNum+'],"' + BODDate + '"');
                write(')>');
                write('<img class="img"  src="../Renderer/images/' +applangcode+ '/calender.gif" width="24" height="19" border="0" style="cursor:hand" align=absmiddle hotKeyId="calendar'+SEARCHER_INDEX+'">');
                write('</img></a>');
            }
         }
         if(bMnemonic == "true" &&  strEnabledFlg == "enabled" && isReadOnly == ""){
            write('<a target=_self id="msLnk' + mneLink + '" ');
            write('href=javascript:showMnemonics(document.forms[0].' + objName+'_ui['+recNum+'])>');
            write('<img class="img" src="../Renderer/images/' +applangcode+ '/search_icon.gif" ');
			write('width="16" height="17" border="0"></img> </a>');
         }

         if (strTdNotReqd != "Y"){
         write('</td>');
         }

        //creation of hidden field
     write('<input type="hidden" id="'+ objName+'" ');
     write('fmnd = "' + mandatString + '" ');
     write('recNum = "' + recNum + '" ');
     write('fdt="fdate" fmult = "Y" mneb1='+isMnemonicEnbld+' vFldId='+objName+'_ui name="' + eleName + '" ');
     write('value="' + stdDateFormatValue + '" >');
    }
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


function depPeriodDiff(date1, date2, objnmths, objndays){

	var maxdays1 = 0;
	var maxdays2 = 0;
    var prevmth = 0;
    var prevyear = 0;
    var temp = 0;

    var nmths = 0;
    var ndays = 0;

    nmths = 12 * (date2.substring(6,10) - date1.substring(6,10)) + (date2.substring(3,5) - date1.substring(3,5));


    /* If both dates are month ends, do not find the days' difference */
    maxdays1 = daysInMonth(date1.substring(3,5),date1.substring(6,10));
    maxdays2 = daysInMonth(date2.substring(3,5),date2.substring(6,10));

       if ((date1.substring(0,2) != maxdays1) || (date2.substring(0,2) != maxdays2) || (date1.substring(0,2) < date2.substring(0,2))){

         if (date2.substring(0,2) >= date1.substring(0,2))
             ndays = date2.substring(0,2) - date1.substring(0,2);

          else{
                /* take carry from the months position */
                (nmths)--;

                   if (date2.substring(3,5) == 1) {
                        prevmth = 12;
                        prevyear = date2.substring(6,10) - 1;
                    }
                    else {
                        prevmth = date2.substring(3,5) - 1;
                        prevyear = date2.substring(6,10);
                    }


                     if (fnIsLeapYear(prevyear))
                          temp =  daysInMonth(prevmth,prevyear);
                     else
                          temp = parseInt(daysInMonth(prevmth,prevyear),10) + parseInt(date2.substring(0,2),10);


          if (temp < date1.substring(0,2)){
             /* one more carry from the months position required */
             /*(nmths)--;
             date2.substring(3,5)--;*/

             if (date2.substring(4,2) == 1) {
                prevmth = 12;
                prevyear = date2.substring(6,10) - 1;
             }
             else {
                prevmth = date2.substring(3,5) - 1;
                prevyear = date2.substring(6,10);
             }


	     if (fnIsLeapYear(prevyear))
		     ndays = temp + daysInMonth(prevmth,prevyear);
	     else

		     ndays = daysInMonth(prevmth,prevyear) - date1.substring(0,2);
	  }
	  else{
		  if(parseInt(daysInMonth(prevmth,prevyear),10)<date1.substring(0,2))
		  {
			  ndays=temp - daysInMonth(prevmth,prevyear)
		  }
		  else
		  {
			  ndays = temp - date1.substring(0,2);
		  }
	  }
       }

    } else{
       ndays = 0;
    }

    objnmths.value = nmths;
    objndays.value = ndays;
    return ;
}



function daysInMonth(Month, Year){
  var Days;
  var arrDays = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
  if ((Month==2) && (Year % 4 == 0 && (Year % 100 != 0 || Year % 400 == 0))) {
        arrDays[1] = 29;
    }
    return arrDays[Month-1];
}
/*
 This function is called on blur of Date field to format the date in user defined format.
 The function is responsible for auto populating the date field with month and year as specified for BOD Date.
 If user enters two digits only e.g. 25, it will be considered as Date.Month and Year will be populated
 automatically as month and year of BOD Date.If user enters four digits e.g. 06/07,year will be
 autopulated in modes "00" and "02"(Local Year).In mode "01",year will be autopopulated along with
 the swapping of the digits on both sides of the separator.If all the digits are entered, date
 will be considered as entered in correct user defined format.
*/
function onBlurFormatDate(cStr){
	var HYPHEN = "-";
	var SLASH  = "/";
	var DOT    = ".";
	var sEnteredDate = cStr.value;
	var sRawDate = "";
	var sFmtdDate = "";
	var mnebl = cStr.getAttribute("mnebl");

	BODDate = convertBetweenDate(BODDate);

	var dayValue   = BODDate.substring(0,2);
	var monthValue = BODDate.substring(3,5);
	var yearValue  = BODDate.substring(6,10);
	var firstSet = "";
	var secondSet = "";
	var thirdSet = "";
	var countFlg = 0;

   	BODDate = convertDateToGreg(BODDate);

	if((null != mnebl )&& (mnebl) && ("$" == sEnteredDate.substring(0,1)) ){
   		return;
   	}

    //This condition is for DDMMYYYY entered value without separators
	if (!fnIsNull(sEnteredDate)){
		if ((!isNaN(sEnteredDate)) && (sEnteredDate.length==8)){
			if (((calbase == "00") && (dateFormat == "00")) || ((calbase == "00") && (dateFormat == "01")) || ((calbase == "02") && (dateFormat == "00"))){
				sFmtdDate = sEnteredDate.substring(0,2)+HYPHEN+sEnteredDate.substring(2,4)+HYPHEN+sEnteredDate.substring(4,8);
				if(!isHijDate(sFmtdDate) && !isGregDate(sFmtdDate) && !isBuddhaDate(sFmtdDate))
                {
                    setDateFieldFocusOnError(cStr);
                    return false;
                }
				cStr.value = sFmtdDate;
				return;
			}
		}
		for(i=0; i<sEnteredDate.length; i++){
			if((sEnteredDate.charAt(i) != HYPHEN)&&(sEnteredDate.charAt(i) != SLASH)&&(sEnteredDate.charAt(i) != DOT))
				sRawDate += sEnteredDate.charAt(i);

				if((sEnteredDate.charAt(i) == HYPHEN)||(sEnteredDate.charAt(i) == SLASH)||(sEnteredDate.charAt(i) == DOT)){
					countFlg++;

					if (parseInt(countFlg,10) == 1)
							firstSet = sRawDate;
					if (parseInt(countFlg,10) == 2)
							secondSet = sRawDate;

					sRawDate = "";
				}
		}
		if (parseInt(countFlg,10) == 0)
			firstSet = sRawDate;
   		else if (parseInt(countFlg,10) == 1)
	 		secondSet =  sRawDate;
		else
			thirdSet = sRawDate; //Whatever remains after last separator goes to third var.

		if (fnIsNull(secondSet))
			secondSet = monthValue;

		if (fnIsNull(thirdSet) ){
			if ((calbase == "00") && (dateFormat == "01")){
				temp = firstSet;
				firstSet = secondSet;
				secondSet = temp;
				thirdSet = yearValue;
			}
			else if((calbase == "02") && (dateFormat == "00"))
			{
			 var loc_year = parseInt(NumLocYears);
             thirdSet = new String(parseInt(yearValue)+loc_year);
			}
			else{
				thirdSet = yearValue;
			}
		}
		if (((calbase == "00") && (dateFormat == "00")) || ((calbase == "00") && (dateFormat == "01")) || ((calbase == "02") && (dateFormat == "00"))){
			if (isNaN(firstSet) || isNaN(secondSet) || isNaN(thirdSet)){
				setDateFieldFocusOnError(cStr);
				return false;
			}
			firstSet=Math.abs(firstSet);
			if ((firstSet.length == 1) || (firstSet < 10))
					firstSet = "0" + firstSet;
			if (firstSet.length > 2)
			{
                setDateFieldFocusOnError(cStr);
                return false;
            }
			if (((firstSet < 1) || (firstSet > 31)) && ((calbase == "00") && (dateFormat == "00")))			
			{
				setDateFieldFocusOnError(cStr);
				return false;
			}
			if (((firstSet < 1) || (firstSet > 12)) && ((calbase == "00") && (dateFormat == "01"))) 
			{ 
				setDateFieldFocusOnError(cStr); 
				return false; 
			} 

			if (secondSet.length == 1)
				secondSet = "0" + secondSet;
			if (secondSet.length >2)
			{
                setDateFieldFocusOnError(cStr);
                return false;
            }
			if(((secondSet < 1) || (secondSet > 12))&& ((calbase == "00") && (dateFormat == "00")))			
			{
				setDateFieldFocusOnError(cStr);
				return false;
			}
			if(((secondSet < 1) || (secondSet > 31)) && ((calbase == "00") && (dateFormat == "01"))) 
			{ 
				setDateFieldFocusOnError(cStr); 
				return false; 
			} 

			if (thirdSet.length == 1)
			{
                setDateFieldFocusOnError(cStr);
                return false;
            }
			if (thirdSet.length == 2){
				hYrLimit = parseInt(yearValue,10)+30;
				intYear = parseInt(thirdSet,10);
				if (intYear>=(hYrLimit%100))
					strYear=(hYrLimit-(hYrLimit%100))-100;
				else
					strYear=hYrLimit-(hYrLimit%100);
				thirdSet = strYear+intYear;
			}
			if (thirdSet.length == 3)
			{
                    setDateFieldFocusOnError(cStr);
                    return false;
            }
			if (thirdSet.length > 4)
			{
                    setDateFieldFocusOnError(cStr);
                    return false;
            }
		}
		sFmtdDate = firstSet + HYPHEN + secondSet + HYPHEN + thirdSet;
		sFmtdDate= convertBetweenDate(sFmtdDate);
		if(!isHijDate(sFmtdDate) && !isGregDate(sFmtdDate) && !isBuddhaDate(sFmtdDate))
        {
            setDateFieldFocusOnError(cStr);
            return false;
        }
		cStr.value = sFmtdDate;
	}
}
/* set Date field Focus with Alert */
function setDateFieldFocusOnError(objDate)
    {
        alert(finbranchResArr.get("FAT000081"));
        fnSetFocusForDate(objDate);
        return false;
    }

/* Calls the onBlurFormatDate(this); fnAssignDateOnEnter(this) in one method
    to avoid sequential calls when first method returns false */
function fnEventFormatDate(objDate)
{
    var retVal = "";
    if ((retVal = onBlurFormatDate(objDate)) == false) {
        return false;
    }
    if ((retVal = fnAssignDateOnEnter(objDate)) == false) {
        return false;
    }
    return (retVal == undefined) ? true : retVal;
}
/*

    This method will print the maximum amount value for the field on which
    it is invoked by pressing CTRL+X

    fdt = "amount" attribute needs to be defined for the field
    AmountCrncyMap  -   Object that needs to be defined in the
                        group link file. It will have name value pairs
                        for amount field ids and their currencies.

                        Eg.
                        var AmountCrncyMap = {
                            maxSlabAmount : "crncy|N"
                        }

                        where   maxSlabAmount   =   amount field id
                                crncy|N         =   crncy can be form object id or javascript variable name for
                                                    getting currency value.
                                                    if it is form object give Y, else N

    Included by Vasudevan G on November 21, 2003

*/
function writeMaximumAmount(amtObj) {
    if (this.AmountCrncyMap != undefined) {
        var temp = AmountCrncyMap[amtObj.id];
        if (temp != undefined) {
            var pipeIndex = temp.indexOf("|");
            var crncy = temp.substring(0,pipeIndex);
            var isObj = temp.substring(pipeIndex+1);
            if (isObj == "Y") {
                crncy = eval("document.forms[0]."+crncy+".value");
            } else {
                crncy = eval("this."+crncy);
            }
            /*  For the obtained crncy, get the precision value */
            var prec = getPrec(crncy);
			if(prec==0)
				var actualAmt = MAX_AMOUNT.substring(0,(MAX_AMOUNT.length-prec));
			else
            	var actualAmt = MAX_AMOUNT.substring(0,(MAX_AMOUNT.length-prec)) + "." + MAX_AMOUNT.substring((MAX_AMOUNT.length-prec));
            amtObj.value = getAmtInCustomFormat(actualAmt);
        }
    }
}

function writeMaximumUnit(unitObj) {

           var actualUnit = MAX_UNIT.substring(0,(MAX_UNIT.length-6)) + "." + MAX_UNIT.substring((MAX_UNIT.length-6));
          unitObj.value = getAmtInCustomFormat(actualUnit);

}

function getBacidAcctList(bacid,ctrlOrMorph){
    var sUrl = (ctrlOrMorph == 'morph') ? "../" : "../arjspmorph/";

    sUrl += applangcode + "/get_bacid_accts.jsp?bacid="+escape(bacid)+"&precedence=F";

    popModalWindow(sUrl,"bacidacctlist");
}

//Wrapper method for setInHiddenData() method, exposed to outer world
function setFieldsToCustomData() {
    setInHiddenData(document.forms[0].screenName,arguments);
	//Added for Workflow
	if(this.WF_IN_PROGRESS == "Y" || this.WF_IN_PROGRESS == "PEAS")
	{
		if(eval(document.forms[0].customFieldNames) != undefined){
			setCustomFieldNamesInHiddenField(document.forms[0].screenName,arguments);
		}
	}
	//end
}

//Wrapper method for getFromHiddenData() method, exposed to outer world
function getFieldsFromCustomData() {
    getFromHiddenData(document.forms[0].screenName,arguments);
}

/*
	This function shas been deprecated in Version 9.0.
	Its kept to provide backward compatibility only.
 */
function setCustomFieldValue() {
    setInHiddenData(document.forms[0].pagename,arguments);
}

/*
	This function shas been deprecated in Version 9.0.
	Its kept to provide backward compatibility only.
 */
function getCustomFieldValue() {
    getFromHiddenData(document.forms[0].pagename,arguments);
}

//Sets the Custom Data to the hidden field
function setInHiddenData(){
    var sFieldValues = "";
    var strValue = document.forms[0].customData.value;
    var name = arguments[0].value;
    if(strValue.indexOf(name) != -1){
        strFirst = strValue.substring(0,(strValue.indexOf(name)));
        intlen = strFirst.length - 1;
        strFirst = strFirst.substring(0,intlen);
        strTemp = strValue.substring((strValue.indexOf(name)+1),strValue.length);
        if(strTemp.indexOf("~") != -1)
        strLast = strTemp.substring(strTemp.indexOf("~"),strTemp.length);
        else
        strLast = "";

        strValue = strFirst + strLast;

    }

    for(i=0;i<arguments[1].length;i++){
        if(eval("document.forms[0]."+arguments[1][i]) != undefined){
            var fieldObj = eval("document.forms[0]."+arguments[1][i]);
			var fieldVal = "";  
        	if(fieldObj.type == "radio")  
                fieldVal = getRadioValue(fieldObj);  
            else  
            	fieldVal = fieldObj.value; 
	

            if(i == 0)
                sFieldValues= sFieldValues + fieldVal + "|";
            else
                sFieldValues= sFieldValues + fieldVal + "|";
        }
    }
    if(sFieldValues.length > 0){
        strValue= strValue+"~"+name+"|";
        strValue = strValue+sFieldValues;
    }
    document.forms[0].customData.value = strValue ;
}
//Sets the Custom field names into the hidden field
function setCustomFieldNamesInHiddenField()
{
	var customNames="";
	var name = arguments[0].value;
	for(i=0;i<arguments[1].length;i++)
	{
		if(eval("document.forms[0]."+arguments[1][i]) != undefined)
		{
			customNames = customNames+arguments[1][i]+"|";
		}
	}
	document.forms[0].customFieldNames.value=(name+"|"+customNames);
}

//Sets the Custom Data to individual fields
function getFromHiddenData() {
    var strValue = document.forms[0].customData.value;
    var name = arguments[0].value;
    if(strValue.indexOf(name) != -1){
        strFirst = strValue.substring(0,(strValue.indexOf(name)));
        intlen = strFirst.length - name.length;
        strFirst = strFirst.substring(0,intlen);
        strTemp = strValue.substring((strValue.indexOf(name)+(name.length+1)),strValue.length);
        if(strTemp.indexOf("~") != -1)
            strLast = strTemp.substring(0,strTemp.indexOf("~"));
        else
            strLast = strTemp;

        strValue = strLast;
    }
    else{
        strValue = "";
    }

    for(i=0;i<arguments[1].length;i++){
        if(eval("document.forms[0]."+arguments[1][i]) != undefined){
            var fieldObj = eval("document.forms[0]."+arguments[1][i]);
            var isArray = (typeof(fieldObj.length)=="undefined")?false:true;
			if(strValue.indexOf("|") != -1){
				if(isArray)
				{
					if(fieldObj.type == "radio") 
					setRadioValue(arguments[1][i],strValue.substring(0,strValue.indexOf("|")));  
                    	else  
                    fieldObj.value = strValue.substring(0,strValue.indexOf("|"));  
				}
				else
				{
        	        var fldVal = strValue.substring(0,strValue.indexOf("|"));  
                        if(fieldObj.type == "checkbox")  
                        {  
                            if(fldVal == 'Y')  
                            fieldObj.checked = true;          
                        }  
                    else  
                             fieldObj.value = fldVal; 

                }
			   	strValue = strValue.substring((strValue.indexOf("|")+1),strValue.length);
            }
            else{
					 if(isArray)
					 {
						if(fieldObj.type == "radio")  
                        setRadioValue(arguments[1][i],strValue);  
                        	else  
                        fieldObj.value = strValue 
					}
					else
					{
            		    var fldVal = strValue;  
                        if(fieldObj.type == "checkbox")  
                        {  
                            if(fldVal == 'Y')  
                                fieldObj.checked = true;          
                        }  
                        else  
                        	fieldObj.value = fldVal 
					}
                strValue = "";
            }
        }
    }
}
function fnFormatAmt(format, srcAmt, precision) {
		srcAmt = getAmtInStdFormat(srcAmt);
		var targetAmt = "";
		srcAmt = checkZeroes(srcAmt,precision);
		if (format == 'Million') {
				targetAmt = formatToMillion1(srcAmt,precision);
		}
		else {
				targetAmt = formatToLakh1(srcAmt,precision);
		}
		targetAmt = getAmtInCustomFormat(targetAmt);
		return targetAmt;
}

function customDataProcess(arr,arrCol){
    outValue = "";
    outName = "";
    k = 1;
    for(i=0;i<arr.length;i++){
        for(j=0;j<arrCol.length;j++){
            obj = arr[i];
            var expr = "obj."+ arrCol[j];
            val = eval(expr);
            outValue  = outValue+val+"|";
            outName = outName+arrCol[j]+"_"+k+"|";
        }
        k++;
    }
    outName = outName.substring(0,outName.length-1);
    outValue = outValue.substring(0,outValue.length-1);
    document.forms[0].custNames.value = outName;
    document.forms[0].custValues.value = outValue;
}

function callCRVForPTranDetails(srvrFlg,trId,trDt,pTranNo,acNo, callType)
{
	var url = null;

	if (callType == "morph")
    {
        self.close();
    }
 	url = "../inquiry/inquiry_ctrl.jsp?mo=TRANINQ&actionCode=SUBMIT&traninq.tranid="+trId+"&traninq.trandate="+trDt+"&traninq.part_tran_srl_num="+pTranNo+"&traninq.acct_num="+acNo;
 	formUrl(url);
}

function hideAnc(id){
    var obj = document.getElementById(id);
    if (obj != null && obj != undefined) {
        obj.disabled = true;
        obj.onclick = "";
    }
}
function onClickAssignRtrnPath(path){
       setActionForWorkflow();
		submitInPost(path);
}
function fnValidatePercent(objPcntField, precision){

    var numericPart = 0;
    var decimalPart = 0;
    var iIndex = 0;
    var bValidPercent = true;
    var sourcePcnt = getValInStdFormat(objPcntField);
    var DEC_PART_LEN = 6;

	DEC_PART_LEN = DEC_PART_LEN > precision ? precision : DEC_PART_LEN;

    iIndex = sourcePcnt.indexOf(DEF_DECIMAL_SEPARATOR);
    if(iIndex == -1){
        numericPart = sourcePcnt;
    } else {
            numericPart = sourcePcnt.substring(0,iIndex);
            decimalPart = sourcePcnt.substring(iIndex+1);
        }

    if(decimalPart.length > DEC_PART_LEN){
        bValidPercent = false;
        alert(finbranchResArr.get("FAT000523")+DEC_PART_LEN+finbranchResArr.get("FAT000526"));
    }

    return bValidPercent;
}
function showHelpFile(file){
    /* 	When literal context is A at menu level, 
    	help file with the name althlp_ prefix will get picked */	
	
/*	if (literalContext == 'A')
	{ 
		file  = 'althlp_'+file;
	}*/
	var sUrl = getCustHelpUrl(file);	
	var locUsrId = (USERID != undefined) ? USERID.replace(".","") : "" ;
	
	var winHandle = window.open(sUrl,locUsrId+"_HelpScreen", "height=300%, width=575px, left=224, top=120, status=no, toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no");
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
    return bUrl + finContextPath + "/HelpRenderer/" + file +"?localeCode="+localeCode+"&appLangCode="+applangcode+"&rtId="+rtId;

}

function validateRefCode(frame,refCodeObj,refRecTypeVal,descObj){
    var refCode		= "";
    var descId		= "";
	var isValidFlg	= "";
	var tmpStr		= "";
	var wReturnDesc	= "";
    var refRecType	= refRecTypeVal;
    var fetchId		= 'REFCODE';
	var precedence	= 'F';

	if(!window.showModalDialog)
	{
		genericCallBackFn="validateRefCode_genericCallBack";
	}
	if (!fnIsNull(refCodeObj.value))
		refCode = refCodeObj.value
    if (descObj != null)
        descId = descObj.id;

	if (!fnIsNull(refCodeObj.value)){
		refCode = refCodeObj.value
		tmpStr		= refCode+"|"+refRecType;
    	var sUrl = "../arjspmorph/"+applangcode+"/frm_fetch.jsp?fetchId="+fetchId+"&precedence="+precedence+"&wReturn="+tmpStr+"&wReturnDesc="+descId;
		
		sUrl = jsUtil.formatUrl(sUrl);
		
    	var xMax = screen.width, yMax = screen.height;
    	var xOffset = (xMax - 120), yOffset = (yMax - 150);
    	var params = "dialogWidth=0px;dialogHeight=0px;dialogLeft="+xOffset+"px;dialogTop="+yOffset+"px";
    	params += ";status=no;toolbar=no;menubar=no;resizable=no;help=no;center=no";

	if(window.showModalDialog){
		if("Microsoft Internet Explorer" == browser_name){
			outData = window.showModalDialog(sUrl,document.forms[0],params);
		}else{
			sUrl = getAbsoluteUrl(sUrl);
			outData = window.showModalDialog(sUrl,document.forms[0],params);
		}
		if(outData != null && typeof(outData) == "string" && outData == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
		if (outData.toLowerCase().indexOf("|") == -1){
			if(outData != "")
				alert("\""+outData+"\"");
			return false;
		}
		var retval = outData.split("|");
		eval("document.forms[0]."+descId+".value =\""+retval[0]+"\"");
	}
		else
		{
			var retValue = window.open(sUrl,"title","width=10px,height=10px,modal=yes,top="+yOffset+"px,left="+xOffset+"px,scrollbars=yes,toolbar=no,menubar=no,help=no");
		}
	}
}
function validateRefCode_genericCallBack(retValue)
{
            if (retValue != null && typeof(retValue) == "string" && retValue == "TIMEOUT")
            {
                var logoutParams = new Array(1);
                logoutParams[0] = finConst.FORCED_LOGOUT;
                handleWindowDisplay(finConst.DOLOGOUT, logoutParams);
                return;
            }
}

function appFnExecuteScript(inputNameValues, outputNames, scrName, isPopulationReq)
{

    var sUrl = "../arjspmorph/"+applangcode+"/stf_frm_fetch.jsp?rtId="+rtId;

	if(!fnIsNull(inputNameValues))
		sUrl += "&inputs="+encodeURIComponent(inputNameValues);

	if(fnIsNull(scrName))
	{
		alert("Script Name is mandatory");
		return;
	}

	sUrl += "&scrName="+scrName;

	if (isPopulationReq && fnIsNull(outputNames))
	{
		alert("Output Names are mandatory");
		return;
	}
	
	callBackIsPopulateReqd = isPopulationReq;

	outputFields = outputNames;
	var xMax = screen.width, yMax = screen.height;
	var xOffset = (xMax - 120), yOffset = (yMax - 150);
	var params = "dialogWidth=0px;dialogHeight=0px;dialogLeft="+xOffset+"px;dialogTop="+yOffset+"px";
	params += ";status=no;toolbar=no;menubar=no;resizable=yes;help=no;center=no";

	var retVal = "";
	if(window.showModalDialog){
            if("Microsoft Internet Explorer" == browser_name){
                retVal = window.showModalDialog(sUrl,document.forms[0],params);
            }else{
                sUrl = getAbsoluteUrl(sUrl);

				retVal = window.showModalDialog(sUrl,document.forms[0],"dialogHeight:100px;dialogleft:843px;dialogWidth:175px;dialogtop:588px;status=no;toolbar=no;menubar=no;resizable=yes;");
            }
		if(retVal != null && typeof(retVal) == "string" && retVal == "TIMEOUT") 
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	else {
		multiSDS="Y";
		 /*if  outputFields are not present callback function will fail */
		if(!fnIsNull(outputFields))
			genericCallBackFn_SDS = "populateOutDtlsCallBack";
		retVal = window.open(sUrl,"title","width=10px,height=10px,modal=yes,top="+yOffset+"px,left="+xOffset+"px,scrollbars=yes,toolbar=no,menubar=no,help=no");
		if(retVal != null && typeof(retVal) == "string" && retVal == "TIMEOUT")
		{
			var logoutParams = new Array(1);
			logoutParams[0]  = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	if(window.showModalDialog)
	{
       if (retVal == null || retVal == undefined)
		return retVal;

	var retBuff = retVal.toString().split("|");
	var retBuffLen = retBuff.length;
	if (retBuff[0] == 'Err')
	{
		var str = "";
		for (var i=1; i<retBuffLen; i++)
		{
			str += retBuff[i] + "\n";
		}
		alert(str);
		return;
	}

	if (!isPopulationReq)
		return retVal;

	var frm = document.forms[0];
	var outBuff = outputNames.toString().split("|");
	var outBuffLen = outBuff.length;

	for (var i=0; i<outBuffLen; i++)
	{
		for (var j=0; j<retBuffLen; j++)
		{
			if (outBuff[i] == retBuff[j])
			{
				if ((eval("frm." + outBuff[i]) != undefined))
				{
					eval("frm."+outBuff[i]+".value=\""+retBuff[j+1]+"\"");
					break;
				}
			}
		}
	}
  }	
}

function populateOutDtlsCallBack(retVal)
{		
	if (retVal == null || retVal == undefined)
		return retVal;
	if (!callBackIsPopulateReqd)
		return retVal;

	var retBuff = retVal.split("|");
	var retBuffLen = retBuff.length;
	if (retBuff[0] == 'Err')
	{
		var str = "";
		for (var i=1; i<retBuffLen; i++)
		{
			str += retBuff[i] + "\n";
		}
		alert(str);
		return;
	}

	var frm = document.forms[0];
	var outBuff = outputFields.split("|");
	var outBuffLen = outBuff.length;
	var j=0;
	for (var i=0; i<outBuffLen; i++)
	{
		j++;
		if ((eval("frm." + outBuff[i]) != undefined))
		{
			eval("frm."+outBuff[i]+".value=\""+retBuff[j]+"\"");
			/*To populate Date fields */
			if((eval("frm." + outBuff[i] + "_ui") != undefined))
				eval("frm."+outBuff[i]+"_ui.value=\""+retBuff[j]+"\""); 
			j++;
		}
    }
    resetSDS();
}

function printAppTestCase()
{

	with(document) {
			write('<input type="button" name="StartCase" class="button" id="StartCase" onClick="appFnExecuteScript(\'action|start|ip|\'+currIp,\'\',\'testCaseLogger.scr\',\'\');" value="Start test case">');
			write('<input type="button" name="StopCase"  class="button" id="StopCase" onClick="appFnExecuteScript(\'action|stop|ip|\'+currIp,\'\',\'testCaseLogger.scr\',\'\');" value="Stop test case">');
	}
	return true;
}

function writeFooter(){
       if(("undefined" != typeof(nonSSOLogin))&&(null != typeof(nonSSOLogin))&&(nonSSOLogin)){
		fnDisableFormDataControls("I",document.forms[0]);
		disableButtons();
		hideHyperLinks();
	}
	var objForm = document.forms[0];
    var frmElements = objForm.elements;
    var totalElements = frmElements.length;
    var ancLen = document.anchors.length;
	var frmArr = document.forms; 
	if(typeof text_onBlur == "function") { 
		text_onBlur(); 
	} 
	
	if (frmArr) { 
		for (var i=0; i<frmArr.length; i++) { 
			if(frmArr[i].onsubmit== undefined || frmArr[i].onsubmit== null) { 
				frmArr[i].onsubmit = function() { return false; } 
			} 
			frmArr[i].method = "post";
		} 
	} 

	var std_reset = document.forms[0].reset;      // Get the original reset functionality in to local variable
	document.forms[0].reset = function()
	{
		formReset(objForm);
	}
	
    for(i = 0; i < totalElements; i++)
    {
        if(frmElements[i].type.toUpperCase() == "BUTTON")
        {
            frmElements[i].ondblclick = function()
            {
                return false;
            }
        }
    }

    for (i=0; i<ancLen; i++){
        document.anchors[i].ondblclick = function()
        {
            return false;
        }
    }
	try {
		if (logTestCase == 'Y'){
			printAppTestCase();
		}

		if (eval(isAuditEnabled) != undefined && isAuditEnabled && document.forms[0].name != "resultPage" && document.forms[0].name != "resform") 
		{
			 document.write('<input type="button" class="button" value=" ' + finbranchResArr.get("FAT003261") + '"  id="Audit" onClick="doSubmit(\'showaudit\');" hotKeyId="Audit">');
		}

		if(this.WF_IN_PROGRESS == "Y" || this.WF_IN_PROGRESS == "PEAS")
		{
			with(document)
			{
				if ( document.forms[0].name != "resultPage" )
				{
					write("<input type=\"button\" class=\"button\" id=\"Continue\" value=" + finbranchResArr.get ("FAT001736") +" onClick=\"javascript:execNextStep();\">");
					write("<input type=\"button\" class=\"button\" id=\"Abort\" value=" + finbranchResArr.get ("FAT001737") +" onClick=\"javascript:abortWorkFlow();\">");
				}
			}
			if(this.WF_IN_PROGRESS == "Y")
			{
				document.write('<input type="hidden" name="WF_TEMP_DATA">');
			}
			if(TerminateWF == "true")
			{
				document.write('<input type="button" class="button" id="TerminateWF" value="TerminateWF" onClick="terminateWF();">');
				document.write('<input type="hidden" name="terminateWFInst" id="terminateWFInst" value="">');
				document.write('<input type="hidden" name="parentProcId" id="parentProcId" value="">');
			}
		}
	}catch(e){}
}

function terminateWF()
{
	var frm                 = document.forms[0];
	frm.actionCode.value    = "abortwf";
	var funcName            = "this.getWFProcessId";

	if(eval(funcName) != undefined)
	{
		retVal= getWFProcessId();
	}
	else
	{
		alert(finbranchResArr.get("FAT002336"));
		this.TerminateWF.disabled= true ;
		return false;
	}
	if(retVal)
	{
		frm.terminateWFInst.value="true";
		frm.submit();
	}
	else
		return false;
}

function abortWorkFlow(){
	var frm = document.forms[0];
	frm.actionCode.value="abortwf";
	frm.submit();
}

function enableButtons(){
	var obj=document.forms[0].elements;
	var len=obj.length;
	for(var i=0;i<len;i++) {
		switch(obj[i].type) {
			case "button" :
				case "submit" :
				case "reset" :
				obj[i].disabled=false;
			break;
		}
	}
	enableTabs();
}
function enableTabs(){
	var sTabcss = get_lyr_css('sTab');
	var hTabcss = get_lyr_css('hTab');
	if ((hTabcss != undefined && hTabcss != null) && (sTabcss != undefined && sTabcss != null)){
		hTabcss.cssText = "position:absolute; visibility:hidden;"
			sTabcss.cssText = "position:absolute; visibility:visible;"
	}
}

function showWFButtons(){
	var frm = document.forms[0];
	disableButtons();
	if (frm.Abort != undefined)
		frm.Abort.disabled = false;
	if (frm.Continue != undefined){
		frm.Continue.disabled = false;
		frm.Continue.focus();
	}
}



/**
 * this function is required perform necessary form related operations
 * before submitting the form.
 *
 *
 * @param 		action code.
 *
 *
 * @return		none.
 *
 **/

function doSubmitForm(actionCode)	{
	var objFrm = document.forms[0];
	/* Added for localization */ 
	if(!fnLocaleValidateForm(actionCode)) return; 
			
	objFrm.actionCode.value = actionCode;
	convertCase(objFrm);
	/*for actionCode CANCEL appendCrncyToAmt() shouldn't be called*/
	if (actionCode!="CANCEL"){
		var isAppendedFlg = appendCrncyToAmt();
		if(!isAppendedFlg)	{
			return;
		}
	}
	enableFormElements();
	disablePageLinks();
	hideAnchors();
	disableButtons();
	objFrm.submit();
}

/**
 * this function converts the case of the values of the elements to
 * upper case or lower case or default depending upon the value of the
 * attribute "inputCase".
 *
 * @param 		objForm
 *
 *
 * @return
 *
 **/

function convertCase(objForm)	{
	var frmElements = objForm;
	var fieldObj	= null;
	var totalElements = frmElements.length;
	var type;
	for(i = 0; i < totalElements; i++){
		fieldObj	=	frmElements[i];
		var inputCase		=	fieldObj.getAttribute("inputCase");
		var type		=	fieldObj.getAttribute("type");

		// if the value of input case attribute is
		// U it refers to upper case , L -Lowercase
		if(null!=inputCase && undefined!=inputCase &&
				fnTrim(inputCase).length!=0)	{
			if(inputCase=="U"){
				convertToUpperCase(fieldObj);
			}	else if(inputCase=="L"){
				convertToLowerCase(fieldObj);
			}
		}

	}
}

/**
 * Converts  value to upper case.
 *
 * @param		form element
 *
 *
 * @return		none.
 *
 **/
function convertToUpperCase(fldObj)	{
	if(undefined==fldObj || null==fldObj)	{
		return;
	}
	var fldValue	=	fldObj.value;
	if(undefined!=fldValue && null!=fldValue)	{
		fldObj.value	=	fldValue.toUpperCase();
	}
}

/**
 * Converts the value to lower case.
 *
 * @param 		form element
 *
 *
 * @return		none.
 *
 **/
function convertToLowerCase(fldObj)	{
	if(undefined==fldObj || null==fldObj)	{
		return;
	}
	var fldValue	=	fldObj.value;
	if(undefined!=fldValue && null!=fldValue)	{
		fldObj.value	=	fldValue.toLowerCase();
	}
}

/**
 * Disables all the links in the page.counts the no: of
 * links and then loops through them to disable them.
 *
 * @param 		none
 *
 *
 * @return		none.
 *
 **/

function disablePageLinks()	{
	var objLinks	=	document.links;
	var fieldObj	=	null;
	for(i = 0; i < objLinks.length; i++){
		fieldObj = objLinks[i];
		var isLink = fieldObj.getAttribute("id");
		if(isLink == null || isLink == undefined)
			return;
		if(fnTrim(isLink).length!=0){
			var lyr = document.getElementById(isLink);
			if (lyr){
				var lyrcss = (lyr.style)? lyr.style: lyr;
			}
			if(lyrcss){
				lyrcss.display = "none";
			}
		}
	}
}


/**
 * Sends the data to the server.
 *
 * @param sUrl		Contains the url to be invoked
 *
 * @return			none
 *
 **/
function sendDataForRewind(sUrl)	{
	var xMax = screen.width, yMax = screen.height;
	var xOffset = (xMax - 120), yOffset = (yMax - 150);
	var params = "dialogWidth=0px;dialogHeight=0px;dialogLeft="+xOffset+"px;dialogTop="+yOffset+"px";
	params += ";status=no;toolbar=no;menubar=no;resizable=no;help=no;center=no";
	var obj = document.forms[0];
	sUrl = jsUtil.formatUrl(sUrl);
	if(window.showModalDialog)
	{
		var outData = window.showModalDialog(sUrl,obj,params);
		if (outData != null && typeof(outData) == "string" && outData =="TIMEOUT")
		{
			var logoutParams = new Array(1);
			logoutParams[0] = finConst.FORCED_LOGOUT;
			handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
			return;
		}
	}
	else
	{
		popModalWindowVar(sUrl,"TEST",0,0,0,0);
	}
	return;
}

/**
 * This function is required to append the amount field and the
 * currency code with a '|'
 *
 * @param 		none.
 *
 * @return		boolean.
 *
 **/
function appendCrncyToAmt()		{
	var objForm = document.forms[0];
	var frmElements = objForm.elements;
	var totalElements = frmElements.length;
	var amtFld	=	null;
	var crncyFld		=	null;
	var formatAmtFld	=	null;
	var associatedFld	=	null;
	var dummyAmtFld	=	null;
	var fldDataType	=	null;
	var amtPrec		=	null;
	var stdAmt 		= null;

	/* This has been done to populate 0 amount value if modified */ 
	if(!isEmptyObj(formatAmtFld) && !isEmptyObj(associatedFld)) 
	{ 
		amtFld      	=   eval("document.forms[0]." + formatAmtFld ); 
		amtFld.value    =   dummyAmtFld.value; 
	} 

	for(var j = 0; j < totalElements; j++)	{
		dummyAmtFld	=	frmElements[j];
		fldDataType	=	dummyAmtFld.getAttribute("fdt");
		if(fldDataType == "amount" || fldDataType == "totamount" || fldDataType == "equityprice")	{
			formatAmtFld	=	dummyAmtFld.getAttribute("formatAmtField");
			associatedFld	=	dummyAmtFld.getAttribute("associatedField");
			/*The validation (0 != getAmtInFloat(dummyAmtFld.value)) has
			  been removed from the below if as for zero currency was not
			  getting appended and hence the value was not going in the DB*/
			if(!isEmptyObj(formatAmtFld) && !isEmptyObj(associatedFld))	{
				amtFld		=	eval("document.forms[0]." + formatAmtFld );
				crncyFld		=	eval("document.forms[0]." + associatedFld);
				/*The validation (0 != getAmtInFloat(dummyAmtFld.value)) has 
				 * been removed from above if condition and put in below if 
				 * condition as for zero value ,currency was not getting 
				 * appended and hence "Invalid currency code" error was coming up*/ 

				if(!isEmptyObjValue(dummyAmtFld.value) && !isEmptyObj(amtFld)&& (0 != getAmtInFloat(dummyAmtFld.value)))	{
					if(!isEmptyObj(crncyFld) && !isEmptyObjValue(crncyFld.value))	{
						stdAmt = getAmtInStdFormat(dummyAmtFld.value);

						if (!fnIsNull(stdAmt)&&low_isValidAmt(stdAmt)) {
							stdAmt = low_convertAmt(stdAmt);
							amtFld.value	=	stdAmt + "|" + crncyFld.value;
						}else {
							amtFld.value	=	dummyAmtFld.value + "|" + crncyFld.value;
						}

						if(fldDataType == "amount")	{
							amtPrec	=	getPrec(crncyFld.value);
							if(!fnValidateStdAmount(stdAmt, amtPrec))	{
								setFieldFocus(dummyAmtFld);
								return false;
							}
						}	else if (fldDataType == "totamount")	{
							amtPrec	=	getPrec(crncyFld.value);
							if(!low_fnValidateTotAmount(stdAmt, amtPrec))	{
								setFieldFocus(dummyAmtFld);
								return false;
							}
						}	else if(fldDataType == "equityprice")	{
							amtFld.value	=	amtFld.value + "|" + EQTYPRICE_PREC;
							if(!fnValidateStdeqtyprice(stdAmt, EQTYPRICE_PREC))	
							{
								setFieldFocus(dummyAmtFld);
								return false;
							}
						}	
					}	else	{
						if(!isEmptyObj(crncyFld) && crncyFld.type!='hidden' &&
								crncyFld.disabled==false)	{
							setFieldFocus(crncyFld);
						}
						if(fldDataType == "amount" || fldDataType == "totamount") {
							alert(finbranchResArr.get("FAT000875") + " ["+dummyAmtFld.value+"]");
						} else if(fldDataType == "equityprice") {
							alert(finbranchResArr.get("FAT004054") + "["+dummyAmtFld.value+"]");
						}
						return false;
					}
                   }else if(!isEmptyObj(amtFld)){
				   amtFld.value      = dummyAmtFld.value;
					
				}
			}
		}
	}
	return true;
}

/**
 * This function formats the amount into lakh or million.
 * The format to be applied is taken from the finbranch properties file.
 *
 * @param sourceAmt	variable which takes the source amount to format
 *
 * @param precision	variable which decides on the precision to applied
 *
 * @return newAmt		variable which has the formatted amount value
 *
 **/
function getFormatAmount(amountFormat,sourceAmt,crncyCode)	{
	var newAmt	=	null;
	var precVal	=	null;
	var custAmt =   null;
	if(isEmptyObjValue(sourceAmt) || isEmptyObjValue(amountFormat) ||
			isEmptyObjValue(crncyCode))	{
		return;
	}
	precVal	=	getPrec(crncyCode);
	if (amountFormat == 'Million')	{
		newAmt	=	formatToMillion1(sourceAmt,precVal);
	} else    	{
		newAmt	=	formatToLakh1(sourceAmt,precVal);
	}
	custAmt = getAmtInCustomFormat(newAmt);
	return custAmt;
}

/**
 * Gets the Object value in the case specified in inputcase attribute
 * for the field
 *
 * @param fldName       Field name
 *
 * @return		contains the field value
 **/
function getObjValueInCase(fldName)	{
	if(isEmptyObjValue(fldName))    {
		return "";
	}
	var obj;
	if(fldName.indexOf("document.forms[0].")==-1)
	{
		obj=eval("document.forms[0]."+ fldName );
	}else{
		obj=eval(fldName);
	}
	var value       =       null;
	var inputCase   =       null;
	if(isEmptyObj(obj))	{
		return "";
	}
	value           =       escape(getFieldValue(fldName,'N'));
	if(isEmptyObjValue(value))	{
		return "";
	}
	if(!isNaN(obj.length)){
		inputCase =     obj[0].getAttribute("inputCase");
	} else {
		inputCase =     obj.getAttribute("inputCase");
	}
	if(!isEmptyObjValue(inputCase)){
		if(inputCase=="D")	{
			return value;
		}	else if(inputCase=="L")	{
			return value.toLowerCase();
		}
	}
	return value.toUpperCase();
}

/**
 * This function is required to check whether an object is null or undefined
 *
 * @param 		object
 *
 * @return		boolean.
 *
 **/

function isEmptyObj(obj)	{
	if(undefined == obj || null == obj)	{
		return true;
	}
	return false;
}

function getYesNoDesc(ynCode, sDefault) {
	switch(ynCode) {
		case 'Y':
			return finbranchResArr.get ("FAT000761");
		case 'N':
			return finbranchResArr.get ("FAT000762");
		default:
			return sDefault;
	}
}

function getPartTranType(pType)	{
	switch(pType)	{
		case 'D' : return finbranchResArr.get ("FAT001746");
		case 'C' : return finbranchResArr.get ("FAT001747");
		default  : return "";

	}
}

function getPymtTypeDesc(fnType)
{
	switch(fnType)
	{
		case 'S' : return finbranchResArr.get ("FAT001440");
		case 'U' : return finbranchResArr.get ("FAT001440");
		case 'R' : return finbranchResArr.get ("FAT000744");
		case 'M' : return finbranchResArr.get ("FAT000745");
		case 'V' : return finbranchResArr.get ("FAT000740");
		case 'X' : return finbranchResArr.get ("FAT000739");
		default  : return fnType;
	}
}
/**
 * This function opens a page for DocImg interface after formation of the URL
 *
 * @params	foracid, docCode, applRefId, protocol, server, pageLocation, portNumber, appName
 *
 * @return	boolean		Returns true if successful, false if not.
 *
 **/
function showDocImagePage(sCifId, foracid, docCode, applRefId, protocol, server,
		pageLocation, portNumber, appName)
{
	var docImgUrl = "";

	if(fnIsNull(sCifId))
	{
		alert(finbranchResource.FAT000139);
		return false;
	}

	if (fnIsNull(foracid))
	{
		alert(finbranchResArr.get("FAT000139"));
		return false;
	}
	else if ((fnIsNull(protocol)) || (fnIsNull(server)) || (fnIsNull(pageLocation)) ||
			(fnIsNull(portNumber)) || (fnIsNull(appName)))
	{
		alert(finbranchResArr.get("FAT001079"));
		return false;
	}
	else
	{
		if (fnIsNull(applRefId))
		{
			applRefId = "null";
		}

		if (fnIsNull(docCode))
		{
			docCode = "null";
		}

		docImgUrl = protocol + "://" + server + ":" + portNumber + "/" + pageLocation;
		docImgUrl += "?SessionID=" + self.sessionid + "&SecToken=" + self.sectok;
		docImgUrl += "&AppName=" + appName + "&CIF=" + sCifId + "&AccNumber=" + foracid;
		docImgUrl += "&DocCode=" + docCode + "&ApplNumber=" + applRefId;

		openModalWindow(docImgUrl,"");

		return true;
	}
}

function fnLastButtonClick()
{
	var frmObj = document.forms[0];
	/* Added for localization */ 
	if(!fnLocaleValidateForm("endMenu")) return; 
			   
	try {
		frmObj.actionCode.value="endMenu";
		if(eval(frmObj.submitform) != undefined)
		{
			frmObj.submitform.value="endMenu";
		}

		if (undefined != WF_IN_PROGRESS && WF_IN_PROGRESS == "PEAS")
		{
			frmObj.actionCode.value="endWorkflow";
			if (undefined != frmObj.submitform)
			{
				frmObj.submitform.value="endWorkflow";
			}
		}
	}catch(e){}
	frmObj.submit();
	
	return true;
}

function setActionForWorkflow()
{
	var frmObj = document.forms[0];
	try{
		if (undefined != WF_IN_PROGRESS && (WF_IN_PROGRESS == "PEAS" || WF_IN_PROGRESS == "Y"))
		{
			frmObj.actionCode.value="endWorkflow";
		}
	}catch(e){}
}

/**
 * This function is used for validation of totamount and amount
 * type fields.
 * Checks for the alphabets, special characters and the length of
 * the value according to the precision specified.
 * Empty fields are considered as invalid.
 *
 * @param	objAmtField		The amount value entered by user.
 *
 * @param	precision		The precision specified
 *
 * @param	NUM_PART_LENGTH	maximum allowable length of the numeric part
 *
 * @param	TOTAL_LENGTH	maximum allowable length of the value
 *
 * @param	errCode1		alert message 1
 *
 * @param	errCode2		alert message 2
 *
 * @param	errCode3		alert message 3
 *
 * @return	boolean			Returns true if validation is a success, false
 *							if not.
 *
 **/
function fnCommonValAmount(objAmtField, precision,NUM_PART_LENGTH,TOTAL_LENGTH,
		errNumPartLen,errNumPartPrecLen3,errNumPartPrecLen4){
	var numericPart = 0;
	var decimalPart = 0;
	var iIndex = 0;
	var bValidAmount = true;
	var sourceAmt = removeCommas(objAmtField);
	var DEC_PART_LEN = 4;
	var NUM_PART_LEN = NUM_PART_LENGTH;
	var TOTAL_LEN = TOTAL_LENGTH;
	if(isEmptyObjValue(objAmtField))    {
		return false;
	}
	if(isNaN(sourceAmt)){
		bValidAmount = false;
		alert(finbranchResArr.get("FAT000189"));
	} else {
		if(null!=precision && !isNaN(precision) && 0<parseInt(precision,10))   {
			DEC_PART_LEN = DEC_PART_LEN > precision ? precision : DEC_PART_LEN;
		}
		sourceAmt = checkZeroes(sourceAmt,precision);
		iIndex = sourceAmt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex == -1){
			numericPart = sourceAmt;
		} else {
			numericPart = sourceAmt.substring(0,iIndex);
			decimalPart = sourceAmt.substring(iIndex+1);
		}
		if(sourceAmt.length > (TOTAL_LEN + 1)){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+TOTAL_LEN+" "+
					finbranchResArr.get("FAT000524"));
		} else if(numericPart.length > NUM_PART_LEN){
			bValidAmount = false;
			alert(errNumPartLen);
		} else if(decimalPart.length > DEC_PART_LEN){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+DEC_PART_LEN+" "+
					finbranchResArr.get("FAT000526"));
		} else {
			switch(parseInt(DEC_PART_LEN,10)){
				case 3 :
					if(numericPart.length > 13){
						bValidAmount = false;
						alert(errNumPartPrecLen3 + DEC_PART_LEN);
					}
					break;
				case 4 :
					if(numericPart.length > 12){
						bValidAmount = false;
						alert(errNumPartPrecLen4 + DEC_PART_LEN);
					}
					break;
			}
		}
	}
	return bValidAmount;
}

/**
 * This function is used for validation of totamount type fields.
 * Checks for the alphabets, special characters and the length of
 * the value according to the precision specified.
 *
 * @param	objAmtField	The amount value entered by user.
 *
 * @param	precision	The precision specified
 *
 * @return	boolean		Returns true if validation is a success, false
 *						if not.
 *
 **/
function fnValidateTotAmount(objAmtFld,precision)	{
	stdAmt = getAmtInStdFormat(objAmtFld);
	return low_fnValidateTotAmount(stdAmt,precision);
}

function low_fnValidateTotAmount(stdAmt,precision)	{
	var TOTAL_LENGTH	=	19;
	var NUM_PART_LENGTH		=	17;
	var errNumPartLen		=	finbranchResArr.get ("FAT000870");
	var errNumPartPrecLen3	=	finbranchResArr.get ("FAT000871");
	var errNumPartPrecLen4	=	finbranchResArr.get ("FAT000872");
	var isValidTotAmt	=	false;
	isValidTotAmt	=	fnCommonValAmount(stdAmt,precision,NUM_PART_LENGTH,
			TOTAL_LENGTH,errNumPartLen,errNumPartPrecLen3,
			errNumPartPrecLen4);
	if(!isValidTotAmt)	{
		return false;
	}
	return true;
}
//Included by aarthi_va  for Alphanumeric check for Biller Id in HBLRG.fcfg
function fnAlphaCheck(FldObj)
{

	var validChars = /[^A-Za-z0-9_]/; //Anything other than 0-9, A- Z and Underscore is  invalid.
	var obj	= 'document.forms[0].'+FldObj;
	if(validChars.test((eval(obj)).value))
	{
		alert(finbranchResArr.get("FAT000485"));

		(eval(obj)).focus();

		return false;

	}

	return true;


}
//Included by aarthi_va  for varying cust Searcher in HPYRG.fcfg
function showHPYRGCustSearcher(iName,inputFields,outputFields,pWidth,pHeight)
{
	var funcCode       = document.forms[0].funcCode.value;
	var VERIFY         = "V";
	if (fnIsNull(document.forms[0].funcCode.value))
	{
		alert(finbranchResArr.get("FAT000200"));
		document.forms[0].funcCode.focus();
	}
	else
	{
		if (funcCode == VERIFY)
		{
			showDynSearcher(iName,inputFields,outputFields,pWidth,pHeight);
		}
		else   {

			showCifId(document.forms[0].cust_id,'ctrl','F',document.forms[0].cust_name);

		}
	}

}

/**
 * This function  sets the value for a field.
 *
 * @param 	fieldName	Contains the id of the field
 *
 * @param 	fieldValue	Contains the value to be set
 *
 * @param 	isFldDisable	Contains the flag whether to set the value for
 *				disabled field or not.
 *
 * @return 	void
 *
 **/
function setFieldValue(fieldName,fieldValue,isFldDisable){
	var fldLength 	= 	null;
	var fld		= 	null;
	var visualFldId	=	null;
	var visualFld	=	null;
	var dataType	=	null;
	try {
		if(fieldName.indexOf("document.forms[0].")==-1)
		{
			fld=eval("document.forms[0]."+ fieldName );
		}else{
			fld=eval(fieldName);
		}
		if(isEmptyObj(fld)){
			return true;
		}	else	{
			fldLength = fld.length;
		}
		if (isEmptyObjValue(fieldValue)){
			fieldValue	=	"";
		}
		if (isEmptyObjValue(isFldDisable)){
			isFldDisable	=	"N";
		}
		if(!isNaN(fldLength) &&
				("radio"==fld[0].type || "checkbox"==fld[0].type)) {
			for (i=0; i<fldLength; i++){
				if (fld[i].disabled == true && 'Y' != isFldDisable){
					return false;
				}
				if (fld[i].value == fieldValue){
					fld[i].checked = true;
					break;
				}
			}
		}	else	{
			visualFldId = fld.getAttribute("vFldId");
			if (fld.type == "hidden" &&
					!isEmptyObjValue(visualFldId)){
		                if((visualFldId.indexOf("document.")) == -1)
				     visualFld = eval("document.forms[0]."+ visualFldId);
                                else
				     visualFld = eval(visualFldId);
			        dataType = visualFld.getAttribute("fdt");
				if (visualFld.disabled == true &&
						'Y' != isFldDisable){
					return false;
				}
				if("amount"!=dataType && "totamount"!=dataType){
					if("checkbox" == visualFld.type) {
						if(fieldValue == visualFld.getAttribute("vCheck"))	{
							visualFld.checked = true;
						}   else if(fieldValue == visualFld.getAttribute("vUnCheck"))   {
							visualFld.checked = false;
						}	else	{
						    visualFld.checked = false;
							fld.value=visualFld.getAttribute("vUnCheck");							
							return false;
						}
					}	else	{
						dataType = visualFld.getAttribute("datatype");
                        var locDateType = visualFld.getAttribute("fdt");
						if (dataType == "date" || locDateType == 'uidate' || locDateType == 'datetime'){
							visualFld.value	=	fnConvertToUIDate(fieldValue);
						} else {
							visualFld.value	=	fieldValue;
						}
					}
				}	else	{
					fld = visualFld;
				}
			}
			if (fld.disabled==true && 'Y'!=fld.getAttribute("fds")
					&& 'Y' != isFldDisable ) {
				return false;
			}

			fld.value = fieldValue;
		}
	}	catch(err)	{
		return false;
	}
	return true;
}

/**
 * This function  returns the selected value for a field.
 *
 * @param 	fieldName	Contains the id of the field
 *
 * @return 			The value of the field.
 *
 **/
function getFieldValue(fieldName,useVisualFld){
	var val			= null;
	var fldLength 	= null;
	var fld			= null;
	var tmpFld			= null;
        var fld = null; 
        try {
		if(isEmptyObjValue(useVisualFld)){
			useVisualFld    =       'Y';
		}
		if(fieldName.indexOf("document.forms[0].")==-1)
		{
			fld=eval("document.forms[0]."+ fieldName );
		}
		else
		{
			fld=eval(fieldName);
		}
		if(isEmptyObj(fld)){
			return null;
		}	else	{
			fldLength = fld.length;
		}
		if(!isNaN(fldLength) && ("radio" == fld[0].type || "checkbox" == fld[0].type))	{
			val="";
			for (i=0; i<fldLength; i++){
				if (fld[i].checked == true){
					val = fld[i].value;
					break;
				}
			}
		}	else	{
			visualFldId = fld.getAttribute("vFldId");
			if (fld.type=="hidden" && !isEmptyObjValue(visualFldId) && useVisualFld !='N'){
				tmpFld=eval("document.forms[0]."+ visualFldId);
				if(!isEmptyObj(tmpFld) &&
						"checkbox"!=tmpFld.type) {
					fld = tmpFld;
				}
			}
			val = fld.value;
		}
	}	catch(err)	{
		return null;
	}
	return val;
}
/*Added to suppress the return key on entering text in case of textarea*/
function suppressEnterKey(evt)
{
	var keyCode = evt.which ? evt.which : evt.keyCode;
	if( keyCode==13 )
	{
		if("Netscape" == browser_name)
		{
			return false;
		}
		evt.returnValue = false;
	}
}

function fnCommonFetchAcctDtls(acctObj, acctName, acctSol, acctCrncy, isError, fType)
{
	var acctNumber = acctObj.id;
	wReturnDesc = acctCrncy+ '|'+ acctSol +'|'+ acctName + '|'+ acctNumber;
	/*Appended account number to description string at last, note that this is
	 * not a description field and will be return changed value if
	 * formatAccount.scr is implemented */
	ret = fnLowCommonFetchAcctDtls(acctObj, wReturnDesc, isError, fType);

	return (ret);
}

function fnLowCommonFetchAcctDtls(acctObj, wReturnDesc, isError, fType)
{
	var isValidFetchType	= false;
	var fetchTypeRes		= ["VALACCTID","VALCUSTACCTID","VALOFFACCTID","VALVRFDACCTID","VALCLSDOFFACCT","VALUNVRFDOFFACCTID","VALVRFDACCTID1","ACCTFETCHWITHBAL","VALACCTIDWITHCLSDFLG"];

	if(! fnIsNull(wReturnDesc) && wReturnDesc != undefined)
	{
		var descFldArr=wReturnDesc.split("|");
		/*This descFldArr will have account number at last which is not a
		 * description array hence the same has to be retained and not cleared */
		var locDescFldArrLen = descFldArr.length - 1;
		if (locDescFldArrLen > 0){
			for( var i=0;i<locDescFldArrLen;i++){
				clearDescField(descFldArr[i]);
			}
		}
	}

	for(var iCount=0;iCount<fetchTypeRes.length;iCount++)
	{
		if(fType == fetchTypeRes[iCount]) {
			isValidFetchType = true;
			break;
		}
	}

	if(! isValidFetchType) fType = "VALACCTID";

	if(!fnIsNull(acctObj.value))
	{
		retVal = sendDataToServer('dummyFrame', fType, 'F', acctObj.id, wReturnDesc);
		if (! retVal && isError)
		{
			setFieldFocus(acctObj);
			return false;
		}
	}

	return true;
}

//function for disabling fields with * as value and corresponding hyperlink
function mask(objId,hypLnk) {
	str = "";
	if(eval("document.forms[0]."+objId) != undefined) {
		iLength = eval("document.forms[0]."+objId+".size");
		for(iCnt =0; iCnt < iLength; iCnt++) {
			str = str + "*";
		}
		obj = eval("document.forms[0]."+objId);
		obj.maxlength = iLength;
		obj.value = str;
		obj.disabled = true;
		hideImage(hypLnk);
	}
}

//function for removing mask
function unmask(objId,hypLnk) {
	str = "";
	if(eval("document.forms[0]."+objId) != undefined) {
		obj = eval("document.forms[0]."+objId);
		obj.value = "";
		showImage(hypLnk);
		obj.disabled = false;
	}
}

/* This function converts standard amount format to custom format.*/

function getAmtInCustomFormat(stdAmt)
{
	if (fnIsNull(stdAmt))
		return stdAmt;

	var iIndex = stdAmt.indexOf(DEF_DECIMAL_SEPARATOR);
	if (iIndex == -1) {
		return replace(stdAmt, DEF_MANTISSA_SEPARATOR, MANTISSA_SEPARATOR);
	}

	var numPart = stdAmt.substring(0,iIndex);
	var decPart = stdAmt.substring(iIndex+1);

	numPart = replace(numPart, DEF_MANTISSA_SEPARATOR, MANTISSA_SEPARATOR);
	return numPart + DECIMAL_SEPARATOR + decPart;
}

function getUnitsInCustomFormat(stdAmt)
{
	if (fnIsNull(stdAmt))
		return stdAmt;

	stdAmt = removeMantissa(stdAmt);
	var iIndex = stdAmt.indexOf(DEF_DECIMAL_SEPARATOR);
	if (iIndex == -1) {
		return replace(stdAmt, DEF_MANTISSA_SEPARATOR, MANTISSA_SEPARATOR);
	}

	var numPart = stdAmt.substring(0,iIndex);
	var decPart = stdAmt.substring(iIndex+1);

	numPart = replace(numPart, DEF_MANTISSA_SEPARATOR, MANTISSA_SEPARATOR);
	return numPart;
}

function getUnitInCustomFormat(stdAmt)
{
	if (fnIsNull(stdAmt))
		return stdAmt;
		
	stdAmt = removeMantissa(stdAmt);	

	var iIndex = stdAmt.indexOf(DEF_DECIMAL_SEPARATOR);
	if (iIndex == -1) {
		return replace(stdAmt, DEF_MANTISSA_SEPARATOR, MANTISSA_SEPARATOR);
	}

	var numPart = stdAmt.substring(0,iIndex);

	return numPart;
}


/* This function converts custom amount format to standard format. */
function getAmtInStdFormat(custAmt)
{
	if (fnIsNull(custAmt))
		return custAmt;

	custAmt = removeMantissa(custAmt);
	var iIndex = custAmt.indexOf(DECIMAL_SEPARATOR);
	if (iIndex == -1) {
		return custAmt;
	}

	return replace(custAmt, DECIMAL_SEPARATOR,DEF_DECIMAL_SEPARATOR);
}

//This function removes commas from the given amount
function removeMantissa(sNum)
{
	sNew ="";
	var sTemp = sNum.split(MANTISSA_SEPARATOR);
	for (i=0;i<sTemp.length;i++)
	{
		if (sTemp[i]!=null)
			sNew = sNew + sTemp[i];
	}
	return sNew;
}

function replace(numPart, fromStr, toStr)
{
	var buff = numPart.split(fromStr);
	var newStr = "";
	for (var i=0; i<buff.length; i++)
	{
		newStr += buff[i];
		if ((i+1) != buff.length) {
			newStr += toStr;
		}
	}
	return newStr;
}

function low_isValidAmt(amt)
{
	var amtLen = amt.length;
	var lastChar = (amt.charAt(amtLen - 1)).toUpperCase();

	if (isNaN(lastChar) && lastChar != '.') {
		var str = amt.substring(0, amtLen - 1);
		if (isNaN(str)) {
			alert(finbranchResArr.get("FAT000518"));
			return false;
		}

		var val = "";
		if (eval("this.custGetAmountCodeValue") != undefined) {
			val = custGetAmountCodeValue(lastChar);
		}
		else {
			val = getAmountCodeValue(lastChar);
		}
		if (val == undefined) {
			alert("Enter Valid Amount Code.");
			return false;
		}
		else {
			return true;
		}
	}

	if (isNaN(amt)) {
		alert(finbranchResArr.get("FAT000518"));
		return false;
	}

	var regExp = /[Ee]/g;
	if (regExp.test(amt)) {
		alert(finbranchResArr.get("FAT000518"));
		return false;
	}

	return true;
}

function low_convertAmt(amt)
{
	var amtLen = amt.length;
	var lastChar = (amt.charAt(amtLen - 1)).toUpperCase();
	//Fix for Ticket-179825
	var firstChar = (amt.charAt(0)).toUpperCase();
	var str = amt.substring(0, amtLen - 1);
	var val = "";
	if (eval("this.custGetAmountCodeValue") != undefined) {
		val = custGetAmountCodeValue(lastChar);
	}
	else {
		val = getAmountCodeValue(lastChar);
	}

	if (val != undefined) {
		if (str.length == 0) {
			str = "1";
		}
		amt = Math.round(str * val) + "";
	}

	/* Code to suppress single "+" if prefixed in amount fields
	 * Fix for Ticket-179825 */

	if(firstChar == '+')
	{
		amt = amt.replace('+','');
	}

	return amt;
}

function low_validateUnitWithPrec(amt, obj,precision, zerochk)
{
	var maxValue = "999999999";

	if (low_fnSubtractAmt(amt, maxValue) > 0)
	{
		alert(finbranchResArr.get("FAT008554"));
		return false;
	}

	if(!fnValidateStdUnit(amt,obj,precision,zerochk))
	{
		return false;
	}

	return true;
}

function low_validateAmtWithPrec(amt, precision, dataType)
{
	var isTotAmt = (dataType == "totamount");
	var maxValue = (isTotAmt) ? "9999999999999999999" : "99999999999999999";

	if (low_fnSubtractAmt(amt, maxValue) > 0)
	{
		alert(finbranchResArr.get("FAT003216"));
		return false;
	}

	if(isTotAmt)
	{
		if (!low_fnValidateTotAmount(amt,precision)) {
			return false;
		}
		return true;
	}

	if(!fnValidateStdAmount(amt,precision))
	{
		return false;
	}

	return true;
}

function fnValidateAmount(amt,precision)
{
	amt = getAmtInStdFormat(amt);
	return fnValidateStdAmount(amt,precision);
}

function low_formatAmt(format, obj, crncy, prec, prn, idx)
{
	var isObject = (prn != 'Y');
	var isCrncyAvl = !fnIsNull(crncy);
	var isPrecAvl = !fnIsNull(prec);

	format = (fnTrim(format)).toUpperCase();
	if (format != "MILLION" && format != "LAKH") {
		alert("Invalid Amount Format.");
		low_setAmtFldFocus(isObject, obj, idx);
		return false;
	}

	var amt = (isObject) ? obj.value : obj;

	amt = fnTrim(amt);
	if (fnIsNull(amt)) {
		return true;
	}

	amt = removeMantissa(amt);
	amt = getAmtInStdFormat(amt);

	if (!low_isValidAmt(amt)) {
		low_setAmtFldFocus(isObject, obj, idx);
		return false;
	}

	amt = low_convertAmt(amt);

	if (isCrncyAvl) {
		prec = getPrec(crncy);
	}
	if (!isCrncyAvl && !isPrecAvl){
		var decLen = 0;
		var iIndex = 0;
		prec = '2';

		iIndex = amt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex != -1){
			decLen = amt.substring(iIndex+1).length;
		}

		if(decLen > prec)
			prec = decLen;
	}

	if (isObject && !low_validateAmtWithPrec(amt, prec, obj.getAttribute("fdt")))
	{
		low_setAmtFldFocus(isObject, obj, idx);
		return false;
	}

	amt = checkZeroes(amt,prec);

	if (format == 'MILLION'){
		amt = formatToMillion1(amt,prec);
	}
	else {
		amt = formatToLakh1(amt,prec);
	}

	amt = getAmtInCustomFormat(amt);
	if (isObject) {
		obj.value = amt;
	}
	else {
		document.write(amt);
	}
	return true;
}

function low_setAmtFldFocus(isObject, obj, idx)
{
	if (isObject) {
		if (!obj.disabled) {
			setTimeout(obj+'.focus()',10);
			if(null == idx || idx == undefined){
				setTimeout('document.forms[0].'+obj.id+'.focus()', 10);
			}else{
				setTimeout('document.forms[0].'+obj.id+'['+idx+'].focus()', 10);
			}
		}
	}
	return;
}

function fnValidateStdUnit(objAmtField, obj,precision,zerochk)
{

    var DEC_PART_LEN = (zerochk == 'Y') ? '0' : '6';
    var numericPart  = 0;
    var decimalPart  = 0;
    var iIndex       = 0;
    var noOfZeros    = 0;
    var extDecPart   = 0;
    var bValidAmount = true;
    var sourceAmt    = removeMantissa(obj.value);
    var NUM_PART_LEN = 9;
    var TOTAL_LEN    = 16;
	var bValidAmount = true;
	var sourceAmt = removeCommas(objAmtField);
    var ZERO_PREC_TOT_LEN = 16;

	if(isNaN(sourceAmt)){
		bValidAmount = false;
		alert(finbranchResArr.get("FAT000189"));
	} else {
		DEC_PART_LEN = DEC_PART_LEN > precision ? precision : DEC_PART_LEN;
		sourceAmt = checkZeroes(sourceAmt,precision);
		iIndex = sourceAmt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex == -1){
			numericPart = sourceAmt;
		} else {
			numericPart = sourceAmt.substring(0,iIndex);
			decimalPart = sourceAmt.substring(iIndex+1);
		}
		if(sourceAmt.length > TOTAL_LEN && precision!=0){	
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+TOTAL_LEN+finbranchResArr.get("FAT008555"));
		}
		else if(precision == 0 && sourceAmt.length > ZERO_PREC_TOT_LEN) 
		{ 
			bValidAmount = false; 
			alert(finbranchResArr.get("FAT000523")+ZERO_PREC_TOT_LEN+finbranchResArr.get("FAT008555")); 
		} 

		else if(numericPart.length > NUM_PART_LEN && precision!=0 ){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000525"));
		} else if(decimalPart.length > DEC_PART_LEN){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+DEC_PART_LEN+" "+finbranchResArr.get("FAT000526"));
		} else {

			switch(parseInt(DEC_PART_LEN,10)){
				case 3 :
					if(numericPart.length > 13){
						bValidAmount = false;
						alert(finbranchResArr.get("FAT000527") + DEC_PART_LEN);
					}
					break;
				case 4 :
					if(numericPart.length > 12){
						bValidAmount = false;
						alert(finbranchResArr.get("FAT000528") + DEC_PART_LEN);
					}
					break;
			}
		}
	}
	return bValidAmount;
	
}
function fnValidateStdAmount(objAmtField, precision){

	var numericPart = 0;
	var decimalPart = 0;
	var iIndex = 0;
	var bValidAmount = true;
	var sourceAmt = removeCommas(objAmtField);
	var DEC_PART_LEN = 4;
	var NUM_PART_LEN = 14;
	var TOTAL_LEN = 17;
        var ZERO_PREC_TOT_LEN = 16;

	if(isNaN(sourceAmt)){
		bValidAmount = false;
		alert(finbranchResArr.get("FAT000189"));
	} else {
		DEC_PART_LEN = DEC_PART_LEN > precision ? precision : DEC_PART_LEN;
		sourceAmt = checkZeroes(sourceAmt,precision);
		iIndex = sourceAmt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex == -1){
			numericPart = sourceAmt;
		} else {
			numericPart = sourceAmt.substring(0,iIndex);
			decimalPart = sourceAmt.substring(iIndex+1);
		}
		if(sourceAmt.length > TOTAL_LEN && precision!=0){	
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+TOTAL_LEN+finbranchResArr.get("FAT000524"));
		}
		else if(precision == 0 && sourceAmt.length > ZERO_PREC_TOT_LEN) 
		{ 
			bValidAmount = false; 
			alert(finbranchResArr.get("FAT000523")+ZERO_PREC_TOT_LEN+finbranchResArr.get("FAT000524")); 
		} 

		/* Max 14digits allowed check for  JPY currency has been modified by Rohit Shankar
		   else if(numericPart.length > NUM_PART_LEN && crncy !='JPY'){*/
		else if(numericPart.length > NUM_PART_LEN && precision!=0 ){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000525"));
		} else if(decimalPart.length > DEC_PART_LEN){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+DEC_PART_LEN+" "+finbranchResArr.get("FAT000526"));
		} else {

			switch(parseInt(DEC_PART_LEN,10)){
				case 3 :
					if(numericPart.length > 13){
						bValidAmount = false;
						alert(finbranchResArr.get("FAT000527") + DEC_PART_LEN);
					}
					break;
				case 4 :
					if(numericPart.length > 12){
						bValidAmount = false;
						alert(finbranchResArr.get("FAT000528") + DEC_PART_LEN);
					}
					break;
			}
		}
	}
	return bValidAmount;
	}

	function getDecIndex(custVal)
	{
		if (fnIsNull(custVal))
			return -1;

		return custVal.indexOf(DECIMAL_SEPARATOR);
	}

	/* This function converts custom amount format to  int. */

	function getAmtInInt(custAmt)
	{
		var stdAmt = getAmtInStdFormat(custAmt);
		return parseInt(stdAmt,10);
	}

	/* This function converts custom amount format to  float. */

	function getAmtInFloat(custAmt)
	{
		var stdAmt = getAmtInStdFormat(custAmt);
		return parseFloat(stdAmt);
	}

	/**
	 *This function is similar to fnIsValidDate to validate the hidden date value before
	 *passing into the url formation logic.Modifications have been made to exclude mnemonic
	 *validations and to return true if hidden date value is blank(In fnIsValidDate it
	 *returns true).Added as part of date selector enhancement.
	 * @param           :         hidden date object
	 * @return          :         boolean
	 **/

	function fnIsValidContextDate(dateObj){


		var lstrDobFlg;
		var liLowYear=1900;

		a_strDate=dateObj.value;
		if(a_strDate=="")
			return false;

		if(a_strDate.indexOf("/") != -1)
			var a_strDate = a_strDate.split("/");
		else
			if(a_strDate.indexOf("-") != -1)
				var a_strDate = a_strDate.split("-");
			else
				if(a_strDate.indexOf(".") != -1)
					var a_strDate = a_strDate.split(".");
				else
				{
					return false;
				}
		a_strDay = a_strDate[0];
		a_strMonth = a_strDate[1];
		a_strYear = a_strDate[2];
		if(a_strDay.length==1)
		{
			a_strDay="0"+a_strDay;
		}
		if(a_strMonth.length==1)
		{
			a_strMonth="0"+a_strMonth;
		}
		lstrDobFlg = dateObj.getAttribute("fdob");
		// if it is a date of birth field set lower year as 1850
		if (lstrDobFlg != null && lstrDobFlg == "Y")
			liLowYear=1850;

		if ( ( isNaN( a_strYear ) ) || ( isNaN( a_strMonth ) ) || ( isNaN( a_strDay ) ) || a_strDay.length <=1)	{
			return false;
		}
		else {
			if ( ( a_strYear < liLowYear ) || ( a_strYear > 2099 ) || ( a_strMonth > 12 ) || ( a_strMonth<1 ) || ( a_strDay < 1 ) || ( a_strDay > 31 ) || ( ( ( a_strMonth == 4 ) || ( a_strMonth == 6 ) || ( a_strMonth == 9 ) || (  a_strMonth == 11 ) ) && ( a_strDay > 30 ) ) )
				return false;
			else {
				if ( ( a_strYear % 4 == 0 ) && ( ( a_strYear % 100 != 0 ) || ( a_strYear % 400 == 0 ) ) )	{
					if ( ( a_strMonth == 2 ) && ( ( a_strDay > 29 ) || ( a_strDay < 1 ) ) ) {
						return false;
					}
				}
				else {
					if ( ( a_strMonth == 2 ) && ( ( a_strDay > 28 ) || ( a_strDay < 1 ) ) ) {
						return false;
					}
				}
			} // end of else
		}//end of else
		return true;
	}


	function getValInStdFormat(custVal)
	{
		if(fnIsNull(custVal))
			return custVal;

		var retStr = "";
		var temp;
		var str = custVal;
		for (var i=0; i<str.length; i++)
		{
			temp = str.charAt(i);
			if (temp == MANTISSA_SEPARATOR)
				temp = DEF_MANTISSA_SEPARATOR;
			else if (temp == DECIMAL_SEPARATOR)
				temp = DEF_DECIMAL_SEPARATOR;
			retStr+=temp;
		}

		return retStr;
	}

	function getValInCustomFormat(stdRate)
	{
		if(fnIsNull(stdRate))
			return stdRate;

		return replace(stdRate,DEF_DECIMAL_SEPARATOR,DECIMAL_SEPARATOR);
	}

	function isNumber(custVal)
	{
		custVal = removeMantissa(custVal);
		var stdVal = getValInStdFormat(custVal);
		return (!isNaN(stdVal));
	}

	function getValInInt(custVal)
	{
		var stdVal = getValInStdFormat(custVal);
		return parseInt(stdVal,10);
	}

	function getValInFloat(custVal)
	{
		var stdVal = getValInStdFormat(custVal);
		return parseFloat(stdVal);
	}

	function getValInNumber(custVal)
	{
		var stdVal = getValInStdFormat(custVal);
		return Number(stdVal);
	}
	function fnExplodeAcct(objAct,isObj)
	{

		var objForm	= document.forms[0];
		var acctId;

		convertToCaps();

		if(isObj == 'N')
		{
			acctId = (!isEmptyObjValue(objAct))?objAct.toUpperCase():"";
		}
		else
		{
			acctId = (!isEmptyObj(objAct))?objAct.value:"";
		}

		if (objForm.action.indexOf(JSP_PARAMS_AVAILABLE)!=-1)
		{
			objForm.action = objForm.action + '&rtId=' + rtId + '&expAcctId=' +escape(acctId);
		}
		else
		{
			objForm.action = objForm.action + '?rtId=' + rtId + '&expAcctId=' +escape(acctId);
		}
		doSubmit(ACCOUNT_EXPLODE);
	}

	/**
	 * This function hides or unhides a given link
	 *
	 * @param id		The id of the link
	 *
	 * @param value		true to hide and false to unhide.
	 *
	 **/
	function linkHide(id,isHide){
		var value="";
		if(isHide)	{
			value="none";
		}
		var layer = get_lyr_css(id);
		if(layer){
			layer.display = value;
		}
	}
	function focusOnRadio(flds)	{
		var fld		=	null;
		var isChecked=	false;
		if(isEmptyObj(flds))	{
			return false;
		}
		len	=	flds.length;
		for(var i=0;i<len;i++)	{
			fld	=	flds[i];
			if(fld.checked==true && fld.disabled==false)	{
				fld.focus();
				return true;
			}
		}
		if(len>0 && flds[0].disabled==false)	{
			flds[0].focus();
			return true;
		}
		return true;
	}

	//This function validates date, when the focus goes out of the date field
	function validateDateOnBlur(dateObject) {
	//	dateObj = dateObject +"_ui";
    /* Changes for MM-DD-YYYY pattern 
     * While passing the date component for validation the 
     * Non-UI component of date field should only be passed 
     */ 
		dateObj = eval("document.forms[0]."+dateObject);
		if (!(fnIsValidDate(dateObj)))
		{
			alert(finbranchResArr.get("FAT000081"));
			fnSetFocusForDate(dateObj);
			return false;
		}
	}

	//new valdation for valid time 00:00 - 23:59
	//added by imran on 10/10/2005 for validating HH:MM time format
	function fnIsValidTimeHHMM(time){
		//valid time separator used here is only ':'
		//if new separator(s) are required, append them
		//just after ':' in regular expression 'reInvalidTimeChars'
		//valid time characters are digits and time separator(s)

		//invalid time characters are all but valid time characters
		var reInvalidTimeChars = /[^0-9:]/g;
		var sTime   = time.value;
		var sChar   = sTime.substr(2,1);
		if(fnIsNull(sTime))
			return true;
		if(reInvalidTimeChars.test(sTime) || sChar != ':'){
			alert(finbranchResArr.get("FAT001286"));
			return false;
		}

		if (sTime.length != 5)
		{
			alert(finbranchResArr.get("FAT001286"));
			return false;
		}
		var sHH     = sTime.substr(0,2);    //extracts hh from [hh:mm]
		var sMM     = sTime.substr(3,2);    //extracts mm from [hh:mm]

		if( isNaN(sHH) || isNaN(sMM) )
			return false;

		var iHH = Number(sHH);
		var iMM = Number(sMM);

		if(iHH < 0 || iHH > 23 || iMM < 0 || iMM > 59){
			alert(finbranchResArr.get("FAT001287"));
			return false;
		}
		return true;
	}

	function writeRefFooter(){
		funcName = "this."+"locfnwriteRefFooter";
		if(eval(funcName) != undefined){
			eval(funcName).call(this);
		}
		writeFooter();
}

function getValueOfArgument(rowNo,inputFields) {
    if (undefined==inputFields || null==inputFields ||
        fnTrim(inputFields).length==0 || ''==inputFields) {
            return "";
    }
    var IsDetails;
    var inpFlds = inputFields.split("|");
    var splitFlds = null;
    var splitFld = null;
    var inpFld = null;
    var sptFldInd = -1;
    var val = null;
    var headerName=null;
    var sptStr = "";
    var values = details.getValues();
    var retValue = "";
    var headers     = details.getHeader();
    if(undefined==headers && headers==null ){
            return;
    }
    for (i=0;i<inpFlds.length;i++) {
            sptStr = "";
            inpFld = inpFlds[i];
            if(inpFld.indexOf(":")!=-1) {
                splitFlds=inpFld.split("=");
                for(j=0;j<splitFlds.length;j++) {
                    splitFld = splitFlds[j];
                    if((sptFldInd=splitFld.indexOf(":"))!=-1) {
                        headerName=splitFld.substring(sptFldInd+1,splitFld.length);
                        IsDetails='N';
                        for(var k=0;k<headers.length;k++){
                            if(headerName==headers[k].getFieldName())
                            {
                            val = getValueFromArray(rowNo,details,headerName);
                            IsDetails='Y';
                            }
                        }
                        if(IsDetails=='N'){
                        val = getValueFromSummArray(details,headerName);
                        }
                        retValue += val+"|";
                    }
                }
            }
    }
     return retValue;
    }

function RelaciExplodes(rowNo,inputFields) {
	var url = null;
	var values = getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");
	table_indicator = tmp[0];
	acct_num = tmp[1];
	srl_num=tmp[2];
	if (table_indicator == "T")    {
	fnExplodeAccount(acct_num, 'N');
	} else {
 		url = "../inquiry/inquiry_ctrl.jsp?mo=RENHIST&actionCode=SUBMIT&renhist.foracid="+acct_num+"&renhist.ren_srl_no="+srl_num+"";
 		formUrl(url);	
	}
}

function showIntCodesScreen(rowNo,inputFields)  {
         var values = getValueOfArgument(rowNo,inputFields);
         var url = null;
            tmp = values.split("|");

            if (tmp[4] == "I")
            {
                url = "../ivsm/ivsm_ctrl.jsp?&mo=HIVSI&submitform=Accept&pagename=ivsm&ivsm.funcCode=I&ivsm.intTblCode="+tmp[0]+"&ivsm.intVersion="+tmp[1]+"&ivsm.crncyCode="+tmp[2]+"&ivsm.baseInd="+tmp[3]+"";
                document.forms[0].calledMenu.value=url;
                doSubmitForm("INVOKE_GROUP_RECORD");
            }
            if (tmp[4] == "B")
            {
                            url = "../bivsm/bivsm_ctrl.jsp?&mo=HBIVSM&submitform=Accept&actionCode=EXPLODE&pagename=bivsm&bivsm.funcCode=I&bivsm.intTblCode="+tmp[0]+"&bivsm.intVersion="+tmp[1]+"&bivsm.crncyCode="+tmp[2]+"&bivsm.baseInd="+tmp[3]+"";
                            document.forms[0].calledMenu.value=url;
                            doSubmitForm("INVOKE_GROUP_RECORD");
            }
            if (tmp[4] == "C")
                        {
                                        url = "../clvsm/clvsm_ctrl.jsp?&mo=HCLVSM&submitform=Accept&actionCode=EXPLODE&pagename=clvsm&clvsm.funcCode=I&clvsm.intTblCode="+tmp[0]+"&clvsm.intVersion="+tmp[1]+"&clvsm.intTblCrncy="+tmp[2]+"&clvsm.baseInd="+tmp[3]+"";
                                        document.forms[0].calledMenu.value=url;
                                        doSubmitForm("INVOKE_GROUP_RECORD");
            }
            if (tmp[4] == "T")
                                                {
                                                    url = "../tvsm/tvsm_ctrl.jsp?&mo=HTVSM&submitform=Accept&pagename=tvsm&tvsm.funcCode=I&tvsm.intTblCode="+tmp[0]+"&tvsm.intVersion="+tmp[1]+"&tvsm.crncyCode="+tmp[2]+"&tvsm.baseInd="+tmp[3]+"";
                                                    document.forms[0].calledMenu.value=url;
                                                    doSubmitForm("INVOKE_GROUP_RECORD");
            }
            if (tmp[4] == "L")
                                    {
                                        url = "../lvsm/lvsm_ctrl.jsp?&mo=HLVSM&submitform=Accept&pagename=lvsm&lvsm.funcCode=I&lvsm.intTblCode="+tmp[0]+"&lvsm.intVersion="+tmp[1]+"&lvsm.crncyCode="+tmp[2]+"&lvsm.baseInd="+tmp[3]+"";
                                        document.forms[0].calledMenu.value=url;
                                        doSubmitForm("INVOKE_GROUP_RECORD");
            }
    }

function LimndiExplodes(rowNo,inputFields) {
    var url = null;
    var values = getValueOfArgument(rowNo,inputFields);
    tmp = values.split("|");
    table_indicator = tmp[0];
    entity_id = tmp[1];
	sol_id = tmp[2]; 
	entity_ind =  tmp[3]; 
    switch (table_indicator) {
    case 'A': // Account - GAM
        fnExplodeAccount(entity_id, 'N');
		break;
    case 'D': // Documentary Credits
		if(entity_ind == "INWARD DC") 
		{ 
			url ="../idcm/idcm_ctrl.jsp?mo=IDCM&actionCode=init&idcm.funcCode=I&idcm.idcmNum="+entity_id+"&idcm.solId="+sol_id; 
		} 
		else if (entity_ind == "OUTWARD DC") 
		{ 
			url ="../odcm/odcm_ctrl.jsp?mo=ODCM&actionCode=init&odcm.funcCode=I&odcm.odcmNum="+entity_id+"&odcm.solId="+sol_id; 
		} 
		document.forms[0].calledMenu.value=url; 
		doSubmitForm("INVOKE_GROUP_RECORD"); 
        break;
    case 'G': // Bank Guarantees
		if(entity_ind ==  "INWARD BANK GUARANTEE") 
		{ 
			url = "../igm/igm_ctrl.jsp?mo=IGM&actionCode=init&igm.funcCode=I&igm.bgSrlNum="+entity_id+"&igm.solId="+sol_id; 
		} 
		else if(entity_ind ==  "OUTWARD BANK GUARANTEE") 
		{ 
			url = "../ogm/ogm_ctrl.jsp?mo=OGM&actionCode=init&ogm.funcCode=I&ogm.bgSrlNum="+entity_id+"&ogm.solId="+sol_id; 
		} 

		document.forms[0].calledMenu.value=url; 
		doSubmitForm("INVOKE_GROUP_RECORD"); 
        break;
	case 'B': 
		if(entity_ind == "IMPORT BILL") 
		{ 
			url = "../miib/miib_ctrl.jsp?mo=MIIB&actionCode=init&miib.funcCode=I&miib.billId="+entity_id+"&miib.solId="+sol_id; 
		} 
		else if(entity_ind == "EXPORT BILL") 
		{ 
			url = "../fbm/fbm_ctrl.jsp?mo=MEOB&actionCode=init&fbm.funcCode=I&fbm.billId="+entity_id+"&fbm.solId="+sol_id; 
		} 
		document.forms[0].calledMenu.value=url; 
		doSubmitForm("INVOKE_GROUP_RECORD"); 
		break; 
    case 'F': // Forward Contract
		url = "../mntfwc/mntfwc_ctrl.jsp?mo=MNTFWC&actionCode=init&mntfwc.funcCode=I&mntfwc.FwdCntrctNo="+entity_id+"&mntfwc.solId="+sol_id; 
		document.forms[0].calledMenu.value=url; 
		doSubmitForm("INVOKE_GROUP_RECORD"); 
        break;
	 case 'C': //Buyers Credit
    url = "../mbco/mbco_ctrl.jsp?mo=MBCO&actionCode=init&mbco.funcCode=I&mbco.buyersCreditNo="+entity_id+"&mbco.solId="+sol_id;
    document.forms[0].calledMenu.value=url;
    doSubmitForm("INVOKE_GROUP_RECORD");
    break;
    default:
        alert ("Invalid indicator !");
        break;
    }
}

function doRefSubmit(objBtn){
	funcName = "this."+"locfndoRefSubmit";
	if(eval(funcName) != undefined){
		eval(funcName).call(this,objBtn);
	}else{
		doSubmit(objBtn.id);
	}
}

function setChkBoxFldArr(fldName,maxRecs)
{
    var frm = document.forms[0];
    var cbId = "frm.chk" + fldName;
    var fldId = "frm." + fldName;
    var cbObj;
    var fldObj;

    for (var i=0; i<maxRecs; i++)
    {
        cbObj = eval(cbId + "["+i+"]");
        fldObj = eval(fldId + "["+i+"]");
        fldObj.value = (cbObj.checked) ? 'Y' : 'N';
    }
}

function setChkBoxArr(fldName,maxRecs)
{
    var frm = document.forms[0];
    var cbId = "frm.chk" + fldName;
    var fldId = "frm." + fldName;
    var cbObj;
    var fldObj;

    for (var i=0; i<maxRecs; i++)
    {
        fldObj = eval(fldId + "["+i+"]");
        cbObj = eval(cbId + "["+i+"]");
        cbObj.checked = (fldObj.value == 'Y');
    }
}

function intRateFillPrecision(intRate)
{
    var count;
    var index;
    var begin = 0;
    var decLength;
    var decPoint;
    var interestRate;
    var iRate;
    var len;

    interestRate= eval("document.forms[0]."+intRate);

    if(!isEmptyObjValue(interestRate.value))
    {
        iRate = getValInStdFormat(interestRate.value);

        if(!isNaN(iRate))
        {
            iRate =fnTrim(iRate);
            len =iRate.length;
            if((iRate.charAt(0) == "+") || (iRate.charAt(0) == "-"))
            {
                alert(finbranchResArr.get("FAT001210"));
                interestRate.focus();
                return false;
            }
            if(iRate >= 1000)
            {
                alert(finbranchResArr.get("FAT001211"));
                interestRate.focus();
                return false;
            }

            if(eval(iRate) == 0)
            {
                interestRate.value =getValInCustomFormat("0.000000");
				    return;
            }
            decPoint = iRate.indexOf(".");
            if(decPoint!= -1)
            {
                decLength = len - (decPoint + 1);
            }
            else
            {
                decLength = 0;
            }
            if(decLength >6)
            {
                alert(finbranchResArr.get("FAT001212"));
                interestRate.focus();
                return false;
            }
            count = 6 - decLength;
            if(count <= 6)
            {
                if(decPoint != -1)
                {
                    for(index=0;index<count;index++)
                    {
                        iRate =iRate + "0";
                    }
                }
                else
                {
                    iRate = iRate + ".000000";
                }

                if(iRate.charAt(0)==".")
                {
                    iRate = "0" + iRate;
                }
                interestRate.value = getValInCustomFormat(iRate);
				}
        }
        else
        {
            alert(finbranchResArr.get("FAT001213"));
            interestRate.focus();
            return false;
        }

    }
}
function negIntRateFillPrecision(intRate)
{
    var count;
    var index;
    var begin = 0;
    var decLength;
    var decPoint;
    var interestRate;
    var iRate;
    var len;

    interestRate= eval("document.forms[0]."+intRate);

    if(!isEmptyObjValue(interestRate.value))
    {
        iRate = getValInStdFormat(interestRate.value);

        if(!isNaN(iRate))
        {
            iRate =fnTrim(iRate);
            len =iRate.length;
            if(iRate.charAt(0) == "+")
            {
                alert(finbranchResArr.get("FAT003238"));
                interestRate.focus();
                return false;
            }
			if(iRate > 100 || iRate < -100)
			{
				alert(finbranchResArr.get("FAT005668"));
				interestRate.focus();
				return false;
			}

            if(eval(iRate) == 0)
            {
                interestRate.value =getValInCustomFormat("0.000000");
				    return;
            }
            decPoint = iRate.indexOf(".");
            if(decPoint!= -1)
            {
                decLength = len - (decPoint + 1);
            }
            else
            {
                decLength = 0;
            }
            if(decLength >6)
            {
                alert(finbranchResArr.get("FAT001212"));
                interestRate.focus();
                return false;
            }
            count = 6 - decLength;
            if(count <= 6)
            {
                if(decPoint != -1)
                {
                    for(index=0;index<count;index++)
                    {
                        iRate =iRate + "0";
                    }
                }
                else
                {
                    iRate = iRate + ".000000";
                }

                if(iRate.charAt(0)==".")
                {
                    iRate = "0" + iRate;
                }
                interestRate.value = getValInCustomFormat(iRate);
				}
        }
        else
        {
            alert(finbranchResArr.get("FAT001213"));
            interestRate.focus();
            return false;
        }

    }
}


/**
 * This function assigns values to ui fields of a date array
 *
 * @param eleName   The name of the array element
 *
 * @arrDate     The array of values to be asigned
 *
 **/
function fnAssignArrayUIDates(eleName,arrDate)
{
    var name =  eleName+"_ui";
	elements = document.getElementsByName(name);
    for (i=0; i< elements.length; i++)
    {
        elements[i].value = arrDate[i];
    }
}

function fnGetMonthDesc(monthCode)
{
	var val = parseInt(monthCode, 10);
	switch(val) {
		case 1:		return finbranchResArr.get("FAT001948");
		case 2:		return finbranchResArr.get("FAT001949");
		case 3:		return finbranchResArr.get("FAT001950");
		case 4:		return finbranchResArr.get("FAT001951");
		case 5:		return finbranchResArr.get("FAT001952");
		case 6:		return finbranchResArr.get("FAT001953");
		case 7:		return finbranchResArr.get("FAT001954");
		case 8:		return finbranchResArr.get("FAT001955");
		case 9:		return finbranchResArr.get("FAT001956");
		case 10:	return finbranchResArr.get("FAT001957");
		case 11: 	return finbranchResArr.get("FAT001958");
		case 12: 	return finbranchResArr.get("FAT001959");
		default:	return "";
	}
}

function fnIsValidEmailId(objForm)
{
	if(!fnValidateEmailId(objForm.custEmailId))
	{
		return false;
	}
return true;
}

function fnValidateEmailId(obj)
{   

var str = obj.value; 
var at="@"
var dot="."
var scol=";" 
var scomma="," 
var lat=str.indexOf(at)
var lat2=str.indexOf(at,lat+1);
var lstr=str.length
var ldot=str.indexOf(dot)
var ldot2=str.indexOf(dot,ldot+1);
var len = str.length;
var invalidChars = /[!`#$%^&*()?<>~]/;
if( len > 0)
{
	if(invalidChars.test(str) == true)
	{
		return false;

    	}
	if (str.indexOf(at)==-1){

	    return false;
	}

	if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr)
	{
		return false;
	}

	if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr)
	{
		return false;
	}

	if (str.indexOf(at,(lat+1))!=-1)
	{
		if((str.indexOf(scomma)==-1) && (str.indexOf(scol)==-1)) 
			return false; 

		if((lat2 > ldot2) || (str.indexOf(dot,(lat2+2))==-1) || (str.substring(lat2-1,lat2)==dot || str.substring(lat2+1,lat2+2)==dot)) 
			return false; 
	}

	if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){

		return false;
	}

	if (str.indexOf(dot,(lat+2))==-1)
	{
		return false;
	}

	if (str.indexOf(" ")!=-1)
	{
		return false;
	}
}
return true
}

/**
 * This function adds the time difference between the user Time Zone and the
 * DB Standard Time Zone to the original Display dateTime
 * @param 	origDateTime			The original display DateTime
 * @param 	time					The time differnce between the user time zone
 *								    and the DB Standard time zone
 * @return	finalDate				The final DateTime
 **/
function fnAddTimeToDate(origDateTime,time)
{
	var dateObj;
	var date;
	var month;
	var year;
	var hour;
	var min;
	var sec;
	var finalDate;
	var timeInMin;

	origDateTime = fnTrim(origDateTime);
	time = fnTrim(time);

	/* Validate the input date string length and the input time string length */
	/* Assuming the origDateTime to be in this format DD-MM-YYYY HH24:MI:SS */
	if(origDateTime.length != 19 || time.length != 6)
		return origDateTime;

	/* Validate the time string for this format */
	/* The timediff is assumed to in this format  +/-HH:MI*/
	else if((time.charAt(0) != "+" && time.charAt(0) != "-") || time.charAt(3) != ":")
		return origDateTime;

	/* Extract all the input date string components */
	year = origDateTime.substring(6,10);
	month = origDateTime.substring(3,5)-1;/* javascript has months from 0-11*/
	date = origDateTime.substring(0,2);
	hour = origDateTime.substring(11,13);
	min = origDateTime.substring(14,16);
	sec = origDateTime.substring(17,19);

	/* Convert the time string to minutes */
	timeInMin = parseInt(time.substring(1,3),10)*60 + parseInt(time.substring(4,6),10);

	/* Create a new date object with the extracted input date string components*/
	dateObj = new Date(year,month,date,hour,min,sec,0);

	/* Get the minutes component of the dateObj,add time in minutes and set
	   the new minutes component to the dateObj */
	if(time.substring(0,1) == '+')
	{
		dateObj.setMinutes(dateObj.getMinutes() + timeInMin);
	}
	else
	{
		dateObj.setMinutes(dateObj.getMinutes() - timeInMin);
	}

	/* recreate the date string here */
	{
		/* Get the date component from the dateObj and format it */
		date = dateObj.getDate();
		if(date<10)
		{
			date = '0' + date;
		}
		/* Get the month component from the dateObj and format it */
		month = dateObj.getMonth() + 1;/* javascript has months from 0-11*/
		if(month<10)
		{
			month = '0' + month;
		}
		year = dateObj.getFullYear();
		/* Get the hour component from the dateObj and format it */
		hour = dateObj.getHours();
		if(hour<10)
		{
			hour = '0' + hour;
		}
		/* Get the minute component from the dateObj and format it */
		min = dateObj.getMinutes();
		if(min<10)
		{
			min = '0' + min;
		}
		/* Get the seonds component from the dateObj and format it */
		sec = dateObj.getSeconds();
		if(sec<10)
		{
			sec = '0' + sec;
		}
	}

	/* Add the formatted components of the dateObj to get the finalDate */
	finalDate = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec ;

	return finalDate;
}

function fnSetFocusOnFirstField_postonload()
{
	var frmElements = document.forms[0].elements;
	var grpNm = sGroupName;
    var totalElements = frmElements.length;

	if(currentFocusId != null && currentFocusId != undefined)
	{
		 for(i = 0; i < totalElements; i++)
		 {
			if(((frmElements[i].name).indexOf(grpNm) != -1) && (frmElements[i].id == currentFocusId))
			{
				return true;
			}
		 }
	}

    for(i = 0; i < totalElements; i++)
	{
		if(((frmElements[i].name).indexOf(grpNm) != -1) &&
		((frmElements[i].type == "text" && !frmElements[i].readOnly && !frmElements[i].disabled)
		|| (frmElements[i].type == "select-one" && !frmElements[i].disabled)
		|| (frmElements[i].type == "textarea" && !frmElements[i].disabled)
		|| (frmElements[i].type == "radio" && !frmElements[i].disabled)))
		{
			if(frmElements[i].type == 'radio')
			{
				frmElements[i].id+'[0].focus()';
				return true;
			}
			frmElements[i].focus();
			return true;
		}

	}
	initFocusHandler();
}

function isLocalCalendarBase(addtnlCalBase)
{
    if((!fnIsNull(addtnlCalBase))&& (addtnlCalBase != "") && (addtnlCalBase != "00"))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function getCalBaseDesc(addtnlCalBase)
{
    var desc = "";
    switch (addtnlCalBase){
        case '01':
            desc= "HIJRI";
            break;
        case '02':
            desc= "BUDDHA";
            break;
        case '00':
        case '':
            desc= "GREGORIAN";
            break;
        default:
            desc = addtnlCalBase;
            break;
    }

        return  desc;
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

/*Function to convert date between hijri, gregorian and buddha dates*/
function convertBetweenDate (stdDateString)
{
    if (calbase == "00" && !isGregDate(stdDateString) && isHijDate(stdDateString) && dateInputCal == "00+01")
    {
        stdDateString = convertHijToGreg(stdDateString);
    }
    if (calbase == "01" && !isHijDate(stdDateString) && isGregDate(stdDateString) && dateInputCal == "00+01")
    {
	stdDateString = convertGregToHij(stdDateString);
    }
    if (calbase == "02" && !isBuddhaDate(stdDateString) && isGregDate(stdDateString) && dateInputCal == "02")
    {
        stdDateString = convertGregToBuddha(stdDateString);
    }
    return(stdDateString);
}

/* Function returns true if the entered date is in Gregorian Format. Else returns False. */
function isGregDate(stdDateString)
{
    var displayStr = stdDateString;
    var a_strDate=new Array();

    if(displayStr.indexOf("/") != -1)
            a_strDate = displayStr.split("/");
    if(displayStr.indexOf("-") != -1)
            a_strDate = displayStr.split("-");
    if(displayStr.indexOf(".") != -1)
            a_strDate = displayStr.split(".");

    if ((a_strDate[2] >= 1400)&&(a_strDate[2] <= 2099))
        return true;
    else
        return false;
}

function validateDateConvWithNewCalBase(objForm, newCalBase) {
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
			if ((datatype == 'fdate') || (datatype == 'datetime') || (datatype == 'date'))	{
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

function convertBetweenNewDate (stdDateString,newCalBase)
{
    if (newCalBase == "01" && !isHijDate(stdDateString) && isGregDate(stdDateString))
    {
        stdDateString = convertGregToHij(stdDateString);
    }
	return(stdDateString);
}

/* Function to convert date into Gregorian Format from Buddha Format. */
function convertBuddhaToGreg(stdDateString)
{
	var displayStr = stdDateString;
	var a_strDate=new Array();

	if(displayStr.indexOf("/") != -1)
		a_strDate = displayStr.split("/");
	if(displayStr.indexOf("-") != -1)
		a_strDate = displayStr.split("-");
	if(displayStr.indexOf(".") != -1)
		a_strDate = displayStr.split(".");

	a_strDate[2] = parseInt(a_strDate[2]) - 543;
	return a_strDate[0] + "-" + a_strDate[1] + "-" + a_strDate[2];
}

/* Function calls the corresponding conversion function depending on the calendar base. */
function convertDateToGreg(stdDateString)
{
	if(calbase =="01" && isHijDate(stdDateString))
		stdDateString  = convertHijToGreg(stdDateString);
	else if(calbase =="02" && isBuddhaDate(stdDateString))
		stdDateString  = convertBuddhaToGreg(stdDateString);
	else if(!isHijDate(stdDateString) && !isGregDate(stdDateString) && !isBuddhaDate(stdDateString))
		{
			aFlag = "N";
			alert(finbranchResArr.get("FAT000081"));
 		}
	return(stdDateString);
}

function switchTimeZone(timezone)
{
	TOGGLE_TIME_ZONE = timezone;
}
/*
* function 		: checkIFramePresent()
* Description	: This function is used to check the presence of the device frame
*		  		  and if not present ,creates and call the DeviceServlet in that frame
*
*/
function checkIFramePresent(devType)
{
	if(window.parent.DEVICEFRAME.frames[devType]!= undefined)
		return true;
	else
		return false;
}

/*
* function 		: PrintDeviceIFrame()
* Description	: This function is used to create the  device related frame
*		 		  inside the DEVICEFRAME created in paralled to
*		 		  finbranch/fincrv frame
* Author 		: Ketaki.Gujarathi
*/

function printDeviceIFrame(deviceType)
{
	if (window.parent.DEVICEFRAME != undefined)
		{
			if(!checkIFramePresent(deviceType))
			{
				var bUrl = getBaseUrl();
				var deviceUrl = bUrl + finContextPath +"/DeviceServlet?deviceType="+ deviceType;
				printDeviceDiv(deviceType,deviceUrl);
			}

		}
}

/*
* function 		: printDeviceDiv()
* Description	: This function  is used to create the IFrames
*
*/
function printDeviceDiv(devType,url)
{
	var dv = window.parent.DEVICEFRAME.document.createElement('div'); // create dynamically div tag
	dv.setAttribute('id',devType+"_div");       //give id to it

	//set the html content inside the div tag
	dv.innerHTML="<iframe id='"+devType+"' src='"+url+"'/>";
	window.parent.DEVICEFRAME.document.body.appendChild(dv);

}

function loadCoreAppletIFrame()
{
    if (window.parent.coreapplet != undefined)
    {
        var bUrl = getBaseUrl();
        var loadAppURL = bUrl + finContextPath +"/applet/coreapplet.jsp?rtId="+rtId;
        loadCoreAppletDiv(loadAppURL);
    }
}

function loadCoreAppletDiv(url)
{

        if(window.parent.coreapplet.frames.length >= 1 &&
                        window.parent.coreapplet.frames['coreapplet'] != undefined &&
                        typeof window.parent.coreapplet.frames['coreapplet'] != "undefined" &&
                        typeof window.parent.coreapplet.frames['coreapplet'] != "unknown" &&
                        typeof window.parent.coreapplet.frames['coreapplet'].coreapplet != "undefined" &&
                        typeof window.parent.coreapplet.frames['coreapplet'].coreapplet != "unknown")
                   return;

        window.parent.coreapplet.location.href=url;
}

/*
* function      : loadAppletIFrame()
* Description   : This function is used to create the  printer related frame
*                 inside the DEVICEFRAME created in paralled to
*                 finbranch/fincrv frame
*/

function loadAppletIFrame()
{
  if(silentPrntReqd == "Y")
  {
	if(jnlpMode == "N")
	{
		if (window.parent.DEVICEFRAME != undefined)
        {
            var bUrl = getBaseUrl();
            var loadAppURL = bUrl + finContextPath +"/silentPrint/loadApplet.jsp";
            loadAppletDiv(loadAppURL);
        }
	}
	else
	{
		if (window.parent.DEVICEFRAME != undefined)
		{
			loadJnlpDiv();
		}
	}
  }
}

/*
* function      : loadAppletDiv()
* Description   : This function  is used to create the IFrames for loading
*                 printer applet
*
*/
function loadAppletDiv(url)
{

	if(window.parent.DEVICEFRAME.frames.length >= 1 &&
			window.parent.DEVICEFRAME.frames['printApp'] != undefined && 
			typeof window.parent.DEVICEFRAME.frames['printApp'] != "undefined" &&
			typeof window.parent.DEVICEFRAME.frames['printApp'] != "unknown" &&
			typeof window.parent.DEVICEFRAME.frames['printApp'].PrinterAppl != "undefined" && 
			typeof window.parent.DEVICEFRAME.frames['printApp'].PrinterAppl != "unknown") 
                   return;

    var dv = window.parent.DEVICEFRAME.document.createElement('div');
    dv.setAttribute('id',"printApp_div");

    dv.innerHTML="<iframe name='printApp' id='printApp' src='"+url+"'/>";
    window.parent.DEVICEFRAME.document.body.appendChild(dv);

}

/*
* function      : loadJnlpDiv()
* Description   : This function  is used to create the IFrames for loading
*                 printer feature
*
*/
function loadJnlpDiv()
{
	if(window.parent.DEVICEFRAME.frames.length >= 1 &&
		window.parent.DEVICEFRAME.frames['printApp'] != undefined &&
        typeof window.parent.DEVICEFRAME.frames['printApp'] != "undefined" &&
        typeof window.parent.DEVICEFRAME.frames['printApp'] != "unknown")
        return;

    var dv = window.parent.DEVICEFRAME.document.createElement('div');
    dv.setAttribute('id',"printApp_div");

    dv.innerHTML="<iframe name='printApp' id='printApp' src=''/>";
    window.parent.DEVICEFRAME.document.body.appendChild(dv);
}

/*
* function      : fireSilentPrint()
* Description   : This function  is used to fire print on DEVICEFRAME using JNLP
*
*/
function fireSilentPrint(data, font, style, size, xmargin, ymargin){
	var isSuccess = true;
    var height;

    font = ((null != font) && ("null" != font) && ("" != font))?font:null;
    style = ((null != style) && ("null" != style) && ("" != style))?style:-1;
    size = ((null != size) && ("null" != size) && ("" != size))?size:-1;
	
	height=287;
    if(xmargin == undefined || xmargin == null){
		xmargin=15;
	}
	if(ymargin == undefined || ymargin == null){
		ymargin=8;
        height=277;
	}
	
	if(jnlpMode == "N")
	{
		if(window.parent.DEVICEFRAME != undefined && window.parent.DEVICEFRAME.frames['printApp'] != undefined && typeof window.parent.DEVICEFRAME.frames['printApp'] != "undefined" && typeof window.parent.DEVICEFRAME.frames['printApp'] != "unknown" && typeof window.parent.DEVICEFRAME.frames['printApp'].PrinterAppl!= "undefined" && typeof window.parent.DEVICEFRAME.frames['printApp'].PrinterAppl!= "unknown")
		{
			isSuccess = window.parent.DEVICEFRAME.frames['printApp'].document.getElementById('PrinterAppl').print(data, font, style, size, xmargin, ymargin, height);
		}
		else{
			alert("Silent Print is not enabled");
			isSuccess = false;
		}
	}
	else
	{
		if(window.parent.DEVICEFRAME != undefined && window.parent.DEVICEFRAME.frames['printApp'] != undefined && typeof window.parent.DEVICEFRAME.frames['printApp'] != "undefined" && typeof window.parent.DEVICEFRAME.frames['printApp'] != "unknown")
		{
			var bUrl = getBaseUrl();
			var loadJnlpURL = bUrl + finContextPath +"/silentPrint/generateJnlp.jsp?style="+style+"&size="+size+"&xmargin="+xmargin+"&ymargin="+ymargin+"&height="+height+"&rtId="+rtId;
			window.parent.DEVICEFRAME.document.getElementById('printApp').src = loadJnlpURL;
		}
		else{
			alert("Silent Print is not enabled");
			isSuccess = false;
		}
	}
    return isSuccess;
}

function localPrintTimer()
{
	if(jnlpMode == "N")
		return true;

	var isAllow = true;
	currDate = new Date();
	currTime = Date.parse(currDate.toString());
	
	var prevTime = getSValuePrint("Time");
		
	if(prevTime == null || prevTime == "null")
	{
		setSValuePrint("Time|"+currTime);
	}
	else
	{
		var diffCurrPrevTime = currTime - prevTime;
		if(diffCurrPrevTime < 	silentPrintWaitingTime)
		{
			var timeLeft = (silentPrintWaitingTime - diffCurrPrevTime)/1000;
			alert("Local print is already fired, re-click after ["+timeLeft+"]sec");
			isAllow = false;
		}
		else{
			setSValuePrint("Time|"+currTime);
		}
	}
	
	return isAllow;
}

function getClient_ip(SSO,SSODomName)
{
	var frm = document.forms [0];
	var dom_to_set =SSODomName;
	var SSO = (dom_to_set != "") && SSO;
	if (SSO) {
		document.domain = dom_to_set;
	}
	
	if(window.parent.getLoginFrame != undefined)
	{
		if (window.parent.getLoginFrame() != undefined)
		{
			var IP = window.parent.getLoginFrame().getClientIP();	
			frm.ipAddress.value=IP;	
		}
	}	
	var url = window.location.href;
	url = jsUtil.formatUrl(url);
	frm.action=url;
	frm.method="POST";
	frm.submit ();
	
}

function getPageName (ctrlName)
{
   var cName = ctrlName;
   var sName = cName.split ("/");
   var mName = sName[0];
   return mName;
}

function CallSSOFunctionForModalDailogue(wndRef)
{
	var ArrString   =   new Array();
	if(window.parent.getLoginFrame != undefined)
	{
		if (window.parent.getLoginFrame() != undefined)
			ArrString   = window.parent.getLoginFrame().validateAuthorizerWithWnd(wndRef,"Auth_User_Screen",ssoAuthCallBack);
	}	
	return  ArrString;
}

function fnDisableFormControlsForProduct(objForm)
{
if( (objForm.Validate != undefined) && (objForm.Validate != null) ){
            objForm.Validate.disabled = true;
        }

}

function formUrl(sUrl)
{
	if(!window.showModalDialog)
	{
		genericCallBackFn="formUrl_genericCallBack";
       /* In case the formurl is getting called from inquiry details page,
         * appropriate callback should be set based on the call back called in
         * the inquiry menu*/
        callBackFn="formUrl_genericCallBack";
	}
    dWidth=60;
	dHeight=35;
    pWidth=900;
    pHeight=415;
	var currLoc =   window.location;
    childURL    =   "?actionCode=VIEWMOREDETAILS&dynURL="+ escape(sUrl);

    var hUrlArr =   currLoc.href.split("?");
	var ctrlUrl = formUrlForCurrGroup(hUrlArr[0]);

    if(ctrlUrl == "" || ctrlUrl == undefined)
    	ctrlUrl = hUrlArr[0];

    url =   ctrlUrl+childURL;
    retVal  =   popModalWindowVar(url,CURR_GROUP_NAME,pWidth,pHeight,dWidth,dHeight);
	if(window.showModalDialog)
    	sendDataForRewind("../inquiry/inquiry_ctrl.jsp?actionCode=CLOSE");
}
function formUrl_genericCallBack(retVal)
{
	sendDataForRewind("../inquiry/inquiry_ctrl.jsp?actionCode=CLOSE");
}

function formDetailsUrl(sUrl)
{
	if(!window.showModalDialog)
		{
			callBackFn="showIntDtlsDrCr_genericCallBack";
		} 
		var bUrl = getBaseUrl();
		var tUrl = (bUrl + finContextPath + "/inquiry/"+"inquiry_ctrl.jsp");
		
		var currLoc	=	window.location; 
		if (currLoc != tUrl)
		{
			currLoc = tUrl;
		}
		childURL    =   "?actionCode=VIEWMOREDETAILS&dynURL="+ escape(sUrl);
		url =   currLoc+childURL;
		
		retVal	=	popModalWindowVar(url,sGroupName,950,750,60,65);
		
		if(window.showModalDialog)
			sendDataForRewind("../inquiry/inquiry_ctrl.jsp?actionCode=CLOSE");
}

function showIntDtlsDrCr_genericCallBack(retVal)
{
	sendDataForRewind("../inquiry/inquiry_ctrl.jsp?actionCode=CLOSE");
}
function showIntDtlsDr(rowNo,inputFields)
{
    var values = getValueOfArgument(rowNo,inputFields);
    tmp = values.split("|");
    int_tbl_code = tmp[0];
    int_ver_num= tmp[1];
    C_crncy_code= tmp[2];
    tvs_ivs_flag = tmp[3];
    pWidth=60;
    pHeight=35;

    if(tvs_ivs_flag=='T')
    {
	alert(finbranchResArr.get("FAT003907"));
    }

    if(tvs_ivs_flag=='L')
    {
    sUrl = "../inquiry/inquiry_ctrl.jsp?mo=LAVS&actionCode=SUBMIT&lavs.tbl_code="+escape(int_tbl_code)+"&lavs.crncy_code="+C_crncy_code+"&lavs.ver_num="+int_ver_num;
    formUrl(sUrl);
    }

    if(tvs_ivs_flag=='I')
    {
    sUrl = "../inquiry/inquiry_ctrl.jsp?mo=DIVS&actionCode=SUBMIT&divs.tbl_code="+escape(int_tbl_code)+"&divs.crncy_code="+C_crncy_code+"&divs.ver_num="+int_ver_num;
    formDetailsUrl(sUrl);
    }

    if(tvs_ivs_flag=='P')
    {
    sUrl = "../inquiry/inquiry_ctrl.jsp?mo=BIVS&actionCode=SUBMIT&bivs.tbl_code="+escape(int_tbl_code)+"&bivs.crncy_code="+C_crncy_code+"&bivs.ver_num="+int_ver_num;
    formUrl(sUrl);
    }


}

function showIntDtlsCr(rowNo,inputFields)
{
    var values = getValueOfArgument(rowNo,inputFields);
    tmp = values.split("|");
    int_tbl_code = tmp[0];
    int_ver_num= tmp[1];
    C_crncy_code= tmp[2];
    tvs_ivs_flag = tmp[3];
    pWidth=60;
    pHeight=35;

    if(tvs_ivs_flag=='L')
    {
	alert(finbranchResArr.get("FAT003906"));
    }
    if(tvs_ivs_flag=='P')
    {
	alert(finbranchResArr.get("FAT003906"));
    }

    if(tvs_ivs_flag=='I')
    {
    sUrl = "../inquiry/inquiry_ctrl.jsp?mo=CIVS&actionCode=SUBMIT&civs.tbl_code="+escape(int_tbl_code)+"&civs.crncy_code="+C_crncy_code+"&civs.ver_num="+int_ver_num;
    formDetailsUrl(sUrl);
    }

    if(tvs_ivs_flag=='T')
    {
    sUrl = "../inquiry/inquiry_ctrl.jsp?mo=HTVS&actionCode=SUBMIT&htvs.tbl_code="+escape(int_tbl_code)+"&htvs.crncy_code="+C_crncy_code+"&htvs.ver_num="+int_ver_num;
    formUrl(sUrl);
    }

}

function showAlertForMenuConversio(rowNo)
{
    alert("Menu Under Conversion");
}

function showBkdciExplodeDtls(rowNo,inputFields)
{
	var values = getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");

	var url = null;
	var flagVal = "Y" ;

	inward_outward_ind = tmp[0];
	inland_frng_flg	   = tmp[1];
	cifId   = tmp[2];
	dcNumber = tmp[3];
	solId = tmp[4];
	verifiedFlg = tmp[5];

	if(chkFlgForIcfg(verifiedFlg,flagVal))
	{
		if(inward_outward_ind =="O" && inland_frng_flg=="F" )
		{
			url = "../impdci/impdci_ctrl.jsp?rtId="+rtId+"&mo=IMPDCI&actionCode=EXPLODE&pageName=impdci_general&impdci.dcNo="+dcNumber+"&impdci.solId="+solId+"&impdci.cifId="+cifId+"";
			document.forms[0].calledMenu.value=url;
			doSubmitForm("INVOKE_GROUP_RECORD");
		}
		else if(inward_outward_ind =="I" && inland_frng_flg=="F")
		{
			url = "../expdci/expdci_ctrl.jsp?rtId="+rtId+"&mo=EXPDCI&actionCode=EXPLODE&expdci.dcNo="+dcNumber+"&expdci.solId="+solId+"&expdci.cifId="+cifId+"";
			document.forms[0].calledMenu.value=url;
			doSubmitForm("INVOKE_GROUP_RECORD");
		}
		else if(inward_outward_ind =="O" && inland_frng_flg=="I")
		{
			url = "../owdci/owdci_ctrl.jsp?rtId="+rtId+"&mo=OWDCI&actionCode=EXPLODE&pageName=owdci_general&owdci.dcNo="+dcNumber+"&owdci.solId="+solId+"&owdci.cifId="+cifId+"";
			document.forms[0].calledMenu.value=url;
			doSubmitForm("INVOKE_GROUP_RECORD");
		}
		else if(inward_outward_ind =="I" && inland_frng_flg=="I")
		{
			url = "../indci/indci_ctrl.jsp?rtId="+rtId+"&mo=INDCI&actionCode=EXPLODE&pageName=indci_general&indci.dcNo="+dcNumber+"&indci.solId="+solId+"&indci.txtcifId="+cifId+"";
			document.forms[0].calledMenu.value=url;
			doSubmitForm("INVOKE_GROUP_RECORD");
		}
		else
		{
			alert(finbranchResArr.get("FAT003271"));
		}
	}
}

function showBkfbiExplodeDtls(rowNo,inputFields)
{
	var values = getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");

	var url = null;
	var flagVal = "Y" ;

	inward_outward_ind = tmp[0];
	cifId   = tmp[1];
	billId = tmp[2];
	solId = tmp[3];
	verifiedFlg = tmp[4];

	if(chkFlgForIcfg(verifiedFlg,flagVal))
	{
		if(inward_outward_ind == "O")
		{
 			url = "../impbili/impbili_ctrl.jsp?rtId="+rtId+"&mo=IMPBILI&actionCode=EXPLODE&pageName=impbili_general&impbili.billId="+billId+"&impbili.solId="+solId+"&impbili.cifId="+cifId+"";
			document.forms[0].calledMenu.value=url;
			doSubmitForm("INVOKE_GROUP_RECORD");
		}
		else if(inward_outward_ind == "I")
		{
			url = "../expbili/expbili_ctrl.jsp?rtId="+rtId+"&mo=EXPBILI&actionCode=EXPLODE&pageName=expbili_general&expbili.billId="+billId+"&expbili.solId="+solId+"&expbili.cifId="+cifId+"";
			document.forms[0].calledMenu.value=url;
			doSubmitForm("INVOKE_GROUP_RECORD");
		}
		else
		{
			alert(finbranchResArr.get("FAT003271"));
		}
	}
}

function showBkfwciExplodeDtls(rowNo,inputFields)
{
	var values = getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");

	var url = null;
	var flagVal = "Y" ;

	contractNo  = tmp[0];
	cifId	    = tmp[1];
	solId       = tmp[2];
	verifiedFlg = tmp[3];

	if(chkFlgForIcfg(verifiedFlg,flagVal))
	{
		url = "../fwcnti/fwcnti_ctrl.jsp?rtId="+rtId+"&mo=FWCNTI&actionCode=EXPLODE&pageName=fwcnti_general&fwcnti.contractNo="+contractNo+"&fwcnti.solId="+solId+"&fwcnti.cifId="+cifId+"";
		document.forms[0].calledMenu.value=url;
		doSubmitForm("INVOKE_GROUP_RECORD");
	}
}


function showBkibiExplodeDtls(rowNo,inputFields)
{
	var values = getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");

	var flagVal = "V" ;
	var url = null;

	billId      = tmp[0];
	cifId	    = tmp[1];
	solId       = tmp[2];
	verifiedFlg = tmp[3];

	if(chkFlgForIcfg(verifiedFlg,flagVal))
	{
		url = "../inbilli/inbilli_ctrl.jsp?rtId="+rtId+"&mo=INBILLI&actionCode=EXPLODE&pageName=inbilli_general&inbilli.billId="+billId+"&inbilli.solId="+solId+"&inbilli.cifId="+cifId+"";
		document.forms[0].calledMenu.value=url;
		doSubmitForm("INVOKE_GROUP_RECORD");
	}
}

function chkFlgForIcfg(flagVar,flagVal)
{
	if(flagVar != flagVal)
	{
		alert("Record is unverified");
		return false;
	}
	return true;
}

function showLndiExplodeDetails(rowNo,inputFields)
{

	var values =getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");

	var url = null;

	var cifId            =tmp[0];
	var lim_prefix       =tmp[1];
	var lim_suffix       =tmp[2];
    var product_type	 =tmp[3];

	var entity_id        =tmp[4];
	var sol_id           =tmp[5];
	var ccy_code         =tmp[6];
	var locExplMenuName = null;
	
	if ((product_type=="Sublimit") && (cifId == null || cifId == ""))
	{
		//alert(finbranchResArr.get("FAT005097")); 
		alert("Limit does not belong to any Cif Id.Further explode not possible"); 
		return;
	}
	if(product_type=="Sublimit")
	{
		url = "../inquiry/inquiry_ctrl.jsp?mo=LNDI&actionCode=SUBMIT&lndi.cif_id="+cifId+"&lndi.lim_prefix="+lim_prefix+"&lndi.lim_suffix="+lim_suffix;
		formUrl(url);

	}
else
{
	/* This check is mandatory at the beginning as explode should not be allowed from a pop-up for entities*/
	if (isSearchMode =='true')
	{
		alert('Further Explode is not possible/avaliable. Please check in HLNDI menu.');
		return;
	}

	if(product_type=="Outward BG")
	{
		locExplMenuName = "OGM";
		explodeToMenuOption(locExplMenuName,"solId="+sol_id+"|bgType="+''+"|ccy="+ccy_code+"|cifId="+cifId+"|bgSrlNum="+entity_id,"funcCode=I");
	}
	if(product_type=="Inward BG") 
    { 
		locExplMenuName = "IGM"; 
		explodeToMenuOption(locExplMenuName,"solId="+sol_id+"|bgType="+''+"|ccy="+ccy_code+"|cifId="+cifId+"|bgSrlNum="+entity_id,"funcCode=I"); 
    } 
	if(product_type=="Outward DC")
	{
		locExplMenuName = "ODCM";
		explodeToMenuOption(locExplMenuName,"solId="+sol_id+"|odcmNum="+entity_id+"|","funcCode=I");
	}
	if(product_type=="Inward DC")
	{
		locExplMenuName = "IDCM";
		explodeToMenuOption(locExplMenuName,"solId="+sol_id+"|idcmNum="+entity_id+"|","funcCode=I");
	}
	if(product_type=="Savings Account")
	{
		locExplMenuName = "HACM";
		explodeToMenuOption(locExplMenuName,"acctNo="+entity_id,"funcCode=I");
	}
	if(product_type=="Current Account")
	{
		locExplMenuName = "HACM";
		explodeToMenuOption(locExplMenuName,"acctNo="+entity_id,"funcCode=I");
	}
	if(product_type=="Cash Credit Account")
	{
		locExplMenuName = "HACM";
		explodeToMenuOption(locExplMenuName,"acctNo="+entity_id,"funcCode=I");
	}
	if(product_type=="Overdraft Account")
	{
		locExplMenuName = "HACM";
		explodeToMenuOption(locExplMenuName,"acctNo="+entity_id,"funcCode=I"); 
	}
	if(product_type=="Retail Loan Account")
	{
		locExplMenuName = "HACMLA";
		explodeToMenuOption(locExplMenuName,"acctNo="+entity_id,"funcCode=I");
	}
	if(product_type=="Commercial Lending Account")
	{
		locExplMenuName = "HACMCL"; 
		explodeToMenuOption(locExplMenuName,"acctNo="+entity_id,"funcCode=I"); 
	}
	if(product_type=="Packing Credit Account")
	{
		locExplMenuName = "ACMPS"; 
		explodeToMenuOption(locExplMenuName,"AcctId="+entity_id,"funcCode=I"); 
	}
	if(product_type=="Bill Account")
	{
		locExplMenuName = "HACMBP";
                explodeToMenuOption(locExplMenuName,"AcctId="+entity_id,"funcCode=I");	
	}
	if(product_type=="Foreign Bills")
	{
		locExplMenuName = "HACMBP"; 
                explodeToMenuOption(locExplMenuName,"AcctId="+entity_id,"funcCode=I");	
	}
	if(product_type=="Forward Contract")
	{
		locExplMenuName = "MNTFWC"; 
		explodeToMenuOption(locExplMenuName,"solId="+sol_id+"|FwdCntrctType="+''+"|FwdCntrctNo="+entity_id,"funcCode=I"); 
	}
	if(product_type=="Buyers Credit")
    {
        locExplMenuName = "MBCO";
        explodeToMenuOption(locExplMenuName,"solId="+sol_id+"|buyersCreditType="+''+"|buyersCreditNo="+entity_id,"funcCode=I");
    } 			   
}
}

function showSubVerDetails(rowNo,inputFields)
{
	var values =getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");
	var acid=tmp[0];
	var subsidy_code=tmp[1];
	var ind=tmp[2];

	if('I' == ind)
	{
		sUrl = "../inquiry/inquiry_ctrl.jsp?mo=LASDIVER&actionCode=SUBMIT&lasdiver.subsidyCode="+subsidy_code+"&lasdiver.acctId="+acid;
		formUrl(sUrl);
	}
	else
	{
        sUrl = "../inquiry/inquiry_ctrl.jsp?mo=LAPSDH&actionCode=SUBMIT&lapsdh.acct_num="+acid;
        formUrl(sUrl);
	}
}

function showSubsidyDtls(rowNo,inputFields)
{
	var values =getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");
	var subsidy_code=tmp[0];
	var acid=tmp[1];
	var ind=tmp[2];

	if('I' == ind)
	{
		sUrl = "../inquiry/inquiry_ctrl.jsp?mo=SUBSDYDD&actionCode=SUBMIT&subsdydd.subsidy_code="+subsidy_code+"&subsdydd.acid="+acid;
		formUrl(sUrl);
	}
	else
	{
		alert(finbranchResArr.get("FAT003309"));
	}
}

/*
* function 	: changeCursorStyle()
* Description	: This function changes the cursor style of
*                 of the anchor and image tags to hand in both
*				  IE and mozilla firefox browsers
*/
function changeCursorStyle()
{
	var tagArr = document.getElementsByTagName("img");
	var length = tagArr.length;
	for(i=0;i<length;i++){
		displayHand(tagArr[i]);
	}

	var anchorArr = document.getElementsByTagName("a");
	var anchorlength = anchorArr.length;
	for(j=0;j<anchorlength;j++){
		displayHand(anchorArr[j]);
	}
}

/*
* function 	: setValueToField()
* Description	: This function sets the value from the opened window
*
*/
function setValueToField(ctrl,fldval,calledfrmprt)
{
  	var fld;

	if(calledfrmprt){
		fld = eval("parent.window.opener.document.forms[0]."+ctrl);
	}
	else{
		fld = eval("window.opener.document.forms[0]."+ctrl);
	}

	if(null != fld && undefined != fld){
		fld.value = fldval;
	}
}


function popModalWindowMozillaFrame (sUrl,wName){
	modalWin = window.open(sUrl,wName,"width=875,height=450,modal=yes,left=150,top=40,scrollbars=yes,toolbar=no,menubar=0,resizable=yes,dialog=yes");
	if (modalWin != null && typeof(modalWin) == "string" && modalWin == "TIMEOUT") 
	{
		var logoutParams = new array(1);
		logoutParams[0]  = finConst.FORCED_LOGOUT;
		handleWindowDisplay(finConst.DOLOGOUT,logoutParams);
		return;
	}
}

function getInnerTextValue(fld,optFldIndex)
{
	var fldval;

		if("Microsoft Internet Explorer" == browser_name)
			fldval	= fld[optFldIndex].innerText;
		else
			fldval	= fld[optFldIndex].textContent;
	return fldval;
}

function setInnerTextValue(fld,defaultValue)
{
	if("Microsoft Internet Explorer" == browser_name)
		fld.innerText = defaultValue;
	else
		fld.textContent = defaultValue;
}

function commonfetchXBankAcctDtls(acctId, acctName, solId, ccy, targetBankId, isError, fType)
{

	var acctField = eval('document.forms[0].'+acctId);
	var wReturnDesc = ccy + '|' + solId + '|' + acctName + '|'+ acctId;
	var wReturn = acctId +'|'+'targetBankId';
	var ret;
	
	if( !(fnIsNull(acctField.value)))
	{
		if(!window.showModalDialog)
		{
			acctFieldGeneric = acctField;
			wReturnDescGeneric = wReturnDesc;
			genericCallBackFn_SDS="commonfetchXBankAcctDtls_callBack";
		}

		ret = sendDataToServer('myframe',fType,isError, wReturn, wReturnDesc);
        if(window.showModalDialog)
		{
			if(ret==false)
			{
				if(! fnIsNull(wReturnDesc) && wReturnDesc != undefined)
				{
					var descFldArr=wReturnDesc.split("|");
					if (descFldArr.length > 0){
						for( var i=0;i<descFldArr.length;i++){
							if(descFldArr[i].length > 0 )
							{
								clearDescField(descFldArr[i]);
							}
						}
					}
				}	
				acctField.focus();
				acctField.select();
				return false;
			}
		}
   	}
   	else if(fnIsNull(acctField.value))
	{
		if(! fnIsNull(wReturnDesc) && wReturnDesc != undefined)
		{
			var descFldArr=wReturnDesc.split("|");
			if (descFldArr.length > 0){
				for( var i=0;i<descFldArr.length;i++){
					if(descFldArr[i].length > 0 )
					{
						clearDescField(descFldArr[i]);
					}
				}
			}
		}
		acctField.focus();
	}
    	
}

function commonfetchXBankAcctDtls_callBack(ret)
{
	if(ret == "false")
	{
		if(! fnIsNull(wReturnDescGeneric) && wReturnDescGeneric != undefined)
		{
			var descFldArr=wReturnDescGeneric.split("|");
			if (descFldArr.length > 0){
				for( var i=0;i<descFldArr.length;i++){
					if(descFldArr[i].length > 0 )
					{
						clearDescField(descFldArr[i]);
					}
				}
			}
		}
		acctFieldGeneric.focus();
		acctFieldGeneric.select();
		return false;
	}
}

function commonfetchXBankCif(cifId, custName, targetBankId, isError, fType)
{
	var cifField = eval('document.forms[0].'+cifId);
	var wReturn = cifId +'|'+'targetBankId';

	if (!fnIsNull(cifField.value))
	{
		if(!window.showModalDialog)
		{
			cifFieldGeneric = cifField;
			custNameGeneric = custName;
			callBackFn_SDS="commonfetchXBankCif_callBack";
		}
		var rtn = sendDataToServer('myframe',fType,isError,wReturn,custName);
		if(window.showModalDialog)
		{
			if(rtn==false)
			{
				if(! fnIsNull(custName) && custName != undefined)
				{
					if (custName.length > 0){
						clearDescField(custName);
					}
				}
				cifField.focus();
			}
		}
	}
	else if(fnIsNull(cifField.value))
	{
		if(! fnIsNull(custName) && custName != undefined)
		{
			if (custName.length > 0){
				clearDescField(custName);
			}
		}
	}
	cifField.focus();
}

function commonfetchXBankCif_callBack(rtn)
{
	if(rtn=="false")
	{
		if(! fnIsNull(custNameGeneric) && custNameGeneric != undefined)
		{
			if (custNameGeneric.length > 0){
				clearDescField(custNameGeneric);
			}
		}
		cifFieldGeneric.focus();
	}
}

function RemittanceExplodes(rowNo,inputFields) {
	var url = null;
	var values = getValueOfArgument(rowNo,inputFields);
		tmp = values.split("|");
		in_out_ind = tmp[0];
		remitId = tmp[1];
		solId = tmp[2];
        entity_cre_flg=tmp[3];
        if (entity_cre_flg == 'N')
        {
         alert(finbranchResArr.get("FAT003789"));
         window.parent();
         return false;
        }
		if (in_out_ind == "O")    {
				url = "../orm/orm_ctrl.jsp?rtId="+rtId+"&mo=HORM&actionCode=EXPLODE&orm.funcCode=I&pagename=orm&orm.remitId="+remitId+"&orm.solId="+solId;
				document.forms[0].calledMenu.value=url;
				doSubmitForm("INVOKE_GROUP_RECORD");
		} else {
				url = "../irm/irm_ctrl.jsp?rtId="+rtId+"&mo=HIRM&actionCode=EXPLODE&irm.funcCode=I&pagename=irm&irm.remitId="+remitId+"&irm.solId="+solId;
			    document.forms[0].calledMenu.value=url;
				doSubmitForm("INVOKE_GROUP_RECORD");
		}
}

function showIntRateDtls(rowNo,inputFields)
{
 	var values =getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");

	var url = null;

	var diffRateFlg      =tmp[0];
	var intTblCode       =tmp[1];
	var crncyCode        =tmp[2];

	if("Y" == diffRateFlg )
	{
		url = "../inquiry/inquiry_ctrl.jsp?mo=HACLI&actionCode=SUBMIT&acli.tbl_code="+intTblCode+"&acli.tbl_desc=&acli.crncy_code="+crncyCode+"&acli.start_date=&acli.end_date=&acli.as_on_date=&acli.acct_open_date=&tvs_ivs_lavs_flag=" ;
		formUrl(url);

	}
	else
	{
		alert(finbranchResArr.get("FAT003329"));
	}		
	 
}

function fnCancelHandler(sMode)
{
	var ADD_MODE            = "A";
	var COPY_MODE           = "C";
	var MODIFY_MODE         = "M";
	var COPY_TEMPLATE_MODE  = "T";
	
	if(sMode == ADD_MODE || sMode == COPY_MODE || sMode == MODIFY_MODE || sMode == COPY_TEMPLATE_MODE )
	{
		if(confirm(finbranchResArr.get("FAT000925"))!=true)
		{
			return false;
		}
	}
	return true;
}

function formUrlForCurrGroup(ctrlUrl)
{
	var tempUrl = ctrlUrl.split("/");
	var iSize 	= tempUrl.length - 1;
	if (tempUrl[iSize - 1] != CURR_GROUP_NAME)
	{
		var currLoc = "";
		for(var i=0;i<=iSize;i++){
			var tempVar = tempUrl[i].replace(tempUrl[iSize -1],CURR_GROUP_NAME);
			currLoc = currLoc + tempVar;
			if(i != iSize)
			{
				currLoc = currLoc + "/";
			}
		}
	}
	return currLoc;
}

function fnValidateSplCharacters(objectField)
{
	// Anything other than a-z/A-Z/0-9 is invalid.
	var invalidChars = /[^a-zA-Z0-9]/;

	if(invalidChars.test(objectField.value))
	{
		alert(finbranchResArr.get("FAT000485"));
		objectField.focus();
		return false;
	}

	return true;
}

/*-------------------------------------------------------------------------------------------------------
 * Common functions for equityprice 
 * -----------------------------------------------------------------------------------------------------
 */
// This function converts the given number to Lakh format 
function formateqtypriceToLakh(Num) 
{
	if (fnIsNull(Num))
		return "";
	//Return if invalid number
	if (isNaN(removeCommas(Num)))
	{
		alert(finbranchResource.FAT000029);
		return 0;
	}
	//If no of digits less than 3 return the number
	if ((Num.indexOf(DEF_DECIMAL_SEPARATOR)!=-1) && (Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR)-1).length < 3))
		return Num;
	//Take mantissa part out of the number
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) != -1)
		sNum=Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR));
	else
		sNum = Num;
	if (sNum.length<4)
		return Num+".000000"; 
	//Remove commas if present
	sNum = removeCommas(sNum);
	var sRes="";
	var j=0;
	if (sNum.length >4)
	{
		for (i=sNum.length-4;i>=0;i--)
		{
			sRes=sRes + sNum.charAt(i);
			temp = (sRes.substring(0,j+1)).length;
			if ((temp%2)==0)
				sRes=sRes+",";
			j+=1;
		}
		var sOrig="";
		for (i=sRes.length-1;i>=0;i--)
		{
			sOrig=sOrig + sRes.charAt(i);
		}
		sOrig=sOrig+","+sNum.substring(sNum.length-3);
	}
	if (sNum.length==4)
		sOrig=sNum.charAt(0)+","+sNum.substring(1);
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) == -1)
		sOrig=sOrig+".000000";

	else
		sOrig=sOrig+Num.substring(Num.indexOf(DEF_DECIMAL_SEPARATOR));
	if (sOrig.charAt(0) == DEF_MANTISSA_SEPARATOR)
		sOrig=sOrig.substring(sOrig.indexOf(DEF_MANTISSA_SEPARATOR)+1);
	return sOrig;
}

//This function converts the given number to Million format
function formateqtypriceToMillion(Num) 
{
	if (fnIsNull(Num))
		return "";
	//Return if invalid number
	if (isNaN(removeCommas(Num)))
	{
		alert(finbranchResource.FAT000029);
		return 0;
	}
	//If no of digits less than 3 return the number
	if ((Num.indexOf(DEF_DECIMAL_SEPARATOR)!=-1) && (Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR)-1).length < 3))
		return Num;
	//Take mantissa part out of the number
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) != -1)
		sNum=Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR));
	else
		sNum = Num;
	if (sNum.length<4)
		return Num+".000000";

	//Remove commas if present
	sNum = removeCommas(sNum);
	var sRes="";
	var j=0;
	for (i=sNum.length-1;i>=0;i--)
	{
		sRes=sRes + sNum.charAt(i);
		temp = (sRes.substring(0,j+1)).length;
		if ((temp%3)==0)
			sRes=sRes+",";
		j+=1;
	}
	var sOrig="";
	for (i=sRes.length-1;i>=0;i--)
	{
		sOrig=sOrig + sRes.charAt(i);
	}
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) == -1)
		sOrig=sOrig+".000000";

	else
		sOrig=sOrig+Num.substring(Num.indexOf(DEF_DECIMAL_SEPARATOR));
	if (sOrig.charAt(0) == ",")
	{
		sOrig=sOrig.substring(sOrig.indexOf(DEF_MANTISSA_SEPARATOR)+1);
	}
	return sOrig;
}



//Function to check if the eqtyprice is valid.
function isValideqtyprice(amount)
{
	var bValid = true;
	amt = getAmtInStdFormat(amount);
	if((amt.length >17)||(isNaN(amt)))
		bValid = false;
	index =amt.indexOf(DEF_DECIMAL_SEPARATOR);
	if(index > 11)
		bValid = false;
	if((index== -1)&&(amt.length > 11))
		bValid = false;
	return bValid;
}

// Function to extract currency from eqtyprice.
function getCrncyFromeqtyprice(sSrcAmt){
	var currency = "";
	var iCrncyIndex = sSrcAmt.indexOf("|");
	if(iCrncyIndex != -1) 
	{
		var iPrecIndex = sSrcAmt.indexOf("|",iCrncyIndex + 1);
		if (iPrecIndex != -1)
		{
			currency = sSrcAmt.substring(iCrncyIndex+1,iPrecIndex);
		}
		else
			currency = sSrcAmt.substring(iCrncyIndex+1);
	}
	return currency;

}
//Function to extract precision from eqtyprice.
function getPrecFromeqtyprice(sSrcAmt){  
	var prec = ""; 
	var iCrncyIndex = sSrcAmt.indexOf("|");
	if(iCrncyIndex != -1)
	{
		var iPrecIndex = sSrcAmt.indexOf("|",iCrncyIndex + 1);  
		if (iPrecIndex != -1)  
		{
			prec = sSrcAmt.substring(iPrecIndex+1); 
		}
	}
	return prec;
}
/**
 * This function formats the eqtyprice into lakh or million.
 * The format to be applied is taken from the finbranch properties file.
 *
 * @param sourceAmt	variable which takes the source amount to format
 *
 * @param precision	variable which decides on the precision to applied
 *
 * @return newAmt	variable which has the formatted amount value
 *
 **/
function getFormateqtyprice(amountFormat,sourceAmt,PrecVal)	{
	var newAmt	=	null;
	var custAmt =   null;
	if(isEmptyObjValue(sourceAmt) || isEmptyObjValue(amountFormat) ||
			isEmptyObjValue(PrecVal)){
		return;
	}

	if (amountFormat == 'Million')	{
		newAmt	=	formatToMillion1(sourceAmt,PrecVal);
	} else    	{
		newAmt	=	formatToLakh1(sourceAmt,PrecVal);
	}
	custAmt = getAmtInCustomFormat(newAmt);
	return custAmt;
}



function fnValidateeqtyprice(amt,precision)
{
	amt = getAmtInStdFormat(amt);
	return fnValidateStdeqtyprice(amt,precision);
}

function fnValidateStdeqtyprice(objAmtField,precision){

	var numericPart = 0;
	var decimalPart = 0;
	var iIndex = 0;
	var bValidAmount = true;
	var sourceAmt = removeCommas(objAmtField);
	var DEC_PART_LEN = 6;
	var NUM_PART_LEN = 10;
	var TOTAL_LEN = 17;

	if(isNaN(sourceAmt)){
		bValidAmount = false;
		alert(finbranchResource.FAT003913);
	}
	else if  (parseFloat(sourceAmt) < 0.00)
	{
		bValidAmount = false;
		alert(finbranchResource.FAT003912);
	} else {
		DEC_PART_LEN = DEC_PART_LEN > precision ? precision : DEC_PART_LEN;
		sourceAmt = checkZeroes(sourceAmt,precision);
		iIndex = sourceAmt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex == -1){
			numericPart = sourceAmt;
		} else {
			numericPart = sourceAmt.substring(0,iIndex);
			decimalPart = sourceAmt.substring(iIndex+1);
		}
		if(sourceAmt.length > TOTAL_LEN){
			bValidAmount = false;
			alert(finbranchResource.FAT000523+TOTAL_LEN+" "+finbranchResource.FAT003896);
		}
		else if(numericPart.length > NUM_PART_LEN && precision!=0 ){
			bValidAmount = false;
			alert(finbranchResource.FAT002973);
			/* shoud change the alert to 10	digits allowed in numeric part*/
		} else if(decimalPart.length > DEC_PART_LEN){
			bValidAmount = false;
			alert(finbranchResource.FAT000523+DEC_PART_LEN+" "+finbranchResource.FAT000526);
		} else {

			switch(parseInt(DEC_PART_LEN,10)){
				case 6 :
					if(numericPart.length > 10){
						bValidAmount = false;
						/* add error Maximum 10 digits are allowed in numeric
						 * part with precision */
						alert(finbranchResource.FAT002973 + DEC_PART_LEN); 
					}
					break;
				case 5 :
					if(numericPart.length > 11){
						bValidAmount = false;
						alert(finbranchResource.FAT000529 + DEC_PART_LEN); 
					}
					break;					
				case 4 :
					if(numericPart.length > 12){
						bValidAmount = false;
						alert(finbranchResource.FAT000528 + DEC_PART_LEN); 
					}
					break;
			}
		}
	}
	return bValidAmount;
}


function newformateqtyprice(format, obj,crncy, prec,prn, idx)
{
	var isObject = (prn != 'Y');
	var isCrncyAvl = !fnIsNull(crncy);
	var isPrecAvl = !fnIsNull(prec);

	format = (fnTrim(format)).toUpperCase();
	if (format != "MILLION" && format != "LAKH") {
		alert(finbranchResArr.get("FAT003920"));
		low_setAmtFldFocus(isObject, obj, idx);
		return false;
	}

	var amt = (isObject) ? obj.value : obj;

	amt = fnTrim(amt);
	if (fnIsNull(amt)) {
		if (!isObject)
			return obj;

		return;
	}

	amt = removeMantissa(amt);

	amt = getAmtInStdFormat(amt);



	if (!low_isValidPrice(amt)) {
		low_setAmtFldFocus(isObject, obj, idx);
		return;
	}

	amt = low_convertAmt(amt);

	if (!isPrecAvl){ 
		var decLen = 0;
		var iIndex = 0;
		prec = EQTYPRICE_PREC;

		iIndex = amt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex != -1){
			decLen = amt.substring(iIndex+1).length;
			if(decLen < prec)
				prec = decLen;
		}
	}	
	if (isObject && !low_validateeqtyprice(amt,prec))
	{
		low_setAmtFldFocus(isObject, obj, idx);
		return;
	}

	amt = checkZeroes(amt,prec);

	if (format == 'MILLION'){
		amt = formatToMillion1(amt,prec);
	}
	else {
		amt = formatToLakh1(amt,prec);
	}

	amt = getAmtInCustomFormat(amt);
	if (isObject) {
		obj.value = amt;
	}
	else {
		document.write(amt);
	}
}

function formateqtypriceToMillionOrLakh(format, obj, prec, prn, idx)
{
	newformateqtyprice(format, obj,null, precision, prn, idx);
}

function low_validateeqtyprice(amt,prec)
{

	var maxValue = "99999999999999999";

	if (low_fnSubtractAmt(amt, maxValue) > 0)
	{
		alert(finbranchResource.FAT003917);
		return false;
	}

	if(!fnValidateStdeqtyprice(amt,prec))
	{
		return false;
	}

	return true;
}

function formateqtypriceOnBlur(sAmtFormat,amtObj,checkValueObj){
	if("true" != checkValueObj.value){
		formateqtypriceToMillionOrLakh(sAmtFormat,amtObj,crncyCode,"N")
	}
	if(isNaN(getAmtInStdFormat(amtObj.value))){
		amtObj.focus();
	}
	checkValueObj.value="false";
}

function RemCrncyandprecfromeqty(sSrcAmt){
	var iCrncyIndex = sSrcAmt.indexOf("|");
	if(iCrncyIndex != -1)	return sSrcAmt.substring(0, iCrncyIndex);
	else return sSrcAmt;
}

// Checks if the passed price1 is greater than price2.
// price1 == price2  true, price1 > price2  true, price1 < price2 false.
function fnCompareEqtyPriceFlds(price1,price2)
{
    var price1 = getAmtInStdFormat(price1);
    var price2 = getAmtInStdFormat(price2);
    var index1 = 0;
    var index2 = 0;

    index1 = price1.indexOf(DEF_DECIMAL_SEPARATOR);
    index2 = price2.indexOf(DEF_DECIMAL_SEPARATOR);
    if (index1 < index2)
    {
        price1 = fnAmtLpad(price1,(index2-index1));
    }
    else
    {
        price2 = fnAmtLpad(price2,(index1-index2));
    }

    if(price1 > price2)
        return true;
    else
        return false;
}

function low_isValidPrice(price)
{
	var priceLen = price.length;
	var lastChar = (price.charAt(priceLen - 1)).toUpperCase();

	if (isNaN(lastChar) && lastChar != '.') {
		var str = price.substring(0, priceLen - 1);
		if (isNaN(str)) {
			alert(finbranchResArr.get("FAT003921"));
			return false;
		}

		var val = "";
		if (eval("this.custGetAmountCodeValue") != undefined) {
			val = custGetAmountCodeValue(lastChar);
		}
		else {
			val = getAmountCodeValue(lastChar);
		}
		if (val == undefined) {
			alert(finbranchResArr.get("FAT003922"));
			return false;
		}
		else {
			return true;
		}
	}

	if (isNaN(price)) {
		alert(finbranchResArr.get("FAT003921"));
		return false;
	}

	/*fix for the ticket  277224*/
	var regExp = /[Ee]/g;
    if (regExp.test(price)) {
        alert(finbranchResArr.get("FAT003921"));
        return false;
    }
	
	return true;
}

/* Validations for NAV */

// This function converts the given number to Lakh format 
function formatNAVToLakh(Num) 
{
	if (fnIsNull(Num))
		return "";
	//Return if invalid number
	if (isNaN(removeCommas(Num)))
	{
		alert(finbranchResArr.get("FAT000029"));
		return 0;
	}
	//If no of digits less than 3 return the number
	if ((Num.indexOf(DEF_DECIMAL_SEPARATOR)!=-1) && (Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR)-1).length < 3))
		return Num;
	//Take mantissa part out of the number
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) != -1)
		sNum=Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR));
	else
		sNum = Num;
	if (sNum.length<4)
		return Num+".000000"; 
	//Remove commas if present
	sNum = removeCommas(sNum);
	var sRes="";
	var j=0;
	if (sNum.length >4)
	{
		for (i=sNum.length-4;i>=0;i--)
		{
			sRes=sRes + sNum.charAt(i);
			temp = (sRes.substring(0,j+1)).length;
			if ((temp%2)==0)
				sRes=sRes+",";
			j+=1;
		}
		var sOrig="";
		for (i=sRes.length-1;i>=0;i--)
		{
			sOrig=sOrig + sRes.charAt(i);
		}
		sOrig=sOrig+","+sNum.substring(sNum.length-3);
	}
	if (sNum.length==4)
		sOrig=sNum.charAt(0)+","+sNum.substring(1);
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) == -1)
		sOrig=sOrig+".000000";

	else
		sOrig=sOrig+Num.substring(Num.indexOf(DEF_DECIMAL_SEPARATOR));
	if (sOrig.charAt(0) == DEF_MANTISSA_SEPARATOR)
		sOrig=sOrig.substring(sOrig.indexOf(DEF_MANTISSA_SEPARATOR)+1);
	return sOrig;
}

//This function converts the given number to Million format
function formatNAVToMillion(Num) 
{
	if (fnIsNull(Num))
		return "";
	//Return if invalid number
	if (isNaN(removeCommas(Num)))
	{
		alert(finbranchResArr.get("FAT000029"));
		return 0;
	}
	//If no of digits less than 3 return the number
	if ((Num.indexOf(DEF_DECIMAL_SEPARATOR)!=-1) && (Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR)-1).length < 3))
		return Num;
	//Take mantissa part out of the number
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) != -1)
		sNum=Num.substring(0,Num.indexOf(DEF_DECIMAL_SEPARATOR));
	else
		sNum = Num;
	if (sNum.length<4)
		return Num+".000000";

	//Remove commas if present
	sNum = removeCommas(sNum);
	var sRes="";
	var j=0;
	for (i=sNum.length-1;i>=0;i--)
	{
		sRes=sRes + sNum.charAt(i);
		temp = (sRes.substring(0,j+1)).length;
		if ((temp%3)==0)
			sRes=sRes+",";
		j+=1;
	}
	var sOrig="";
	for (i=sRes.length-1;i>=0;i--)
	{
		sOrig=sOrig + sRes.charAt(i);
	}
	if (Num.indexOf(DEF_DECIMAL_SEPARATOR) == -1)
		sOrig=sOrig+".000000";

	else
		sOrig=sOrig+Num.substring(Num.indexOf(DEF_DECIMAL_SEPARATOR));
	if (sOrig.charAt(0) == ",")
	{
		sOrig=sOrig.substring(sOrig.indexOf(DEF_MANTISSA_SEPARATOR)+1);
	}
	return sOrig;
}



//Function to check if the nav is valid.
function isValidNAV(amount)
{
	var bValid = true;
	amt = getAmtInStdFormat(amount);
	if((amt.length >19)||(isNaN(amt)))
		bValid = false;
	index =amt.indexOf(DEF_DECIMAL_SEPARATOR);
	if(index > 14)
		bValid = false;
	if((index== -1)&&(amt.length > 14))
		bValid = false;
	return bValid;
}




// Function to extract currency from Nav.
function getCrncyFromNAV(sSrcAmt){
	var currency = "";
	var iCrncyIndex = sSrcAmt.indexOf("|");
	if(iCrncyIndex != -1)
	{
		var iPrecIndex = sSrcAmt.indexOf("|",iCrncyIndex + 1);
		if (iPrecIndex != -1)
		{
			currency = sSrcAmt.substring(iCrncyIndex+1,iPrecIndex);
		}
		else
			currency = sSrcAmt.substring(iCrncyIndex+1);
	}
	return currency;

}


//Function to extract precision from Nav.

function getPrecFromNAV(sSrcAmt){
	var prec = "";
	var iCrncyIndex = sSrcAmt.indexOf("|");
	if(iCrncyIndex != -1)
	{
		var iPrecIndex = sSrcAmt.indexOf("|",iCrncyIndex + 1);
		if (iPrecIndex != -1)
		{
			prec = sSrcAmt.substring(iPrecIndex+1);
		}
	}
	return prec;
}



/**
 * This function formats the nav into lakh or million.
 * The format to be applied is taken from the finbranch properties file.
 *
 * @param sourceAmt	variable which takes the source amount to format
 *
 * @param precision	variable which decides on the precision to applied
 *
 * @return newAmt	variable which has the formatted amount value
 *
 **/
function getFormatNAV(NAVFormat,sourceAmt,PrecVal)	{
	var newAmt	=	null;
	var custAmt =   null;
	if(isEmptyObjValue(sourceAmt) || isEmptyObjValue(amountFormat) ||
			isEmptyObjValue(PrecVal))	{
		return;
	}

	if (NAVFormat == 'Million')	{
		newAmt	=	formatToMillion1(sourceAmt,precVal);
	} else    	{
		newAmt	=	formatToLakh1(sourceAmt,precVal);
	}
	custAmt = getAmtInCustomFormat(newAmt);
	return custAmt;
}

/**
 * This function is used for validation of nav type fields.
 * Checks for the alphabets, special characters and the length of
 * the value according to the precision specified.
 * Empty fields are considered as invalid.
 *
 * @param	objAmtField		The nav value entered by user.
 *
 * @param	precision		The precision specified
 *
 * @param	NUM_PART_LENGTH	maximum allowable length of the numeric part
 *
 * @param	TOTAL_LENGTH	maximum allowable length of the value
 *
 * @param	errCode1		alert message 1
 *
 * @param	errCode2		alert message 2
 *
 * @param	errCode3		alert message 3
 *
 * @return	boolean			Returns true if validation is a success, false
 *							if not.
 *
 **/
function fnCommonValNAV(objAmtField, precision,NUM_PART_LENGTH,TOTAL_LENGTH,
		errNumPartLen,errNumPartPrecLen6,errNumPartPrecLen5, errNumPartPrecLen4){
	var numericPart = 0;
	var decimalPart = 0;
	var iIndex = 0;
	var bValidAmount = true;
	var sourceAmt = removeCommas(objAmtField);
	var errNumPartPrecLen4	=	finbranchResArr.get("FAT002230"); 
	var errNumPartPrecLen5	=	finbranchResArr.get("FAT000527");
	var errNumPartPrecLen6	=	finbranchResArr.get("FAT000528");	
	var DEC_PART_LEN = 6;
	var NUM_PART_LEN = NUM_PART_LENGTH;
	var TOTAL_LEN = TOTAL_LENGTH;
	if(isEmptyObjValue(objAmtField))    {
		return false;
	}
	if(isNaN(sourceAmt)){
		bValidAmount = false;
		alert(finbranchResArr.get("FAT000189"));
	} else {
		if(null!=precision && !isNaN(precision) && 0<parseInt(precision,10))   {
			DEC_PART_LEN = DEC_PART_LEN > precision ? precision : DEC_PART_LEN;
		}
		sourceAmt = checkZeroes(sourceAmt,precision);
		iIndex = sourceAmt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex == -1){
			numericPart = sourceAmt;
		} else {
			numericPart = sourceAmt.substring(0,iIndex);
			decimalPart = sourceAmt.substring(iIndex+1);
		}
		if(sourceAmt.length > (TOTAL_LEN + 1)){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+TOTAL_LEN+" "+
			 finbranchResArr.get("FAT002074"));
		} else if(numericPart.length > NUM_PART_LEN){
			bValidAmount = false;
			alert(errNumPartLen);
		} else if(decimalPart.length > DEC_PART_LEN){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+DEC_PART_LEN+" "+
					finbranchResArr.get("FAT000526"));
		} else {
			switch(parseInt(DEC_PART_LEN,10)){
				case 6 :
					if(numericPart.length > 12){
						bValidAmount = false;
						alert(errNumPartPrecLen6 + DEC_PART_LEN);
					}
					break;
				case 5 :
					if(numericPart.length > 13){
						bValidAmount = false;
						alert(errNumPartPrecLen5 + DEC_PART_LEN);
					}
					break;
				case 4 :
					if(numericPart.length > 14){
						bValidAmount = false;
						alert(errNumPartPrecLen4 + DEC_PART_LEN);
					}
					break;					
			}
		}
	}
	return bValidAmount;
}


function fnValidateNAV(amt,precision)
{
	amt = getAmtInStdFormat(amt);
	return fnValidateStdNAV(amt,precision);
}




function fnValidateStdNAV(objAmtField, precision){

	var numericPart = 0;
	var decimalPart = 0;
	var iIndex = 0;
	var bValidAmount = true;
	var sourceAmt = removeCommas(objAmtField);
	var DEC_PART_LEN = 6;
	var NUM_PART_LEN = 16;
	var TOTAL_LEN = 17;

	if(isNaN(sourceAmt)){
		bValidAmount = false;
		alert(finbranchResArr.get("FAT000189"));
	} else {
		DEC_PART_LEN = DEC_PART_LEN > precision ? precision : DEC_PART_LEN;
		sourceAmt = checkZeroes(sourceAmt,precision);
		iIndex = sourceAmt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex == -1){
			numericPart = sourceAmt;
		} else {
			numericPart = sourceAmt.substring(0,iIndex);
			decimalPart = sourceAmt.substring(iIndex+1);
		}
		if(sourceAmt.length > TOTAL_LEN){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+TOTAL_LEN+ " "+finbranchResArr.get("FAT002074"));
		}
  		else if(numericPart.length > NUM_PART_LEN ){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT001371"));
		} else if(decimalPart.length > DEC_PART_LEN){
			bValidAmount = false;
			alert(finbranchResArr.get("FAT000523")+DEC_PART_LEN+" "+finbranchResArr.get("FAT000526"));
		} else {

			switch(parseInt(DEC_PART_LEN,10)){
				case 6 :
					if(numericPart.length > 10){
						bValidAmount = false;
						alert(finbranchResArr.get("FAT004386") + DEC_PART_LEN);
					}
					break;
				case 5 :
					if(numericPart.length > 11){
						bValidAmount = false;
						alert(finbranchResArr.get("FAT004385") + DEC_PART_LEN);
					}
					break;					
				case 4 :
					if(numericPart.length > 12){ 
						bValidAmount = false; 
						alert(finbranchResArr.get("FAT000528") + DEC_PART_LEN); 
					} 
					break; 
				case 3 : 
					if(numericPart.length > 13){ 
						bValidAmount = false; 
						alert(finbranchResArr.get("FAT000527") + DEC_PART_LEN); 
					} 
					break; 
				case 2 : 
					if(numericPart.length > 14){
						bValidAmount = false;
						alert(finbranchResArr.get("FAT002230") + DEC_PART_LEN);
					}
					break;
				case 1 : 
					if(numericPart.length > 15){ 
						bValidAmount = false; 
						alert(finbranchResArr.get("FAT000872") + DEC_PART_LEN); 
					} 
					break; 
			}
		}
	}
	return bValidAmount;
}


function newformatNAV(format, obj, crncy, prec, prn, idx)
{
	var isObject = (prn != 'Y');
	var isCrncyAvl = !fnIsNull(crncy);
	var isPrecAvl = !fnIsNull(prec);

	format = (fnTrim(format)).toUpperCase();
	if (format != "MILLION" && format != "LAKH") {
		alert("Invalid Amount Format.");
		low_setAmtFldFocus(isObject, obj, idx);
		return;
	}

	var amt = (isObject) ? obj.value : obj;

	amt = fnTrim(amt);
	if (fnIsNull(amt)) {
		if (!isObject)
			return obj;

		return;
	}

	amt = removeMantissa(amt);
	amt = getAmtInStdFormat(amt);

	if (!low_isValidAmt(amt)) {
		low_setAmtFldFocus(isObject, obj, idx);
		return false;
	}

	amt = low_convertAmt(amt);


	if (!isPrecAvl){
		var decLen = 0;
		var iIndex = 0;
		prec = '6';

		iIndex = amt.indexOf(DEF_DECIMAL_SEPARATOR);
		if(iIndex != -1){
			decLen = amt.substring(iIndex+1).length;
			if(decLen < prec)
				prec = decLen;
		}

	}
	if (isObject && !low_validateNAVWithPrec(amt, prec))
	{
		low_setAmtFldFocus(isObject, obj, idx);
		return false;
	}

	amt = checkZeroes(amt,prec);

	if (format == 'MILLION'){
		amt = formatToMillion1(amt,prec);
	}
	else {
		amt = formatToLakh1(amt,prec);
	}

	amt = getAmtInCustomFormat(amt);
	if (isObject) {
		obj.value = amt;
	}
	else {
		document.write(amt);
	}
	return true;
}

function formatNAVToMillionOrLakh(format, obj, prec, prn, idx)
{
	newformatNAV(format, obj, null, precision, prn, idx);
}

function low_validateNAVWithPrec(amt, precision)
{

	var maxValue = "99999999999999999";

	if (low_fnSubtractAmt(amt, maxValue) > 0)
	{
		alert("Entered Amount exceeds the Max Limit.");
		return false;
	}



	if(!fnValidateStdNAV(amt,precision))
	{
		return false;
	}

	return true;
}

function fnAlphaCheckWithSpace(fldId)
{
    var validChars = /[^A-Za-z0-9_ ]/; //Anything other than 0-9, A- Z and Underscore is  invalid.
    var obj = 'document.forms[0].'+fldId;
    if(validChars.test((eval(obj)).value))
    {
        alert(finbranchResArr.get("FAT000485"));
        (eval(obj)).focus();
        return false;
    }
    return true;
}

function formatNAVOnBlur(sAmtFormat,amtObj,crncyCode,checkValueObj){
	if("true" != checkValueObj.value){
		formatNAVToMillionOrLakh(sAmtFormat,amtObj,crncyCode,"N")
	}
	if(isNaN(getAmtInStdFormat(amtObj.value))){
		amtObj.focus();
	}
	checkValueObj.value="false";
}

/* Function for special Characters('|','\n') Validation */
function validateSpecialChar() {
    var obj = document.forms[0].elements;
    var len = obj.length;
    var funcName = "this."+"custValidateSpecialChar";
    var isFuncAvl = (eval(funcName) != undefined);
    var retVal = true;
    var invalidChars = /[\|\n]/g
    for (var i = 0; i < len; i++) {
     switch(obj[i].type) {
        case "text":
        case "textarea":
            var textval = obj[i].value;
            if(!obj[i].readOnly && !obj[i].disabled){
                if (invalidChars.test(textval)) {
                    alert(finbranchResArr.get("FAT000485"));
                    obj[i].focus();
					retVal = false;
					return retVal;
					break;
				}
				if (isFuncAvl) {
					if(eval(funcName).call(this,textval) == false) {
						obj[i].focus();
						retVal = false;
						return retVal;
						break;
                    }
                }
            }
            break;
        default:
            break;
     }
   }
    return retVal;
}

function validateNewLineFeedForTextArea(objForm)
{
	var frmElements = objForm.elements;
	var obj;
	for(var i=0; i < frmElements.length; i++)
	{
		obj = frmElements[i];

		//Check if the field is of type text area and also if it is not
		//hidden.
		if(obj.type == 'textarea' && (obj.type != "hidden") && (obj.disabled
		!= true) && (obj.readOnly != true))
		{
			var vRemarks = obj.value;
			for(var j = 0;j<=vRemarks.length;j++)
			{
				if(vRemarks.charAt(j) == "\n")
				{
					//New line characters not allowed
					alert(finbranchResArr.get("FAT003378"));
					obj.focus();
					return false;
				}
			}
		}
	}
	return true;
}

function setUnitValueInd(secuType,unitInd,overriddenRec,funcCode,dp)
{
    var securityType = eval("document.forms[0]."+secuType);
    var unitIndicator = eval("document.forms[0]."+unitInd);
    var overriddenFlag1 = eval("document.forms[0]."+overriddenRec);
    var func = eval("document.forms[0]."+funcCode);
    var dpFlag = eval("document.forms[0]."+dp);
    var temp1 = getRadioValue(dpFlag);


    if(func.value == "A")
    {
        if((securityType.value == "A") ||
                (securityType.value == "W") ||
                (securityType.value == "K") ||
                (securityType.value == "H"))
        {
            unitIndicator.value = "N";
            fnEnableDisableRadioButtons(dpFlag,'E');
            setRadioValue(overriddenRec,'Y');

        }
        else
        {
            unitIndicator.value = "";
            fnEnableDisableRadioButtons(dpFlag,'D');
            setRadioValue(overriddenRec,'');
        }

    }
    else
        if(func.value == "M")
        {

            if((securityType.value == "A") ||
                    (securityType.value == "W") ||
                	(securityType.value == "K") ||
                    (securityType.value == "H"))
            {
                unitIndicator.value = "N";
                fnEnableDisableRadioButtons(dpFlag,'E');
                setRadioValue(overriddenRec,'Y');
				fnEnableDisableRadioButtons(overriddenFlag1,'D');
            }
            else
            {
				if(temp1 == "Y")
				{
					fnEnableDisableRadioButtons(overriddenFlag1,'E');
				}
                unitIndicator.value = "";
                setRadioValue(overriddenRec,'');
            }
        }
        else
            if(func.value == "C")
            {

                if((securityType.value == "A") ||
                        (securityType.value == "W") ||
                        (securityType.value == "K") ||
                        (securityType.value == "H"))
                {
                    unitIndicator.value = "N";
                    setRadioValue(overriddenRec,'Y');
                }
                else
                {
                    unitIndicator.value = "";
                    setRadioValue(overriddenRec,'');
                }
            }
            else
            {
                fnEnableDisableRadioButtons(dpFlag,'D');
            }

    return true;
}

function setdpFlag(secuType,overriddenRec,funcCode,dp)
{
    var securityType = eval("document.forms[0]."+secuType);
    var overriddenFlag = eval("document.forms[0]."+overriddenRec);
    var func = eval("document.forms[0]."+funcCode);
    var dpFlag = eval("document.forms[0]."+dp);


    if((securityType.value == "A") ||
            (securityType.value == "W") ||
            (securityType.value == "K") ||
            (securityType.value == "H"))
    {
     var temp = getRadioValue(dpFlag);
        if(temp == "Y" || temp == "N")
        {
            fnEnableDisableRadioButtons(overriddenFlag,'D');
        }
    }
}

function setRadioValue(obj,value){
    var obj1 = document.forms[0];
    var isArray = (typeof(obj.length)=="undefined")?false:true;

    if(isArray && (typeof(obj.type)=="undefined")){
        for(var i=0;i<obj.length;i++){
            if(eval("obj1."+obj+"["+i+"].value") == value){
                eval("obj1."+obj+"["+i+"].checked = true");
                break;
            }

            else
            if(value==""){
            eval("obj1."+obj+"["+i+"].checked = false");
            return;
            }

        }
    }


    return;
}


//The functions takes the object and a string
//obj should be document.forms[0].<OBJECT_ID>
//str should be either 'E' or 'D' for Enabling / Disabling respectively.
function fnEnableDisableRadioButtons(obj,str){
    var isArray = (typeof(obj.length)=="undefined")?false:true;

    if(!isArray){
        if (str == 'D'){
            obj.disabled = true;
            return;
        }else{
            obj.disabled = false;
            return;
        }
    }

    if(isArray && (typeof(obj.type)=="undefined")){
        for(var i=0;i<obj.length;i++){
            if (str == 'D'){
                obj[i].disabled = true;
            }else{
                obj[i].disabled = false;
            }
        }
    }
    return;

} 
 
    

function checkDecimalDigitsForAmt(inputAmt) 
{ 
	var decLength = 0; 
	var decPoint  = 0; 
	var amtLength = 0; 
	var sResult   = 0; 

	objInputAmt = eval("document.forms[0]." +inputAmt); 
	inputAmtFldId = objInputAmt.getAttribute("vFldId"); 
	inputAmtFld = eval("document.forms[0]." +inputAmtFldId); 

	inputAmount=getAmtInStdFormat(inputAmtFld.value); 


	amtLength = inputAmount.length; 
	decPoint = getDecIndex(inputAmount); 

	if(decPoint != -1) 
	{ 
		decLength = amtLength - (decPoint + 1); 
		sResult = inputAmount.substring(decPoint+1,amtLength); 

		if((decLength > 0) && (sResult > 0)) 
		{ 
			alert(finbranchResArr.get("FAT004503")); 
			return false; 
		} 
	} 
} 

/* Function for special Characters('|','\n') Validation on custom_ONBLUR event */
function splCharChk(currObj) 
{
	var custInValidSplChar = "this."+"cust_validateSplChar";
	var isCustInValidSplCharAvl = (eval(custInValidSplChar) != undefined);
	var retVal = true;
	var invalidSplChars = /[\|\n]/g

	switch(currObj.type) 
	{
		case "text":
		case "textarea":
			var textval = currObj.value;
			if(!currObj.readOnly && !currObj.disabled){
				if (invalidSplChars.test(textval)) {
					alert(finbranchResArr.get("FAT000485")); 
					currObj.focus(); 
					retVal = false; 
					break; 
				} 
				if (isCustInValidSplCharAvl) { 
					if (eval(custInValidSplChar).test(textval)) { 
						alert(finbranchResArr.get("FAT000485")); 
						currObj.focus(); 
						retVal = false; 
						break; 
					} 
				} 
			} 
			break;
		default:
			break;
	}
	return retVal;
}

function getPrimarySecondaryDesc(ynCode, sDefault) {
	switch(ynCode) {
		case 'P':
			return finbranchResArr.get ("FAT001906");
		case 'C':
			return finbranchResArr.get ("FAT001907");
		default:
			return sDefault;
	}
}

	/* Function to check the existence of locale combo function - If found then 
    * that gets called else call the base product combo function. */ 
   function writeComboFunction() { 
       /* The below replacement is needed for framework menu combo functions 
        * which are passing () along with the function name  */ 
		var funcName = arguments[0].replace("()","");
                arguments[0] = funcName;
		
		if(localeCode != "DF" && localeCode != "") { 
			var locFuncName="this." + localeCode + "_" + funcName; 
			if(eval(locFuncName) !=undefined) { 
				window[localeCode + "_" + Array.prototype.shift.call(arguments)].apply(null, arguments);
			} 
			else { 
				window[Array.prototype.shift.call(arguments)].apply(null, arguments);           
			} 
		} 
		else { 
			window[Array.prototype.shift.call(arguments)].apply(null, arguments);       
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

 function isUserAccesAvbl(menuName){ 
           return userSCMenuTreeObj.getMenuSCInfo(menuName); 
   } 

    function invokeApplAfterCxtSwitch(data){

    var frmObj = document.forms[0];
    var valueForContextSwitch = frmObj.ContextSwitchDoneFrom.value;
    if(null == data || undefined == data)
        data="";

    if(undefined != valueForContextSwitch && "" != valueForContextSwitch)
    {
        var obj = frmObj.ContextSwitchDoneFrom;
        window.parent.invokeApplAfterCxtSwitchToCore(valueForContextSwitch,data,obj);
        return true;
    }
    return false;
    }

function saveFinacleMode()
{
        var parentObj = window.parent;
        saveFinacleLiteMode = parentObj.isFinacleLite();
}

function isFinacleLiteMode()
{
        var parentObj = window.parent;

        if(undefined != parentObj.isFinacleLite){
                saveFinacleMode();
                return parentObj.isFinacleLite();
        }else{
                return saveFinacleLiteMode;
        }

}

function fnConvertFormToNonMandatory(funcCode){
    var VERIFY = "V";
    var INQUIRY = "I";
    var CANCEL = "X";

    if((funcCode != VERIFY) && (funcCode != INQUIRY) && (funcCode != CANCEL))
        return;
    var frmElem = document.forms[0].elements;
    var frmElemLen = frmElem.length;
    var fieldObj = "";
    var mandatoryAttributeValue = "";

    for(iCount = 0; iCount < frmElemLen; iCount++)  {
        fieldObj = frmElem[iCount];
        /* field obj is neither text or select type, skip validation */
        if( (fieldObj.type != 'text') && (fieldObj.type != 'select-one') && (fieldObj.type!= 'textarea') && (fieldObj.type != 'radio') ) continue;
        mandatoryAttributeValue = fieldObj.getAttribute("fmnd");
        /* mandatory attribute value is null or blank, skip validation */
        if( (mandatoryAttributeValue == null) || (mandatoryAttributeValue == "") ) continue;
        mandatoryAttributeValue = mandatoryAttributeValue.toUpperCase();

        /* mandatory attribute value is either true or y[es], do validation */
        if( (mandatoryAttributeValue == "TRUE") || (mandatoryAttributeValue == "Y") ){
            fnSetPropertyValue(fieldObj,"fmnd","N");

        }
         if(fieldObj.type == "radio"){
            fieldObj.fmnd = "N";
        }
    }
}
function valIfAlphaNumeric(objectField)
{
	// Anything other than a-z/A-Z/0-9 is invalid.
	var invalidChars = /[^a-zA-Z0-9]/;

	/*If called from framework */
	if(typeof(objectField.id) == "undefined")
	{
		objectField= eval("document.forms[0]."+objectField);
	}
	/* if called from ONS */
	if(invalidChars.test(objectField.value))
	{
		alert(finbranchResArr.get("FAT000485"));
		objectField.focus();
		return false;
	}

	return true;
}

function showExplodeDetailsForINTTM(rowNo,sGroupName, 
                                                           actionCode,url,inputFields,moduleId,pWidth,pHeight) 
    
   { 
           var values = getValueOfArgument(rowNo,moduleId); 
           var value = getValueOfArgument(rowNo,inputFields); 
    
           tmp = values.split("|"); 
           var module_Id = tmp[0]; 
    
           tmp = value.split("|"); 
    
           var intcode=tmp[0]; 
           var intver=tmp[2]; 
           var intcrncy=tmp[1]; 
           if(module_Id =="I" || module_Id =="TRANSACTION ACCOUNTS & TRADE BILLS") 
           { 
                   sUrl = "../inquiry/inquiry_ctrl.jsp?mo=CIVSWF&actionCode=SUBMIT&civswf.tbl_code="+intcode+"&civswf.crncy_code="+intcrncy+"&civswf.ver_num="+intver; 
				   formUrl(sUrl); 
		   } 
		   else if(module_Id =="T" || module_Id =="TERM DEPOSITS") 
           { 
                   sUrl = "../inquiry/inquiry_ctrl.jsp?mo=HTVS&actionCode=SUBMIT&htvs.tbl_code="+intcode+"&htvs.crncy_code="+intcrncy+"&htvs.ver_num="+intver; 
                   formUrl(sUrl); 
           } 
           else if(module_Id =="B"  || module_Id =="BASE RATE") 
           { 
                   sUrl = "../inquiry/inquiry_ctrl.jsp?mo=BIVS&actionCode=SUBMIT&bivs.tbl_code="+intcode+"&bivs.crncy_code="+intcrncy+"&bivs.ver_num="+intver; 
                   formUrl(sUrl); 
           } 
           else if(module_Id =="L" || module_Id =="RETAIL LENDING") 
           { 
                   sUrl = "../inquiry/inquiry_ctrl.jsp?mo=LAVS&actionCode=SUBMIT&lavs.tbl_code="+intcode+"&lavs.crncy_code="+intcrncy+"&lavs.ver_num="+intver; 
                   formUrl(sUrl); 
           } 
           else if(module_Id =="C" || module_Id =="COMMERCIAL LENDING") 
           { 
                   sUrl = "../inquiry/inquiry_ctrl.jsp?mo=CLAVS&actionCode=SUBMIT&clavs.tbl_code="+intcode+"&clavs.crncy_code="+intcrncy+"&clavs.ver_num="+intver; 
                   formUrl(sUrl); 
           } 
   } 

function addDayMonthsToDateWithEndChk(initDateObj,adnMonths,adnDays,dispDateObj){
	var tempDate;
	if(fnIsNull(initDateObj.value) || !fnIsValidDate(initDateObj)){
		dispDateObj.value="";
		return false;
	}
	tempDate=initDateObj.value;
	var mnemonicEnabled = initDateObj.getAttribute("mnebl");
	if((null != mnemonicEnabled) && (mnemonicEnabled) && isValidDateMneumonic(tempDate)){
		return true;
	}
	var strArray = tempDate.split("-");
	var iDay = parseFloat(strArray[0]);
	var iMonth = parseFloat(strArray[1]);
	var iYear = parseFloat(strArray[2]);
	var days = daysInMonth(iMonth,iYear);
	if(iDay == days)
	{
		var monthEndChk = 'Y';
	}
	if(!fnIsNull(adnMonths) && fnIsPositiveNumber(adnMonths)){
	 	iMonth = iMonth+parseInt(adnMonths,10);
	}
	if(!fnIsNull(adnDays)&& fnIsPositiveNumber(adnDays)){
	 	if(monthEndChk == 'Y' && !fnIsNull(adnMonths))
		{
			if(iMonth > 12)
			{
				var modMonth = iMonth % 12;
				if(modMonth == 0)
				{
					var newDays = daysInMonth(12,iYear);
				}
				else
				{
					var newDays = daysInMonth(modMonth,iYear);
				}
			}
			else
			{
				var newDays = daysInMonth(iMonth,iYear);
			}
			iDay = newDays+parseInt(adnDays,10);
		}
		else
		{
			iDay = iDay+parseInt(adnDays,10);
		}
	}
	iDay--;
	/*
	Create a date object, set the above computed iDay/iMonth/iYear to it
	get the day/month/year from date object and set these to dispObject field
	*/
	var targetDate = new Date();
	targetDate.setFullYear(iYear, --iMonth, iDay);  //"--" because JS month range is 0-11 [Jan-Dec]
	iDay = targetDate.getDate();
	iMonth = targetDate.getMonth() + 1;     //"+1" because JS month range is 0-11 [Jan-Dec]
	iYear = targetDate.getFullYear();
	iDay = iDay < 10 ? "0"+iDay : iDay;
	iMonth = iMonth  < 10 ? "0"+iMonth : iMonth;
	dispDateObj.value = iDay+"-"+iMonth+"-"+iYear;
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


/* Function to get the Factorin Function Code Description*/
function fnGetFactoringFuncCodeDesc(fnCode){
    switch(fnCode){
        case 'R': return finbranchResArr.get ("FAT005268");
        case 'K': return finbranchResArr.get ("FAT003254");
        case 'N': return finbranchResArr.get ("FAT003330");
        case 'O': return finbranchResArr.get ("FAT003255");
        case 'M': return finbranchResArr.get ("FAT002243");
        case 'V': return finbranchResArr.get ("FAT001731");
        case 'I': return finbranchResArr.get ("FAT001504");
        case 'X': return finbranchResArr.get ("FAT001423");
        default : return fnCode;
    }
}
function fnAlphaCheckWithSpace(fldId)
{
    var validChars = /[^A-Za-z0-9_ ]/; //Anything other than 0-9, A- Z and Underscore is  invalid.
    var obj = 'document.forms[0].'+fldId;
    if(validChars.test((eval(obj)).value))
    {
        alert(finbranchResArr.get("FAT000485"));
        (eval(obj)).focus();
        return false;
    }
    return true;
}
/* VPLTblKeyProperties is used for verification pending list searcher.
 * This property is used to set the key field name in keyArray.
 * This property can return all the key field name seperated by "|" */
function VPLTblKeyProperties()
{
    this.self = null;
    this.keyArray = new Array (MAX_NO_OF_KEY_FIELDS);
    this.setNameForKey1 = setNameForKey1;
    this.setNameForKey2 = setNameForKey2;
    this.setNameForKey3 = setNameForKey3;
    this.setNameForKey4 = setNameForKey4;
    this.setNameForKey5 = setNameForKey5;
    this.setNameForKey6 = setNameForKey6;
    this.setNameForKey7 = setNameForKey7;
    this.setNameForKey8 = setNameForKey8;
    this.setNameForKey9 = setNameForKey9;
    this.getKeyNameList = getKeyNameList;
}
function setNameForKey1(name)
{
    this.keyArray[0] = name;
}

function setNameForKey2(name)
{
    this.keyArray[1] = name;
}

function setNameForKey3(name)
{
    this.keyArray[2] = name;
}

function setNameForKey4(name)
{
    this.keyArray[3] = name;
}

function setNameForKey5(name)
{
    this.keyArray[4] = name;
}

function setNameForKey6(name)
{
    this.keyArray[5] = name;
}

function setNameForKey7(name)
{
    this.keyArray[6] = name;
}

function setNameForKey8(name)
{
    this.keyArray[7] = name;
}

function setNameForKey9(name)
{
    this.keyArray[8] = name;
}
function getKeyNameList()
{
    var tempKeyList = "";

    for (var i = 0; i < MAX_NO_OF_KEY_FIELDS; i++)
    {
        tempKeyList = tempKeyList + this.keyArray[i];
        tempKeyList = tempKeyList + "|";
    }
    tempKeyList = tempKeyList.slice(0, -1);

    return (tempKeyList);
}

function showIICSTDTExplodeDetails(rowNo,inputFields)
{
	var values =getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");

	var acct_id			=tmp[0];
	var from_value_date	=tmp[1];
	var to_value_date	=tmp[2];
    var value_date	 	=tmp[3];
	var int_tran_type	=tmp[4];
	
	expldMenuUrl="inquiry/inquiry_ctrl.jsp";
	expldFields="be_iicstdt.acct_id="+acct_id+"&be_iicstdt.from_value_date="+from_value_date+"&be_iicstdt.to_value_date="+to_value_date+"&be_iicstdt.value_date="+value_date+"&be_iicstdt.int_tran_type="+int_tran_type;
	menuName="BE_IICSTDT";
    menuType="IQ";
    explodeToPage(expldMenuUrl,expldFields,menuName,menuType);
}
function showPPFTranDetails(rowNo,inputFields)
{
	var values =getValueOfArgument(rowNo,inputFields);
	tmp = values.split("|");
	var acctId=tmp[0];

	sUrl = "../inquiry/inquiry_ctrl.jsp?mo=IN_SSATRAN&actionCode=SUBMIT&PLOC=Y&in_ssatran.account_No="+acctId;
	formUrl(sUrl);

}
function toolWindow(sUrl,wName){

	sUrl = jsUtil.formatUrl(sUrl);
	if("Microsoft Internet Explorer" == browser_name){
		window.showModalDialog(sUrl,wName,"dialogHeight:694px;dialogWidth:1200px;resizable:yes;scroll:yes;");
	}else{
		sUrl = getAbsoluteUrl(sUrl);
		popModalWindowVar(sUrl,wName,"dialogHeight:694px;dialogWidth:1200px;resizable:yes;scroll:yes;");
	}
}

function prepRunMode() {
    with(document) {
    write('<OPTION VALUE="">--Select--</OPTION>');
    write('<OPTION VALUE="N">N-Normal</OPTION>');
    write('<OPTION VALUE="F">F-Force</OPTION>');
    write('<OPTION VALUE="T">T-Retry</OPTION>');

    }
}

function excpRunMode() {
    with(document) {
    write('<OPTION VALUE="">--Select--</OPTION>');
    write('<OPTION VALUE="X">X-Normal functionality without handling exception</OPTION>');
    write('<OPTION VALUE="O">O-Online</OPTION>');
    write('<OPTION VALUE="B">B-Batch</OPTION>');
    write('<OPTION VALUE="F">F-Force</OPTION>');
}
}
function fnFileDownloadUtil() {
                var url = "../arjspmorph/trftopc_download.jsp?rtId="+rtId;
                url = getAbsoluteUrl(url);
                window.document.location.href = url;
}
function fnValidateTextAreaForNewLine(obj) 
{ 
	for(var i = 0;i < obj.value.length;i++) 
	{ 
		if(obj.value.charAt(i) == "\n") 
		{ 
			alert(finbranchResource.FAT003269); 
			obj.focus(); 
			return false; 
		} 
	} 
	return true; 
} 

/**
 * Session API to set, get and delete from session using global frame
 *
 */
 
 function returnCorrectFramePrint(){
	var finalRet;
	var ret0 = "window.GLOBALJSFRAME";
	var ret1 = "window.parent.GLOBALJSFRAME";
	var ret2 = "window.parent.parent.GLOBALJSFRAME";
	var ret3 = "window.parent.parent.parent.GLOBALJSFRAME";

	if(typeof window.GLOBALJSFRAME != "undefined") {
			 finalRet = ret0;
	}
	else if(typeof window.parent.GLOBALJSFRAME != "undefined"){
			 finalRet = ret1;
	}
	else if(typeof window.parent.parent.GLOBALJSFRAME != "undefined"){
			 finalRet  = ret2;
	}
	else if(typeof window.parent.parent.parent.GLOBALJSFRAME != "undefined") {
			 finalRet = ret3;
	}
	else{
			 alert("GLOBALJSFRAME not set");
	}

	return finalRet;
 }

/**
 * function     - setSValuePrint
 * @usage       - setSValuePrint(<name|value>)
 * @description - call this function to set value(s) in session
 */
 
function setSValuePrint(input){
        var corParent;
        var inpArr = input.split("|");
        var inpCount = inpArr.length;
        var retVal;
        var count = 0;
        var flg = 'Y';
        for(var i = 0; (i+1) < inpCount; i=(i+2))
        {
                if((inpArr[i] == "")&&(inpArr[i+1]==""))
                {
                        flg = 'N';
                }
                corParent = returnCorrectFramePrint();
                corParent += ".setInGlobal";
                eval(corParent).call(this,inpArr[i],inpArr[i+1]);
                count = i+2;
        }
                if((count == inpCount)&&(flg == 'Y'))
                {
                        retVal = 0;
                }
        if(retVal != "0")
        {
                alert("Error has Occured, Please Retry Menu Option");
        }
        return retVal;
}

/**
 * function     - getSValuePrint
 * @usage       - getSValuePrint(<name>)
 * @description - call this function to get value from session
 */
 function getSValuePrint(input)
{
        var corParent;
        var returnString = "";
        var inpArr = [];

        if(input.indexOf("|") != -1)
        {
                inpArr = input.split("|");
        }
        else
        {
            inpArr[0] = input;
        }

        var inpCount = inpArr.length;

        for(i = 0; i < inpCount; i++)
        {
                var getValStr = "";
                corParent = returnCorrectFramePrint();
                corParent += ".getInGlobal";
                getValStr = eval(corParent).call(this,inpArr[i]);
                if(typeof(getValStr)== 'undefined'){
                        getValStr = "null";
                }
                if (i > 0)
                {
                        returnString+="|"+getValStr;
                }
                else
                {
                        returnString = getValStr;
                }
        }
        return returnString;
}

/**
 * function     - delSValuePrint
 * @usage       - delSValuePrint(<name>)
 * @description - call this function to remove value(s) from session
 */
function delSValuePrint(input)
{
        var corParent;
        var inpArr = [];

        if(input.indexOf("|") != -1)
        {
                var inpArr = input.split("|");
        }
        else
        {
                inpArr[0] = input;
        }
        var inpCount = inpArr.length;

        for(i = 0; i < inpCount; i++)
        {
                corParent = returnCorrectFramePrint();
                corParent += ".deleteInGlobal";
                getValStr = eval(corParent).call(this,inpArr[i]);
        }

        return 0;
}


#Modifying 