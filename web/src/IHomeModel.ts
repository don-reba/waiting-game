/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts" />

interface IHomeModel
{
	DialogChanged   : Signal;
	FriendsArriving : Signal;
	GuestsChanged   : Signal;

	AdvanceDialog(ref : string) : void;

	AreGuestsIn() : boolean;

	GetCanvas() : HomeCanvas;

	GetDialog() : IDialog;

	GetSpeaker() : ICharacter;

	InviteFriends(friends : ICharacter[]) : void;

	IsGuestAtTheDoor() : boolean;

	LetTheGuestIn() : void;

	StartDialog(speaker : ICharacter) : void;
}
