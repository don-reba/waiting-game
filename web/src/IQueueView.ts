/// <reference path="ICharacter.ts" />
/// <reference path="IDialog.ts"    />

interface IQueueView
{
	GoToHome      : Signal;
	Hidden        : Signal;
	PersonClicked : Signal;
	ReplyClicked  : Signal;
	Shown         : Signal;

	GetSelectedReply() : string;

	GetSpeaker() : ICharacter;

	SetCharacters(characters : ICharacter[]) : void;

	SetCurrentTicket(ticket : string) : void;

	SetDialog(speaker : ICharacter, dialog : IDialog) : void;

	SetPlayerTicket(ticket : string) : void;
}
