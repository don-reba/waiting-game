/// <reference path="Activity.ts" />
/// <reference path="Signal.ts"   />

interface IActivitiesMenuModel
{
	VisibilityChanged : Signal;

	GetActivities() : Activity[];

	IsVisible() : boolean;

	SetVisibility(visibility : boolean) : void;
}
