import React, { Component } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

class Chart extends Component {
  render() {
    const { tickers } = this.props
    // const aaaaapl = (tickers.filter(ticker => ticker.s === 'AAPL')[0] || {}).p
    // console.log('aaaaaaaaaapl', aaaaapl)
    const data = [
      { AAPL: (tickers.filter(ticker => ticker.s === 'AAPL')[0] || {}).v },
      { FB: (tickers.filter(ticker => ticker.s === 'FB')[0] || {}).v },
      { NFLX: (tickers.filter(ticker => ticker.s === 'NFLX')[0] || {}).v },
    ]

    const getColor = (itemName) => {
      switch (itemName) {
        case 'NFLX': return '#EF0036';
        case 'AAPL': return '#F1EAEB';
      default: return '#335BFF';
      }
    }

    return (
      <ResponsiveContainer height={350}>
        <BarChart
          data={data}
        >
          <CartesianGrid strokeDasharray='1 3' />
          <XAxis dataKey='date' />
          <YAxis />
          {['AAPL', 'FB', 'NFLX'].map(item => (
            <Bar
              key={item}
              stackId={item}
              type='monotone'
              barSize={20}
              dataKey={item}
              fill={getColor(item)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

export default Chart
