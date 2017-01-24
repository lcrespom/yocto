import { H, VNode } from './yocto/yocto';
import * as R from 'ramda';


export interface TableData {
	items: any[];
	fields: string[];
	labels: string[];
}

type ItemAction = (item: any) => any;

export interface ButtonData {
	style: string;
	icon: string;
	text: string;
	onClick: ItemAction;
}


export function crudEditButton(onClick: ItemAction): ButtonData {
	return {
		style: 'warning', icon: 'pencil', text: 'Edit',
		onClick
	};
}

export function crudRemoveButton(onClick: ItemAction): ButtonData {
	return {
		style: 'danger', icon: 'trash', text: 'Remove',
		onClick
	};
}

function actionButton(item: any, btnData: ButtonData): VNode {
	let btnText = btnData.text ? ' ' + btnData.text : '';
	return H.a(`.btn.btn-${btnData.style}.btn-sm`,
		{ on: { click: _ => btnData.onClick(item) } },
		[
			H.span(`.glyphicon.glyphicon-${btnData.icon}`,
				{ attrs: { 'aria-hidden': true } }),
			btnText
		]
	);
}

function actionButtons(item: any, buttons: ButtonData[]): VNode[] {
	if (buttons.length == 0) return [];
	let butDom = buttons.map(butData => actionButton(item, butData));
	return [H.td('.text-center.nowrap', R.intersperse(' ' as any, butDom))];
}

export function viewCrudTable(tableData: TableData, buttons: ButtonData[]): VNode {
	let actionHeader = buttons.length > 0
		? [H.th('.text-center.action-col', 'Action')]
		: [];
	return H.table('.table.table-hover', [
		H.thead(
			H.tr(
				actionHeader
				.concat(tableData.labels.map(label => H.th(label)))
			)
		),
		H.tbody(tableData.items.map(item =>
			H.tr(
				actionButtons(item, buttons)
				.concat(tableData.fields.map(field => H.td(item[field])))
			)
		))
	]);
}
