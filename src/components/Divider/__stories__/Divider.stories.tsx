import React from 'react'
import { DividerProps, Divider, dividerColors } from '@/index'

export default {
  title: 'Divider'
}

export const DividerNormal = () => {
  return (
    <div style={{ padding: '3rem' }}>
      <Divider color={'purple' as DividerProps['color']} />
    </div>
  )
}

export const DividerColors = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '3rem' }}>
      {Object.keys(dividerColors).map((color) => {
        return (
          <div key={color}>
            <Divider color={color as DividerProps['color']} />
          </div>
        )
      })}
    </div>
  )
}
