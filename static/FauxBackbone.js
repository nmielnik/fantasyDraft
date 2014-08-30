define([
    'backbone-faux-server'
], function (fauxServer) {

    var userData = [
        { id: 1, name: "Kennelz" },
        { id: 2, name: "Meathooks" },
        { id: 3, name: "Nannies" },
        { id: 4, name: "Titties" },
        { id: 5, name: "Mills" },
        { id: 6, name: "Jihad" },
        { id: 7, name: "Turner" },
        { id: 8, name: "Aficionados" },
        { id: 9, name: "Seattlites" },
        { id: 10, name: "GangGreen" },
        { id: 11, name: "StepDads" },
        { id: 12, name: "Tomahawks" }
    ];

    var statusData = {
        "UserID": 1,
        "ActiveUsers": [1, 2, 3, 8, 11],
        "DraftQueue": [116, 71, 15]
    };

    var chatData = null;
    var chatUpdate = null;

    return fauxServer
        .get("picks", function (context) {
            return [
                {
                    "Round": 1,
                    "Pick": 1,
                    "Team": 3,
                    "Player": 1,
                    "Type": 3,
                    "TimeLeft": null,
                    "TotalPick": 1
                },
                {
                    "Round": 1,
                    "Pick": 2,
                    "Team": 5,
                    "Player": 2,
                    "Type": 3,
                    "TimeLeft": null,
                    "TotalPick": 2
                },
                {
                    "Round": 1,
                    "Pick": 3,
                    "Team": 6,
                    "Player": 269,
                    "Type": 3,
                    "TimeLeft": null,
                    "TotalPick": 3
                },
                {
                    "Round": 1,
                    "Pick": 4,
                    "Team": 11,
                    "Player": 319,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 4
                },
                {
                    "Round": 1,
                    "Pick": 5,
                    "Team": 10,
                    "Player": 743,
                    "Type": 3,
                    "TimeLeft": null,
                    "TotalPick": 5
                },
                {
                    "Round": 1,
                    "Pick": 6,
                    "Team": 7,
                    "Player": 260,
                    "Type": 3,
                    "TimeLeft": null,
                    "TotalPick": 6
                },
                {
                    "Round": 1,
                    "Pick": 7,
                    "Team": 12,
                    "Player": 27,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 7
                },
                {
                    "Round": 1,
                    "Pick": 8,
                    "Team": 8,
                    "Player": 11,
                    "Type": 3,
                    "TimeLeft": null,
                    "TotalPick": 8
                },
                {
                    "Round": 1,
                    "Pick": 9,
                    "Team": 9,
                    "Player": 5,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 9
                },
                {
                    "Round": 1,
                    "Pick": 10,
                    "Team": 4,
                    "Player": null,
                    "Type": 2,
                    "TimeLeft": null,
                    "TotalPick": 10
                },
                {
                    "Round": 1,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 2,
                    "TimeLeft": 24,
                    "TotalPick": 11
                },
                {
                    "Round": 1,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 12
                },
                {
                    "Round": 2,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 13
                },
                {
                    "Round": 2,
                    "Pick": 2,
                    "Team": 5,
                    "Player": 1444,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 14
                },
                {
                    "Round": 2,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 15
                },
                {
                    "Round": 2,
                    "Pick": 4,
                    "Team": 11,
                    "Player": 3,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 16
                },
                {
                    "Round": 2,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 17
                },
                {
                    "Round": 2,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 18
                },
                {
                    "Round": 2,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 19
                },
                {
                    "Round": 2,
                    "Pick": 8,
                    "Team": 4,
                    "Player": 14,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 20
                },
                {
                    "Round": 2,
                    "Pick": 9,
                    "Team": 9,
                    "Player": 7,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 21
                },
                {
                    "Round": 2,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 22
                },
                {
                    "Round": 2,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 23
                },
                {
                    "Round": 2,
                    "Pick": 12,
                    "Team": 1,
                    "Player": 742,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 24
                },
                {
                    "Round": 3,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 25
                },
                {
                    "Round": 3,
                    "Pick": 2,
                    "Team": 5,
                    "Player": 1451,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 26
                },
                {
                    "Round": 3,
                    "Pick": 3,
                    "Team": 6,
                    "Player": 8,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 27
                },
                {
                    "Round": 3,
                    "Pick": 4,
                    "Team": 11,
                    "Player": 1479,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 28
                },
                {
                    "Round": 3,
                    "Pick": 5,
                    "Team": 10,
                    "Player": 1450,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 29
                },
                {
                    "Round": 3,
                    "Pick": 6,
                    "Team": 7,
                    "Player": 236,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 30
                },
                {
                    "Round": 3,
                    "Pick": 7,
                    "Team": 12,
                    "Player": 135,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 31
                },
                {
                    "Round": 3,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 32
                },
                {
                    "Round": 3,
                    "Pick": 9,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 33
                },
                {
                    "Round": 3,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 34
                },
                {
                    "Round": 3,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 35
                },
                {
                    "Round": 3,
                    "Pick": 12,
                    "Team": 1,
                    "Player": 16,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 36
                },
                {
                    "Round": 4,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 37
                },
                {
                    "Round": 4,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 38
                },
                {
                    "Round": 4,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 39
                },
                {
                    "Round": 4,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 40
                },
                {
                    "Round": 4,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 41
                },
                {
                    "Round": 4,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 42
                },
                {
                    "Round": 4,
                    "Pick": 7,
                    "Team": 12,
                    "Player": 1499,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 43
                },
                {
                    "Round": 4,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 44
                },
                {
                    "Round": 4,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 45
                },
                {
                    "Round": 4,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 46
                },
                {
                    "Round": 4,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 47
                },
                {
                    "Round": 4,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 48
                },
                {
                    "Round": 5,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 49
                },
                {
                    "Round": 5,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 50
                },
                {
                    "Round": 5,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 51
                },
                {
                    "Round": 5,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 52
                },
                {
                    "Round": 5,
                    "Pick": 5,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 53
                },
                {
                    "Round": 5,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 54
                },
                {
                    "Round": 5,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 55
                },
                {
                    "Round": 5,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 56
                },
                {
                    "Round": 5,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 57
                },
                {
                    "Round": 5,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 58
                },
                {
                    "Round": 5,
                    "Pick": 11,
                    "Team": 2,
                    "Player": 739,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 59
                },
                {
                    "Round": 5,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 60
                },
                {
                    "Round": 6,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 61
                },
                {
                    "Round": 6,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 62
                },
                {
                    "Round": 6,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 63
                },
                {
                    "Round": 6,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 64
                },
                {
                    "Round": 6,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 65
                },
                {
                    "Round": 6,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 66
                },
                {
                    "Round": 6,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 67
                },
                {
                    "Round": 6,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 68
                },
                {
                    "Round": 6,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 69
                },
                {
                    "Round": 6,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 70
                },
                {
                    "Round": 6,
                    "Pick": 11,
                    "Team": 2,
                    "Player": 1413,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 71
                },
                {
                    "Round": 6,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 72
                },
                {
                    "Round": 7,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 73
                },
                {
                    "Round": 7,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 74
                },
                {
                    "Round": 7,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 75
                },
                {
                    "Round": 7,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 76
                },
                {
                    "Round": 7,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 77
                },
                {
                    "Round": 7,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 78
                },
                {
                    "Round": 7,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 79
                },
                {
                    "Round": 7,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 80
                },
                {
                    "Round": 7,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 81
                },
                {
                    "Round": 7,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 82
                },
                {
                    "Round": 7,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 83
                },
                {
                    "Round": 7,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 84
                },
                {
                    "Round": 8,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 85
                },
                {
                    "Round": 8,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 86
                },
                {
                    "Round": 8,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 87
                },
                {
                    "Round": 8,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 88
                },
                {
                    "Round": 8,
                    "Pick": 5,
                    "Team": 10,
                    "Player": 738,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 89
                },
                {
                    "Round": 8,
                    "Pick": 6,
                    "Team": 7,
                    "Player": 1489,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 90
                },
                {
                    "Round": 8,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 91
                },
                {
                    "Round": 8,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 92
                },
                {
                    "Round": 8,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 93
                },
                {
                    "Round": 8,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 94
                },
                {
                    "Round": 8,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 95
                },
                {
                    "Round": 8,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 96
                },
                {
                    "Round": 9,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 97
                },
                {
                    "Round": 9,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 98
                },
                {
                    "Round": 9,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 99
                },
                {
                    "Round": 9,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 100
                },
                {
                    "Round": 9,
                    "Pick": 5,
                    "Team": 10,
                    "Player": 339,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 101
                },
                {
                    "Round": 9,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 102
                },
                {
                    "Round": 9,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 103
                },
                {
                    "Round": 9,
                    "Pick": 8,
                    "Team": 4,
                    "Player": 6,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 104
                },
                {
                    "Round": 9,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 105
                },
                {
                    "Round": 9,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 106
                },
                {
                    "Round": 9,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 107
                },
                {
                    "Round": 9,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 108
                },
                {
                    "Round": 10,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 109
                },
                {
                    "Round": 10,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 110
                },
                {
                    "Round": 10,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 111
                },
                {
                    "Round": 10,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 112
                },
                {
                    "Round": 10,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 113
                },
                {
                    "Round": 10,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 114
                },
                {
                    "Round": 10,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 115
                },
                {
                    "Round": 10,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 116
                },
                {
                    "Round": 10,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 117
                },
                {
                    "Round": 10,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 118
                },
                {
                    "Round": 10,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 119
                },
                {
                    "Round": 10,
                    "Pick": 12,
                    "Team": 1,
                    "Player": 117,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 120
                },
                {
                    "Round": 11,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 121
                },
                {
                    "Round": 11,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 122
                },
                {
                    "Round": 11,
                    "Pick": 3,
                    "Team": 6,
                    "Player": 1485,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 123
                },
                {
                    "Round": 11,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 124
                },
                {
                    "Round": 11,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 125
                },
                {
                    "Round": 11,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 126
                },
                {
                    "Round": 11,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 127
                },
                {
                    "Round": 11,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 128
                },
                {
                    "Round": 11,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 129
                },
                {
                    "Round": 11,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 130
                },
                {
                    "Round": 11,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 131
                },
                {
                    "Round": 11,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 132
                },
                {
                    "Round": 12,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 133
                },
                {
                    "Round": 12,
                    "Pick": 2,
                    "Team": 5,
                    "Player": 1487,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 134
                },
                {
                    "Round": 12,
                    "Pick": 3,
                    "Team": 6,
                    "Player": 1484,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 135
                },
                {
                    "Round": 12,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 136
                },
                {
                    "Round": 12,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 137
                },
                {
                    "Round": 12,
                    "Pick": 6,
                    "Team": 7,
                    "Player": 1448,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 138
                },
                {
                    "Round": 12,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 139
                },
                {
                    "Round": 12,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 140
                },
                {
                    "Round": 12,
                    "Pick": 9,
                    "Team": 9,
                    "Player": 184,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 141
                },
                {
                    "Round": 12,
                    "Pick": 10,
                    "Team": 8,
                    "Player": 988,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 142
                },
                {
                    "Round": 12,
                    "Pick": 11,
                    "Team": 2,
                    "Player": 768,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 143
                },
                {
                    "Round": 12,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 144
                },
                {
                    "Round": 13,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 145
                },
                {
                    "Round": 13,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 146
                },
                {
                    "Round": 13,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 147
                },
                {
                    "Round": 13,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 148
                },
                {
                    "Round": 13,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 149
                },
                {
                    "Round": 13,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 150
                },
                {
                    "Round": 13,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 151
                },
                {
                    "Round": 13,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 152
                },
                {
                    "Round": 13,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 153
                },
                {
                    "Round": 13,
                    "Pick": 10,
                    "Team": 8,
                    "Player": 1393,
                    "Type": 1,
                    "TimeLeft": null,
                    "TotalPick": 154
                },
                {
                    "Round": 13,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 155
                },
                {
                    "Round": 13,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 156
                },
                {
                    "Round": 14,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 157
                },
                {
                    "Round": 14,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 158
                },
                {
                    "Round": 14,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 159
                },
                {
                    "Round": 14,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 160
                },
                {
                    "Round": 14,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 161
                },
                {
                    "Round": 14,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 162
                },
                {
                    "Round": 14,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 163
                },
                {
                    "Round": 14,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 164
                },
                {
                    "Round": 14,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 165
                },
                {
                    "Round": 14,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 166
                },
                {
                    "Round": 14,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 167
                },
                {
                    "Round": 14,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 168
                },
                {
                    "Round": 15,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 169
                },
                {
                    "Round": 15,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 170
                },
                {
                    "Round": 15,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 171
                },
                {
                    "Round": 15,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 172
                },
                {
                    "Round": 15,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 173
                },
                {
                    "Round": 15,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 174
                },
                {
                    "Round": 15,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 175
                },
                {
                    "Round": 15,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 176
                },
                {
                    "Round": 15,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 177
                },
                {
                    "Round": 15,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 178
                },
                {
                    "Round": 15,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 179
                },
                {
                    "Round": 15,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 180
                },
                {
                    "Round": 16,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 181
                },
                {
                    "Round": 16,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 182
                },
                {
                    "Round": 16,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 183
                },
                {
                    "Round": 16,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 184
                },
                {
                    "Round": 16,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 185
                },
                {
                    "Round": 16,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 186
                },
                {
                    "Round": 16,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 187
                },
                {
                    "Round": 16,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 188
                },
                {
                    "Round": 16,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 189
                },
                {
                    "Round": 16,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 190
                },
                {
                    "Round": 16,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 191
                },
                {
                    "Round": 16,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 192
                },
                {
                    "Round": 17,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 193
                },
                {
                    "Round": 17,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 194
                },
                {
                    "Round": 17,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 195
                },
                {
                    "Round": 17,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 196
                },
                {
                    "Round": 17,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 197
                },
                {
                    "Round": 17,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 198
                },
                {
                    "Round": 17,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 199
                },
                {
                    "Round": 17,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 200
                },
                {
                    "Round": 17,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 201
                },
                {
                    "Round": 17,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 202
                },
                {
                    "Round": 17,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 203
                },
                {
                    "Round": 17,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 204
                },
                {
                    "Round": 18,
                    "Pick": 1,
                    "Team": 3,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 205
                },
                {
                    "Round": 18,
                    "Pick": 2,
                    "Team": 5,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 206
                },
                {
                    "Round": 18,
                    "Pick": 3,
                    "Team": 6,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 207
                },
                {
                    "Round": 18,
                    "Pick": 4,
                    "Team": 11,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 208
                },
                {
                    "Round": 18,
                    "Pick": 5,
                    "Team": 10,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 209
                },
                {
                    "Round": 18,
                    "Pick": 6,
                    "Team": 7,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 210
                },
                {
                    "Round": 18,
                    "Pick": 7,
                    "Team": 12,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 211
                },
                {
                    "Round": 18,
                    "Pick": 8,
                    "Team": 4,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 212
                },
                {
                    "Round": 18,
                    "Pick": 9,
                    "Team": 9,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 213
                },
                {
                    "Round": 18,
                    "Pick": 10,
                    "Team": 8,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 214
                },
                {
                    "Round": 18,
                    "Pick": 11,
                    "Team": 2,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 215
                },
                {
                    "Round": 18,
                    "Pick": 12,
                    "Team": 1,
                    "Player": null,
                    "Type": 0,
                    "TimeLeft": null,
                    "TotalPick": 216
                }
            ];
        }).get("chat", function (context) {
            if (!chatData) {
                chatUpdate = new Date();
                chatData = [
                  {
                      "Date": "/Date(1346195143450)/",
                      "UserID": 4,
                      "Username": "Titties",
                      "Text": "cool just making sure"
                  },
                  {
                      "Date": "/Date(1346195160323)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "i&#39;m really gonna miss kendall hunter"
                  },
                  {
                      "Date": "/Date(1346195162807)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "So if no one is against draft pick trading, we&#39;ll just leave it at that"
                  },
                  {
                      "Date": "/Date(1346195176850)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "he was a good clubhouse guy I&#39;ll give you that"
                  },
                  {
                      "Date": "/Date(1346195181387)/",
                      "UserID": 10,
                      "Username": "GangGreen",
                      "Text": "aight im out"
                  },
                  {
                      "Date": "/Date(1346195184727)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "i want to pick"
                  },
                  {
                      "Date": "/Date(1346195185600)/",
                      "UserID": 10,
                      "Username": "GangGreen",
                      "Text": "peace"
                  },
                  {
                      "Date": "/Date(1346195185990)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "peace blake"
                  },
                  {
                      "Date": "/Date(1346195209970)/",
                      "UserID": 9,
                      "Username": "Seattlites",
                      "Text": "Heading to your place Nate.  See ya in a bit."
                  },
                  {
                      "Date": "/Date(1346195215427)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "aight cool"
                  },
                  {
                      "Date": "/Date(1346195218680)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "Cubans!"
                  },
                  {
                      "Date": "/Date(1346195226950)/",
                      "UserID": 9,
                      "Username": "Seattlites",
                      "Text": "Smokin&#39;"
                  },
                  {
                      "Date": "/Date(1346195238127)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "has anyone added coaches to fantasy football?"
                  },
                  {
                      "Date": "/Date(1346195243413)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "yes"
                  },
                  {
                      "Date": "/Date(1346195249283)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "it&#39;s really lame though"
                  },
                  {
                      "Date": "/Date(1346195254987)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "ESPN has supported it for a long time"
                  },
                  {
                      "Date": "/Date(1346195256680)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "oh okay"
                  },
                  {
                      "Date": "/Date(1346195262580)/",
                      "UserID": 4,
                      "Username": "Titties",
                      "Text": "coaches?"
                  },
                  {
                      "Date": "/Date(1346195270950)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "you can get points for team wins, yards, points, etc."
                  },
                  {
                      "Date": "/Date(1346195274997)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "thought it might be more interesting than kickers, but perhaps not"
                  },
                  {
                      "Date": "/Date(1346195289523)/",
                      "UserID": 4,
                      "Username": "Titties",
                      "Text": "yikes, thats shitty"
                  },
                  {
                      "Date": "/Date(1346195291530)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "eh, i&#39;d rather just get rid of kickers and D"
                  },
                  {
                      "Date": "/Date(1346195291770)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "i mean the review calls can be intense lol"
                  },
                  {
                      "Date": "/Date(1346195297680)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "lol"
                  },
                  {
                      "Date": "/Date(1346195349140)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "woo hoo"
                  },
                  {
                      "Date": "/Date(1346195354320)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "i&#39;m out"
                  },
                  {
                      "Date": "/Date(1346195358407)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "later nate"
                  },
                  {
                      "Date": "/Date(1346195362043)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "peace"
                  },
                  {
                      "Date": "/Date(1346195378143)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "thanks for hanging tight through the bugs fellas"
                  },
                  {
                      "Date": "/Date(1346195399460)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "can&#39;t beat a 2 hour draft for 12 teams, 17 rounds, across the country though"
                  },
                  {
                      "Date": "/Date(1346195409823)/",
                      "UserID": 2,
                      "Username": "Meathooks",
                      "Text": "just going to type that"
                  },
                  {
                      "Date": "/Date(1346195410917)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "with keepers and traded draft picks"
                  },
                  {
                      "Date": "/Date(1346195411920)/",
                      "UserID": 5,
                      "Username": "Jihad",
                      "Text": "thanks nate - see ya folks"
                  },
                  {
                      "Date": "/Date(1346195416393)/",
                      "UserID": 2,
                      "Username": "Meathooks",
                      "Text": "thats awesome"
                  },
                  {
                      "Date": "/Date(1346195416957)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "later Eric"
                  },
                  {
                      "Date": "/Date(1346195419453)/",
                      "UserID": 4,
                      "Username": "Titties",
                      "Text": "bugs didn&#39;t make it a problem dude"
                  },
                  {
                      "Date": "/Date(1346195423267)/",
                      "UserID": 11,
                      "Username": "StepDads",
                      "Text": "seriously its time to box this shit up and sell it"
                  },
                  {
                      "Date": "/Date(1346195434763)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "lol, not a terrible idea"
                  },
                  {
                      "Date": "/Date(1346195436930)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "fuck you christian"
                  },
                  {
                      "Date": "/Date(1346195441953)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "you seriously took my kicker?"
                  },
                  {
                      "Date": "/Date(1346195450907)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "jk"
                  },
                  {
                      "Date": "/Date(1346195491750)/",
                      "UserID": 7,
                      "Username": "Turner",
                      "Text": "Mr. Irrelevant"
                  },
                  {
                      "Date": "/Date(1346195492057)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "nice work guys"
                  },
                  {
                      "Date": "/Date(1346195502313)/",
                      "UserID": 2,
                      "Username": "Meathooks",
                      "Text": "lata fellas"
                  },
                  {
                      "Date": "/Date(1346195504403)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "thanks for being on time"
                  },
                  {
                      "Date": "/Date(1346195506433)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "g&#39;night"
                  },
                  {
                      "Date": "/Date(1346195511200)/",
                      "UserID": 2,
                      "Username": "Meathooks",
                      "Text": "all my players up for trade"
                  },
                  {
                      "Date": "/Date(1346195516093)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "make sure you get your money sent before the 2nd sunday of the season"
                  },
                  {
                      "Date": "/Date(1346195525440)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "I only have 3 WR&#39;s"
                  },
                  {
                      "Date": "/Date(1346195531667)/",
                      "UserID": 1,
                      "Username": "Kennelz",
                      "Text": "w I drafted in the 13th and 17th round"
                  }
                ];
            }

            return chatData;
        }).post("chat", function (context) {
            chatUpdate = new Date();
            var timestamp = chatUpdate.getTime();
            var user = userData[timestamp % 12];
            var newChat = {
                "Date": "/Date(" + timestamp + ")/",
                "UserID": user.id,
                "Username" :user.name,
                "Text": context.data.text
            };
            chatData.push(newChat);
            return chatData;
        }).get("status", function (context) {
            return statusData;
        }).post("status", function (context) {
            statusData = context.data;
            return statusData;
        });
});