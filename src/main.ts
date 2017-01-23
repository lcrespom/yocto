import { runComponent, H, VNode, Dispatcher } from './yocto/yocto';
import { FormModel, FormAction, FormComponent } from './form-cmp';
import * as R from 'ramda';


interface SearchQuery {
	fromDate: Date;
	toDate: Date;
}

interface Transaction {
	amount: number;
}

interface AppModel {
	name: string;
	form: FormModel;
	query: SearchQuery;
	txns: Transaction[];
}

type AppAction = NameAction | FormAction;

type NameAction = {
	type: 'name';
	name: string;
};

type AppDispatcher = Dispatcher<AppAction>;


function init(props): AppModel {
	return {
		name: '',
		form: FormComponent.init({
			fields: ['fromDate', 'toDate'],
			labels: ['From date', 'To date'],
			formData: { fromDate: '', toDate: '' }
		}),
		query: { fromDate: new Date(), toDate: new Date },
		txns: []
	};
}


function view(model: AppModel, dispatch: AppDispatcher): VNode {
	return H.div([
		H.h1('Transactions'),
		'What is your name? ',
		H.input({
			on: {
				input: evt => dispatch({ type: 'name', name: evt.target.value })
			},
			props: {
				value: model.name
			}
		}),
		H.hr(),
		FormComponent.view(model.form, dispatch),
		H.hr(),
		H.span('Hello ' + model.name),
	]);
}


function mapObj(obj: any, mapper: (key: string, value: any) => any): any {
	let pairs: any = R.map(
		([key, value]: any) => [key, mapper(key, value)],
		R.toPairs(obj)
	);
	return R.fromPairs(pairs);
}

function updateComponents(appModel: AppModel, action: any, models: any): AppModel {
	return R.merge(appModel, mapObj(models,
		(model, component) => component.update(appModel[model], action)));
}

function update(model: AppModel, action: AppAction): AppModel {
	const newModel = R.merge(model);
	switch (action.type) {
		case 'name':
			return newModel({ name: action.name });
		case 'form.submit':
			console.log(action.formData);
			return model;
		default:
			return updateComponents(model, action, { form: FormComponent });
	}
}


let bankApp = {
	init,
	view,
	update
};

function main() {
	let element = document.getElementById('app');
	if (!element)
		throw Error('No "#app" element');
	runComponent(bankApp, element, {}, 'txns');
}

main();
