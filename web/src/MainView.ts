/// <reference path="IMainView.ts" />

class MainView implements IMainView
{
	activeView : IClientView;

	constructor(private clientViews : IClientView[])
	{
		$("#reset-game").click(() => { this.ResetRequested.Call() });

		$("#about-game").click(() => { this.AboutRequested.Call() });

		$("#about").click(() => { $("#about-menu").toggle() });
	}

	// IMainView implementation

	AboutRequested = new Signal();
	ResetRequested = new Signal();

	SetClientView(viewType : ClientViewType): void
	{
		var i = this
			.clientViews.map((v) => { return v.GetType() })
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

	SetHat(hat : Hat) : void
	{
		var src;
		switch (hat)
		{
			case Hat.Tophat: src = "svg/tophat.svg"; break;
		}
		var e = $("#hat");
		if (src)
		{
			e.attr("src", src);
			e.show();
		}
		else
		{
			e.hide();
		}
	}

	SetMoustache(moustache : number) : void
	{
		var e = $("#moustache");
		if (moustache >= 0)
		{
			e.text("nkytabdleo".substring(moustache, moustache + 1));
			e.show();
		}
		else
		{
			e.hide();
		}
	}
}
