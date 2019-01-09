import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import Main from '../components/main';
import fetch from 'isomorphic-unfetch'

const rowHeight = 50;

const POST_MAPPING = [
  {
    id: 18807017,
    title: 'January 2019',
  },
  {
    id: 18589702,
    title: 'December 2018'
  },
  {
    id: 18354503,
    title: 'November 2018',
  },
]

export default class Home extends React.Component {
  static filter(item, value) {
    const inDescriptions = (item.description.filter(description => (
      description.toLowerCase().search(value.toLowerCase()) !== -1
    ))).length > 0;
    const inTitle = item.title.toLowerCase().search(
      value.toLowerCase()) !== -1;
    return inDescriptions || inTitle;
  }

 static getInitialProps = async function() {
    const res = await fetch(`http://localhost:80/id?id=18807017`)
    const data = await res.json()

    return {
      listings: data
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      listings: props.listings,
      filteredListings: props.listings,
      filters: [],
      flipADelphia: false,
    }
    this.filterAll = this.filterAll.bind(this);
    this.filterList = this.filterList.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.deleteFilter = this.deleteFilter.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.changePost = this.changePost.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      flipADelphia: !this.state.flipADelphia,
    })
  }

  filterList(event) {
    const { listings } = this.state;
    const filteredListings = listings.filter(item => (
      this.filterAll(item, event)
    ));
    this.setState({
      filteredListings,
      search: event.target.value,
    });
  }

  filterAll(item, event) {
    const { filters } = this.state;
    const inSearch = Home.filter(item, event.target.value);
    let inFilters = true;
    for(let i = 0; i < filters.length; i += 1) {
      if(!Home.filter(item, filters[i])) {
        inFilters = false;
      };
    }
    return inSearch && inFilters;
  }

  addFilter(e) {
    if (e.charCode !== 13) return;
    const { filters } = this.state;
    filters.push(e.target.value);
    this.setState({
      search: '',
      filters,
    });
  }

  deleteFilter(index) {
    const { filters } = this.state;
    filters.splice(index, 1);
    this.setState({
      search: '',
      filters,
    });
    this.filterList({ target: { value: '' }})
  }

  async changePost(e) {
    console.log(e.target.value)
    const postId = e.target.value;

    const res = await fetch(`http://localhost:80/id?id=${postId}`);
    const listings = await res.json();

    this.setState({
      listings,
      filteredListings: listings,
    });
  }

  renderRow({ index, key, style, parent }) {
    const listing = this.state.filteredListings[index];
    return (
      <CellMeasurer 
        key={key}
        cache={this.cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style} className="row">
          <div className="list-item" key={listing.title}>
            <div className="list-item-title" dangerouslySetInnerHTML={{ __html: listing.title }} />
            <div className="list-item-description">
            {listing.description.map(p => (
              <p dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            </div>
          </div>
        </div>
      </CellMeasurer>
    );
  }

  render() {
    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 300
    });
    const styling = {
      backgroundImage: "url('/static/images/letter-x.png')"
    };
    return(
      <Main>
        <div>
          <div className="heading-wrapper">
            <h1 className="title">Hacker News Job Listings: January 2019</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Type to search, enter to add filter"
                value={this.state.search}
                onChange={this.filterList}
                onKeyPress={this.addFilter}
              />
              <select onChange={this.changePost}>
                {POST_MAPPING.map(post => (
                  <option
                    key={post.id}
                    value={post.id}
                  >
                    {post.title}
                  </option>
                ))}
              </select>
              <a
                className="github"
                href="https://github.com/maxwfreu/HNHiring"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="static/images/github.png" />
              </a>
            </div>
            <div className="filter-item-wrappers">
              {this.state.filters.map((filter, index) => (
                <div className="filter-item" key={filter}>
                  {filter}
                  <button style={styling} onClick={() => this.deleteFilter(index)} />
                </div>
              ))}
            </div>
          </div>
          <div className="list-wrapper">
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={this.state.filteredListings.length}
                rowHeight={this.cache.rowHeight}
                rowRenderer={this.renderRow}
                deferredMeasurementCache={this.cache}
                overscanRowCount={3}
              />
            )}
          </AutoSizer>
          </div>
        </div>
      </Main>
    )
  }
}
