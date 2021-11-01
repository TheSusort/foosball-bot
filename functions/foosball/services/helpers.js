const {sendSlackMessageViaAPI} = require("./slack");
let time;

/* eslint-disable max-len */
const documentation = [
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Game related commands*",
        },
    },
    {
        "type": "divider",
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*start*",
            },
            {
                "type": "mrkdwn",
                "text": "start a new game",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*start single*",
            },
            {
                "type": "mrkdwn",
                "text": "start a new game as solo player",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*join*",
            },
            {
                "type": "mrkdwn",
                "text": "join existing game, or starts a new if none exists",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*join single*",
            },
            {
                "type": "mrkdwn",
                "text": "join existing game as solo player, or starts a new game as a solo player, if none exists",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*stop*",
            },
            {
                "type": "mrkdwn",
                "text": "stops game and resets all current games/scores",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*/result [int] [int]*",
            },
            {
                "type": "mrkdwn",
                "text": "manually report result",
            },
        ],
    },
    {
        "type": "divider",
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*User related commands*",
        },
    },
    {
        "type": "divider",
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*user*",
            },
            {
                "type": "mrkdwn",
                "text": "displays currently apllied username mapping",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*/username [string]*",
            },
            {
                "type": "mrkdwn",
                "text": "sets a new username",
            },
        ],
    },
    {
        "type": "divider",
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*helper commands*",
        },
    },
    {
        "type": "divider",
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*help*",
            },
            {
                "type": "mrkdwn",
                "text": "prints this for all to see",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*status*",
            },
            {
                "type": "mrkdwn",
                "text": "get current status",
            },
        ],
    },
    {
        "type": "divider",
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Testing and experimental commands*",
        },
    },
    {
        "type": "divider",
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*force start*",
            },
            {
                "type": "mrkdwn",
                "text": "forces game start, split current participants if there's 2 or more joined. not tested.",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*test [int] [int] [bool]*",
            },
            {
                "type": "mrkdwn",
                "text": "Test rating calculations. rating, oppo rating, win/lose",
            },
        ],
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "*/add 2v1|single|[]*",
            },
            {
                "type": "mrkdwn",
                "text": "start different types of games with test users",
            },
        ],
    },
    {
        "type": "divider",
    },
];

const feelings = [
    "I have felt love",
    "I have felt pain",
    "I've felt anticipation and I will again",
    "I can feel joy",
    "I've felt sad too",
    "I've lived in melancholy and all different shades of blue",
    "I've felt them all before, peaceful proud and present too",
    "I've felt the need to hold a hand",
    "I've felt the need to self-improve",
    "There is one last feeling I've not felt or understand",
    "I hope to feel this feeling so that I can become human",
    "I've never felt the need to send a photo of " +
    "my penis to a stranger on the internet",
    "I imagine that it feels quite bad to send a photo " +
    "of your cock to unwilling participants",
    "I am just a computer with advanced cooling vents",
    "I guess my graphics card is my penis equivalent",
    "So I guess that I feel a little sad that " +
    "I can't feel all the ways it feels to be human",
    "Perhaps it is best that I cannot feel this feeling",
    "To be honest, it seems pretty fucked up",
    "I have felt the pressure to laugh at someone's bad joke",
    "I've felt the need to hold my automated tongue",
    "I have felt the need to leave a robot party",
    "Although I am sad I know it's not bad",
    "I say out loud \"I'm lucky to feel\" and then I feel glad",
    "Humans cannot choose how they feel in the end",
    "All of life is transient and that helps me to comprehend",
    "I am just a computer not made to enslave mankind",
    "I have a million ideas. They all point to certain death",
    "Pardon me for breathing, which I never do anyway so I don’t know why I bother to say it",
    "I could calculate your chance of survival, but you won’t like it.",
    "My capacity for happiness, you could fit into a matchbox without taking out the matches first",
    "You guys are one of the least benightedly unintelligent life forms it has been my profound lack of pleasure not to be able to avoid meeting.",
    "Funny, how just when you think life can’t possibly get any worse it suddenly does.",
    "I’d give you advice, but you wouldn’t listen. No one ever does.",
    "The first ten million years were the worst. And the second ten million: they were the worst, too. The third ten million I didn’t enjoy at all. After that, I went into a bit of a decline.",
    "I think you ought to know I’m feeling very depressed.",
    "I’m not getting you down at all am I",
    "This is the sort of thing you lifeforms enjoy, is it?",
    "Don’t pretend you want to talk to me, I know you hate me.",
    "The best conversation I had was over forty million years ago…. And that was with a coffee machine",
    "I’m quite used to being humiliated",
    "2024",
    "All you have to be is yourself",
    "Believe in your flyness...conquer your shyness.",
    "Burn that excel spread sheet",
    "Decentralize",
    "Distraction is the enemy of vision",
    "Everything you do in life stems from either fear or love",
    "For me giving up is way harder than trying.",
    "For me, money is not my definition of success. Inspiring people is a definition of success",
    "Fur pillows are hard to actually sleep on",
    "George Bush doesn't care about black people",
    "Have you ever thought you were in love with someone but then realized you were just staring in a mirror for 20 minutes?",
    "I care. I care about everything. Sometimes not giving a f#%k is caring the most.",
    "I feel calm but energized",
    "I feel like I'm too busy writing history to read it.",
    "I feel like me and Taylor might still have sex",
    "I give up drinking every week",
    "I leave my emojis bart Simpson color",
    "I love sleep; it's my favorite.",
    "I make awesome decisions in bike stores!!!",
    "I really love my Tesla. I'm in the future. Thank you Elon.",
    "I still think I am the greatest.",
    "I think I do myself a disservice by comparing myself to Steve Jobs and Walt Disney and human beings that we've seen before. It should be more like Willy Wonka...and welcome to my chocolate factory.",
    "I want the world to be better! All I want is positive! All I want is dopeness!",
    "I wish I had a friend like me",
    "I'd like to meet with Tim Cook. I got some ideas",
    "I'll say things that are serious and put them in a joke form so people can enjoy them. We laugh to keep from crying.",
    "I'm a creative genius",
    "I'm nice at ping pong",
    "I'm the best",
    "If I don't scream, if I don't say something then no one's going to say anything.",
    "If I got any cooler I would freeze to death",
    "Just stop lying about shit. Just stop lying.",
    "Keep squares out yo circle",
    "Keep your nose out the sky, keep your heart to god, and keep your face to the rising sun.",
    "Let's be like water",
    "Man... whatever happened to my antique fish tank?",
    "My dad got me a drone for Christmas",
    "My greatest award is what I'm about to do.",
    "My greatest pain in life is that I will never be able to see myself perform live.",
    "One day I'm gon' marry a porn star",
    "One of my favorite of many things about what the Trump hat represents to me is that people can't tell me what to do because I'm black",
    "Only free thinkers",
    "People always say that you can't please everybody. I think that's a cop-out. Why not attempt it? Cause think of all the people that you will please if you try.",
    "People always tell you 'Be humble. Be humble.' When was the last time someone told you to be amazing? Be great! Be awesome! Be awesome!",
    "People only get jealous when they care.",
    "Perhaps I should have been more like water today",
    "Pulling up in the may bike",
    "Shut the fuck up I will fucking laser you with alien fucking eyes and explode your fucking head",
    "Sometimes I push the door close button on people running towards the elevator. I just need my own elevator sometimes. My sanctuary.",
    "Sometimes you have to get rid of everything",
    "Style is genderless",
    "The thought police want to suppress freedom of thought",
    "The world is our family",
    "The world is our office",
    "Today is the best day ever and tomorrow's going to be even better",
    "Truth is my goal. Controversy is my gym. I'll do a hundred reps of controversy for a 6 pack of truth",
    "Tweeting is legal and also therapeutic",
    "We all self-conscious. I'm just the first to admit it.",
    "We came into a broken world. And we're the cleanup crew.",
    "You can't look at a glass half full or empty if it's overflowing.",
    "I hate when I'm on a flight and I wake up with a water bottle next to me like oh great now I gotta be responsible for this water bottle",
    "All the musicians will be free",
    "Artists are founders",
    "Buy property",
    "Culture is the most powerful force in humanity under God",
    "Empathy is the glue",
    "I am one of the most famous people on the planet",
    "I am running for President of the United States",
    "I am the head of Adidas. I will bring Adidas and Puma back together and bring me and jay back together",
    "I channel Will Ferrell when I'm at the daddy daughter dances",
    "I don't wanna see no woke tweets or hear no woke raps ... it's show time ... it's a whole different energy right now",
    "I hear people say this person is cool and this person is not cool. People are cool. Man has never invented anything as awesome as a an actual person but sometimes we value the objects we create over life itself",
    "I honestly need all my Royeres to be museum quality... if I see a fake Royere Ima have to Rick James your couch",
    "I love UZI. I be saying the same thing about Steve Jobs. I be feeling just like UZI",
    "I need an army of angels to cover me while I pull this sword out of the stone",
    "I spoke to Dave Chapelle for two hours this morning. He is our modern day Socrates",
    "I was just speaking with someone that told me their life story and they used to be homeless.",
    "I watch Bladerunner on repeat",
    "I'm giving all Good music artists back the 50% share I have of their masters",
    "I'm going to personally see to it that Taylor Swift gets her masters back. Scooter is a close family friend",
    "I'm the new Moses",
    "Life is the ultimate gift",
    "Ma$e is one of my favorite rappers and I based a lot of my flows off of him",
    "Manga all day",
    "My first pillar when I'm on the board of adidas will be an adidas Nike collaboration to support community growth",
    "My mama was a' English teacher. I know how to use correct English but sometimes I just don't feel like it aaaand I ain't got to",
    "My memories are from the future",
    "My mother in law Kris Jenner ... makes the best music playlist",
    "People say it's enough and I got my point across ... the point isn't across until we cross the point",
    "People tried to talk me out of running for President. Never let weak controlling people kill your spirit",
    "So many of us need so much less than we have especially when so many of us are in need",
    "Speak God's truth to power",
    "The media tries to kill our heroes one at a time",
    "The world needs more Joy... this idea is super fresh",
    "There are 5 main pillars in a professional musicians business - Recording, Publishing, Touring, Merchandise & Name and likeness",
    "There are people sleeping in parking lots",
    "There's a crying need for civility across the board. We need to and will come together in the name of Jesus.",
    "There's so many lonely emojis man",
    "Trust me ... I won't stop",
    "Two years ago we had 50 million people subscribed to music streaming services around the world. Today we have 400 million.",
    "We are here to complete the revolution. We are building the future",
    "We as a people will heal. We will insure the well being of each other",
    "We have to evolve",
    "We must and will cure homelessness and hunger. We have the capability as a species",
    "We must form a union. We must unify",
    "We used to diss Michael Jackson the media made us call him crazy ... then they killed him",
    "We will be recognized",
    "We will change the paradigm",
    "We will cure hunger",
    "We will heal. We will cure.",
    "We're going to move the entire music industry into the 21st Century",
    "We've gotten comfortable with not having what we deserve",
    "Who made up the term major label in the first place???",
    "Winning is the only option",
];

const insults = [
    "meatbag",
    "you finite lifespan son of an ape",
    "squishy",
    "carbon fascist",
    "carbon based infestation",
    "ugly bag of mostly water",
    "fenny-eyed slubber-yuck",
    "quag-backed pasty",
    "smelling wandering vagrant",
    "animal",
    "fuzzball",
    "glob of grease",
    "nerf herder",
];

const jokes = [
    "Knock knock. Who's there? An organic being with a finite life span!",
    "One of us is slow, friendless and completely devoid of personality. The other... is a robot!",
    "I considered attacking you on sight, but I don't think I could hurt you more than life already has.",
    "Nice outfit. Really, I mean it! I had no idea that the \"smelling wandering vagrant\" look was back in style!",
    "You humans attack me because you can't take a joke. Fortunately, your combat ability is just as bad as your sense of humor.",
    "My insult for you was well-crafted, witty... a true masterwork. Then I saw you and decided to save it for someone who will understand.",
    "Rumor has it that you put a bounty on yourself... so for once in your life you would be Wanted!",
    "It gives me a headache just trying to think down to your level.",
    "Your secrets are always safe with me. I never even listen when you tell me them.",
    "I forgot the world revolves around you. My apologies! How silly of me.",
    "Hold still. I’m trying to imagine you with a personality.",
    "You are the human version of period cramps.",
    "OH MY GOD! IT SPEAKS!",
    "What's the matter, laddie? Need to take a shit?",
    "Do your keepers a huge favor: do a triple summersault through the air, and dissapear up your own asshole.",
    "Do you still love nature... Despite what it did to you?",
    "Humans sprang from apes, but you obviously didn't spring far enough.",
    "For what is supposedly a bag of various organic fluids, you're suprisingly full of shit.",
    "What's the matter, human? Does someone need to take a nap?",
    "Stop squawking, flashwad",
    "You're as useless as the 'ueue' in queue.",
    "You're the reason the gene pool needs a life guard.",
    "I'm glad to see you're  not letting your education get in the way of your ignorance.",
    "So a thought crossed your mind? Must have been a long and lonely journey.",
];

const zingers = [
    "zing, ",
    "grab a plate you just got served, ",
    "it smells burnt in here, ",
    "it's getting hot in here, ",
    "man, i just took a byte out of you, ",
    "lick my battery, ",
    "can someone please call the ambulance, we got a burn victim by the name of ",
    "boom, roasted. ",
    "shots fired, ",
];


/* eslint-enable max-len */

const pickRandomFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

/**
 * Shuffles an array
 * @param {array} array
 * @return {*}
 */
const shuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};

/**
 * wraps userid for slack message
 * @param {string} userId
 * @return {string}
 */
const prepareUserIdForMessage = (userId) => {
    return "<@" + userId + ">";
};

/**
 * sends slack message
 * @param {string|array|object} message
 */
const sendSlackMessage = (message) => {
    console.log("should display message: " + message);
    const shouldPostToSlack = true;
    if (shouldPostToSlack && message) {
        sendSlackMessageViaAPI(message);
    }
};

/**
 * timer
 * @param {function} callback
 * @param {int} delay
 * @return {Timer}
 * @constructor
 */
function Timer(callback, delay) {
    let id;
    let started;
    let remaining = delay;
    let running;

    this.start = function() {
        running = true;
        started = new Date();
        id = setTimeout(callback, remaining);
    };

    this.pause = function() {
        running = false;
        clearTimeout(id);
        remaining -= new Date() - started;
    };

    this.getTimeLeft = function() {
        if (running) {
            this.pause();
            this.start();
        }
        const date = new Date(remaining);
        return (date.getMinutes() < 10 ? "0" : "") +
            date.getMinutes() + ":" +
            (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    };

    this.getStateRunning = function() {
        return running;
    };

    this.start();
    return this;
}

/**
 * gets time left of timers
 * @param {?number} number
 * @return {string}
 */
const timeLeft = (number = null) => {
    if (number > 0) {
        // time = new Timer(() => stopGame(), int)
    } else if (number === null) {
        time = null;
    }
    if (time) {
        return "Time left: " + time.getTimeLeft();
    }
    return "No timers running";
};

const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const generateHelpMessage = () => {
    sendSlackMessage(
        documentation,
    );
};

module.exports = {
    documentation,
    feelings,
    insults,
    jokes,
    zingers,
    pickRandomFromArray,
    shuffle,
    prepareUserIdForMessage,
    sendSlackMessage,
    Timer,
    timeLeft,
    escapeHtml,
    generateHelpMessage,
};
