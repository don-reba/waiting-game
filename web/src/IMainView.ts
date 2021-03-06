/// <reference path="Hat.ts"         />
/// <reference path="IClientView.ts" />

interface IMainView
{
	AboutRequested : Signal;
	ResetRequested : Signal;

	SetClientView(view : ClientViewType) : void;

	SetHat(hat : Hat) : void;

	SetMoney(money : string) : void;

	SetMoustache(moustache : number) : void;
}
