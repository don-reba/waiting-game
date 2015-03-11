/// <reference path="IPersistent.ts" />

interface FlagsState
{
	flags : string[];
}

class Flags implements IPersistent
{
	private flags : string[] = [];

	private checks : { [index : string] : () => boolean } = {};

	private controls : { [index : string] : () => void } = {};

	// public interface

	Clear(flag : string) : void
	{
		var i = this.flags.indexOf(flag);
		if (i >= 0)
			this.flags.splice(i, 1);
	}

	IsSet(flag : string) : boolean
	{
		var Check = this.checks[flag];
		if (Check)
			return Check();
		return this.flags.indexOf(flag) >= 0;
	}

	Set(flag : string) : void
	{
		var Control = this.controls[flag];
		if (Control)
			Control();
		else if (this.flags.indexOf(flag) < 0)
			this.flags.push(flag);
	}

	SetCheck(flag : string, Check : () => boolean) : void
	{
		this.checks[flag] = Check;
	}

	SetControl(flag : string, Control : () => void) : void
	{
		this.controls[flag] = Control;
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <FlagsState>JSON.parse(str);
		this.flags = state.flags;
	}

	ToPersistentString() : string
	{
		var state : FlagsState = { flags : this.flags };
		return JSON.stringify(state);
	}
}
