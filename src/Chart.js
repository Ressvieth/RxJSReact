import React, { Component } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

class Chart extends Component {
  parseDate = (timestap) => {
    const date = new Date(timestap * 1e3).toLocaleDateString().slice(0, -5)
    const time = new Date(timestap * 1e3).toLocaleTimeString().slice(0, -3)
    return `${date} ${time}`
  }

  render() {
    const { candleData } = this.props
    const data = candleData.c.map(c => ({ c }))
    data.forEach((obj, i) => obj.t = this.parseDate(candleData.t[i]))

    return (
      <AreaChart
        width={800}
        height={400}
        data={data}
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
      <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="c" stroke="#8884d8" fill="#E436E1" />
      </AreaChart>
    )
  }
}

export default Chart
