/// <reference path="Flags.ts"   />
/// <reference path="IDialog.ts" />

class DialogManager
{
	private map : { [id : string] : IDialog; } = {};

	constructor
		( private dialogs : IDialog[]
		, private flags   : Flags
		)
	{
		for (var i = 0; i != dialogs.length; ++i)
			this.map[dialogs[i].id] = dialogs[i];
	}

	ActivateDialog(dialogID : string) : string
	{
		if (!dialogID)
			return;
		var dialog = this.map[dialogID];

		if (dialog.sets)
		{
			for (var i = 0; i != dialog.sets.length; ++i)
				this.flags.Set(dialog.sets[i]);
		}

		if (dialog.clears)
		{
			for (var i = 0; i != dialog.clears.length; ++i)
				this.flags.Clear(dialog.clears[i]);
		}
	}

	GetDialog(dialogID : string) : IDialog
	{
		if (dialogID)
			return this.map[dialogID];
		return null;
	}

	GetRefDialogID(dialogID : string, option : number) : string
	{
		if (dialogID)
			return this.map[dialogID].replies[option].ref;
		return null;
	}
}
