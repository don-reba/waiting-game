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
		this.saveView.Load.Add(this.OnLoad.bind(this));
		this.saveView.Save.Add(this.OnSave.bind(this));
	}

	Load()
	{
		this.saveView.SetSaveData(this.saveModel.GetSaveData());
	}

	private OnClear()
	{
		this.saveModel.ClearSaveData();
		this.saveView.SetSaveData(this.saveModel.GetSaveData());
	}

	private OnLoad()
	{
		this.saveView.SetSaveData(this.saveModel.GetSaveData());
	}

	private OnSave()
	{
		this.saveModel.SetSaveData(this.saveView.GetSaveData());
	}
}
