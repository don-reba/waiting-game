/// <reference path="IClientView.ts" />

interface IMainView
{
	ResetRequested : Signal;

	SetClientView(view : ClientViewType) : void;

	SetMoney(money : string) : void;

	SetMoustache(moustache : Moustache) : void;
}
