import { Listener } from 'axoncore';

class MessageUpdateLog extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageUpdate';
        /** Event name (Function name) */
        this.label = 'messageUpdateLog';

        this.enabled = true;

        this.info = {
            owners: ['KhaaZ'],
            description: 'Log Message Update events',
        };
    }

    /**
     * @param {import('eris').Message} message
     * @param {import('axoncore').GuildConfig} guildConfig
     */
    execute(message, guildConfig) { // eslint-disable-line
        return Promise.resolve();
    }
}

export default MessageUpdateLog;
