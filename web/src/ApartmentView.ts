/// <reference path="IApartmentView.ts" />
/// <reference path="IClientView.ts" />

class ApartmentView implements IApartmentView, IClientView
{
	// IApartmentView implementation

	GoToQueue = new Signal();
	GoToStore = new Signal();

	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Apartment;
	}

	Hide() : void
	{
	}

	Show(e : JQuery) : void
	{
		e.append("<table id='apartment'><tr><td id='apartment-header'><button id='goQueue'>в очередь</button><button id='goStore'>в магазин</button></td></tr><tr><td id='apartment-view'>Вы у себя дома…</td></tr></table>");

		$("#goQueue").click(() => { this.GoToQueue.Call(); });

		$("#goStore").click(() => { this.GoToStore.Call(); });
	}
}
