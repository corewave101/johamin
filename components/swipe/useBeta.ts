import { useEffect, useState } from 'react';
import { betaOn, onBetaChange } from '../../lib/beta';

/** True while 베타 테스트 is on for this device. */
export function useBeta() {
  const [on, setOn] = useState(betaOn);
  useEffect(() => onBetaChange(setOn), []);
  return on;
}
