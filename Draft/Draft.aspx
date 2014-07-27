<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Draft.aspx.cs" Inherits="Draft" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Ballers Unite Draft</title>

    <link rel="Stylesheet" href="controls.css" type="text/css" />
    <link rel="Stylesheet" href="BallersDraft2010.css" type="text/css" />
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.14/require.min.js"></script>
    <script type="text/javascript">
        require.config({
            paths: {
                "jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min",
                "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min",
                "backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min",
                "text": "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text"
            }
        });

        define('PlayerMap', ['jquery'], function ($) {
            if (!window.PlayerMap) {
                window.PlayerMap = $.parseJSON('<%= PlayerTableJSON %>');           // PlayerMap: { <id>: { ID: <id>, Name: <name>, TeamInfo: <teaminfo>, Picked: <true|false> }, <id>: { } ....}
            }
            return window.PlayerMap;
        });

        define('UserMap', ['jquery'], function ($) {
            if (!window.UserMap) {
                window.UserMap = $.parseJSON('<%= UserTableJSON %>');                 // UserMap: { <id>: { ID: <id>, Name: <username>, Team: <teamname>, Pick: <order>}, <id>: { }...}
            }
            return window.UserMap;
        });

        define('OrderMap', ['jquery'], function ($) {
            if (!window.OrderMap) {
                window.OrderMap = $.parseJSON('<%= OrderMapJSON %>');                // OrderMap: { <order> : <userid> }
            }
            return window.OrderMap;
        });

        define('CurrentUser', ['jquery'], function ($) {
            if (!window.CurrentUser) {
                window.CurrentUser = $.parseJSON('<%= CurrentUserJSON %>');           // CurrentUser: { ID: <id>, Name: <username>, Team: <teamname>, Pick: <order> }
            }
            return window.CurrentUser;
        });

        define('Settings', ['jquery'], function ($) {
            if (!window.Settings) {
                window.Settings = $.parseJSON('<%= SettingsJSON %>');                 // Settings: { Teams: <count>, Rounds: <count>, PickSeconds: <seconds>, SeasonID: <id>, ClockWarn: <seconds>, RefreshRate: <
            }
            return window.Settings;
        });
    </script>

    <script type="text/javascript">
        require(["draft.app.js"]);
    </script>
</head>
<body>
    
    <script type="text/javascript" src="AJAXHandler.js"></script>
    <script type="text/javascript" src="Main_Events.js"></script>
    <script type="text/javascript" src="Main_Objects.js"></script>
    <script type="text/javascript" src="Main_Helpers.js"></script>
    <script type="text/javascript" src="Main_JSObjects.js"></script>
    <script type="text/javascript" src="Main_DOM.js"></script>
    <script type="text/javascript" src="Main_Tables.js"></script>
    <script type="text/javascript" src="_Draft.js"></script>
    <!-- <%= UserData.toJson() %> -->
    <table style="width: auto">
        <tr>
            <td id="draft-board-holder">
            </td>
            <td class="top">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="top">
                            <table class="clock" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <div id="ui_tdClock" data-amount="90" class="clock"></div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="top">
                            <table class="rightCol" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="chatCell" align="center">
                                        <div class="whiteBack">Draft Queue</div>
                                    </td>
                                </tr>
                            </table>
                            <table class="rightCol" cellpadding="0" cellspacing="4">
                                <tr>
                                    <td class="splitCell">
                                        <label for="ui_tbPlayer">Player Search:</label>
                                        <input class="search" type="text" id="ui_tbPlayer" name="player" onkeyup="evt_Player_onkeyup(event)" />
                                    </td>
                                    <td class="message" id="ui_tdMessage">
                                        &nbsp;
                                    </td>
                                </tr>
                                <tr>
                                    <td class="colhead">Results:</td>
                                    <td class="colhead">Queue:</td>
                                </tr>
                                <tr>
                                    <td class="splitCell" rowspan="2">
                                        <div class="searchResults" id="ui_divSearch"></div>
                                    </td>
                                    <td class="splitCell top">
                                        <select size="10" id="ui_liQueue">
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top">
                                        <table class="queue" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="splitCell" align="center">
                                                    <input type="button" value="Draft" class="default draft" onclick="evt_DraftPlayer_onclick(event)" />
                                                </td>
                                                <td class="splitCell" align="center">
                                                    <input type="button" value="Remove" class="remove" onclick="evt_QueueRemove_onclick(event)" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="top chatsection">
                            <table class="rightCol" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="chatCell" align="center">
                                        <div class="whiteBack">Chat</div>
                                    </td>
                                </tr>
                            </table>
                            <form name="chat" onsubmit="evt_Chat_onclick(event);return false;" action="#">
                                <table class="rightCol" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td class="chatCell" align="center">
                                            <div class="chatRoom" id="ui_divChatRoom"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="chatCell" align="center">
                                            <input type="text" class="chatText" id="ui_tbChat" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="chatCell" align="center">
                                           <input class="default chat" type="submit" id="ui_btnChat" value="Submit" />
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <script type="text/javascript">

        var cellIdPrefix = 'Td';
        //var g_oDraftGrid = drawDraftTable(cellIdPrefix);
        var g_oLastOnClock = null;
        var g_oSearchCache = {};

        //doUpdate();

        function doUpdate() {
            try {
                getDraftData();
            }
            catch (exc) { }
            //setTimeout(showChat, Settings.RefreshRate);
        }

        function onDraftDataLoad(oData) {
            // { 
            //   TimeLeft: <seconds>, 
            //   ActiveUsers: { <userid>: <userid>, <userid>: <userid> },
            //   OnTheClock: [{Round: <round>, Pick: <pick>, Team: <userid>, Type: <inttype>}, {}],
            //   DraftPicks: [{Round: <round>, Pick: <pick>, Team: <userid>, Type: <inttype>, Player: <playerid>}, {}]
            // }

            try {
                // Update Clock
                updateClock(GEId("ui_tdClock"), Settings, oData.TimeLeft, true);

                // Update Picks/Keepers
                updateDraftPicksUI(oData.DraftPicks, g_oDraftGrid, PlayerMap, ['draftCell draftEmpty', 'draftCell draftPickKeeper', 'draftCell draftPickActive', 'draftCell draftPick']);

                // Update On-The-Clock
                updateDraftPicksUI(oData.OnTheClock, g_oDraftGrid, PlayerMap, ['draftCell draftEmpty', 'draftCell draftPickKeeper', 'draftCell draftPickActive', 'draftCell draftPick']);

                // Update Header & Footer
                updateUserStatus(oData.ActiveUsers, CurrentUser.ID, Settings, OrderMap);

                // Update the Last Pick to also be a clock
                if (exists(g_oLastOnClock)) {
                    var sHeading = null;
                    if (g_oLastOnClock._override)
                        sHeading = '(' + g_oLastOnClock._overrideName + ')';
                    g_oLastOnClock.amount = oData.TimeLeft;
                    updateClockUI(g_oLastOnClock, 'draftCell draftPickActive', Settings, 'draftCell draftPickActive', sHeading);
                }
            }
            catch (ex) { }
        }

        function showChat() {
            try {
                getChatData();
            }
            catch (ex) { }
            //setTimeout(doUpdate, Settings.RefreshRate);
        }

        function onChatDataLoad(oData) {
            // ChatData: { Lines: [{User: <username>, Text: <text>}, { }] }

            try {
                // Update The Chat Room
                updateChatBoxUI(GEId('ui_divChatRoom'), oData);
            }
            catch (ex) { }
        }

        function drawDraftTable(sCellIdPrefix) {
            // Settings: { Teams: <count>, Rounds: <count>, PickSeconds: <seconds>, SeasonID: <id> }
            // UserMap: { <id>: { ID: <id>, Name: <username>, Team: <teamname>, Pick: <order>}, <id>: { }...}
            // CurrentUser: { ID: <id>, Name: <username>, Team: <teamname>, Pick: <order> }

            var grid = [];

            var numColumns = Settings.Teams + 2;
            var iLastCol = numColumns - 1;
            var tbl = GEId('ui_tblDraftBoard');
            var tHead = tbl.createTHead();
            var tHeadCells = _elNewCells(_elNewRow(tbl.tHead), numColumns);
            for (var iPick = 1; iPick <= Settings.Teams; iPick++) {
                var iUserID = OrderMap[iPick];
                var oUser = UserMap[iUserID];
                tHeadCells[iPick].appendChild(CTXT(oUser.Team));
                tHeadCells[iPick].id = 'header' + iPick;
                if (iPick == CurrentUser.Pick)
                    tHeadCells[iPick].className = 'draftCell userHead';
                else
                    tHeadCells[iPick].className = 'draftCell draftHead';
            }

            for (var iRnd = 1; iRnd <= Settings.Rounds; iRnd++) {
                grid[iRnd] = [];
                var cells = _elNewCells(_elNewRow(tbl), numColumns);
                var totalPicks = (iRnd - 1) * Settings.Teams;
                for (var iPick = 1; iPick <= Settings.Teams; iPick++) {
                    var overallPick = (totalPicks + iPick);
                    cells[iPick].id = grid[iRnd][iPick] = sCellIdPrefix + overallPick;
                    cells[iPick].className = 'draftCell draftEmpty';
                }
                cells[0].className = cells[iLastCol].className = 'whiteBack';
                cells[0].appendChild(CTXT('Round ' + iRnd));
                cells[iLastCol].appendChild(CTXT('Round ' + iRnd));
            }

            var tFoot = tbl.createTFoot();
            var tFootCells = _elNewCells(_elNewRow(tbl.tFoot), numColumns);
            for (var iPick = 1; iPick <= Settings.Teams; iPick++) {
                var iUserID = OrderMap[iPick];
                var oUser = UserMap[iUserID];
                tFootCells[iPick].appendChild(CTXT(oUser.Team));
                tFootCells[iPick].id = 'footer' + iPick;
                if (iPick == CurrentUser.Pick)
                    tFootCells[iPick].className = 'draftCell userHead';
                else
                    tFootCells[iPick].className = 'draftCell draftHead';
            }

            return grid;
        }

    </script>
</body>
</html>
