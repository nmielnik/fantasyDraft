<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Draft.aspx.cs" Inherits="Draft" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Ballers Unite Draft</title>

    <!--<link rel="Stylesheet" href="static/controls.css" type="text/css" />
    <link rel="Stylesheet" href="static/BallersDraft2010.css" type="text/css" />-->
    <link rel="stylesheet/less" type="text/css" href="static/draft.less" />
    <script>
        less = {
            env: "development",
            async: false,
            fileAsync: false,
            poll: 1000,
            functions: {},
            dumpLineNumbers: "comments"
        };
	</script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.7.3/less.min.js"></script>
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
        require(["static/draft.app.js"]);
    </script>
</head>
<body>
     <header>
        <div class="header-wrapper">
            <div class="header-title">
                <span>Ballers Draft</span>
            </div>
        </div>
    </header>
    <div id="draft-board-holder"></div>
    <div id="draft-queue-holder"></div>
    <div id="draft-chat-holder"></div>
    <!-- <%= UserData.toJson() %> -->
    <!--<table style="width: auto">
        <tr>
            <td id="draft-board-holder">
            </td>
            <td class="top">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <td id="ui_tdClockHolder" class="top">
                        </td>
                    </tr>
                    <tr>
                        <td id="ui_tdDraftQueue" class="top">
                        </td>
                    </tr>
                    <tr>
                        <td id="ui_tdChatRoom" class="top chatsection">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>-->
</body>
</html>
