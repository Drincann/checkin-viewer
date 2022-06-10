import { PageHeader } from './PageHeader'
import { Selection } from './Selection'
import { DataList } from './DataList'
import React from 'react';
import { DataListInView } from './types';
export function App(props: {}) {
  const [dataList, setDataList] = React.useState<DataListInView | null | undefined>([]);
  return (
    <div>
      <div className="row mb-3"> <PageHeader title='超星签到情况查询' details={`Bug report @gaolihai`} /> </div>
      <div className="container">
        <div className="row mb-3"> <div className="col"> <Selection onData={
          data => {
            if (!Array.isArray(data) || data?.length === 0) { setDataList([{ name: '无' }]); return; };
            setDataList(data);
          }
        } /> </div>  </div>
        <div className="row mb-3"> <div className="col"> <DataList dataList={dataList} /> </div> </div>
        <div style={{ textAlign: 'center' }}> <a href='https://codingfor.life'> @gaolihai </a> </div>
      </div>
    </div>
  )
}
