class Reply
{
	text : string;
	ref  : string;
}

interface IDialog
{
	id      : string;
	text    : string;
	replies : Reply[];
	sets?   : string[];
	clears? : string[];
}
