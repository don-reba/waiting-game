/// <reference path="IDialog.ts" />

class DialogManager
{
	constructor(public dialogs : IDialog[])
	{
	}

	GetDialog(dialogID : number) : IDialog
	{
		if (dialogID === -1)
			return null;
		return this.dialogs[dialogID];
	}

	GetRefDialog(dialogID : number, option : number) : IDialog
	{
		if (dialogID === -1 || option === -1)
			return null;
		var refID = this.dialogs[dialogID].replies[option].ref;
		if (refID === -1)
			return null;
		return this.dialogs[refID];
	}
}
