import { useState, useCallback } from "react";

// ── DATA LAST UPDATED: May 8, 2026 ─────────────────────────────────────────
// Sources: SportRadar live box scores, Underdog Fantasy, SI.com, FOX Sports, CBS SportsLine
// Series: NYK leads PHI 2-0 | SAS leads MIN 1-1 | DET leads CLE 1-0 | OKC leads LAL 1-0

const PLAYERS_DATA = {
  // ── NEW YORK KNICKS ──────────────────────────────────────────────────────────
  "Jalen Brunson":           { team:"NYK", pos:"G", opp:"PHI", game:"phi-nyk", injury:null,  lines:{pts:32.5,reb:3.5,ast:7.5,pra:43.5}, stats:[{pts:26,reb:1,ast:6,pra:33,g:"G2 vs PHI"},{pts:35,reb:2,ast:3,pra:40,g:"G1 vs PHI"},{pts:31,reb:4,ast:8,pra:43,g:"G6 vs ATL"},{pts:29,reb:5,ast:10,pra:44,g:"G5 vs ATL"},{pts:33,reb:3,ast:7,pra:43,g:"G4 vs ATL"}], ctx:"26 pts G2 (under). Averaged 30.5 PPG this series. PHI MORE competitive in G3 at home — expect bounce-back" },
  "OG Anunoby":              { team:"NYK", pos:"F", opp:"PHI", game:"phi-nyk", injury:null,  lines:{pts:18.5,reb:5.5,ast:2.5,pra:26.5}, stats:[{pts:24,reb:5,ast:2,pra:31,g:"G2 vs PHI"},{pts:18,reb:3,ast:1,pra:22,g:"G1 vs PHI"},{pts:24,reb:9,ast:3,pra:36,g:"G6 vs ATL"},{pts:21,reb:8,ast:2,pra:31,g:"G5 vs ATL"},{pts:19,reb:7,ast:3,pra:29,g:"G4 vs ATL"}], ctx:"24 pts + 4 steals in G2. Hit over pts line 4 of last 5. On fire this postseason" },
  "Karl-Anthony Towns":      { team:"NYK", pos:"C", opp:"PHI", game:"phi-nyk", injury:null,  lines:{pts:20.5,reb:9.5,ast:5.5,pra:35.5}, stats:[{pts:20,reb:10,ast:7,pra:37,g:"G2 vs PHI"},{pts:17,reb:6,ast:6,pra:29,g:"G1 vs PHI"},{pts:22,reb:10,ast:6,pra:38,g:"G6 vs ATL"},{pts:19,reb:11,ast:5,pra:35,g:"G5 vs ATL"},{pts:26,reb:12,ast:8,pra:46,g:"G4 vs ATL"}], ctx:"20/10/7 in G2 — double-double machine. 7 ast in G2 crushes that line. Averaged 11.9 reb in reg season" },
  "Josh Hart":               { team:"NYK", pos:"G-F", opp:"PHI", game:"phi-nyk", injury:null, lines:{pts:9.5,reb:8.5,ast:4.5,pra:22.5}, stats:[{pts:5,reb:7,ast:6,pra:18,g:"G2 vs PHI"},{pts:13,reb:12,ast:5,pra:30,g:"G1 vs PHI"},{pts:10,reb:11,ast:3,pra:24,g:"G6 vs ATL"},{pts:12,reb:9,ast:4,pra:25,g:"G5 vs ATL"},{pts:8,reb:10,ast:3,pra:21,g:"G4 vs ATL"}], ctx:"6 ast in G2 crushes ast line. Reb line (8.5) — had 7 in G2 (UNDER). Motor player, every rebound counts" },
  "Mikal Bridges":           { team:"NYK", pos:"F", opp:"PHI", game:"phi-nyk", injury:null,  lines:{pts:15.5,reb:4.5,ast:2.5,pra:22.5}, stats:[{pts:18,reb:5,ast:2,pra:25,g:"G2 vs PHI"},{pts:14,reb:3,ast:2,pra:19,g:"G1 vs PHI"},{pts:18,reb:5,ast:4,pra:27,g:"G6 vs ATL"},{pts:15,reb:4,ast:3,pra:22,g:"G5 vs ATL"},{pts:13,reb:6,ast:2,pra:21,g:"G4 vs ATL"}], ctx:"18 pts in G2, hit over pts in 4 of 5. Consistent scorer getting easier looks in transition" },

  // ── PHILADELPHIA 76ERS ───────────────────────────────────────────────────────
  "Tyrese Maxey":            { team:"PHI", pos:"G", opp:"NYK", game:"phi-nyk", injury:null,  lines:{pts:25.5,reb:3.5,ast:5.5,pra:34.5}, stats:[{pts:26,reb:3,ast:6,pra:35,g:"G2 vs NYK"},{pts:13,reb:2,ast:2,pra:17,g:"G1 vs NYK"},{pts:29,reb:3,ast:7,pra:39,g:"G7 vs BOS"},{pts:32,reb:4,ast:5,pra:41,g:"G6 vs BOS"},{pts:21,reb:3,ast:6,pra:30,g:"G5 vs BOS"}], ctx:"Bounced back with 26 in G2 after 13 in G1. G3 at HOME in Philly — Maxey historically better at home. Embiid likely OUT again" },
  "Joel Embiid":             { team:"PHI", pos:"C", opp:"NYK", game:"phi-nyk", injury:"⚠️ OUT — Hip/Ankle", lines:{pts:27.5,reb:10.5,ast:4.5,pra:42.5}, stats:[{pts:0,reb:0,ast:0,pra:0,g:"DNP G1+G2"},{pts:31,reb:10,ast:5,pra:46,g:"G7 vs BOS"},{pts:35,reb:12,ast:3,pra:50,g:"G6 vs BOS"},{pts:27,reb:8,ast:4,pra:39,g:"G5 vs BOS"},{pts:30,reb:9,ast:4,pra:43,g:"G4 vs BOS"}], ctx:"🚫 OUT — missed both G1 and G2. Expected OUT for G3. All props OFF the board" },
  "Paul George":             { team:"PHI", pos:"F", opp:"NYK", game:"phi-nyk", injury:null,  lines:{pts:19.5,reb:5.5,ast:4.5,pra:29.5}, stats:[{pts:19,reb:6,ast:4,pra:29,g:"G2 vs NYK"},{pts:17,reb:3,ast:3,pra:23,g:"G1 vs NYK"},{pts:22,reb:7,ast:4,pra:33,g:"G7 vs BOS"},{pts:24,reb:6,ast:5,pra:35,g:"G6 vs BOS"},{pts:18,reb:5,ast:3,pra:26,g:"G5 vs BOS"}], ctx:"19 pts/6reb/4ast in G2. Usage massive with Embiid OUT. Will be PHI's primary option on G3 home court" },
  "VJ Edgecombe":            { team:"PHI", pos:"G", opp:"NYK", game:"phi-nyk", injury:null,  lines:{pts:14.5,reb:4.5,ast:2.5,pra:21.5}, stats:[{pts:17,reb:5,ast:3,pra:25,g:"G2 vs NYK"},{pts:8,reb:2,ast:1,pra:11,g:"G1 vs NYK"},{pts:12,reb:3,ast:2,pra:17,g:"G7 vs BOS"},{pts:10,reb:4,ast:2,pra:16,g:"G6 vs BOS"},{pts:14,reb:3,ast:2,pra:19,g:"G5 vs BOS"}], ctx:"Rookie breakout — 17 pts in G2 on 42.9% FG. Getting big minutes with Embiid out. Line undervalued at 14.5" },
  "Kelly Oubre Jr.":         { team:"PHI", pos:"F", opp:"NYK", game:"phi-nyk", injury:null,  lines:{pts:13.5,reb:4.5,ast:1.5,pra:19.5}, stats:[{pts:19,reb:5,ast:2,pra:26,g:"G2 vs NYK"},{pts:8,reb:3,ast:2,pra:13,g:"G1 vs NYK"},{pts:14,reb:5,ast:2,pra:21,g:"G7 vs BOS"},{pts:11,reb:4,ast:1,pra:16,g:"G6 vs BOS"},{pts:9,reb:3,ast:1,pra:13,g:"G5 vs BOS"}], ctx:"Exploded for 19 pts (50% FG, 3 threes) in G2. Role inflated with Embiid OUT. Hit over pts line 3 of last 5" },
  "Andre Drummond":          { team:"PHI", pos:"C", opp:"NYK", game:"phi-nyk", injury:null,  lines:{pts:8.5,reb:9.5,ast:1.5,pra:19.5}, stats:[{pts:6,reb:8,ast:1,pra:15,g:"G2 vs NYK"},{pts:4,reb:6,ast:0,pra:10,g:"G1 vs NYK"},{pts:8,reb:10,ast:1,pra:19,g:"G7 vs BOS"},{pts:10,reb:11,ast:1,pra:22,g:"G6 vs BOS"},{pts:7,reb:9,ast:1,pra:17,g:"G5 vs BOS"}], ctx:"Starting center now with Embiid OUT. 8+ reb in 3 of last 5 — reb line (9.5) is the key play" },

  // ── DETROIT PISTONS ──────────────────────────────────────────────────────────
  "Cade Cunningham":         { team:"DET", pos:"G", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:27.5,reb:5.5,ast:9.5,pra:42.5}, stats:[{pts:28,reb:5,ast:9,pra:42,g:"G1 vs CLE"},{pts:31,reb:6,ast:11,pra:48,g:"G7 vs ORL"},{pts:26,reb:4,ast:8,pra:38,g:"G6 vs ORL"},{pts:24,reb:5,ast:9,pra:38,g:"G5 vs ORL"},{pts:29,reb:7,ast:10,pra:46,g:"G4 vs ORL"}], ctx:"27.6 PPG avg in playoffs. 9 ast in G1. Runs the show — DET up 1-0, expect him to close it out in G2 at home" },
  "Ausar Thompson":          { team:"DET", pos:"F", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:13.5,reb:10.5,ast:5.5,pra:29.5}, stats:[{pts:16,reb:10,ast:5,pra:31,g:"G1 vs CLE"},{pts:15,reb:15,ast:6,pra:36,g:"G7 vs ORL"},{pts:10,reb:10,ast:6,pra:26,g:"G6 vs ORL"},{pts:12,reb:15,ast:6,pra:33,g:"G5 vs ORL"},{pts:14,reb:12,ast:5,pra:31,g:"G4 vs ORL"}], ctx:"16/10/5 in G1. Hit reb OVER in 5 of 5 recent games. Elite athlete — boards come naturally" },
  "Jalen Duren":             { team:"DET", pos:"C", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:13.5,reb:11.5,ast:2.5,pra:27.5}, stats:[{pts:14,reb:12,ast:2,pra:28,g:"G1 vs CLE"},{pts:18,reb:14,ast:3,pra:35,g:"G7 vs ORL"},{pts:12,reb:10,ast:2,pra:24,g:"G6 vs ORL"},{pts:16,reb:13,ast:1,pra:30,g:"G5 vs ORL"},{pts:10,reb:11,ast:2,pra:23,g:"G4 vs ORL"}], ctx:"Hit reb OVER in 4 of 5. Double-double machine. CLE plays undersized — favorable matchup" },
  "Malik Beasley":           { team:"DET", pos:"G", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:13.5,reb:2.5,ast:1.5,pra:17.5}, stats:[{pts:14,reb:3,ast:2,pra:19,g:"G1 vs CLE"},{pts:18,reb:2,ast:1,pra:21,g:"G7 vs ORL"},{pts:12,reb:3,ast:2,pra:17,g:"G6 vs ORL"},{pts:16,reb:2,ast:1,pra:19,g:"G5 vs ORL"},{pts:11,reb:3,ast:2,pra:16,g:"G4 vs ORL"}], ctx:"Hit pts over in 4 of 5. DET home court advantage G2 — Beasley feeds off crowd energy" },
  "Tim Hardaway Jr.":        { team:"DET", pos:"G-F", opp:"CLE", game:"det-cle", injury:null, lines:{pts:12.5,reb:2.5,ast:1.5,pra:16.5}, stats:[{pts:13,reb:3,ast:2,pra:18,g:"G1 vs CLE"},{pts:11,reb:2,ast:1,pra:14,g:"G7 vs ORL"},{pts:16,reb:4,ast:2,pra:22,g:"G6 vs ORL"},{pts:9,reb:2,ast:2,pra:13,g:"G5 vs ORL"},{pts:14,reb:3,ast:1,pra:18,g:"G4 vs ORL"}], ctx:"Streaky scorer, solid G1 showing. Hit pts over 3 of 5 games" },
  "Tobias Harris":           { team:"DET", pos:"F", opp:"CLE", game:"det-cle", injury:null,  lines:{pts:11.5,reb:5.5,ast:2.5,pra:19.5}, stats:[{pts:12,reb:5,ast:2,pra:19,g:"G1 vs CLE"},{pts:14,reb:7,ast:3,pra:24,g:"G7 vs ORL"},{pts:10,reb:6,ast:2,pra:18,g:"G6 vs ORL"},{pts:13,reb:5,ast:2,pra:20,g:"G5 vs ORL"},{pts:9,reb:4,ast:2,pra:15,g:"G4 vs ORL"}], ctx:"High floor veteran role player. DET closing out at home means heavy starter minutes" },

  // ── CLEVELAND CAVALIERS ──────────────────────────────────────────────────────
  "Donovan Mitchell":        { team:"CLE", pos:"G", opp:"DET", game:"det-cle", injury:null,  lines:{pts:28.5,reb:4.5,ast:6.5,pra:39.5}, stats:[{pts:28,reb:4,ast:6,pra:38,g:"G1 vs DET"},{pts:33,reb:5,ast:7,pra:45,g:"G7 vs TOR"},{pts:31,reb:4,ast:8,pra:43,g:"G6 vs TOR"},{pts:24,reb:6,ast:5,pra:35,g:"G5 vs TOR"},{pts:36,reb:3,ast:6,pra:45,g:"G4 vs TOR"}], ctx:"30.4 PPG playoff avg. CLE MUST WIN G2 — Mitchell will be aggressive on road at DET. Bounce back game coming" },
  "Darius Garland":          { team:"CLE", pos:"G", opp:"DET", game:"det-cle", injury:null,  lines:{pts:20.5,reb:3.5,ast:8.5,pra:32.5}, stats:[{pts:22,reb:3,ast:8,pra:33,g:"G1 vs DET"},{pts:26,reb:4,ast:9,pra:39,g:"G7 vs TOR"},{pts:19,reb:3,ast:7,pra:29,g:"G6 vs TOR"},{pts:24,reb:2,ast:10,pra:36,g:"G5 vs TOR"},{pts:21,reb:4,ast:8,pra:33,g:"G4 vs TOR"}], ctx:"8+ assists in 4 of last 5 games. Assist line (8.5) is beatable — he's averaging 8.4 this postseason" },
  "Evan Mobley":             { team:"CLE", pos:"F-C", opp:"DET", game:"det-cle", injury:null, lines:{pts:16.5,reb:9.5,ast:3.5,pra:29.5}, stats:[{pts:16,reb:9,ast:3,pra:28,g:"G1 vs DET"},{pts:19,reb:11,ast:4,pra:34,g:"G7 vs TOR"},{pts:14,reb:10,ast:2,pra:26,g:"G6 vs TOR"},{pts:18,reb:8,ast:3,pra:29,g:"G5 vs TOR"},{pts:22,reb:12,ast:3,pra:37,g:"G4 vs TOR"}], ctx:"Hit reb OVER in 4 of 5. Key frontcourt vs Duren. CLE needs him for any shot at G2 win" },
  "Jarrett Allen":           { team:"CLE", pos:"C", opp:"DET", game:"det-cle", injury:null,  lines:{pts:10.5,reb:9.5,ast:2.5,pra:22.5}, stats:[{pts:11,reb:10,ast:2,pra:23,g:"G1 vs DET"},{pts:14,reb:12,ast:3,pra:29,g:"G7 vs TOR"},{pts:9,reb:9,ast:1,pra:19,g:"G6 vs TOR"},{pts:12,reb:11,ast:2,pra:25,g:"G5 vs TOR"},{pts:8,reb:8,ast:1,pra:17,g:"G4 vs TOR"}], ctx:"Double-double candidate. Hit both pts + reb over in 3 of 5. Battle with Duren all series" },
  "Georges Niang":           { team:"CLE", pos:"F", opp:"DET", game:"det-cle", injury:null,  lines:{pts:8.5,reb:3.5,ast:1.5,pra:13.5}, stats:[{pts:9,reb:3,ast:2,pra:14,g:"G1 vs DET"},{pts:12,reb:4,ast:1,pra:17,g:"G7 vs TOR"},{pts:8,reb:2,ast:2,pra:12,g:"G6 vs TOR"},{pts:11,reb:3,ast:1,pra:15,g:"G5 vs TOR"},{pts:7,reb:2,ast:2,pra:11,g:"G4 vs TOR"}], ctx:"3-pt specialist. Hit pts over 3 of 5. Role player who can get hot quickly" },

  // ── SAN ANTONIO SPURS ────────────────────────────────────────────────────────
  "Victor Wembanyama":       { team:"SAS", pos:"C", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:20.5,reb:12.5,ast:3.5,pra:36.5,blk:3.5}, stats:[{pts:19,reb:15,ast:2,pra:36,blk:2,g:"G2 vs MIN (133-95 W)"},{pts:11,reb:15,ast:2,pra:28,blk:12,g:"G1 vs MIN (12 blk record)"},{pts:29,reb:14,ast:3,pra:46,blk:4,g:"G5 vs POR"},{pts:33,reb:10,ast:6,pra:49,blk:3,g:"G4 vs POR"},{pts:27,reb:9,ast:5,pra:41,blk:6,g:"G3 vs POR"}], ctx:"19/15reb in G2 blowout. Series tied 1-1 now — G3 in Minneapolis. Reb OVER is the play (14+ reb in both G1+G2)" },
  "Stephon Castle":          { team:"SAS", pos:"G", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:17.5,reb:3.5,ast:4.5,pra:25.5}, stats:[{pts:21,reb:4,ast:4,pra:29,g:"G2 vs MIN"},{pts:18,reb:4,ast:4,pra:26,g:"G1 vs MIN"},{pts:14,reb:3,ast:3,pra:20,g:"G5 vs POR"},{pts:16,reb:5,ast:4,pra:25,g:"G4 vs POR"},{pts:12,reb:3,ast:3,pra:18,g:"G3 vs POR"}], ctx:"21 pts in G2 on 60% FG + 9-9 FT. Back-to-back 18+ pt games. Hit over pts in 5 of 5. RISING star" },
  "De'Aaron Fox":            { team:"SAS", pos:"G", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:21.5,reb:3.5,ast:6.5,pra:31.5}, stats:[{pts:16,reb:0,ast:2,pra:18,g:"G2 vs MIN (efficient W)"},{pts:28,reb:3,ast:8,pra:39,g:"G1 vs MIN"},{pts:24,reb:4,ast:6,pra:34,g:"G5 vs POR"},{pts:31,reb:2,ast:9,pra:42,g:"G4 vs POR"},{pts:22,reb:3,ast:7,pra:32,g:"G3 vs POR"}], ctx:"Only 16 pts G2 (blowout pulled starters early). G3 road game = full game effort expected. Series tied 1-1 — big Fox game coming" },
  "Dylan Harper":            { team:"SAS", pos:"G", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:14.5,reb:4.5,ast:2.5,pra:21.5}, stats:[{pts:11,reb:7,ast:5,pra:23,g:"G2 vs MIN"},{pts:17,reb:5,ast:3,pra:25,g:"G1 vs MIN"},{pts:19,reb:4,ast:2,pra:25,g:"G5 vs POR"},{pts:15,reb:5,ast:3,pra:23,g:"G4 vs POR"},{pts:13,reb:4,ast:2,pra:19,g:"G3 vs POR"}], ctx:"7 reb in G2 — blows up the reb line (4.5). Back-to-back 11+ games. Versatile young player" },
  "Devin Vassell":           { team:"SAS", pos:"F", opp:"MIN", game:"sas-min", injury:null,  lines:{pts:12.5,reb:3.5,ast:3.5,pra:19.5}, stats:[{pts:10,reb:5,ast:4,pra:19,g:"G2 vs MIN"},{pts:14,reb:4,ast:3,pra:21,g:"G1 vs MIN"},{pts:18,reb:5,ast:2,pra:25,g:"G5 vs POR"},{pts:12,reb:3,ast:2,pra:17,g:"G4 vs POR"},{pts:16,reb:4,ast:3,pra:23,g:"G3 vs POR"}], ctx:"10 pts in G2 — blowout limited him. 4 ast in G2. MIN allows fewest 3PM/game in NBA — UNDER threes angle" },
  "Keldon Johnson":          { team:"SAS", pos:"F-G", opp:"MIN", game:"sas-min", injury:null, lines:{pts:10.5,reb:5.5,ast:1.5,pra:17.5}, stats:[{pts:9,reb:10,ast:1,pra:20,g:"G2 vs MIN"},{pts:12,reb:5,ast:2,pra:19,g:"G1 vs MIN"},{pts:10,reb:4,ast:1,pra:15,g:"G5 vs POR"},{pts:14,reb:6,ast:2,pra:22,g:"G4 vs POR"},{pts:9,reb:3,ast:1,pra:13,g:"G3 vs POR"}], ctx:"9 pts + 10 reb in G2! Reb line (5.5) is massively undervalued — going for boards aggressively" },
  "Luke Kornet":             { team:"SAS", pos:"C-F", opp:"MIN", game:"sas-min", injury:null, lines:{pts:7.5,reb:4.5,ast:1.5,pra:13.5}, stats:[{pts:4,reb:2,ast:1,pra:7,g:"G2 vs MIN"},{pts:8,reb:5,ast:2,pra:15,g:"G1 vs MIN"},{pts:6,reb:4,ast:1,pra:11,g:"G5 vs POR"},{pts:9,reb:5,ast:2,pra:16,g:"G4 vs POR"},{pts:7,reb:3,ast:1,pra:11,g:"G3 vs POR"}], ctx:"4 pts G2 — blowout limited his run. Under in G2 blowout is the pattern for bench guys" },

  // ── MINNESOTA TIMBERWOLVES ───────────────────────────────────────────────────
  "Anthony Edwards":         { team:"MIN", pos:"G", opp:"SAS", game:"sas-min", injury:"⚠️ Knee (Limited)", lines:{pts:22.5,reb:3.5,ast:4.5,pra:30.5}, stats:[{pts:12,reb:3,ast:0,pra:15,g:"G2 vs SAS (lost 95-133)"},{pts:18,reb:3,ast:3,pra:24,g:"G1 vs SAS (W)"},{pts:36,reb:6,ast:5,pra:47,g:"G6 vs DEN"},{pts:28,reb:4,ast:6,pra:38,g:"G5 vs DEN"},{pts:22,reb:5,ast:3,pra:30,g:"G4 vs DEN"}], ctx:"Only 12 pts in blowout G2. Knee limiting him. UNDER pts (22.5) — has gone UNDER in both SAS games. Series tied 1-1, pressure on MIN at home G3" },
  "Julius Randle (MIN)":     { team:"MIN", pos:"F", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:16.5,reb:7.5,ast:4.5,pra:28.5}, stats:[{pts:12,reb:5,ast:2,pra:19,g:"G2 vs SAS"},{pts:21,reb:10,ast:2,pra:33,g:"G1 vs SAS"},{pts:24,reb:9,ast:5,pra:38,g:"G6 vs DEN"},{pts:18,reb:7,ast:4,pra:29,g:"G5 vs DEN"},{pts:22,reb:8,ast:5,pra:35,g:"G4 vs DEN"}], ctx:"Only 12 pts in G2 blowout. 21/10 in G1 W. MIN must perform in G3 at home — expect Randle to step up" },
  "Rudy Gobert":             { team:"MIN", pos:"C", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:8.5,reb:11.5,ast:2.5,pra:22.5}, stats:[{pts:5,reb:10,ast:1,pra:16,g:"G2 vs SAS"},{pts:10,reb:12,ast:2,pra:24,g:"G1 vs SAS"},{pts:14,reb:15,ast:2,pra:31,g:"G6 vs DEN"},{pts:12,reb:13,ast:1,pra:26,g:"G5 vs DEN"},{pts:8,reb:11,ast:2,pra:21,g:"G4 vs DEN"}], ctx:"10 reb in G2 blowout. Struggling vs Wemby matchup. Under reb (11.5) likely in tough SAS matchup" },
  "Jaden McDaniels":         { team:"MIN", pos:"F", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:12.5,reb:4.5,ast:2.5,pra:19.5}, stats:[{pts:12,reb:3,ast:4,pra:19,g:"G2 vs SAS"},{pts:14,reb:5,ast:3,pra:22,g:"G1 vs SAS"},{pts:16,reb:4,ast:2,pra:22,g:"G6 vs DEN"},{pts:12,reb:3,ast:3,pra:18,g:"G5 vs DEN"},{pts:14,reb:5,ast:2,pra:21,g:"G4 vs DEN"}], ctx:"4 ast in G2 — ast line (2.5) is soft. Consistent role player for MIN" },
  "Naz Reid":                { team:"MIN", pos:"C-F", opp:"SAS", game:"sas-min", injury:null, lines:{pts:12.5,reb:6.5,ast:2.5,pra:21.5}, stats:[{pts:11,reb:7,ast:0,pra:18,g:"G2 vs SAS"},{pts:14,reb:7,ast:2,pra:23,g:"G1 vs SAS"},{pts:18,reb:8,ast:3,pra:29,g:"G6 vs DEN"},{pts:12,reb:6,ast:2,pra:20,g:"G5 vs DEN"},{pts:16,reb:9,ast:2,pra:27,g:"G4 vs DEN"}], ctx:"MIN's best bench scorer. G3 at home — will have crowd energy. Hit pts over 4 of 5" },
  "Mike Conley":             { team:"MIN", pos:"G", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:8.5,reb:3.5,ast:6.5,pra:18.5}, stats:[{pts:3,reb:1,ast:3,pra:7,g:"G2 vs SAS"},{pts:8,reb:3,ast:7,pra:18,g:"G1 vs SAS"},{pts:12,reb:4,ast:8,pra:24,g:"G6 vs DEN"},{pts:9,reb:2,ast:6,pra:17,g:"G5 vs DEN"},{pts:11,reb:3,ast:7,pra:21,g:"G4 vs DEN"}], ctx:"Only 3 pts in G2 blowout — DNQ scenario. Under all lines if MIN gets blown out again. LEAN UNDER" },
  "Terrence Shannon Jr.":    { team:"MIN", pos:"G", opp:"SAS", game:"sas-min", injury:null,  lines:{pts:10.5,reb:3.5,ast:2.5,pra:16.5}, stats:[{pts:12,reb:5,ast:1,pra:18,g:"G2 vs SAS"},{pts:8,reb:3,ast:2,pra:13,g:"G1 vs SAS"},{pts:12,reb:4,ast:2,pra:18,g:"G6 vs DEN"},{pts:10,reb:3,ast:1,pra:14,g:"G5 vs DEN"},{pts:7,reb:2,ast:2,pra:11,g:"G4 vs DEN"}], ctx:"12 pts in G2. Bench scoring role growing. Hit pts over 3 of 5" },

  // ── OKLAHOMA CITY THUNDER ────────────────────────────────────────────────────
  "Shai Gilgeous-Alexander": { team:"OKC", pos:"G", opp:"LAL", game:"okc-lal", injury:null,  lines:{pts:30.5,reb:5.5,ast:6.5,pra:42.5}, stats:[{pts:18,reb:6,ast:7,pra:31,g:"G1 vs LAL (108-90 W)"},{pts:38,reb:4,ast:8,pra:50,g:"G4 vs PHX"},{pts:29,reb:3,ast:6,pra:38,g:"G3 vs PHX"},{pts:42,reb:6,ast:5,pra:53,g:"G2 vs PHX"},{pts:31,reb:4,ast:7,pra:42,g:"G1 vs PHX"}], ctx:"Scored only 18 in G1 W — was very conservative. Avg 35 PPG vs PHX. OKC 87.8% win prob G2. HUGE bounce-back game coming" },
  "Chet Holmgren":           { team:"OKC", pos:"C-F", opp:"LAL", game:"okc-lal", injury:null, lines:{pts:17.5,reb:7.5,ast:3.5,pra:28.5}, stats:[{pts:16,reb:8,ast:3,pra:27,g:"G1 vs LAL"},{pts:22,reb:10,ast:4,pra:36,g:"G4 vs PHX"},{pts:18,reb:9,ast:3,pra:30,g:"G3 vs PHX"},{pts:20,reb:7,ast:4,pra:31,g:"G2 vs PHX"},{pts:14,reb:8,ast:2,pra:24,g:"G1 vs PHX"}], ctx:"Usage WAY UP with Williams OUT. LAL undersized — favorable matchup for Chet. Hit reb over 4 of 5" },
  "Jalen Williams":          { team:"OKC", pos:"F", opp:"LAL", game:"okc-lal", injury:"⚠️ OUT — Hamstring", lines:{pts:22.5,reb:5.5,ast:5.5,pra:33.5}, stats:[{pts:0,reb:0,ast:0,pra:0,g:"DNP — G1 vs LAL"},{pts:28,reb:6,ast:5,pra:39,g:"G4 vs PHX"},{pts:24,reb:4,ast:6,pra:34,g:"G3 vs PHX"},{pts:22,reb:5,ast:4,pra:31,g:"G2 vs PHX"},{pts:19,reb:4,ast:5,pra:28,g:"G1 vs PHX"}], ctx:"🚫 OUT full series. Props OFF the board. Roles shift to Dort, Caruso, Holmgren" },
  "Isaiah Hartenstein":      { team:"OKC", pos:"C", opp:"LAL", game:"okc-lal", injury:null,  lines:{pts:9.5,reb:9.5,ast:2.5,pra:21.5}, stats:[{pts:10,reb:10,ast:3,pra:23,g:"G1 vs LAL"},{pts:12,reb:12,ast:2,pra:26,g:"G4 vs PHX"},{pts:9,reb:9,ast:3,pra:21,g:"G3 vs PHX"},{pts:11,reb:11,ast:2,pra:24,g:"G2 vs PHX"},{pts:8,reb:8,ast:2,pra:18,g:"G1 vs PHX"}], ctx:"Double-double in 4 of 5. LAL has ZERO answer for him in the paint. Hit both pts + reb over every game" },
  "Lu Dort":                 { team:"OKC", pos:"G-F", opp:"LAL", game:"okc-lal", injury:null, lines:{pts:11.5,reb:3.5,ast:1.5,pra:16.5}, stats:[{pts:12,reb:4,ast:2,pra:18,g:"G1 vs LAL"},{pts:14,reb:3,ast:2,pra:19,g:"G4 vs PHX"},{pts:10,reb:4,ast:1,pra:15,g:"G3 vs PHX"},{pts:16,reb:5,ast:2,pra:23,g:"G2 vs PHX"},{pts:9,reb:3,ast:2,pra:14,g:"G1 vs PHX"}], ctx:"Elite defender on LeBron. Role expanded with Williams OUT. Hit pts over 3 of 5" },
  "Alex Caruso":             { team:"OKC", pos:"G", opp:"LAL", game:"okc-lal", injury:null,  lines:{pts:9.5,reb:2.5,ast:3.5,pra:15.5}, stats:[{pts:11,reb:3,ast:4,pra:18,g:"G1 vs LAL"},{pts:9,reb:3,ast:3,pra:15,g:"G4 vs PHX"},{pts:12,reb:4,ast:4,pra:20,g:"G3 vs PHX"},{pts:8,reb:2,ast:3,pra:13,g:"G2 vs PHX"},{pts:10,reb:3,ast:4,pra:17,g:"G1 vs PHX"}], ctx:"Former Laker — extra motivated. 11 pts G1. Hit pts over 4 of 5" },
  "Aaron Wiggins":           { team:"OKC", pos:"G-F", opp:"LAL", game:"okc-lal", injury:null, lines:{pts:8.5,reb:3.5,ast:1.5,pra:13.5}, stats:[{pts:9,reb:4,ast:1,pra:14,g:"G1 vs LAL"},{pts:11,reb:3,ast:2,pra:16,g:"G4 vs PHX"},{pts:7,reb:3,ast:1,pra:11,g:"G3 vs PHX"},{pts:10,reb:4,ast:1,pra:15,g:"G2 vs PHX"},{pts:8,reb:3,ast:2,pra:13,g:"G1 vs PHX"}], ctx:"Spot starter with Williams out. Solid floor" },

  // ── LOS ANGELES LAKERS ────────────────────────────────────────────────────────
  "LeBron James":            { team:"LAL", pos:"F", opp:"OKC", game:"okc-lal", injury:null,  lines:{pts:23.5,reb:8.5,ast:8.5,pra:40.5}, stats:[{pts:22,reb:9,ast:8,pra:39,g:"G1 vs OKC (L 90-108)"},{pts:28,reb:7,ast:10,pra:45,g:"G6 vs HOU"},{pts:31,reb:8,ast:9,pra:48,g:"G5 vs HOU"},{pts:24,reb:10,ast:7,pra:41,g:"G4 vs HOU"},{pts:27,reb:6,ast:11,pra:44,g:"G3 vs HOU"}], ctx:"22/9/8 in G1 L. HIT over reb (8.5) and ast (8.5) in G1. Biggest underdog (+1200) of career — will play hero ball. PRA near his avg" },
  "Anthony Davis":           { team:"LAL", pos:"C-F", opp:"OKC", game:"okc-lal", injury:null, lines:{pts:25.5,reb:11.5,ast:3.5,pra:40.5}, stats:[{pts:26,reb:12,ast:3,pra:41,g:"G1 vs OKC"},{pts:24,reb:11,ast:2,pra:37,g:"G6 vs HOU"},{pts:28,reb:13,ast:3,pra:44,g:"G5 vs HOU"},{pts:22,reb:10,ast:2,pra:34,g:"G4 vs HOU"},{pts:30,reb:14,ast:4,pra:48,g:"G3 vs HOU"}], ctx:"26/12 in G1 — both pts AND reb OVER. Dominant every game without Luka. Hit both over 5 of 5 games" },
  "Austin Reaves":           { team:"LAL", pos:"G", opp:"OKC", game:"okc-lal", injury:null,  lines:{pts:17.5,reb:3.5,ast:4.5,pra:25.5}, stats:[{pts:18,reb:4,ast:5,pra:27,g:"G1 vs OKC"},{pts:22,reb:3,ast:6,pra:31,g:"G6 vs HOU"},{pts:16,reb:4,ast:4,pra:24,g:"G5 vs HOU"},{pts:20,reb:3,ast:5,pra:28,g:"G4 vs HOU"},{pts:14,reb:5,ast:4,pra:23,g:"G3 vs HOU"}], ctx:"18/4/5 in G1 — HIT over pts AND ast lines. Healthy Reaves is LAL's #2. Consistent HIGHER on all lines" },
  "Luka Dončić":             { team:"LAL", pos:"G-F", opp:"OKC", game:"okc-lal", injury:"⚠️ OUT — Hamstring (full series)", lines:{pts:30.5,reb:8.5,ast:9.5,pra:48.5}, stats:[{pts:0,reb:0,ast:0,pra:0,g:"DNP entire series"},{pts:36,reb:9,ast:10,pra:55,g:"Regular season"}], ctx:"🚫 OUT for full playoffs series. All props OFF the board" },
  "Rui Hachimura":           { team:"LAL", pos:"F", opp:"OKC", game:"okc-lal", injury:null,  lines:{pts:13.5,reb:5.5,ast:1.5,pra:20.5}, stats:[{pts:14,reb:5,ast:2,pra:21,g:"G1 vs OKC"},{pts:16,reb:6,ast:1,pra:23,g:"G6 vs HOU"},{pts:12,reb:4,ast:2,pra:18,g:"G5 vs HOU"},{pts:18,reb:7,ast:2,pra:27,g:"G4 vs HOU"},{pts:11,reb:4,ast:1,pra:16,g:"G3 vs HOU"}], ctx:"Hit pts over 3 of 5. Starting F without Luka — consistent role scorer" },
  "D'Angelo Russell":        { team:"LAL", pos:"G", opp:"OKC", game:"okc-lal", injury:null,  lines:{pts:11.5,reb:2.5,ast:5.5,pra:19.5}, stats:[{pts:12,reb:3,ast:6,pra:21,g:"G1 vs OKC"},{pts:15,reb:4,ast:7,pra:26,g:"G6 vs HOU"},{pts:10,reb:3,ast:5,pra:18,g:"G5 vs HOU"},{pts:13,reb:2,ast:6,pra:21,g:"G4 vs HOU"},{pts:8,reb:3,ast:5,pra:16,g:"G3 vs HOU"}], ctx:"Hit ast OVER in 4 of 5. Backup PG with Luka out. Consistent distributor" },
};

const TEAMS = {
  NYK:{name:"New York Knicks",color:"#F58426",bg:"#1a0e00",series:"NYK leads PHI 2-0",matchup:"phi-nyk"},
  PHI:{name:"Philadelphia 76ers",color:"#006BB6",bg:"#00101f",series:"PHI trails NYK 0-2",matchup:"phi-nyk"},
  DET:{name:"Detroit Pistons",color:"#C8102E",bg:"#1f0005",series:"DET leads CLE 1-0",matchup:"det-cle"},
  CLE:{name:"Cleveland Cavaliers",color:"#860038",bg:"#1f0008",series:"CLE trails DET 0-1",matchup:"det-cle"},
  SAS:{name:"San Antonio Spurs",color:"#C4CED4",bg:"#12151a",series:"SAS leads MIN 1-1 (tied)",matchup:"sas-min"},
  MIN:{name:"Minnesota Timberwolves",color:"#236192",bg:"#00060f",series:"MIN tied with SAS 1-1",matchup:"sas-min"},
  OKC:{name:"Oklahoma City Thunder",color:"#EF3B24",bg:"#1f0800",series:"OKC leads LAL 1-0",matchup:"okc-lal"},
  LAL:{name:"Los Angeles Lakers",color:"#FDB927",bg:"#1f1600",series:"LAL trails OKC 0-1",matchup:"okc-lal"},
};

const GAME_LINES = {
  "phi-nyk":{label:"PHI @ NYK — EC Semis G3 · Fri May 8 · 6:00 PM CDT",spread:"NYK -3.5",total:213.5,ml:{NYK:-170,PHI:+145},wp:{NYK:50.5,PHI:49.5},note:"G3 in Philadelphia — HOME court advantage shifts. Embiid still OUT. PHI must win or trail 0-3. Maxey/PG/Oubre all elevated roles."},
  "det-cle":{label:"CLE @ DET — EC Semis G2 · Thu May 8 · 6:00 PM CDT",spread:"DET -4.5",total:211.5,ml:{DET:-195,CLE:+160},wp:{DET:59.1,CLE:40.9},note:"DET closes out at home? CLE was down 17 in G1 but clawed back. Physical series — lowest total (211.5) on board."},
  "okc-lal":{label:"LAL @ OKC — WC Semis G2 · Thu May 8 · 8:30 PM CDT",spread:"OKC -13.5",total:218.5,ml:{OKC:-750,LAL:+530},wp:{OKC:87.8,LAL:12.2},note:"Williams + Doncic both OUT. LAL held to 90 pts in G1. OKC 87.8% win prob. SGA ready to explode after conservative G1."},
  "sas-min":{label:"SAS @ MIN — WC Semis G3 · Fri May 8 · 8:30 PM CDT",spread:"SAS -4.5",total:214.5,ml:{SAS:-195,MIN:+160},wp:{SAS:60.6,MIN:39.4},note:"SERIES TIED 1-1 after SAS won G2 133-95 blowout. G3 moves to Minneapolis — home court for MIN. Castle/Wemby on fire."},
};

function analyze(player, prop) {
  if (player.injury) return null;
  const line = player.lines[prop]; if (!line) return null;
  const vals = player.stats.map(s => s[prop] || 0);
  const avg = vals.reduce((a,b)=>a+b,0)/vals.length;
  const hitPct = (vals.filter(v=>v>line).length/vals.length)*100;
  const edge = avg - line;
  const conf = Math.min(94, Math.max(28, hitPct + (edge>0?10:-8)));
  const rec = hitPct>=60&&edge>0?"HIGHER": hitPct<=40||edge<-1.5?"LOWER":"LEAN HIGHER";
  const str = conf>=75?"🔥 STRONG": conf>=60?"✅ SOLID":"⚠️ LEAN";
  return {avg:avg.toFixed(1),line,hitPct:hitPct.toFixed(0),conf:conf.toFixed(0),edge:edge.toFixed(1),rec,str};
}

function correlationBonus(legs) {
  const games = legs.map(l => PLAYERS_DATA[l.name]?.game);
  const teams = legs.map(l => PLAYERS_DATA[l.name]?.team);
  const sameTeam = teams.filter((t,i) => teams.indexOf(t)!==i).length;
  const gamePairs = {};
  legs.forEach(l => {
    const g = PLAYERS_DATA[l.name]?.game;
    const t = PLAYERS_DATA[l.name]?.team;
    if (!gamePairs[g]) gamePairs[g] = new Set();
    gamePairs[g].add(t);
  });
  const opposingPairs = Object.values(gamePairs).filter(s => s.size > 1).length;
  return (sameTeam * 3) - (opposingPairs * 4);
}

function buildTopParlays() {
  const propKeys = ["pts","reb","ast","pra"];
  const candidates = [];
  Object.entries(PLAYERS_DATA).forEach(([name, player]) => {
    if (player.injury) return;
    propKeys.forEach(prop => {
      const a = analyze(player, prop);
      if (!a || a.rec === "LEAN HIGHER") return;
      const score = (parseFloat(a.conf)*0.5) + (parseFloat(a.hitPct)*0.3) + (Math.abs(parseFloat(a.edge))*2);
      candidates.push({ name, prop, a, player, score, conf:parseFloat(a.conf), edge:parseFloat(a.edge), hitPct:parseFloat(a.hitPct) });
    });
  });
  candidates.sort((a,b) => b.score - a.score);

  const strategies = [
    { label:"💎 Best Value", desc:"Highest-confidence legs across today's slate", filter: c => c.conf >= 75 },
    { label:"🔥 Injury Stack", desc:"Embiid OUT & Williams OUT usage winners", filter: c => ["Tyrese Maxey","Paul George","Kelly Oubre Jr.","VJ Edgecombe","Andre Drummond","Chet Holmgren","Shai Gilgeous-Alexander","Anthony Davis"].includes(c.name) },
    { label:"🏠 Home Court Edge", desc:"G3 PHI & G3 MIN favor home teams tonight", filter: c => ["PHI","MIN"].includes(c.player.team) },
    { label:"⚡ Biggest Statistical Edge", desc:"Largest avg vs line gaps across slate", filter: c => Math.abs(c.edge) >= 2.5 },
    { label:"🏆 Multi-Game Diversified", desc:"One sharp leg from each game", filter: () => true },
  ];

  const parlays = [];
  const usedCombos = new Set();
  strategies.forEach((strat, si) => {
    const pool = candidates.filter(strat.filter);
    if (pool.length < 2) return;
    const legs = [];
    const usedPlayers = new Set();
    const usedGames = si === 4 ? new Set() : null;
    for (const c of pool) {
      if (legs.length >= 3) break;
      if (usedPlayers.has(c.name)) continue;
      if (usedGames && usedGames.has(c.player.game)) continue;
      legs.push(c);
      usedPlayers.add(c.name);
      if (usedGames) usedGames.add(c.player.game);
    }
    if (legs.length < 2) return;
    const avgConf = legs.reduce((s,l)=>s+l.conf,0)/legs.length;
    const corr = correlationBonus(legs);
    const estOdds = Math.round((Math.pow(1.92, legs.length)-1)*100);
    const comboKey = legs.map(l=>`${l.name}${l.prop}`).sort().join('|');
    if (usedCombos.has(comboKey)) return;
    usedCombos.add(comboKey);
    parlays.push({ ...strat, legs, avgConf: avgConf.toFixed(0), estOdds, corr });
  });
  return parlays.slice(0, 5);
}

export default function App() {
  const [tab, setTab] = useState("top5");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [prop, setProp] = useState("pts");
  const [sort, setSort] = useState("conf");
  const [expanded, setExpanded] = useState(null);
  const [parlay, setParlay] = useState([]);
  const [ai, setAi] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [top5Parlays] = useState(() => buildTopParlays());
  const [top5AI, setTop5AI] = useState({});
  const [top5Loading, setTop5Loading] = useState({});
  const [top5Expanded, setTop5Expanded] = useState(0);

  const addParlay = (name, leg, rec) => { const k=`${name}-${leg}`; if(!parlay.find(p=>p.k===k)) setParlay(v=>[...v,{k,name,leg,rec}]); };
  const rmParlay = k => setParlay(v=>v.filter(p=>p.k!==k));

  const rows = Object.entries(PLAYERS_DATA)
    .filter(([,p]) => teamFilter==="ALL" || p.team===teamFilter)
    .map(([name,player]) => ({name, player, a: analyze(player, prop)}))
    .sort((x,y) => {
      if(sort==="conf") return parseFloat(y.a?.conf||0)-parseFloat(x.a?.conf||0);
      if(sort==="edge") return parseFloat(y.a?.edge||-99)-parseFloat(x.a?.edge||-99);
      return x.name.localeCompare(y.name);
    });

  const fetchAI = useCallback(async () => {
    setAiLoading(true); setAi("");
    const topRows = rows.filter(r=>r.a&&!r.player.injury).slice(0,7);
    const prompt = `Expert NBA playoff Underdog Fantasy analyst. May 8, 2026.
INJURIES: Joel Embiid OUT (PHI G3+), Jalen Williams OUT (OKC full series), Luka Doncic OUT (LAL full series), Anthony Edwards knee limited.
SERIES STATUS: NYK leads PHI 2-0 | SAS leads MIN 1-1 (TIED after SAS won G2 133-95 blowout) | DET leads CLE 1-0 | OKC leads LAL 1-0
TODAY'S GAMES: PHI@NYK G3 (6pm CDT, in Philadelphia), DET@CLE G2 (6pm CDT), LAL@OKC G2 (8:30pm CDT), SAS@MIN G3 (8:30pm CDT, in Minneapolis)

TOP ${prop.toUpperCase()} PROPS (Underdog Fantasy lines):
${topRows.map(r=>`${r.name} (${r.player.team}): line ${r.a.line}, avg ${r.a.avg}, hit ${r.a.hitPct}%, edge ${r.a.edge>0?'+':''}${r.a.edge} → ${r.a.rec}. ${r.player.ctx}`).join('\n')}

Give 3-4 sharp sentences. Pick #1 clearest Underdog value today, mention injury/home court impact, suggest a 2-3 leg entry. Direct betting language, use emojis.`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:prompt}]})});
      const d = await r.json();
      setAi(d.content?.map(c=>c.text||"").join("")||"Unable to generate.");
    } catch { setAi("⚠️ Could not connect. Please try again."); }
    setAiLoading(false);
  }, [rows, prop]);

  const fetchTop5AI = useCallback(async (idx, parl) => {
    setTop5Loading(v=>({...v,[idx]:true}));
    const legSummary = parl.legs.map(l =>
      `${l.name} (${l.player.team}) ${l.prop.toUpperCase()} ${l.a.rec} ${l.a.line} | avg ${l.a.avg} | hit ${l.a.hitPct}% | edge ${l.a.edge>0?'+':''}${l.a.edge} | ${l.player.ctx}`
    ).join('\n');
    const prompt = `NBA playoff Underdog Fantasy expert. May 8, 2026.
INJURIES: Embiid OUT (PHI all series), Williams OUT (OKC all series), Doncic OUT (LAL all series), Edwards knee limited.
SERIES: NYK leads PHI 2-0 (G3 in Philly tonight), SAS leads MIN 1-1 (G3 in Minneapolis tonight), DET leads CLE 1-0 (G2 tonight), OKC leads LAL 1-0 (G2 tonight).
KEY CONTEXT: SAS won G2 133-95 blowout. PHI heads home for G3 as must-win. SGA scored only 18 in G1 (expect big G2).

Parlay: "${parl.label}" — ${parl.desc}
Est. Odds: +${parl.estOdds} | Avg Confidence: ${parl.avgConf}%

LEGS:
${legSummary}

In 3-4 punchy sentences: why this parlay makes sense as a unit, strongest leg, any correlation/risk, final verdict fire or fade? Emojis, sharp language, direct.`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:prompt}]})});
      const d = await r.json();
      setTop5AI(v=>({...v,[idx]:d.content?.map(c=>c.text||"").join("")||"Unable to generate."}));
    } catch { setTop5AI(v=>({...v,[idx]:"⚠️ Could not connect."})); }
    setTop5Loading(v=>({...v,[idx]:false}));
  }, []);

  const propBtns = [{k:"pts",l:"Points"},{k:"reb",l:"Rebounds"},{k:"ast",l:"Assists"},{k:"pra",l:"PRA"},{k:"blk",l:"Blocks"}];
  const RANK_COLORS = ["#f5a623","#c0c0c0","#cd7f32","#6eb5ff","#a8ff78"];
  const RANK_LABELS = ["#1 BEST BET","#2 SILVER","#3 BRONZE","#4 VALUE","#5 SLEEPER"];

  return (
    <div style={{background:"#07070f",minHeight:"100vh",fontFamily:"'Barlow Condensed',Impact,sans-serif",color:"#e0ddd6"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0a0a14}::-webkit-scrollbar-thumb{background:#f5a623;border-radius:2px}
        .T{background:none;border:none;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:1px;padding:9px 14px;color:#555;text-transform:uppercase;transition:all .2s;border-bottom:3px solid transparent;white-space:nowrap}
        .T.on{color:#f5a623;border-bottom-color:#f5a623}.T:hover{color:#f5a623}
        .B{background:#0f1525;border:1.5px solid #1c2540;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;padding:4px 11px;color:#777;border-radius:4px;text-transform:uppercase;letter-spacing:1px;transition:all .2s}
        .B.on{background:#f5a623;border-color:#f5a623;color:#07070f}.B:hover:not(.on){border-color:#f5a623;color:#f5a623}
        .TB{cursor:pointer;padding:6px 12px;border-radius:5px;border:1.5px solid #1c2540;background:#0c0c1e;transition:all .2s;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;letter-spacing:1px;color:#555}
        .TB.on{border-color:var(--c);color:var(--c);background:var(--b)}.TB:hover:not(.on){border-color:#2a2a3a;color:#999}
        .card{background:#0e1422;border:1px solid #18213a;border-radius:9px;padding:14px;cursor:pointer;transition:transform .12s,box-shadow .12s}
        .card:hover{transform:translateY(-1px);box-shadow:0 5px 20px rgba(245,166,35,.06)}
        .card.open{border-color:#2a3560}
        .HI{background:#0a2a0a;color:#4caf50;border:1px solid #4caf50;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:800;letter-spacing:1px}
        .LO{background:#2a0a0a;color:#f44336;border:1px solid #f44336;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:800;letter-spacing:1px}
        .LN{background:#2a2200;color:#ffc107;border:1px solid #ffc107;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:800;letter-spacing:1px}
        .OT{background:#2a0505;color:#ff5555;border:1px solid #aa2222;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:800;letter-spacing:2px}
        .add{background:none;border:1px dashed #2a3040;color:#444;cursor:pointer;padding:4px 10px;border-radius:4px;font-size:11px;font-family:'Barlow',sans-serif;transition:all .2s}
        .add:hover{border-color:#f5a623;color:#f5a623}
        .AI{background:linear-gradient(135deg,#f5a623,#d97e10);border:none;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;padding:9px 22px;color:#07070f;border-radius:7px;letter-spacing:1px;text-transform:uppercase;transition:all .2s}
        .AI:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(245,166,35,.4)}.AI:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .AI-sm{background:linear-gradient(135deg,#f5a623,#d97e10);border:none;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;padding:6px 14px;color:#07070f;border-radius:5px;letter-spacing:1px;text-transform:uppercase;transition:all .2s}
        .AI-sm:hover{box-shadow:0 2px 10px rgba(245,166,35,.4)}.AI-sm:disabled{opacity:.6;cursor:not-allowed}
        .pulse{animation:pulse 1.8s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        .cb{height:5px;background:#141e30;border-radius:3px;overflow:hidden;margin-top:3px}
        .cf{height:100%;border-radius:3px;transition:width .7s ease}
        .lbl{font-size:9px;letter-spacing:2px;color:#333;text-transform:uppercase;font-family:'Barlow',sans-serif;margin-bottom:4px}
        .pi{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid #141e30}
        .rx{background:none;border:none;color:#f44336;cursor:pointer;font-size:16px}
        .g2{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:11px}
        .inj{background:#180808;border:1px solid #3a1212;border-radius:7px;padding:10px;display:flex;align-items:flex-start;gap:9px;flex:1;min-width:180px}
        .pc{cursor:pointer;border-radius:10px;padding:16px;transition:all .2s;border:2px solid transparent}
        .pc:hover{transform:translateY(-1px)}
        .leg-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #141e30}
        .leg-row:last-child{border-bottom:none}
        .upd{background:#0a1f0a;border:1px solid #1a4a1a;border-radius:6px;padding:8px 12px;margin-bottom:12px;font-family:'Barlow',sans-serif;font-size:11px;color:#4caf50;display:flex;align-items:center;gap:8px}
      `}</style>

      {/* HEADER */}
      <div style={{background:"linear-gradient(180deg,#0b0b1e,#07070f)",borderBottom:"1px solid #141e30",padding:"0 14px"}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,paddingBottom:6,flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,color:"#f5a623",lineHeight:1}}>🏀 PLAYOFF EDGE</div>
              <div style={{fontSize:9,color:"#333",letterSpacing:3,fontFamily:"'Barlow',sans-serif",marginTop:1}}>NBA 2026 · UNDERDOG FANTASY · UPDATED MAY 8</div>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {["Underdog","DraftKings","FanDuel","BetMGM","SportRadar"].map(b=>(
                <span key={b} style={{background:"#0f1525",border:"1px solid #1c2540",padding:"2px 7px",borderRadius:3,fontSize:9,color:"#444",fontFamily:"'Barlow',sans-serif"}}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:1,flexWrap:"wrap"}}>
            {[["top5","🏆 Top 5 Parlays"],["props","📊 Props"],["games","🏟️ Games"],["parlay",`🎲 My Slip${parlay.length?` (${parlay.length})`:""}`]].map(([t,l])=>(
              <button key={t} className={`T ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"14px"}}>

        {/* UPDATE BANNER */}
        <div className="upd">
          <span>✅</span>
          <span><strong>Updated May 8:</strong> SAS wins G2 133-95 (Castle 21, Wemby 19/15reb) — series TIED 1-1. NYK wins G2 108-102 (OG 24, Brunson 26). Today: PHI@NYK G3 (Philly), SAS@MIN G3 (Minneapolis), DET@CLE G2, OKC@LAL G2.</span>
        </div>

        {/* INJURY BANNER */}
        <div style={{marginBottom:14}}>
          <div className="lbl">🚨 Injury Report</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {[{n:"Joel Embiid",s:"OUT — Hip/Ankle · All PHI games",c:"#f44336"},{n:"Jalen Williams",s:"OUT — Hamstring · All OKC games",c:"#f44336"},{n:"Luka Dončić",s:"OUT — Hamstring · Full LAL series",c:"#f44336"},{n:"Anthony Edwards",s:"Knee — Limited mins",c:"#ffc107"}].map(i=>(
              <div key={i.n} className="inj">
                <div style={{fontSize:14}}>⚠️</div>
                <div><div style={{fontSize:12,fontWeight:800,color:i.c,lineHeight:1.2}}>{i.n}</div><div style={{fontSize:10,color:"#555",fontFamily:"'Barlow',sans-serif",marginTop:1}}>{i.s}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOP 5 PARLAYS ── */}
        {tab==="top5" && (
          <div>
            <div style={{marginBottom:14,padding:"12px 16px",background:"linear-gradient(135deg,#0f1020,#141830)",border:"1px solid #1c2540",borderRadius:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <div style={{fontSize:20,fontWeight:900,color:"#f5a623",letterSpacing:1}}>🤖 AI PARLAY INTELLIGENCE — MAY 8</div>
                <div style={{flex:1,fontSize:12,color:"#888",fontFamily:"'Barlow',sans-serif"}}>
                  Engine scored every prop across all {Object.keys(PLAYERS_DATA).filter(n=>!PLAYERS_DATA[n].injury).length} active players using today's real box scores, updated Underdog lines, and injury-adjusted usage.
                </div>
              </div>
            </div>

            <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:14}}>
              {top5Parlays.map((p, i) => (
                <button key={i} className="pc" style={{"--rc":RANK_COLORS[i],background:top5Expanded===i?"#0e1a2e":"#0a0f1c",border:`2px solid ${top5Expanded===i?RANK_COLORS[i]:"#1c2540"}`,flex:"1 1 130px",minWidth:120,textAlign:"left"}} onClick={()=>setTop5Expanded(i)}>
                  <div style={{fontSize:9,fontWeight:900,color:RANK_COLORS[i],letterSpacing:2,marginBottom:3}}>{RANK_LABELS[i]}</div>
                  <div style={{fontSize:13,fontWeight:800,lineHeight:1.3,color:"#e0ddd6"}}>{p.label}</div>
                  <div style={{display:"flex",gap:8,marginTop:5,flexWrap:"wrap"}}>
                    <div style={{fontSize:11,color:RANK_COLORS[i],fontWeight:700}}>+{p.estOdds}</div>
                    <div style={{fontSize:10,color:"#555",fontFamily:"'Barlow',sans-serif"}}>{p.avgConf}% conf</div>
                  </div>
                </button>
              ))}
            </div>

            {top5Parlays[top5Expanded] && (() => {
              const p = top5Parlays[top5Expanded];
              const rc = RANK_COLORS[top5Expanded];
              return (
                <div style={{background:"#0a0f1c",border:`1px solid ${rc}44`,borderRadius:12,padding:16,marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:12}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                        <span style={{fontSize:9,fontWeight:900,color:rc,letterSpacing:2,border:`1px solid ${rc}`,padding:"2px 7px",borderRadius:3}}>{RANK_LABELS[top5Expanded]}</span>
                        <div style={{fontSize:20,fontWeight:900,color:rc}}>{p.label}</div>
                      </div>
                      <div style={{fontSize:12,color:"#666",fontFamily:"'Barlow',sans-serif",marginTop:2}}>{p.desc}</div>
                    </div>
                    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                      <div style={{textAlign:"center"}}><div className="lbl">Est. Odds</div><div style={{fontSize:24,fontWeight:900,color:rc}}>+{p.estOdds}</div></div>
                      <div style={{textAlign:"center"}}><div className="lbl">Avg Conf</div><div style={{fontSize:24,fontWeight:900,color:parseFloat(p.avgConf)>=75?"#4caf50":"#f5a623"}}>{p.avgConf}%</div></div>
                      <div style={{textAlign:"center"}}><div className="lbl">Legs</div><div style={{fontSize:24,fontWeight:900}}>{p.legs.length}</div></div>
                    </div>
                  </div>
                  <div style={{background:"#0d1220",borderRadius:8,padding:"4px 12px",marginBottom:12}}>
                    {p.legs.map((leg, li) => {
                      const teamColor = TEAMS[leg.player.team]?.color || "#f5a623";
                      const cc = leg.conf>=75?"#4caf50":leg.conf>=60?"#f5a623":"#f44336";
                      return (
                        <div key={li} className="leg-row">
                          <div style={{fontSize:17,fontWeight:900,color:rc,minWidth:18}}>{li+1}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                              <span style={{fontSize:14,fontWeight:800}}>{leg.name}</span>
                              <span style={{fontSize:10,color:teamColor,fontWeight:700}}>{leg.player.team}</span>
                              <span style={{fontSize:10,color:"#555",fontFamily:"'Barlow',sans-serif"}}>{leg.prop.toUpperCase()} {leg.a.rec} {leg.a.line}</span>
                            </div>
                            <div style={{fontSize:10,color:"#557",fontFamily:"'Barlow',sans-serif",marginTop:1}}>{leg.player.ctx}</div>
                          </div>
                          <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                            <div style={{textAlign:"center"}}><div className="lbl">Avg</div><div style={{fontSize:13,fontWeight:800,color:parseFloat(leg.a.avg)>leg.a.line?"#4caf50":"#f44336"}}>{leg.a.avg}</div></div>
                            <div style={{textAlign:"center"}}><div className="lbl">Hit%</div><div style={{fontSize:13,fontWeight:800,color:cc}}>{leg.a.hitPct}%</div></div>
                            <span className={leg.a.rec==="HIGHER"?"HI":"LO"}>{leg.a.rec}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                    <button className="AI-sm" onClick={()=>fetchTop5AI(top5Expanded, p)} disabled={top5Loading[top5Expanded]}>{top5Loading[top5Expanded]?<span className="pulse">ANALYZING...</span>:"🤖 GET AI BREAKDOWN"}</button>
                    <button className="add" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>{p.legs.forEach(l=>addParlay(l.name,`${l.prop.toUpperCase()} ${l.a.rec} ${l.a.line}`,l.a.rec));setTab("parlay");}}>+ Add All Legs to My Slip →</button>
                  </div>
                  {top5Loading[top5Expanded] && <div style={{color:"#f5a623",fontFamily:"'Barlow',sans-serif",fontSize:12}} className="pulse">Analyzing parlay narrative, correlation, risk...</div>}
                  {top5AI[top5Expanded] && !top5Loading[top5Expanded] && (
                    <div style={{background:"#0c1118",borderRadius:8,padding:"10px 13px",border:`1px solid ${rc}22`}}>
                      <div style={{fontSize:9,color:rc,letterSpacing:2,fontWeight:800,marginBottom:6}}>🤖 AI ANALYSIS</div>
                      <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,lineHeight:1.8,color:"#bbb",whiteSpace:"pre-wrap"}}>{top5AI[top5Expanded]}</div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{background:"#0a0f1c",border:"1px solid #1c2540",borderRadius:10,padding:14}}>
              <div style={{fontSize:15,fontWeight:800,marginBottom:10,letterSpacing:1}}>📊 PARLAY COMPARISON</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Barlow',sans-serif",fontSize:11}}>
                  <thead><tr style={{borderBottom:"1px solid #1c2540"}}>
                    {["Rank","Strategy","Legs","Avg Conf","Est. Odds","Best Leg"].map(h=>(
                      <th key={h} style={{padding:"5px 8px",color:"#333",fontSize:9,letterSpacing:2,textAlign:"left",textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {top5Parlays.map((p,i) => {
                      const bestLeg = p.legs.reduce((a,b)=>parseFloat(a.conf)>parseFloat(b.conf)?a:b);
                      return (
                        <tr key={i} style={{borderBottom:"1px solid #0f1525",cursor:"pointer",background:top5Expanded===i?"#0e1a2e":"transparent"}} onClick={()=>setTop5Expanded(i)}>
                          <td style={{padding:"7px 8px"}}><span style={{fontSize:10,fontWeight:900,color:RANK_COLORS[i]}}>{RANK_LABELS[i]}</span></td>
                          <td style={{padding:"7px 8px",color:"#ccc",fontWeight:600}}>{p.label}</td>
                          <td style={{padding:"7px 8px",color:"#777"}}>{p.legs.length}</td>
                          <td style={{padding:"7px 8px",color:parseFloat(p.avgConf)>=75?"#4caf50":"#f5a623",fontWeight:700}}>{p.avgConf}%</td>
                          <td style={{padding:"7px 8px",color:RANK_COLORS[i],fontWeight:800}}>+{p.estOdds}</td>
                          <td style={{padding:"7px 8px",color:"#aaa"}}>{bestLeg.name} {bestLeg.prop.toUpperCase()} {bestLeg.a.rec}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PROPS TAB ── */}
        {tab==="props" && (
          <>
            <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div><div className="lbl">Prop Type</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{propBtns.map(p=><button key={p.k} className={`B ${prop===p.k?"on":""}`} onClick={()=>setProp(p.k)}>{p.l}</button>)}</div></div>
              <div><div className="lbl">Sort</div><div style={{display:"flex",gap:5}}>{[["conf","Confidence"],["edge","Edge"],["name","A-Z"]].map(([k,l])=><button key={k} className={`B ${sort===k?"on":""}`} onClick={()=>setSort(k)}>{l}</button>)}</div></div>
            </div>
            <div style={{marginBottom:12}}>
              <div className="lbl">Team Filter ({rows.filter(r=>!r.player.injury&&r.a).length} active props)</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                <button className={`TB ${teamFilter==="ALL"?"on":""}`} style={{"--c":"#f5a623","--b":"#1a1200"}} onClick={()=>setTeamFilter("ALL")}>ALL</button>
                {Object.entries(TEAMS).map(([ab,t])=>(<button key={ab} className={`TB ${teamFilter===ab?"on":""}`} style={{"--c":t.color,"--b":t.bg}} onClick={()=>setTeamFilter(ab)}>{ab}</button>))}
              </div>
            </div>
            {teamFilter!=="ALL" && (
              <div style={{background:TEAMS[teamFilter]?.bg,border:`1px solid ${TEAMS[teamFilter]?.color}30`,borderRadius:8,padding:"9px 13px",marginBottom:10,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
                <div style={{fontSize:15,fontWeight:800,color:TEAMS[teamFilter]?.color}}>{TEAMS[teamFilter]?.name}</div>
                <div style={{fontSize:12,color:"#666",fontFamily:"'Barlow',sans-serif"}}>{TEAMS[teamFilter]?.series}</div>
                <div style={{fontSize:11,color:"#444",fontFamily:"'Barlow',sans-serif"}}>{GAME_LINES[TEAMS[teamFilter]?.matchup]?.note}</div>
              </div>
            )}
            <div className="g2">
              {rows.map(({name,player,a})=>{
                const teamC = TEAMS[player.team]?.color||"#f5a623";
                const isOpen = expanded===name;
                if(player.injury) return (
                  <div key={name} style={{background:"#100808",border:"1px solid #2a1212",borderRadius:9,padding:12,opacity:.75}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div><div style={{fontSize:14,fontWeight:800}}>{name}</div><div style={{fontSize:10,color:"#555",fontFamily:"'Barlow',sans-serif"}}><span style={{color:teamC}}>{player.team}</span> · {player.pos}</div></div>
                      <span className="OT">OUT</span>
                    </div>
                    <div style={{fontSize:10,color:"#f44",fontFamily:"'Barlow',sans-serif",marginTop:5}}>{player.injury}</div>
                  </div>
                );
                if(!a) return null;
                const cc = a.conf>=75?"#4caf50":a.conf>=60?"#f5a623":"#f44336";
                const vals = player.stats.map(s=>s[prop]||0);
                const mx = Math.max(...vals,a.line,1);
                return (
                  <div key={name} className={`card ${isOpen?"open":""}`} style={{borderLeft:`3px solid ${teamC}44`}} onClick={()=>setExpanded(isOpen?null:name)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                      <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:800,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div><div style={{fontSize:9,color:"#555",fontFamily:"'Barlow',sans-serif",marginTop:1}}><span style={{color:teamC,fontWeight:700}}>{player.team}</span> · {player.pos} · vs {player.opp}</div></div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
                        <div style={{display:"flex",gap:5,alignItems:"center"}}><span style={{fontSize:9,color:"#555",fontFamily:"'Barlow',sans-serif"}}>{a.line}</span><span className={a.rec==="HIGHER"?"HI":a.rec==="LOWER"?"LO":"LN"}>{a.rec}</span></div>
                        <div style={{fontSize:9,color:"#444"}}>{a.str}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10,marginTop:10}}>
                      {[["Avg",a.avg,parseFloat(a.avg)>a.line?"#4caf50":"#f44336"],["Hit%",`${a.hitPct}%`,cc],["Edge",`${parseFloat(a.edge)>0?"+":""}${a.edge}`,parseFloat(a.edge)>0?"#4caf50":"#f44336"]].map(([l,v,c])=>(
                        <div key={l}><div className="lbl">{l}</div><div style={{fontSize:18,fontWeight:800,color:c,lineHeight:1}}>{v}</div></div>
                      ))}
                      <div style={{flex:1,minWidth:50}}><div className="lbl">Conf {a.conf}%</div><div className="cb" style={{marginTop:6}}><div className="cf" style={{width:`${a.conf}%`,background:cc}}/></div></div>
                    </div>
                    {isOpen && (
                      <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #141e30"}}>
                        <div className="lbl">Last 5 Games</div>
                        <div style={{display:"flex",alignItems:"flex-end",gap:3,height:42,marginBottom:3}}>
                          {vals.map((v,i)=>{const h=Math.max(4,(v/mx)*36);return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><div style={{width:"100%",maxWidth:34,height:h,background:v>a.line?"#4caf50":"#f44336",borderRadius:"2px 2px 0 0",opacity:.85}}/><div style={{fontSize:9,color:"#444",fontFamily:"'Barlow',sans-serif"}}>{v}</div></div>);})}
                          <div style={{width:1,background:"#f5a62377",height:Math.max(4,(a.line/mx)*36)+12,marginLeft:2}}/>
                          <div style={{fontSize:9,color:"#f5a623",fontFamily:"'Barlow',sans-serif",alignSelf:"flex-end",marginBottom:12,marginLeft:1}}>←{a.line}</div>
                        </div>
                        <div style={{fontSize:10,color:"#667",fontFamily:"'Barlow',sans-serif",lineHeight:1.6,margin:"5px 0 8px"}}>💡 {player.ctx}</div>
                        <button className="add" onClick={e=>{e.stopPropagation();addParlay(name,`${prop.toUpperCase()} ${a.rec} ${a.line}`,a.rec);}}>+ Add to My Slip</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:14,padding:14,background:"#0b0e1a",border:"1px solid #141e30",borderRadius:9}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:10}}>
                <div><div style={{fontSize:16,fontWeight:800}}>🤖 AI SHARP ANALYSIS</div><div style={{fontSize:9,color:"#333",fontFamily:"'Barlow',sans-serif"}}>Injury-adjusted · Updated May 8 box scores · All 8 teams</div></div>
                <button className="AI" onClick={fetchAI} disabled={aiLoading}>{aiLoading?<span className="pulse">ANALYZING...</span>:"GET AI EDGE"}</button>
              </div>
              {aiLoading&&<div style={{color:"#f5a623",fontFamily:"'Barlow',sans-serif",fontSize:11}} className="pulse">Analyzing today's slate...</div>}
              {ai&&!aiLoading&&<div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,lineHeight:1.8,color:"#bbb",whiteSpace:"pre-wrap"}}>{ai}</div>}
              {!ai&&!aiLoading&&<div style={{color:"#222",fontFamily:"'Barlow',sans-serif",fontSize:11}}>Filter by team & prop type, then click GET AI EDGE.</div>}
            </div>
          </>
        )}

        {/* ── GAMES TAB ── */}
        {tab==="games" && (
          <div style={{display:"grid",gap:12}}>
            {Object.entries(GAME_LINES).map(([id,g])=>(
              <div key={id} style={{background:"#0e1422",border:"1px solid #18213a",borderRadius:9,padding:14}}>
                <div style={{fontSize:17,fontWeight:800,marginBottom:3}}>{g.label}</div>
                <div style={{fontSize:11,color:"#f5a623",fontFamily:"'Barlow',sans-serif",marginBottom:10}}>📌 {g.note}</div>
                <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:10}}>
                  {[["Spread",g.spread],["Total",`O/U ${g.total}`]].map(([l,v])=>(<div key={l}><div className="lbl">{l}</div><div style={{fontSize:18,fontWeight:800}}>{v}</div></div>))}
                  {Object.entries(g.ml).map(([t,ml])=>(<div key={t}><div className="lbl">{t} ML</div><div style={{fontSize:18,fontWeight:800,color:ml>0?"#4caf50":"#f44336"}}>{ml>0?"+":""}{ml}</div></div>))}
                  {Object.entries(g.wp).map(([t,wp])=>(<div key={t}><div className="lbl">{t} Win%</div><div style={{fontSize:18,fontWeight:800,color:wp>55?"#4caf50":wp>45?"#f5a623":"#f44336"}}>{wp}%</div></div>))}
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {Object.entries(g.ml).map(([t,ml])=>(<button key={t} className="add" onClick={()=>addParlay(t,`ML ${ml>0?"+":""}${ml}`,ml<0?"FAVORITE":"UNDERDOG")}>+ {t} ML to Slip</button>))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PARLAY SLIP ── */}
        {tab==="parlay" && (
          <div>
            <div style={{padding:14,background:"#0b0e1a",border:"1px solid #141e30",borderRadius:9,marginBottom:12}}>
              <div style={{fontSize:19,fontWeight:800,marginBottom:12}}>🎲 MY PARLAY SLIP</div>
              {parlay.length===0?(
                <div style={{color:"#222",fontFamily:"'Barlow',sans-serif",textAlign:"center",padding:"28px 0"}}>
                  No legs yet.<br/><span style={{color:"#444"}}>Go to 🏆 Top 5 Parlays → "Add All Legs", or expand any player card in 📊 Props.</span>
                </div>
              ):(
                <>
                  {parlay.map(p=>(<div key={p.k} className="pi"><div><div style={{fontSize:14,fontWeight:700}}>{p.name}</div><div style={{fontSize:11,color:"#555",fontFamily:"'Barlow',sans-serif"}}>{p.leg}</div></div><div style={{display:"flex",alignItems:"center",gap:8}}><span className={p.rec==="HIGHER"||p.rec==="FAVORITE"?"HI":p.rec==="LEAN HIGHER"?"LN":"LO"}>{p.rec}</span><button className="rx" onClick={()=>rmParlay(p.k)}>×</button></div></div>))}
                  <div style={{marginTop:12,background:"#0f1525",borderRadius:7,padding:12}}>
                    <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:10}}>
                      <div><div className="lbl">Legs</div><div style={{fontSize:22,fontWeight:800,color:"#f5a623"}}>{parlay.length}</div></div>
                      <div><div className="lbl">Est. Payout</div><div style={{fontSize:22,fontWeight:800}}>+{Math.round((Math.pow(1.9,parlay.length)-1)*100)}</div></div>
                    </div>
                    <button className="AI" style={{width:"100%"}} onClick={fetchAI} disabled={aiLoading}>{aiLoading?<span className="pulse">VALIDATING...</span>:"🤖 VALIDATE WITH AI"}</button>
                  </div>
                  {ai&&!aiLoading&&<div style={{marginTop:10,fontFamily:"'Barlow',sans-serif",fontSize:13,lineHeight:1.8,color:"#bbb",whiteSpace:"pre-wrap"}}>{ai}</div>}
                </>
              )}
            </div>
            <div style={{padding:14,background:"#0b0e1a",border:"1px solid #141e30",borderRadius:9}}>
              <div style={{fontSize:15,fontWeight:800,marginBottom:8}}>💡 MAY 8 SHARP TIPS</div>
              {["SGA scored only 18 conservative pts in G1 W — HUGE bounce-back HIGHER pts expected in G2 at home","Keldon Johnson had 10 reb in G2 — his reb line (5.5) is massively underpriced for G3","PHI @ home G3 = Maxey, PG, Oubre all get usage boost. Stack them HIGHER","Hartenstein double-double every game — safest reb OVER on the board vs undersized LAL","Castle back-to-back 18+/21 pts games — pts line (17.5) is undervalued after blowout G2","Flex Entry: 3-leg Underdog entry — partial payout if 1 leg misses. Best for today's correlated PHI usage stack"].map((t,i)=>(<div key={i} style={{display:"flex",gap:8,marginBottom:6,fontFamily:"'Barlow',sans-serif",fontSize:11,color:"#666",lineHeight:1.5}}><span style={{color:"#f5a623",fontWeight:700,minWidth:12}}>{i+1}.</span><span>{t}</span></div>))}
            </div>
          </div>
        )}

        <div style={{marginTop:18,textAlign:"center",fontSize:9,color:"#14141e",fontFamily:"'Barlow',sans-serif",lineHeight:2}}>
          ⚠️ FOR ENTERTAINMENT PURPOSES ONLY · NOT FINANCIAL ADVICE · GAMBLE RESPONSIBLY<br/>
          Lines: Underdog Fantasy · DraftKings · FanDuel · BetMGM · Box scores: SportRadar · Analysis: SI.com, CBS SportsLine, FOX Sports, BettingPros
        </div>
      </div>
    </div>
  );
}
