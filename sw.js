console.log('hey');
self.addEventListener('install', evt =>{
    console.log('install', evt);   
})
self.addEventListener('activate', evt =>{
    console.log('activate', evt);   
})
self.addEventListener('fetch', evt=>{
    console.log('fetch', evt.request.url);
})