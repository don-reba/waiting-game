/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />

interface IFriendsMenuModel
{
	Cleared  : Signal;
	Disabled : Signal;
	Emptied  : Signal;
	Enabled  : Signal;
	Filled   : Signal;
	Hidden   : Signal;
	Selected : Signal;
	Shown    : Signal;

	GetFriends() : ICharacter[];

	GetSelectedFriends() : ICharacter[];

	GetSelection() : ICharacter;

	IsEmpty() : boolean;

	IsEnabled() : boolean;

	IsVisible() : boolean;

	ToggleSelection(character : ICharacter) : void;

	ToggleVisibility() : void;
}
