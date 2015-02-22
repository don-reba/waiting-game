/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts" />

interface IHomeModel
{
	FriendsArriving : Signal;
	GuestsChanged   : Signal;

	ClearFriendSelection() : void;

	GetCanvas() : HomeCanvas;

	GetFriends() : ICharacter[];

	InviteFriends() : void;

	IsFriendLimitReached() : boolean

	IsInviteEnabled() : boolean;

	SetFriendStatus(character : ICharacter, enabled : boolean) : void;
}
