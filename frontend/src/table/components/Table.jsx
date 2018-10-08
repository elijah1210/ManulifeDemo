import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import './Table.css';

const Table = (props) => {
  const { columns, historicalRates } = props;
  const headerColumns = columns.map(column => (
    <th key={column}>
      {column}
    </th>
  ));

  const bodyData = historicalRates.map((data, i) => {
    const row = columns.map((column) => {
      const record = get(data, column, '');
      const key = `${i}-${column}`;
      return (
        <td key={key}>
          {record}
        </td>
      );
    });
    const rowKey = `${i}-rate`;
    return (
      <tr key={rowKey}>
        {row}
      </tr>
    );
  });

  return (
    <table>
      <thead key="thead">
        <tr>
          {headerColumns}
        </tr>
      </thead>
      <tbody key="tbody">
        {bodyData}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  historicalRates: PropTypes.arrayOf(PropTypes.shape({
    base: PropTypes.string,
    date: PropTypes.string,
    AUD: PropTypes.number,
    CAD: PropTypes.number,
    GBP: PropTypes.number,
    EUR: PropTypes.number,
  })),
  columns: PropTypes.arrayOf(PropTypes.string),
};

Table.defaultProps = {
  historicalRates: [],
  columns: [],
};

export default Table;
