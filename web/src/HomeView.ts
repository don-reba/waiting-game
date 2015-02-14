/// <reference path="IHomeView.ts" />
/// <reference path="IClientView.ts" />

class HomeView implements IHomeView, IClientView
{
	// IHomeView implementation

	GoToQueue = new Signal();
	GoToStore = new Signal();

	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Home;
	}

	Hide() : void
	{
	}

	Show(e : JQuery) : void
	{
		e.append("<table id='home'><tr><td id='home-header'><button id='goQueue'>в очередь</button><button id='goStore'>в магазин</button></td></tr><tr><td id='home-view'>Вы у себя дома…</td></tr></table>");

		$("#goQueue").click(() => { this.GoToQueue.Call(); });

		$("#goStore").click(() => { this.GoToStore.Call(); });
	}
}
