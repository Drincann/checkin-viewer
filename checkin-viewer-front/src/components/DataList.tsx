import React from 'react';
import { DataListInView } from './types';

export class DataList extends React.Component<{ dataList?: DataListInView | null | undefined }> {
	render() {
		return (<ul className="list-group">
			{
				this.props.dataList == null ? null : this.props.dataList.map(
					(data, index) => <li className="list-group-item" key={index}>{data.name}</li>)
			}
		</ul>)
	}
}