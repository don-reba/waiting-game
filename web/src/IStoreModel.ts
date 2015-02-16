/// <reference path="Item.ts" />

interface IStoreModel
{
	Purchased : Signal;

	GetItems() : [Item, boolean][];

	Purchase(item : Item) : void;

	UpdateStock() : void;
}
