/// <reference path="Signal.ts" />

interface IMainModel
{
	MoneyChanged   : Signal;
	ResetActivated : Signal;
	ViewChanged    : Signal;

	GetView() : ClientViewType;

	GetMoney() : number;

	Reset() : void;

	SetView(view : ClientViewType) : void;
}
