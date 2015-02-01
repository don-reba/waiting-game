/// <reference path="../dts/jquery.d.ts" />

enum ClientViewType
{
	Apartment, Queue, Store
}

interface IClientView
{
	GetType() : ClientViewType;

	Hide() : void;

	Show(e : JQuery) : void;
}
