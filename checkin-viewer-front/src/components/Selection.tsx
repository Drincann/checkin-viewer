import React, { useEffect } from 'react';
import axios from '../request';
import { DataList, DataListInView } from './types';

type AccessableQueryListInView = { id: number, displayName: string }[];
interface AccessableQueryList {
  code: number;
  data: AccessableQueryListInView;
}



export function Selection(props: { onData?: (data: DataListInView) => void }) {
  const [data, setData] = React.useState<AccessableQueryListInView | null | undefined>([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<number | null>(null);
  // req select list
  useEffect(() => {
    axios.post<AccessableQueryList>('/api/getAccessableQueryList', {}).then(res => {
      setData(res?.data.data);
    }, err => {
      console.log('err in getAccessableQueryList', err);
      // TODO alert
    });
  }, []);


  return (<div className="input-group">
    <select className="form-select" disabled={data?.length ? false : true} onChange={e => {
      setSelected(Number(e.target.value));
    }}>
      {data !== null && Array.isArray(data) ? <option defaultValue={undefined}> 请选择... </option> : <option defaultValue={0}> 未找到可用的查询 </option>}
      {data?.map?.(data => <option key={data.id} value={data.id}> {data.displayName} </option>)}
    </select>
    <button className={`btn ${loading ? 'btn-secondary' : 'btn-success'}`} type="button" onClick={async () => {
      if (loading) return;
      if (!Number.isInteger(selected)) { return } // TODO alert
      let res; try {
        setLoading(true);
        res = await axios.post<DataList>('/api/queryNotCheckinList', {
          id: selected,
        })
      } catch (e) {
        // TODO alert
        return;
      } finally {
        setLoading(false);
      }
      props.onData?.(res?.data?.data);
    }}>{loading ? '等待' : '查询'}</button>
  </div>)
}