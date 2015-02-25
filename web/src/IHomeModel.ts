/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts" />

interface IHomeModel
{
	DialogChanged   : Signal;
	FriendsArriving : Signal;
	GuestsChanged   : Signal;

	AdvanceDialog(reply : number) : void;

	AreGuestsIn() : boolean;

	ClearFriendSelection() : void;

	GetCanvas() : HomeCanvas;

	GetDialog() : IDialog;

	GetFriends() : ICharacter[];

	GetSpeaker() : ICharacter;

	InviteFriends() : void;

	IsFriendLimitReached() : boolean

	IsGuestAtTheDoor() : boolean;

	IsInviteEnabled() : boolean;

	LetTheGuestIn() : void;

	SetFriendStatus(character : ICharacter, enabled : boolean) : void;
}
