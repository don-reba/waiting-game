/// <reference path="IMainModel.ts" />

class MainModel implements IMainModel
{
	private money : number;

	// IMainModel implementation

	MoneyChanged = new Signal();

	GetMoney() : number
	{
		return this.money;
	}

	SetMoney(money : number) : void
	{
		this.money = money;
		this.MoneyChanged.Call();
	}
}
