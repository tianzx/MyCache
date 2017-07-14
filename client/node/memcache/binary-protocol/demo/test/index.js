/**
 * Created by tianzx on 2017/7/14.
 */
const Client = require('../client').Client
const Server = require('../server').Server
// const client = new Client(new Server('memcached-17465.c1.asia-northeast1-1.gce.cloud.redislabs.com',17465))
const client = Client.create('memcached-17465.c1.asia-northeast1-1.gce.cloud.redislabs.com:17465')
client.get('name',(val)=>{
    console.log(val)
})