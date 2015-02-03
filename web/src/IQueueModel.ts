interface IQueueModel
{
	PlayerTicketChanged  : Signal;
	CurrentTicketChanged : Signal;
	PeopleChanged        : Signal;

	EnterQueue() : void;

	GetPlayerTicket() : string;

	GetCurrentTicket() : string;

	GetPeopleNames() : string[];
}
