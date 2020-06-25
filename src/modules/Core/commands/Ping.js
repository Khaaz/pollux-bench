import {
    Command, CommandOptions, CommandResponse, CommandContext, AxonCommandError,
} from 'axoncore';

class Ping extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'ping';
        this.aliases = [
            'ping',
            'daily',
            'bj',
            'blackjack',
            'rep',
            'ppc',
            'profile',
            'boosterpack',
            'guessflag',
            'gtf',
            'ship',
            'open',
            'box',
            'booster',
            'coffee',
        ];

        this.hasSubcmd = false;

        this.info = {
            owners: ['KhaaZ'],
            name: 'ping',
            description: 'Ping the bot.',
            usage: 'ping',
            examples: ['ping'],
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: false,
        } );
    }

    _execute(env) {
        const { msg } = env;
        const context = new CommandContext(this, msg, {
            executed: true,
            executionType: env.executionType,
        } );
        
        context.startTime = env.startTime;
        context.midTime = env.midTime;
        
        return this.execute(env)
            /* Successful and failed execution + caught errors (this.error()) */
            .then( (response) => {
                this._cooldown.shouldSetCooldown(response) && this._cooldown.setCooldown(this.library.message.getAuthorID(msg) );
                
                return context.addResponseData(response);
            } )
            /* UNEXPECTED ERRORS ONLY (non caught) */
            .catch(err => {
                !env.isAdmin && this._cooldown.shouldSetCooldown() && this._cooldown.setCooldown(this.library.message.getAuthorID(msg) );

                context.addResponseData(new CommandResponse( { success: false, triggerCooldown: true, error: err } ) );
                throw new AxonCommandError(context, err);
            } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */
    async execute( { msg } ) {
        return new CommandResponse( { success: false } );
    }
}

export default Ping;
