import React, { Component} from 'react';
import stylesheet from '../styles/styles.scss';
import Head from 'next/head';

export default class Main extends React.Component {
  render() {
    return (
      <div className="flex-body">
        <Head>
          <title>HNHiring</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <meta
            hid="description"
            name="description"
            content="A UI showing all hacker news job listings"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans"
            rel="stylesheet"
          />
        </Head>
        {this.props.children}
      </div>
    );
  }
}