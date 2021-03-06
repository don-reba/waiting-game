/// <reference path="Hat.ts"       />
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

	GetMoustache() : number;

	OpenAbout() : void;

	Reset() : void;

	SetView(view : ClientViewType) : void;
}
