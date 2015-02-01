/// <reference path="Signal.ts" />

interface IMainModel
{
	MoneyChanged : Signal;

	GetMoney() : number;

	SetMoney(money : number) : void;
}
