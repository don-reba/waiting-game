/// <reference path="IStoreModel.ts" />
/// <reference path="Moustache.ts"   />
/// <reference path="Player.ts"      />

class StoreModel implements IStoreModel
{
	Purchased = new Signal();

	constructor(private player : Player) { }

	GetItems() : Item[]
	{
		var items = [];

		var moustache = this.player.GetMoustache();
		if (moustache < Moustache.Pencil)
			items.push(Item.PencilMoustache);

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

	private ApplyItem(item : Item)
	{
		switch (item)
		{
			case Item.PencilMoustache:
				this.player.SetMoustache(Moustache.Pencil);
		}
	}
}
