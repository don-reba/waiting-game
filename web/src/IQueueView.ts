interface IQueueView
{
	GoToHome : Signal;
	PersonClicked : Signal;
	ReplyClicked  : Signal;
	Shown         : Signal;

	ClearCurrentTicket() : void;

	ClearPlayerTicket() : void;

	GetSelectedReply() : number;

	GetSpeakerID() : string;

	SetCharacters(characters : ICharacter[]) : void;

	SetCurrentTicket(ticket : string) : void;

	SetDialog(speaker : string, dialog : IDialog) : void;

	SetPlayerTicket(ticket : string) : void;
}
