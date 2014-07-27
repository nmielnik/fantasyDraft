// <reference path="Main_DOM.js" />

function _elNewRow(elTbl, iInsertAt)
{
    if (!iInsertAt)
        iInsertAt = -1;
    if (elTbl != null)
        return elTbl.insertRow(iInsertAt);
    return null;
}

function _elNewCell(elRow, sID, sClassName)
{
    var td = null;

    if (elRow != null) 
    {
        if (!elRow.insertCell) 
        {
            td = CE('td');
            elRow.appendChild(td);
        }
        else
            td = elRow.insertCell(-1);
        if (sID)
            td.id = sID;
        if (sClassName)
            td.className = sClassName;
    }

    return td;
}

function _elNewCells(elRow, iNumCells)
{
    var arrCells = new Array();
    if (elRow && iNumCells > 0)
    {
        for (var i = 0; i < iNumCells; i++)
            arrCells[i] = _elNewCell(elRow);
    }
    return arrCells;
}