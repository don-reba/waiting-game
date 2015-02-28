interface IReply
{
	text      : string;
	ref       : string;
	requires? : string[];
}

interface IDialog
{
	id      : string;
	text    : string;
	replies : IReply[];
	sets?   : string[];
	clears? : string[];
}
