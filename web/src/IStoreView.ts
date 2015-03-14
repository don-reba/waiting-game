/// <reference path="Item.ts" />

interface IStoreView
{
	GoToHome     : Signal;
	Hidden       : Signal;
	ItemSelected : Signal;
	Shown        : Signal;

	GetSelectedItem() : Item;

	SetItems(items : [Item, boolean][]) : void;

	SetItemStatus(item : Item, isEnabled : boolean) : void;
}
