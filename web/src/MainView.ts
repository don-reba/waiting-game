/// <reference path="IMainView.ts" />

class MainView implements IMainView
{
	activeView : IClientView;

	constructor(private clientViews : IClientView[])
	{
		$("#reset-game").click(() => { this.ResetRequested.Call() });

		$("#about").click(() => { $("#about-menu").toggle() });
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

		$("#buttons").empty();

		var loc = $("#location");
		loc.empty();
		newActiveView.Show(loc);

		this.activeView = newActiveView;
	}

	SetMoney(money : string) : void
	{
		$("#money-total").text(money);
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
