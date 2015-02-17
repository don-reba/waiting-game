/// <reference path="ICharacter.ts" />

enum DialogType
{
	Escape,
	Greeting
}

class CharacterManager
{
	map : { [ id : string ] : ICharacter; } = {}

	constructor(private characters : ICharacter[])
	{
		for (var i = 0; i != characters.length; ++i)
			this.map[characters[i].id] = characters[i];
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
			case DialogType.Escape:
				if (character.queueEscapeDialogs)
					return character.queueGreetingDialogs[0];
				return "StdQueueEscape";
			case DialogType.Greeting:
				if (character.queueGreetingDialogs)
					return character.queueGreetingDialogs[0];
				return "StdQueueGreeting";
		}
	}

	GetRandomCharacter() : ICharacter
	{
		return this.characters[Math.floor(Math.random() * this.characters.length)];
	}
}
