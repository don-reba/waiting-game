/// <reference path="Signal.ts" />

interface IMainModel
{
	GameStarted : Signal;

	GetMoney() : number;

	NewGame() : void;
}
