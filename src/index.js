import pollux from './Bot';
import { performance } from 'perf_hooks';

pollux.on('commandExecution', (executed, fullLabel, { msg, command, guildConfig, context } ) => {
    const endTime = performance.now();

    pollux.dogstatsd.increment('axoncore.commands.count', [
        `guild:${msg.channel.guild.id}`,
        `shard:${(msg.channel.guild && msg.channel.shard.id) || 'noshard'}`,
        `command_name:${command.label}`,
        `commands_category:${command.module.label}`,
    ] );
    pollux.dogstatsd.increment(`axoncore.commands.${command.label}`, ['type:commands'] );

    pollux.dogstatsd.gauge('axoncore.exectime.full', endTime - context.startTime, [`shard:${(msg.channel.guild && msg.channel.shard.id) || 'no shard'}`, `command_name:${command.label}`] );
    pollux.dogstatsd.gauge('axoncore.exectime.command', endTime - context.midTime, [`shard:${(msg.channel.guild && msg.channel.shard.id) || 'no shard'}`, `command_name:${command.label}`] );
} );

pollux.on('listenerExecution', (executed, eventName, label, { listener, guildConfig } ) => {
    pollux.dogstatsd.increment('axoncore.events', ['type:events'] );
    pollux.dogstatsd.increment(`axoncore.events.${eventName}`);
} );

pollux.start();
pollux.logger.notice('=== ONLINE ===');
