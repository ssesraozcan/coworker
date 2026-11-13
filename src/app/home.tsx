import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Nav, Pill, Scene, styles } from '../components/ui';
import { Placements } from '../components/Placements';
import { useGame } from '../state/store';
export default function Home() { const safe=useSafeAreaInsets(),{state,update}=useGame(),[minutes,setMinutes]=useState(25),[goal,setGoal]=useState('Matematik · Türev / 20 soru'); function start(){if(!state.session)update(s=>({...s,session:{id:`session-${Date.now()}`,duration:minutes*60,remaining:minutes*60,deadline:Date.now()+minutes*60000,goal:goal.trim()||'Kendime zaman ayırıyorum',shared:false}}));router.push('/focus');}return <Scene image="home"><Placements area="home"/><View style={[styles.top,{top:Math.max(safe.top,44)}]}><Pill>Evim</Pill><Pill>♧ {state.leaves} yaprak</Pill></View><View style={[styles.bottomPanel,{bottom:Math.max(safe.bottom,12)+84,gap:10}]}><View style={{alignItems:'flex-end'}}><Pill onPress={()=>router.push('/decorate')}>Evimi düzenle</Pill></View><View style={styles.panel}><TextInput accessibilityLabel="Çalışma hedefin" style={styles.input} value={goal} onChangeText={setGoal} maxLength={90} placeholder="Neye odaklanacaksın?"/><View style={styles.row}>{[15,25,50].map(n=><Pill key={n} onPress={()=>setMinutes(n)}>{minutes===n?'● ':''}{n} dk</Pill>)}</View><Button onPress={start}>{state.session?'Oturumuma dön':'Odaklanmaya başla'}</Button></View></View><Nav/></Scene>; }
