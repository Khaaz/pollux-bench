/* eslint-disable no-unused-vars */
import nodeUtil from 'util';

import {
    Command,
    CommandPermissions,
    CommandOptions,
    CommandResponse,
    AxonEnums,
    DiscordEnums,
    Collection,
    Embed,
    Prompt,
    MessageCollector,
    Stack,
    Queue,
    FunctionQueue,
    AutoQueue,
    AsyncQueue,
    CommandContext,
    AxonCommandError,
} from 'axoncore';

class Eval extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'eval';
        this.aliases = ['eval', 'e'];

        this.info = {
            owners: ['KhaaZ'],
            name: 'eval',
            description: 'Eval js code.',
            usage: 'eval [js code]',
            examples: ['eval 1 + 1'],
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 0,
        } );
        
        /**
         * @type {CommandPermissions}
         */
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
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
    async execute(env) {
        const { msg, args, guildConfig, prefix } = env;
        if (prefix === '+') {
            return new CommandResponse( {
                success: false,
            } );
        }
        
        let evalString;
        try {
            // eslint-disable-next-line no-eval
            evalString = await eval(args.join(' ') );

            if (typeof evalString === 'object') {
                evalString = nodeUtil.inspect(evalString, { depth: 0, showHidden: true } );
            } else {
                evalString = String(evalString);
            }
        } catch (err) {
            this.logger.debug(err.stack);
            return this.sendError(msg.channel, err.message ? err.message : `Error: ${err}`);
        }

        evalString = this.cleanUpToken(evalString);

        if (evalString.length === 0) {
            return this.sendError(msg.channel, 'Nothing to evaluate.');
        }

        const splitEvaled = evalString.match(/[\s\S]{1,1900}[\n\r]/g) || [evalString];
        
        if (splitEvaled.length > 3) {
            this.sendMessage(msg.channel, `Cut the response! [3/${splitEvaled.length} | ${evalString.length} chars]`);
        }
        
        for (let i = 0; i < 3; i++) {
            if (!splitEvaled[i] ) {
                break;
            }
            this.sendCode(msg.channel, splitEvaled[i] );
        }
        return new CommandResponse( {
            success: true,
        } );
    }

    /**
     * @param {String} evalString
     */
    cleanUpToken(evalString) {
        // @ts-ignore
        return evalString.replace(new RegExp(this.bot.token, 'g'), 'Khaaz Baguette');
    }

    /**
     * @param {import('eris').TextableChannel} channel
     * @param {String} content
     * @param {String} lang
     */
    sendCode(channel, content, lang = 'js') {
        return this.sendMessage(channel, `\`\`\`${lang}\n${content}\`\`\``);
    }
}

export default Eval;
