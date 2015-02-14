/// <reference path="IStoreView.ts" />
/// <reference path="IClientView.ts" />

class StoreView implements IStoreView, IClientView
{
	// IStoreView implementation

	GoToHome = new Signal();

	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Store;
	}

	Hide() : void
	{
	}

	Show(e : JQuery) : void
	{
		e.append("<table id='store'><tr><td id='store-header'><button id='goHome'>вернуться домой</button></td></tr><tr><td id='store-view'>Что вы здесь делаете? Кризис на дворе!</td></tr></table>");

		$("#store #goHome").click(() => { this.GoToHome.Call(); });
	}
}
