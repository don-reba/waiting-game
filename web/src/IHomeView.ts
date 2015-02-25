/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />

interface IHomeView
{
	CloseInvites   : Signal;
	FriendSelected : Signal;
	GoToQueue      : Signal;
	GoToStore      : Signal;
	GuestClicked   : Signal;
	InviteFriends  : Signal;
	OpenInvites    : Signal;
	ReplyClicked   : Signal;
	Shown          : Signal;

	DisableUnselectedFriends() : void;

	EnableAllFriends() : void;

	GetSelectedFriend() : ICharacter;

	GetSelectedFriendStatus() : boolean;

	GetSelectedGuest() : ICharacter;

	GetSelectedReply() : number;

	HideFriends() : void;

	HideFriendsButton() : void;

	HideTravelButtons() : void;

	SetCanvas(canvas : HomeCanvas) : void;

	SetDialog(speaker : ICharacter, dialog : IDialog) : void;

	SetInviteStatus(status : boolean) : void;

	ShowFriends(characters : ICharacter[]) : void;

	ShowFriendsButton() : void;

	ShowTravelButtons() : void;
}
