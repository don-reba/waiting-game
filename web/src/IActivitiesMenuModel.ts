/// <reference path="Activity.ts" />
/// <reference path="Signal.ts"   />

interface IActivitiesMenuModel
{
	Hidden : Signal;
	Shown  : Signal;

	GetActivities() : Activity[];

	IsVisibile() : boolean;

	ToggleVisibility() : void;
}
