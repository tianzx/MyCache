/**
 * Created by tianzx on 2017/7/11.
 */
const Client = require('./lib/memcache').Client

const client  =  new Client(17465,'memcached-17465.c1.asia-northeast1-1.gce.cloud.redislabs.com')

client.connect();