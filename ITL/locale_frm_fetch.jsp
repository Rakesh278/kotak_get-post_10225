<%@ page contentType="text/html; charset=utf-8" %>
<%!
	public static final String _ARJSP_JSP_NAME = "locale/jsp/locale_frm_fetch.jsp";
%>

<%@ include file="../../finbranch_common.jsp" %>
<%@ page errorPage="../../arjspmorph/error_page.jsp" %>
<%@ page import="com.infy.bbu.jsputil.*" %>
<arjsp:init groupName="arjspmorph" isEntryPoint="false" />

<%
	String sProfileId 	= ProfilesManager.getProfileInSession(session);
	String _ARJSP_TITLE_NAME = CommonFunctions.getLiteral(ARJspCurr,pageContext,"finbranch","FLT000041");
%>

<html>

<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
<title><%=_ARJSP_TITLE_NAME%></title> 
<LINK href="../../Renderer/stylesheets/services.css" rel=STYLESHEET title="Finacle Stylesheet" type=text/css />
<%@ include file="../../javascripts/coredomain.js" %>
<script type="text/javascript" src="../../javascripts/locale_script_functions.js"></script>
<script language="javascript" src="../../Renderer/javascripts/<%=VRPKeys.getFile("login_common_functions.js",sProfileId)%>" > </script>

</head>

<%
	String qryStr  = request.getQueryString();
%>

<frameset rows="100%,0%">
	<frame name="dummy_fetch" src="locale_dummy_frm_fetch.jsp?isPopUp=Y" marginwidth="10" marginheight="10" scrolling="no" frameborder="0">
	<frame hidden name="fetch" src="locale_fetch.jsp?<%=qryStr%>" marginwidth="10" marginheight="15" scrolling="auto" frameborder="0">
</frameset>
</html>

