interface IQueueModel
{
	CurrentTicketChanged : Signal;
	DialogChanged        : Signal;
	PeopleChanged        : Signal;
	PlayerTicketChanged  : Signal;

	EnterQueue() : void;

	GetCurrentTicket() : string;

	GetDialogID() : number;

	GetPlayerTicket() : string;

	GetPeopleNames() : string[];

	GetSpeaker() : string;

	Reset() : void;

	SetDialog(speaker : string, dialogID : number) : void;
}
