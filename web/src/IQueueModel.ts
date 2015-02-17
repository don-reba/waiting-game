/// <reference path="ICharacter.ts" />
/// <reference path="IDialog.ts"    />

interface IQueueModel
{
	CurrentTicketChanged : Signal;
	DialogChanged        : Signal;
	PeopleChanged        : Signal;
	PlayerTicketChanged  : Signal;

	AdvanceDialog(reply : number) : void;

	EndDialog() : void;

	EnterQueue() : void;

	GetCharacters() : ICharacter[];

	GetCurrentTicket() : string;

	GetDialog() : IDialog;

	GetPlayerTicket() : string;

	GetSpeaker() : ICharacter;

	StartDialog(speaker : ICharacter) : void;
}
