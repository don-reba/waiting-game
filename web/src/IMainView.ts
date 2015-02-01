/// <reference path="IClientView.ts" />

interface IMainView
{
	Reset : () => void;

	Initialize() : void;

	SetClientView(view : ClientViewType) : void;

	SetMoney(money : number) : void;
}
