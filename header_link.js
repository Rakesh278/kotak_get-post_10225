var menuAlreadyInvoked = false;
var iMemopad = 0;
var MEMOPAD_NONE = 0;
var MEMOPAD_NORMAL = 500;
var MEMOPAD_BG = 501;
var MEMOPAD_NORMAL_BG = 502;
var isMenuInvoked = false;
var header_link_menu = "";
var miscMenu = [
["HOME","U|1||HOME Menu|onsmainblank/onsmainblank_ctrl.jsp| |||B"]
,["FABMNU","M|1||Finacle@Branch Menu|| |||"]
,["FAVMNU","M|1||Favorites !|| |||"]
]
var action = null;
var glbmenuSCObj=null;
var glbmenuName=null;
var glbretArr=null;
var glbparams=null;
var isHome =null;
function getMenuTreeData() {
	var sUrl = "../arjspmorph/"+applangcode+"/mtree_fetch.jsp";
	var xMax = screen.width, yMax = screen.height;
	var xOffset = (xMax - 120), yOffset = (yMax - 150);
	var params = "dialogWidth=0px;dialogHeight=0px;dialogLeft="+xOffset+"px;dialogTop="+yOffset+"px";
	params += ";status=no;toolbar=no;menubar=no;resizable=yes;help=no;center=no";
	if(window.showModalDialog){
		var retVal = "";
		if("Microsoft Internet Explorer" == browser_name)	
			retVal = window.showModalDialog(jsUtil.formatUrl(sUrl),document.forms[0],params);
		else{
			sUrl = getAbsoluteUrl(sUrl);
			retVal = window.showModalDialog(jsUtil.formatUrl(sUrl),document.forms[0],"width=10px,height=10px,modal=yes,top="+yOffset+"px,left="+xOffset+"px,scrollbars=yes,toolbar=no,menubar=no,help=no");
		}
	if (retVal == undefined || retVal == null) {
			alert(finbranchResArr.get("FAT001740"));
	 return;
	 }
	 else{
		userMenuTreeObj.setMenuProps(retVal[0], retVal[1], retVal[2], retVal[3], retVal[4], retVal[5], retVal[6], retVal[7], miscMenu);
		userSCMenuTreeObj.setMenuSCProps(retVal[0],retVal[8], retVal[9], retVal[10], retVal[11],retVal[12]);
		menuInfoDownloaded = true;
		}
	}
	else
		window.open(jsUtil.formatUrl(sUrl),"title","width=10px,height=10px,modal=yes,top="+yOffset+"px,left="+xOffset+"px,scrollbars=yes,toolbar=no,menubar=no,help=no");	
}
//++ added as part of hot key implementation
var flag = true;
function mKeyPress()
{
	if(flag == true)
	{
		fnHtmlMenu();
		flag = false;
	}
	else
	{
		var curcss = get_lyr_css("menutree");
		if(curcss.display=="none")
		{
			fnHtmlMenu();
			flag = false;
		}
		if(curcss.display=="")
		{
			HIDE_menutree();
			flag = true;
			return;
		}
	}
}
//-- added as part of hot key implementation
function fnHtmlMenu() {
	adjustMenuDiv();
	if (eval(isBackGround) != undefined && !isBackGround){
		if (!menuInfoDownloaded) {
			getMenuTreeData();
			if (!menuInfoDownloaded) {
				return;
			}
		}
	}
	/*getMenuTree is called only if disableMenuTree is noy Y. disableMenuTree
	 * is set depending on Application.properties DISABLE_MENU_TREE value*/
	if(disableMenuTree != 'Y')
	getMenuTree();
}
function getMenuTree(){
	var mtDiv = document.getElementById("menutree_div");
    var hid = mtDiv.style.visibility;
    if (hid=='visible')
    {
        var mtLyr = get_lyr_css("menutree");
        if (mtLyr) mtLyr.display="";
        mtLyr = get_lyr_css("mtitle_tab");
        if (mtLyr) mtLyr.display="";
        var mtFrame = window.frames[0];
        mtFrame.prevEventDate = new Date();
        mtFrame.handleTimers();
    }
    if (hid=='hidden') {
        var mtLyr = document.getElementById("menutree");
        if(mtLyr) mtLyr.src='../arjspmorph/' + applangcode +'/sidepanel.jsp?rtId=' + rtId;
    }
	showMenuTreeForNonIE();
}
function fnCallMainMenu() {
	handleWindowDisplay(finConst.DISPLAYPARENT);
}
function fnGo(sAction,event) {
	if ((sAction != 'Go') && (getEvtKeyCode(event) != enterKey))
		return true;
	if (isMenuInvoked) {
        var locMenu = document.forms[0].menuName.value;
        locMenu = (fnTrim(locMenu)).toUpperCase();
        header_link_menu = (fnTrim(header_link_menu)).toUpperCase();
        if (header_link_menu == locMenu) {
            return true;
        }
        isMenuInvoked = false;
        header_link_menu = "";
    }
	// to handle enterkey in browsers other than IE
	if("Microsoft Internet Explorer" != browser_name){
		sAction = 'Go';
	}
	if(!menuAlreadyInvoked){
		if (displayMenuShortcutBar == 'Y') {
			document.forms[0].gotomenu.disabled = true;
		}
		document.forms[0].menuName.focus();
		menuAlreadyInvoked = true;

	}else{
		return true;
	}

	handleMenuDisplay(document.forms[0].menuName.value, true, null,sAction);
}
function handleMenuDisplay(menuName, isHdrMenu, params, sAction)
{
	action = sAction;
	/*getMenuTree is called only if disableMenuTree is noy Y. disableMenuTree
	 * is set depending on Application.properties DISABLE_MENU_TREE value*/
	if(action==true && disableMenuTree !='Y'){
		getMenuTree();
	}
	else
	{
		var frm = document.forms[0];
		if (isHdrMenu == undefined || isHdrMenu == null) {
			isHdrMenu = false;
		}
		menuName = fnTrim(menuName);
		if (fnIsNull(menuName)) {
			if (isHdrMenu) frm.menuName.focus();
			return false;
		}
		menuName = menuName.toUpperCase();
		if (isHdrMenu && eval(isBackGround) != undefined && !isBackGround){
			if (!menuInfoDownloaded) {
				getMenuTreeData();
				if (!menuInfoDownloaded) {
					return false;
				}
			}
		}
		var menuObj = userMenuTreeObj;
		var menuSCObj = userSCMenuTreeObj;
		var retArr = new Array();
		glbmenuSCObj = menuSCObj;
		glbmenuName = menuName;
		glbretArr = retArr;
		glbparams = params;

		if (!validateMenuOption(menuSCObj, menuName, isHdrMenu, retArr))
	        {
	        //  alert("returning false from validateMenuOption()");
	            return false;
        	}
		
		//menuName = document.forms[0].menuName.value;
		var locParams = "";

		if (params != undefined && !fnIsNull(params)) 
		{
			locParams = params;
			if (retArr['authtok'] != undefined) 
			{
				locParams = locParams + "&authtok=" + retArr['authtok'] + "&authuser=" + retArr['authuser'] + "&ssosessionid=" + retArr['ssosessionid'];
			}
		}
		else
		{
			if (retArr['authtok'] != undefined) 
			{
				locParams = "authtok=" + retArr['authtok'] + "&authuser=" + retArr['authuser'] + "&ssosessionid=" + retArr['ssosessionid'];
			}
		}
		menuName = menuName.toUpperCase();
		
		displayMenu(menuSCObj, menuName, locParams);					   
	}
}

function validateMenu(menuObj, menuName, isHdrMenu, retArr)
{
	var frm = document.forms[0];
	var invalidChars = /[^A-Z0-9]/;  //anything other than [A-Z] or [0-9]
	var invalidCharsFound = invalidChars.test(menuName);
	if(invalidCharsFound) {
		alert(finbranchResArr.get("FAT000484"));
		if (isHdrMenu) frm.menuName.focus();	
		return(false);
	}
	/* Included this function for the redirection of menu options*/
	if (eval("this.cust_convertMenuOption") != undefined) {
		menuName = cust_convertMenuOption(menuName);
	}
	document.forms[0].menuName.value = menuName.toUpperCase();
	if (menuObj.isBgMode())
	{
		if (menuName == finConst.HOME_MENU)
		{
			alert(finbranchResArr.get("FAT002367"));
			if (isHdrMenu) frm.menuName.focus();
			return(false);
		}
	}
	var ctrlArr = menuObj.getMenuInfo(menuName);
	if (ctrlArr == null)
	{
		alert(finbranchResArr.get("FAT002367"));
		if (isHdrMenu) frm.menuName.focus();
		return(false);
	}
	/* this is done in order to check if the entered menu short cut is a parent menu option*/
	if (ctrlArr[0] == finConst.MOD_MENU) {
		alert(finbranchResArr.get("FAT002367"));
		if (isHdrMenu) frm.menuName.focus();
		return(false);
	}
	var ret = ctrlArr[8];
	var isFinMenu = false;
	var isFabMenu = false;
	var isBothMenu = false;
	var ret = ctrlArr[8];
	if (ret == finConst.BOTH_PREC)
		isBothMenu = true;
	else if (ret == finConst.FAB_PREC)
		isFabMenu = true;
      	else
            isFinMenu = true;
      if (isBothMenu && !isLoggedInFin)
      {
            if (!isLoggedInFab)
            {
		   alert(finbranchResArr.get("FAT000248"));
		   if (isHdrMenu) frm.menuName.focus();
               return(false);
            }
      }
      if (isFinMenu && !isLoggedInFin)
      {
            alert(finbranchResArr.get("FAT000670"));
		if (isHdrMenu) frm.menuName.focus();
		return(false);
	}
	if (isFabMenu && !isLoggedInFab)
	{
		alert(finbranchResArr.get("FAT000249"));
		if (isHdrMenu) frm.menuName.focus();
		return(false);
	}
	var passWordFlg = ctrlArr[9];
	if (passWordFlg == finConst.YES && !validatePassword(retArr))	{
		return;
	}
	if (modifiableFldExists()) {
		if (!confirm(finbranchResArr.get("FAT002028"))) {
			if (isHdrMenu) frm.menuName.focus();
			return false;
		}
	}
	return true;
}
function validateMenuOption(menuSCObj, menuName, isHdrMenu, retArr)
{
	var frm = document.forms[0];

	var frm = document.forms[0];
	var invalidChars = /[^A-Z0-9]/;  //anything other than [A-Z] or [0-9]
	var invalidCharsFound = invalidChars.test(menuName);
	if(invalidCharsFound) {
		alert(finbranchResArr.get("FAT000484"));
		if (isHdrMenu) frm.menuName.focus();
		return(false);
	}


	var ctrlArr = menuSCObj.getMenuSCInfo(menuName);
	if (ctrlArr == null)
	{    
		alert(finbranchResArr.get("FAT002367"));
		if (isHdrMenu) frm.menuName.focus();
		return(false);
	}

	var isFinMenu = false;
	var isFabMenu = false;
	var isBothMenu = false;
	var ret = ctrlArr[3];
	if (ret == finConst.BOTH_PREC)
		isBothMenu = true;
	else if (ret == finConst.FAB_PREC)
		isFabMenu = true;
	else
		isFinMenu = true;
	if (isBothMenu && !isLoggedInFin)
	{
		if (!isLoggedInFab)
		{
		   alert(finbranchResArr.get("FAT000248"));
		   if (isHdrMenu) frm.menuName.focus();
		   return(false);
		}
	}
	if (isFinMenu && !isLoggedInFin)
	{
		alert(finbranchResArr.get("FAT000670"));
		if (isHdrMenu) frm.menuName.focus();
		return(false);
	}
	if (isFabMenu && !isLoggedInFab)
	{
		alert(finbranchResArr.get("FAT000249"));
		if (isHdrMenu) frm.menuName.focus();
		return(false);
	}
	if (modifiableFldExists()) {
		if(!confirm(finbranchResArr.get("FAT002028"))){
			if (isHdrMenu) frm.menuName.focus();
			return false;
		}	
	}
	ctrlArr = ctrlArr.split("|")
	var passWordFlg = ctrlArr[5];
	if (passWordFlg == finConst.YES && !validatePassword(retArr))	{
		return;
	}
	return true;
}


function modifiableFldExists()
{
	var bFldsModifiable = false;
	var frmElements = document.forms[0].elements;
	var totalElements = frmElements.length;
	var currElement;
	/* Go through the complete list of form elements and check if atleast 1
	 * form field is editable. In the list of form elements, ignore those
	 * elements whose input-type belongs to any of the following:
	 * ---> button, hidden, reset, submit & image.
	 * Also, apart from the above the menu-shortcut field itself should be
	 * ignored always. */
	for (var i=0; i<totalElements; i++) {
		currElement = frmElements[i];
		if (currElement.name == "menuName") {
			continue;
		}
		var type = (currElement.type).toLowerCase();
		if (type != "button" && type != "hidden" && type != "reset"
				&& type != "submit" && type != "image")
		{
			var isFldEnabled = (currElement.disabled != undefined && !currElement.disabled) &&
				(currElement.readOnly != undefined && !currElement.readOnly);
			if (isFldEnabled) {
				bFldsModifiable = true;
				break;
			}
		}
	}
	return bFldsModifiable;
}
function displayMenu_Old(menuObj, menuName, params)
{
	var ctrlArr = menuObj.getMenuInfo(menuName);
	var isFabMenu = (ctrlArr[8] == finConst.FAB_PREC);
	
	if (isFabMenu && fabBaseUrl != "") {
		var arr = strBaseRef.split("//");
		invokeFAB(FinAvailFlg,ctrlArr, menuName, params ,arr[0]);
		return;
		}
	
	if (menuObj.isBgMode()) {
		callbgmenu(ctrlArr[4], menuName, ctrlArr[6], ctrlArr[7], ctrlArr[8], params);
		return;
	}
	var url = getMenuUrl(menuName, ctrlArr);
	if (params != undefined && !fnIsNull(params)) {
		/* params will be passed in case of context switching */
		url += "&" + params;
	}
	header_link_menu = document.forms[0].menuName.value;
    isMenuInvoked = true;
	document.location.href = jsUtil.formatUrl(url);
}
function getMenuUrl_Old(menuName, ctrlArr)
{
	var ctrlLen   = ctrlArr.length;
	var isFinMenu = false;
	var isFabMenu = false;
	var isBothMenu = false;
	var ret = ctrlArr[8];
	if (ret == finConst.BOTH_PREC)
		isBothMenu = true;
	else if (ret == finConst.FAB_PREC)
		isFabMenu = true;
	else
		isFinMenu = true;
	var arr = strBaseRef.split("//");
	var baseHref = strBaseRef + finContextPath + "/";
	
	if (finBaseUrl == ""){
	
	var url = baseHref + ctrlArr[4] + '?sessionid='+sessionid+'&sectok='+sectok;
	}
	else{
	
	var url = arr[0] + "//" + finBaseUrl + "/" + ctrlArr[4] + '?sessionid='+sessionid+'&sectok='+sectok;
	}
	if (isLoggedInFin) {
		url += '&finsessionid='+finsessionid;
	}
	else {
		url += '&finsessionid=';
	}
	if (isLoggedInFab) {
		url += '&fabsessionid='+fabsessionid;
	}
	else {
		url += '&fabsessionid=';
	}
	url += '&mo='+menuName;
	if (ctrlLen>=7 && ctrlArr[6] != "") {
		url += '&mtype='+ctrlArr[6];
	}
	if (ctrlLen>=8 && ctrlArr[7] != "") {
		url += '&sid='+ctrlArr[7];
	}
	if (isFabMenu || isBothMenu) {
		url += '&mprec='+ctrlArr[8];
	}
	if (ctrlLen>=11 && ctrlArr[10] != "") {
		url += '&mid='+ctrlArr[10];
	}
	return url;
}
function displayMenu(menuSCObj, menuName, params)
{
    var grpArr = menuSCObj.getMenuSCInfo(menuName);
	var menuObj = userMenuTreeObj;

    grpArr = grpArr.split("|");
    var grpName = grpArr[0];
 	var grpNameCtrl = grpName+ "/" + grpName + "_ctrl.jsp";
	
	if (menuObj.isBgMode()) {
    	callbgmenu(grpNameCtrl, menuName, grpArr[2], grpArr[1], grpArr[3], params);
    	return;
    } 
      
    var sid = null;
    if((grpName == "inquiry") || (grpName == "filemnt") || (grpName == "batch") || (grpName == "radfx"))
        sid = grpArr[1]

    var url = getMenuUrl(menuName, grpArr, sid);
    if (params != undefined && !fnIsNull(params)) {
        /* params will be passed in case of context switching */
        url += "&" + params;
    }
    header_link_menu = document.forms[0].menuName.value;
    isMenuInvoked = true;
	if (displayMenuShortcutBar == 'Y') {
		document.forms[0].gotomenu.disabled = true;
	}
    if(prodEnv=="Y"){
    	submitInPost(jsUtil.formatUrl(url));
    }else{
    	document.location.href = jsUtil.formatUrl(url);
    }

}
function getMenuUrl(menuName, grpArr, sid)
{
    //var ctrlLen   = ctrlArr.length;
    var isFinMenu = false;
    var isFabMenu = false;
    var isBothMenu = false;
    var grpName = grpArr[0];
    var ret = grpArr[3];
    if (ret == finConst.BOTH_PREC)
    	isBothMenu = true;
    else if (ret == finConst.FAB_PREC)
      isFabMenu = true;
    else
        isFinMenu = true;
    var arr = strBaseRef.split("//");
    var baseHref = strBaseRef + finContextPath + "/";

    	var jspName = grpName + "/" + grpName + "_ctrl.jsp";
    if (finBaseUrl == ""){

    
    	var url = baseHref + jspName + '?sessionid='+sessionid+'&sectok='+sectok;
    }
    else{

        var url = arr[0] + "//" + finBaseUrl + "/" + jspName + '?sessionid='+sessionid+'&sectok='+sectok;
    }


    if (isLoggedInFin) {
        url += '&finsessionid='+finsessionid;
    }
     else {
            url += '&finsessionid=';
     }
     if (isLoggedInFab) {
     	url += '&fabsessionid='+fabsessionid;
     }
     else {
     	url += '&fabsessionid=';
     }
     url += '&mo='+menuName;
     if(sid != null)
     	url += "&sid="+sid;

	 if (grpArr[1] != "" && grpArr[6] != "" ) {
          url += '&PLOC='+grpArr[6];
     }
     
     if (grpArr[1] != "") {
     	url += '&mtype='+grpArr[2];
     }
     if (isFabMenu || isBothMenu) {
     	url += '&mprec='+grpArr[3];
     }
     if (grpArr[4] != "") {
     	url += '&mid='+grpArr[4];
     }
     if (grpArr[7] != "") {	
		url += '&litContext='+grpArr[7];
	 }
	 if (grpArr[8] != "") {
	 	url += '&sSubGrpName='+grpArr[8];
	 }	
     return url;
}

function writeLayer()
{
	var isBG = eval(isBackGround) != undefined && isBackGround;
	var isFG = !isBG;
	with(document) {
		if(isPrintPage != undefined && !isPrintPage){
			write('<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" class="cbody" onLoad="MM_preloadImages(\'../Renderer/images/'+applangcode+'/toptile.gif\',\'../Renderer/images/'+applangcode+'/logo_new.gif\',\'../Renderer/images/'+applangcode+'/leftcurve.gif\',\'../Renderer/images/'+applangcode+'/rightcurve.gif\',\'../Renderer/images/'+applangcode+'/bottomtile.gif\',\'../Renderer/images/'+applangcode+'/UBSI.gif\',\'../Renderer/images/'+applangcode+'/X.gif\',\'../Renderer/images/'+applangcode+'/search_icon.gif\',\'../Renderer/images/'+applangcode+'/calender.gif\',\'../Renderer/images/'+applangcode+'/bullet.jpg\');" onResize="adjustMenuDiv();" >');
			write('<table width="100%" border="0" cellpadding="0" cellspacing="0" background="../Renderer/images/'+applangcode+'/toptile.gif">');
			write('<tr>');
			if (displayMenuShortcutBar == 'Y') {
			write('<td width="20%" rowspan="2" valign="top" ><img src="../Renderer/images/'+applangcode+'/logo_new.gif"></td>');
			}
			write('<td width="80%" ')
				if (dir == 'rtl')
				{
					write('align="left"');
				}
				else {
					write('align="right"');
				}
			write('valign="top">');
			write('<table border="0" cellpadding="0" cellspacing="0" >');
			write('<tr>');
			write('<td colspan="12" style="background-image:url(../Renderer/images/'+applangcode+'/dotstile.gif); background-repeat:repeat-x;"><spacer type="block" width="1" height="1"></spacer></td>');
			write('</tr>');
			write('<tr>');
			write('<td><img src="../Renderer/images/'+applangcode+'/arrow.gif" width="18" height="17"></td>');
			write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
			if (!isONSLogin) {
				showMainMenu();
			}
			if(isHome != "Y")
			{
				showLandingPage();
			}
			if (isFG) {
				showMenu();
			}
			if	(isLoggedInFin)	{
				switch (iMemopad) {
					case MEMOPAD_NONE:
						showMemo();
						if(!isBG)
						{
							showBg();
						}
						if (!isFG) {
							exitBg();
						}
						break;
					case MEMOPAD_NORMAL:
						if (isFG) {
							exitMemo();
						}
						else {
							showMemo();
							showBg();
							exitBg();
						}
						break;
					case MEMOPAD_BG:
						if (isBG) {
							exitMemo();
						}
						break;
				}
				showCCY();
			}
			if (isProdEnv == undefined || isProdEnv != 'Y' || isProdEnv == "") {  
				write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');  
				write('<td>&nbsp;&nbsp;'+"locale"+'&nbsp;&nbsp;'+jsUtil.encodeChar(localeCode)+'&nbsp;&nbsp;</td>');  
			}  
			write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');  
			write('<td>&nbsp;&nbsp;'+jsUtil.encodeChar(headDate)+'&nbsp;&nbsp;</td>');  
			write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');  
			write('<td>&nbsp;&nbsp;'+jsUtil.encodeChar(headCtxSol)+'&nbsp;&nbsp;</td>');  
			write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
			write('<td>&nbsp;&nbsp;'+jsUtil.encodeChar(contextBankId)+'&nbsp;&nbsp;</td>');
			write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');  
			write('</tr>');
			write('</table></td>');
		//  write('</tr>');
		//	write('<tr>');
			write('<td colspan="2"></td>');
			write('</tr>');
		}
		write('<tr>');
		write('<input type="hidden" name="bgMenuUrl">');
		if (displayMenuShortcutBar == 'Y') {
		write('<td colspan="2" background="../Renderer/images/'+applangcode+'/bottomtile.gif"><table width="100%" border="0" cellpadding="0" cellspacing="0">');
		write('<tr>');
		write('<td width="30%"><img src="../Renderer/images/'+applangcode+'/UBSI.gif" width="275" height="23" border="0"></td>');
		write('<td width="70%"')
		/* Changes done for enabling multi lingual display */
		/* dir check done to display the details with reversed header for */
		/* languages like ARABIC */
		/* As a part of ticket 224212 */
			if (dir == 'rtl')
			{
				write('align="left">');
			}
			else {
				write('align="right">');
			}
		write('<table border="0" cellpadding="0" cellspacing="0">');
		write('<tr>');
		write('<td class="titletxt">');
		write('<table border="0" cellpadding="0" cellspacing="0">');
		write('<tr>');
		/*if (isProdEnv == undefined || isProdEnv != 'Y' || isProdEnv == "") {
			write('<td>'+"locale"+'&nbsp;&nbsp;'+jsUtil.encodeChar(localeCode)+'</td>');
			write('<td class="textfieldspcms">|</td>');
		}
		write('<td>'+jsUtil.encodeChar(headDate)+'</td>');
		write('<td class="textfieldspcms">|</td>');*/
		write('<td>'+jshRes.FLT002159 + '&nbsp;&nbsp;'+jsUtil.encodeChar(headUserId)+'</td>');
		write('<td class="textfieldspcms">|</td>');
		/*write('<td>'+jsUtil.encodeChar(headCtxSol)+'</td>');
		write('<td class="textfieldspcms">|</td>');*/
		write('</tr>');
		write('</table>');
		write('</td>');
		write('<td class="textlabelms">' + jshRes.FLT009122 + ':</td>');
		write('<td class="textfieldms"><input name="menuName" id="menuName" type=TEXT class="textfieldfontms" ')
			if(isMenuShrtcutProt=='Y' || isPopupWindow()) {
				write(' disabled ');
			}
		write('size="9" maxlength=8 onKeyDown = "fnGo(\'\',event)">')
		write('</td>');
		write('<td class="textfieldbtnms"><input id="gotomenu" type="button" name="gotomenu" ')
			if(isMenuShrtcutProt=='Y' || isPopupWindow()) {
				write(' disabled ');
			}
		write('value="' + jshRes.FLT000885 + '" class="buttonms"  onClick = "fnGo(\'Go\')">&nbsp;</td>');
		write('</tr>');
		write('</table>');
		write('</td>')
			write('</tr></table>')
			write('</td>');
		write('</tr>');
		}
		else {
			write('<input type="hidden" id="menuName" name="menuName" value="">');
		}
		
		write('</table>');
		if(isPrintPage != undefined && isPrintPage){
			write('<body>');
		}
		write("<div id='menutree_div' style='position:absolute; width:263px; z-index:0; left: 0px; top:62px; visibility: hidden;' border=0>");
		write('<table id="mtitle_tab" width="100%" border="0" cellspacing="0" cellpadding="1">');
		write('<tr><td width="57%" align="right" bgcolor="#9AB4CB">Menu</td>');
		write('<td width="43%" align="right" bgcolor="#9AB4CB"><img src="../Renderer/images/'+applangcode+'/X.gif" alt='+finbranchResource.FAT001041+' width="15" height="14" border="0" onClick="HIDE_menutree()" style="cursor:hand" hspace="0"></td>');
		write('</tr></table>');
		write("<iframe name='menutree' id='menutree' frameborder='0' marginheight='0' marginwidth='0' scrolling='auto' height='100%' width='100%' src='javascript:false;'></iframe></div>");
		write("<div id='cancelwait_div' style='position:absolute; width:100px; height:100px; z-index:0; visibility:hidden;'>");
		write("<iframe name='cancelwait' id='cancelwait' frameborder='0' marginheight='0' marginwidth='0' scrolling='no' height='100%' width='100%' src='javascript:false;'></iframe></div>");
		write('</body>');
	}
}
function adjustMenuDiv()
{
	var mtDiv = document.getElementById("menutree_div");
	mtDiv.style.height = document.body.clientHeight-79;
}
function fnMenuHdr(frmAction,isBG)
{
	frm = document.forms[0];
	if(frm.screenName != undefined && pre_HDR_SWITCH(frm.screenName.value, frmAction) == false) {
		return false;
	}
	if (isBG == "true" && !menuInfoDownloaded) {
		getMenuTreeData();
		if (!menuInfoDownloaded) {
			return;
		}
	}
	doSubmit(frmAction);
	if(frm.screenName != undefined && post_HDR_SWITCH(frm.screenName.value, frmAction) == false) {
		return false;
	}
}
function exitBgMenu()
{
	doSubmit("showbgparent");
}
function callbgmenu(ctrlName, menu, mtype, sid, mprec, params)
{
	var ctrlArr = ctrlName.split("/");
	var group = "";
	if (ctrlArr.length > 0) {
		group = ctrlArr[0]; //If group is empty, then it is a error.
	}

	var bgMenu = userMenuTreeObj.getBgMenu();
	var len = bgMenu.length;
	var key = "", arr = "";
	var foundinbglist = false;

	for (var i=0; i<len; i++)
	{
		key = bgMenu[i][0];
		if (key == menu)
		{
			foundinbglist=true;
			break;
		}
	}
	if(foundinbglist == false)
	{
		alert(finbranchResArr.get("FAT002726"));
		return;
	}

	if (bgParentGroup == group) {
		alert(finbranchResArr.get("FAT002726"));
		return false;
	}
	var url = '/' + ctrlName;
	//sectok parameter is purposefully not passed as request parameter to
	//avoid creation of new stack in Background mode

        url += '?sessionid=' + sessionid + '&fabsessionid=' + fabsessionid + '&finsessionid=' + finsessionid + '&mo=' + menu + '&isBgMenu=Y';

	if (mtype != "") {
		url += '&mtype=' + mtype;
	}
	if (sid != "") {
		url += '&sid=' + sid;
	}
	if (mprec != "") {
		url += '&mprec=' + mprec;
	}
	if (params != undefined && !fnIsNull(params)) {
		url += "&" + params;
	}
	document.forms[0].bgMenuUrl.value = url;
	doSubmit('showbgmenu');
}
function MM_preloadImages() { //v3.0
	var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
		var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
			if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}
function MM_swapImgRestore() { //v3.0
	var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_findObj(n, d) { //v4.01
	var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
		d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
	if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
	for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
	if(!x && d.getElementById) x=d.getElementById(n); return x;
}
function MM_swapImage() { //v3.0
	var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
		if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
function HIDE_menutree(){
	var curcss = get_lyr_css("menutree");
	if (curcss) curcss.display="none";
	
	curcss = get_lyr_css("mtitle_tab");
	if (curcss) curcss.display="none";

	hideMenuTreeForNonIE();
}
function hideMenuTreeForNonIE()
{
	document.getElementById("mtitle_tab").style.zIndex = -1;
	document.getElementById("menutree").style.zIndex = -1;
	document.getElementById("menutree_div").style.zIndex = -1;

	document.getElementById("mtitle_tab").style.visibility = "hidden";
	document.getElementById("menutree").style.visibility = "hidden";
	document.getElementById("menutree_div").style.visibility = "hidden";	
}

function showMenuTreeForNonIE()
{
	document.getElementById("mtitle_tab").style.visibility = "visible";
	document.getElementById("menutree").style.visibility = "visible";
	document.getElementById("menutree_div").style.visibility = "visible";	
	document.getElementById("mtitle_tab").style.zIndex = 1;
	document.getElementById("menutree").style.zIndex = 1;
	document.getElementById("menutree_div").style.zIndex = 1;
}

function exitMemopad() {
	doSubmit("exitMP");
}
function doLogout() {
	handleWindowDisplay(finConst.DOLOGOUT);
}
function showMainMenu() {
	document.write('<td class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a id="anc_main" href="javascript:fnCallMainMenu();" class="topnavi" >' + jshRes.FLT003487 + '</a></td>');
}
function showMenu() {
	with (document) {
		write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
		write('<td class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a id="anc_html" href="javascript:fnHtmlMenu();" class="topnavi" >' + jshRes.FLT013652 + '</a></td>');
	}
}
function showMemo() {
	with (document) {
		write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
		write('<td id="showmemoleftcurve" class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' " ><a  id="anc_hdrm" href="javascript:fnMenuHdr(\'showmemopad\',\'false\');" class="topnavi">' + jshRes.FLT020843 + '</a></td>');
	}
}
function exitMemo() {
	with (document) {
		write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
		write('<td id="exitmemoleftcurve" class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a  id="anc_hmemo" href="javascript:exitMemopad();" class="topnavi">' + jshRes.FLT020844 + '</a></td>');
	}
}
function showBg() {
	with (document) {
		write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
		write('<td id="bgmenuleftcurve" class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a  id="anc_mhdr" href="javascript:fnMenuHdr(\'showbglist\',\'true\');" class="topnavi">' + jshRes.FLT020845 + '</a></td>');
	}
}
function exitBg() {
	with (document) {
		write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
		write('<td id="exitbgmenuleftcurve" class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a  id="anc_bgmn" href="javascript:exitBgMenu();" class="topnavi">' + jshRes.FLT020846 + '</a></td>');
	}
}
function showCCY() {
	with (document) {
		write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
		write('<td class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a id="anc_hcrnc" href="javascript:showCrncyConverter();" class="topnavi" >' + jshRes.FLT003104 + '</a></td>');
	}
}
/*
function showLogout() {
	with (document) {
		write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
		if("Y"!=IsFinacleLite)
			write('<td class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a id="anc_lgot" href="javascript:doLogout();" class="topnavi" >' + jshRes.FLT015139 + '</a></td>');
		write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
	}
}
*/
function validatePassword(retArr)
{
	var chk = true;
	if (SSO)
	{
		var retVal;
		var cb = function(retVal)
		{
			validatePassword_callback(retVal);
		}
		if(window.parent.getLoginFrame != undefined && window.parent.getLoginFrame() != undefined){
			retVal = window.parent.getLoginFrame().validateAuthorizerWithID(headUserId.toUpperCase(),"Authorizer Login Page",cb);
		}
		var token = (retVal != undefined) ? retVal['token'] : null;
		if (token != undefined && !fnIsNull(token)) {
			chk = true;
			retArr['authtok'] = token;
			retArr['authuser'] = retVal['user'];
			retArr['ssosessionid'] = getSSOSessId();
		}
		else {
			chk = false;
		}
	}
	return chk;
}
function validatePassword_callback(retVal)
{
	var token = (retVal != undefined) ? retVal['token'] : null;
	if (token != undefined && !fnIsNull(token)) {
		glbretArr['authtok'] = token;
		glbretArr['authuser'] = retVal['user'];
		glbretArr['ssosessionid'] = getSSOSessId();
	}
	else {
		return;
	}

	var locParams = "";

	if (glbparams != undefined && !fnIsNull(glbparams))
	{
		locParams = glbparams;
		if (glbretArr['authtok'] != undefined)
		{
			locParams = locParams + "&authtok=" + glbretArr['authtok'] + "&authuser=" + glbretArr['authuser'] + "&ssosessionid=" + glbretArr['ssosessionid'];
		}
	}
	else
	{
		if (glbretArr['authtok'] != undefined)
		{
			locParams = "authtok=" + glbretArr['authtok'] + "&authuser=" + glbretArr['authuser'] + "&ssosessionid=" + glbretArr['ssosessionid'];
		}
	}
	glbmenuName = glbmenuName.toUpperCase();

	displayMenu(glbmenuSCObj, glbmenuName, locParams);
}
function getDateForDisplay(dateVal, day, month, year)
{
    var hijriMonthDesc = new Array("FLT020962","FLT020963","FLT020964","FLT020965","FLT020966","FLT020967","FLT020968","FLT020969","FLT020970","FLT020971","FLT020973","FLT020974");
    var gregMonthDesc = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
    var locHeadDate = dateVal;
    var locDate = day + "-" + month + "-" + year;
    var convDate;
    var monthVal;
    var monthDesc;
    switch (calbase) {
        case "01":
            if (!isHijDate(locDate)) {
                convDate = convertGregToHij(locDate);
                monthVal = parseInt(convDate.substring(3,5), 10);
                monthDesc = eval("this.jshRes." + hijriMonthDesc[monthVal-1]);
                locHeadDate = convDate.substring(0,2) + " " + monthDesc + "," + convDate.substring(6,10);
            }
            break;
        case "02":
            if (!isBuddhaDate (locDate)) {
                convDate = convertGregToBuddha(locDate);
                monthVal = parseInt(convDate.substring(3,5), 10);
                monthDesc = gregMonthDesc[monthVal-1];
                locHeadDate = convDate.substring(0,2) + " " + monthDesc + "," + convDate.substring(6,10);
            }
            break;
        default:
            locHeadDate = dateVal;
            break;
    }
    return locHeadDate;
}

function getAbsoluteUrl(sUrl){
	var location = document.location.href;
	location = location.substring(0,location.lastIndexOf("/")+1);
	if(sUrl.indexOf("http://") == -1 && sUrl.indexOf("https://") == -1){
		sUrl = location + sUrl;
	}
	return sUrl;
}
function reEnablMnuShortCut(){
	menuAlreadyInvoked = false;
	if (displayMenuShortcutBar == 'Y') {
		document.forms[0].gotomenu.disabled = false;
	}
}

function showLandingPage(){ 
    document.write('<td class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a id="anc_Home" href="javascript:fnBacktoLandingPage();" class="topnavi" >' + "Home" + '</a></td>'); 
    document.write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>'); 
} 
    
function fnBacktoLandingPage() { 
    var baseHref = strBaseRef + finContextPath + "/"; 
    var landingpageUrl= baseHref + "onsmainblank/onsmainblank_ctrl.jsp"; 
    submitInPost(landingpageUrl+'?sessionid='+sessionid+'&sectok='+sectok+'&finsessionid='+finsessionid+'&fabsessionid='+fabsessionid+'&rtId='+rtId+'&reqId='+reqId+'&mo=HOME'); 
}  

