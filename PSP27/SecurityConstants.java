/*
 * (#)SecurityConstants.java  1.00 18/Mar/2009
 *
 * Copyright (c) 2006 Infosys Technologies Ltd.
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Infosys Technologies Ltd.("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Infosys.
 */

package com.infy.finacle.fcutil;

/**
 * This class contains all constants used in Security classes of Finacle Core.
 *
 */


public interface SecurityConstants
{
	String  rtId                = "rtId";
	String  REQ_ID              = "reqId";
	String 	IS_VALID_REQUEST	= "REQ_CODE";
	String	SUCCESS_CODE		= "0";
	String  FAILURE           	= "1";
	String  XSS_CODE            = "1";
	String  CXRF_CODE           = "2";
	String  IS_VALID_REQID      = "REQ_VALID";
	String  RESTRICT_ACCESS		= "RESTRICTED_ACCESS";
	String  INVALID_REQUEST_SEARCHER = "INVALID_REQUEST_SEARCHER";
	String  MAL_CODE            = "MALICIOUS_CODE_FOUND";
	String  MAL_REQ             = "INVALID_REQUEST";
	String  IS_POP_UP           = "IS_POP_UP";
	String  STR_YES             = "Y";
	String  STR_NO              = "N";
	String  reqUnqId		= "reqUnqId";
	String  REQ_FORGED_CODE		= "3";
	String  SUBMIT_FORM		= "?submitform=";
	String  ACTION_CODE		= "?actionCode=";
	String  GET		= "GET";
}
