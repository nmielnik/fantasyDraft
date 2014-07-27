using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Web;

/// <summary>
/// User authentication data
/// </summary>
[DataContract]
public class DraftUser
{
    [DataMember]
    public String Username { get; private set; }

    [DataMember]
    public String TeamName { get; private set; }

    [DataMember]
    public DateTime Expires { get; private set; }

    [DataMember]
    public int DraftOrder { get; private set; }

    [DataMember]
    public int ID { get; private set; }

    public DraftUser()
    {
        Username = null;
        Expires = DateTime.Now.AddMinutes(30);
        DraftOrder = -1;
        ID = -1;
    }

    public DraftUser(Username dbUsername, int order) : this()
    {
        TeamName = dbUsername.TeamName;
        Username = dbUsername.Username1;
        DraftOrder = order;
        ID = dbUsername.User.UserID;
    }

    public String toJson()
    {
        String json = string.Empty;
        DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(DraftUser));
        using (MemoryStream stream = new MemoryStream())
        {
            ser.WriteObject(stream, this);

            stream.Position = 0;
            StreamReader sr = new StreamReader(stream);
            json = sr.ReadToEnd();
        }

        return json;
    }
}