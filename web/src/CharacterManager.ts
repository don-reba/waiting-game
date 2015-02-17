/// <reference path="ICharacter.ts" />

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
		return this.map[id];
	}

	GetQueueGreetingDialogID(characterID : string) : string
	{
		var character = this.map[characterID];
		if (character.queueGreetingDialogs)
			return character.queueGreetingDialogs[0];
		return "StdQueueGreetingInit";
	}

	GetRandomCharacter() : ICharacter
	{
		return this.characters[Math.floor(Math.random() * this.characters.length)];
	}
}
