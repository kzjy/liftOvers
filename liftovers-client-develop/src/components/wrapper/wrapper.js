import { Component } from 'react';

export class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        offset: 0,
        limit: 10,
      },
      subFilter: {},
      currentPage: 1,
      pageSize: 10,
    };
    this.searchInputDebounceTimer = null;
  }
  changePageSize = (size, action) => {
    this.setState(
      {
        pageSize: size.value,
        currentPage: 1,
        filter: {
          ...this.state.subFilter,
          ...this.state.filter,
          limit: size.value,
        },
      },
      () => {
        this.props.fetchData(action, this.state.filter);
      }
    );
  };
  fetchData = (action, payload) => {
    this.props.fetchData(action, payload);
  };
  handlePagination = (page, action) => {
    let offset = (page - 1) * this.state.filter.limit;
    this.setState({
      currentPage: page,
      filter: {
        ...this.state.filter,
        offset,
      },
    });
    let payload = {
      ...this.state.subFilter,
      ...this.state.filter,
      offset,
    };
    this.props.fetchData(action, payload);
  };
  search = (search, action) => {
    search.stopPropagation();
    clearTimeout(this.searchInputDebounceTimer);
    this.setState(
      {
        filter: {
          ...this.state.filter,
          offset: 0,
          search: search.target.value ? search.target.value : null,
        },
      },
      () => {
        let payload = { ...this.state.filter, ...this.state.subFilter };
        this.searchInputDebounceTimer = setTimeout(() => {
          this.props.fetchData(action, payload);
        }, 1500);
      }
    );
  };
  filter = (filters, action) => {
    let tempFilters = {};
    filters.forEach(item => {
      tempFilters[item.key] = item.value;
    });
    let payload = {
      ...this.state.filter,
      ...tempFilters,
    };
    this.setState(
      {
        subFilter: {
          ...tempFilters,
        },
      },
      () => {
        this.props.fetchData(action, payload);
      }
    );
  };

  removeTag = (tag, action) => {
    let tempFilters = this.state.subFilter;
    delete tempFilters[tag.key];
    this.setState({ subFilter: tempFilters });
    let payload = { ...this.state.filter, ...tempFilters };
    this.props.fetchData(action, payload);
  };

  removeAllTags = action => {
    this.setState({ subFilter: {} });
    this.setState(
      {
        filter: {
          offset: 0,
          limit: 10,
        },
      },
      () => {
        this.props.fetchData(action, this.state.filter);
      }
    );
  };

  render() {
    return this.props.render(
      this.fetchData,
      this.changePageSize,
      this.handlePagination,
      this.search,
      this.filter,
      this.removeTag,
      this.removeAllTags,
      this.state.currentPage,
      this.state.pageSize,
      this.state.filter,
      this.state.subFilter,
      this.props.loadingTransactions
    );
  }
}
