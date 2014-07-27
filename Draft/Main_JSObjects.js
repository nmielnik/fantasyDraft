/// <reference path="Main_Helpers.js" />

// ------------------------------------------------------------------------
// -------------------- String Extended Methods ---------------------------
// ------------------------------------------------------------------------

String.prototype.trim = function ()
{
    /// <summary>Removes all leading and trailing white space from this String</summary>
    /// <returns>voide</returns>
    return this.replace(/^\s+|\s+$/g, "");
}

String.prototype.equals = function (sString, fIgnoreCase)
{
    /// <summary>Compares this String to sString for equality</summary>
    /// <param name="sString">(String) String to compare this String to</param>
    /// <param name="fIgnoreCase">[OPTIONAL] (bool) TRUE: Do a case-insensitive comparison.
    /// FALSE/Default: Case-Sensitive Comparison</param>
    /// <returns>True of Strings are Equal, False otherwise</returns>
    if (!isString(sString))
        return false;
    if (fIgnoreCase)
        return this.toLowerCase() == sString.toLowerCase();
    else
        return this == sString;
}