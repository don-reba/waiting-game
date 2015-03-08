/// <reference path="IActivitiesMenuModel.ts" />
/// <reference path="IPersistent.ts"          />

interface ActivitiesMenuModelState
{
	isVisible : boolean;
}

class ActivitiesMenuModel implements IActivitiesMenuModel, IPersistent
{
	private isVisible : boolean  = false;

	VisibilityChanged = new Signal();

	// IActivitiesMenuModel implementation

	GetActivities() : Activity[]
	{
		return [ Activity.Stop ];
	}

	IsVisible() : boolean
	{
		return this.isVisible;
	}

	SetVisibility(visibility : boolean) : void
	{
		this.isVisible = visibility;
		this.VisibilityChanged.Call();
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
