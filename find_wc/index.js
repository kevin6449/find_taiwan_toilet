 //https://developers.google.com/actions/reference/nodejsv2/overview
 
 'use strict'; //語法嚴格模式
 
 //Cloud Functions for Firebase
 //const functions = require('firebase-functions');
 //Cloud Functions for Firebase
 
 //Dialogflow inline editor
 //const functions = require('firebase-functions');
 //Dialogflow inline editor
 
 //Self-hosted Express server (multiple routes)
 const express = require('express');
 const bodyParser = require('body-parser'); //parse POST request for text/json/query string
 //Self-hosted Express server (multiple routes)

//https
const axios = require('axios');
const https = require('https'); 


 // ... app code start here
//build an app instance in your fulfillment webhook, follow these steps:
//step1:Call the require() function
// Import the service function and various response classes
const {
  dialogflow,
  actionssdk,
  Image,
  Table,
  Carousel,
  Permission
} = require('actions-on-google');

//step2:Create an app instance
//const app = dialogflow();

//step3:configure the app instance
const app = dialogflow({
  debug: true
});

//intent process
app.intent('find_wc', (conv) => {
	conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
    return conv.ask(new Permission({
        context: '您好',
        permissions: conv.data.requestedPermission
      })
    );
});

app.intent('user_info', (conv, params, permissionGranted) => {
    if (permissionGranted) {
        const {
            requestedPermission
        } = conv.data;
        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
            
            const {
                coordinates
            } = conv.device.location;
            var entityCity = conv.device.location.formattedAddress;
            console.log('entityCity:', entityCity);  
            if (coordinates) {
                return opendatawc(entityCity,coordinates.latitude,coordinates.longitude).then((outside_wc) => {
                  console.log("outside_wc: ",outside_wc);
     			conv.ask(outside_wc);
   				})
            } else {
                // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                // and a geocoded address on voice-activated speakers.
                // Coarse location only works on voice-activated speakers.
                return conv.close('抱歉，我不知道你在哪裡。');
            }
 
        }
    } else {
        return conv.close('好的，那你還想問什麼問題嗎?');
    }
});

// ... app code end here

//external API start
/**
 * Make an external API call to get open data.
 * @return {Promise<string>}
 */
function opendatawc(entityCity,latitude,longitude){
  var lat = latitude;
  console.log('latitude:', latitude);
  var lng = longitude;  
  console.log('longitude:', longitude);
  var city_num = "355000000I-000528";
  if(entityCity != undefined){
  var wc_city = entityCity.split(",");
  var arraysize = wc_city.length-1;
  console.log('arraysize:', arraysize);
  var wc_city3 = wc_city[arraysize].split(" ");
  console.log('wc_city:', wc_city3[1]);
  
  switch(wc_city3[1]){
    case "花蓮縣":
        city_num= "355000000I-000510";
      break;
    case "宜蘭縣":
        city_num= "355000000I-000511";
      break;
    case "金門縣":
        city_num= "355000000I-000512";
      break;
    case "南投縣":
        city_num= "355000000I-000513";
      break;
    case "屏東縣":
        city_num= "355000000I-000514";
      break;  
    case "苗栗縣":
        city_num= "355000000I-000515";
      break;
    case "桃園市":
        city_num= "355000000I-000516";
      break;
    case "高雄市":
        city_num= "355000000I-000517";
      break;
    case "基隆市":
        city_num= "355000000I-000518";
      break;
    case "連江縣":
        city_num= "355000000I-000519";
      break;    
    case "雲林縣":
        city_num= "355000000I-000520";
      break; 
    case "新北市":
        city_num= "355000000I-000521";
      break; 
    case "新竹市":
        city_num= "355000000I-000522";
      break; 
    case "新竹縣":
        city_num= "355000000I-000523";
      break; 
    case "嘉義市":
        city_num= "355000000I-000524";
      break; 
    case "嘉義縣":
        city_num= "355000000I-000525";
      break; 
    case "彰化縣":
        city_num= "355000000I-000526";
      break; 
    case "臺中市":
    case "台中市":  
        city_num= "355000000I-000527";
      break; 
    case "臺北市":            
    case "台北市":
        city_num= "355000000I-000528";
      break; 
    case "臺東縣":
    case "台東縣":  
        city_num= "355000000I-000529";
      break;
    case "臺南市":
    case "台南市":  
        city_num= "355000000I-000530";
      break;
    case "澎湖縣":
        city_num= "355000000I-000531";
      break;      
    default:
        city_num= "355000000I-000528";
      break;  
  }
} 
return new Promise((resolve, reject) => { 
let msg = "callaxiosApi";
const findWcUrl = "https://opendata.epa.gov.tw/webapi/api/rest/datastore/"+city_num;
//https://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000528?filters=Latitude le '25.0195109' and Longitude le '121.5484174'&offset=0&limit=10

console.log(`findWcUrl ==`+findWcUrl);
// At instance level
const instance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});
instance.get(findWcUrl);

// At request level
const agent = new https.Agent({  
  rejectUnauthorized: false
});
axios.get(findWcUrl, { 
  params: {filters: "Latitude le '" + lat + "' and Longitude le '" +lng+ "'",
                     //Latitude+le+'25.0195109'+and+Longitude+le+'121.5484174'
			 offset : "0",
			 limit : "5",
			 //token : "xxxxxxxxxxxxxx"
			 },
	httpsAgent: agent})
  .then((response) =>{
    //console.log("status: ",response.status);
    //console.log("statustest: ",response.statusText);
    let json = response.data;
    console.log("json "+json);
    let res_msg = json.Message;
    console.log("res_msg "+res_msg);
    if (res_msg !=  "發生錯誤。"){
    let success = json.success;
    //console.log('success: '  + success);
    let id = json.result.resource_id;
    //console.log('id: '  + id);
    let total = json.result.total;
    var intTotal = parseInt(total,10);
  //});
  /* json format
  {"Country":"臺北市","City":"內湖區","Village":"湖元里","Number":"6301000030-M-00143",
  "Name":"大潤發購物中心內湖二店4樓無障礙","Address":"臺北市內湖區舊宗路一段188號","Administration":"",
  "Latitude":"25.062653","Longitude":"121.575989","Grade":"優等級","Type2":"無障礙廁所","Type":"量販店"}
  */
	var outMsg = "";
	var i =0;
	if(intTotal>0){
		for(i=0;i<intTotal;i++){
			outMsg = outMsg+"公廁名稱: "+json.result.records[i].Name+" 公廁地址: "+json.result.records[i].Address+"\n";
			console.log('Msg data = '  + outMsg);
		}
 	}else{
 		outMsg = "目前查無資料";
   }
  }else{
    outMsg = "資料查詢錯誤";
  } 
    msg=outMsg+"如果還要找其他地方，請再問一次請問廁所在哪裏";
	resolve(msg);
    
  })
  .catch((error) => {
    console.log("error: ",error);
    msg =error;
    if (error.response.status === 500) {
      //console.log('unauthorized, logging out ...');
      msg="位置資訊不在選擇的縣市內。";
    }
    resolve(msg);
    reject(msg);
  });
  })
}

//external API end

//Cloud Functions for Firebase
//exports.fulfillment = functions.https.onRequest(app);
//Cloud Functions for Firebase

//Dialogflow inline editor
// Exported function name must be 'dialogflowFirebaseFulfillment'

//exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
//Dialogflow inline editor

//Self-hosted Express server (multiple routes)

const expressApp = express().use(bodyParser.json());


expressApp.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const target = process.env.TARGET || 'World';
  res.send(`Hello ${target}!`);
});

expressApp.post('/webhook', app);

const port = process.env.PORT || 8080;
expressApp.listen(port, () => {
  console.log('server start ... on port', port);
})

//Self-hosted Express server (multiple routes) 