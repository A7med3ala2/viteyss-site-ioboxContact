<template>
    <small>

        No#{{ boxioNo }} 
        ip:{{ ip }} dbm:{{ dbm }}(dBm) tik:{{ tik }} chipTemp:{{ chipTemp }}('C)
        Data from: {{ bSettingsTupdate }} <br>
    </small>
    <iobox-gpio 
        v-for="p in bSettingsArr"
        :p="p"
        :boxioNo="boxioNo"
        />

</template>
<script>
export default{
    data(){
        return {
            tik: 0,
            ip: "---.---.---.---",
            dbm: 0,
            boxioNo: 1,
            chipTemp: 0,
            gpiosData: [],
            bSettingsArr: [],
            bSettingsTupdate: 0
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
        newMessage( msg ){
            //this.gpiosData
            
            if( String(msg['topic']).endsWith(`boxio/${this.boxioNo}/chipTemp`) )
                this.chipTemp = parseFloat(msg['payload']);

            else if( String(msg['topic']).endsWith(`boxio/${this.boxioNo}/cpu/percent`) )
                this.tik = parseInt(msg['payload']);

            else if( String(msg['topic']).endsWith(`boxio/${this.boxioNo}/ip`) )
                this.ip = msg['payload'];

            else if( String(msg['topic']).endsWith(`boxio/${this.boxioNo}/dbm`) )
                this.dbm = parseInt(msg['payload']);

            else if( String(msg['topic']).startsWith(`and/boxio/${this.boxioNo}/s/`) ){
                let tmp = msg['topic'].split('/');
                let pin = parseInt( tmp[ tmp.length-1 ] );
                console.log("gpio hot update pin:"+pin);
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
                let firstTime = false;
                if( this.bSettingsArr.length == 0 ){
                    firstTime = true;
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
                    }

                    if( firstTime ){
                        updateStyle("g"+p[0], {
                            'fill': shaderColor( rgbToHex(
                                50,
                                50,
                                50
                            ) )
                        } );
                        
                        updateStyle("g"+p[0], {
                            'stroke': shaderColor( rgbToHex(
                                250,
                                50,
                                50
                            ) )
                        } );
                        
                    }
                    
                    this.bSettingsArr[ pi ]= pin;
                    console.log('gpio color');
                    

                }
                this.bSettingsTupdate = Date.now();

            }

        }

    }


}
</script>