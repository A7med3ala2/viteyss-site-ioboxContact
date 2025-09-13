<template>
    
    <div class="iobGpioPin" 
        @mouseover="gpioMOver()"
        @mouseout="gpioMOut()"
        >
        <table>
            <tr>
                <td 
                    :id="'gpioBox'+p.pNo"
                    @click="gpioToogleForce()"
                    style="width:12%;"
                    >
                    <div 
                        :class="{gpioBclassForced: forceLineStay}"
                        :style="'background-color:'+gpioBclass">
                        Gpio{{ p.pNo }}
                    </div>
                </td>
                <td style="width:12%">{{ pTypeNice }}</td>
                <td style="width:10%; overflow-x:hidden;">{{ p.pState }}</td>
                <td style="">
                    {{ pStateNice }}
                </td>
                <td style="width:45%">
                    <iobox-gpio-state
                        :p="p"
                            :boxioNo="boxioNo"
                        />
                </td>
            </tr>

        </table>

    </div>

</template>
<script>

export default{
    props: ['p','boxioNo'],
    data(){ return {
        myLine: undefined,
        forceLineStay: false
    }; },
    methods:{
        gpioToogleForce(){
            this.forceLineStay = this.forceLineStay == true ? false : true;
            //console.log('force stay now'+ this.forceLineStay);
            this.gpioMOut();
        },
        gpioMOver(){
            //console.log('over'+this.p.pNo);
            if( this.myLine == undefined ){
                this.myLine = new LeaderLine( document.getElementById('g'+this.p.pNo ),document.getElementById('gpioBox'+this.p.pNo),{
                    //outlineColor: '#353',
                    //outline: true,
                    startSocket: 'right',
                    endSocket:'right',
                    middleLabel: 'GPIO'+this.p.pNo+" - "+this.pTypeNice,
                    startPlug: 'circle',
                    startPlugSize: 1.0,
                    startPlug: 'squer',
                    startPlugSize: 1.0,
                    //animOptions:{ duration: 3000, timing: 'linear'},
                    dropShadow: true,
                    color: "#fd813a"
                } );
            }
        },
        gpioMOut(){
            //console.log('out '+this.p.pNo);
            if( this.myLine != undefined && this.forceLineStay == false ){
                this.myLine.hide();
                this.myLine = undefined;
            }
        },
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
        }
    },
    computed:{
        gpioBclass(){
            return this.getColorForTyp( this.p.pType );
        },
        pStateNice(){
            if( this.p.pType == 'R')
                return 'as';
            else if( this.p.pType == 'O' ){
                return 'Set';
            }else if( this.p.pType == 'I' )
                return this.p.pState == 0 ? 'LOW': 'HIGH';
            else if( this.p.pType == 'A' )
                return mMapVal( this.p.pState, 0, 4095, 0, 1 ).toFixed(4);
            else if( this.p.pType == 'D' )
                return 'DAC';
            else if( this.p.pType == 'T' )
                return 'level';
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
.iobGpioPin{
    font-size: 70%;
}
.iobGpioPin table{
    min-width: 100vw;
    border-radius: 3px;
    border: solid 1px gray;
    margin: -5px;
    padding: -5px;
}

.gpioBclass{
    border:solid 1px gray;
    border-radius: 3px;
}
.gpioBclassForced{
    border: solid 2px red;
    border-radius: 3px;
}
</style>