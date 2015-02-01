class Signal
{
	private listeners : (()=>void)[] = [];

	Add(listener : () => void) : void
	{
		this.listeners.push(listener);
	}

	Call() : void
	{
		for (var i = 0, length = this.listeners.length; i != length; ++i)
			this.listeners[i]();
	}
}
