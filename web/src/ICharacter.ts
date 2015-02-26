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

	queueEscapeConversations?       : IConversation[];
	queueConversationConversations? : IConversation[];
	homeArrivalConversations?       : IConversation[];
	homeConversationConversations?  : IConversation[];
}
