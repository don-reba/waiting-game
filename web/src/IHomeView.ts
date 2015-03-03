/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />

interface IHomeView
{
	FriendClicked        : Signal;
	GoToQueue            : Signal;
	GoToStore            : Signal;
	GuestClicked         : Signal;
	InviteFriendsClicked : Signal;
	InvitesClicked       : Signal;
	ReplyClicked         : Signal;
	Shown                : Signal;

	DisableUnselectedFriends() : void;

	EnableAllFriends() : void;

	GetInvitesVisibility() : boolean;

	GetMenuSelection() : ICharacter;

	GetSelectedGuest() : ICharacter;

	GetSelectedReply() : string;

	HideFriends() : void;

	HideFriendsButton() : void;

	HideTravelButtons() : void;

	SetCanvas(canvas : HomeCanvas) : void;

	SetDialog(speaker : ICharacter, dialog : IDialog) : void;

	SetInviteStatus(status : boolean) : void;

	SetMenuFriendState(character : ICharacter, checked : boolean) : void;

	ShowFriends(characters : ICharacter[]) : void;

	ShowFriendsButton() : void;

	ShowTravelButtons() : void;
}
