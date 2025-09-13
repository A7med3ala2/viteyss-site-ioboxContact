
import { createApp } from 'vue';
import IoBoxApp from './assets/ioBoxApp.vue';
import IoBoxGpio from './assets/ioBoxGpio.vue';
import IoBoxState from './assets/ioBoxState.vue';


class s_vysioboxContactPage{

  constructor(){
    this.ioApp = -1;
  }
  
  get getName(){
    return `vys ioboxContact`;
  }
    
  
  get getDefaultBackgroundColor(){
    return "#ffffff";
  }
  
  getHtml = () => {

    return `<b>${this.getName}</b><br><!--
    <img src="${this.homeUrl}assets/ico_viteyss_32.png"><br>
    This is a npm package<br>
    viteyss-site-ioboxContact<br>
    <pre>
    In Menu: ${this.getName}
    Home url: ${this.homeUrl}
    Ver: ${this.instanceOf.ver}

    More ditails in \`./site.json\`
    </pre>
    -->
    <div id="ioboxRefference"
      style="max-width:100vw;">refference</div>
    <div id="ioboxApp"></div>
    <br><br><br>
    `;

  }

  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);
    this.ioApp = createApp(IoBoxApp);
    this.ioApp.component('iobox-gpio',IoBoxGpio);
    this.ioApp.component('iobox-gpio-state',IoBoxState);
    this.ioApp.mount('#ioboxApp');

    $.get( `${this.homeUrl}assets/esp32_30pin.svg`, function( data, status ){
        siteByKey.s_multiSVGPage.o.mulSvgParseGet( data  , status, false, '#ioboxRefference' );
        
    } );

  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){

  }

  onMessageCallBack = ( r ) => {
    //cl( `${this.getName} [cb] - got msg `+JSON.stringify(r,null,2));
    if( this.ioApp != -1 )
        this.ioApp._instance.ctx.newMessage(r);

  }

}

export { s_vysioboxContactPage };
