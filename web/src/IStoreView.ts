/// <reference path="Item.ts" />

interface IStoreView
{
	GoToHome     : Signal;
	ItemSelected : Signal;
	Shown        : Signal;

	GetSelectedItem() : Item;

	SetItems(items : [Item, boolean][]) : void;
}
