/// <reference path="Signal.ts" />

interface ISaveView
{
	Clear : Signal;
	Load  : Signal;
	Save  : Signal;

	GetSaveData() : [string, string][];

	SetSaveData(data : [string, string][]) : void;
}
