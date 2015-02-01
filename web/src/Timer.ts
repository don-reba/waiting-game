class TimerEvent
{
	constructor
		( public handler   : () => void
		, public frequency : number
		, public remaining : number
		)
	{
	}
}

class Timer
{
	private events : TimerEvent[] = [];

	Start(tickMilliseconds : number) : void
	{
		setInterval(this.OnTick.bind(this), tickMilliseconds);
	}

	AddEvent(e : () => void, frequency : number)
	{
		this.events.push(new TimerEvent(e, frequency, frequency));
	}

	private OnTick() : void
	{
		for (var i = 0; i != this.events.length; ++i)
		{
			var e = this.events[i];
			if (e.remaining <= 0)
			{
				e.handler();
				e.remaining = e.frequency;
			}
			--e.remaining;
		}
	}
}
