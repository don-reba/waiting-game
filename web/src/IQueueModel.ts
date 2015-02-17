/// <reference path="IDialog.ts" />

interface IQueueModel
{
	CurrentTicketChanged : Signal;
	DialogChanged        : Signal;
	PeopleChanged        : Signal;
	PlayerTicketChanged  : Signal;

	AdvanceDialog(reply : number) : void;

	EnterQueue() : void;

	GetCurrentTicket() : string;

	GetDialog() : IDialog;

	GetPlayerTicket() : string;

	GetPeopleNames() : string[];

	GetSpeaker() : string;

	StartDialog(speaker : string) : void;
}
