/// <reference path="ICharacter.ts" />

interface HomeCanvasCharacter
{
	character   : ICharacter;
	isClickable : boolean;
}

interface HomeCanvas
{
	rows       : string[];
	characters : HomeCanvasCharacter[];
}
