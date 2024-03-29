

const E=document.getElementById.bind(document);

function go(method='GET'){
  if(!E('urlInput').value)return;
  let url=new URL(E('urlInput').value);
  let args=E('urlParamsInput').value.trim();
  let body=E('bodyInput').value.trim();
  let options={method};
  if(args){
    args.split('\n').forEach(arg=>{
      let [k,v]=arg.split(':');
      url.searchParams.append(k.trim(),v.trim());
    });
  }
  if(body && (method==='POST'||method==='PATCH'||method==='PUT')){
    let obj={};
    body.split('\n').forEach(arg=>{
      let [k,v]=arg.split(':');
      try{
        obj[k]=JSON.parse(v.trim());
      }catch(err){
        obj[k]=v.trim();
      }
    });
    options.body=JSON.stringify(obj);
    options.headers={
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }
  fetch(url,options)
  .then(r=>{
    E('response').innerText=`Fetching:\n${r.url}\n${JSON.stringify(r.headers,null,2)}\nStatus: ${r.status} ${r.statusText}`;
    return r.ok?r.text():'';
  })
  .then(txt=>{
    try{
      o=JSON.parse(txt);
      txt=JSON.stringify(o,null,2);
    }catch(err){
    }
    E('output').innerText=txt;
  })
  .catch(err=>{
    console.log(err);
    E('output').innerText='ERROR:\n'+err;
  })
}

E('getBtn').addEventListener('click',()=>go('GET'));
E('postBtn').addEventListener('click',()=>go('POST'));
E('patchBtn').addEventListener('click',()=>go('PATCH'));
E('putBtn').addEventListener('click',()=>go('PUT'));
E('deleteBtn').addEventListener('click',()=>go('DELETE'));

