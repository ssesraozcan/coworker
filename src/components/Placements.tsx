import React, { useMemo, useState } from 'react';
import { Animated, PanResponder, useWindowDimensions } from 'react-native';
import { useGame } from '../state/store';
import { Placement } from '../state/model';
import { ItemImage } from './ui';
function Prop({ value, editable }: { value: Placement; editable: boolean }) {
  const { width, height } = useWindowDimensions(), { update } = useGame();
  const [position] = useState(() => new Animated.ValueXY());
  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => editable,
    onMoveShouldSetPanResponder: () => editable,
    onPanResponderMove: (_, g) => position.setValue({ x: g.dx, y: g.dy }),
    onPanResponderRelease: (_, g) => {
      update(s => ({ ...s, placements: s.placements.map(q => q.id === value.id ? { ...q, x: Math.min(.87, Math.max(.12, value.x + g.dx / width)), y: Math.min(.7, Math.max(.18, value.y + g.dy / height)) } : q) }));
      position.setValue({ x: 0, y: 0 });
    },
    onPanResponderTerminate: () => position.setValue({ x: 0, y: 0 }),
  }), [editable, position, update, value, width, height]);
  return <Animated.View accessibilityLabel={`${value.item}, ${editable ? 'sürükleyerek yerleştir' : 'yerleştirilmiş eşya'}`} {...pan.panHandlers} style={{ position: 'absolute', left: value.x * width - 36, top: value.y * height - 36, transform: position.getTranslateTransform(), borderWidth: editable ? 1 : 0, borderStyle: 'dashed', borderColor: '#FFF4E2', borderRadius: 10 }}><ItemImage item={value.item} size={72}/></Animated.View>;
}
export function Placements({ area, editable = false }: { area: Placement['area']; editable?: boolean }) { const { state } = useGame(); return <>{state.placements.filter(p => p.area === area).map(p => <Prop key={`${p.id}:${editable}`} value={p} editable={editable}/>)}</>; }
