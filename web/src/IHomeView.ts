/// <reference path="Activity.ts"   />
/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />

interface IHomeView
{
	ActivityClicked      : Signal;
	ActivitiesClicked    : Signal;
	InviteClicked        : Signal;
	GoToQueue            : Signal;
	GoToStore            : Signal;
	GuestClicked         : Signal;
	InvitesButtonClicked : Signal;
	InvitesClicked       : Signal;
	ReplyClicked         : Signal;
	Shown                : Signal;

	DisableUnselectedFriends() : void;

	EnableAllFriends() : void;

	GetSelectedActivity() : Activity;

	GetInvitesVisibility() : boolean;

	GetSelectedInvite() : ICharacter;

	GetSelectedGuest() : ICharacter;

	GetSelectedReply() : string;

	HideActivitiesButton() : void;

	HideActivitiesMenu() : void;

	HideInvitesMenu() : void;

	HideInvitesButton() : void;

	HideTravelButtons() : void;

	SetCanvas(canvas : HomeCanvas) : void;

	SetDialog(speaker : ICharacter, dialog : IDialog) : void;

	SetInviteStatus(status : boolean) : void;

	SetInviteState(character : ICharacter, checked : boolean) : void;

	ShowActivitiesButton() : void;

	ShowActivitiesMenu(activities : Activity[]) : void;

	ShowInvitesButton() : void;

	ShowInvitesMenu(characters : ICharacter[]) : void;

	ShowTravelButtons() : void;
}
