class Reply
{
	text : string;
	ref  : number;
}

interface IDialog
{
	text    : string;
	replies : Reply[];
}
