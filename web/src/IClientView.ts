/// <reference path="../dts/jquery.d.ts" />

enum ClientViewType
{
	Home, Queue, Store
}

interface IClientView
{
	GetType() : ClientViewType;

	Hide() : void;

	Show(e : JQuery) : void;
}
