/// <reference path="Item.ts" />

interface StoreItem
{
	info    : ItemInfo;
	enabled : boolean;
	Apply   : () => void;
}
