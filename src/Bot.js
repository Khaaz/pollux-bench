import Eris from 'eris';

import { AxonOptions } from 'axoncore';

import PolluxClient from './PolluxClient';

import botConfig from './configs/config.json';
import secret from './configs/secret.json';
import lang from './configs/lang.json';
const token =  secret.bot.token

import MyUtils from './MyUtils';

const axonOptions = new AxonOptions( {
    prefixes: botConfig.prefixes,
    settings: botConfig.settings,
    lang,
    logo: null,

    info: botConfig.info,
    staff: botConfig.staff,
    template: botConfig.template,
    custom: { },
},
// webhooks
secret.webhooks,
// extensions
{
    utils: MyUtils, // use your own Utils
    logger: null, // custom Logger
    DBProvider: null, // custom DB Service
    DBLocation: `${__dirname}/database/`,

    axonConfig: null,
    guildConfig: null,
} );

/**
 * new AxonClient(token, erisOptions, AxonOptions, modules)
 *
 * new Client(token, erisOptions, AxonOptions) => Modules imported in Client
 */

const SHARDS_PER_CLUSTER = parseInt(process.env.SHARDS_PER_CLUSTER, 10) || 1;
const CLUSTER_ID = parseInt(process.env.CLUSTER_ID, 10) || 0;
const TOTAL_SHARDS = parseInt(process.env.TOTAL_SHARDS, 10) || 1;

const client = new Eris.Client(
    token,
    {
        autoreconnect: true,
        defaultImageFormat: 'png',
        defaultImageSize: 512,
        getAllUsers: false,
        messageLimit: 100,
        restMode: true,
        maxShards: TOTAL_SHARDS,
        firstShardID: (SHARDS_PER_CLUSTER * CLUSTER_ID),
        lastShardID: SHARDS_PER_CLUSTER * (CLUSTER_ID + 1) - 1,
        intents: 5639,
        disableEvents: {
          TYPING_START: true,
          GUILD_MEMBER_SPEAKING: true,
        },
    },
);

const pollux = new PolluxClient(
    client,
    axonOptions,
);

export default pollux;
