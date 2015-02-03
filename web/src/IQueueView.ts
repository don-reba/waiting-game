interface IQueueView
{
	GoToApartment : Signal;
	Shown         : Signal;

	ClearCurrentTicket() : void;

	ClearPlayerTicket() : void;

	SetCurrentTicket(ticket : string) : void;

	SetPlayerTicket(ticket : string) : void;

	SetPeopleNames(n : string[]) : void;
}
