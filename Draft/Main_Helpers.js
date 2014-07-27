/// <reference path="Main_JSObjects.js" />

function exists(v) { return ((v) ? true : (v == 0 || v == false || v == "")); }
function valOrDefault(oVal, oDefault) { return ((exists(oVal)) ? oVal : oDefault); }
function valOrEmpty(val) { return (val) ? val : ""; }

function isArray(a) { return a instanceof Array; }
function isFunction(f) { return 'function'.equals(typeof (f), true); }
function isString(s) { return typeof (s) == 'string'; }