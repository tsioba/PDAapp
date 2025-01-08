import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

const ArrowDownIcon = ({ width = 32, height = 32, fill = '#e2e8ce' }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill={fill}
  >
    <G data-name="93-Arrow Down">
      <Path d="M16 0a16 16 0 1 0 16 16A16 16 0 0 0 16 0zm0 30a14 14 0 1 1 14-14 14 14 0 0 1-14 14z" />
      <Path d="m16 19.59-7.29-7.3-1.42 1.42 8 8a1 1 0 0 0 1.41 0l8-8-1.41-1.41z" />
    </G>
  </Svg>
);

export default ArrowDownIcon;
