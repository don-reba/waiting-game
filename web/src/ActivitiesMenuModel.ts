/// <reference path="IActivitiesMenuModel.ts" />

class ActivitiesMenuModel implements IActivitiesMenuModel
{
	private isVisible : boolean  = false;

	Hidden = new Signal();
	Shown  = new Signal();

	GetActivities() : Activity[]
	{
		return [ Activity.Stop ];
	}

	IsVisibile() : boolean
	{
		return this.isVisible;
	}

	ToggleVisibility() : void
	{
		this.isVisible = !this.isVisible;
		if (this.isVisible)
			this.Shown.Call();
		else
			this.Hidden.Call();
	}
}
