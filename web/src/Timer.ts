class TimerEvent
{
	constructor
		( public handler   : () => void
		, public frequency : number
		, public remaining : number
		, public recurring : boolean
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

	AddEvent(e : () => void, delay : number)
	{
		this.events.push(new TimerEvent(e, delay, delay, true));
	}

	AddOneTimeEvent(e : () => void, delay : number)
	{
		this.events.push(new TimerEvent(e, delay, delay, false));
	}

	private OnTick() : void
	{
		for (var i = 0; i != this.events.length; ++i)
		{
			var e = this.events[i];
			if (e.remaining <= 0)
			{
				e.handler();
				if (e.recurring)
					e.remaining = e.frequency;
				else
					this.events.splice(i--, 1);
			}
			--e.remaining;
		}
	}
}
