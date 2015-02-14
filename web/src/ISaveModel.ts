interface ISaveModel
{
	ClearSaveData();

	GetSaveData() : [string, string][];

	SetSaveData(data : [string, string][]) : void;
}
