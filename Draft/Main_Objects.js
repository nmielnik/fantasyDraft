/// <reference path="Main_Helpers.js" />

// *******************************************************
// ***************** JSON() object  **********************
// *******************************************************
JSONObject = function (text)
{
    var objJSON = null;
    if (text)
    {
        try
        {
            /*
            //standard JSON regexp.
            if (/^[\],:{}\s]*$/.test(text.replace(/\\./g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
            {
            objJSON = eval('(' + text + ')');
            }*/
            objJSON = eval('(' + text + ')');
        }
        catch (e) { }
    }
    return objJSON;
}