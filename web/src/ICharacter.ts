interface ICharacter
{
	id    : string;
	name  : string;
	color : string;

	queueGreetingDialogs? : string[];
	queueEscapeDialogs?   : string[];
}
