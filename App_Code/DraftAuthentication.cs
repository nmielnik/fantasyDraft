using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.IO;
using System.Web.Script.Serialization;

/// <summary>
/// Summary description for DraftAuthentication
/// </summary>
public static class DraftAuthentication 
{

    private static BallersDraftObj DraftObj = new BallersDraftObj();

    public static String LoginPage
    {
        get
        {
            return "/Draft/login";
        }
    }

    public static DraftUser AuthenticateRequest(HttpRequest request, int? userId = null)
    {
        DraftUser toRet = null;

        if (request.Cookies["DraftUser"] == null || String.IsNullOrWhiteSpace(request.Cookies["DraftUser"].Value))
        {
            throw new DraftAuthenticationException("No session");
        }

        try
        {
            String base64Encoded = request.Cookies["DraftUser"].Value;
            byte[] bytes = Convert.FromBase64String(base64Encoded);
            byte[] decryptedBytes = MachineKey.Unprotect(bytes);
            String final = Encoding.Unicode.GetString(decryptedBytes);
            toRet = new JavaScriptSerializer().Deserialize<DraftUser>(final);
        }
        catch (Exception ex)
        {
            throw new DraftAuthenticationException("Authentication Failed", ex);
        }

        if (toRet.Expires < DateTime.UtcNow)
        {
            throw new DraftAuthenticationException(toRet.Username, toRet.Expires, "Authentication Expired");
        }

        if (userId.HasValue && toRet.ID != userId.Value)
        {
            throw new DraftAuthenticationException("Unauthorized User");
        }

        return toRet;
    }

    public static DraftUser AuthenticateCredentials(String username, String password, HttpResponse response)
    {
        if (String.IsNullOrWhiteSpace(username) || String.IsNullOrWhiteSpace(password))
        {
            throw new DraftAuthenticationException("Invalid credentials");
        }
        DraftUser user = DraftObj.GetUser(username, password);
        if (user == null)
        {
            throw new DraftAuthenticationException("Invalid username or password");
        }

        if (response != null)
        {
            String rawString = new JavaScriptSerializer().Serialize(user);
            byte[] rawBytes = Encoding.Unicode.GetBytes(rawString);
            byte[] encryptedBytes = MachineKey.Protect(rawBytes);
            response.Cookies["DraftUser"].Value = Convert.ToBase64String(encryptedBytes);
            response.Cookies["DraftUser"].Expires = DateTime.Now.AddDays(1);
        }

        return user;
    }

    public static void Logout(HttpResponse response)
    {
        HttpCookie authCookie = new HttpCookie("DraftUser");
        authCookie.Expires = DateTime.Now.AddDays(-1d);
        response.Cookies.Add(authCookie);
    }
}

public class DraftAuthenticationException : Exception
{
    public String Username { get; set; }

    public DateTime Expired { get; set; }

    public DraftAuthenticationException(String message) : this(message, null) { }

    public DraftAuthenticationException(String message, Exception inner) : this(null, DateTime.Now, message, inner) { }

    public DraftAuthenticationException(String username, DateTime expired, String message) : this(username, expired, message, null) { }

    public DraftAuthenticationException(String username, DateTime expired, String message, Exception inner)
        : base(message, inner)
    {
        Username = username;
        Expired = expired;
    }
}