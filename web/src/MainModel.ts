/// <reference path="IMainModel.ts" />

class MainModel implements IMainModel
{
	private money : number;

	// IMainModel implementation

	GameStarted = new Signal();

	GetMoney() : number { return this.money; }

	NewGame() : void
	{
		this.money = 0;
		this.GameStarted.Call();
	}
}
