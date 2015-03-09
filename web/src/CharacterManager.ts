/// <reference path="ICharacter.ts" />
/// <reference path="Flags.ts"      />
/// <reference path="Util.ts"       />

enum DialogType
{
	QueueEscape,
	QueueConversation,
	HomeArrival,
	HomeConversation
}

class CharacterManager
{
	private map : { [ id : string ] : ICharacter; } = {}

	// public interface

	constructor
		( private characters : ICharacter[]
		, private flags      : Flags
		)
	{
		for (var i = 0; i != characters.length; ++i)
		{
			this.map[characters[i].id] = characters[i];
		}
	}

	GetAllCharacters() : ICharacter[]
	{
		return this.characters;
	}

	GetCharacter(id : string) : ICharacter
	{
		if (id) return this.map[id];
		return null;
	}

	GetDialogID(characterID : string, dialogType : DialogType) : string
	{
		var conversations : IConversation[];
		var defaultID     : string;

		var character = this.map[characterID];

		switch (dialogType)
		{
			case DialogType.QueueEscape:
				conversations = character.queueEscape;
				defaultID     = "StdQueueEscape";
				break;
			case DialogType.QueueConversation:
				conversations = character.queueConversation;
				defaultID     = "StdQueueConversation";
				break;
			case DialogType.HomeArrival:
				conversations = character.homeArrival;
				defaultID     = "StdHomeArrival";
				break;
			case DialogType.HomeConversation:
				conversations = character.homeConversation;
				defaultID     = "StdHomeConversation";
				break;
		}
		if (conversations)
		{
			var conversation = this.ChooseConversation(conversations);
			if (conversation)
				return conversation.dialog;
		}
		return defaultID;
	}

	GetRandomCharacter() : ICharacter
	{
		return this.characters.sample();
	}

	// private implementation

	ChooseConversation(conversations : IConversation[]) : IConversation
	{
		for (var i = 0; i != conversations.length; ++i)
		{
			var c = conversations[i];
			if (!c.requires || c.requires.every(this.flags.IsSet.bind(this.flags)))
				return c;
		}
	}
}
