import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
export class PageHeader extends React.Component<{
  title?: string;
  details?: string;
}> {
  render() {
    return (
      <div className='pb-5 pt-3 bg-success bg-opacity-10 border-dark border-bottom rounded-2'>
        <div className="container">
          <div className='fs-1 fw-bold mb-3'>{this.props.title ?? 'default title'}</div>
          <div className='small'>{this.props.details ?? 'default details'}</div>
        </div>
      </div>
    )
  }
}