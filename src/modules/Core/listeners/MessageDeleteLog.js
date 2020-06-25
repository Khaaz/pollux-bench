import { Listener } from 'axoncore';

class MessageDeleteLog extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageDelete';
        /** Event name (Function name) */
        this.label = 'messageDeleteLog';

        this.enabled = true;

        this.info = {
            owners: ['KhaaZ'],
            description: 'Log Message Delete events',
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

export default MessageDeleteLog;
