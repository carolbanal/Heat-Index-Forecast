// ConfusionMatrixIcon.tsx
import React from 'react';
import { SvgXml } from 'react-native-svg';

const ConfusionMatrixIcon = () => (
    <SvgXml
        xml={`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
      <path d="M280-280h160v-160H280v160Zm240 0h160v-160H520v160ZM280-520h160v-160H280v160Zm240 0h160v-160H520v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
    </svg>`}
        width="24"
        height="24"
    />
);

export default ConfusionMatrixIcon;