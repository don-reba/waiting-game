class Callback
{
	constructor
		( private x : Object
		, private f : () => void
		)
	{
	}

	Call() : void
	{
		this.f.apply(this.x);
	}
}

class Signal
{
	private listeners : Callback[] = [];

	Add(context : Object, listener : () => void) : void
	{
		this.listeners[this.listeners.length] = new Callback(context, listener);
	}

	Call() : void
	{
		for (var i = 0, length = this.listeners.length; i != length; ++i)
			this.listeners[i].Call();
	}
}
