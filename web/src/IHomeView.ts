/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />

interface IHomeView
{
	CloseInvites   : Signal;
	FriendSelected : Signal;
	GoToQueue      : Signal;
	GoToStore      : Signal;
	InviteFriends  : Signal;
	OpenInvites    : Signal;
	Shown          : Signal;

	DisableUnselectedFriends() : void;

	EnableAllFriends() : void;

	GetSelectedFriend() : ICharacter;

	GetSelectedFriendStatus() : boolean;

	HideFriends() : void;

	HideFriendsButton() : void;

	HideTravelButtons() : void;

	SetCanvas(canvas : HomeCanvas) : void;

	SetInviteStatus(status : boolean) : void;

	ShowFriends(characters : ICharacter[]) : void;
}
