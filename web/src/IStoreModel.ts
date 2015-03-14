/// <reference path="Item.ts"   />
/// <reference path="Signal.ts" />

interface IStoreModel
{
	ItemStatusChanged : Signal;
	Purchased         : Signal;

	Deactivate() : void;

	GetChangedItem() : [Item, boolean];

	GetItems() : [Item, boolean][];

	Purchase(item : Item) : void;
}
