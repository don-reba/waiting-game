class MainModel implements IMainModel
{
	private money : number;

	// IMainModel implementation

	GameStarted : () => void;

	GetMoney() : number { return this.money; }

	NewGame() : void
	{
		this.money = 0;
		this.GameStarted();
	}
}
