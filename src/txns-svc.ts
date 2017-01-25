import { Dispatcher } from './yocto/yocto';

export type TxnAction = {
	type: 'txns.result';
	data: any;
};

const TXNS = [
	{ date: '20/01/17', description: 'Electricity', amount: 200, balance: 1000 },
	{ date: '21/01/17', description: 'Gas', amount: 300, balance: 800 },
	{ date: '22/01/17', description: 'Phone', amount: 100, balance: 400 },
	{ date: '23/01/17', description: 'Water', amount: 50, balance: 350 }
];

export function searchTxns(fromDate: Date, toDate: Date, dispatch: Dispatcher<TxnAction>) {
	setTimeout(_ => {
		dispatch({ type: 'txns.result', data: TXNS });
	}, 1000);
}
