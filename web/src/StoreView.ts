/// <reference path="IStoreView.ts" />
/// <reference path="IClientView.ts" />

class StoreView implements IStoreView, IClientView
{
	selectedItem : Item;

	// IStoreView implementation

	GoToHome     = new Signal();
	ItemSelected = new Signal();
	Shown        = new Signal();

	// IClientView implementation

	GetSelectedItem() : Item
	{
		return this.selectedItem;
	}

	GetType() : ClientViewType
	{
		return ClientViewType.Store;
	}

	Hide() : void
	{
	}

	Show(e : JQuery) : void
	{
		var header = "<tr><td id='store-header'><button id='goHome'>вернуться домой</button></td></tr>";

		var body = "<tr><td id='store-body'><div><table id='store-items'></table></div></td></tr>";

		e.html("<table id='store'>" + header + body + "</table>");

		$("#store #goHome").click(() => { this.GoToHome.Call(); });

		this.Shown.Call();
	}

	SetItems(items : [Item, boolean][]) : void
	{
		var buttons = [];
		for (var i = 0; i != items.length; ++i)
		{
			var OnClick = function(e)
			{
				this.selectedItem = e.data;
				this.ItemSelected.Call();
			}
			var info    = Item.GetInfo(items[i][0]);
			var enabled = items[i][1];

			var button = $("<td>" + info.name + "<br/>" + info.description + "<br/>" +  info.price + " ₽</td>");

			if (enabled)
			{
				button.click(items[i][0], OnClick.bind(this));
				button.addClass("enabled");
			}
			else
			{
				button.addClass("disabled");
			}

			buttons.push(button);
		}

		var row = $("<tr>");
		for (var i = 0; i != buttons.length; ++i)
			row.append(buttons[i]);

		$("#store-items").empty().append(row);
	}
}
