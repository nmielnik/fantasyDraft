<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Login" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="Draft/BallersDraft2010.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
    </style>
</head>
<body>
     <!-- <%= LoginMessage %> -->
    <form method="post" action="Login.aspx" id="login-form">
    <div>
        <table width="100%">
            <tr>
                <td class="whiteBack pageHead" width="35%">Ballers Unite Draft Page</td>
                <td class="pageHead"></td>
            </tr>
            <tr>
                <td align="center">
                    <table cellpadding="1" style="border-collapse:collapse;">
                        <tr>
                            <td>
                                <table style="height:156px; width:260px">
                                    <tr>
                                        <td align="center" colspan="2">Log In</td>
                                    </tr>
                                    <tr>
                                        <td align="right">
                                            <label for="username-textbox">Username:</label>
                                        </td>
                                        <td>
                                            <input type="text" name="username" id="username-textbox" value="<%= PrefillUsername %>" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right">
                                            <label for="password-textbox">Password:</label>
                                        </td>
                                        <td>
                                            <input type="password" name="password" id="password-textbox" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right" colspan="2">
                                            <input type="submit" value="Log In" name="login" id="login-button" />
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
                <td></td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>
