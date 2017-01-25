import { runComponent, H, VNode, Dispatcher } from './yocto/yocto';
import { FormModel, FormAction, FormComponent } from './form-cmp';
import { viewCrudTable } from './crud-table-view';
import { searchTxns, TxnAction } from './txns-svc';
import * as R from 'ramda';


interface SearchQuery {
	fromDate: Date;
	toDate: Date;
}

interface Transaction {
	date: string;
	description: string;
	amount: number;
	balance: number;
}

interface AppModel {
	form: FormModel;
	query: SearchQuery;
	txns: Transaction[];
}

type AppAction = FormAction | TxnAction;

type AppDispatcher = Dispatcher<AppAction>;


function init(props): AppModel {
	return {
		form: FormComponent.init({
			fields: ['fromDate', 'toDate'],
			labels: ['From date', 'To date'],
			formData: { fromDate: new Date(), toDate: new Date() },
			attrs: {
				fromDate: { type: 'date' },
				toDate: { type: 'date' }
			},
			submitLabel: 'Search',
			submitIcon: 'search',
			hideCancel: true
		}),
		query: { fromDate: new Date(), toDate: new Date },
		txns: []
	};
}


function view(model: AppModel, dispatch: AppDispatcher): VNode {
	const ucfirst = str => str.charAt(0).toUpperCase() + str.slice(1);
	const TABLE_FIELDS = ['date', 'description', 'amount', 'balance'];
	let tableData = {
		items: model.txns,
		fields: TABLE_FIELDS,
		labels: R.map(ucfirst, TABLE_FIELDS)
	};
	let buttons = [{
		style: 'info', icon: 'list-alt', text: 'Details',	onClick: _ => 0
	}];
	return H.div([
		H.h1('Transactions'),
		FormComponent.view(model.form, dispatch),
		H.hr(),
		viewCrudTable(tableData, buttons)
	]);
}

function update(model: AppModel, action: AppAction, dispatch: AppDispatcher): AppModel {
	const newModel = R.merge(model);
	switch (action.type) {
		case 'form.submit':
			let query = {
				fromDate: action.formData.fromDate,
				toDate: action.formData.toDate
			};
			searchTxns(query.fromDate, query.toDate, dispatch);
			return newModel({ query });
		case 'txns.result':
			return newModel({ txns: action.data });
		default:
			return newModel({ form: FormComponent.update(model.form, action) });
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
