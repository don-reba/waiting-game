interface IQueueView
{
	GoToApartment : Signal;
	PersonClicked : Signal;
	ReplyClicked  : Signal;
	Shown         : Signal;

	ClearCurrentTicket() : void;

	ClearPlayerTicket() : void;

	GetSelectedReply() : number;

	GetSpeaker() : string;

	SetCurrentTicket(ticket : string) : void;

	SetDialog(speaker : string, dialog : IDialog) : void;

	SetPlayerTicket(ticket : string) : void;

	SetPeopleNames(n : string[]) : void;
}
