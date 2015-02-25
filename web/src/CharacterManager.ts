/// <reference path="ICharacter.ts" />
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
	map : { [ id : string ] : ICharacter; } = {}

	constructor(private characters : ICharacter[])
	{
		for (var i = 0; i != characters.length; ++i)
			this.map[characters[i].id] = characters[i];
	}

	GetAllCharacters() : ICharacter[]
	{
		return this.characters;
	}

	GetCharacter(id : string) : ICharacter
	{
		if (id) return this.map[id];
	}

	GetDialogID(characterID : string, dialogType : DialogType) : string
	{
		var character = this.map[characterID];
		switch (dialogType)
		{
			case DialogType.QueueEscape:
				if (character.queueEscapeDialogs)
					return character.queueEscapeDialogs[0];
				return "StdQueueEscape";
			case DialogType.QueueConversation:
				if (character.queueConversationDialogs)
					return character.queueConversationDialogs[0];
				return "StdQueueConversation";
			case DialogType.HomeArrival:
				if (character.homeArrivalDialogs)
					return character.homeArrivalDialogs[0];
				return "StdHomeArrival";
			case DialogType.QueueConversation:
				if (character.homeConversationDialogs)
					return character.homeConversationDialogs[0];
				return "StdHomeConversation";
		}
	}

	GetRandomCharacter() : ICharacter
	{
		return Util.Sample(this.characters);
	}
}
