const osu = require('../osu.js');
const helper = require('../helper.js');

module.exports = {
    command: ['recentmania', 'rsmania', 'recentpassmania', 'rpmania', 'maniars', 'maniarp', 'maniarecent'],
    description: "Show recent score or pass on osu!mania.",
    startsWith: true,
    usage: '[username]',
    example: [
        {
            run: "recentmania dressurf",
            result: "Returns dressurf's most recent score."
        },
        {
            run: "recentmania3 aitor98",
            result: "Returns aitor98's 3rd most recent score."
        },
        {
            run: "recentpass",
            result: "Returns your most recent pass."
        }
    ],
    configRequired: ['credentials.osu_api_key'],
    call: obj => {
        return new Promise((resolve, reject) => {
            let { argv, msg, user_ign, last_beatmap } = obj;

            let recent_user = helper.getUsername(argv, msg, user_ign);

            let command = argv[0].toLowerCase().replace(/[0-9]/g, '');

            if(!module.exports.command.includes(command))
                return false;

            let pass = argv[0].toLowerCase().startsWith('rp') || argv[0].toLowerCase().startsWith('recentpass');

            let index = 1;
            let match = argv[0].match(/\d+/);
            let _index = match > 0 ? match[0] : 1;

            if(_index >= 1 && _index <= 100)
                index = _index;

            if(!recent_user){
                if(user_ign[msg.author.id] == undefined)
                    reject(helper.commandHelp('ign-set'));
                else
                    reject(helper.commandHelp('recent'));
            }else{
                osu.get_recent_mania({user: recent_user, pass: pass, index: index}, (err, recent, strains_bar, ur_promise) => {
                    if(err){
                        helper.error(err);
                        reject(err);
                    }else{
                        let embed = osu.format_embed(recent);
                        helper.updateLastBeatmap(recent, msg.channel.id, last_beatmap);

                        if(ur_promise){
                            resolve({
                                embed: embed,
                                files: [{attachment: strains_bar, name: 'strains_bar.png'}],
                                edit_promise: new Promise((resolve, reject) => {
                                    ur_promise.then(recent => {
                                        embed = osu.format_embed(recent);
                                        resolve({embed});
                                    });
                                })});
                        }else{
                            resolve({
                                embed: embed,
                                files: [{attachment: strains_bar, name: 'strains_bar.png'}]
                            });
                        }
                    }
                });
            }
        });
    }
};
