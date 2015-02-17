/// <reference path="IDialog.ts" />

class DialogManager
{
	dialogs : { [id : string] : IDialog; } = {};

	constructor(dialogs : IDialog[])
	{
		for (var i = 0; i != dialogs.length; ++i)
			this.dialogs[dialogs[i].id] = dialogs[i];
	}

	GetDialog(dialogID : string) : IDialog
	{
		if (dialogID)
			return this.dialogs[dialogID];
		return null;
	}

	GetRefDialogID(dialogID : string, option : number) : string
	{
		if (dialogID)
			return this.dialogs[dialogID].replies[option].ref;
		return null;
	}
}
