/// <reference path="Main_JSObjects.js" />
/// <reference path="Main_Helpers.js" />
/// <reference path="Adv_Helpers.js" />
/// <reference path="Main_Objects.js" />
/// <reference path="Adv_Objects.js" />
/// <reference path="AJAXHandler.js" />
/// <reference path="Main_JSObjects.js" />
/// <reference path="Main_DOM.js" />
/// <reference path="Main_Events.js" />

PickTypes = { Keeper: 1, OnClock: 2, Pick: 3 }

function evt_Submit_onclick(e) 
{
    var elPlayer = GEId('ui_tbPlayer');

    var sPlayer = elPlayer.value;
    submitPick(sPlayer);
}

function evt_Chat_onclick(oEvt)
{
    var elText = GEId('ui_tbChat');
    var sText = encodeURIComponent(elText.value);
    submitChat(sText);
}

function onChatSubmitResponse(oJSON)
{
    if (exists(oJSON))
        uiUpdateChat(oJSON);
    var elText = GEId('ui_tbChat');
    if (exists(elText))
        elText.value = '';
}

function onSubmitPickResponse(oJSON)
{
    if (exists(oJSON))
        updateSubmitUI(oJSON);
    var elPlayer = GEId('ui_tbPlayer');
    if (exists(elPlayer))
        elPlayer.value = '';
}

function evt_Player_onkeyup()
{
    var elSearch = GEId('ui_divSearch');

    var elPlayer = GEId('ui_tbPlayer');
    if (elPlayer.value.length > 2)
    {
        var sText = elPlayer.value.toLowerCase();
        if (sText == elPlayer._value)
            return;
        else
        {
            elPlayer._value = sText;
            if (!exists(g_oSearchCache[sText]))
            {
                var arrMatchIds = [];
                // PlayerMap: { <id>: { ID: <id>, Name: <name>, TeamInfo: <teaminfo>, Picked: <true|false> }, <id>: { } ....}
                for (var pId in PlayerMap)
                {
                    if (exists(PlayerMap[pId]) && !isFunction(PlayerMap[pId]))
                    {
                        if (PlayerMap[pId].Name.toLowerCase().indexOf(sText) != -1 ||
                            PlayerMap[pId].TeamInfo.toLowerCase().indexOf(sText) != -1)
                            arrMatchIds.push(pId);
                    }
                }
                g_oSearchCache[sText] = arrMatchIds;
            }
            if (exists(g_oSearchCache[sText]))
            {
                while (elSearch.hasChildNodes())
                    elSearch.removeChild(elSearch.firstChild);

                var arrMatches = g_oSearchCache[sText];
                for (var i = 0; i < arrMatches.length; i++)
                {
                    var oPlayer = PlayerMap[arrMatches[i]];
                    if (!oPlayer.Picked)
                    {
                        var elRow = CE('div');
                        var playerData = oPlayer.Name + " - " + oPlayer.TeamInfo;
                        var elLink = CE('a');
                        elLink.href = '#';
                        elLink.appendChild(CTXT(playerData));
                        elLink.className = 'result';
                        elLink.plyrID = arrMatches[i];
                        EVENT.add(elLink, EVENT.Name.OnClick, evt_SearchResult_onclick);
                        elRow.appendChild(elLink);
                        elSearch.appendChild(elRow);
                    }
                }
            }
        }
    }
    else
    {
        while (elSearch.hasChildNodes())
            elSearch.removeChild(elSearch.firstChild);
    }
}

function evt_DraftPlayer_onclick(oEvt)
{
    var plyrId = null;
    var elQueue = GEId("ui_liQueue");
    if (elQueue.options.length > 0 &&
        elQueue.selectedIndex >= 0)
        plyrId = elQueue.value;
    submitPick(plyrId);
}

function evt_SearchResult_onclick(oEvt)
{
    var el = EVENT.getTarget(oEvt);
    addToQueue(el.plyrID);
    return EVENT.end(oEvt);
}

function evt_QueueRemove_onclick(oEvt)
{
    var elQueue = GEId("ui_liQueue");
    if (elQueue.selectedIndex >= 0)
        elQueue.options.remove(elQueue.selectedIndex);
}

function addToQueue(playerId)
{
    var elQueue = GEId('ui_liQueue');
    var iIndex = getIndexOfQueuePlayer(playerId);
    if (iIndex == -1)
    {
        var iPid = parseInt(playerId);
        var elOption = CE('option');
        elOption.innerHTML = PlayerMap[iPid].Name + " - " + PlayerMap[iPid].TeamInfo;
        elOption.value = iPid;
        elQueue.appendChild(elOption);
    }
}

function removeFromQueue(playerId)
{
    var index = getIndexOfQueuePlayer(playerId);
    if (index != -1)
    {
        var elQueue = GEId('ui_liQueue');
        elQueue.options.remove(index);
    }       
}

function getIndexOfQueuePlayer(playerId)
{
    var elQueue = GEId('ui_liQueue');
    var index = -1;
    for (var i = 0; i < elQueue.options.length; i++)
    {
        if (elQueue.options[i].value == playerId)
        {
            index = i;
            break;
        }
    }
    return index;
}

function showDraftResult(iResult)
{
    var retVal = false;
    var elMessage = GEId('ui_tdMessage');
    while (elMessage.hasChildNodes())
        elMessage.removeChild(elMessage.firstChild);

    switch (iResult)
    {
        case 0:
            elMessage.appendChild(CTXT("The player was picked successfully"));
            retVal = true;
            break;
        case 1:
            elMessage.appendChild(CTXT("It's not your turn to pick"));
            break;
        case 2:
            elMessage.appendChild(CTXT("The player you entered is invalid or does not exists"));
            break;
        case 3:
            elMessage.appendChild(CTXT("That player has already been chosen"));
            break;
        case 10:
            elMessage.appendChild(CTXT("Add a player to your queue, select them, and then click 'Draft'"));
            break;            
    }
    return retVal;
}

function updateSubmitUI(oJSON)
{
    return showDraftResult(oJSON.Result);
}

function uiUpdateChat(oJSON) 
{
    return true;
}

function updateClockUI(elClock, sClass, oSettings, sLateClass, sHeadText)
{
    if (isDOMElement(elClock))
    {
        var iTimeLeft = elClock.amount;
        if (iTimeLeft > -1)
        {
            elClock.className = (iTimeLeft < oSettings.ClockWarn) ? sLateClass : sClass;
            var minutes = Math.floor(iTimeLeft / 60);
            var seconds = iTimeLeft - (60 * minutes);
            while (elClock.hasChildNodes())
                elClock.removeChild(elClock.firstChild);
            if (sHeadText)
            {
                elClock.appendChild(CTXT(sHeadText));
                elClock.appendChild(CE('br'));
            }
            elClock.appendChild(CTXT(minutes + ":" + (seconds < 10 ? "0" : "") + seconds));
        }
    }
}

function updateClock(elClock, oSettings, iTime, fUpdateUI)
{
    if (isDOMElement(elClock, 'div'))
    {
        elClock.amount = iTime;
        if (fUpdateUI)
            updateClockUI(elClock, 'clock', oSettings, 'clock clockRed');       
    }
}

function submitPick(sPlayer)
{
    if (!exists(sPlayer))
    {
        showDraftResult(10);
        return;
    }

    var params = 'player=' + sPlayer;

    var oAJAX = new AJAXHandler('Submit.aspx', AJAX_ReqType_POST, false);
    oAJAX.sendRequest(params, handleResponse, handleResponse);

    function handleResponse(oHandler) 
    {
        if (oHandler.isSuccess())
            onSubmitPickResponse(JSONObject(oHandler.getResponseText()));
        else
            onSubmitPickResponse(null);
    }
}

function submitChat(sTxt)
{
    var params = 'command=submit&text=' + sTxt;

    var oAJAX = new AJAXHandler('Chat.aspx', AJAX_ReqType_POST, false);
    oAJAX.sendRequest(params, handleResponse, handleResponse);

    function handleResponse(oHandler) 
    {
        if (oHandler.isSuccess())
            onChatSubmitResponse(JSONObject(oHandler.getResponseText()));
        else
            onChatSubmitResponse(null);
    }
}

function getDraftData() 
{
    var handler = new AJAXHandler("Status.aspx", AJAX_ReqType_POST, false);
    handler.sendRequest("", handleResponse, handleResponse);

    function handleResponse(oHandler) 
    {
        if (oHandler.isSuccess())
            onDraftDataLoad(JSONObject(oHandler.getResponseText()));
    }
}

function getChatData() 
{
    var params = 'command=query';

    var handler = new AJAXHandler("Chat.aspx", AJAX_ReqType_POST, false);
    handler.sendRequest(params, handleResponse, handleResponse);

    function handleResponse(oHandler) 
    {
        if (oHandler.isSuccess())
            onChatDataLoad(JSONObject(oHandler.getResponseText()));
    }
}

// ChatData: { Lines: [{User: <username>, Text: <text>}, { }] }
function updateChatBoxUI(elChatRoom, oChatData)
{
    while (elChatRoom.hasChildNodes())
        elChatRoom.removeChild(elChatRoom.firstChild);
    for (var i = 0; i < oChatData.Lines.length; i++)
    {
        var elRow = CE('div');
        elRow.className = 'chatRow';
        elChatRoom.appendChild(elRow);

        var currData = oChatData.Lines[i];
        var elSpan = CE('span');
        elSpan.className = 'chatUser color' + currData.User;
        elSpan.innerHTML = currData.User;
        _elWS(elSpan, 1);
        elRow.appendChild(elSpan);

        elSpan = CE('span');
        elSpan.innerHTML = currData.Text;
        elRow.appendChild(elSpan);
    }
    var chatScr = new ChatScroll(elChatRoom.id);
    chatScr.activeScroll();
}

function updateDraftPicksUI(arrPicks, arrGrid, oPlayerMap, oClassMap)
{
    if (isArray(arrPicks))
    {
        //   DraftPicks: [{Round: <round>, Pick: <pick>, Team: <userid>, Type: <inttype>, Player: <playerid>}, {}]
        //   OnTheClock: [{Round: <round>, Pick: <pick>, Team: <userid>, Type: <inttype>}, {}],
        //   PlayerMap: { <id>: { ID: <id>, Name: <name>, TeamInfo: <teaminfo>, Picked: <true|false> }, <id>: { } ....}
        //   UserMap: { <id>: { ID: <id>, Name: <username>, Team: <teamname>, Pick: <order>}, <id>: { }...}
        //   OrderMap: { <order> : <userid> }
        //   arrPicks = 
        //   [{Round: <round>, Pick: <pick>, Team: <userid>, Type: <inttype>}, {}] OR
        //   [{Round: <round>, Pick: <pick>, Team: <userid>, Type: <inttype>, Player: <playerid>}, {}]
        var elLastOnClock = null;
        for (var i = 0; i < arrPicks.length; i++)
        {
            var oPick = arrPicks[i];
            var elTd = GEId(arrGrid[oPick.Round][oPick.Pick]);
            if (!exists(elTd._override))
            {
                if (oPick.Team != OrderMap[oPick.Pick])
                {
                    elTd._override = true;
                    elTd._overrideId = oPick.Team;
                    elTd._overrideName = UserMap[oPick.Team].Name.toUpperCase()
                }
                else
                {
                    elTd._override = false;
                }
            }
            while (elTd.hasChildNodes())
                elTd.removeChild(elTd.firstChild);
            if (oPick.Type == PickTypes.OnClock)
            {
                if (elTd._override)
                {
                    elTd.appendChild(CTXT('(' + elTd._overrideName + ')'));
                    elTd.appendChild(CE('br'));
                }
                elTd.appendChild(CTXT('On The Clock'));
                elLastOnClock = elTd;
            }
            else if (exists(oPick.Player) && exists(oPlayerMap[oPick.Player]))
            {
                if (elTd._override)
                {
                    elTd.appendChild(CTXT('(' + elTd._overrideName + ')'));
                    elTd.appendChild(CE('br'));
                }
                elTd.appendChild(CTXT(oPlayerMap[oPick.Player].Name));
                elTd.appendChild(CE('br'));
                elTd.appendChild(CTXT(oPlayerMap[oPick.Player].TeamInfo));
                oPlayerMap[oPick.Player].Picked = true;
                removeFromQueue(oPick.Player);
            }
            else if (elTd._override)
            {
                elTd.appendChild(CTXT('Traded To:'));
                elTd.appendChild(CE('br'));
                elTd.appendChild(CTXT(elTd._overrideName));
            }

            if (exists(oClassMap[oPick.Type]))
            {
                elTd.className = (oPick.Type < PickTypes.Keeper && elTd._override) ? 'draftCell draftPickOverride' : oClassMap[oPick.Type];
            }
            else
                elTd.className = elTd._override ? 'draftCell draftPickOverride' : '';
        }
        g_oLastOnClock = elLastOnClock;
    }
}

function updateUserStatus(oActive, iIgnore, oSettings, oOrderMap)
{
    if (exists(oActive))
    {
        for (var iPick = 1; iPick <= oSettings.Teams; iPick++)
        {
            var iUserID = oOrderMap[iPick];
            if (iUserID != iIgnore)
            {
                var headerTD = GEId('header' + iPick);
                var footerTD = GEId('footer' + iPick);
                if (exists(oActive[iUserID]))
                    headerTD.className = footerTD.className = 'draftCell activeHead';
                else
                    headerTD.className = footerTD.className = 'draftCell draftHead';
            }
        }
    }
}

ChatScroll = function (sElementId)
{
    this.m_iThreshold = 100;
    this.m_sElementId = sElementId;
}
ChatScroll.prototype =
{
    activeScroll: function ()
    {
        var height = 0;
        var el = GEId(this.m_sElementId);

        if (el.scrollHeight > 0)
            height = el.scrollHeight;
        else if (el.offsetHeight > 0)
            height = el.offsetHeight;

        if (height - el.scrollTop - (el.style.pixelHeight || el.offsetHeight) < this.m_iThreshold)
            el.scrollTop = height;
    }
}