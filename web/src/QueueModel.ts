/// <reference path="IQueueModel.ts" />
/// <reference path="IPersistent.ts" />

class Character
{
	public name : string;
}

class QueuePosition
{
	character : Character;
	remaining : number;
	ticket    : string;
}

class QueueModelState
{
	queue    : QueuePosition[];
	player   : QueuePosition;
	ticket   : number;
	dialogID : number;
	speaker  : string;
}

class QueueModel implements IQueueModel
{
	private queue    : QueuePosition[];
	private stock    : Character[];
	private player   : QueuePosition;
	private ticket   : number;
	private dialogID : number;
	private speaker  : string;

	constructor
		( private timer     : Timer
		, private maxLength : number
		)
	{
		timer.AddEvent(this.OnAdvance.bind(this), 20);
		timer.AddEvent(this.OnKnock.bind(this),   19);

		this.stock =
			[ { name : "Аня"      }
			, { name : "Борис"    }
			, { name : "Вера"     }
			, { name : "Григорий" }
			, { name : "Даша"     }
			, { name : "Елена"    }
			, { name : "Жора"     }
			, { name : "Зоя"      }
			, { name : "Инна"     }
			, { name : "Костик"   }
			, { name : "Лёша"     }
			, { name : "Маша"     }
			, { name : "Настя"    }
			, { name : "Оля"      }
			, { name : "Пётр"     }
			, { name : "Родриг"   }
			, { name : "Света"    }
			, { name : "Тамара"   }
			, { name : "Усач"     }
			, { name : "Фёдор"    }
			, { name : "Хосе"     }
			, { name : "Цезарь"   }
			, { name : "Чарли"    }
			, { name : "Шарик"    }
			, { name : "Элла"     }
			, { name : "Юра"      }
			, { name : "Яна"      }
			];

		this.ticket = 0;

		this.queue = [];
		for (var i = 0; i != this.maxLength; ++i)
			this.AddStockPosition();
	}

	// IQueueModel implementation

	CurrentTicketChanged = new Signal();
	DialogChanged        = new Signal();
	PeopleChanged        = new Signal();
	PlayerTicketChanged  = new Signal();

	EnterQueue() : void
	{
		if (this.queue.every((p) => { return p.character != null; }))
			this.AddPlayerPosition();
	}

	GetDialogID() : number
	{
		return this.dialogID;
	}

	GetPlayerTicket() : string
	{
		for (var i = 0; i != this.queue.length; ++i)
		{
			if (!this.queue[i].character)
				return this.queue[i].ticket;
		}
		return null;
	}

	GetCurrentTicket() : string
	{
		if (this.queue.length > 0)
			return this.queue[0].ticket;
		return null;
	}

	GetPeopleNames() : string[]
	{
		return this.queue
			.filter((p) => { return p.character != null; })
			.map((p) => { return p.character.name; });
	}

	GetSpeaker() : string
	{
		return this.speaker;
	}

	SetDialog(speaker : string, dialogID : number) : void
	{
		this.speaker  = speaker;
		this.dialogID = dialogID;
		this.DialogChanged.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <QueueModelState>JSON.parse(str);
		this.queue    = state.queue;
		this.player   = state.player;
		this.ticket   = state.ticket;
		this.dialogID = state.dialogID;
		this.speaker  = state.speaker;
		this.PlayerTicketChanged.Call();
		this.CurrentTicketChanged.Call();
		this.PeopleChanged.Call();
		this.DialogChanged.Call();
	}

	ToPersistentString() : string
	{
		var state : QueueModelState =
			{ queue    : this.queue
			, player   : this.player
			, ticket   : this.ticket
			, dialogID : this.dialogID
			, speaker  : this.speaker
			};
		return JSON.stringify(state);
	}

	// private implementation

	private AddStockPosition() : void
	{
		var i;
		do
		{
			i = Math.floor(Math.random() * this.stock.length);
		} while (this.InQueue(this.stock[i]));

		var remaining = Math.floor(2 + Math.random() * 8);
		var ticket    = String(this.ticket++);
		var p         =
			{ character : this.stock[i]
			, remaining : remaining
			, ticket    : ticket
			};

		this.stock.splice(i, 1);
		this.queue.push(p);
	}

	private AddPlayerPosition() : void
	{
		var remaining = Math.floor(2 + Math.random() * 8);
		var ticket    = String(this.ticket++);
		var p         =
			{ character : null
			, remaining : remaining
			, ticket    : ticket
			};

		this.queue.push(p);
	}

	private InQueue(c : Character) : boolean
	{
		return this.queue.some((p) => { return p.character && p.character.name === c.name; });
	}

	private OnAdvance() : void
	{
		if (this.queue.length == 0)
			return;

		var p = this.queue[0];
		--p.remaining;

		if (p.remaining <= 0)
		{
			this.queue.shift();
			if (p.character)
			{
				this.stock.push(p.character);
				this.PeopleChanged.Call();
			}
			else
			{
				this.PlayerTicketChanged.Call();
			}
			this.CurrentTicketChanged.Call();
		}
	}

	private OnKnock() : void
	{
		if (this.queue.length < this.maxLength && Math.random() < 0.3)
		{
			this.AddStockPosition();
			this.PeopleChanged.Call();
		}
	}
}
