/// <reference path="IMainView.ts" />

class MainView implements IMainView
{
	activeView : IClientView;

	constructor(private clientViews : IClientView[])
	{
	}

	// IMainView implementation

	DoReset = new Signal();

	Reset() : void
	{
		var game = $("#game");
		game.empty();

		game.append("<div id='money' />");

		var button = $("<button id='reset' type='button' />");
		button.text("начать заново");
		button.click(() => { this.DoReset.Call(); });
		game.append(button);

		game.append("<div id='clientArea' />");

		this.activeView = null;
	}

	SetClientView(viewType : ClientViewType): void
	{
		var i = this
			.clientViews.map((v) => { return v.GetType(); })
			.indexOf(viewType);
		if (i < 0) return;

		var newActiveView = this.clientViews[i];
		if (this.activeView === newActiveView)
			return;

		if (this.activeView)
			this.activeView.Hide();
		newActiveView.Show($("#game #clientArea").empty());
		this.activeView = newActiveView;
	}

	SetMoney(money : number) : void
	{
		$("#game > #money").text(Math.floor(money) + " ₽");
	}
}
