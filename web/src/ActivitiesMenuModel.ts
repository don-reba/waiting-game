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

		var AddItemActivity = function (item : Item, activity : Activity) : void
		{
			if (this.player.HasItem(item))
				activities.push(activity);
		}.bind(this)
		AddItemActivity(Item.TV,        Activity.TV);
		AddItemActivity(Item.Community, Activity.Community);
		AddItemActivity(Item.Civ,       Activity.Civ);
		AddItemActivity(Item.Monopoly,  Activity.Monopoly);
		AddItemActivity(Item.Stove,     Activity.Cooking);

		activities.push(Activity.Stop);

		return activities;
	}

	HasActivities() : boolean
	{
		var items =
			[ Item.Civ
			, Item.Community
			, Item.Monopoly
			, Item.Stove
			, Item.TV
			];
		return items.some(this.player.HasItem.bind(this.player));
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
