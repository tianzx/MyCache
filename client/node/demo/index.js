/**
 * Created by tianzx on 2017/7/11.
 */
const Client = require('./mem_03/index').Client

const client  =  new Client(17465,'memcached-17465.c1.asia-northeast1-1.gce.cloud.redislabs.com')

client.connect();
client.getKey('key');