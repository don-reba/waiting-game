/// <reference path="IActivitiesMenuModel.ts" />
/// <reference path="IPersistent.ts"          />

interface ActivitiesMenuModelState
{
	isVisible : boolean;
}

class ActivitiesMenuModel implements IActivitiesMenuModel, IPersistent
{
	private isVisible : boolean  = false;

	Hidden = new Signal();
	Shown  = new Signal();

	// IActivitiesMenuModel implementation

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

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <ActivitiesMenuModelState>JSON.parse(str);
		this.isVisible = state.isVisible;
	}

	ToPersistentString() : string
	{
		var state : ActivitiesMenuModelState =
			{ isVisible : this.isVisible
			};
		return JSON.stringify(state);
	}
}
