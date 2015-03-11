/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />

interface IInvitesMenuModel
{
	EnabledStateChanged : Signal;
	EmptiedStateChanged : Signal;
	SelectionChanged    : Signal;
	VisibilityChanged   : Signal;

	GetFriends() : ICharacter[];

	GetSelectedFriends() : ICharacter[];

	GetSelection() : ICharacter;

	HasInvites() : boolean;

	IsEmpty() : boolean;

	IsEnabled() : boolean;

	IsSelected(character : ICharacter) : boolean;

	IsVisible() : boolean;

	Reset() : void;

	ToggleSelection(character : ICharacter) : void;

	SetVisibility(visibility : boolean) : void;
}
