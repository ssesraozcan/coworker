import React, { useCallback, useEffect, useState } from 'react';
import { Animated, ImageBackground, ScrollView, View, AccessibilityInfo, Easing, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Copy, d, GameButton, theme, Vector } from '../features/design';
import { islands } from '../features/assets';
const houses = [require('../../assets/figma/94d00.svg'),require('../../assets/figma/8174e.svg'),require('../../assets/figma/7b7df.svg'),require('../../assets/figma/a0c58.svg')];
function NewHouse({index,reduced,play,onReady}:{index:number;reduced:boolean|null;play:boolean;onReady:(index:number)=>void}) {
  const [scale] = useState(() => new Animated.Value(0));
  const onLoad=useCallback(()=>onReady(index),[index,onReady]);
  useEffect(()=>{
    scale.stopAnimation();
    if(reduced===true){scale.setValue(1);return;}
    scale.setValue(0);
    if(!play||reduced===null)return;
    const native=Platform.OS!=='web';
    const animation=Animated.sequence([
      Animated.delay(350+index*220),
      Animated.timing(scale,{toValue:1.3,duration:260,easing:Easing.out(Easing.cubic),useNativeDriver:native}),
      Animated.timing(scale,{toValue:.9,duration:160,easing:Easing.inOut(Easing.quad),useNativeDriver:native}),
      Animated.timing(scale,{toValue:1.07,duration:140,useNativeDriver:native}),
      Animated.timing(scale,{toValue:1,duration:140,useNativeDriver:native}),
    ]);
    animation.start();
    return ()=>animation.stop();
  },[scale,index,play,reduced]);
  return <Animated.View testID={`new-house-${index+1}`} style={{position:'absolute',left:([10.6,25.7,65.9,81][index]+'%') as `${number}%`,top:'48%',width:34,height:41,opacity:scale.interpolate({inputRange:[0,.1,1.3],outputRange:[0,1,1],extrapolate:'clamp'}),transform:[{scale}]}}><Vector asset={houses[index]} size={34} onLoad={onLoad}/></Animated.View>;
}
export default function Success(){
  const safe=useSafeAreaInsets(),[reduced,setReduced]=useState<boolean|null>(null),[loaded,setLoaded]=useState<number[]>([]),[sceneReady,setSceneReady]=useState(false),[visit,setVisit]=useState(0);
  useFocusEffect(useCallback(()=>{setLoaded([]);setVisit(n=>n+1);},[]));
  const houseReady=useCallback((index:number)=>setLoaded(previous=>previous.includes(index)?previous:[...previous,index]),[]);
  useEffect(()=>{let active=true;AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(active)setReduced(value)}).catch(()=>{if(active)setReduced(true)});const sub=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced);return()=>{active=false;sub.remove()};},[]);
  return <View style={{flex:1,backgroundColor:theme.bg}}><ScrollView contentContainerStyle={{flexGrow:1,padding:22,paddingTop:Math.max(safe.top,44)+56,paddingBottom:Math.max(safe.bottom,34)+16,gap:20}}><Copy title size={31}>Yeni dostlara{'\n'}yer açıldı.</Copy><Copy style={d.muted}>Kıyı adasının kapasitesi artık 12 kişi.</Copy><ImageBackground source={islands[7]} onLoadEnd={()=>setSceneReady(true)} resizeMode="cover" imageStyle={{borderRadius:22,width:'100%',height:'100%'}} style={{height:250,overflow:'hidden',borderRadius:22}}>{houses.map((_,i)=><NewHouse key={`${visit}-${i}`} index={i} reduced={reduced} play={sceneReady&&loaded.length===4} onReady={houseReady}/>)}</ImageBackground><Copy title size={24} style={{color:theme.teal}}>+4 yeni ev</Copy><Copy size={12} style={d.muted}>Adan artık 12 kişilik. Arkadaşlarını davet et.</Copy><Copy size={11} style={d.muted}>Demo kapasite yükseltmesi · Gerçek ödeme yapılmadı.</Copy><View style={{flex:1,minHeight:20}}/><GameButton onPress={()=>router.replace('/invite')}>Arkadaş davet et</GameButton></ScrollView></View>;
}
