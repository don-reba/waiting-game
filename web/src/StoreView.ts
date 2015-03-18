/// <reference path="IStoreView.ts" />
/// <reference path="IClientView.ts" />

class StoreView implements IStoreView, IClientView
{
	selectedIndex : number;

	// IStoreView implementation

	GoToHome     = new Signal();
	Hidden       = new Signal();
	ItemSelected = new Signal();
	Shown        = new Signal();

	GetSelectedIndex() : number
	{
		return this.selectedIndex;
	}

	SetItems(items : StoreItem[]) : void
	{
		var container = $("#store-items");
		container.empty();
		if (items.length == 0)
		{
			container.addClass("empty");
			container.text("Что вы здесь делаете? В стране кризис!");
		}
		else
		{
			var buttons = [];
			for (var i = 0; i != items.length; ++i)
			{
				var item = items[i];

				var price = Math.ceil(item.info.price).toLocaleString();

				var button = $("<li>" + item.info.name + "<br/>" + item.info.description + "<br/>" +  price + " руб.</li>");
				button.addClass("item" + i);

				if (item.enabled)
				{
					button.click(i, this.OnItemClick.bind(this));
					button.addClass("fg-clickable");
				}
				else
				{
					button.addClass("disabled");
				}

				buttons.push(button);
			}
			container.removeClass("empty");
			for (var i = 0; i != buttons.length; ++i)
				container.append(buttons[i]);
		}
	}

	SetItemStatus(index : number, isEnabled : boolean) : void
	{
		var button = $("#store-items .item" + index);
		if (isEnabled)
		{
			button.click(index, this.OnItemClick.bind(this));
			button.addClass("fg-clickable");
			button.removeClass("disabled");
		}
		else
		{
			button.prop("onclick", null);
			button.removeClass("fg-clickable");
			button.addClass("disabled");
		}
	}

	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Store;
	}

	Hide() : void
	{
		this.Hidden.Call();
	}

	Show(e : JQuery) : void
	{
		var goHome = $("<button id='go-home'>");
		goHome.text("вернуться домой");
		goHome.click(() => { this.GoToHome.Call() });

		$("#buttons").append(goHome);

		e.html("<ul id='store-items'>");

		this.Shown.Call();
	}

	// private implementation

	private OnItemClick(e) : void
	{
		this.selectedIndex = e.data;
		this.ItemSelected.Call();
	}

}
