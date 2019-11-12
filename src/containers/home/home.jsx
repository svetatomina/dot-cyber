import React, { PureComponent } from 'react';
import { Button, Input, Pane, SearchItem, Text } from '@cybercongress/gravity';
import { Electricity } from './electricity';
import { getIpfsHash, search, getRankGrade } from '../../utils/search/utils';
import { formatNumber } from '../../utils/utils';

const tilde = require('../../image/tilde.svg');

// const grade = {
//   from: 0.0001,
//   to: 0.1,
//   value: 4
// };

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      valueSearchInput: '',
      result: false,
      searchResults: []
    };
  }

  onChangeInput = async e => {
    const { value } = e.target;
    if (value.length === 0) {
      await this.setState({
        result: false
      });
    }
    await this.setState({
      valueSearchInput: value
    });
  };

  handleKeyPress = async e => {
    const { valueSearchInput } = this.state;
    if (e.key === 'Enter') {
      let searchResults = [];
      searchResults = await search(await getIpfsHash(valueSearchInput));
      searchResults.map((item, index) => {
        searchResults[index].cid = item.cid;
        searchResults[index].rank = formatNumber(item.rank, 6);
        searchResults[index].grade = getRankGrade(item.rank);
      });
      console.log('searchResults', searchResults);
      this.setState({
        searchResults,
        result: true
      });
    }
  };

  render() {
    const { valueSearchInput, result, searchResults } = this.state;

    const searchItems = searchResults.map(item => (
      <SearchItem
        key={item.cid}
        hash={item.cid}
        rank={item.rank}
        grade={item.grade}
        status="success"
        // onClick={e => (e, links[cid].content)}
      >
        {item.cid}
      </SearchItem>
    ));

    return (
      <main className="block-body-home">
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={result ? 0.3 : 0.7}
          transition="flex 0.5s"
        >
          <Input
            width="60%"
            placeholder="joint for validators"
            value={valueSearchInput}
            onChange={e => this.onChangeInput(e)}
            onKeyPress={this.handleKeyPress}
          />
        </Pane>

        {result && (
          <Pane width="90%" marginX="auto" marginY={0} display="flex" flexDirection="column">
            <Text fontSize="20px" marginBottom={20} color="#949292" lineHeight="20px">
              {`The answer for ${searchItems.length} is`}
            </Text>
            <Pane>{searchItems}</Pane>
          </Pane>
        )}
        {!result && (
          <Pane
            flex={0.3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-around"
          >
            <Pane width="60%" marginY={0} marginX="auto">
              <Electricity />
            </Pane>
            <a href="https://cybercongress.ai" target="_blank">
              <img style={{ width: 20, height: 20 }} src={tilde} alt="tilde" />
            </a>
          </Pane>
        )}
      </main>
    );
  }
}

export default Home;
