/// <reference path="IMainModel.ts" />

class MainModel implements IMainModel
{
	private money : number;

	constructor
		( private timer : Timer
		)
	{
		timer.AddEvent(this.OnPay.bind(this), 20);
	}

	// IMainModel implementation

	MoneyChanged = new Signal();

	GetMoney() : number
	{
		return this.money;
	}

	Reset() : void
	{
		this.money = 0;
		this.MoneyChanged.Call();
	}

	// private implementation

	private OnPay() : void
	{
		++this.money;
		this.MoneyChanged.Call();
	}
}
