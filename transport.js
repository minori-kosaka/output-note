// デプロイと保存テスト完了後に、その新規GASのURLを設定する。
// 既存のGAS_ENDPOINTを流用しない。旧バックエンドは新しい項目を保存できない。
window.SURVEY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwTsdzAkhYx96Ct40Uf3kG3AZJcuRoE89wR_fiDV-0lt9ceLvl3S00RCxKRr6Qotnfnvw/exec';

function surveyAck(endpoint, id) {
  return new Promise((resolve,reject)=>{
    const callback='surveyAck_'+crypto.randomUUID().replaceAll('-','_');
    const script=document.createElement('script');
    const timer=setTimeout(()=>{cleanup();reject(new Error('Ack timeout'));},8000);
    function cleanup(){clearTimeout(timer);script.remove();delete window[callback];}
    window[callback]=result=>{cleanup();if(result&&result.submissionId===id)resolve(result.saved===true);else reject(new Error('Invalid acknowledgement'));};
    script.onerror=()=>{cleanup();reject(new Error('Ack unavailable'));};
    const url=new URL(endpoint);url.searchParams.set('callback',callback);url.searchParams.set('submissionId',id);script.src=url.href;
    document.head.append(script);
  });
}

async function sendSurvey(payload) {
  const endpoint=window.SURVEY_ENDPOINT;
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint))throw new Error('NOT_CONFIGURED');
  // 通信完了は成功と扱わず、書き込まれたsubmissionIdを別途確認する。
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try {
    await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),signal:controller.signal});
  } catch(error) {
    // タイムアウトでも保存済みの場合があるので確認を続ける。
  } finally {clearTimeout(timer);}
  for(let attempt=0;attempt<3;attempt++) {
    try{if(await surveyAck(endpoint,payload.submissionId))return;}catch(error){}
    if(attempt<2)await new Promise(resolve=>setTimeout(resolve,1000));
  }
  throw new Error('SAVE_UNCONFIRMED');
}

