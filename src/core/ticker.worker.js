const fps = 60;
const timePerFrame = 1000/fps;

self.addEventListener('message', function(e){
    if(e.data.action === 'start'){
        setInterval(()=>{
            self.postMessage('render');
        }, timePerFrame);
    }
});







