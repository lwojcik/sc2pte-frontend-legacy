import React from 'react';
import PropTypes from 'prop-types';

import LoadingPrompt from '../LoadingPrompt/LoadingPrompt';
import ViewerError from '../ViewerError/ViewerError';

const MessageToDisplay = ({ status }) => {
  switch (status) {
    case 'loading':
      return (
        <LoadingPrompt message="Loading player data..." />
      );
    case 'not_found':
      return (
        <ViewerError
          emote="¯\_(ツ)_/¯"
          message="StarCraft II profile not found. Make sure the extension is configured properly in your Twitch dashboard."
        />
      );

    case 'error':
      return (
        <ViewerError
          emote="(╯°□°）╯︵ ┻━┻"
          message="Ooops! We couldn't fetch your StarCraft II stats. Please check again later."
        />
      );

    default:
      return (
        <ViewerError
          emote="(・_・;)"
          message="Ooops, this shouldn't happen!"
        />
      );
  }
};

const ViewerPanelMessage = ({ status }) => (
  <MessageToDisplay status={status} />
);

ViewerPanelMessage.propTypes = {
  status: PropTypes.oneOf(['loading', 'not_found', 'error']),
};

ViewerPanelMessage.defaultProps = {
  status: 'error',
};

export default ViewerPanelMessage;
