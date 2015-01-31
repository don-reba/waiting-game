/// <reference path="MainModel.ts"     />
/// <reference path="MainPresenter.ts" />
/// <reference path="MainView.ts"      />

function main()
{
	var mainModel = new MainModel();
	var mainView  = new MainView();
	var mainPresenter = new MainPresenter(mainModel, mainView);

	mainPresenter.Start();
}

main();
