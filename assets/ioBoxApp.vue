<template>
    <b>io-box Contact No#{{ boxioNo }}</b><br>
    <div 
        :id="'iobox'+boxioNo+'Refference'"
        style="max-width:100vw;">waiting for board model ...</div>

    <small v-if="tik == 0 && box.dbm == 0">
        looking for io-box ...
    </small>
    <small v-else>
        ip:{{ box.ip }} 
        tik:{{ tik }} <br>
        <iobox-gpio-state :p="wifidbmPin" :boxioNo="boxioNo" /> 
        <iobox-gpio-state :p="chipTempPin" :boxioNo="boxioNo" />
        <iobox-gpio-state :p="timePassPin" :boxioNo="boxioNo" />
    </small>

    <div v-if="bSettingsArr.length == 0"><small>waiting for setting's ...</small></div>
    <div v-else>
        <iobox-gpio 
        v-for="p in bSettingsArr"
        :p="p"
        :boxioNo="boxioNo"
        ref="ioboxgpioComp"
        />
    </div>

</template>
<script>
export default{
    props:['thomeUrl'],
    data(){
        return {
            tik: 0,
            boxioNo: 1,
            box:{
                ip: "---.---.---.---",
                dbm: 0,
                chipTemp: 0,
                boardModel: "",
                adcHz: 1,
                touchRou: 10
            },
            gpiosData: [],
            bSettingsArr: [],
            bSettingsTupdate: 0,
            imageBoard: '',
            wifidbmPin:{ pType: 'dbm', pState: -49 },
            chipTempPin:{ pType: 'temp', pState: 0 },
            timePassPin:{ pType: 'timePass', pState: 0  }
        }
    },
    mounted(){
        console.log("ioBoxApp No"+this.boxioNo+" mounted");

        // TODO FIX need to be fixed
        setTimeout(()=>{
            sOutSend('wsClientIdent:mapio');
        },1000);

    },
    methods:{
        getColorForTyp(pType){
            if( pType == 'R')
                return '#a9f3f0';
            else if( pType == 'O' ){
                return '#f9f339';
            }else if( pType == 'I' )
                return '#f98339';
            else if( pType == 'A' )
                return '#60e30e';
            else if( pType == 'D' )
                return '#a3a047';
            else if( pType == 'T' )
                return '#f283fd';
            else
                return '#fff;';
        },
        doBoardLoadDataLoaded( data, status ){
            let divTarget = `#iobox${this.boxioNo}Refference`;
            siteByKey.s_multiSVGPage.o.mulSvgParseGet( data  , status, false, divTarget );
            for(let pinA of this.bSettingsArr){
                /*
                    pType: p[1],
                    pTypeNice: pTNice,
                    pNo: p[0],
                    pState: p[2]
                    */
                updateStyle("g"+pinA['pNo'], {
                    'fill': this.getColorForTyp( pinA['pType'] )
                } );
                
                updateStyle("g"+pinA['pNo'], {
                    'stroke': this.getColorForTyp( pinA['pType'] )
                } );
                    
                this.imageBoard = this.box.boardModel;
            }
        },
        doBoardLoad(){
            if( this.box.boardModel != this.imageBoard && this.imageBoard != 'loading...' ){
                this.imageBoard = 'loading...';
                let divTarget = `#iobox${this.boxioNo}Refference`;
                $(divTarget).html( this.imageBoard );
                $.get( `${this.thomeUrl}assets/${this.box.boardModel}.svg`, this.doBoardLoadDataLoaded );
            }          
        },
        newMessage( msg ){
            //this.gpiosData
            
            
            if( String(msg['topic']).endsWith(`boxio/${this.boxioNo}/box`) ){
                this.box = JSON.parse(msg['payload']);
                this.wifidbmPin.pState = this.box.dbm;
                this.chipTempPin.pState = this.box.chipTemp;
                
                this.timePassPin.pState = Date.now();
                
                
            }else if( String(msg['topic']).endsWith(`boxio/${this.boxioNo}/cpu/percent`) )
            this.tik = parseInt(msg['payload']);

            else if( String(msg['topic']).startsWith(`and/boxio/${this.boxioNo}/s/`) ){
                let tmp = msg['topic'].split('/');
                let pin = parseInt( tmp[ tmp.length-1 ] );
                //console.log("gpio hot update pin:"+pin);
                //this.dbm = parseInt(msg['payload']);
                //this.bSettings[ pin ]['pState'] = parseInt( msg['payload'] );
                for( let p of this.bSettingsArr){
                    if( p.pNo == pin ){
                        p['pState']  = parseInt( msg['payload'] );
                        break;
                    }
                }


            }else if( String(msg['topic']).endsWith(`boxio/${this.boxioNo}/settings`) ){
                let pay = msg['payload'].split(',');
                if( this.bSettingsArr.length == 0 ){
                    this.bSettingsArr = new Array(pay.length-1);
                }
                for(let pi=0,pc=pay.length-1; pi<pc; pi++){
                    
                    let p = pay[ pi ].split(':');
                    let pTNice = '-';
                    
                    let pin = {
                        pType: p[1],
                        pTypeNice: pTNice,
                        pNo: p[0],
                        pState: p[2]
                    };
                    this.bSettingsArr[ pi ]= pin;
                    
                    
                }
                this.bSettingsTupdate = Date.now();
                this.doBoardLoad();
                
            }

        }

    }


}
</script>