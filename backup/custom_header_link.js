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


function writeLayer()
{

   with(document) {
   write('<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" class="cbody" onLoad="MM_preloadImages(\'../Renderer/images/'+applangcode+'/toptile.gif\',\'../Renderer/images/'+applangcode+'/logo_new.gif\',\'../Renderer/images/'+applangcode+'/leftcurve.gif\',\'../Renderer/images/'+applangcode+'/rightcurve.gif\',\'../Renderer/images/'+applangcode+'/bottomtile.gif\',\'../Renderer/images/'+applangcode+'/UBSI.gif\',\'../Renderer/images/'+applangcode+'/X.gif\',\'../Renderer/images/'+applangcode+'/search_icon.gif\',\'../Renderer/images/'+applangcode+'/calender.gif\',\'../Renderer/images/'+applangcode+'/bullet.jpg\');" onResize="adjustMenuDiv();" >');
   write('<table width="100%" border="0" cellpadding="0" cellspacing="0" background="../Renderer/images/'+applangcode+'/toptile.gif">');
   write('<tr>');
   write('<td width="32%" rowspan="2" valign="top" ><img src="../Renderer/images/'+applangcode+'/logo_new.gif"></td>');
   write('<td width="68%" height="17" align="right" valign="top">');
   write('<table border="0" cellpadding="0" cellspacing="0" >');
   write('<tr>');
   write('<td colspan="12" style="background-image:url(../Renderer/images/'+applangcode+'/dotstile.gif); background-repeat:repeat-x;"><spacer type="block" width="1" height="1"></spacer></td>');
   write('</tr>');
   write('<tr>');
   write('<td><img src="../Renderer/images/'+applangcode+'/arrow.gif" width="18" height="17"></td>');
   write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
		showMenu();
		showHome();
   write('</tr>');
   write('</table></td>');
   write('</tr>');

   write('<tr>');
   write('<td align="right">&nbsp;&nbsp;</td>');
   write('</tr>');

   write('<tr>');
   write('<td colspan="2" background="../Renderer/images/'+applangcode+'/bottomtile.gif"><table width="100%" border="0" cellpadding="0" cellspacing="0">');
   write('<tr>');
   write('<td width="30%"><img src="../Renderer/images/'+applangcode+'/UBSI.gif" width="275" height="23" border="0"></td>');
   write('<td width="70%" align="right">');
   write('<table width="100%" border="0" cellpadding="0" cellspacing="0">');
   write('<tr>');
   write('<td align="right" class="titletxt">');
   write(headDate+' &nbsp| &nbsp USER &nbsp'+headUserId+' &nbsp');
   write('</td>');
   write('</tr>');
   write('</table>');
   write('</td>')
   write('</tr></table>')
   write('</td>');
   write('</tr>');
   write('</table>');
   write("<div id='menutree_div' style='position:absolute; width:263px; z-index:0; left: 0px; top:62px; visibility: hidden;' border=0>");
   write('<table id="mtitle_tab" width="100%" border="0" cellspacing="0" cellpadding="1">');
   write('<tr><td width="57%" align="right" bgcolor="#9AB4CB">Menu</td>');
   write('<td width="43%" align="right" bgcolor="#9AB4CB"><img src="../Renderer/images/'+applangcode+'/X.gif" alt="Close" width="15" height="14" border="0" onClick="HIDE_menutree()" style="cursor:hand" hspace="0"></td>');
   write('</tr></table>');
	write("<iframe id='menutree' frameborder='0' marginheight='0' marginwidth='0' scrolling='auto' height='100%' width='100%' src='javascript:false;'></iframe></div>");
	write("<div id='cancelwait_div' style='position:absolute; width:100px; height:100px; z-index:0; visibility:hidden;'>");
	write("<iframe name='cancelwait' id='cancelwait' frameborder='0' marginheight='0' marginwidth='0' scrolling='no' height='100%' width='100%' src='javascript:false;'></iframe></div>");
   write('</body>');
   }
}

function showMenu() {
	with (document) {
	write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
	write('<td class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a id="anc_menu" href="javascript:fnCallMainMenu();" class="topnavi" >MENU</a></td>');
	}
}

function showHome() {
	with (document) {
	write('<td width="1"><img src="../Renderer/images/'+applangcode+'/divider_topnavi.gif" width="1" height="17"></td>');
	write('<td class="topnavi_bottom" onmouseover="this.className=\' bgTd \' " onMouseOut="this.className=\' topnavi_bottom \' "><a id="anc_home" href="javascript:fnCallHome();" class="topnavi" >Home</a></td>');
	}
}

function fnCallMainMenu() {

	var url = strBaseRef + finContextPath + "/MainMenu.jsp";
	
	document.location.href = jsUtil.formatUrl(url);
}

function fnCallHome(){
	document.location.href = jsUtil.formatUrl(strHomeUrl);
}
