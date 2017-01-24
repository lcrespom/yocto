import { H, Dispatcher, VNode } from './yocto/yocto';
import { getDateStr, parseDateTime } from './date-utils';
import * as R from 'ramda';


// -------------------- Types --------------------

export interface FormConfig {
	fields: string[];
	labels: string[];
	formData: any;
	attrs?: any;
	submitLabel?: string;
	cancelLabel?: string;
}

export interface FormModel {
	config: FormConfig;
	formText: any;
	attrs: any;
	fieldLabels: string[][];
}

export type FormAction = UpdateFieldAction | SubmitAction | CancelAction;

interface UpdateFieldAction {
	type: 'form.update-field';
	field: string;
	value: any;
}

interface SubmitAction {
	type: 'form.submit';
	formText: any;
	formData: any;
}

interface CancelAction {
	type: 'form.cancel';
}

type FormDispatcher = Dispatcher<FormAction>;


// -------------------- Parsing & Formatting --------------------

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

function mapObj(obj: any, mapper: (key: string, value: any) => any): any {
	let pairs: any = R.map(
		([key, value]: any) => [key, mapper(key, value)],
		R.toPairs(obj)
	);
	return R.fromPairs(pairs);
}

function formatForm(formData, attrs) {
	return mapObj(formData,
		(field, value) => fromType(value, attrs[field].type)
	);
}

function parseForm(formText, attrs) {
	return mapObj(formText,
		(field, value) => toType(value, attrs[field].type)
	);
}

// -------------------- View --------------------

function viewFormInput(model: any,
	field: string, label: string, attrs: any = {}, changed) {
	attrs.value = model[field] || '';
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
	const updateField = (field, value) => dispatch({
		type: 'form.update-field', field, value
	});
	return H.div([
		H.form('.form-horizontal', {
			attrs: { action: 'javascript:void(0)' },
			on: {
				submit: _ => dispatch({
					type: 'form.submit',
					formText: model.formText,
					formData: parseForm(model.formText, model.attrs)
				})
			}}, [
			H.div(model.fieldLabels.map(([field, label]) =>
				viewFormInput(model.formText, field, label,
					model.attrs[field], updateField))),
			viewFormButtons([
				H.button('.btn.btn-primary', {
					attrs: { type: 'submit' } },
					model.config.submitLabel || 'Save'),
				H.button('.btn.btn-default', {
					attrs: { type: 'button' },
					on: {
						click: _ => dispatch({ type: 'form.cancel' })
					} },
					model.config.cancelLabel || 'Cancel')
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
			let formText = R.merge(model.formText, {
				[action.field]: action.value
			});
			return R.merge(model, { formText });
		default:
			return model;
	}
}

function init(config: FormConfig): FormModel {
	let attrs = config.attrs || {};
	for (let field of config.fields)
		attrs[field] = attrs[field] || {};
	let formText = formatForm(config.formData, attrs);
	return {
		config,
		formText,
		attrs,
		fieldLabels: R.zip(config.fields, config.labels),
	};
}


export const FormComponent = {
	init,
	view,
	update
};
