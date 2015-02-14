/// <reference path="CompactJson.ts" />
/// <reference path="ISaveView.ts"   />

class SaveView implements ISaveView
{
	// ISaveView implementation

	Clear = new Signal();
	Load  = new Signal();
	Save  = new Signal();

	constructor()
	{
		$("#save-clear").click(() => { this.Clear.Call(); });
		$("#save-load").click(() => { this.Load.Call(); });
		$("#save-save").click(() => { this.Save.Call(); });
	}

	GetSaveData() : [string, string][]
	{
		var data = [];

		var rows = $("#dev-contents tr");
		for (var i = 0; i != rows.length; ++i)
		{
			var key   = $(rows[i]).find("td.key").text();
			var value = $(rows[i]).find("td.value").text();
			data.push([key, value]);
		}
		return data;
	}

	SetSaveData(data : [string, string][]) : void
	{
		var rows = [];
		for (var i = 0; i != data.length; ++i)
		{
			var item = data[i];
			var key  = item[0];
			var value = CompactJson.Stringify(JSON.parse(item[1]));
			rows.push("<tr><td class='key'>" + key + "</td><td class='value' contenteditable>" + value + "</td></tr>");
		}
		$("#dev-contents").html("<table>" + rows.join("") + "</table>");
	}
}
