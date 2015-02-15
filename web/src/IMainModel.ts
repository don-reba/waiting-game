/// <reference path="Signal.ts" />

interface IMainModel
{
	MoneyChanged : Signal;
	ViewChanged  : Signal;

	GetView() : ClientViewType;

	GetMoney() : number;

	Reset() : void;

	SetView(view : ClientViewType) : void;
}
