/// <reference path="Signal.ts" />

interface IMainModel
{
	MoneyChanged     : Signal;
	MoustacheChanged : Signal;
	ViewChanged      : Signal;

	GetView() : ClientViewType;

	GetMoney() : number;

	GetMoustache() : Moustache;

	Reset() : void;

	SetView(view : ClientViewType) : void;
}
