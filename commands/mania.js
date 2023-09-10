const osu = require('../osu.js');
const helper = require('../helper.js');

module.exports = {
    command: ['mania'],
    description: "Show osu!mania stats.",
    usage: '[username]',
    example: {
        run: "osu dressurf",
        result: "Returns dressurf's osu!mania stats."
    },
    configRequired: ['credentials.osu_api_key'],
    call: obj => {
        return new Promise((resolve, reject) => {
            let { argv, msg, user_ign } = obj;

            let extended = argv[0] == 'osu2';

            let osu_user = helper.getUsername(argv, msg, user_ign);

            if(!osu_user){
                if(user_ign[msg.author.id] == undefined)
                    reject(helper.commandHelp('ign-set'));
                else
                    reject(helper.commandHelp('osu'));

                return false;
            }

            osu.get_user({u: osu_user, m: mania, extended}, (err, embed) => {
                if(err){
                    reject(err);
                    helper.error(err);
                    return false;
                }

                resolve({embed: embed});
            });
        });
    }
};
