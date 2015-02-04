class TimerEvent
{
	constructor
		( public handler : () => void
		, public delay   : number
		)
	{
	}
}

class Timer
{
	private events : TimerEvent[] = [];

	// if we started at 0, all the events would go off at start
	private ticks : number = 1;

	Start(tickMilliseconds : number) : void
	{
		setInterval(this.OnTick.bind(this), tickMilliseconds);
	}

	AddEvent(e : () => void, delay : number)
	{
		this.events.push(new TimerEvent(e, delay));
	}

	private OnTick() : void
	{
		for (var i = 0; i != this.events.length; ++i)
		{
			var e = this.events[i];
			if (this.ticks % e.delay == 0)
				e.handler();
		}
		++this.ticks;
	}
}
