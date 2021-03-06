import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import indigo from 'material-ui/colors/indigo'
import teal from 'material-ui/colors/teal'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/typography'
import { SmallDesignCard } from './small-design-card'
import { CircularProgress } from 'material-ui/Progress'
import { SearchBar } from './search-bar'
import { search, mock_search, mock_object } from './api'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      designObjects: mock_search().results,
      searchInProgress: false,
      searchError: ''
    }
  }

  searchObjects = (
    query = '',
    availability = 'for_sale',
    type = 'all',
    sortBy = 'classic'
  ) => {
    this.setState({ searchInProgress: true })
    search(query, availability, type, sortBy)
      .then(response => {
        this.setState({
          designObjects: response.results,
          searchInProgress: false,
          searchError: ''
        })
      })
      .catch(err => {
        this.setState({
          designObjects: [],
          searchError: err.message,
          searchInProgress: false
        })
      })
  }

  errorMessage = () => {
    if (this.state.searchError !== '') {
      return (
        <Typography variant="headline" color="error">
          {`Sorry an error occured: ${this.state.searchError}`}
        </Typography>
      )
    }
    if (this.state.designObjects.length == 0) {
      return (
        <Typography variant="display1">
          {'Sorry no results found, try another term'}
        </Typography>
      )
    }
  }

  render() {
    const { designObjects, searchInProgress, searchError } = this.state
    return (
      <React.Fragment>
        <SearchBar handleSearch={this.searchObjects} />
        {searchInProgress ? (
          <CircularProgress style={{ position: 'fixed' }} />
        ) : null}
        <Grid
          container
          spacing={24}
          style={{ margin: '0 auto 0 auto', width: '80vw' }}
          justify="space-around"
          alignments="center"
        >
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            {this.errorMessage()}
          </Grid>
          {designObjects.map((designObject, index) => (
            <SmallDesignCard designObject={designObject} key={index} />
          ))}
        </Grid>
      </React.Fragment>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('container'))
