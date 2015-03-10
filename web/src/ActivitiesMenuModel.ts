/// <reference path="IActivitiesMenuModel.ts" />
/// <reference path="IPersistent.ts"          />
/// <reference path="Player.ts"               />

interface ActivitiesMenuModelState
{
	isVisible : boolean;
}

class ActivitiesMenuModel implements IActivitiesMenuModel, IPersistent
{
	private isVisible : boolean  = false;

	VisibilityChanged = new Signal();

	constructor(private player : Player)
	{
	}

	// IActivitiesMenuModel implementation

	GetActivities() : Activity[]
	{
		var activities = [];
		if (this.player.HasItem(Item.Community))
			activities.push(Activity.Community);
		if (this.player.HasItem(Item.Monopoly))
			activities.push(Activity.Monopoly);
		activities.push(Activity.Stop);
		return activities;
	}

	HasActivities() : boolean
	{
		if (this.player.HasItem(Item.Community))
			return true;
		if (this.player.HasItem(Item.Monopoly))
			return true;
		return false;
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
