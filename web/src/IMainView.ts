/// <reference path="IClientView.ts" />

interface IMainView
{
	Reset : Signal;

	Initialize() : void;

	SetClientView(view : ClientViewType) : void;

	SetMoney(money : number) : void;
}
