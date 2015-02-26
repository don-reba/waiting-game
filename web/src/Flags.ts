/// <reference path="IPersistent.ts" />

interface FlagsState
{
	flags : string[];
}

class Flags implements IPersistent
{
	private flags : string[] = [];

	private checks : { [index : string] : () => boolean } = {};

	// public interface

	IsSet(flag : string) : boolean
	{
		var Check = this.checks[flag];
		if (Check)
			return Check();
		return this.flags.indexOf(flag) >= 0;
	}

	Set(flag : string) : void
	{
		if (this.flags.indexOf(flag) < 0)
			this.flags.push(flag);
	}

	SetCheck(flag : string, Check : () => boolean) : void
	{
		this.checks[flag] = Check;
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
