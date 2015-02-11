interface IQueueView
{
	GoToApartment : Signal;
	PersonClicked : Signal;
	ReplyClicked  : Signal;
	Shown         : Signal;

	ClearCurrentTicket() : void;

	ClearPlayerTicket() : void;

	GetSelectedReply() : number;

	SetCurrentTicket(ticket : string) : void;

	SetDialog(dialog : IDialog) : void;

	SetPlayerTicket(ticket : string) : void;

	SetPeopleNames(n : string[]) : void;
}
