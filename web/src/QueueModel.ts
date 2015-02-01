/// <reference path="IQueueModel.ts" />
/// <reference path="IClientView.ts" />

class QueueModel implements IQueueModel
{
	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Queue;
	}

	Hide() : void
	{
	}

	Show(e : JQuery) : void
	{
		e.text("Queue");
	}
}
