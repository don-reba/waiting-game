interface IConversation
{
	dialog : string;
	requires? : string[];
}

interface ICharacter
{
	id    : string;
	name  : string;
	color : string;

	queueEscape?       : IConversation[];
	queueConversation? : IConversation[];
	homeArrival?       : IConversation[];
	homeConversation?  : IConversation[];
}
