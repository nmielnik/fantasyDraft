var NodeType = { Element: 1, Attribute: 2, Text: 3, CDATA: 4, EntityRef: 5, Entity: 6, ProcInst: 7, Comment: 8,
    Doc: 9, DocType: 10, DocFrag: 11, Notation: 12
}

function GEId(id) { return document.getElementById(id); }

function CE(sTag, sName, sType)
{
    if (!sName && !sType)
        return document.createElement(sTag);
    else
    {
        try
        {
            var sFull = '<' + sTag;
            if (exists(sType))
                sFull += ' type="' + sType + '"';
            if (exists(sName))
                sFull += ' name="' + sName + '"';
            sFull += '>';
            return document.createElement(sFull); 
        }
        catch (exc)
        {
            var el = document.createElement(sTag);
            if (exists(sName))
                el.name = sName;
            if (exists(sType))
                el.type = sType;
            return el;
        }
        finally
        {
            el = null;
        }
    }
}

function CTXT(sText) { return document.createTextNode(sText); }

function isDOMElement(el, sName)
{
    return (exists(el) &&
            el.nodeType == NodeType.Element &&
            (!isString(sName) || el.tagName.equals(sName, true)));
}

function _elText(sText)
{
    /// <summary>Creates a Text Node DOM element through document.createTextNode()</summary>
    /// <param name="sText">(string) innter Text of Text Node</param>
    /// <returns>A Text Node to append to an HTML element</returns>
    if (typeof sText != 'string')
        sText = '';
    var node = document.createTextNode(sText);
    try
    {
        return node;
    }
    finally
    {
        node = null;
    }
}

function _elWS(element, iNumSpaces, fUseLabel)
{
    /// <summary>Appends TextNode elements with a single white space to the provided HTML DOM object</summary>
    /// <param name="element">(DOM Object) object to insert white space into</param>
    /// <param name="iNumSpace">(int) number of spaces to insert</param>
    /// <returns>(void)</returns>
    if (element && iNumSpaces > 0)
    {
        for (var i = 0; i < iNumSpaces; i++)
        {
            element.appendChild(document.createTextNode('\u00a0'));
        }
    }
}