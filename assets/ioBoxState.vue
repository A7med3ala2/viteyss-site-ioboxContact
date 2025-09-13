<template>
    
    <div v-if="p.pType == 'R'">
        {{ calculateHz }} Hz
    </div>
    <div v-else-if="p.pType == 'D'">
        <input type="range" min="0" max="255" step="1"
            @change="rangeSend()"
            v-model="dacRange"
            >
    </div>
    <div v-else-if="p.pType == 'O'">
        <button @click="gpioSetState(1)">on</button>
        <button @click="gpioSetState(0)">off</button>
    </div>
    <div v-else-if="p.pType == 'A'">
        <div 
            class="ioBadcState" 
            :style="'width:'+adcWidth()+'%;'"
            >adc</div>
    </div>

    <div v-else-if="p.pType == 'dbm'"
        class="ioBoxStateInLine" style="width:100px; border-radius: 3px; border: solid 1px gray;" >
        <div>
            <div 
                style="position: absolute;">
                {{ p.pState }} dbm
            </div>
            <div 
                class="ioBadcState ioBWifiState" 
                :style="'width:'+dbmWidth()+'%;'"
                > </div>
        </div>
    </div>

    <div v-else-if="p.pType == 'temp'"
        class="ioBoxStateInLine" style="width:100px; border-radius: 3px; border: solid 1px gray;">
        <div>
            <div 
                style="position: absolute;">
                {{ p.pState }} 'C
            </div>
            <div 
                class="ioBadcState ioBTempState" 
                :style="'width:'+tempWidth()+'%;'"
                > </div>
        </div>
    </div>

    <div v-else-if="p.pType == 'timePass'"
        class="ioBoxStateInLine" style="width:100px; border-radius: 3px; border: solid 1px gray;">
        <div>
            <div 
                style="position: absolute;">
                {{  ((Date.now() - p.pState)/1000).toFixed(2) }} sec.
            
            </div>
            <div 
                class="ioBadcState ioBTempState" 
                :style="'width:'+timePassWidth()+'%;'"
                >
            </div>
        </div>
    </div>


    <div v-else-if="p.pType == 'T'">
        <div 
            class="ioBadcState ioBtouchState" 
            :style="'width:'+touchWidth()+'%;'"
            >touch</div>
    </div>
    <div v-else>
        <!--state {{ p.pNo }}-->
    </div>


</template>
<script>


export default{
    props: ['p','boxioNo'],
    data(){ return { 
        tLast: Date.now()-5000,
        dacRange: this.p.pState
      }; },
    methods:{
        rangeSend(e=''){
            //console.log('change end?',e, this.dacRange);
            let cmd = `toMqttPub:topic=and/boxio/cmd/${this.boxioNo}/d,`+
            `payload=${this.p.pNo}:${this.dacRange}`;
            //console.log('ws push ',cmd);
            sOutSend(cmd );
        },
        timePassWidth(){
            return mMapVal(
                ((Date.now() - this.p.pState)/1000),
                0,5,0,100
                );
        },
        tempWidth(){
            return parseInt(mMapVal(this.p.pState,0,100,0,100));
        },
        adcWidth(){
            return parseInt(mMapVal(this.p.pState,0,4095,0,100));
        },
        touchWidth(){
            return parseInt(mMapVal(this.p.pState,0,255,0,100));
        },
        dbmWidth(){
            return parseInt(mMapVal(this.p.pState,-30.0,-90.0,100,0));
        },
        gpioSetState( newState ){
            let cmd = `toMqttPub:topic=and/boxio/cmd/${this.boxioNo}/p,`+
            `payload=${this.p.pNo}:${newState}`;
            console.log('ws push ',cmd);
            sOutSend(cmd );
        }
    },
    computed:{
        calculateHz(){
            let tNow = Date.now();
            let tDelta = tNow - this.tLast;
            let hz = this.p.pState / tDelta;
            this.tLast = tNow;
            return `${hz}`;
        },
        pStateNice(){
            if( this.p.pType == 'R')
                return 'Counter';
            else if( this.p.pType == 'O' ){
                return 'Output';
            }else if( this.p.pType == 'I' )
                return this.p.pState == 0 ? 'LOW': 'HIGH';
            else if( this.p.pType == 'A' )
                return mMapVal( this.p.pState, 0, 4095, 0, 1 );
            else if( this.p.pType == 'D' )
                return 'DAC';
            else if( this.p.pType == 'T' )
                return 'Touch';
            else
                return this.p.pType;
        },
        pTypeNice(){
            if( this.p.pType == 'R')
                return 'Counter';
            else if( this.p.pType == 'O' )
                return 'Output';
            else if( this.p.pType == 'I' )
                return 'Input';
            else if( this.p.pType == 'A' )
                return 'ADC';
            else if( this.p.pType == 'D' )
                return 'DAC';
            else if( this.p.pType == 'T' )
                return 'Touch';
            else
                return this.p.pType;
        }
    }

}
</script>
<style>
.ioBadcState{
    background-color: chartreuse;
    border-radius: 3px;
    border-color: gray solid 1px;
    min-width: 2px;
    min-height: 15px;
}
.ioBtouchState{
    background-color: orange;
}

.ioBWifiState{
    background-color: rgb(110, 156, 255);
}

.ioBTempState{
    background-color: rgb(239, 254, 106);
}

.ioBoxStateInLine{
    display: inline-block;
}
</style>