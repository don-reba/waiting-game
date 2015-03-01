/// <reference path="Hat.ts"       />
/// <reference path="Moustache.ts" />
/// <reference path="Signal.ts"    />

interface IMainModel
{
	HatChanged       : Signal;
	MoneyChanged     : Signal;
	MoustacheChanged : Signal;
	ViewChanged      : Signal;

	GetView() : ClientViewType;

	GetHat() : Hat;

	GetMoney() : string;

	GetMoustache() : Moustache;

	Reset() : void;

	SetView(view : ClientViewType) : void;
}
