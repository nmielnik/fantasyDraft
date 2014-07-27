/// <reference path="Main_Helpers.js" />

// HTTP (RFC-2616) & WebDAV (RFC-2518)
var AJAX_ReqType_POST = "POST";  // Request URI

var AJAX_ReadyState_UNSENT = 0; // The object has been created, but not initialized (the open method has not been called).
var AJAX_ReadyState_OPEN = 1; // The object has been created, but the send method has not been called.
var AJAX_ReadyState_SENT = 2; // The send method has been called. responseText is not available. responseBody is not available.
var AJAX_ReadyState_LOADING = 3; // Some data has been received. responseText is not available. responseBody is not available.
var AJAX_ReadyState_DONE = 4; // All the data has been received. responseText is available. responseBody is available. 

// See http://msdn.microsoft.com/en-us/library/ms767625(VS.85).aspx for all values of the 'status' property
// Non-Failure Status
var HTTPStatus_OK = 200;
var HTTPStatus_NOT_MODIFIED = 304;

// urlTarget = (URL) Required. String that specifies either the absolute or a relative URL of the XML data or server-side XML Web services.
// eReqType = (AJAX_ReqType/String) Required. specifies the HTTP method used to open the connection: such as GET, POST, or HEAD. 
//            This parameter is not case-sensitive.
// fAsync = (Variant) Optional. Variant that specifies true for asynchronous operation (the call returns immediately), or false for synchronous operation. 
//           If true, assign a callback handler to the onreadystatechange property to determine when the call has completed. If not specified, the default is true. 
//           Performance Note   When bAsync is set to false, send operations are synchronous, and Windows Internet Explorer does not accept input 
//           or produce output while send operations are in progress. Therefore, this setting should not be used in situations where 
//           it is possible for a user to be waiting on the send operation to complete.
//           Default: true
// sUser = (Variant) Optional. Variant that specifies the name of the user for authentication. 
//           If this parameter is null ("") or missing and the site requires authentication, the component displays a logon window.
//           Default: null ("")
// sPassword = (Variant) Optional. Variant that specifies the password for authentication. 
//              This parameter is ignored if the user parameter is null ("") or missing.
//              Default: null ("")
// sHeaderName = (String) Optional. Defaults to 'Content-type'
// sHeaderValue = (String) Optional. Defaults to 'application/x-www-form-urlencoded'
AJAXHandler = function(urlTarget, eReqType, fAsync, sUser, sPassword, sHeaderName, sHeaderValue)
{
    this.m_objXMLHttp = null;

    this.m_urlTarget = valOrEmpty(urlTarget);
    this.m_strReqType = valOrEmpty(eReqType);
    this.m_fAsync = (fAsync != null) ? fAsync : true;
    this.m_strUser = valOrEmpty(sUser);
    this.m_strPwd = valOrEmpty(sPassword);
    this.m_strHeaderName = (sHeaderName != null) ? (sHeaderName) : 'Content-type';
    this.m_strHeaderValue = (sHeaderValue != null) ? (sHeaderValue) : 'application/x-www-form-urlencoded';

    this.initialize();

    this.m_strRequest = '';
    this.m_strRespose = '';

    // By Default, 200 & 304 will count as success
    // Additional HTTP Status codes can be counted/not-counted through the addSuccessCode()/addFailCode() methods
    this.m_arrHTTPSuccess = new Array();
    this.m_arrHTTPSuccess[HTTPStatus_OK] = true;
    this.m_arrHTTPSuccess[HTTPStatus_NOT_MODIFIED] = true;
}

AJAXHandler.prototype =
{
    initialize: function(fnHandleFailure)
    {
        if (this.m_objXMLHttp == null)
            this.m_objXMLHttp = new _XMLHttpRequest();

        try
        {
            if (this.m_strUser.length > 0)
                this.m_objXMLHttp.open(this.m_strReqType, this.m_urlTarget, this.m_fAsync, this.m_strUser, this.m_strPwd);
            else
                this.m_objXMLHttp.open(this.m_strReqType, this.m_urlTarget, this.m_fAsync);

            this.m_strResponse = '';

            this.m_objXMLHttp.setRequestHeader(this.m_strHeaderName, this.m_strHeaderValue);
        }
        catch (e)
        {
            if (fnHandleFailure)
                fnHandleFailure(this);
        }
    },
    // strRequest = (String) Required. Raw AJAX request to send
    // fnHandleSuccess = (function ptr) Optional. Callback function to call when AJAX request has completed successfully (AJAXHandler sent as parameter)
    // fnHandleFailure = (function ptr) Optional. Callback function to call when AJAX request has completed, but with failure (AJAXHandler sent as parameter)
    sendRequest: function(sRequest, fnHandleSuccess, fnHandleFailure)
    {
        var self = this;
        if (this.m_objXMLHttp == null || this.getState() != AJAX_ReadyState_OPEN)
        {
            this.initialize();
            this.m_strRequest = sRequest;
        }

        this.m_strRequest = sRequest;
        if (isFunction(fnHandleFailure) || isFunction(fnHandleSuccess))
        {
            this.m_objXMLHttp.onreadystatechange = function()
            {
                if (!self.isComplete())
                    return;
                self.m_strResponse = self.m_objXMLHttp.responseText;
                if (self.isSuccess())
                {
                    if (isFunction(fnHandleSuccess))
                        fnHandleSuccess(self);
                }
                else
                {
                    if (isFunction(fnHandleFailure))
                        fnHandleFailure(self);
                }
            }
        }
        if (this.getState() == 4)
            return false;

        this.m_objXMLHttp.send(this.m_strRequest);
    },
    evt_stateChange: function()
    {
        if (this.m_objXMLHttp)
        {
            var currState = this.getState();
            if (this.m_arrStateHandlers[currState])
            {
                var handler = this.m_arrStateHandlers[currState];
                var currStatus = this.getStatus();
                if (currState <= AJAX_ReadyState_OPEN)
                    handler(this);
                else
                {
                    if (this.isSuccess() && handler[1])
                        handler[1](this);
                    else if (!this.isSuccess() && handler[0])
                        handler[0](this);
                }
            }
        }
    },

    addSuccessCode: function(httpCode)
    {
        if (httpCode)
            this.m_arrHTTPSuccess[httpCode] = true;
    },
    addFailCode: function(httpCode)
    {
        if (httpCode && this.m_arrHTTPSuccess[httpCode])
            this.m_arrHTTPSuccess[httpCode] = false;
    },
    getState: function()
    {
        if (this.m_objXMLHttp)
            return this.m_objXMLHttp.readyState;
        return AJAX_ReadyState_UNSENT;
    },
    getStatus: function()
    {
        if (this.m_objXMLHttp)
            return this.m_objXMLHttp.status;
        return 0;
    },
    getResponseText: function() { return this.m_strResponse; },
    getTarget: function() { return this.m_urlTarget; },
    getReqType: function() { return this.m_strReqType; },
    getAsync: function() { return this.m_fAsync; },
    getRequestText: function() { return this.m_strRequest; },
    isPending: function()
    {
        if (this.m_objXMLHttp)
        {
            var state = this.getState();
            if (state > AJAX_ReadyState_OPEN && state < AJAX_ReadyState_DONE)
                return true;
        }
        return false;
    },
    isComplete: function() { return (this.m_objXMLHttp && (this.getState() == AJAX_ReadyState_DONE)); },
    isSuccess: function() { return (this.isComplete() && (this.m_arrHTTPSuccess[this.getStatus()])); }
}


// **********************************************************************************************
// ***************** XMLHttpRequest() object (AJAX) *********************************************
// **********************************************************************************************
_XMLHttpRequest = function ()
{
    if (exists(_XMLHttpRequest.variantIndex))
        return _XMLHttpRequest.variants[_XMLHttpRequest.variantIndex]();
    if (!exists(_XMLHttpRequest.variants))
    {
        _XMLHttpRequest.variants = [
                                    function () { return new XMLHttpRequest() },
                                    function () { return new ActiveXObject("Msxml2.XMLHTTP") },
                                    function () { return new ActiveXObject("Msxml3.XMLHTTP") },
                                    function () { return new ActiveXObject("Microsoft.XMLHTTP") }
                                   ];
    }
    var ajaxObj = null;
    for (var i = 0; i < _XMLHttpRequest.variants.length; i++)
    {
        try { ajaxObj = _XMLHttpRequest.variants[i](); } catch (e) { continue; }
        _XMLHttpRequest.variantIndex = i;
        break;
    }
    return ajaxObj;
}