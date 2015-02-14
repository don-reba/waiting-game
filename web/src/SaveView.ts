/// <reference path="CompactJson.ts" />
/// <reference path="ISaveView.ts"   />

class SaveView implements ISaveView
{
	// ISaveView implementation

	Clear  = new Signal();
	Update = new Signal();

	constructor()
       	{
		$("#save-clear").click(() => { this.Clear.Call(); });
		$("#save-update").click(() => { this.Update.Call(); });
	}

	SetSaveData(data : [string, string][]) : void
	{
		var rows = [];
		for (var i = 0; i != data.length; ++i)
		{
			var item = data[i];
			var key  = item[0];
			var value = CompactJson.Stringify(JSON.parse(item[1]));
			rows.push("<tr><td class='key'>" + key + "</td><td class='value'>" + value + "</td></tr>");
		}
		$("#dev-contents").html("<table>" + rows.join("") + "</table>");
	}
}
