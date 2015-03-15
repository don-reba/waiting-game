/// <reference path="IPersistent.ts" />
/// <reference path="Signal.ts"      />
/// <reference path="Timer.ts"       />

class PersistentState
{
	private version = "14";

	constructor(private items : [string, IPersistent][], timer : Timer)
	{
		timer.AddEvent(this.Save.bind(this), 20);
	}

	// get the state string from each item and store it in local storage
	Save() : void
	{
		if (!this.LocalStoreAvailable())
			return;
		localStorage.setItem("version", this.version);
		for (var i = 0; i != this.items.length; ++i)
		{
			var item = this.items[i];
			localStorage.setItem(item[0], item[1].ToPersistentString())
		}
	}

	// get the string corresponding to every item from local storage and
	// ask it to restore its state from it
	Load() : void
	{
		if (!this.LocalStoreAvailable())
			return;
		if (localStorage.getItem("version") != this.version)
			return;
		try
		{
			for (var i = 0; i != this.items.length; ++i)
			{
				var item = this.items[i];
				item[1].FromPersistentString(localStorage.getItem(item[0]));
			}
		}
		catch (e)
		{
			// an opportunity to output a debug message
		}
	}

	private LocalStoreAvailable() : boolean
	{
		try
		{
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e)
		{
			return false;
		}
	}
}
