/// <reference path="ICharacter.ts" />
/// <reference path="IDialog.ts"    />

interface IQueueModel
{
	CurrentTicketChanged : Signal;
	DialogChanged        : Signal;
	PeopleChanged        : Signal;
	PlayerTicketChanged  : Signal;

	EnterQueue() : void;

	GetCharacters() : ICharacter[];

	GetCurrentTicket() : string;

	GetDialog() : IDialog;

	GetPlayerTicket() : string;

	GetSpeaker() : ICharacter;

	SetDialog(ref : string) : void;

	StartDialog(speaker : ICharacter) : void;
}
