/// <reference path="Signal.ts" />

interface IMainModel
{
	MoneyChanged : Signal;

	GetMoney() : number;

	Reset() : void;
}
