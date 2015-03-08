/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />

interface IInvitesMenuModel
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

	Reset() : void;

	ToggleSelection(character : ICharacter) : void;

	ToggleVisibility() : void;
}
