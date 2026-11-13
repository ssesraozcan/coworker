import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Label, Nav, Pill, Scene, styles } from '../components/ui';
import { Placements } from '../components/Placements';
import { useGame } from '../state/store';
export default function Island() { const safe = useSafeAreaInsets(), { state } = useGame(), [info, setInfo] = useState(false); return <Scene image="island"><Placements area="island"/><View style={[styles.top,{top:Math.max(safe.top,44)}]}><Pill onPress={()=>setInfo(true)}>Kıyı adası</Pill><Pill>♧ {state.leaves} yaprak</Pill></View><View style={{position:'absolute',bottom:safe.bottom+102,left:24,right:24}}><Button onPress={()=>router.push('/home')}>Çalışma köşeme git</Button></View><Nav/><Modal visible={info} transparent animationType="fade" onRequestClose={()=>setInfo(false)}><View style={{flex:1,backgroundColor:'#15281788',justifyContent:'center',padding:24}}><View style={styles.panel}><Label size={24} bold>Senin küçük adan</Label><Label>Çalış, yaprak kazan ve evini güzelleştir. Eşyalarını ortak adaya ödünç verebilirsin.</Label><Label>Bu ilk sürüm tek cihazda çalışır. Arkadaş daveti ve canlı ortak oturumlar sonraki aşamada bağlanacak.</Label><Button onPress={()=>setInfo(false)}>Adaya dön</Button></View></View></Modal></Scene>; }
