/// <reference path="Signal.ts" />

interface ISaveView
{
	Clear  : Signal;
	Update : Signal;

	SetSaveData(data : [string, string][]) : void;
}
