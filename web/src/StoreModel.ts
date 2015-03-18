/// <reference path="Item.ts"        />
/// <reference path="IPersistent.ts" />
/// <reference path="IStoreModel.ts" />
/// <reference path="Player.ts"      />

interface StoreModelState
{
	candyLevel : number;
}

class StoreModel implements IStoreModel, IPersistent
{
	private candyLevel : number = 0;

	private itemCache   : StoreItem[];
	private changedItem : [number, boolean];

	constructor(private player : Player)
	{
		player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
	}

	// IStoreModel implementation

	ItemStatusChanged = new Signal();
	Purchased         = new Signal();

	Deactivate() : void
	{
		this.itemCache = null;
	}

	GetChangedItem() : [number, boolean]
	{
		return this.changedItem;
	}

	GetItems() : StoreItem[]
	{
		this.itemCache = [];

		var money = this.player.GetMoney();

		if (!this.player.GetHat())
		{
			this.AddStoreItem
				( Item.Tophat
				, this.player.SetHat.bind
					( this.player
					, Hat.Tophat
					)
				);
		}

		if (!this.player.HasItem(Item.Stove))
		{
			this.AddStoreItem
				( Item.Stove
				, this.player.AddItem.bind
					( this.player
					, Item.Stove
					)
				);
		}

		if (!this.player.HasItem(Item.TV))
		{
			this.AddStoreItem
				( Item.TV
				, this.player.AddItem.bind(this.player, Item.TV)
				);
		}
		else
		{
			if (!this.player.HasItem(Item.Community))
			{
				this.AddStoreItem
					( Item.Community
					, this.player.AddItem.bind
						( this.player
						, Item.Community
						)
					);
			}
		}

		if (!this.player.HasItem(Item.Table))
		{
			this.AddStoreItem
				( Item.Table
				, this.player.AddItem.bind
					( this.player
					, Item.Table
					)
				);
		}
		else
		{
			if (!this.player.HasItem(Item.Monopoly))
			{
				this.AddStoreItem
					( Item.Monopoly
					, this.player.AddItem.bind
						( this.player
						, Item.Monopoly
						)
					);
			}
		}

		var moustache = Item.Moustache.GetInfo(this.player.GetMoustache() + 1);
		if (moustache)
		{
			var item =
				{ info    : moustache
				, enabled : moustache.price <= money
				, Apply   : () => { this.player.SetMoustache(this.player.GetMoustache() + 1) }
				};
			this.itemCache.push(item);
		}

		var candy = Item.Candy.GetInfo(this.candyLevel);
		if (candy)
		{
			var item =
				{ info    : candy
				, enabled : candy.price <= money
				, Apply   : () => { ++this.candyLevel }
				};
			this.itemCache.push(item);
		}

		this.itemCache.sort(this.CompareByPrice);
		return this.itemCache;
	}

	Purchase(index : number) : void
	{
		var item = this.itemCache[index];
		var money = this.player.GetMoney();
		if (money < item.info.price)
			return;
		this.player.SetMoney(money - item.info.price);
		this.player.IncrementRate(item.info.rateBonus);
		item.Apply();
		this.Purchased.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <StoreModelState>JSON.parse(str);
		this.candyLevel = state.candyLevel;
	}

	ToPersistentString() : string
	{
		var state : StoreModelState =
			{ candyLevel : this.candyLevel
			};
		return JSON.stringify(state);
	}

	// private implementation

	private CompareByPrice
		( a : StoreItem
		, b : StoreItem
		) : number
	{
		return a.info.price - b.info.price;
	}

	private AddStoreItem(id : Item, Apply : () => void) : void
	{
		var info = Item.GetInfo(id);
		var item =
			{ id      : id
			, info    : info
			, enabled : info.price <= this.player.GetMoney()
			, Apply   : Apply
			};
		this.itemCache.push(item);
	}

	private OnMoneyChanged() : void
	{
		if (!this.itemCache)
			return;
		for (var i = 0; i != this.itemCache.length; ++i)
		{
			var item = this.itemCache[i];

			var money   = this.player.GetMoney();
			var enabled = item.info.price <= money;
			if (enabled == item.enabled)
				continue;
			this.changedItem = [i, enabled];
			this.itemCache[i].enabled = enabled;
			this.ItemStatusChanged.Call();
		}
	}
}
