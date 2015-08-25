<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Admin.aspx.cs" Inherits="Admin" %>

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
    </script>

    <script type="text/javascript">
        require(["static/admin.app.js"]);
    </script>
</head>
<body>
    <div id="admin-draft-status"></div>
</body>
</html>
