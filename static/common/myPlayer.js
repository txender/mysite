class MyPlayer {


    constructor() {
        this.init();
        this.socket=this.init_Websocket(this);
        this.link_eventListener_to_audio();
        console.info(this.musiclist)
    }
    init(){
        this.musiclist=new Array();
        this.socket=null;
        this.buffer_recent=null;
        this.currentplaysong_inlist=0;
        this.audio=document.querySelector("#myplayer");
    }
    link_eventListener_to_audio(){
        this.audio.addEventListener('error',(e)=>{
            console.info("this is error event");
            this.buffer(this.currentplaysong_inlist);
           // this.buffer(this.currentplaysong_inlist)
            //this.buffer_recent=true;
        });
        this.audio.addEventListener('ended',(e) => {
            this.next()
        });
        this.audio.addEventListener('durationchange',(e)=>{
            //this.currentsong_duration=this
        });
        this.audio.addEventListener('timeupdate',(e)=>{
           //
        });
        this.audio.addEventListener('canplaythrough',(e)=>{
            this.buffer(this.currentplaysong_inlist+1);
            console.info("this is play event,music"+this
                .currentplaysong_inlist.toString()+"完成加载,开始加载下一首");
        });
    }
    buffer(song_index_list){
        let message={"order":"buffer","data":song_index_list};
        let message_json=JSON.stringify(message);
        if(typeof(this.socket)=="undefined") {
            this.socket = this.init_Websocket(this);
        }
        this.socket.send(message_json);
    }
    init_Websocket(player){
        var playerSocket=new WebSocket(
            'ws://'
            + window.location.host
            + '/playersocket/'
        );
        playerSocket.onopen=function () {

        }
        playerSocket.onclose=function () {

        }
        playerSocket.onclose=function () {

        }
        playerSocket.onmessage=function (e) {

            let message = JSON.parse(e.data);
            player.parse_message_exc(message);
        }

        return playerSocket;
    }

    parse_message_exc(raw_message){
        if(raw_message.type=="song_list"){
           for(let i in raw_message.song_list){
               this.musiclist.push(raw_message.song_list[i]);
           }

        }else if(raw_message.type=="message"){
            console.info(raw_message.message);
            if(raw_message["message"]=="finish_buffer"){
                if(raw_message["finish_buffer"]==this.currentplaysong_inlist){
                    this.update_play()
                }
            }else if(raw_message["message"]=="error"){
                if(raw_message["error"]==this.currentplaysong_inlist){
                    this.next()
                }
            }

        }

    }

    play(){
        if(this.audio.paused){

            this.audio.play();
        }
    }
    pause(){
        if(!this.audio.paused){
            this.audio.pause();
        }
    }

    update_play(){
        let file_name=this.musiclist[this.currentplaysong_inlist].title+"-"+this.musiclist[this.currentplaysong_inlist].singer;
        this.audio.src="/static/media/"+file_name+".mp3";
        this.audio.play()
    }

    switch(index_songlist){
        if(typeof(index_songlist)=="undefined"){
            index_songlist=parseInt(document.querySelector("#target_id").value);
        }
        this.currentplaysong_inlist=index_songlist;
        let file_name=this.musiclist[this.currentplaysong_inlist].title+"-"+this.musiclist[this.currentplaysong_inlist].singer;
        this.audio.src="/static/"+file_name+".mp3";
        this.audio.play()
    }

    pre(){
        if(this.currentplaysong_inlist>0) {
            this.currentplaysong_inlist-=1;
            let file_name=this.musiclist[this.currentplaysong_inlist].title+"-"+this.musiclist[this.currentplaysong_inlist].singer;
            this.audio.src = "/static/" + file_name+ ".mp3";
            this.audio.play();
        }
    }
    next(){
        if(this.currentplaysong_inlist<this.musiclist.length-1) {
            this.currentplaysong_inlist+=1;
            let file_name=this.musiclist[this.currentplaysong_inlist].title+"-"+this.musiclist[this.currentplaysong_inlist].singer;
            this.audio.src="/static/"+file_name+".mp3";
            this.audio.play();
        }
    }


}