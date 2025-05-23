const axios = require('axios');

const collectionMetadata = {
    "0x6341c537a6fc563029d8e8caa87da37f227358f4": {
        name: "Molandaks Mint Pass",
        supply: 555,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf0jOQq8T9k%252BwOP%252BTDkaDKIeRgROKtkywq64n77%252FPBdQjCVuj9DmstCK4lIJELon%252BuQqn5CzpaHHgLpA5J%252FHZL3Nmh%252FBb2xses90TKFCKKNbH",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x6341c537a6fc563029d8e8caa87da37f227358f4?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/MonadPad",
        discord: "https://discord.com/invite/mpad"
    },
    "0xc5c9425d733b9f769593bd2814b6301916f91271": {
        name: "Purple Frens",
        supply: 1111,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf6b0%252F9xrEoNQAVxX6v3MP7NAkwSLId7QPBB5F%252FdOhyaZoQPZMYvDC1NGGf32jEhlM7hTOt5zfyCyxFAnm5VKop0FYj0CrD2zJn%252FbBln2AIga",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xc5c9425d733b9f769593bd2814b6301916f91271?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/MonadPad",
        discord: "https://discord.com/invite/mpad"
    },
    "0xe6b5427b174344fd5cb1e3d5550306b0055473c6": {
        name: "Chogs Mystery Chest",
        supply: 888,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2F%252BF4uAprNqLw%252FUAbX2wIMCIbzjvo%252F02w509ovJwckv%252BrXQgCbx1aPZ8%252FfXcoWvWJMb42SAJUYtod5j6Az5PvjRCTu92TUXD1r2ZHD18JxltRv4Diqkf4l%252FpmFIDb9YFeawlE6%252BoSA9mmWAnizn6Wk8g%253D%253D",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xe6b5427b174344fd5cb1e3d5550306b0055473c6?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/ChogNFT",
        discord: "discord.gg/chog"
    },
    "0xe8f0635591190fb626f9d13c49b60626561ed145": {
        name: "Skrumpets",
        supply: 499,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2FxGIQsppdhx9jPELiWEASU%252FjUqyN30zbMlUWyRD8eC9mBC4Xx9S%252FMOnyJExVCFyjSd2mbq5cmkbR%252BjI1pJtmvMnm21z7MQpjYT8IxahQ%252BSQknrg%252F1OklbvJTs0Q4rc7gBCmt8I%252FdUU6K%252F%252FJErLfgzOw%253D%253D",
        marketplaceLink: "",
        verified: true,
        twitter: "https://x.com/skrumpeys",
        discord: ""
    },
    "0x87e1f1824c9356733a25d6bed6b9c87a3b31e107": {
        name: "Spikes",
        supply: 3333,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf0aTPGa7dMbaoJpVINCUIuTbYpz%252FAM0ZI38bbmW5peeVIgH4fvhO%252Fqgc3c%252Bvqag4utIVFcylE0oHY%252Bz0sS4qeqGr1xW%252BSbXlJkImE0K8ke9V5W54iuvOLtY6FXTTK4A8kQ%253D%253D",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x87e1f1824c9356733a25d6bed6b9c87a3b31e107?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/spikynads",
        discord: "discord.gg/spikynads"
    },
    "0x3a9454c1b4c84d1861bb1209a647c834d137b442": {
        name: "The10kSquad",
        supply: 10000,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf3cccIjRlA2NlR5AuAKMCuuPw6WrNC2w%252FV%252Fb%252F2l32va1FLYKKZzNK1N%252BBGInMzwWfGUWGnEnuIOB5r5LBCPpPOZGk%252BE28yz5kFPiYiF13gS6",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x3a9454c1b4c84d1861bb1209a647c834d137b442?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/the10kSquad",
        discord: "discord.gg/the10ksquad"
    },
    "0x4870e911b1986c6822a171cdf91806c3d44ce235": {
        name: "Sealuminati Testnetooor",
        supply: 6669,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvfwRi7c1jXQgk4tzm02WseL6R5AXn2aSsBYbeQBLH8540BvDRYAwrtrvOafppCN28NIpBBZQK%252FcVrD0hnVWpGzHbjNy%252BlJtwQzE6SIhC4gdrA",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x4870e911b1986c6822a171cdf91806c3d44ce235?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/sealuminati",
        discord: "https://discord.com/invite/VP5Tt5ccjb"
    },
    "0xb03b60818fd7f391e2e02c2c41a61cff86e4f3f5": {
        name: "Beannad",
        vaccine: 5555,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2FUk7PUcY7rj0zEmx18j3mTRStUJ5XhZNvoIIe%252B2JzyFMbZGo4OpunCg3%252Bhf8I20M7KxAERmAU%252F%252BqcFGsb2uCLydnJGnA8dD3L4tKGCLpfW1fCq9I9aKFv%252Fl49TUTPmKz%252FUTDn2jqndIDapvxnM2YlXMhantTfQ66aRlOUgy5cGATyYEZ8YynclCbtndpwqJYsrs3xqeYiiuby1nhWBByRujdYnPBRy%252BRDZNmVxH3yGYGjK9okdu%252BUtu%252FIznGD560w%252BjSMlxh1FUFnd7nc371q3AvI2%252FNiR1Gqn8HBrtiMeAOFonkFXX9WCteojlTMiM3W",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xb03b60818fd7f391e2e02c2c41a61cff86e4f3f5?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/Bean_DEX",
        discord: "https://discord.com/invite/beanex"
    },
    "0x78ed9a576519024357ab06d9834266a04c9634b7": {
        name: "TheDaks",
        supply: 1550,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf5%252FEEjhsBi2TXBlrzvV3uC41QPySPXqGEXirnaA47%252BHziZD5H2zdh9AquCJk%252FwPL%252BlKU6TtUnF7lwfMbPHMjPi3QdSJOZP2sla59D4GQ4O7BJePi5gIYEGPm%252FCP%252FW6VVWg%253D%253D",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x78ed9a576519024357ab06d9834266a04c9634b7?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/thedaks_png",
        discord: "https://discord.com/invite/thedaks"
    },
    "0x88bbcba96a52f310497774e7fd5ebadf0ece21fb": {
        name: "Chewy",
        supply: 1222,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2FrSNTYhb5erNxjAvRIO43VgXzddRzWXfhG%252F15Qa2AQUXst%252BWKmPQ8zRLBH8ZMOW7IRO1UaQD%252F6Zne9%252FZjP8KNLSylkMlW%252Bg6TDDuYe95opcmSRiDjzxXQ6hh%252BaLirWB95fyaEOVEQ3iq0ntosfUfT4A%253D%253D",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x88bbcba96a52f310497774e7fd5ebadf0ece21fb?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/Chewy_xyz",
        discord: "discord.gg/chewymonad"
    },
    "0xed52e0d80f4e7b295df5e622b55eff22d262f6ed": {
        name: "r3tards",
        supply: 333,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf4WPrHCCGCqUbV1Hr0X%252FZBz9Tr%252FzOZq1kggtoCUL9yuF5%252FJPZnRkqUlPGsgqtXqOliQZIPvJCJ35ud6QNk%252B5TfwFL7%252FCM1pivoLSXENmOpDo",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xed52e0d80f4e7b295df5e622b55eff22d262f6ed?status=%22magic_eden%22",
        verified: true,
        twitter: "",
        discord: ""
    },
    "0x89431f71352afb1f62637556224203460751957e": {
        name: "Exo Spirits",
        supply: 3333,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf8N1lu4jeDfyXYLwXCVzIKqc426tPrHiTz31g4%252FbGOrABQlGsAM8YVPhZVge2%252BgoU92G5dg8Kf3x4nUW%252BT%252BcAJIHRbNOJiBVtoMZi1fubJje",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x89431f71352afb1f62637556224203460751957e?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/ExoSpiritsNft",
        discord: ""
    },
    "0xb600de0ebee70af4691dbf8a732be7791b6ce73a": {
        name: "Mop Nads",
        supply: 9002,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf%252F1li8WI3vxGuO%252B8WrSrmZ1rexeOzIAGLg6YcU7POgpH8a%252F9S0%252FPbDhDfOeHBPAKnCpUm%252F6CMyEiKUbr6zKM74ZOF2zv%252BZR9QXuTSeSMZBiC",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xb600de0ebee70af4691dbf8a732be7791b6ce73a?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/mopwtf",
        discord: ""
    },
    "0xd22385e223eff3b3b30a74874055b260a287a592": {
        name: "Moyakinads",
        supply: 444,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf5SQux6z%252Fz63B3Hd89EwY%252BwJiyeAkuSzq1WDMpsRKomdtJV7dS0U0zeN0sD8luv4cGXkw9UJMb4YApo62hinfeMtRNSzQ9XjfWCqxrnxrJ%252Br",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xd22385e223eff3b3b30a74874055b260a287a592?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/MOYAKI_XYZ",
        discord: ""
    },
    "0x7ea266cf2db3422298e28b1c73ca19475b0ad345": {
        name: "Mutated Monadsters",
        supply: 222,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2FrSNTYhb5erNxjAvRIO43Vr%252BZ1LStI1VoQ4P5ib1oQfF0cfuED5GwnAPxgJIHrOq%252B2mJ2v%252FM%252FzxGnt47FKNK6P7ArSDUDr%252BvBL%252Bz6s%252FJHQ4xxpNukZ7BVehyZuKrA8rjhRe%252FWXwF8%252BPOFhp9wFDiSHA%253D%253D",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x7ea266cf2db3422298e28b1c73ca19475b0ad345?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/Monadsters",
        discord: "discord.gg/monadsters"
    },
    "0xaebd98e511b79fc5314910187cc18e9abf15808f": {
        name: "the billies",
        supply: 3333,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf2wyIRVtjC0MdzLN%252F0m5JKzw1h%252BZCHLGLxbG3s4yf%252FpU63iJl3FBdhMUYHY6W6sp7XfB7LJT5jggQkhJ4dLM6Ij0fpxo4KpZrXM7Jzm8lXD6",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xaebd98e511b79fc5314910187cc18e9abf15808f",
        verified: false,
        twitter: "",
        discord: ""
    },
    "0x800f8cacc990dda9f4b3f1386c84983ffb65ce94": {
        name: "LaMouchNFT",
        supply: 10000,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fhc%252BnPcLmWxs%252FDW99DlBQ42k40ZoyYV5jCIms5qHjwvswC0zr%252BNgXbN8GZEYwrKJrA62Wf7ZMu3%252BeAKx%252Fjze3bRrJt34jiDpBG7szFi9vhfYmlH1vDK0HEVpPW26HsAMHfUHWCHyTWq%252FGzQaYrtR5otyeGrReziPWmeD6UtEWBWAwhn3ojJINO6thM9xh1EsFHvmRBFJMilTyP2TK41D%252FtQ%253D%253D",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x800f8cacc990dda9f4b3f1386c84983ffb65ce94?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/LaMouchNFT",
        discord: "discord.gg/lamouch"
    },
    "0x69f2688abe5dcde0e2413f77b80efcc16361a56e": {
        name: "Monshape Hopium",
        supply: 1111,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf5OgR%252FoHbMjC9I2Khwfct%252FRRa5MMUHsdgfxBK21xbV7ZtUyTpeM9rapeHiB4xRgq5YBUMddMH2Xwj74ChTezVCTbP7cCPlUOzUNvFahm1FyX",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x69f2688abe5dcde0e2413f77b80efcc16361a56e?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/Monshape",
        discord: "https://discord.com/invite/monshape"
    },
    "0x42ebb45dbfb74d7aedbddc524cad36e08b4c0022": {
        name: "C Family",
        supply: 300,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf3u%252FgaHy5yBbC5Pa0J5PaMxsvmXkpeg0rmZeS5i0QvC6tb9yBQLDGjuB0skiUo6IZsK5au0KnncYzdK5jCfZmdgzYgJAEdK98RSK3PvWQgTi",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x42ebb45dbfb74d7aedbddc524cad36e08b4c0022?status=%22magic_eden%22",
        verified: false,
        twitter: "https://x.com/csfmly",
        discord: "discord.gg/c-family"
    },
    "0x9ac5998884cf59d8a87dfc157560c1f0e1672e04": {
        name: "Monad Nomads",
        supply: 500,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf3CQ7IYhMVraa5bhYSUlyRQN%252Flv%252BqHJuZZM6jxgpxyRjl1%252F0WRLF592POpVl%252BY7cYCY2m%252FJGE7tj5aQ%252BFHoOKzdm3eSSOuff4njEfvoLtpTl",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x9ac5998884cf59d8a87dfc157560c1f0e1672e04?status=%22magic_eden%22",
        verified: false,
        twitter: "https://x.com/MonadNomadsNFT",
        discord: "discord.gg/monadnomads"
    },
    "0xd6421e9c72199e971e5a3cde09214054e1216cd2": {
        name: "Mondana Baddies Eye Chain",
        supply: 150,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf6cPk1akTc61xtxZv62aDIl%252B2ZB25eP7B%252BvGiUM4KPYoUSaOsaED5yxwkGSPVgbI4S2FjszmpklpFLim%252BNMRpGoAF9GnuvfhorFwJ26okwLa",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xd6421e9c72199e971e5a3cde09214054e1216cd2?status=%22magic_eden%22",
        verified: false,
        twitter: "https://x.com/mondanabaddies",
        discord: ""
    },
    "0x3ff5ab5eea49d25ab00b532e9e50b17d5218068c": {
        name: "BOBR",
        supply: 777,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf6CtmqCtlttAaqp67O7fOuu5R1KvplXAkymLbb6Ia1dQE0FUHcsBaRTcmVGLS3NB5jb9u%252BWKvngsXu3GOVe8uo%252FONlhcWSfaoSZYOAZ7JRE7",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x3ff5ab5eea49d25ab00b532e9e50b17d5218068c?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/Bober_xyz",
        discord: "discord.gg/rRe9AMUS"
    },
    "0x66e40f67afd710386379a6bb24d00308f81c183f": {
        name: "Molandaks",
        supply: 300,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf6WiVu5CvKINUl0tcWztjdJ%252BdKJ2waS5%252B%252FEEGLvS9bQ%252FFywVc%252FVD16Eg8GXAK3toMhMSxvFjArLsfWGNrpe2%252BcF73V0cnCkL8ZAnt4kf4DJt",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x66e40f67afd710386379a6bb24d00308f81c183f?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/MonadPad",
        discord: "https://discord.com/invite/mpad"
    },
    "0xa568cabe34c8ca0d2a8671009ae0f6486a314425": {
        name: "Meowwnads",
        supply: 5000,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf01Lgo839PtcF3Qq8lrMACsY2Fno6EyVLG%252BNQT0hHMNVR7H7gSrzQfXeUdfpBxBia92gO7r5CqbbwmlXY%252Fy1J%252F7%252BUhKs9DouOuaXPFge%252FgVb",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xa568cabe34c8ca0d2a8671009ae0f6486a314425?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/meowwnads",
        discord: "discord.gg/meowwnads"
    },
    "0x3db6c11474893689cdb9d7cdedc251532cadf32b": {
        name: "Mecha Box Mint Pass",
        supply: 300,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fbafybeidcpazhdbbnbpubez3fs6ae67dc5zh6bsg4cwnzae4ybzrkewti3u.ipfs.dweb.link%2F",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x3db6c11474893689cdb9d7cdedc251532cadf32b?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/Chewy_xyz",
        discord: "discord.gg/chewymonad"
    },
    "0x26c86f2835c114571df2b6ce9ba52296cc0fa6bb": {
        name: "Lil Chogstars",
        supply: 131,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2F%252BF4uAprNqLw%252FUAbX2wIMCCDOrSMYnuquZ7uLfI8jfCPx91ji8y8t28ju7WegcOBEsQLRSAiSOMA7ZurgZAhJ3AA67Rq0%252BZO1NuXhfxuje7tsQOVTtxZ1gIq9RRIa64oWT8z0aA577xll1PUwCpHISw%253D%253D",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x26c86f2835c114571df2b6ce9ba52296cc0fa6bb?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/chogstarrr",
        discord: "https://discord.com/invite/chogstars"
    },
    "0x49d54cd9ca8c5ecadbb346dc6b4e31549f34e405": {
        name: "Overnads: Whitelist Pass",
        supply: 178,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2FO1GmUbX%252FvNODx2ebXhWa13YNaLqlU1ap4vRPu9NeHK1a0owFF3TAnFPHmWE1asq0O9SBzFBg2lv0AJyrrwIBEkXzq4U6A4o%252FD3DGncPUZ7nNgPnggI48%252BjnaBUqNUSchKnQ2hvc0RuOt%252FLonB6i96A%253D%253D",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0x49d54cd9ca8c5ecadbb346dc6b4e31549f34e405?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/overnads",
        discord: "https://discord.com/invite/overnads"
    },
    "0xf7b984c089534ff656097e8c6838b04c5652c947": {
        name: "SLMND Genesis",
        supply: 4200,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvfwQe3DDngEKpSL6q7fhwMIHqgkmogrRYX6AK4G%252FAus2fRPeTO2jx3B03Ir5DCl%252FGC%252FVVO9VmavGwtQeM0ZBsL9hYuQIPgX%252FvS63vZfFJ6YOz",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xf7b984c089534ff656097e8c6838b04c5652c947?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/slmndNFT",
        discord: ""
    },
    "0xce49fc8ad0618931265a7cc6d859649af92a9d03": {
        name: "OCTONADS OCTOG PASS",
        supply: 999,
        image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvfz%252FRtpSfYkUQgyuckXmxGPedaq8fc1ugMCFpoehqSDMKgeQHZzWPTRmebcG2VFtLKw2X3R1hpGmxPB3KlPOACp3szax5u93vISCtJ0yhuSMV",
        marketplaceLink: "https://magiceden.io/collections/monad-testnet/0xce49fc8ad0618931265a7cc6d859649af92a9d03?status=%22magic_eden%22",
        verified: true,
        twitter: "https://x.com/OctoNads",
        discord: "https://discord.gg/C6EefTRpzd"
    },
};

exports.handler = async (event) => {
  const { contractAddress, pageSize = 100 } = event.queryStringParameters || {}; // Increase default pageSize

  if (!contractAddress) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing contractAddress parameter' }),
    };
  }

  const pageSizeNum = parseInt(pageSize, 10);
  if (isNaN(pageSizeNum) || pageSizeNum < 1 || pageSizeNum > 1000) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid pageSize (must be between 1 and 100)' }),
    };
  }

  try {
    const baseURL = 'https://monad-testnet.g.alchemy.com/nft/v2/GZmCJtp1FQLv4t2oYDeN2q1BkbruCPgb/getOwnersForCollection';
    const params = new URLSearchParams({
      contractAddress: encodeURIComponent(contractAddress),
      withTokenBalances: 'true',
      pageSize: pageSizeNum.toString(),
    });
    let holders = [];
    let pageKey = null;
    let attemptCount = 0;
    const maxAttempts = 10; // Prevent infinite loops

    do {
      let url = `${baseURL}?${params.toString()}`;
      if (pageKey) {
        url += `&pageKey=${encodeURIComponent(pageKey)}`;
      }

      console.log(`Fetching: ${url}`);
      try {
        const response = await axios.get(url, { timeout: 15000 }); // Increase timeout
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data;
        if (!data.ownerAddresses || !Array.isArray(data.ownerAddresses)) {
          console.warn('Invalid API response: ownerAddresses field missing or not an array');
          break; // Exit loop if no valid data
        }

        const pageHolders = data.ownerAddresses.map(owner => {
          const amount = owner.tokenBalances?.reduce((sum, tb) => sum + parseInt(tb.balance, 10), 0) || 0;
          return { ownerAddress: owner.ownerAddress, amount };
        });

        holders = holders.concat(pageHolders);
        pageKey = data.pageKey || null;
        attemptCount++;

        // Add delay to avoid rate limiting
        if (pageKey) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (pageError) {
        console.error(`Error fetching page ${pageKey || 'initial'}:`, pageError.message);
        if (attemptCount >= maxAttempts) {
          throw new Error('Max retry attempts reached for fetching holders');
        }
        // Retry after a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } while (pageKey && attemptCount < maxAttempts);

    const metadata = collectionMetadata[contractAddress.toLowerCase()] || null;

    return {
      statusCode: 200,
      body: JSON.stringify({ holders, metadata, totalHolders: holders.length }),
    };
  } catch (error) {
    console.error(`Error fetching holders for ${contractAddress}:`, error.message);
    if (error.response) {
      console.error('API Error Response:', JSON.stringify(error.response.data));
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to fetch holders' }),
    };
  }
};