/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { ReactSearchKit } from './ReactSearchKit';
import { configureStore } from '../../store';
import { UrlHandlerApi } from '../../api';

jest.mock('../Bootstrap', () => {
  return {
    Bootstrap: () => {},
  };
});

jest.mock('../../store', () => ({
  configureStore: jest.fn(),
}));

// const mockUrlHandlerApi = jest.fn();
jest.mock('../../api');
// , () => {
//   return {
//     UrlHandlerApi: mockUrlHandlerApi,
//   };
// });

beforeEach(() => {
  UrlHandlerApi.mockClear();
});

const searchApi = new (class {})();

describe('test ReactSearchKit component', () => {
  it('should use default configuration', () => {
    const rsk = shallow(<ReactSearchKit searchApi={searchApi} />);

    const mockUrlHandlerApi = new UrlHandlerApi();
    expect(configureStore).toBeCalledWith(
      expect.objectContaining({
        searchApi: searchApi,
        urlHandlerApi: mockUrlHandlerApi,
      })
    );
    expect(UrlHandlerApi.mock.calls[0]).toMatchObject({});
    expect(rsk.historyListen).toBe(undefined);
  });

  it('should use disable UrlHandlerApi when enabled value if false', () => {
    shallow(
      <ReactSearchKit
        searchApi={searchApi}
        urlHandlerApi={{ enabled: false }}
      />
    );

    expect(configureStore).toBeCalledWith(
      expect.objectContaining({
        searchApi: searchApi,
        urlHandlerApi: null,
        defaultSortByOnEmptyQuery: null,
      })
    );

    shallow(
      <ReactSearchKit
        searchApi={searchApi}
        urlHandlerApi={{ enabled: false, customHandler: new (class {})() }}
      />
    );

    expect(configureStore).toBeCalledWith(
      expect.objectContaining({
        searchApi: searchApi,
        urlHandlerApi: null,
      })
    );
  });

  it('should use inject extra config to UrlHandlerApi', () => {
    shallow(
      <ReactSearchKit
        searchApi={searchApi}
        urlHandlerApi={{
          enabled: true,
          overrideConfig: {
            some: 'value',
          },
        }}
      />
    );

    const mockUrlHandlerApi = new UrlHandlerApi();
    expect(configureStore).toBeCalledWith(
      expect.objectContaining({
        searchApi: searchApi,
        urlHandlerApi: mockUrlHandlerApi,
      })
    );
    expect(UrlHandlerApi.mock.calls[0][0]).toMatchObject({
      some: 'value',
    });
  });

  it('should use custom class for UrlHandlerApi when provided', () => {
    const mockedCustomUrlHandlerApi = new (class {})();
    shallow(
      <ReactSearchKit
        searchApi={searchApi}
        urlHandlerApi={{
          enabled: true,
          customHandler: mockedCustomUrlHandlerApi,
        }}
      />
    );

    expect(configureStore).toBeCalledWith(
      expect.objectContaining({
        searchApi: searchApi,
        urlHandlerApi: mockedCustomUrlHandlerApi,
      })
    );
  });

  it('should use inject defaultSortByOnEmptyQuery in the configuration', () => {
    shallow(
      <ReactSearchKit searchApi={searchApi} defaultSortByOnEmptyQuery="value" />
    );

    expect(configureStore).toBeCalledWith(
      expect.objectContaining({
        searchApi: searchApi,
        defaultSortByOnEmptyQuery: 'value',
      })
    );
  });

  it('should inject configuration to Bootstrap when provided', () => {
    const historyListen = () => {};
    const historyFunc = {
      listen: historyListen,
    };
    const rsk = shallow(
      <ReactSearchKit
        searchApi={searchApi}
        searchOnInit={false}
        history={historyFunc}
      />
    );
    const cmp = rsk.childAt(0);
    expect(cmp.prop('searchOnInit')).toBe(false);
    expect(cmp.prop('historyListen')).toBe(historyListen);
  });
});
