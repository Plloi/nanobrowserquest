import fetch from "node-fetch";

import { Sentry } from "./sentry";

const ChatChannel =
  process.env.NODE_ENV === "production"
    ? "https://discord.com/api/webhooks/979056276589908008/yeov0D7OSvqNp7o6G6Kb6qbm7hB1EnegcnwKRRmr9y-zpe9O_YRb77jS6Fe0URRaJ3NC"
    : "https://discord.com/api/webhooks/1058467103939760168/hXXbrpz6TvRtwDe7Zaa7F5S6f-8adAtzRUMKc0OVqLTO_wV-OdbfSLLVb_CQeeeY09et";

const AnvilChannel =
  process.env.NODE_ENV === "production"
    ? "https://discord.com/api/webhooks/1029352905574207519/VWeXf_oqwL3MENHwpkUqTQozlsJ6H_ui_g5m8CJtYRwSQIGQ-fVByJCUQ6q69y-cCki2"
    : "https://discord.com/api/webhooks/1058468070852657222/Opp46s9XNyUUyzUyZpm3Npi5kVh_EBldd1iRDNv7Ibkwr3TafAkpqnEmKnuz5jGgjF6p";

const postMessageToDiscordChatChannel = (content: string) => {
  try {
    const body = JSON.stringify({
      content,
    });

    fetch(ChatChannel, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    Sentry.captureException(err);
  }
};

const postMessageToDiscordAnvilChannel = (content: string) => {
  try {
    const body = JSON.stringify({
      content,
    });

    fetch(AnvilChannel, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    Sentry.captureException(err);
  }
};

const EmojiMap = {
  fire: "🔥",
  fireblue: "<:fireblue:1058822338763817101>",
  firepurple: "<:firepurple:1058822354672832524>",
  chestblue: "<:chestblue:1058504858212249600>",
  chestgreen: "<:chestgreen:1058508244202557541>",
  chestpurple: "<:chestpurple:1058508265224413264>",
  chestred: "<:chestred:1058508279313072191>",
  "rune-sat": "<:runesat:1059502573624770570>",
  "rune-al": "<:runeal:1059502447879532595>",
  "rune-bul": "<:runebul:1059502031997517984>",
  "rune-nan": "<:runenan:1059502014595338240>",
  "rune-mir": "<:runemir:1059501993296662738>",
  "rune-gel": "<:runegel:1059501080100229120>",
  "rune-do": "<:runedo:1059501054246522900>",
  "rune-ban": "<:runeban:1059501038140403803>",
  "rune-sol": "<:runesol:1059501018578173993>",
  "rune-um": "<:runeum:1059500988584693822>",
  "rune-hex": "<:runehex:1059499691697516554>",
  "rune-zal": "<:runezal:1059499657614589963>",
  "rune-vie": "<:runevie:1059499067987722340>",
  "rune-eth": "<:runeeth:1059498865620942899>",
  "rune-btc": "<:runebtc:1059498530164703232>",
  "rune-vax": "<:runevax:1059498511319711764>",
  "rune-por": "<:runepor:1059498489194762330>",
  "rune-las": "<:runelas:1059498443086778378>",
  "rune-cham": "<:runecham:1059497162267951235>",
  "rune-dur": "<:runedur:1059497139971031140>",
  "rune-xno": "<:runexno:1059497100515213333>",
  "rune-fal": "<:runefal:1059497074221142117>",
  "rune-kul": "<:runekul:1059497049705422929>",
  "rune-mer": "<:runemer:1059497027047804938>",
  "rune-qua": "<:runequa:1059497003073159329>",
  "rune-gul": "<:runegul:1059496975789215804>",
  "rune-ber": "<:runeber:1059496952888316055>",
  "rune-tor": "<:runetor:1059496922638995526>",
  "rune-jah": "<:runejah:1059496904079188100>",
  "rune-shi": "<:runeshi:1059496855794368583>",
  "rune-vod": "<:runevod:1059496817152241834>",
  ringnecromancer: "<:ringnecromancer:1059571078051151912>",
  ringraistone: "<:ringraistone:1059571079242338304>",
  ringfountain: "<:ringfountain:1059571073785536512>",
  ringminotaur: "<:ringminotaur:1059571075857522803>",
  ringmystical: "<:ringmystical:1059571076608311327>",
  ringbalrog: "<:ringbalrog:1059571071872937984>",
  ringconqueror: "<:ringconqueror:1059571072766328852>",
  ringheaven: "<:ringheaven:1059571075056418896>",
  ringwizard: "<:ringwizard:1059571142899273728>",
  amuletcow: "<:amuletcow:1059572661354778774>",
  amuletfrozen: "<:amuletfrozen:1059572663099588760>",
  amuletdemon: "<:amuletdemon:1059572662239768727>",
  amuletmoon: "<:amuletmoon:1059572664366280754>",
};

export { postMessageToDiscordChatChannel, postMessageToDiscordAnvilChannel, EmojiMap };
