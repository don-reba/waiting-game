class MainView implements IMainView
{
	// IMainView implementation

	Reset : () => void;

	Initialize() : void
	{
		var game = $("#game");
		game.empty();

		game.append("<div id='money' />");

		var button = $("<button id='reset' type='button' />");
		button.text("reset");
		button.click(() => { this.Reset(); });
		game.append(button);
	}

	SetMoney(money : number) : void
	{
		$("#game > #money").text(money);
	}
}
