import React from 'react';

/**
 * Table view module
 * A simple sortable table component.
**/
let TableView = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data,
      fields: [],
      sortField: ''
    };
  },
  parseFields: function () {
    // can use Object.keys(data)[0]; for this
    for (var d in this.props.data) {
      if (this.props.data.hasOwnProperty(d)) {
        var data = this.props.data[d];
        var fieldsArray = [];
        for (var i in data) {
          fieldsArray.push(i);
        }
        this.setState({ fields: fieldsArray });
      }
    }
  },
  sort: function (e) {
    // get the selected field
    let field = e.target.getAttribute("data-field-name");
    if (field === null) {
      field = e.target.parentNode.getAttribute("data-field-name");
    }

    // get the current sort direction
    let sortDirection = "DESC";
    if (this.refs[field].className === "sort-down") {
      sortDirection = "ASC";
    }

    // clear all field sort classes
    for (let i = 0; i < this.state.fields.length; i++) {
      let fieldName = this.state.fields[i];
      this.refs[fieldName].className = "";
    }

    // sort by field and direction
    this.sortByField(field, sortDirection);
  },
  sortByField: function (field, direction) {
    // set sortField for compare function
    this.setState({ sortField: field });
    this.state.sortField = field;

    let data = this.state.data;
    data.sort(this.compare);

    if (direction === "ASC") {
      this.refs[field].className = "sort-up";
      data.reverse();
    } else {
      this.refs[field].className = "sort-down";
    }
    this.setState({ data: data });
  },

  compare: function (a, b) {
    if (a[this.state.sortField] < b[this.state.sortField]) return -1;
    if (a[this.state.sortField] > b[this.state.sortField]) return 1;
    return 0;
  },
  componentDidMount: function () {
    this.parseFields();
  },
  render: function () {
    let columns = this.props.columns;
    let fields = this.state.fields;

    return React.createElement(
      'div',
      { className: 'react-table-view' },
      React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            this.state.fields.map((function (f) {
              return React.createElement(
                'th',
                { onClick: this.sort, 'data-field-name': f },
                React.createElement(
                  'span',
                  null,
                  f
                ),
                React.createElement('div', { ref: f })
              );
            }).bind(this))
          )
        ),
        React.createElement(
          'tbody',
          null,
          this.props.data.map(function (d) {
            return React.createElement(
              'tr',
              { key: d.id },
              fields.map(function (f) {
                if (columns && columns[f]) {
                  return React.createElement(
                    'td',
                    null,
                    columns[f](d)
                  );
                } else {
                  return React.createElement(
                    'td',
                    null,
                    d[f]
                  );
                }
              })
            );
          })
        )
      )
    );
  }
});

module.exports = TableView;