/// <reference path="IDialog.ts" />

class DialogManager
{
	constructor(public dialogs : IDialog[])
	{
	}

	GetDialog(dialogID : number) : IDialog
	{
		if (dialogID >= 0)
			return this.dialogs[dialogID];
		return null;
	}

	GetRefDialogID(dialogID : number, option : number) : number
	{
		if (dialogID >= 0 && option >= 0)
			return this.dialogs[dialogID].replies[option].ref;
		return null;
	}
}
