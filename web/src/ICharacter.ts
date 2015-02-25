interface ICharacter
{
	id    : string;
	name  : string;
	color : string;

	queueEscapeDialogs?       : string[];
	queueConversationDialogs? : string[];
	homeArrivalDialogs?       : string[];
	homeConversationDialogs?  : string[];
}
