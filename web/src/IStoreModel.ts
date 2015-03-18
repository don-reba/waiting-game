/// <reference path="StoreItem.ts" />
/// <reference path="Signal.ts"    />

interface IStoreModel
{
	ItemStatusChanged : Signal;
	Purchased         : Signal;

	Deactivate() : void;

	GetChangedItem() : [number, boolean];

	GetItems() : StoreItem[];

	Purchase(index : number) : void;
}
