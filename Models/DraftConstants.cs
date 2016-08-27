
namespace FantasyDraftAPI.Models
{
    public enum DraftMoveType { Empty = 0, Keep = 1, OnClock = 2, Pick = 3, Invalid = 4 }
    public enum DraftStatusType { Invalid = 0, Running = 1, Paused = 2 }
    public enum DraftActionType { Invalid = 0, Run = 1, Pause = 2 }
    public enum PickResult { Success = 0, NotTurn = 1, InvalidPlayer = 2, AlreadyPicked = 3, InvalidPosition = 4 }
    public enum UserActionType { Unknown = 0, DraftQuery = 1, ChatQuery = 2, PickSucces = 3, PickFailed = 4, ChatSubmit = 5 }
}