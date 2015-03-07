/// <reference path="Activity.ts"   />
/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />

interface IHomeModel
{
	DialogChanged : Signal;
	GuestsChanged : Signal;
	StateChanged  : Signal;

	AdvanceDialog(ref : string) : void;

	AreGuestsArriving() : boolean;

	AreGuestsIn() : boolean;

	GetCanvas() : HomeCanvas;

	GetDialog() : IDialog;

	GetSpeaker() : ICharacter;

	InviteFriends(friends : ICharacter[]) : void;

	IsGuestAtTheDoor() : boolean;

	LetTheGuestIn() : void;

	SetActivity(activity : Activity) : void;

	StartDialog(speaker : ICharacter) : void;
}
