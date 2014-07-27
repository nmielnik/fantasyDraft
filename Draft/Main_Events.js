/// <reference path="Main_Helpers.js" />
/// <reference path="Main_DOM.js" />
/// <reference path="Main_JSObjects.js" />

var EVENT =
{
    // Constants
    NamePrefix: 'on',

    // Enums
    Name:
    {
        OnAbort: 'abort', OnBlur: 'blur', OnChange: 'change', OnClick: 'click', OnError: 'error', OnFocus: 'focus',
        OnKeyPress: 'keypress', OnLoad: 'load', OnMouseOut: 'mouseout', OnMouseOver: 'mouseover', OnMouseMove: 'mousemove',
        OnSubmit: 'submit', OnResize: 'resize', OnKeyDown: 'keydown', OnReadyStateChange: 'readystatechange',
        OnKeyDown: 'keydown', OnKeyUp: 'keyup'
    },
    // Functions
    "get": function (objE) { return (objE || window.event) },
    getTarget: function (objE)
    {
        var evt = EVENT.get(objE);
        return evt.srcElement || evt.target;
    },
    // NOTE: From WL_BuildingBlocks_Include.js
    //used to add an event handler on either IE or Firefox
    add: function add(obj, evt, fn)
    {
        var fullName = EVENT.NamePrefix + evt;

        //W3C standards event model
        if (obj.addEventListener)
            obj.addEventListener(evt, fn, false);
        //IE event model
        else if (obj.attachEvent)
            obj.attachEvent(fullName, fn);
    },
    disable: function disable(objEvent)
    {
        /// <summary>Stops the event from bubbling to other elements in the page.
        /// NOTE: This will NOT prevent the event from completing any default behavior on the target element (call EVENT.end)</summary>
        /// <param name="objEvent">[Firefox Only] (Event Object) In Firefox, the event to disable</param>
        objEvent = EVENT.get(objEvent);
        if (isFunction(objEvent.stopPropagation))
            objEvent.stopPropagation();
        objEvent.cancelBubble = true;
    },
    end: function end(objEvent)
    {
        /// <summary>Stops the event from executing any other behavior on the current element.
        /// NOTE: This will NOT prevent the event being triggered on other elements in the document (call EVENT.disable)</summary>
        /// <param name="objEvent">[Firefox Only] (Event Object) In Firefox, the event to end</param>
        objEvent = EVENT.get(objEvent);
        if (isFunction(objEvent.preventDefault))
            objEvent.preventDefault();
        objEvent.returnValue = false;
        return false;
    }
}