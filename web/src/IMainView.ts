/// <reference path="IClientView.ts" />

interface IMainView
{
	ResetRequested : Signal;

	SetClientView(view : ClientViewType) : void;

	SetMoney(money : number) : void;

	SetMoustache(moustache : Moustache) : void;
}
