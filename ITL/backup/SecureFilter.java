package com.infy.finacle.fcutil;


import javax.servlet.Filter;
import javax.servlet.FilterConfig;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.FilterChain;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.util.Enumeration;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Random;
import java.io.PrintWriter;
import java.io.FileOutputStream;
import java.util.Date;
import applcommon.AppProperties;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.RequestDispatcher;
import java.util.ArrayList;
import java.security.spec.InvalidKeySpecException;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.Iterator;
import java.io.UnsupportedEncodingException;
import java.util.zip.Adler32;
import java.util.zip.Checksum;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.List;
import com.infy.bbu.ons.log.IFinLogger;
import com.infy.bbu.ons.log.LoggerCreator;
import com.infy.bbu.ons.log.LoggerImpl;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.File;
import FABCommon.SecurityInfo70;

public class SecureFilter implements Filter, SecurityConstants
{
	private FilterConfig config;
	private boolean isValidateCheckRqd;
	private boolean isSecureCheckReqd;
	private boolean isControlCharacterCheckReqd;
	private static String prodEnv;
	private String sContextPath;
	private String indexURL;
	private boolean isNewSession;
	private String restrictList;
	private String htmlRestrictList;
	private String securePermitList;
	private String dispName;
	private String dispStr;
	private String dispFieldName;
 	private String dispFieldValue;
 	private String logFile;
	private String encodeListFile;
	private boolean isSqlCheckReqd;
	private boolean isXssSqlLogOnly;
	private boolean isReqParamValReqd;
	private boolean isHttpMethodCheckReqd;
	private String errorPage = "/arjspmorph/error_page.jsp";
	private String popUp;
	private HttpServletResponse response;
	private ArrayList<String> reqParamsArray = new ArrayList<String>();
	private boolean isDebugTrace = false;
	private String reqParams;
	private List<String> reqParamsIgnoreList = new ArrayList<String>();
	private static String reqParamsIgnore;
	private static int isDeviceRendReq;
	
	static ArrayList<String> alHeaderList = new ArrayList<String>();
	private String[] HEADERS_TO_TRY = {
		"X-Forwarded-For",
		"Proxy-Client-IP",
		"WL-Proxy-Client-IP",
		"HTTP_X_FORWARDED_FOR",
		"HTTP_X_FORWARDED",
		"HTTP_X_CLUSTER_CLIENT_IP",
		"HTTP_CLIENT_IP",
		"HTTP_FORWARDED_FOR",
		"HTTP_FORWARDED",
		"HTTP_VIA",
		"REMOTE_ADDR"
	};

	public IFinLogger log = LoggerCreator.getLogger();
	public SecureFilter() {
		config = null;
	}


	public void init(FilterConfig filterconfig)
		throws ServletException
	{
		this.config = filterconfig;
		String controlCharacterCheckReqd = filterconfig.getInitParameter("CONTROL_CHARACTER_VALIDATION_REQD");
		String validateCheckRqd = filterconfig.getInitParameter("REQID_VALIDATION_REQD");
		String secureCheckRqd = filterconfig.getInitParameter("SECURE_CHECK_REQD");
		String sqlCheckRqd = filterconfig.getInitParameter("SQL_CHECK_REQD");
		String xssSqlLogOnly = filterconfig.getInitParameter("XSS_SQL_LOG_ONLY");
		String httpMethodCheckRqd = filterconfig.getInitParameter("HTTPMETHOD_CHECK_REQD");
		if (null == httpMethodCheckRqd || "".equals(httpMethodCheckRqd) ) httpMethodCheckRqd="N";	

		restrictList = filterconfig.getInitParameter("RESTRICT_LIST");
		htmlRestrictList=filterconfig.getInitParameter("HTML_TAG_LIST");
		securePermitList=filterconfig.getInitParameter("SECURE_PERMIT_LIST");
		String debugTrace = filterconfig.getInitParameter("SECURE_FILTER_DEBUG");

		isControlCharacterCheckReqd =(controlCharacterCheckReqd != null) && ("Y").equalsIgnoreCase(controlCharacterCheckReqd);
		isValidateCheckRqd = (validateCheckRqd != null) && ("Y").equalsIgnoreCase(validateCheckRqd);
		isSecureCheckReqd = (secureCheckRqd != null) && ("Y").equalsIgnoreCase(secureCheckRqd);
		isSqlCheckReqd = (sqlCheckRqd != null) && ("Y").equalsIgnoreCase(sqlCheckRqd);
		isXssSqlLogOnly = (xssSqlLogOnly != null) && ("Y").equalsIgnoreCase(xssSqlLogOnly);
		isDebugTrace = (debugTrace != null) && ("Y").equals(debugTrace);
		isHttpMethodCheckReqd = (httpMethodCheckRqd != null) && ("Y").equalsIgnoreCase(httpMethodCheckRqd);
		
	}

	public void destroy()
	{
		this.config = null;
	}

	public void doFilter(ServletRequest servletrequest, ServletResponse servletresponse,
						 FilterChain filterchain)
		throws IOException,ServletException
	{
		if(servletrequest instanceof HttpServletRequest) {
			
			String  appPath = AppProperties.getProperty("appPath");
			String logPath  = AppProperties.getProperty("ONS_LOG_DIR");
			String reqParamValReqd  = AppProperties.getProperty("reqParamValReqd","N").trim();
			reqParamValReqd = (reqParamValReqd == null || "".equals(reqParamValReqd))?"N":reqParamValReqd.trim();
			isReqParamValReqd = ("Y").equalsIgnoreCase(reqParamValReqd);
			if(logPath != null && !"".equals(logPath)){
				logFile = logPath + "/SecureFilter.log";
				encodeListFile = logPath + "/encodeList.log";
 	        }
			else{
				logFile = appPath + "/log/SecureFilter.log";
				encodeListFile = appPath + "/log/encodeList.log";
			}
			
			if(null == prodEnv){
				prodEnv = AppProperties.getProperty("prod_env");
			}
			boolean isProdEnv = (prodEnv != null) && ("Y").equals(prodEnv);
			boolean isNewReqIdSession = false;
			boolean isParamModified = false;

			String reqId = "";
			
			if(isReqParamValReqd){
				if(null == reqParamsIgnore){
					reqParamsIgnore  = AppProperties.getProperty("reqParamsIgnore","N").trim();
					reqParamsIgnore = (reqParamsIgnore == null || "".equals(reqParamsIgnore))?"N":reqParamsIgnore.trim();
				}
				if(!reqParamsIgnore.equals("N")){
					String[] arrIgnoreReqParams = reqParamsIgnore.split(",");
					reqParamsIgnoreList = Arrays.asList(arrIgnoreReqParams);
				}
			}
			
			servletrequest.setCharacterEncoding("UTF-8");
			HttpServletRequest request = (HttpServletRequest)servletrequest;
			response = (HttpServletResponse)servletresponse;
			String reqUri = request.getRequestURI(); 
			HttpSession session = (HttpSession)request.getSession();
		        //Security fix for restricting unauthorized access to resource files - Starts 
			if(isProdEnv) { 
				if(null != reqUri && reqUri.endsWith(".jar")){ 
					String rtId = (String) session.getAttribute(SecurityConstants.rtId);
					if (rtId == null || rtId.isEmpty() ){
						dispName=RESTRICT_ACCESS; 
						dispStr=reqUri.substring(reqUri.lastIndexOf("/")+1, reqUri.length()); 
						printLog(dispName,dispStr,request); 
						response.setStatus(HttpServletResponse.SC_NOT_FOUND); 
						throw new ServletException(dispName+ "["+reqUri+"]");
					}
					filterchain.doFilter(servletrequest, servletresponse);
					return;
				}	 
			} 
   
			sContextPath    = (sContextPath == null) ? (String)request.getContextPath() : sContextPath;	
			request.setAttribute(IS_VALID_REQID, SUCCESS_CODE);
			popUp = (String)request.getParameter("isPopUp");
			isDeviceRendReq = reqUri.indexOf("/DeviceRenderer");
			
			if(isDebugTrace){
				String reqDetStr = "";
				Enumeration reqEnum1=request.getParameterNames();	
				boolean hasMore = reqEnum1.hasMoreElements();
				String str1 = String.valueOf(hasMore);
				while(reqEnum1.hasMoreElements()){
					String pName = (String)reqEnum1.nextElement();
					String[] pVal = (String[])request.getParameterValues(pName);
					for(int i=0;i<pVal.length;i++)
						reqDetStr = reqDetStr + "["+pName+ "=" + pVal[i] + "]";
				}
				printDebugLog("Request Param Details",reqDetStr,request);
			}
			
			if(isProdEnv)
			{
				if(request.getRequestURI().endsWith(".html")||request.getRequestURI().endsWith(".htm")||request.getRequestURI().contains("FINRPTViewer")){
					if (!XSSCheck(request)) {
						printLog(dispName,dispStr,request);
						request.setAttribute(IS_VALID_REQUEST, XSS_CODE);
						throw new ServletException("XSS done in html/FINRPT files");
					}
					filterchain.doFilter(servletrequest, servletresponse);
					return;
				}
			}

			if (isProdEnv && isSecureCheckReqd) {
				if (session.isNew()) {
				    session.invalidate();
				    session = request.getSession(true);
					String rtId  = generateToken();
					session.setAttribute(SecurityConstants.rtId, rtId);
				    isNewSession = true;
					if(isDebugTrace){
						dispName="New Session - rtID";
						dispStr=rtId;
						printDebugLog(dispName,dispStr,request);
					}
				}
					
				if(isReqParamValReqd && isDeviceRendReq == -1) {
					request.setAttribute(IS_VALID_REQUEST, SUCCESS_CODE);
					if(!(request.getRequestURI().endsWith("/index.jsp"))) {
						getRequestParams(request);
						if(!requestParamsValidation(request)){
							isParamModified = true;
						}
					}
				}
					
				if(!isParamModified){
					validateRequest(request);

					String isValidSearcherRequest = (String)request.getAttribute(INVALID_REQUEST_SEARCHER);
					if (null !=isValidSearcherRequest && isValidSearcherRequest.equals(XSS_CODE)){
						return;
					}
				}
			}else {
				String rtId = generateToken();
				session.setAttribute(SecurityConstants.rtId, rtId);
				request.setAttribute(IS_VALID_REQUEST, SUCCESS_CODE);
			}

			if (isProdEnv && isValidateCheckRqd) {
				if (session.isNew()) {
					session = request.getSession(true);
					reqId = generateToken();
					session.setAttribute(SecurityConstants.REQ_ID, reqId);
					isNewReqIdSession = true;
					if(isDebugTrace){
						dispName="New Session - reqID";
						dispStr=reqId;
						printDebugLog(dispName,dispStr,request);
					}
				}
				else if(request.getRequestURI().endsWith("index.jsp"))
				{
					// If it is index.jsp & the reqId is not present in session,
					// create it and set it into session.
					String sessReqId = (String)session.getAttribute(SecurityConstants.REQ_ID);
					if(null == sessReqId)
					{
						reqId =generateToken();
						session.setAttribute(SecurityConstants.REQ_ID, reqId);
						if(isDebugTrace){
							dispName="reqID not present [index.jsp] | Creating New";
							dispStr=reqId;
							printDebugLog(dispName,dispStr,request);
						}
					}
				}
				validateReqId(request, session, isNewReqIdSession);
			}
		}

		filterchain.doFilter(servletrequest, servletresponse);
		return;
	}


	private void validateRequest(HttpServletRequest request) throws IOException,ServletException
        {
		HttpSession session = (HttpSession)request.getSession();
		String httpMethod = request.getMethod();

		if(isDeviceRendReq != -1)
			return;
		
		if(!requestValidation(request,session)){
			printLog(dispName,dispStr,request);		
			request.setAttribute(IS_VALID_REQUEST, CXRF_CODE);
			session.setAttribute("remoteReqCheck","Y");
			return;
		}
		
		if(!validateHttpMethod(httpMethod, request))
		{
			printLog(dispName, dispStr, request);
			request.setAttribute(IS_VALID_REQUEST, XSS_CODE);
			return;
		}
		
		String lmlUri = request.getRequestURI();
		int isLMLRequest = lmlUri.indexOf("/lmlServlet");
		if((isLMLRequest==-1)&&(!sessIdValidation(request,session)))
		{
			printLog(dispName,dispStr,request);
			request.setAttribute(IS_VALID_REQUEST, CXRF_CODE);
			return;
		}
		
		if(!(request.getRequestURI().endsWith("index.jsp"))) {
			if(!CXRFCheck(request)) {
				printLog(dispName,dispStr,request);
				request.setAttribute(IS_VALID_REQUEST, CXRF_CODE);
				return;
			}
		}
		else {
			// If it is index.jsp & the rtId is not present in session, create
			// it and set it into session.
			String sessRtId = (String)request.getSession().getAttribute(SecurityConstants.rtId);
			if(null == sessRtId)
			{
				String rtId = generateToken();
				request.getSession().setAttribute(SecurityConstants.rtId,rtId);
				if(isDebugTrace){
					printDebugLog("rtId - Null | Created New",rtId,request);
				}
			}
		}

		if (!XSSCheck(request)) {
			printLog(dispName,dispStr,request);
			request.setAttribute(IS_VALID_REQUEST, XSS_CODE);
			if(request.getRequestURI().indexOf("/arjspmorph/") != -1 || (null!= popUp && "Y".equalsIgnoreCase(popUp))) {
				request.setAttribute(INVALID_REQUEST_SEARCHER, XSS_CODE);
				request.setAttribute(IS_POP_UP, STR_YES);
				RequestDispatcher rd = request.getRequestDispatcher(errorPage);
				rd.forward(request, response);
			}else{
				request.setAttribute(IS_POP_UP, STR_NO);
			}
			return;
		}
		request.setAttribute(IS_VALID_REQUEST, SUCCESS_CODE);
	}

	private boolean restrictListValidation(String locName, String locStr) {
		String[] INVALIDCHAR_ARR = restrictList.split(",");
		int INVALIDCHAR_ARR_LEN = INVALIDCHAR_ARR.length;
		int index;

		for (int j=0; j<INVALIDCHAR_ARR_LEN; j++) {
			index = locStr.indexOf(INVALIDCHAR_ARR[j]);
			if(index != -1){
				if(isXssSqlLogOnly){
					if (null != dispFieldName){
							dispFieldName=dispFieldName+" | "+locName;
							dispFieldValue=dispFieldValue+" | "+locStr;
					}
					else {
							dispFieldName=locName;
							dispFieldValue=locStr;
					}
				}
				else{
					return false;
				}
			}
		}
		return true;
	}

	private boolean htmlTagValidation(String locName, String locStr){
		String [] INVALIDHTML_TAG = htmlRestrictList.split(",");
		int INVALIDHTML_TAG_LEN = INVALIDHTML_TAG.length;
		int hindex;
		int hindex2;

		for(int h=0;h<INVALIDHTML_TAG_LEN;h++){
		    hindex=locStr.indexOf("<"+INVALIDHTML_TAG[h]);
		    hindex2=locStr.indexOf("</"+INVALIDHTML_TAG[h]);

		    if(hindex != -1 || hindex2 != -1) {
			    if(isXssSqlLogOnly){
 	                if (null != dispFieldName){
 	                    dispFieldName=dispFieldName+" | "+locName;
 	                    dispFieldValue=dispFieldValue+" | "+locStr;
 	                }
 	                else {
 	                    dispFieldName=locName;
 	                    dispFieldValue=locStr;
 	                }
 	            }
 	            else{
 	                return false;
 	            }
		    }
		}
		return true;
	}

	private boolean splCharValidation(String locName, String locStr){
		Pattern pattern;
		Matcher matcher;
		String regex = "([()\"\'\\\\*;{}`%+^!][()\"\'/\\\\*;:={}`%+^!])";
		pattern = Pattern.compile(regex);
		matcher = pattern.matcher(locStr);
		boolean match = matcher.find();
		if(match){
			if(isXssSqlLogOnly){
				if (null != dispFieldName){
 	                dispFieldName=dispFieldName+" | "+locName;
 	                dispFieldValue=dispFieldValue+" | "+locStr;
 	            }
 	            else {
 	                dispFieldName=locName;
 	                dispFieldValue=locStr;
 	            }
 	        }
 	        else{
 	            return false;
 	        }
		}
		return true;
	}
	private boolean sqlInjectValidation(String locName, String locStr){
		Pattern pattern;
		Matcher matcher;
		Pattern pattern1;
		Matcher matcher1;
		String regex = "([;()'\"+](and|or|null|union|having|group|select)|['\";][-|+=();])";

		pattern = Pattern.compile(regex);
		matcher = pattern.matcher(locStr);
		boolean match = matcher.find();

		if(match){
			if(isXssSqlLogOnly){
				if (null != dispFieldName){
					dispFieldName=dispFieldName+" | "+locName;
					dispFieldValue=dispFieldValue+" | "+locStr;
				}
				else{
					dispFieldName=locName;
					dispFieldValue=locStr;
				}
			}
			else{
				return false;
			}
		}
		if(PermitList(locStr)){
			String excludeRegex = "([-][-])";
			pattern1 = Pattern.compile(excludeRegex);
			matcher1 = pattern1.matcher(locStr);
			boolean match1 = matcher1.find();

			if(match1)
			{
				if(isXssSqlLogOnly){
					if (null != dispFieldName){
						dispFieldName=dispFieldName+" | "+locName;
						dispFieldValue=dispFieldValue+" | "+locStr;
					}
					else {
						dispFieldName=locName;
						dispFieldValue=locStr;
					}
				}
				else{
					return false;
				}
			}
		}
		return true;
	}

	private boolean PermitList(String locStr){
		String [] VALID_LIST = securePermitList.split(",");
		int VALID_LIST_LEN = VALID_LIST.length;
		int vindex;


		for(int f=0;f<VALID_LIST_LEN;f++)
		{
			vindex=locStr.indexOf(VALID_LIST[f]);
			if(vindex!=-1){
				return false;
			}
		}
		
		return true;
	}

	private void printLog(String dispName, String dispStr, HttpServletRequest request)
	{
		if(log != null)
		{
			String logMsg = "";
			if (null != request)
			{
				HttpSession session = (HttpSession)request.getSession();
				String locRequest = (String)request.getRequestURI();
				String ipAdd = (String) getClientIpAddress(request);
				String FinSessionId = (String)session.getAttribute("sessionid");
				String sessId = session.getId();				
				String rtId = (String) request.getParameter("rtId");
				String referrer = request.getHeader("Referer");
				String sUserId ="";
				if(null != (FABCommon.SecurityInfo70)session.getAttribute("FinUserInfo"))
				{
					sUserId = ((FABCommon.SecurityInfo70)session.getAttribute("FinUserInfo")).userId;
				}
				else if(null != (FABCommon.SecurityInfo70)session.getAttribute("UserInfo"))
				{
					sUserId = ((FABCommon.SecurityInfo70)session.getAttribute("UserInfo")).userId;
				}				
				
				logMsg = "UserID["+sUserId+"] FinSessionId["+FinSessionId+"] JSessId["+sessId+"] ipAdd["+ipAdd+"] request["+locRequest+"] rtId["+rtId+"] FieldName["+dispName+"] FieldValue["+dispStr+"] Referrer["+referrer+"]"; 
			}
			else{
				logMsg ="FieldName["+dispName+"] FieldValue["+dispStr+"]";
			}
			
			log.logSecureFilter(logFile,logMsg);
		}
	}
	
	private void printDebugLog(String dispName, String dispStr, HttpServletRequest request){
		if (log != null)
		{	
			String logMsg= "";
			String locRequest = (String)request.getRequestURI();
			HttpSession session = (HttpSession)request.getSession();
			String FinSessionId = (String)session.getAttribute("sessionid");
			String  sessId = session.getId();
			String ipAdd = (String) getClientIpAddress(request);
			long thrdId = Thread.currentThread().getId();
			String rtId = (String) request.getParameter("rtId");
			String referrer = request.getHeader("Referer");
			String sUserId ="";
			if(null != (FABCommon.SecurityInfo70)session.getAttribute("FinUserInfo"))
			{
				sUserId = ((FABCommon.SecurityInfo70)session.getAttribute("FinUserInfo")).userId;
			}
			else if(null != (FABCommon.SecurityInfo70)session.getAttribute("UserInfo"))
			{
				sUserId = ((FABCommon.SecurityInfo70)session.getAttribute("UserInfo")).userId;
			}

			logMsg = " [Debug] UserID["+sUserId+"] FinSessionId["+FinSessionId+"] JSessId["+sessId+"] ipAdd["+ipAdd+"] request["+locRequest+"] rtId["+rtId+"] ThreaId["+thrdId+"] FieldName["+dispName+"] FieldValue["+dispStr+"] Referrer["+referrer+"]";
				
			log.logSecureFilter(logFile,logMsg);
		}
	}

	private void printEncodeLog(String dFName, String dFValue)
 	{
		if(log != null){			
			String logMsg = "FieldNames [ "+dFName+" ] :: FiledValues [ "+dFValue+" ]";
			log.logEncodeLst(encodeListFile,logMsg);
		}
 	}
	
	private boolean validateHttpMethod(String httpMethod, HttpServletRequest request)
	{
		if(!(httpMethod.equalsIgnoreCase(GET)) && !(httpMethod.equalsIgnoreCase(POST)))
		{
			dispName="HTTP_method";
			dispStr=httpMethod;
			return false;
		}
		
		if(isHttpMethodCheckReqd)
		{
			if(!validateMethod(request))
			{
				dispName="HTTP_method";
				dispStr="Invalid";
				return false;
			}
		}
		
		return true;
	}
			 
	private boolean validateMethod(HttpServletRequest request)
	{
		String reqUri = request.getRequestURI();
		String dynValue = (String)request.getParameter("dynURL");
		boolean isArjspmorph  = reqUri.contains("arjspmorph");
		boolean isSubmitForm  = reqUri.contains(SUBMIT_FORM);
		boolean isActionCode  = reqUri.contains(ACTION_CODE);
		boolean isPopUp=false;
		boolean isDynValue=false;
		
		if(null != popUp && "Y".equalsIgnoreCase(popUp))
			isPopUp = true;
		
		if(null != dynValue)
			isDynValue = true;
		
		if(isArjspmorph || isDynValue || isPopUp || isSubmitForm || isActionCode)
			return true;

		if(request.getRequestURI().contains("index.jsp")||request.getRequestURI().contains("fincore.jsp")||request.getRequestURI().contains("dummy.jsp")||request.getRequestURI().contains("coreapplet.jsp")||request.getRequestURI().contains("global.jsp")||request.getRequestURI().contains("corealert.jsp")||request.getRequestURI().contains("generateJnlp.jsp"))
			return true;
		
		if(GET.equals(request.getMethod()))
		{
			return false;
		}
		
		return true;
	}
	
	private void validateReqId(HttpServletRequest request, HttpSession session, boolean isNewReqIdSession)
	{
		String reqUri = request.getRequestURI();
		boolean isInquiryMenu = reqUri.contains("inquiry");
		boolean isArjspmorph  = reqUri.contains("arjspmorph");
		String reqId_req = request.getParameter(SecurityConstants.REQ_ID);
		String dynValue = (String)request.getParameter("dynURL");
		String popUp = (String)request.getParameter("isPopUp");
		int isLMLRequest = reqUri.indexOf("/lmlServlet");

		if(isLMLRequest != -1 || "Y".equalsIgnoreCase(popUp)){
			if(isDebugTrace){
				dispName="ReqId - Bypass";
				dispStr="LMLRequest | Pop up";
				printDebugLog(dispName,dispStr,request);
			}
			return;
		}

		if(isDeviceRendReq != -1){
			if(isDebugTrace){
				dispName="ReqId - Bypass";
				dispStr="DeviceRendReq";
				printDebugLog(dispName,dispStr,request);
			}
			return;
		}

		if(null!=dynValue)
		{
			if(isDebugTrace){
				dispName="ReqId";
				dispStr="dynValue - Bypass";
				printDebugLog(dispName,dispStr,request);
			}
			return;
		}


		 if(request.getRequestURI().contains("fincore.jsp")||request.getRequestURI().contains("dummy.jsp")||request.getRequestURI().contains("coreapplet.jsp")||request.getRequestURI().contains("corealert.jsp")||request.getRequestURI().contains("generateJnlp.jsp")){
			request.setAttribute(IS_VALID_REQID, SUCCESS_CODE);
			if(isDebugTrace){
				dispName="ReqId - Bypass";
				dispStr="fincore.jsp | dummy.jsp | coreapplet.jsp | corealert.jsp | generateJnlp.jsp";
				printDebugLog(dispName,dispStr,request);
			}
			return;
		}

		if(isInquiryMenu || isArjspmorph) {
			request.setAttribute(IS_VALID_REQID, SUCCESS_CODE);
			if(isDebugTrace){
				dispName="ReqId Bypass";
				dispStr="InquiryMenu | Arjspmorph";
				printDebugLog(dispName,dispStr,request);
			}
			return;
		}

		String reqId_sess = (String)session.getAttribute(SecurityConstants.REQ_ID);

		if(null==reqId_req ||("").equals(reqId_req))
		{
			if(!(request.getRequestURI().endsWith("/index.jsp") || request.getRequestURI().endsWith("/global.jsp"))) {
				dispName="reqId_req";
				dispStr=reqId_req;
				printLog(dispName, dispStr, request);
			}
			request.setAttribute(IS_VALID_REQID, FAILURE);
			return;
		}

		if (reqId_req.equalsIgnoreCase(reqId_sess)){
			request.setAttribute(IS_VALID_REQID, SUCCESS_CODE);
			if(isDebugTrace){
				dispName="ReqId Successful";
				dispStr=reqId_sess;
				printDebugLog(dispName,dispStr,request);
			}
		}
		else {
			dispName="reqId";
			dispStr=reqId_sess+"|"+reqId_req;
			printLog(dispName, dispStr, request);
		    request.setAttribute(IS_VALID_REQID, FAILURE);
		}

		String requestId = generateToken();
		session.setAttribute(SecurityConstants.REQ_ID, requestId);
	}

	private boolean XSSCheck(HttpServletRequest request)
	{
		int index;
		int hindex;
		int hindex2;
		String paramName = null;
		String[] paramValue = null;
		String checkValue = null;
		String reqUri = (String) request.getRequestURI();

		boolean isSwift = reqUri.contains("swift_address_edit_popup.jsp");
		Pattern pattern;
		Matcher matcher;
		String queryString;
		String regex = "([&][fieldValue])";

		if(isSwift){
		    queryString = (String)request.getQueryString();
			if(null != queryString){
			    pattern = Pattern.compile(regex);
				matcher = pattern.matcher(queryString);
				boolean match = matcher.find();
				if(match){
					return true;
				}
			}
		}
		
		restrictList = (null != restrictList) ? restrictList.trim():"";
		htmlRestrictList = (null != htmlRestrictList) ? htmlRestrictList.trim():"";
		securePermitList = (null != securePermitList) ? securePermitList.trim():"";
		if(("").equals(restrictList) && ("").equals(htmlRestrictList) && ("").equals(securePermitList))
		{		
			return true;
		}

		String[] INVALIDCHAR_ARR = restrictList.split(",");
		int INVALIDCHAR_ARR_LEN = INVALIDCHAR_ARR.length;
		String [] INVALIDHTML_TAG = htmlRestrictList.split(",");
        int INVALIDHTML_TAG_LEN = INVALIDHTML_TAG.length;

		for (Enumeration reqEnum=request.getParameterNames(); reqEnum.hasMoreElements(); ) {
			paramName = (String) reqEnum.nextElement();
			paramValue = request.getParameterValues(paramName);

			for(int i=0;i<paramValue.length;i++) {

				if (paramValue[i] != null) {
					checkValue=paramValue[i].trim().replaceAll("\\s+","");
					String locName = paramName;
					String locStr = checkValue.toLowerCase();
					String locValue = paramValue[i].toLowerCase();

					if(!restrictListValidation(locName,locStr) || !htmlTagValidation(locName,locStr) || !XSSValidation(locName,locStr)){
						 dispName=locName;
						 dispStr=locStr;
						 return false;
					}
					
					if(isSqlCheckReqd){
						if(!sqlInjectValidation(locName,locStr)){
							dispName=locName;
							dispStr=locStr;
							return false;
						}
					}
					if(isControlCharacterCheckReqd){
						if(!controlCharacterValidation(locValue)){
							dispName=locName;
							dispStr=locValue;
							return false;
						}
					}
				}
			}
		}
		if(null != dispFieldName){
 	        printEncodeLog(dispFieldName, dispFieldValue);
 	        dispFieldName = null;
 	        dispFieldValue = null;
 	    }
		return true;
	}
	
	private boolean controlCharacterValidation(String locValue)
	{
		Pattern pattern;
		Matcher matcher;
		String regex = "([\\u0000-\\u001F]|[\\u007F]|[\\u0080-\\u009F])";
		pattern = Pattern.compile(regex);
		matcher = pattern.matcher(locValue);
		boolean match = matcher.find();

		if(match){
			return false;
		}
		return true;
	}
	
	/** 
     * Stores request paramName and paramValue in ArrayList - nameValueArray 
     * 
     * @param   request
     *
     */ 
	private void getRequestParams(HttpServletRequest request)
    {
        String paramName = null;
        String[] paramValue = null;
        reqParamsArray = new ArrayList<String>();

		for(Enumeration e=request.getParameterNames(); e.hasMoreElements();) {
			paramName = (String) e.nextElement();
			paramValue = request.getParameterValues(paramName);
			if(!paramName.equalsIgnoreCase(SecurityConstants.reqUnqId)) {
				for(int i=0;i<paramValue.length;i++) {
					if (paramValue[i] != null) {
						if (!reqParamsIgnoreList.contains(paramName))
							reqParamsArray.add(paramName +"="+ paramValue[i]);
					}
				}
			}
		}
    }
	
	/**
    * Adler32 check sum calculation
    * @param reqParams - req Params
    * @return
    */
    public String getAdler32CheckSum(String reqParams ) throws UnsupportedEncodingException{
		
		String encodedReqParams = URLEncoder.encode(reqParams, "UTF-8")
								.replaceAll("\\+", "%20")
								.replaceAll("\\-", "%2D");
								
		
		byte[] bytes = encodedReqParams.getBytes();
		Checksum checksum = new Adler32();
        checksum.update(bytes, 0, bytes.length);
        Long result = checksum.getValue();
        return result.toString();
	}
	
	/** 
    * Generate hashKey and validate with the request hashKey
    * 
    * @param   request 
    * @return  a boolean stating success or failure of validation
    */ 
	private boolean requestParamsValidation(HttpServletRequest request)
	{
			String serverUnqId = null;
			String reqUnqId = null;
		
		String reqUri = request.getRequestURI();
		String popUp = (String)request.getParameter("isPopUp");
		String dynValue = (String)request.getParameter("dynURL");
		boolean isArjspmorph  = reqUri.contains("arjspmorph");
		
		if(request.getRequestURI().contains("fincore.jsp")||request.getRequestURI().contains("dummy.jsp")||request.getRequestURI().contains("coreapplet.jsp")||request.getRequestURI().contains("global.jsp")||request.getRequestURI().contains("/helpfiles")||request.getRequestURI().contains("onsmainblank_ctrl.jsp")||request.getRequestURI().contains("corealert.jsp")||request.getRequestURI().contains("generateJnlp.jsp")){
			return true;
		}
		
		int isLMLRequest = reqUri.indexOf("/lmlServlet");
		
		if(isLMLRequest != -1 || "Y".equalsIgnoreCase(popUp)){
			return true;
		}
		
		if(isArjspmorph) {
			return true;
		}
		
		reqUnqId = request.getParameter(SecurityConstants.reqUnqId);
			serverUnqId = createReqParamToken(reqParamsArray, request);
		
		if(null==reqUnqId ||("").equals(reqUnqId) || serverUnqId == null)
		{
			dispName="requestParamsValidation failed [null or empty]";
			dispStr="reqUnqId["+reqUnqId+"] serverUnqId["+serverUnqId+"] reqUri["+reqUri+"]";
			printLog(dispName,dispStr,request);
			request.setAttribute(IS_VALID_REQUEST, REQ_FORGED_CODE);
			return false;
		}

		if (!reqUnqId.equalsIgnoreCase(serverUnqId)){
			dispName="requestParamsValidation failed";
			dispStr="reqUnqId["+reqUnqId+"] serverUnqId["+serverUnqId+"] reqUri["+reqUri+"] reqParams["+reqParams+"]";
			printLog(dispName,dispStr,request);
			request.setAttribute(IS_VALID_REQUEST, REQ_FORGED_CODE);
			return false;
		}

		request.setAttribute(IS_VALID_REQUEST, SUCCESS_CODE);
		return true;
		
	}
	
	/** 
     * Returns a hash of the request Params 
     * 
     * @param   reqParamsArray (request Params) and request
     * @return  a hash of the request Params 
     */ 
	public String createReqParamToken(ArrayList<String> reqParamsArray, HttpServletRequest request)
    { 
		String reqParamToken = null;
		reqParams = null;
		
			String rtId1 = request.getParameter("rtId");
			reqParamsArray.add(rtId1.substring(2, rtId1.length() -1));
			Collections.sort(reqParamsArray);
			
			for(Iterator<String> itr = reqParamsArray.iterator(); itr.hasNext();){
				String sTemp = itr.next();
				if(reqParams == null)
				{
					reqParams = sTemp;
				}
				else
				{
					reqParams = reqParams + "," + sTemp;
				}
			}
			
			
			
			if(reqParams!=null){
				HttpSession session = (HttpSession)request.getSession();
				try{
					reqParamToken = getAdler32CheckSum(reqParams);
				}catch(Exception ex){
					ex.printStackTrace();
				}
			}
			
		return reqParamToken; 
		
    } 
	private boolean CXRFCheck(HttpServletRequest request)
	{
		if (isNewSession) {
			isNewSession = false;
			if(isDebugTrace){
				dispName="rtId - Bypass";
				dispStr="New Session";
				printDebugLog(dispName,dispStr,request);
			}
			return true;
		}

		HttpSession session    = request.getSession();
		String sessRTID        = (String) session.getAttribute(SecurityConstants.rtId);
		String reqRTID         = (String) request.getParameter(SecurityConstants.rtId);

		if (reqRTID == null || ("").equals(reqRTID) || sessRTID == null) {
			dispName="rtIdIsEmptyNull";
			dispStr=sessRTID+"|"+reqRTID;
			return false;
		}
		if (!sessRTID.equals(reqRTID)) {
			dispName="rtId";
			dispStr=sessRTID+"|"+reqRTID;
			return false;
		}

		if (isDebugTrace){
			dispName="rtId Successful";
			dispStr="rtId - "+ sessRTID;
			printDebugLog(dispName,dispStr,request);
		}
		return true;
		
	}

	private String generateToken()
	{
		Random r = new Random();
		String ranNum = "";

		long sysTime = System.currentTimeMillis();

		
		long random = (long)(Math.random()*1000)+1;
		
		long salt = sysTime + random;
		
		r.setSeed(salt);
		
		ranNum = Long.toString(Math.abs(r.nextLong()), 36);

		
		return ranNum;
	}
	
	private boolean sessIdValidation(HttpServletRequest request, HttpSession session){

		boolean isValidFinSessId = true;
		boolean isValidFabSessId = true;
		boolean isValidSessId    = true;
		boolean isValidSecTok    = true;


		String reqFinSessionId = (String)request.getParameter("finsessionid");
		String reqFabSessionId = (String)request.getParameter("fabsessionid");
		String reqSessionid        = (String)request.getParameter("sessionid");
		String reqSectok           = (String)request.getParameter("sectok");


		if(reqFinSessionId!=null || reqFabSessionId!=null || reqSessionid!=null || reqSectok!=null)
		{
			if((String)session.getAttribute("finsessionid")==null){
				session.setAttribute("finsessionid",reqFinSessionId);
			}

			if((String)session.getAttribute("fabsessionid")==null){
				session.setAttribute("fabsessionid",reqFabSessionId);
			}

			if((String)session.getAttribute("sessionid")==null){
				session.setAttribute("sessionid",reqSessionid);
			}

			String sessId = session.getId();
			if((String)session.getAttribute("sectoken")==null){
				session.setAttribute("sectoken",reqSectok);
			}

			if(!(((String)session.getAttribute("finsessionid")).equals(reqFinSessionId))){
				dispName = "finsessionid";
				dispStr  = (String)session.getAttribute("finsessionid")+"|"+reqFinSessionId;
				isValidFinSessId = false;
			}

			if(!(((String)session.getAttribute("fabsessionid")).equals(reqFabSessionId))){
				dispName = "fabsessionid";
				dispStr  = (String)session.getAttribute("fabsessionid")+"|"+reqFabSessionId;
				isValidFabSessId = false;
			}

			if(!(((String)session.getAttribute("sessionid")).equals(reqSessionid))){
				dispName = "sessionid";
				dispStr  = (String)session.getAttribute("sessionid")+"|"+reqSessionid;
				isValidSessId = false;
			}

			if(!(((String)session.getAttribute("sectoken")).equals(reqSectok))){
				dispName = "sectoken";
				dispStr  = (String)session.getAttribute("sectoken")+"|"+reqSectok;
				isValidSecTok = false;
			}

			if(!isValidFinSessId ||!isValidFabSessId||!isValidSessId||!isValidSecTok){
				return false;
			}
			if (isDebugTrace){
				dispName = "sessIdValidation Successful";
				dispStr  = "[finsessionid] ["+(String)session.getAttribute("finsessionid")+"]" 
							+ "[fabsessionid] ["+(String)session.getAttribute("fabsessionid")+"]"
							+ "[sessionid] ["+(String)session.getAttribute("sessionid")+"]" 
							+ "[sectoken] ["+(String)session.getAttribute("sectoken")+"]";
				printDebugLog(dispName,dispStr,request);
			}
		}
		

		return true;
	}
	
	private boolean requestValidation(HttpServletRequest request, HttpSession session){
		
		String hostHdr = (String)request.getHeader("Host");
		String remoteAddress = (String)getClientIpAddress(request);
		StringBuffer requestURL = request.getRequestURL(); 
		int indexOfFinb = requestURL.toString().toLowerCase().indexOf("finbranch"); 
		if(indexOfFinb!=-1) 
		{ 
			indexURL = requestURL.substring(0,indexOfFinb-1)+sContextPath+"/index.jsp";
		} 

		if(null!=indexURL && (!("").equalsIgnoreCase(indexURL)))
		{
			if(indexURL.contentEquals(requestURL))
			{ 
				session.setAttribute("requestIP",remoteAddress); 
				String propHostHdr = AppProperties.getProperty("HOST_HEADER_PROP","");
				hostHdr = (!propHostHdr.equals(""))?propHostHdr:hostHdr;
				session.setAttribute("HostHeader",hostHdr);
			} 
		} 

		String sessionHostHdr = (String)session.getAttribute("HostHeader");
		if(!(hostHdr.equals(sessionHostHdr)))
		{
			dispName = "HostHeader";
			dispStr  = sessionHostHdr+"|"+hostHdr;
			return false; 
		} 
		if (isDebugTrace)
		{
			dispName = "HostHeader Successful :: ";
			dispStr  = "HostHeader["+sessionHostHdr+"|"+hostHdr+"]";
			printDebugLog(dispName,dispStr,request);
		}

		String sessionIP = (String)session.getAttribute("requestIP");
		if(!(remoteAddress.equals(sessionIP)))
		{
			dispName = "remoteAddress";
			dispStr  = sessionIP+"|"+remoteAddress;
			return false; 
		} 
		if (isDebugTrace)
		{
			dispName = "remoteAddress Successful :: ";
			dispStr  = "remoteAddress["+sessionIP+"|"+remoteAddress+"]";
			printDebugLog(dispName,dispStr,request);
		}
		return true;
	}
	
	private boolean XSSValidation(String locName,String locStr){
		Pattern pattern;
		Matcher matcher;
		Pattern pattern1;
		Matcher matcher1;
		String regex = "(['\";][-|+=();*^!/])";
		pattern = Pattern.compile(regex);
		matcher = pattern.matcher(locStr);
		boolean match = matcher.find();
		if(match){
		    if(isXssSqlLogOnly){
 	            if (null != dispFieldName){
 	                dispFieldName=dispFieldName+" | "+locName;
 	                dispFieldValue=dispFieldValue+" | "+locStr;
 	            }
 	            else {
 	                dispFieldName=locName;
 	                dispFieldValue=locStr;
 	            }
 	        }
 	        else{
 	            dispName=locName;
 	            dispStr=locStr;				
 	            return false;
 	        }
		}
		return true;
	}
	
	public String getClientIpAddress(HttpServletRequest request)
	{
		BufferedReader br = null;
		String sCurrLine;

		try
		{
			for (String header : HEADERS_TO_TRY)
			{
				String ip = request.getHeader(header);
			  	if (ip != null && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {
			  		return ip;
			  	}
			}

			if(null == alHeaderList || (alHeaderList.isEmpty()))
			{
				String sHeaderfromJVM = System.getProperty("HEADERLIST_FILE_PATH");
				if(null != sHeaderfromJVM && !(sHeaderfromJVM.equalsIgnoreCase("")))
				{
					if(checkFileAccess(sHeaderfromJVM))
					{
						br = new BufferedReader(new FileReader(sHeaderfromJVM));

						while ((sCurrLine = br.readLine()) != null)
						{
							alHeaderList.add(sCurrLine);

						}
					}
				}
			}
                        return readHeaderArrayList(request);

		}
		catch(Exception e)
		{
			return null;
		}
		finally
		{
			try{
				if(br != null)
					br.close();
			}
			catch(Exception ioe){
			}
		}
	}
	
	private boolean checkFileAccess(String sFile)
	{
		boolean readAccess = false;
		File file = new File(sFile);
		if(file.exists()){
			readAccess = file.canRead();
		}
		return readAccess;
	}

	private String readHeaderArrayList(HttpServletRequest request)
	{
		try
		{
			if(null == alHeaderList || (alHeaderList.isEmpty())){
				return request.getRemoteAddr();
			}

			Iterator<String> itr = alHeaderList.iterator();
			while(itr.hasNext())
			{
				String sIP = request.getHeader(itr.next());
				if (sIP != null && sIP.length() != 0 && !"unknown".equalsIgnoreCase(sIP)) {
					return sIP;
				}

			}
			return request.getRemoteAddr();
		}
		catch (Exception e)
		{
			return request.getRemoteAddr();
		}
	}
	
}
