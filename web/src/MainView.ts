/// <reference path="IMainView.ts" />

class MainView implements IMainView
{
	activeView : IClientView;

	constructor(private clientViews : IClientView[])
	{
		var button = $("#reset-game");
		button.click(() => { this.ResetRequested.Call(); });
	}

	// IMainView implementation

	ResetRequested = new Signal();

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

		var loc = $("#location");
		loc.empty();
		loc.removeClass();
		newActiveView.Show(loc);

		this.activeView = newActiveView;
	}

	SetMoney(money : number) : void
	{
		$("#money-total").text(Math.floor(money) + " ₽");
	}

	SetMoustache(moustache : Moustache) : void
	{
		var text = "";
		switch (moustache)
		{
			case Moustache.Pencil:    text = "u";  break;
			case Moustache.French:    text = "r";  break;
			case Moustache.Handlebar: text = "a"; break;
		}
		$("#moustache").text(text);
	}
}
