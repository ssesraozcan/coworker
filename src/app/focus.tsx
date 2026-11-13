import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Button, Label, Nav, Scene, styles } from '../components/ui';
import { useGame } from '../state/store';
import { remaining } from '../state/model';
export default function Focus() {
 const safe=useSafeAreaInsets(),{state,update}=useGame(),[,tick]=useState(0),[sound,setSound]=useState<'rain'|'sea'|'off'>('off');
 const rain=useAudioPlayer(require('../../assets/audio/rain.wav')),sea=useAudioPlayer(require('../../assets/audio/sea.wav'));
 const session=state.session;const seconds=session?remaining(session):0; const activeDeadline=session?.deadline;
 useEffect(()=>{setAudioModeAsync({playsInSilentMode:true}).catch(()=>{});const id=setInterval(()=>tick(n=>n+1),500);return()=>clearInterval(id)},[]);
 // Expo Audio exposes mutable native-player properties by design.
 // eslint-disable-next-line react-hooks/immutability
 useEffect(()=>{rain.loop=true;sea.loop=true;rain.volume=.3;sea.volume=.3;rain.pause();sea.pause();if(activeDeadline){if(sound==='rain')rain.play();if(sound==='sea')sea.play()}return()=>{rain.pause();sea.pause()}},[sound,activeDeadline,rain,sea]);
 function pause(){update(s=>s.session?{...s,session:s.session.deadline?{...s.session,remaining:remaining(s.session),deadline:null}:{...s.session,deadline:Date.now()+s.session.remaining*1000}}:s)}
 return <Scene image="desk"><View style={[styles.top,{top:Math.max(safe.top,44)}]}><View style={[styles.panel,{flex:1,padding:13}]}><Label size={10} bold>ŞU AN ÇALIŞTIĞIM</Label><Label size={15} bold>{session?.goal||'Oturum tamamlandı'}</Label></View></View><View style={[styles.bottomPanel,{bottom:Math.max(safe.bottom,12)+84}]}>{session?<View style={styles.panel}><View style={[styles.row,{justifyContent:'space-between'}]}><View><Label size={11}>Kalan süre</Label><Label size={32} bold style={{fontVariant:['tabular-nums']}}>{Math.floor(seconds/60).toString().padStart(2,'0')}:{(seconds%60).toString().padStart(2,'0')}</Label></View><Button onPress={pause} style={{minWidth:140}}>{session.deadline?'Duraklat':'Devam et'}</Button></View><View style={styles.row}>{(['off','rain','sea'] as const).map(k=><Pressable key={k} accessibilityRole="button" onPress={()=>setSound(k)} style={{padding:9,borderRadius:12,backgroundColor:sound===k?'#E1E7BD':'#F0E5D1'}}><Label size={12}>{k==='off'?'Sessiz':k==='rain'?'Yağmur':'Deniz'}</Label></Pressable>)}</View><Pressable accessibilityRole="button" onPress={()=>{update(s=>({...s,session:null}));router.replace('/home')}}><Label size={12} style={{textAlign:'center'}}>Oturumu bitir · Ödül kazanılmaz</Label></Pressable></View>:<View style={styles.panel}><Label size={24} bold>{state.records.length?'Emeğine sağlık!':'Çalışmaya hazır mısın?'}</Label><Label>{state.records.length?'Tamamladığın oturum için 25 yaprak kazandın.':'Evinden bir hedef ve süre seçerek başlayabilirsin.'}</Label><Button onPress={()=>router.replace('/home')}>Evime dön</Button></View>}</View><Nav/></Scene>;
}
