import { H, Dispatcher, VNode } from './yocto/yocto';
import { getDateStr, parseDateTime } from './date-utils';
import * as R from 'ramda';


// -------------------- Types --------------------

export interface FormModel {
	fields: string[];
	labels: string[];
	formData: any;
	fieldLabels?: string[][];
	attrs?: { [field: string]: any };
	submitLabel?: string;
	cancelLabel?: string;
}

export type FormAction = UpdateFieldAction | SubmitAction | CancelAction;

interface UpdateFieldAction {
	type: 'form.update-field';
	field: string;
	value: any;
}

interface SubmitAction {
	type: 'form.submit';
	formData: any;
}

interface CancelAction {
	type: 'form.cancel';
}

type FormDispatcher = Dispatcher<FormAction>;


// -------------------- View --------------------

function fromType(value: any, type = ''): string {
	switch (type) {
		case 'date':
			return getDateStr(value);
		case 'number':
		case 'range':
			// ToDo: limit number of decimals
			return '' + value;
		default:
			return value || '';
	}
}

function toType(value: string, type = '') {
	switch (type) {
		case 'date':
			return parseDateTime(value);
		case 'number':
		case 'range':
			return Number(value);
		default:
			return value || '';
	}
}

function viewFormInput(model: any,
	field: string, label: string, attrs: any = {}, changed) {
	attrs.value = fromType(model[field], attrs.type);
	const autoFocusHook = (autoFocus: boolean) =>
		autoFocus
			? { insert: vnode => vnode.elm.focus() }
			: {};
	return H.div('.form-group', [
		H.label('.control-label.col-sm-3', label),
		H.div('.col-sm-9',
			H.input('.form-control', {
				attrs,
				hook: autoFocusHook(attrs.autofocus),
				on: { change: evt => changed(field, evt.target.value) }
			})
		)
	]);
}

function viewFormButtons(buttons: any[]) {
	return H.div('.form-group',
		H.div('.col-sm-12.text-center',
			R.intersperse('\u00A0\u00A0\u00A0', buttons))
	);
}

function view(model: FormModel, dispatch: FormDispatcher): VNode {
	if (!model.fieldLabels) return H.div();
	let attrs = model.attrs || {};
	const updateField = (field, value) => dispatch({
		type: 'form.update-field',
		field,
		value: toType(value, attrs[field] ? attrs[field].type : '')
	});
	return H.div([
		H.form('.form-horizontal', {
			attrs: { action: 'javascript:void(0)' },
			on: {
				submit: _ => dispatch({
					type: 'form.submit', formData: model.formData
				})
			}}, [
			H.div(model.fieldLabels.map(([field, label]) =>
				viewFormInput(model.formData, field, label,
					attrs[field], updateField))),
			viewFormButtons([
				H.button('.btn.btn-primary', {
					attrs: { type: 'submit' } },
					model.submitLabel || 'Save'),
				H.button('.btn.btn-default', {
					attrs: { type: 'button' },
					on: {
						click: _ => dispatch({ type: 'form.cancel' })
					} },
					model.cancelLabel || 'Cancel')
			])
		])
	]);
}


// -------------------- Update --------------------

function update(model: FormModel, action: FormAction): FormModel {
	if (!action.type.startsWith('form.'))
		return model;
	switch (action.type) {
		case 'form.update-field':
			let formData = R.merge(model.formData, {
				[action.field]: action.value
			});
			return R.merge(model, { formData });
		default:
			return model;
	}
}


function init(props?: FormModel): FormModel {
	if (!props)
		throw Error('props parameter is mandatory for FormComponent');
	props.fieldLabels = R.zip(props.fields, props.labels);
	return props;
}


export const FormComponent = {
	init,
	view,
	update
};
