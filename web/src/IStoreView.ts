/// <reference path="StoreItem.ts" />

interface IStoreView
{
	GoToHome     : Signal;
	Hidden       : Signal;
	ItemSelected : Signal;
	Shown        : Signal;

	GetSelectedIndex() : number;

	SetItems(items : StoreItem[]) : void;

	SetItemStatus(item : Item, isEnabled : boolean) : void;
}
