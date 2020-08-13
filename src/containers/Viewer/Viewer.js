import React, { Component } from 'react';

import getViewerData from '../../helpers/viewer';
import { getTwitchAuth } from '../../helpers/shared';
import { getFromLocalStorage, saveToLocalStorage } from '../../helpers/clientStorage';

import ViewerPanel from '../../components/ViewerPanel/ViewerPanel';
import ViewerPanelWrapper from '../../components/ViewerPanelWrapper/ViewerPanelWrapper';
import ViewerPanelMessage from '../../components/ViewerPanelMessage/ViewerPanelMessage';

const localStorageId = process.env.REACT_APP_LOCALSTORAGE_ID;

const getUniqueLocalStorageId = channelId => `${localStorageId}-${channelId}`;

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      status: 'loading',
      player: {
        server: '',
        name: '',
        clan: {
          name: '',
          tag: '',
        },
        rank: '',
        portrait: '',
      },
      ladders: {
        '1v1': {
          totalLadders: 0,
          topRankId: -1,
          topRank: '',
          topMMR: 0,
          wins: 0,
          losses: 0,
          ties: 0,
        },
        archon: {
          totalLadders: 0,
          topRankId: -1,
          topRank: '',
          topMMR: 0,
          wins: 0,
          losses: 0,
          ties: 0,
        },
        '2v2': {
          totalLadders: 0,
          topRankId: -1,
          topRank: '',
          topMMR: 0,
          wins: 0,
          losses: 0,
          ties: 0,
        },
        '3v3': {
          totalLadders: 0,
          topRankId: -1,
          topRank: '',
          topMMR: 0,
          wins: 0,
          losses: 0,
          ties: 0,
        },
        '4v4': {
          totalLadders: 0,
          topRankId: -1,
          topRank: '',
          topMMR: 0,
          wins: 0,
          losses: 0,
          ties: 0,
        },
      },
    };
  }

  componentDidMount() {
    getTwitchAuth(async (auth) => {
      const { channelId, token } = auth;
      const updateInterval = process.env.REACT_APP_UPDATE_INTERVAL;
      this.populateStateWithCachedData(channelId);
      this.getViewerData(channelId, token);
      this.setUpdateInterval(channelId, token, updateInterval);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { status } = this.state;
    if (status === 'ready' && nextState.status !== 'ready') {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setUpdateInterval(channelId, token, interval) {
    this.interval = setInterval(() => this.getViewerData(channelId, token), interval);
  }

  async getViewerData(channelId, token) {
    try {
      const viewerData = await getViewerData(channelId, token);
      let viewerState;

      switch (viewerData.status) {
        case 200:
          if (viewerData.player.hasOwnProperty.call(viewerData.player, 'name') === false) {
            viewerState = {
              isLoaded: false,
              status: 'error',
            };
            this.setState(viewerState);
          } else {
            viewerState = {
              isLoaded: true,
              status: 'ready',
              player: viewerData.player,
              ladders: viewerData.ladders,
            };
            this.setState(viewerState);
            this.cacheStateToLocalStorage(channelId, JSON.stringify(viewerState));
          }
          break;
        case 404:
          viewerState = {
            isLoaded: false,
            status: 'not_found',
          };
          this.setState(viewerState);
          break;
        case 500:
          this.populateStateWithCachedData();
          break;
        default:
          viewerState = {
            isLoaded: false,
            status: 'error',
          };
      }
    } catch (e) {
      this.populateStateWithCachedData(channelId);
    }
  }


  getCachedData = (channelId) => {
    const isCacheEnabled = this.checkIfLocalStorageCacheIsOn();
    const uniqueLocalStorageId = getUniqueLocalStorageId(channelId);

    if (isCacheEnabled) {
      const serializedCachedData = getFromLocalStorage(uniqueLocalStorageId);
      if (serializedCachedData) {
        const cachedDataObject = JSON.parse(serializedCachedData);
        return cachedDataObject;
      }
      return null;
    }
    return null;
  }

  checkIfLocalStorageCacheIsOn = () => {
    const enableLocalStorageCache = process.env.REACT_APP_ENABLE_LOCALSTORAGE_CACHE;
    const isCacheEnabled = enableLocalStorageCache.toLowerCase() === 'true';
    if (isCacheEnabled) {
      return true;
    }
    return false;
  }

  cacheStateToLocalStorage = (channelId, data) => {
    const isCacheEnabled = this.checkIfLocalStorageCacheIsOn();
    const uniqueLocalStorageId = getUniqueLocalStorageId(channelId);
    if (isCacheEnabled) {
      saveToLocalStorage(uniqueLocalStorageId, data);
    }
  }

  populateStateWithCachedData(channelId) {
    const isCacheEnabled = this.checkIfLocalStorageCacheIsOn();
    if (isCacheEnabled) {
      const cachedData = this.getCachedData(channelId);
      if (cachedData) {
        this.setState(cachedData);
      } else {
        this.setState({
          isLoaded: false,
          status: 'loading',
        });
      }
    }
  }

  render() {
    const {
      status,
      isLoaded,
      player,
      ladders,
    } = this.state;

    return (
      <ViewerPanelWrapper>
        {isLoaded
          ? <ViewerPanel playerData={player} ladderData={ladders} />
          : <ViewerPanelMessage status={status} /> }
      </ViewerPanelWrapper>
    );
  }
}

export default Viewer;
