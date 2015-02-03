/// <reference path="IClientView.ts" />

interface IMainView
{
	DoReset : Signal;

	Reset() : void;

	SetClientView(view : ClientViewType) : void;

	SetMoney(money : number) : void;
}
