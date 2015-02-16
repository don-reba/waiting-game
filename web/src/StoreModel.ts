/// <reference path="IStoreModel.ts" />
/// <reference path="Moustache.ts"   />
/// <reference path="Player.ts"      />

class StoreModel implements IStoreModel
{
	private stock : Item;

	constructor(private player : Player)
	{
		player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
	}

	// IStoreModel implementation

	Purchased = new Signal();

	GetItems() : [Item, boolean][]
	{
		var money = this.player.GetMoney();

		var items = [];

		var moustache = this.player.GetMoustache();
		if (moustache < Moustache.Pencil)
		{
			var item    = Item.PencilMoustache;
			var price   = Item.GetInfo(item).price;
			var enabled = price <= money;

			items.push([item, enabled]);
		}

		return items;
	}

	Purchase(item : Item) : void
	{
		var price = Item.GetInfo(item).price;
		var money = this.player.GetMoney();
		if (money < price)
			return;
		this.player.SetMoney(money - price);
		this.ApplyItem(item);
		this.Purchased.Call();
	}

	UpdateStock() : void
	{
	}

	// private implementation

	private ApplyItem(item : Item)
	{
		switch (item)
		{
			case Item.PencilMoustache:
				this.player.SetMoustache(Moustache.Pencil);
		}
	}

	private OnMoneyChanged() : void
	{
	}
}
