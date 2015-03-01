/// <reference path="IStoreView.ts" />
/// <reference path="IClientView.ts" />

class StoreView implements IStoreView, IClientView
{
	selectedItem : Item;

	// IStoreView implementation

	GoToHome     = new Signal();
	ItemSelected = new Signal();
	Shown        = new Signal();

	GetSelectedItem() : Item
	{
		return this.selectedItem;
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

			var button = $("<li>" + info.name + "<br/>" + info.description + "<br/>" +  info.price + " ₽</li>");

			if (enabled)
			{
				button.click(items[i][0], OnClick.bind(this));
				button.addClass("enabled");
				button.addClass("fg-clickable");
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
		var goHome = $("<div id='go-home'>");
		goHome.text("вернуться домой");
		goHome.click(() => { this.GoToHome.Call(); });

		$("#buttons").append(goHome);

		e.html("<ul id='store-items'>");

		this.Shown.Call();
	}
}
