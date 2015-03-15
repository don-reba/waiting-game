/// <reference path="IStoreModel.ts" />
/// <reference path="Moustache.ts"   />
/// <reference path="Player.ts"      />

class StoreModel implements IStoreModel
{
	private items       : [Item, boolean][];
	private changedItem : [Item, boolean];

	constructor(private player : Player)
	{
		player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
	}

	// IStoreModel implementation

	ItemStatusChanged = new Signal();
	Purchased         = new Signal();

	Deactivate() : void
	{
		this.items = null;
	}

	GetChangedItem() : [Item, boolean]
	{
		return this.changedItem;
	}

	GetItems() : [Item, boolean][]
	{
		var money = this.player.GetMoney();

		var items = [];

		if (!this.player.GetMoustache())
			items.push(this.GetSaleInfo(Item.PencilMoustache, money));

		if (!this.player.GetHat())
			items.push(this.GetSaleInfo(Item.Tophat, money));

		if (!this.player.HasItem(Item.TV))
		{
			items.push(this.GetSaleInfo(Item.TV, money));
		}
		else
		{
			if (!this.player.HasItem(Item.Community))
				items.push(this.GetSaleInfo(Item.Community, money));
		}

		if (!this.player.HasItem(Item.Table))
		{
			items.push(this.GetSaleInfo(Item.Table, money));
		}
		else
		{
			if (!this.player.HasItem(Item.Monopoly))
				items.push(this.GetSaleInfo(Item.Monopoly, money));
		}

		items.sort(this.CompareByPrice);

		this.items = items;
		return items;
	}

	GetSaleInfo(item : Item, money : number) : [Item, boolean]
	{
		var price   = Item.GetInfo(item).price;
		var enabled = price <= money;
		return [item, enabled];
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

	// private implementation

	private ApplyItem(item : Item)
	{
		switch (item)
		{
			case Item.PencilMoustache:
				this.player.SetMoustache(Moustache.Pencil);
				break;
			case Item.Tophat:
				this.player.SetHat(Hat.Tophat);
				break;
			default:
				this.player.AddItem(item);
		}
	}

	private CompareByPrice(a : [Item, boolean], b : [Item, boolean]) : number
	{
		return Item.GetInfo(a[0]).price - Item.GetInfo(b[0]).price;
	}

	private OnMoneyChanged() : void
	{
		if (!this.items)
			return;
		for (var i = 0; i != this.items.length; ++i)
		{
			var item = this.items[i];

			var price   = Item.GetInfo(item[0]).price;
			var money   = this.player.GetMoney();
			var enabled = price <= money;
			if (enabled == item[1])
				continue;
			this.changedItem = [item[0], enabled];
			this.items[i] = this.changedItem;
			this.ItemStatusChanged.Call();
		}
	}
}
