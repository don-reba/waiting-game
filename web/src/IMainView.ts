/// <reference path="Hat.ts"         />
/// <reference path="Moustache.ts"   />
/// <reference path="IClientView.ts" />

interface IMainView
{
	ResetRequested : Signal;

	SetClientView(view : ClientViewType) : void;

	SetHat(hat : Hat) : void;

	SetMoney(money : string) : void;

	SetMoustache(moustache : Moustache) : void;
}
