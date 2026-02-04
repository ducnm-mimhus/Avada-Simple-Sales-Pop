import React, {forwardRef} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Render a link with react-router-dom
 * Wrapped with forwardRef to fix "Function components cannot be given refs" warning
 *
 * @param {object} props
 * @param {any} ref
 * @return {React.ReactElement}
 */
const ReactRouterLink = forwardRef(function ReactRouterLink({children, url = '', ...rest}, ref) {
  if (isOutboundLink(url) || rest.download || rest.external) {
    if (rest.external) {
      const {external, ...cleanRest} = rest;
      return (
        <a ref={ref} href={url} target="_blank" rel="noreferrer noopener" {...cleanRest}>
          {children}
        </a>
      );
    }

    return (
      <a ref={ref} href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={url} ref={ref} {...rest}>
      {children}
    </Link>
  );
});

ReactRouterLink.propTypes = {
  children: PropTypes.node,
  url: PropTypes.string.isRequired
};

export default ReactRouterLink;

/**
 * Check is outbound link or not
 * @param {string} url
 * @return {boolean}
 */
function isOutboundLink(url) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/.test(url);
}
