interface IConversation
{
	dialog       : string;
	requires?    : string[];
	requiresAny? : string[];
}

interface ICharacter
{
	id    : string;
	name  : string;

	queueEscape?       : IConversation[];
	queueConversation? : IConversation[];
	homeArrival?       : IConversation[];
	homeConversation?  : IConversation[];
}
