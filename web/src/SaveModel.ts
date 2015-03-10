/// <reference path="ISaveModel.ts" />

class SaveModel implements ISaveModel
{
	// ISaveModel implementation

	ClearSaveData()
	{
		localStorage.clear();
		location.reload();
	}

	GetSaveData() : [string, string][]
	{
		var data : [string, string][] = [];
		for (var i = 0; i != localStorage.length; ++i)
		{
			var key = localStorage.key(i);
			var val = localStorage[key];
			data.push([key, val]);
		}
		data.sort(this.Compare);
		return data;
	}

	SetSaveData(data : [string, string][]) : void
	{
		for (var i = 0; i != data.length; ++i)
			localStorage[data[i][0]] = data[i][1];
		location.reload();
	}

	// private implementation

	private Compare(a : [string, string], b : [string, string]) : number
	{
		return a[0].localeCompare(b[0]);
	}
}
