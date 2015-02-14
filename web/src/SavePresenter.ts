/// <reference path="ISaveModel.ts" />
/// <reference path="ISaveView.ts"  />

class SavePresenter
{
	constructor
		( private saveModel : ISaveModel
		, private saveView  : ISaveView
		)
	{
		this.saveView.Clear.Add(this.OnClear.bind(this));
		this.saveView.Update.Add(this.OnUpdate.bind(this));
	}

	private OnUpdate()
	{
		this.saveView.SetSaveData(this.saveModel.GetSaveData());
	}

	private OnClear()
	{
		this.saveModel.ClearSaveData();
	}
}
